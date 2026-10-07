/* Cuatro Tutor - music engine
   Standard modern Puerto Rican cuatro: 10 strings in 5 double courses, tuned in fourths.
   Low -> high: B2/B3 (octave), E3/E4 (octave), A3/A3, D4/D4, G4/G4
   Courses are numbered like guitar strings: course 1 = highest (G4), course 5 = lowest (B2). */
(function (global) {
  'use strict';

  var NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  var NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  var PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  /* course 1 listed first (highest sounding) so it renders on the top tab line */
  var COURSES = [
    { course: 1, label: 'G', midi: 67, octavePair: false, roman: '1st' },
    { course: 2, label: 'D', midi: 62, octavePair: false, roman: '2nd' },
    { course: 3, label: 'A', midi: 57, octavePair: false, roman: '3rd' },
    { course: 4, label: 'E', midi: 52, octavePair: true, roman: '4th' },
    { course: 5, label: 'B', midi: 47, octavePair: true, roman: '5th' }
  ];

  var MAX_FRET = 17;

  function midiToName(midi, useFlats) {
    var names = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
    return names[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
  }

  function midiToPitchClassName(midi, useFlats) {
    var names = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
    return names[((midi % 12) + 12) % 12];
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /* "G4", "F#3", "Bb2" -> midi number */
  function noteToMidi(note) {
    var m = /^([A-Ga-g])([#b]*)(-?\d+)$/.exec(String(note).trim());
    if (!m) return null;
    var pc = PC[m[1].toUpperCase()];
    for (var i = 0; i < m[2].length; i++) pc += m[2].charAt(i) === '#' ? 1 : -1;
    return pc + (parseInt(m[3], 10) + 1) * 12;
  }

  function pitchClassOf(name) {
    var m = /^([A-Ga-g])([#b]*)$/.exec(String(name).trim());
    if (!m) return null;
    var pc = PC[m[1].toUpperCase()];
    for (var i = 0; i < m[2].length; i++) pc += m[2].charAt(i) === '#' ? 1 : -1;
    return ((pc % 12) + 12) % 12;
  }

  /* All playable (course, fret) spots for a pitch */
  function positionsFor(midi) {
    var out = [];
    for (var i = 0; i < COURSES.length; i++) {
      var fret = midi - COURSES[i].midi;
      if (fret >= 0 && fret <= MAX_FRET) out.push({ courseIndex: i, course: COURSES[i].course, fret: fret });
    }
    return out;
  }

  /* Pick a sensible spot. Default: stay low on the neck and favour the
     thinnest course that reaches the note (idiomatic for melody work). */
  function choosePosition(midi, opts) {
    opts = opts || {};
    var cands = positionsFor(midi);
    if (!cands.length) return null;
    if (opts.course) {
      for (var i = 0; i < cands.length; i++) if (cands[i].course === opts.course) return cands[i];
    }
    var prefer = typeof opts.preferFret === 'number' ? opts.preferFret : 0;
    var maxFret = typeof opts.maxFret === 'number' ? opts.maxFret : 12;
    var inRange = cands.filter(function (c) { return c.fret <= maxFret; });
    var pool = inRange.length ? inRange : cands;
    pool.sort(function (a, b) {
      var da = Math.abs(a.fret - prefer), db = Math.abs(b.fret - prefer);
      if (da !== db) return da - db;
      return a.course - b.course;
    });
    return pool[0];
  }

  /* ---- melody parsing -------------------------------------------------
     Compact text format, tokens separated by whitespace:
       G4        quarter note (1 beat)
       G4:2      2 beats
       G4:0.5    eighth note
       r:1       rest
       G4:1@3    force onto course 3
       |         optional explicit barline (ignored, measures are computed)
  --------------------------------------------------------------------- */
  function parseMelody(text, opts) {
    opts = opts || {};
    var tokens = String(text).trim().split(/\s+/);
    var notes = [];
    for (var i = 0; i < tokens.length; i++) {
      var tok = tokens[i];
      if (!tok || tok === '|') continue;
      var course = null;
      var at = tok.indexOf('@');
      if (at !== -1) { course = parseInt(tok.slice(at + 1), 10); tok = tok.slice(0, at); }
      var parts = tok.split(':');
      var dur = parts.length > 1 ? parseFloat(parts[1]) : 1;
      var head = parts[0];
      if (head === 'r' || head === 'R') {
        notes.push({ rest: true, dur: dur });
        continue;
      }
      var midi = noteToMidi(head);
      if (midi === null) continue;
      var pos = choosePosition(midi, {
        course: course,
        maxFret: opts.maxFret,
        preferFret: opts.preferFret
      });
      notes.push({
        rest: false,
        midi: midi,
        dur: dur,
        name: midiToName(midi, opts.useFlats),
        courseIndex: pos ? pos.courseIndex : 0,
        course: pos ? pos.course : 1,
        fret: pos ? pos.fret : 0
      });
    }
    return notes;
  }

  /* Group notes into measures of `beatsPerMeasure`. */
  function toMeasures(notes, beatsPerMeasure) {
    var bars = [], cur = [], acc = 0;
    for (var i = 0; i < notes.length; i++) {
      if (acc >= beatsPerMeasure - 1e-9 && cur.length) { bars.push(cur); cur = []; acc = 0; }
      cur.push(notes[i]);
      acc += notes[i].dur;
    }
    if (cur.length) bars.push(cur);
    return bars;
  }

  /* ---- scales & keys ------------------------------------------------- */
  var SCALE_FORMULAS = {
    major: [0, 2, 4, 5, 7, 9, 11],
    naturalMinor: [0, 2, 3, 5, 7, 8, 10],
    harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
    majorPentatonic: [0, 2, 4, 7, 9],
    minorPentatonic: [0, 3, 5, 7, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    blues: [0, 3, 5, 6, 7, 10]
  };

  function scaleNotes(rootMidi, formulaName, octaves) {
    var f = SCALE_FORMULAS[formulaName] || SCALE_FORMULAS.major;
    var out = [];
    octaves = octaves || 1;
    for (var o = 0; o < octaves; o++) {
      for (var i = 0; i < f.length; i++) out.push(rootMidi + f[i] + 12 * o);
    }
    out.push(rootMidi + 12 * octaves);
    return out;
  }

  function scaleToMelodyText(rootMidi, formulaName, octaves, dur, descend) {
    var ns = scaleNotes(rootMidi, formulaName, octaves);
    var seq = ns.slice();
    if (descend) seq = seq.concat(ns.slice(0, ns.length - 1).reverse());
    return seq.map(function (m) { return midiToName(m) + ':' + (dur || 1); }).join(' ');
  }

  /* ---- chords --------------------------------------------------------- */
  var CHORD_TYPES = {
    '': { name: 'major', intervals: [0, 4, 7] },
    'm': { name: 'minor', intervals: [0, 3, 7] },
    '7': { name: 'dominant 7th', intervals: [0, 4, 7, 10] },
    'maj7': { name: 'major 7th', intervals: [0, 4, 7, 11] },
    'm7': { name: 'minor 7th', intervals: [0, 3, 7, 10] },
    'dim': { name: 'diminished', intervals: [0, 3, 6] },
    'dim7': { name: 'diminished 7th', intervals: [0, 3, 6, 9] },
    'aug': { name: 'augmented', intervals: [0, 4, 8] },
    'sus4': { name: 'suspended 4th', intervals: [0, 5, 7] },
    'sus2': { name: 'suspended 2nd', intervals: [0, 2, 7] },
    '6': { name: 'major 6th', intervals: [0, 4, 7, 9] },
    'm6': { name: 'minor 6th', intervals: [0, 3, 7, 9] },
    'm7b5': { name: 'half-diminished', intervals: [0, 3, 6, 10] }
  };

  function parseChordSymbol(sym) {
    var m = /^([A-Ga-g][#b]?)(.*)$/.exec(String(sym).trim());
    if (!m) return null;
    var rootPc = pitchClassOf(m[1]);
    var type = m[2] || '';
    if (!(type in CHORD_TYPES)) return null;
    return {
      symbol: String(sym).trim(),
      root: m[1].charAt(0).toUpperCase() + m[1].slice(1),
      rootPc: rootPc,
      type: type,
      def: CHORD_TYPES[type]
    };
  }

  /* Search the fretboard for playable voicings.
     Returns [{ frets:[c1..c5] (-1 = muted), base, span, score }] */
  function chordVoicings(sym, limit) {
    var parsed = parseChordSymbol(sym);
    if (!parsed) return [];
    var wantSet = {};
    parsed.def.intervals.forEach(function (iv) { wantSet[(parsed.rootPc + iv) % 12] = true; });
    var wantCount = Object.keys(wantSet).length;

    var essential = {};
    essential[parsed.rootPc % 12] = true;
    essential[(parsed.rootPc + parsed.def.intervals[1]) % 12] = true;
    if (parsed.def.intervals.length > 3) essential[(parsed.rootPc + parsed.def.intervals[3]) % 12] = true;

    var results = [];
    for (var base = 0; base <= 9; base++) {
      var options = [];
      for (var ci = 0; ci < COURSES.length; ci++) {
        var opts = [-1];
        var seenFret = {};
        for (var f = base; f <= base + 3; f++) {
          if (f > MAX_FRET) break;
          if ((COURSES[ci].midi + f) % 12 in wantSet) { opts.push(f); seenFret[f] = true; }
        }
        if (base > 0 && !seenFret[0] && (COURSES[ci].midi % 12) in wantSet) opts.push(0);
        options.push(opts);
      }
      var total = options.reduce(function (a, o) { return a * o.length; }, 1);
      if (total > 50000) continue;
      for (var n = 0; n < total; n++) {
        var rem = n, frets = [];
        for (var k = 0; k < 5; k++) {
          frets.push(options[k][rem % options[k].length]);
          rem = Math.floor(rem / options[k].length);
        }
        var muted = 0, minF = 99, maxF = 0, lowest = 999, lowestPc = -1, sounded = 0;
        var covered = {};
        for (var s = 0; s < 5; s++) {
          if (frets[s] === -1) { muted++; continue; }
          sounded++;
          var midi = COURSES[s].midi + frets[s];
          covered[midi % 12] = true;
          if (frets[s] > 0) {
            if (frets[s] < minF) minF = frets[s];
            if (frets[s] > maxF) maxF = frets[s];
          }
          if (midi < lowest) { lowest = midi; lowestPc = midi % 12; }
        }
        if (muted > 1 || sounded < 4) continue;
        var ok = true;
        for (var e in essential) if (!covered[e]) { ok = false; break; }
        if (!ok) continue;
        var span = (minF === 99) ? 0 : (maxF - minF);
        if (span > 3) continue;
        var fingers = frets.filter(function (x) { return x > 0; }).length;
        var score = 0;
        score -= span * 3;
        score -= (minF === 99 ? 0 : minF) * 1.2;
        score -= muted * 6;
        score -= fingers * 0.6;
        if (lowestPc === parsed.rootPc) score += 6;
        if (Object.keys(covered).length === wantCount) score += 2;
        results.push({ frets: frets, span: span, base: (minF === 99 ? 0 : minF), score: score, muted: muted });
      }
    }
    results.sort(function (a, b) { return b.score - a.score; });
    var seen = {}, out = [];
    for (var r = 0; r < results.length; r++) {
      var key = results[r].frets.join(',');
      if (seen[key]) continue;
      seen[key] = true;
      out.push(results[r]);
      if (out.length >= (limit || 3)) break;
    }
    return out;
  }

  /* Pitches a voicing produces, including the octave strings of courses 4 & 5 */
  function voicingMidis(frets) {
    var out = [];
    for (var i = 0; i < 5; i++) {
      if (frets[i] === -1) continue;
      var m = COURSES[i].midi + frets[i];
      out.push(m);
      if (COURSES[i].octavePair) out.push(m + 12);
    }
    return out.sort(function (a, b) { return a - b; });
  }

  function diatonicChords(keyName, mode) {
    var rootPc = pitchClassOf(keyName);
    var formula = mode === 'minor' ? SCALE_FORMULAS.naturalMinor : SCALE_FORMULAS.major;
    var qualities = mode === 'minor'
      ? ['m', 'dim', '', 'm', 'm', '', '']
      : ['', 'm', 'm', '', '', 'm', 'dim'];
    var romans = mode === 'minor'
      ? ['i', 'ii\u00B0', 'III', 'iv', 'v', 'VI', 'VII']
      : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii\u00B0'];
    var useFlats = /b$/.test(keyName) || ['F', 'Bb', 'Eb', 'Ab', 'Db'].indexOf(keyName) !== -1;
    return formula.map(function (iv, i) {
      return {
        symbol: midiToPitchClassName((rootPc + iv) % 12, useFlats) + qualities[i],
        roman: romans[i]
      };
    });
  }

  global.Music = {
    COURSES: COURSES,
    MAX_FRET: MAX_FRET,
    SCALE_FORMULAS: SCALE_FORMULAS,
    CHORD_TYPES: CHORD_TYPES,
    midiToName: midiToName,
    midiToPitchClassName: midiToPitchClassName,
    midiToFreq: midiToFreq,
    noteToMidi: noteToMidi,
    pitchClassOf: pitchClassOf,
    positionsFor: positionsFor,
    choosePosition: choosePosition,
    parseMelody: parseMelody,
    toMeasures: toMeasures,
    scaleNotes: scaleNotes,
    scaleToMelodyText: scaleToMelodyText,
    parseChordSymbol: parseChordSymbol,
    chordVoicings: chordVoicings,
    voicingMidis: voicingMidis,
    diatonicChords: diatonicChords
  };
})(window);
