/* Self-check suite. Open tests/verify.html in a browser to run it.
   Validates the tuning, every tab in the course and songbook, and the
   generated chord voicings. */
(function () {
  'use strict';
  var errors = [], warnings = [], info = [];
  function err(m) { errors.push(m); }
  function warn(m) { warnings.push(m); }
  function log(m) { info.push(m); }

  /* --- tuning --------------------------------------------------------- */
  var expect = { 1: ['G4', 67], 2: ['D4', 62], 3: ['A3', 57], 4: ['E3', 52], 5: ['B2', 47] };
  Music.COURSES.forEach(function (c) {
    var e = expect[c.course];
    var got = Music.midiToName(c.midi);
    if (c.midi !== e[1] || got !== e[0]) err('Course ' + c.course + ' expected ' + e[0] + ', got ' + got);
  });
  for (var i = 1; i < Music.COURSES.length; i++) {
    var diff = Music.COURSES[i - 1].midi - Music.COURSES[i].midi;
    if (diff !== 5) err('Courses ' + Music.COURSES[i].course + '->' + Music.COURSES[i - 1].course +
      ' are ' + diff + ' semitones apart, expected a perfect fourth (5)');
  }
  log('Tuning low&rarr;high: ' + Music.COURSES.map(function (c) { return Music.midiToName(c.midi); }).reverse().join(' ') +
    ' &mdash; all perfect fourths \u2713');

  /* --- melody / tab validation ---------------------------------------- */
  function checkMelody(label, melodyText, beats, chords) {
    var raw = String(melodyText).trim().split(/\s+/).filter(function (t) { return t && t !== '|'; });
    var notes = Music.parseMelody(melodyText);
    if (notes.length !== raw.length) err(label + ': ' + raw.length + ' tokens produced ' + notes.length + ' notes (malformed token)');
    var total = 0;
    notes.forEach(function (n) {
      total += n.dur;
      if (!isFinite(n.dur) || n.dur <= 0) err(label + ': bad duration');
      if (n.rest) return;
      if (n.midi < 47) err(label + ': ' + n.name + ' is below the cuatro range (lowest is B2)');
      if (n.fret < 0 || n.fret > Music.MAX_FRET) err(label + ': ' + n.name + ' maps to fret ' + n.fret);
      if (Music.COURSES[n.courseIndex].midi + n.fret !== n.midi)
        err(label + ': tab position for ' + n.name + ' does not reproduce the pitch');
      if (n.fret > 12) warn(label + ': ' + n.name + ' needs fret ' + n.fret);
    });
    var measures = Music.toMeasures(notes, beats);
    var exact = total / beats;
    if (Math.abs(exact - Math.round(exact)) > 1e-6)
      warn(label + ': ' + total + ' beats is not a whole number of ' + beats + '-beat measures');
    if (chords && chords.length !== measures.length)
      err(label + ': ' + measures.length + ' measures but ' + chords.length + ' chord symbols');
    return measures.length;
  }

  /* --- lessons -------------------------------------------------------- */
  if (CURRICULUM.lessons.length !== 30) err('Expected 30 lessons, found ' + CURRICULUM.lessons.length);
  var levels = {};
  CURRICULUM.lessons.forEach(function (l, idx) {
    levels[l.level] = (levels[l.level] || 0) + 1;
    if (l.n !== idx + 1) err('Lesson at index ' + idx + ' is numbered ' + l.n);
    ['title', 'goal', 'checkpoint', 'level'].forEach(function (f) {
      if (!l[f]) err('Lesson ' + l.n + ' is missing "' + f + '"');
    });
    if (!l.theory || !l.theory.length) err('Lesson ' + l.n + ' has no theory');
    (l.chordFocus || []).forEach(function (sym) {
      if (!Music.parseChordSymbol(sym)) err('Lesson ' + l.n + ': unparseable chord "' + sym + '"');
      else if (!Music.chordVoicings(sym, 1).length) err('Lesson ' + l.n + ': no playable voicing for ' + sym);
    });
    (l.exercises || []).forEach(function (ex) {
      var label = 'Lesson ' + l.n + ' / ' + ex.title;
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
  log('Lessons: ' + CURRICULUM.lessons.length + ' total &mdash; ' +
    Object.keys(levels).map(function (k) { return levels[k] + ' ' + k; }).join(', '));

  /* --- songs ---------------------------------------------------------- */
  var songRows = [];
  SONGBOOK.forEach(function (s) {
    ['title', 'key', 'meter', 'tempo', 'style', 'cycle'].forEach(function (f) {
      if (!s[f]) err(s.title + ': missing "' + f + '"');
    });
    s.sections.forEach(function (sec) {
      var bars = checkMelody(s.title + ' / ' + sec.name, sec.melody, s.beats, sec.chords);
      (sec.chords || []).forEach(function (sym) {
        if (!Music.chordVoicings(sym, 1).length) err(s.title + ': no voicing for ' + sym);
      });
      songRows.push([s.title, s.key, s.meter, s.tempo + ' bpm', bars + ' bars', s.difficulty]);
    });
  });

  /* --- chord generator ------------------------------------------------ */
  var testChords = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Am', 'Em', 'Dm', 'Bm', 'F#m',
    'G7', 'D7', 'A7', 'E7', 'C7', 'Am7', 'Dm7', 'Cmaj7', 'Bdim', 'Dsus4', 'C6', 'Bm7b5'];
  var chordRows = [];
  testChords.forEach(function (sym) {
    var vs = Music.chordVoicings(sym, 2);
    if (!vs.length) { err('No playable voicing for ' + sym); return; }
    var parsed = Music.parseChordSymbol(sym);
    var want = parsed.def.intervals.map(function (iv) { return (parsed.rootPc + iv) % 12; });
    vs.forEach(function (v) {
      var pcs = [];
      v.frets.forEach(function (f, idx) {
        if (f === -1) return;
        var pc = (Music.COURSES[idx].midi + f) % 12;
        pcs.push(pc);
        if (want.indexOf(pc) === -1)
          err(sym + ': voicing [' + v.frets + '] contains ' + Music.midiToPitchClassName(pc) + ', not a chord tone');
      });
      if (pcs.indexOf(parsed.rootPc) === -1) err(sym + ': voicing [' + v.frets + '] has no root');
      var third = (parsed.rootPc + parsed.def.intervals[1]) % 12;
      if (pcs.indexOf(third) === -1) err(sym + ': voicing [' + v.frets + '] missing the defining 3rd/4th');
      if (v.span > 3) err(sym + ': voicing span of ' + v.span + ' frets is unplayable');
    });
    var notes = Music.voicingMidis(vs[0].frets).map(function (m) { return Music.midiToName(m); }).join(' ');
    chordRows.push([sym, vs[0].frets.map(function (f) { return f === -1 ? 'x' : f; }).join('-'), notes]);
  });

  /* --- scales --------------------------------------------------------- */
  var gMaj = Music.scaleNotes(Music.noteToMidi('G3'), 'major', 1).map(function (m) { return Music.midiToName(m); }).join(' ');
  if (gMaj !== 'G3 A3 B3 C4 D4 E4 F#4 G4') err('G major scale is wrong: ' + gMaj);
  var aHarm = Music.scaleNotes(Music.noteToMidi('A3'), 'harmonicMinor', 1).map(function (m) { return Music.midiToName(m); }).join(' ');
  if (aHarm !== 'A3 B3 C4 D4 E4 F4 G#4 A4') err('A harmonic minor is wrong: ' + aHarm);
  var fam = Music.diatonicChords('G', 'major').map(function (c) { return c.symbol; }).join(' ');
  if (fam !== 'G Am Bm C D Em F#dim') err('G major chord family is wrong: ' + fam);
  log('Scales: G major, A harmonic minor and the G chord family all check out \u2713');

  /* --- round trip: tab -> pitch --------------------------------------- */
  var sample = Music.parseMelody('G3:1 A3:1 B3:1 C4:1 D4:1 E4:1 F#4:1 G4:1');
  var positions = sample.map(function (n) { return 'c' + n.course + 'f' + n.fret; }).join(' ');
  if (positions !== 'c4f3 c3f0 c3f2 c3f3 c2f0 c2f2 c2f4 c1f0')
    err('First-position G scale fingering changed: ' + positions);
  log('First-position G major fingering: ' + positions + ' \u2713');

  /* --- render --------------------------------------------------------- */
  var out = document.getElementById('out');
  function section(title, html) {
    var d = document.createElement('section');
    d.innerHTML = '<h2>' + title + '</h2>' + html;
    out.appendChild(d);
  }
  function table(headers, rows) {
    return '<table><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
      }).join('') + '</table>';
  }

  var banner = document.getElementById('banner');
  banner.className = errors.length ? 'fail' : 'pass';
  banner.innerHTML = (errors.length ? '\u2717 FAILED' : '\u2713 ALL CHECKS PASSED') +
    ' &mdash; ' + errors.length + ' error(s), ' + warnings.length + ' warning(s)';

  if (errors.length) section('Errors', '<ul class="bad"><li>' + errors.join('</li><li>') + '</li></ul>');
  if (warnings.length) section('Warnings', '<ul class="warn"><li>' + warnings.join('</li><li>') + '</li></ul>');
  section('Checks', '<ul class="ok"><li>' + info.join('</li><li>') + '</li></ul>');
  section('Songbook', table(['Title', 'Key / tono', 'Meter', 'Tempo', 'Length', 'Level'], songRows));
  section('Generated chord voicings <small>(frets, course 1&rarr;5)</small>',
    table(['Chord', 'Frets', 'Pitches sounded'], chordRows));
})();
