/* Cuatro Tutor - audio engine.
   Karplus-Strong style plucked string so melodies and chords sound close to a
   steel-string cuatro. No samples needed, everything is synthesized. */
(function (global) {
  'use strict';

  var ctx = null;
  var master = null;
  var stringCache = {};
  var voices = [];

  function ensure() {
    if (!ctx) {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      var comp = ctx.createDynamicsCompressor();
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* ---- plucked string, rendered offline ------------------------------
     A Karplus-Strong string is a delay line of 1/freq seconds with a damping
     filter in its feedback path. It cannot be built from Web Audio nodes:
     a DelayNode inside a feedback loop is clamped to a minimum of one render
     quantum (128 samples, ~2.9ms), so every pitch above ~344Hz - i.e. most of
     the cuatro - would collapse to the same resonant buzz. Rendering the
     string sample-by-sample into an AudioBuffer avoids that entirely, and the
     result is cached per pitch so it is only computed once. */
  function renderSamples(freq, sampleRate) {
    var seconds = Math.max(1.0, Math.min(3.6, 4.4 - freq / 200));
    var n = Math.floor(seconds * sampleRate);
    var out = new Float32Array(n);

    var damp = Math.min(0.88, 0.40 + freq / 3600);

    /* The damping filter sits inside the loop, so its own phase delay is part
       of the pitch. For y[n] = y[n-1] + damp*(x[n]-y[n-1]) that delay is
       atan2(b sin w, 1 - b cos w)/w with b = 1-damp. Subtract it, or every
       note comes out flat - increasingly so as the pitch rises. */
    var w = 2 * Math.PI * freq / sampleRate;
    var bq = 1 - damp;
    var filterDelay = Math.atan2(bq * Math.sin(w), 1 - bq * Math.cos(w)) / w;

    var delaySamples = Math.max(2, sampleRate / freq - filterDelay);
    var N = Math.floor(delaySamples);
    var frac = delaySamples - N;
    /* Buffer of N+1: reading at idx is a delay of N+1 samples, reading at
       idx+1 is a delay of N. Interpolating between them gives exactly N+frac. */
    var len = N + 1;
    var buf = new Float32Array(len);

    /* excitation: lowpassed noise, i.e. the pick */
    var lp = 0, i;
    for (i = 0; i < len; i++) {
      lp += 0.55 * ((Math.random() * 2 - 1) - lp);
      buf[i] = lp;
    }

    /* pick-position comb: plucking away from the centre thins the fundamental */
    var pick = Math.max(1, Math.floor(len * 0.22));
    var copy = new Float32Array(buf);
    for (i = 0; i < len; i++) buf[i] = copy[i] - copy[(i + pick) % len] * 0.6;

    /* strip DC so the note starts cleanly instead of thumping */
    var mean = 0;
    for (i = 0; i < len; i++) mean += buf[i];
    mean /= len;
    for (i = 0; i < len; i++) buf[i] -= mean;

    var decay = Math.pow(0.0008, 1 / n);
    var idx = 0, last = 0, peak = 0;

    for (i = 0; i < n; i++) {
      var older = buf[idx];               // delay of N+1 samples
      var newer = buf[(idx + 1) % len];   // delay of N samples
      var val = newer + (older - newer) * frac;  // => delay of N+frac
      last += damp * (val - last);        // damping filter = string losses
      var y = last * decay;
      buf[idx] = y;
      idx = (idx + 1) % len;
      out[i] = y;
      var abs = y < 0 ? -y : y;
      if (abs > peak) peak = abs;
    }

    if (peak > 0) {
      var g = 0.9 / peak;
      for (i = 0; i < n; i++) out[i] *= g;
    }
    var fin = Math.min(32, n);
    for (i = 0; i < fin; i++) out[i] *= i / fin;
    var fout = Math.min(1500, n);
    for (i = 0; i < fout; i++) out[n - 1 - i] *= i / fout;

    return out;
  }

  function renderString(freq, sampleRate) {
    var samples = renderSamples(freq, sampleRate);
    var ab = ctx.createBuffer(1, samples.length, sampleRate);
    ab.getChannelData(0).set(samples);
    return ab;
  }

  function stringBuffer(midi) {
    var key = Math.round(midi * 2) / 2;
    if (!stringCache[key]) stringCache[key] = renderString(Music.midiToFreq(key), ctx.sampleRate);
    return stringCache[key];
  }

  function courseMidi(courseIndex, fret) {
    var c = Music.COURSES[courseIndex];
    return c ? c.midi + fret : null;
  }

  /* Render every pitch a passage needs up front. Rendering is fast but not
     free, and doing it lazily mid-schedule would push the opening notes into
     the past and bunch them together. */
  function prewarm(notes) {
    if (!ctx) return;
    notes.forEach(function (n) {
      if (!n || n.rest) return;
      if (typeof n.courseIndex === 'number') {
        var m = courseMidi(n.courseIndex, n.fret);
        if (m == null) return;
        stringBuffer(m);
        if (Music.COURSES[n.courseIndex].octavePair) stringBuffer(m + 12);
      } else if (typeof n.midi === 'number') {
        stringBuffer(n.midi);
      }
    });
  }

  function prewarmVoicings(voicings) {
    if (!ctx) return;
    voicings.forEach(function (v) {
      if (!v) return;
      for (var ci = 0; ci < 5; ci++) {
        if (v.frets[ci] === -1) continue;
        var m = courseMidi(ci, v.frets[ci]);
        if (m == null) continue;
        stringBuffer(m);
        if (Music.COURSES[ci].octavePair) stringBuffer(m + 12);
      }
    });
  }

  /* One plucked string voice. */
  function pluck(midi, when, dur, gainValue) {
    if (!ensure()) return;
    /* fetch (and possibly render) the buffer before fixing the start time,
       so rendering cost can never push the note into the past */
    var buffer = stringBuffer(midi);
    var t = (when == null || !isFinite(when)) ? ctx.currentTime + 0.03 : when;
    dur = dur || 1;

    var src = ctx.createBufferSource();
    src.buffer = buffer;

    var body = ctx.createBiquadFilter();
    body.type = 'peaking';
    body.frequency.value = 420;
    body.Q.value = 0.9;
    body.gain.value = 3.5;

    var out = ctx.createGain();
    var level = gainValue == null ? 0.25 : gainValue;
    out.gain.setValueAtTime(level, t);

    src.connect(body);
    body.connect(out);
    out.connect(master);

    /* let it ring past its written length, then damp so runs don't turn to mud */
    var ring = Math.min(Math.max(dur + 0.9, 0.6), src.buffer.duration);
    out.gain.setValueAtTime(level, t + ring * 0.65);
    out.gain.setTargetAtTime(0.0001, t + ring * 0.65, Math.max(0.07, ring * 0.22));

    src.start(t);
    src.stop(t + src.buffer.duration);

    var voice = { src: src, gain: out };
    voices.push(voice);
    src.onended = function () {
      var k = voices.indexOf(voice);
      if (k !== -1) voices.splice(k, 1);
      try { src.disconnect(); body.disconnect(); out.disconnect(); } catch (e) {}
    };
  }

  /* Cut every sounding and scheduled note, with a short fade so Stop doesn't click. */
  function silence() {
    if (!ctx) return;
    var now = ctx.currentTime;
    voices.slice().forEach(function (v) {
      try {
        v.gain.gain.cancelScheduledValues(now);
        v.gain.gain.setValueAtTime(v.gain.gain.value, now);
        v.gain.gain.linearRampToValueAtTime(0.0001, now + 0.04);
        v.src.stop(now + 0.05);
      } catch (e) {}
    });
    voices.length = 0;
  }

  /* Play a single course: doubled strings, octave pair on courses 4 & 5 */
  function playCourse(courseIndex, fret, when, dur, gain) {
    if (!ensure()) return;
    var c = Music.COURSES[courseIndex];
    if (!c) return;
    var t = (when == null || !isFinite(when)) ? ctx.currentTime + 0.02 : when;
    var midi = c.midi + fret;
    pluck(midi, t, dur, gain);
    pluck(midi, t + 0.006, dur, (gain || 0.25) * 0.7); // the doubled string
    if (c.octavePair) pluck(midi + 12, t + 0.004, dur, (gain || 0.25) * 0.6);
  }

  function playNoteNow(midi, dur) {
    if (!ensure()) return;
    pluck(midi, ctx.currentTime + 0.01, dur || 1, 0.3);
  }

  /* Strum a voicing: frets[0]=course1(high) .. frets[4]=course5(low) */
  function strum(frets, direction, when, gain) {
    if (!ensure()) return;
    if (when == null) prewarmVoicings([{ frets: frets }]);
    var t = (when == null ? ctx.currentTime + 0.05 : when);
    var order = [];
    for (var i = 0; i < 5; i++) order.push(i);
    if (direction !== 'up') order.reverse(); // down-strum starts at the lowest course
    var step = 0.018, k = 0;
    order.forEach(function (ci) {
      if (frets[ci] === -1) return;
      playCourse(ci, frets[ci], t + k * step, 1.6, (gain || 0.2));
      k++;
    });
  }

  /* ---- sequenced playback ------------------------------------------- */
  var transport = { timer: null, stopFns: [], playing: false };

  function stop() {
    transport.playing = false;
    if (transport.timer) { clearTimeout(transport.timer); transport.timer = null; }
    transport.stopFns.forEach(function (f) { try { f(); } catch (e) {} });
    transport.stopFns = [];
    silence();
    if (transport.onStop) { var f = transport.onStop; transport.onStop = null; f(); }
  }

  /* notes: [{rest, midi, dur, courseIndex, fret}], tempo in BPM.
     opts: onNote, onStop, gain, beatsPerBar, countIn (beats), click (bool),
           loop (bool), speedStep (bpm added per repeat), maxTempo, onPass */
  function playMelody(notes, tempo, opts) {
    opts = opts || {};
    if (!ensure()) return;
    stop();
    transport.playing = true;
    transport.onStop = opts.onStop || null;

    var timers = [];
    transport.stopFns.push(function () { timers.forEach(clearTimeout); });

    var baseTempo = tempo || 90;
    var beatsPerBar = opts.beatsPerBar || 4;
    var countIn = opts.countIn || 0;
    var withClick = !!opts.click;
    var loop = !!opts.loop;
    var speedStep = opts.speedStep || 0;
    var maxTempo = opts.maxTempo || baseTempo;
    var pass = 0;

    var totalBeats = 0;
    notes.forEach(function (n) { totalBeats += n.dur; });
    prewarm(notes);

    /* fire a UI callback at an absolute AudioContext time */
    function at(when, fn) {
      var d = (when - ctx.currentTime) * 1000;
      timers.push(setTimeout(function () { if (transport.playing) fn(); }, Math.max(0, d)));
    }

    function schedulePass(t0, passTempo) {
      var spb = 60 / passTempo;
      var t = t0;
      notes.forEach(function (n, i) {
        var dur = n.dur * spb;
        if (!n.rest) {
          if (typeof n.courseIndex === 'number') playCourse(n.courseIndex, n.fret, t, dur, opts.gain || 0.26);
          else pluck(n.midi, t, dur, opts.gain || 0.26);
        }
        if (opts.onNote) at(t, function () { opts.onNote(i); });
        t += dur;
      });
      if (withClick) {
        var nb = Math.ceil(totalBeats);
        for (var b = 0; b < nb; b++) click(b % beatsPerBar === 0, t0 + b * spb);
      }
      return t0 + totalBeats * spb;
    }

    function runPass(startAt) {
      var passTempo = speedStep > 0 ? Math.min(maxTempo, baseTempo + speedStep * pass) : baseTempo;
      pass++;
      if (opts.onPass) {
        (function (p, tp) { at(startAt, function () { opts.onPass(p, tp); }); })(pass, passTempo);
      }
      var end = schedulePass(startAt, passTempo);
      if (loop) {
        /* re-arm shortly before this pass ends so playback stays seamless */
        timers.push(setTimeout(function () {
          if (!transport.playing) return;
          runPass(Math.max(ctx.currentTime + 0.05, end));
        }, Math.max(0, (end - ctx.currentTime) * 1000 - 300)));
      } else {
        /* generous tail so the final note is allowed to ring out */
        transport.timer = setTimeout(function () { stop(); }, (end - ctx.currentTime) * 1000 + 1200);
      }
    }

    var startAt = ctx.currentTime + 0.25;
    if (countIn > 0) {
      var cspb = 60 / baseTempo;
      for (var ci = 0; ci < countIn; ci++) {
        click(ci % beatsPerBar === 0, startAt + ci * cspb);
        if (opts.onCount) {
          (function (k) { at(startAt + k * cspb, function () { opts.onCount(countIn - k); }); })(ci);
        }
      }
      startAt += countIn * cspb;
      if (opts.onCount) at(startAt, function () { opts.onCount(0); });
    }
    runPass(startAt);
  }

  /* Play a chord progression as strummed bars.
     opts: onBar, onStop, onCount, countIn (beats), click, loop */
  function playProgression(symbols, tempo, beatsPerBar, opts) {
    opts = opts || {};
    if (!ensure()) return;
    stop();
    transport.playing = true;
    transport.onStop = opts.onStop || null;

    var timers = [];
    transport.stopFns.push(function () { timers.forEach(clearTimeout); });

    var spb = 60 / (tempo || 90);
    var withClick = !!opts.click;
    var countIn = opts.countIn || 0;
    var loop = !!opts.loop;

    /* pre-resolve voicings once so looping doesn't re-search every pass */
    var voicings = symbols.map(function (sym) { return Music.chordVoicings(sym, 1)[0] || null; });
    prewarmVoicings(voicings);

    function at(when, fn) {
      var d = (when - ctx.currentTime) * 1000;
      timers.push(setTimeout(function () { if (transport.playing) fn(); }, Math.max(0, d)));
    }

    function schedulePass(t0) {
      var t = t0;
      voicings.forEach(function (v, bar) {
        if (v) {
          for (var b = 0; b < beatsPerBar; b++) {
            strum(v.frets, b % 2 === 0 ? 'down' : 'up', t + b * spb, b % 2 === 0 ? 0.2 : 0.13);
            if (withClick) click(b === 0, t + b * spb);
          }
        }
        if (opts.onBar) (function (i) { at(t, function () { opts.onBar(i); }); })(bar);
        t += beatsPerBar * spb;
      });
      return t;
    }

    function runPass(startAt) {
      var end = schedulePass(startAt);
      if (loop) {
        timers.push(setTimeout(function () {
          if (!transport.playing) return;
          runPass(Math.max(ctx.currentTime + 0.05, end));
        }, Math.max(0, (end - ctx.currentTime) * 1000 - 300)));
      } else {
        transport.timer = setTimeout(stop, (end - ctx.currentTime) * 1000 + 1200);
      }
    }

    var startAt = ctx.currentTime + 0.25;
    if (countIn > 0) {
      for (var ci = 0; ci < countIn; ci++) {
        click(ci % beatsPerBar === 0, startAt + ci * spb);
        if (opts.onCount) {
          (function (k) { at(startAt + k * spb, function () { opts.onCount(countIn - k); }); })(ci);
        }
      }
      startAt += countIn * spb;
      if (opts.onCount) at(startAt, function () { opts.onCount(0); });
    }
    runPass(startAt);
  }

  /* ---- metronome ------------------------------------------------------ */
  var metro = { on: false, id: null, beat: 0 };

  function click(accent, when) {
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.frequency.value = accent ? 1600 : 1000;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.18, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
    osc.connect(g); g.connect(master);
    osc.start(when); osc.stop(when + 0.08);
  }

  function startMetronome(tempo, beatsPerBar, onBeat) {
    if (!ensure()) return;
    stopMetronome();
    metro.on = true;
    metro.beat = 0;
    var spb = 60 / tempo;
    var next = ctx.currentTime + 0.1;
    metro.id = setInterval(function () {
      if (!metro.on) return;
      while (next < ctx.currentTime + 0.2) {
        var accent = metro.beat % beatsPerBar === 0;
        click(accent, next);
        if (onBeat) {
          var b = metro.beat % beatsPerBar;
          setTimeout(function () { onBeat(b); }, Math.max(0, (next - ctx.currentTime) * 1000));
        }
        metro.beat++;
        next += spb;
      }
    }, 25);
  }

  function stopMetronome() {
    metro.on = false;
    if (metro.id) { clearInterval(metro.id); metro.id = null; }
  }

  function isMetronomeOn() { return metro.on; }

  global.Audio5 = {
    ensure: ensure,
    pluck: pluck,
    playCourse: playCourse,
    playNoteNow: playNoteNow,
    strum: strum,
    playMelody: playMelody,
    playProgression: playProgression,
    stop: stop,
    startMetronome: startMetronome,
    stopMetronome: stopMetronome,
    isMetronomeOn: isMetronomeOn,
    renderSamples: renderSamples, /* exposed so tests can measure the synth's pitch */
    isPlaying: function () { return transport.playing; }
  };
})(window);
