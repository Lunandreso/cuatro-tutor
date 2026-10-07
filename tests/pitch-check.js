/* Verifies that the plucked-string synthesiser actually produces the pitch it
   is asked for. This exists because the original Web Audio implementation put a
   DelayNode inside a feedback loop, where the delay is clamped to a minimum of
   128 samples - so every note above ~344Hz came out as the same buzz.
   Run with:  cscript //Nologo tests\pitch-check.js                            */

/* ---- ES3 polyfills (Windows Script Host is JScript 5.8) ----------------- */
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fn) { for (var i = 0; i < this.length; i++) fn(this[i], i, this); };
}
if (!Array.prototype.map) {
  Array.prototype.map = function (fn) { var r = []; for (var i = 0; i < this.length; i++) r.push(fn(this[i], i, this)); return r; };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (v) { for (var i = 0; i < this.length; i++) if (this[i] === v) return i; return -1; };
}
if (!String.prototype.trim) {
  String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
}
if (typeof Float32Array === 'undefined') {
  Float32Array = function (arg) {
    var a = [], i;
    if (typeof arg === 'number') { for (i = 0; i < arg; i++) a[i] = 0; }
    else { for (i = 0; i < arg.length; i++) a[i] = arg[i]; }
    a.set = function (src) { for (var k = 0; k < src.length; k++) this[k] = src[k]; };
    return a;
  };
}

var fso = new ActiveXObject('Scripting.FileSystemObject');
var window = this;
function load(f) { eval.call(null, fso.OpenTextFile(f, 1).ReadAll()); }
load('js\\music.js');
load('js\\audio.js');

var Music = window.Music, Audio5 = window.Audio5;

var errors = 0;
function out(s) { WScript.Echo(s); }
function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }

/* ---- pitch detection via normalised autocorrelation --------------------- */
function detectFreq(samples, sampleRate, lo, hi) {
  var start = 3000;                       /* skip the pick transient */
  var win = 4096;
  if (start + win * 2 > samples.length) { start = 0; win = Math.floor(samples.length / 3); }

  var minLag = Math.floor(sampleRate / hi);
  var maxLag = Math.ceil(sampleRate / lo);

  var best = -1, bestLag = -1, corrs = [], i, lag;
  for (lag = minLag; lag <= maxLag; lag++) {
    var num = 0, d1 = 0, d2 = 0;
    for (i = 0; i < win; i++) {
      var a = samples[start + i], b = samples[start + i + lag];
      num += a * b; d1 += a * a; d2 += b * b;
    }
    var c = (d1 > 0 && d2 > 0) ? num / Math.sqrt(d1 * d2) : 0;
    corrs[lag] = c;
    if (c > best) { best = c; bestLag = lag; }
  }
  /* prefer the shortest lag that is almost as good, to dodge octave errors */
  for (lag = minLag; lag <= maxLag; lag++) {
    if (corrs[lag] >= best * 0.92) { bestLag = lag; break; }
  }
  /* parabolic interpolation around the peak for sub-sample accuracy */
  var refined = bestLag;
  if (bestLag > minLag && bestLag < maxLag) {
    var y0 = corrs[bestLag - 1], y1 = corrs[bestLag], y2 = corrs[bestLag + 1];
    var denom = 2 * (2 * y1 - y0 - y2);
    if (denom !== 0) refined = bestLag + (y2 - y0) / denom;
  }
  return { freq: sampleRate / refined, confidence: best };
}

function centsOff(got, want) {
  return 1200 * Math.log(got / want) / Math.log(2);
}

/* ---- run ---------------------------------------------------------------- */
var SR = 44100;
var notes = ['B2', 'E3', 'A3', 'C4', 'D4', 'F#4', 'G4', 'A4', 'C5', 'E5', 'G5'];

out('Plucked-string synthesis - measured pitch vs requested');
out('');
out('  ' + pad('NOTE', 7) + pad('WANT Hz', 11) + pad('GOT Hz', 11) + pad('CENTS', 9) + pad('CONF', 8) + 'PEAK');

notes.forEach(function (name) {
  var midi = Music.noteToMidi(name);
  var want = Music.midiToFreq(midi);
  var s = Audio5.renderSamples(want, SR);

  var peak = 0;
  for (var i = 0; i < s.length; i++) { var v = s[i] < 0 ? -s[i] : s[i]; if (v > peak) peak = v; }

  var det = detectFreq(s, SR, want / 1.6, want * 1.6);
  var cents = centsOff(det.freq, want);

  out('  ' + pad(name, 7) + pad(want.toFixed(2), 11) + pad(det.freq.toFixed(2), 11) +
      pad((cents >= 0 ? '+' : '') + cents.toFixed(1), 9) +
      pad(det.confidence.toFixed(3), 8) + peak.toFixed(3));

  if (Math.abs(cents) > 12) { errors++; out('    X ' + name + ' is ' + cents.toFixed(1) + ' cents off'); }
  if (det.confidence < 0.8) { errors++; out('    X ' + name + ' is not periodic (confidence ' + det.confidence.toFixed(3) + ')'); }
  if (peak < 0.5) { errors++; out('    X ' + name + ' is too quiet (peak ' + peak.toFixed(3) + ')'); }
  if (!isFinite(peak) || peak > 1.001) { errors++; out('    X ' + name + ' clips or is non-finite (peak ' + peak + ')'); }
});

/* distinct pitches must actually be distinct - the old bug collapsed them */
var fLow = detectFreq(Audio5.renderSamples(Music.midiToFreq(Music.noteToMidi('G4')), SR), SR, 200, 700).freq;
var fHigh = detectFreq(Audio5.renderSamples(Music.midiToFreq(Music.noteToMidi('G5')), SR), SR, 400, 1400).freq;
var ratio = fHigh / fLow;
out('');
out('  G4 -> G5 ratio: ' + ratio.toFixed(4) + ' (expected 2.0000)');
if (Math.abs(ratio - 2) > 0.05) { errors++; out('    X octave relationship is wrong'); }

out('');
out(errors ? 'FAILED - ' + errors + ' error(s)' : 'PASSED - synthesiser is in tune');
WScript.Quit(errors ? 1 : 0);
