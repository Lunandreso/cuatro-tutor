/* Console runner for the self-check suite.
   Usage:  cscript //Nologo tests\run-checks.js
   Windows Script Host only provides ES3, so this file polyfills the ES5 array
   helpers before loading the engine and data files. */

/* ---- ES5 polyfills for JScript ---------------------------------------- */
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fn, scope) {
    for (var i = 0; i < this.length; i++) fn.call(scope, this[i], i, this);
  };
}
if (!Array.prototype.map) {
  Array.prototype.map = function (fn, scope) {
    var out = [];
    for (var i = 0; i < this.length; i++) out.push(fn.call(scope, this[i], i, this));
    return out;
  };
}
if (!Array.prototype.filter) {
  Array.prototype.filter = function (fn, scope) {
    var out = [];
    for (var i = 0; i < this.length; i++) if (fn.call(scope, this[i], i, this)) out.push(this[i]);
    return out;
  };
}
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (fn, init) {
    var acc = init, i = 0;
    if (arguments.length < 2) { acc = this[0]; i = 1; }
    for (; i < this.length; i++) acc = fn(acc, this[i], i, this);
    return acc;
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (needle) {
    for (var i = 0; i < this.length; i++) if (this[i] === needle) return i;
    return -1;
  };
}
if (!String.prototype.trim) {
  String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
}
if (!Object.keys) {
  Object.keys = function (o) {
    var out = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) out.push(k);
    return out;
  };
}

/* ---- tiny harness ------------------------------------------------------ */
var window = this;
var fso = new ActiveXObject('Scripting.FileSystemObject');
var here = fso.GetParentFolderName(WScript.ScriptFullName);
var root = fso.GetParentFolderName(here);

function read(rel) {
  var f = fso.OpenTextFile(fso.BuildPath(root, rel), 1);
  var t = f.ReadAll();
  f.Close();
  return t;
}
function load(rel) { eval.call(null, read(rel)); }

function out(s) { WScript.Echo(s); }
function strip(s) {
  return String(s).replace(/&rarr;/g, '->').replace(/&mdash;/g, '--')
    .replace(/&amp;/g, '&').replace(/\u2713/g, 'OK').replace(/<[^>]+>/g, '');
}
function pad(s, n) {
  s = String(s);
  while (s.length < n) s += ' ';
  return s;
}

load('js\\music.js');
load('js\\data\\lessons.js');
load('js\\data\\songs.js');

var Music = window.Music, CURRICULUM = window.CURRICULUM, SONGBOOK = window.SONGBOOK;

var errors = [], warnings = [];
function err(m) { errors.push(strip(m)); }
function warn(m) { warnings.push(strip(m)); }

/* ---- tuning ------------------------------------------------------------ */
out('');
out('== Tuning ==');
var expected = { 1: ['G4', 67], 2: ['D4', 62], 3: ['A3', 57], 4: ['E3', 52], 5: ['B2', 47] };
Music.COURSES.forEach(function (c) {
  var e = expected[c.course], got = Music.midiToName(c.midi);
  if (c.midi !== e[1] || got !== e[0]) err('course ' + c.course + ' expected ' + e[0] + ', got ' + got);
});
for (var i = 1; i < Music.COURSES.length; i++) {
  var d = Music.COURSES[i - 1].midi - Music.COURSES[i].midi;
  if (d !== 5) err('courses ' + Music.COURSES[i].course + '->' + Music.COURSES[i - 1].course + ' are ' + d + ' semitones apart, expected 5');
}
var tun = [];
for (var k = Music.COURSES.length - 1; k >= 0; k--) tun.push(Music.midiToName(Music.COURSES[k].midi));
out('  low -> high: ' + tun.join('  '));

/* ---- melody checker ---------------------------------------------------- */
function checkMelody(label, melodyText, beats, chords) {
  var raw = String(melodyText).trim().split(/\s+/).filter(function (t) { return t && t !== '|'; });
  var notes = Music.parseMelody(melodyText);
  if (notes.length !== raw.length) err(label + ': ' + raw.length + ' tokens produced ' + notes.length + ' notes');
  var total = 0;
  notes.forEach(function (n) {
    total += n.dur;
    if (!isFinite(n.dur) || n.dur <= 0) err(label + ': bad duration');
    if (n.rest) return;
    if (n.midi < 47) err(label + ': ' + n.name + ' is below the cuatro range (B2)');
    if (n.fret < 0 || n.fret > Music.MAX_FRET) err(label + ': ' + n.name + ' maps to fret ' + n.fret);
    if (Music.COURSES[n.courseIndex].midi + n.fret !== n.midi) err(label + ': ' + n.name + ' tab position does not match pitch');
    if (n.fret > 12) warn(label + ': ' + n.name + ' needs fret ' + n.fret);
  });
  var measures = Music.toMeasures(notes, beats);
  var exact = total / beats;
  if (Math.abs(exact - Math.round(exact)) > 1e-6) warn(label + ': ' + total + ' beats is not a whole number of ' + beats + '-beat bars');
  if (chords && chords.length !== measures.length) err(label + ': ' + measures.length + ' bars but ' + chords.length + ' chord symbols');
  return measures.length;
}

/* ---- lessons ----------------------------------------------------------- */
out('');
out('== Lessons ==');
if (CURRICULUM.lessons.length !== 30) err('expected 30 lessons, found ' + CURRICULUM.lessons.length);
var levelCount = {}, exerciseCount = 0;
CURRICULUM.lessons.forEach(function (l, idx) {
  levelCount[l.level] = (levelCount[l.level] || 0) + 1;
  if (l.n !== idx + 1) err('lesson at index ' + idx + ' numbered ' + l.n);
  ['title', 'goal', 'checkpoint', 'level'].forEach(function (f) {
    if (!l[f]) err('lesson ' + l.n + ' missing "' + f + '"');
  });
  if (!l.theory || !l.theory.length) err('lesson ' + l.n + ' has no theory');
  (l.chordFocus || []).forEach(function (sym) {
    if (!Music.parseChordSymbol(sym)) err('lesson ' + l.n + ': unparseable chord "' + sym + '"');
    else if (!Music.chordVoicings(sym, 1).length) err('lesson ' + l.n + ': no playable voicing for ' + sym);
  });
  (l.exercises || []).forEach(function (ex) {
    exerciseCount++;
    var label = 'lesson ' + l.n + ' / ' + strip(ex.title);
    if (ex.type === 'progression') {
      if (!ex.chords || !ex.chords.length) err(label + ': empty progression');
      ex.chords.forEach(function (sym) {
        if (!Music.chordVoicings(sym, 1).length) err(label + ': no voicing for ' + sym);
      });
    } else {
      checkMelody(label, ex.melody, ex.beats || 4, ex.chords);
    }
  });
});
Object.keys(levelCount).forEach(function (k) { out('  ' + pad(k, 14) + levelCount[k] + ' lessons'); });
out('  ' + pad('exercises', 14) + exerciseCount);

/* ---- songs ------------------------------------------------------------- */
out('');
out('== Songbook ==');
out('  ' + pad('TITLE', 26) + pad('KEY / TONO', 28) + pad('METER', 6) + pad('TEMPO', 8) + pad('BARS', 16) + 'LEVEL');
SONGBOOK.forEach(function (s) {
  ['title', 'key', 'meter', 'tempo', 'style', 'cycle'].forEach(function (f) {
    if (!s[f]) err(strip(s.title) + ': missing "' + f + '"');
  });
  var totalBars = 0;
  s.sections.forEach(function (sec) {
    var bars = checkMelody(strip(s.title) + ' / ' + sec.name, sec.melody, s.beats, sec.chords);
    totalBars += bars;
    (sec.chords || []).forEach(function (sym) {
      if (!Music.chordVoicings(sym, 1).length) err(strip(s.title) + ': no voicing for ' + sym);
    });
  });
  var secs = s.sections.length > 1 ? ' (' + s.sections.length + ' sections)' : '';
  out('  ' + pad(strip(s.title), 26) + pad(strip(s.key), 28) + pad(s.meter, 6) +
      pad(s.tempo + 'bpm', 8) + pad(totalBars + secs, 16) + s.difficulty);
});

/* ---- chords ------------------------------------------------------------ */
out('');
out('== Generated chord voicings (frets, course 1->5) ==');
var testChords = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Am', 'Em', 'Dm', 'Gm', 'Bm', 'F#m',
  'G7', 'D7', 'A7', 'E7', 'C7', 'Am7', 'Dm7', 'Cmaj7', 'Bdim', 'Dsus4', 'C6', 'Bm7b5'];
testChords.forEach(function (sym) {
  var vs = Music.chordVoicings(sym, 2);
  if (!vs.length) { err('no playable voicing for ' + sym); return; }
  var parsed = Music.parseChordSymbol(sym);
  var want = parsed.def.intervals.map(function (iv) { return (parsed.rootPc + iv) % 12; });
  vs.forEach(function (v) {
    var pcs = [];
    v.frets.forEach(function (f, idx) {
      if (f === -1) return;
      var pc = (Music.COURSES[idx].midi + f) % 12;
      pcs.push(pc);
      if (want.indexOf(pc) === -1) err(sym + ': voicing [' + v.frets.join(',') + '] contains ' + Music.midiToPitchClassName(pc) + ', not a chord tone');
    });
    if (pcs.indexOf(parsed.rootPc) === -1) err(sym + ': voicing [' + v.frets.join(',') + '] has no root');
    var third = (parsed.rootPc + parsed.def.intervals[1]) % 12;
    if (pcs.indexOf(third) === -1) err(sym + ': voicing [' + v.frets.join(',') + '] missing defining 3rd/4th');
    if (v.span > 3) err(sym + ': span of ' + v.span + ' frets is unplayable');
  });
  var shape = vs[0].frets.map(function (f) { return f === -1 ? 'x' : f; }).join('-');
  var pitches = Music.voicingMidis(vs[0].frets).map(function (m) { return Music.midiToName(m); }).join(' ');
  out('  ' + pad(sym, 9) + pad(shape, 12) + pitches);
});

/* ---- scales ------------------------------------------------------------ */
out('');
out('== Scales & fingering ==');
function nameSeq(root, form) {
  return Music.scaleNotes(Music.noteToMidi(root), form, 1).map(function (m) { return Music.midiToName(m); }).join(' ');
}
var gMaj = nameSeq('G3', 'major');
if (gMaj !== 'G3 A3 B3 C4 D4 E4 F#4 G4') err('G major scale wrong: ' + gMaj);
out('  G major:          ' + gMaj);
var aHarm = nameSeq('A3', 'harmonicMinor');
if (aHarm !== 'A3 B3 C4 D4 E4 F4 G#4 A4') err('A harmonic minor wrong: ' + aHarm);
out('  A harmonic minor: ' + aHarm);
var fam = Music.diatonicChords('G', 'major').map(function (c) { return c.symbol; }).join(' ');
if (fam !== 'G Am Bm C D Em F#dim') err('G major chord family wrong: ' + fam);
out('  G major family:   ' + fam);

var sample = Music.parseMelody('G3:1 A3:1 B3:1 C4:1 D4:1 E4:1 F#4:1 G4:1');
var fing = sample.map(function (n) { return 'c' + n.course + 'f' + n.fret; }).join(' ');
if (fing !== 'c4f3 c3f0 c3f2 c3f3 c2f0 c2f2 c2f4 c1f0') err('first-position G fingering changed: ' + fing);
out('  1st-pos G fingering: ' + fing);

/* ---- report ------------------------------------------------------------ */
out('');
if (errors.length) {
  out('ERRORS (' + errors.length + '):');
  errors.forEach(function (e) { out('  X ' + e); });
}
if (warnings.length) {
  out('WARNINGS (' + warnings.length + '):');
  warnings.forEach(function (w) { out('  ! ' + w); });
}
out('');
out((errors.length ? 'FAILED' : 'PASSED') + ' - ' + errors.length + ' error(s), ' + warnings.length + ' warning(s)');
WScript.Quit(errors.length ? 1 : 0);
