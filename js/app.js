/* Cuatro Tutor - application shell and views */
(function () {
  'use strict';

  var STORE_KEY = 'cuatroTutor.progress.v1';
  var progress = loadProgress();

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {}
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function $(sel) { return document.querySelector(sel); }

  /* ================= progression exercise renderer ================= */
  function renderProgression(ex) {
    var wrap = el('div', 'prog');
    var ctrl = el('div', 'tab-controls');
    var play = el('button', 'btn btn-play', '\u25B6 Play');
    var stop = el('button', 'btn btn-ghost', '\u25A0 Stop');
    var normal = ex.tempo || 84;

    var speedWrap = el('div', 'speed-ctl');
    speedWrap.appendChild(el('span', 'speed-cap', 'Speed'));
    var slider = document.createElement('input');
    slider.type = 'range'; slider.min = 30; slider.max = 110; slider.step = 5;
    slider.value = 100;
    slider.title = 'Percentage of the normal performance tempo';
    var out = el('span', 'speed-val');
    out.innerHTML = '<b>100%</b><span>' + normal + ' bpm</span>';
    speedWrap.appendChild(slider); speedWrap.appendChild(out);

    var presets = el('div', 'speed-presets');
    var presetBtns = [];
    [50, 60, 75, 90, 100].forEach(function (p) {
      var b = el('button', 'btn btn-chip', p === 100 ? 'Normal' : p + '%');
      b.dataset.pct = String(p);
      presets.appendChild(b);
      presetBtns.push(b);
    });

    function chk(label, on, title) {
      var l = el('label', 'tab-check');
      var i = document.createElement('input');
      i.type = 'checkbox'; i.checked = !!on;
      l.appendChild(i); l.appendChild(el('span', null, label));
      if (title) l.title = title;
      return { el: l, input: i };
    }
    var loopChk = chk('Loop', true, 'Keep the accompaniment cycling so you can play the melody over it');
    var countChk = chk('Count-in', true, 'One bar of clicks before it starts');
    var clickChk = chk('Click', false, 'Add a metronome click on top of the strum');
    var optRow = el('div', 'tab-opts');
    optRow.appendChild(loopChk.el); optRow.appendChild(countChk.el); optRow.appendChild(clickChk.el);

    ctrl.appendChild(play); ctrl.appendChild(stop);
    ctrl.appendChild(speedWrap); ctrl.appendChild(presets); ctrl.appendChild(optRow);
    wrap.appendChild(ctrl);

    var bars = el('div', 'prog-bars');
    var cells = [];
    ex.chords.forEach(function (c, i) {
      var b = el('div', 'prog-bar');
      b.appendChild(el('div', 'prog-no', String(i + 1)));
      b.appendChild(el('div', 'prog-chord', c));
      var beatRow = el('div', 'prog-beats');
      for (var k = 0; k < (ex.beats || 4); k++) beatRow.appendChild(el('span', 'beatdot', '\u25BC'));
      b.appendChild(beatRow);
      b.addEventListener('click', function () {
        var v = Music.chordVoicings(c, 1)[0];
        if (v) { Audio5.ensure(); Audio5.strum(v.frets, 'down'); }
      });
      cells.push(b);
      bars.appendChild(b);
    });
    wrap.appendChild(bars);

    /* unique chord diagrams for this exercise */
    var uniq = [];
    ex.chords.forEach(function (c) { if (uniq.indexOf(c) === -1) uniq.push(c); });
    var dias = el('div', 'chord-row');
    uniq.forEach(function (sym) {
      var v = Music.chordVoicings(sym, 1)[0];
      if (v) dias.appendChild(Tab.renderChordDiagram(sym, v));
    });
    wrap.appendChild(dias);

    var pct = 100;
    function tempoAt(p) { return Math.max(20, Math.round(normal * p / 100)); }
    function refreshSpeed() {
      out.innerHTML = '<b>' + pct + '%</b><span>' + tempoAt(pct) + ' bpm</span>';
      presetBtns.forEach(function (b) {
        if (parseInt(b.dataset.pct, 10) === pct) b.classList.add('on');
        else b.classList.remove('on');
      });
      speedWrap.classList.toggle('slow', pct < 100);
    }
    slider.addEventListener('input', function () {
      pct = parseInt(slider.value, 10);
      refreshSpeed();
    });
    presetBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        pct = parseInt(b.dataset.pct, 10);
        slider.value = pct;
        refreshSpeed();
      });
    });
    refreshSpeed();

    function clearHi() { cells.forEach(function (c) { c.classList.remove('playing'); }); }
    function reset() { clearHi(); play.classList.remove('active'); play.textContent = '\u25B6 Play'; }

    play.addEventListener('click', function () {
      Audio5.ensure();
      play.classList.add('active');
      var bpb = ex.beats || 4;
      Audio5.playProgression(ex.chords, tempoAt(pct), bpb, {
        loop: loopChk.input.checked,
        click: clickChk.input.checked,
        countIn: countChk.input.checked ? bpb : 0,
        onCount: function (left) { play.textContent = left > 0 ? String(left) : '\u25B6 Play'; },
        onBar: function (i) { clearHi(); if (cells[i]) cells[i].classList.add('playing'); },
        onStop: reset
      });
    });
    stop.addEventListener('click', function () { Audio5.stop(); reset(); });
    return wrap;
  }

  function renderExercise(ex, context) {
    var box = el('div', 'exercise');
    box.appendChild(el('h4', 'ex-title', ex.title));
    if (ex.instructions) box.appendChild(el('p', 'ex-instr', ex.instructions));
    var meta = el('div', 'ex-meta');
    if (ex.meter) meta.appendChild(el('span', 'pill', 'Meter ' + ex.meter));
    if (ex.tempo) meta.appendChild(el('span', 'pill', ex.tempo + ' bpm'));
    if (context && context.key) meta.appendChild(el('span', 'pill pill-key', 'Key: ' + context.key));
    box.appendChild(meta);
    if (ex.type === 'progression') {
      box.appendChild(renderProgression(ex));
    } else {
      box.appendChild(Tab.renderTab({
        melody: ex.melody, beats: ex.beats, tempo: ex.tempo,
        chords: ex.chords, meter: ex.meter, title: ex.title, key: context && context.key
      }));
    }
    if (ex.note) box.appendChild(el('p', 'ex-note', ex.note));
    return box;
  }

  /* ================= LESSONS ================= */
  var currentLesson = CURRICULUM.lessons[0].n;

  function doneCount(level) {
    return CURRICULUM.lessons.filter(function (l) {
      return l.level === level && progress['lesson' + l.n];
    }).length;
  }

  function renderLessonsView() {
    var view = el('div', 'view-lessons');

    var intro = el('div', 'panel panel-intro');
    intro.appendChild(el('h2', null, 'The Course'));
    intro.appendChild(el('p', null,
      'Thirty lessons from first contact with the instrument to performing. Work through them in order &mdash; each one assumes the previous. Tick a lesson off when you hit its checkpoint; your progress is saved in this browser.'));
    var overall = el('div', 'level-strip');
    CURRICULUM.levels.forEach(function (lv) {
      var total = CURRICULUM.lessons.filter(function (l) { return l.level === lv.id; }).length;
      var done = doneCount(lv.id);
      var card = el('div', 'level-card level-' + lv.id);
      card.appendChild(el('h3', null, lv.title + ' <small>' + lv.es + '</small>'));
      card.appendChild(el('p', null, lv.desc));
      var barw = el('div', 'bar');
      var fill = el('div', 'bar-fill');
      fill.style.width = (total ? (done / total) * 100 : 0) + '%';
      barw.appendChild(fill);
      card.appendChild(barw);
      card.appendChild(el('div', 'bar-label', done + ' of ' + total + ' complete'));
      overall.appendChild(card);
    });
    intro.appendChild(overall);
    view.appendChild(intro);

    var layout = el('div', 'lesson-layout');

    /* list */
    var list = el('nav', 'lesson-list');
    CURRICULUM.levels.forEach(function (lv) {
      list.appendChild(el('div', 'lesson-list-head level-' + lv.id, lv.title));
      CURRICULUM.lessons.filter(function (l) { return l.level === lv.id; }).forEach(function (l) {
        var item = el('button', 'lesson-item' + (l.n === currentLesson ? ' active' : ''));
        item.innerHTML = '<span class="ln">' + l.n + '</span><span class="lt">' + l.title + '</span>' +
          '<span class="lc">' + (progress['lesson' + l.n] ? '\u2713' : '') + '</span>';
        item.addEventListener('click', function () {
          currentLesson = l.n;
          Audio5.stop();
          render();
          var d = $('.lesson-detail');
          if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        list.appendChild(item);
      });
    });
    layout.appendChild(list);

    /* detail */
    var lesson = CURRICULUM.lessons.filter(function (l) { return l.n === currentLesson; })[0];
    var detail = el('article', 'lesson-detail panel');
    var head = el('header', 'lesson-head');
    head.appendChild(el('div', 'lesson-badge level-' + lesson.level, 'Lesson ' + lesson.n + ' \u00B7 ' + lesson.level));
    head.appendChild(el('h2', null, lesson.title + (lesson.titleEs ? ' <small>' + lesson.titleEs + '</small>' : '')));
    head.appendChild(el('p', 'lesson-goal', '<b>Goal:</b> ' + lesson.goal));
    var metaRow = el('div', 'ex-meta');
    metaRow.appendChild(el('span', 'pill', '\u23F1 ' + lesson.minutes + ' min'));
    if (lesson.chordFocus) metaRow.appendChild(el('span', 'pill', 'Chords: ' + lesson.chordFocus.join(', ')));
    head.appendChild(metaRow);
    detail.appendChild(head);

    var theory = el('section', 'lesson-theory');
    lesson.theory.forEach(function (p) { theory.appendChild(el('p', null, p)); });
    detail.appendChild(theory);

    if (lesson.chordFocus && lesson.chordFocus.length) {
      var cf = el('section', 'lesson-chords');
      cf.appendChild(el('h3', null, 'Chords in this lesson'));
      var row = el('div', 'chord-row');
      lesson.chordFocus.forEach(function (sym) {
        var v = Music.chordVoicings(sym, 1)[0];
        if (v) row.appendChild(Tab.renderChordDiagram(sym, v));
      });
      cf.appendChild(row);
      detail.appendChild(cf);
    }

    if (lesson.exercises && lesson.exercises.length) {
      var exs = el('section', 'lesson-exercises');
      exs.appendChild(el('h3', null, 'Exercises'));
      lesson.exercises.forEach(function (ex) { exs.appendChild(renderExercise(ex)); });
      detail.appendChild(exs);
    }

    if (lesson.tips && lesson.tips.length) {
      var tips = el('section', 'lesson-tips');
      tips.appendChild(el('h3', null, 'Practice tips'));
      var ul = el('ul');
      lesson.tips.forEach(function (t) { ul.appendChild(el('li', null, t)); });
      tips.appendChild(ul);
      detail.appendChild(tips);
    }

    var cp = el('section', 'lesson-checkpoint');
    cp.appendChild(el('h3', null, '\u2691 Checkpoint'));
    cp.appendChild(el('p', null, lesson.checkpoint));
    var btn = el('button', 'btn btn-done' + (progress['lesson' + lesson.n] ? ' is-done' : ''),
      progress['lesson' + lesson.n] ? '\u2713 Completed' : 'Mark as complete');
    btn.addEventListener('click', function () {
      progress['lesson' + lesson.n] = !progress['lesson' + lesson.n];
      saveProgress();
      render();
    });
    cp.appendChild(btn);
    detail.appendChild(cp);

    /* prev / next */
    var nav = el('div', 'lesson-nav');
    if (lesson.n > 1) {
      var prev = el('button', 'btn btn-ghost', '\u2190 Lesson ' + (lesson.n - 1));
      prev.addEventListener('click', function () { currentLesson = lesson.n - 1; Audio5.stop(); render(); });
      nav.appendChild(prev);
    }
    if (lesson.n < CURRICULUM.lessons.length) {
      var next = el('button', 'btn', 'Lesson ' + (lesson.n + 1) + ' \u2192');
      next.addEventListener('click', function () { currentLesson = lesson.n + 1; Audio5.stop(); render(); });
      nav.appendChild(next);
    }
    detail.appendChild(nav);

    layout.appendChild(detail);
    view.appendChild(layout);
    return view;
  }

  /* ================= SONGS ================= */
  var songFilter = 'all';
  var openSong = null;

  function renderSongsView() {
    var view = el('div', 'view-songs');

    var intro = el('div', 'panel panel-intro');
    intro.appendChild(el('h2', null, 'Songs &amp; Tabs'));
    intro.appendChild(el('p', null,
      'Practice pieces in tab, each labelled with its <b>key (tono)</b>, meter, tempo, chord cycle and strum pattern. Press <b>&#9654; Play</b> on any tab to hear it and watch the position highlight move. Everything is transposable &mdash; the cuatro\'s all-fourths tuning means a shape moved up two frets is the same music a whole step higher.'));
    var legend = el('div', 'legend');
    legend.innerHTML = '<b>Reading the tab:</b> top line = 1st course (G, highest) &middot; bottom line = 5th course (B, lowest) &middot; ' +
      'numbers are fret positions &middot; <b>0</b> = open course &middot; note names appear under each column &middot; chord symbols above each measure.';
    intro.appendChild(legend);
    view.appendChild(intro);

    /* filters */
    var styles = ['all'];
    SONGBOOK.forEach(function (s) { if (styles.indexOf(s.style) === -1) styles.push(s.style); });
    var filterBar = el('div', 'filterbar');
    styles.forEach(function (st) {
      var b = el('button', 'chip' + (songFilter === st ? ' active' : ''), st === 'all' ? 'All pieces' : st);
      b.addEventListener('click', function () { songFilter = st; render(); });
      filterBar.appendChild(b);
    });
    view.appendChild(filterBar);

    var grid = el('div', 'song-grid');
    SONGBOOK.filter(function (s) { return songFilter === 'all' || s.style === songFilter; })
      .forEach(function (song) {
        var card = el('article', 'song-card panel' + (openSong === song.id ? ' open' : ''));

        var head = el('header', 'song-head');
        var titleBlock = el('div', 'song-title-block');
        titleBlock.appendChild(el('h3', null, song.title));
        titleBlock.appendChild(el('div', 'song-sub', song.style + ' \u00B7 ' + song.difficulty));
        head.appendChild(titleBlock);

        var keyBadge = el('div', 'key-badge');
        keyBadge.innerHTML = '<span class="kb-label">Tono / Key</span><span class="kb-val">' + song.key + '</span>' +
          (song.keyEs ? '<span class="kb-es">' + song.keyEs + '</span>' : '');
        head.appendChild(keyBadge);
        card.appendChild(head);

        var meta = el('div', 'ex-meta');
        meta.appendChild(el('span', 'pill', 'Meter ' + song.meter));
        meta.appendChild(el('span', 'pill', song.tempo + ' bpm'));
        meta.appendChild(el('span', 'pill', 'Cycle: ' + song.cycle));
        meta.appendChild(el('span', 'pill', 'Scale: ' + song.scale));
        card.appendChild(meta);

        card.appendChild(el('p', 'song-about', song.about));

        var toggle = el('button', 'btn btn-expand', openSong === song.id ? 'Hide tab \u25B2' : 'Show tab \u25BC');
        toggle.addEventListener('click', function () {
          Audio5.stop();
          openSong = (openSong === song.id) ? null : song.id;
          render();
        });
        card.appendChild(toggle);

        if (openSong === song.id) {
          var body = el('div', 'song-body');
          body.appendChild(el('div', 'strum-line', '<b>Strum / rasgueo:</b> ' + song.strum));
          if (song.arrangementNote) body.appendChild(el('div', 'arr-note', song.arrangementNote));

          var allChords = [];
          song.sections.forEach(function (sec) {
            (sec.chords || []).forEach(function (c) { if (allChords.indexOf(c) === -1) allChords.push(c); });
          });
          if (allChords.length) {
            body.appendChild(el('h4', null, 'Chords used'));
            var crow = el('div', 'chord-row');
            allChords.forEach(function (sym) {
              var v = Music.chordVoicings(sym, 1)[0];
              if (v) crow.appendChild(Tab.renderChordDiagram(sym, v));
            });
            body.appendChild(crow);

            var progEx = {
              type: 'progression', chords: allChordsCycle(song),
              beats: song.beats, tempo: song.tempo
            };
            var accHead = el('h4', null, 'Accompaniment (chords only)');
            body.appendChild(accHead);
            body.appendChild(renderProgression(progEx));
          }

          song.sections.forEach(function (sec) {
            body.appendChild(el('h4', null, 'Tab \u2014 ' + sec.name));
            body.appendChild(Tab.renderTab({
              melody: sec.melody, beats: song.beats, tempo: song.tempo,
              chords: sec.chords, meter: song.meter, title: song.title, key: song.key
            }));
          });

          if (song.tips && song.tips.length) {
            body.appendChild(el('h4', null, 'How to practise it'));
            var ul = el('ul', 'song-tips');
            song.tips.forEach(function (t) { ul.appendChild(el('li', null, t)); });
            body.appendChild(ul);
          }
          card.appendChild(body);
        }
        grid.appendChild(card);
      });
    view.appendChild(grid);

    view.appendChild(renderTabLab());
    return view;
  }

  function allChordsCycle(song) {
    var out = [];
    song.sections.forEach(function (sec) { out = out.concat(sec.chords || []); });
    return out.length ? out : ['C'];
  }

  /* custom tab builder */
  var labState = { melody: 'G3:1 A3:1 B3:1 C4:1 D4:2 B3:1 G3:1', beats: 4, tempo: 90 };
  function renderTabLab() {
    var panel = el('section', 'panel tablab');
    panel.appendChild(el('h2', null, 'Create your own tab'));
    panel.appendChild(el('p', null,
      'Type a melody and this will work out the cuatro fingering for you, draw the tab and play it back. ' +
      'Format: <code>Note[:beats]</code> separated by spaces &mdash; e.g. <code>G4</code> (one beat), <code>A4:0.5</code> (eighth), ' +
      '<code>r:1</code> (rest), <code>C5:2@2</code> (two beats, forced onto course 2). Sharps <code>#</code> and flats <code>b</code> both work.'));

    var form = el('div', 'lab-form');
    var ta = document.createElement('textarea');
    ta.className = 'lab-input';
    ta.rows = 3;
    ta.value = labState.melody;
    form.appendChild(ta);

    var row = el('div', 'lab-row');
    var beatsLbl = el('label', null, 'Beats per measure ');
    var beatsIn = document.createElement('input');
    beatsIn.type = 'number'; beatsIn.min = 1; beatsIn.max = 12; beatsIn.value = labState.beats;
    beatsIn.className = 'lab-num';
    beatsLbl.appendChild(beatsIn);
    var tempoLbl = el('label', null, 'Tempo ');
    var tempoIn = document.createElement('input');
    tempoIn.type = 'number'; tempoIn.min = 40; tempoIn.max = 220; tempoIn.value = labState.tempo;
    tempoIn.className = 'lab-num';
    tempoLbl.appendChild(tempoIn);
    var go = el('button', 'btn', 'Build tab');
    row.appendChild(beatsLbl); row.appendChild(tempoLbl); row.appendChild(go);
    form.appendChild(row);
    panel.appendChild(form);

    var out = el('div', 'lab-out');
    panel.appendChild(out);

    function build() {
      labState.melody = ta.value;
      labState.beats = parseInt(beatsIn.value, 10) || 4;
      labState.tempo = parseInt(tempoIn.value, 10) || 90;
      out.innerHTML = '';
      try {
        out.appendChild(Tab.renderTab({
          melody: labState.melody, beats: labState.beats,
          tempo: labState.tempo, title: 'My tab'
        }));
      } catch (e) {
        out.appendChild(el('p', 'warn', 'Could not read that melody. Check the note format.'));
      }
    }
    go.addEventListener('click', build);
    setTimeout(build, 0);
    return panel;
  }

  /* ================= CHORDS ================= */
  var chordKey = 'G', chordMode = 'major', chordSearch = '';

  function renderChordsView() {
    var view = el('div', 'view-chords');
    var intro = el('div', 'panel panel-intro');
    intro.appendChild(el('h2', null, 'Chord Library'));
    intro.appendChild(el('p', null,
      'Every diagram here is <b>calculated for the cuatro\'s B&ndash;E&ndash;A&ndash;D&ndash;G tuning</b>, not borrowed from guitar. ' +
      'Courses read left to right as <b>G D A E B</b> (1st to 5th). <span class="sym">&#9675;</span> = open, <span class="sym">&times;</span> = do not play, dots = finger positions. Click any diagram to hear it.'));
    view.appendChild(intro);

    /* key family */
    var keyPanel = el('section', 'panel');
    keyPanel.appendChild(el('h3', null, 'Chords in a key'));
    var ctrls = el('div', 'filterbar');
    ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'].forEach(function (k) {
      var b = el('button', 'chip' + (chordKey === k ? ' active' : ''), k);
      b.addEventListener('click', function () { chordKey = k; render(); });
      ctrls.appendChild(b);
    });
    ctrls.appendChild(el('span', 'spacer', ''));
    ['major', 'minor'].forEach(function (m) {
      var b = el('button', 'chip' + (chordMode === m ? ' active' : ''), m);
      b.addEventListener('click', function () { chordMode = m; render(); });
      ctrls.appendChild(b);
    });
    keyPanel.appendChild(ctrls);

    var fam = Music.diatonicChords(chordKey, chordMode);
    var famRow = el('div', 'chord-row');
    fam.forEach(function (c) {
      var v = Music.chordVoicings(c.symbol, 1)[0];
      if (!v) return;
      var holder = el('div', 'chord-holder');
      holder.appendChild(el('div', 'roman', c.roman));
      holder.appendChild(Tab.renderChordDiagram(c.symbol, v));
      famRow.appendChild(holder);
    });
    keyPanel.appendChild(famRow);

    var prog = el('div', 'prog-suggest');
    var I = fam[0].symbol, IV = fam[3].symbol, V = fam[4].symbol, vi = fam[5].symbol;
    var V7 = Music.parseChordSymbol(V) ? (chordMode === 'major' ? V + '7' : V + '7') : V;
    prog.innerHTML = '<b>Try these progressions in ' + chordKey + ' ' + chordMode + ':</b> ' +
      '<code>' + I + ' &ndash; ' + IV + ' &ndash; ' + V7 + ' &ndash; ' + I + '</code> (the basic cycle) &nbsp;&middot;&nbsp; ' +
      '<code>' + I + ' &ndash; ' + vi + ' &ndash; ' + IV + ' &ndash; ' + V7 + '</code> (song cycle)';
    keyPanel.appendChild(prog);
    view.appendChild(keyPanel);

    /* lookup */
    var lookup = el('section', 'panel');
    lookup.appendChild(el('h3', null, 'Look up any chord'));
    var searchRow = el('div', 'lab-row');
    var input = document.createElement('input');
    input.type = 'text'; input.className = 'lab-text';
    input.placeholder = 'e.g. Am7, F#m, Bb, D7, Esus4';
    input.value = chordSearch;
    var sbtn = el('button', 'btn', 'Find voicings');
    searchRow.appendChild(input); searchRow.appendChild(sbtn);
    lookup.appendChild(searchRow);
    var res = el('div', 'chord-row');
    lookup.appendChild(res);

    function doSearch() {
      chordSearch = input.value.trim();
      res.innerHTML = '';
      if (!chordSearch) return;
      var vs = Music.chordVoicings(chordSearch, 4);
      if (!vs.length) {
        res.appendChild(el('p', 'warn', 'No playable voicing found for "' + chordSearch + '". Supported suffixes: ' +
          Object.keys(Music.CHORD_TYPES).map(function (t) { return t === '' ? '(major)' : t; }).join(', ')));
        return;
      }
      var parsed = Music.parseChordSymbol(chordSearch);
      vs.forEach(function (v, i) {
        var holder = el('div', 'chord-holder');
        holder.appendChild(el('div', 'roman', i === 0 ? 'easiest' : 'alt ' + i));
        holder.appendChild(Tab.renderChordDiagram(parsed.symbol, v));
        res.appendChild(holder);
      });
    }
    sbtn.addEventListener('click', doSearch);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });
    if (chordSearch) setTimeout(doSearch, 0);
    view.appendChild(lookup);

    /* types reference */
    var types = el('section', 'panel');
    types.appendChild(el('h3', null, 'Chord types the cuatro uses most'));
    var tbl = el('table', 'ref-table');
    tbl.innerHTML = '<tr><th>Symbol</th><th>Name</th><th>Formula</th><th>Where you hear it</th></tr>' +
      '<tr><td>G</td><td>major</td><td>1 3 5</td><td>Everywhere &mdash; the home chord</td></tr>' +
      '<tr><td>Am</td><td>minor</td><td>1 &#9837;3 5</td><td>Seis, aguinaldo, bolero</td></tr>' +
      '<tr><td>D7</td><td>dominant 7th</td><td>1 3 5 &#9837;7</td><td>The V chord that pulls home</td></tr>' +
      '<tr><td>Am7</td><td>minor 7th</td><td>1 &#9837;3 5 &#9837;7</td><td>Bolero, danza, softer colours</td></tr>' +
      '<tr><td>Cmaj7</td><td>major 7th</td><td>1 3 5 7</td><td>Bolero, romantic ballads</td></tr>' +
      '<tr><td>Bdim</td><td>diminished</td><td>1 &#9837;3 &#9837;5</td><td>Passing chord in danza</td></tr>' +
      '<tr><td>Dsus4</td><td>suspended 4th</td><td>1 4 5</td><td>Delaying a resolution</td></tr>' +
      '<tr><td>C6</td><td>major 6th</td><td>1 3 5 6</td><td>Old-style endings</td></tr>';
    types.appendChild(tbl);
    view.appendChild(types);

    return view;
  }

  /* ================= REFERENCE ================= */
  function renderReferenceView() {
    var view = el('div', 'view-ref');

    var tuning = el('section', 'panel');
    tuning.appendChild(el('h2', null, 'Tuning &amp; the Instrument'));
    tuning.appendChild(el('p', null,
      'The modern cuatro has <b>ten strings in five double courses</b>, every course a perfect fourth above the one below. Click a course to hear its pitch.'));
    var tuner = el('div', 'tuner');
    Music.COURSES.slice().reverse().forEach(function (c) {
      var b = el('button', 'tuner-btn');
      b.innerHTML = '<span class="tn">' + c.label + '</span>' +
        '<span class="tc">' + c.roman + ' course</span>' +
        '<span class="tp">' + Music.midiToName(c.midi) + (c.octavePair ? ' + ' + Music.midiToName(c.midi + 12) : ' \u00D7 2') + '</span>' +
        '<span class="tt">' + (c.octavePair ? 'octave pair' : 'unison pair') + '</span>';
      b.addEventListener('click', function () {
        Audio5.ensure();
        Audio5.playCourse(Music.COURSES.indexOf(c), 0, null, 2.4, 0.3);
      });
      tuner.appendChild(b);
    });
    tuning.appendChild(tuner);
    view.appendChild(tuning);

    /* fretboard map */
    var fb = el('section', 'panel');
    fb.appendChild(el('h2', null, 'Fretboard Map'));
    fb.appendChild(el('p', null, 'Every note from the open courses to fret 12. Click any note to hear it. Because the tuning is all fourths, every shape repeats identically across courses.'));
    var board = el('div', 'fretboard');
    var headRow = el('div', 'fb-row fb-head');
    headRow.appendChild(el('div', 'fb-cell fb-label', ''));
    for (var f = 0; f <= 12; f++) headRow.appendChild(el('div', 'fb-cell fb-fretno', String(f)));
    board.appendChild(headRow);
    Music.COURSES.forEach(function (c, ci) {
      var row = el('div', 'fb-row');
      row.appendChild(el('div', 'fb-cell fb-label', c.label + '<sub>' + c.course + '</sub>'));
      for (var fr = 0; fr <= 12; fr++) {
        (function (fr) {
          var name = Music.midiToPitchClassName(c.midi + fr);
          var cell = el('div', 'fb-cell fb-note' + (fr === 0 ? ' open' : '') +
            (['G', 'A', 'B', 'C', 'D', 'E', 'F#'].indexOf(name) !== -1 ? ' in-g' : ''), name);
          cell.addEventListener('click', function () {
            Audio5.ensure();
            Audio5.playCourse(ci, fr, undefined, 1.4, 0.3);
          });
          row.appendChild(cell);
        })(fr);
      }
      board.appendChild(row);
    });
    fb.appendChild(board);
    fb.appendChild(el('p', 'fb-legend', 'Highlighted notes belong to <b>G major</b>, the most common key in jíbaro repertoire.'));
    view.appendChild(fb);

    /* scales */
    var sc = el('section', 'panel');
    sc.appendChild(el('h2', null, 'Scale Builder'));
    sc.appendChild(el('p', null, 'Pick a root and a scale to generate tab and hear it on the cuatro.'));
    var scRow = el('div', 'lab-row');
    var rootSel = document.createElement('select');
    ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'].forEach(function (n) {
      var o = document.createElement('option'); o.value = n; o.textContent = n; rootSel.appendChild(o);
    });
    rootSel.value = 'G3';
    var scaleSel = document.createElement('select');
    [['major', 'Major'], ['naturalMinor', 'Natural minor'], ['harmonicMinor', 'Harmonic minor'],
     ['majorPentatonic', 'Major pentatonic'], ['minorPentatonic', 'Minor pentatonic'],
     ['phrygian', 'Phrygian (mapey\u00E9 colour)'], ['dorian', 'Dorian'], ['mixolydian', 'Mixolydian'], ['blues', 'Blues']]
      .forEach(function (p) {
        var o = document.createElement('option'); o.value = p[0]; o.textContent = p[1]; scaleSel.appendChild(o);
      });
    var scBtn = el('button', 'btn', 'Build scale');
    scRow.appendChild(rootSel); scRow.appendChild(scaleSel); scRow.appendChild(scBtn);
    sc.appendChild(scRow);
    var scOut = el('div', 'lab-out');
    sc.appendChild(scOut);
    function buildScale() {
      var rootMidi = Music.noteToMidi(rootSel.value);
      var txt = Music.scaleToMelodyText(rootMidi, scaleSel.value, 1, 1, true);
      scOut.innerHTML = '';
      scOut.appendChild(Tab.renderTab({ melody: txt, beats: 4, tempo: 80, title: 'Scale' }));
    }
    scBtn.addEventListener('click', buildScale);
    setTimeout(buildScale, 0);
    view.appendChild(sc);

    /* rhythms */
    var rh = el('section', 'panel');
    rh.appendChild(el('h2', null, 'Strumming Patterns'));
    var rtab = el('table', 'ref-table');
    rtab.innerHTML = '<tr><th>Style</th><th>Meter</th><th>Pattern</th><th>Feel</th></tr>' +
      '<tr><td>Basic</td><td>4/4</td><td>&#9661; &#9661; &#9661; &#9661;</td><td>Foundation, one per beat</td></tr>' +
      '<tr><td>Eighth pendulum</td><td>4/4</td><td>&#9661;&#9651; &#9661;&#9651; &#9661;&#9651; &#9661;&#9651;</td><td>Hand never stops moving</td></tr>' +
      '<tr><td>Seis / plena</td><td>4/4</td><td>&#9661; x &#9661;&#9651; x</td><td>Chop on 2 and 4 like a g&#252;iro</td></tr>' +
      '<tr><td>Aguinaldo</td><td>6/8</td><td>&#9661; &#9651;&#9661;&#9651; &#9661; &#9651;</td><td>Accent beats 1 and 4</td></tr>' +
      '<tr><td>Vals</td><td>3/4</td><td>&#9661; &#9651; &#9651;</td><td>Heavy 1, light 2 and 3</td></tr>' +
      '<tr><td>Bolero</td><td>4/4</td><td>Arpeggio / cinquillo</td><td>Soft, romantic, no chop</td></tr>' +
      '<tr><td>Danza</td><td>2/4 or 6/8</td><td>Light &#9661; &#9651; with rubato</td><td>Salon elegance</td></tr>';
    rh.appendChild(rtab);
    view.appendChild(rh);

    /* glossary */
    var gl = el('section', 'panel');
    gl.appendChild(el('h2', null, 'Glossary'));
    var gtab = el('table', 'ref-table');
    gtab.innerHTML = '<tr><th>Term</th><th>Meaning</th></tr>' +
      '<tr><td><b>Cuatrista</b></td><td>A cuatro player</td></tr>' +
      '<tr><td><b>J&#237;baro</b></td><td>The Puerto Rican mountain countryfolk, and their music</td></tr>' +
      '<tr><td><b>Seis</b></td><td>The largest family of j&#237;baro song forms (chorreao, fajarde&#241;o, mapey&#233;, and many more)</td></tr>' +
      '<tr><td><b>Aguinaldo</b></td><td>Christmas song form, sung during parrandas</td></tr>' +
      '<tr><td><b>D&#233;cima</b></td><td>A ten-line improvised sung verse</td></tr>' +
      '<tr><td><b>Trovador</b></td><td>The singer who improvises d&#233;cimas</td></tr>' +
      '<tr><td><b>Rasgueo</b></td><td>Strum</td></tr>' +
      '<tr><td><b>P&#250;a</b></td><td>Pick / plectrum</td></tr>' +
      '<tr><td><b>Parranda</b></td><td>Christmas house-to-house musical visit</td></tr>' +
      '<tr><td><b>Orquesta j&#237;bara</b></td><td>Traditional ensemble: cuatro, guitar, bordon&#250;a, g&#252;iro</td></tr>' +
      '<tr><td><b>G&#252;iro</b></td><td>Scraped gourd percussion that drives the rhythm</td></tr>' +
      '<tr><td><b>Bordon&#250;a</b></td><td>Large low-pitched Puerto Rican bass-register string instrument</td></tr>' +
      '<tr><td><b>Aviolinado</b></td><td>The violin-shaped cuatro body, the modern standard</td></tr>' +
      '<tr><td><b>Tr&#233;molo</b></td><td>Fast repeated picking that sustains a melody note</td></tr>';
    gl.appendChild(gtab);
    view.appendChild(gl);

    /* routine */
    var rt = el('section', 'panel');
    rt.appendChild(el('h2', null, 'Daily Practice Routine'));
    rt.appendChild(el('p', null, 'Forty focused minutes a day will take you further than a four-hour session once a week.'));
    var rtbl = el('table', 'ref-table');
    rtbl.innerHTML = '<tr><th>Time</th><th>What</th><th>Why</th></tr>' +
      '<tr><td>10 min</td><td>Technique: scales, alternate picking, tremolo</td><td>Builds the physical foundation</td></tr>' +
      '<tr><td>10 min</td><td>Repertoire: one piece from the Songs tab</td><td>Music, not just exercises</td></tr>' +
      '<tr><td>10 min</td><td>Improvisation over a chord cycle</td><td>Trains your ear and your voice</td></tr>' +
      '<tr><td>10 min</td><td>New material: the next lesson</td><td>Keeps you moving forward</td></tr>';
    rt.appendChild(rtbl);
    view.appendChild(rt);

    return view;
  }

  /* ================= shell ================= */
  var TABS = [
    { id: 'lessons', label: 'Lessons', es: 'Lecciones', render: renderLessonsView },
    { id: 'songs', label: 'Songs &amp; Tabs', es: 'Canciones', render: renderSongsView },
    { id: 'chords', label: 'Chords', es: 'Acordes', render: renderChordsView },
    { id: 'reference', label: 'Reference', es: 'Referencia', render: renderReferenceView }
  ];
  var activeTab = 'lessons';

  function render() {
    var nav = $('#tabnav');
    nav.innerHTML = '';
    TABS.forEach(function (t) {
      var b = el('button', 'tabbtn' + (activeTab === t.id ? ' active' : ''),
        t.label + '<small>' + t.es + '</small>');
      b.addEventListener('click', function () {
        if (activeTab === t.id) return;
        Audio5.stop();
        activeTab = t.id;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      nav.appendChild(b);
    });
    var main = $('#main');
    main.innerHTML = '';
    var view = TABS.filter(function (t) { return t.id === activeTab; })[0].render();
    main.appendChild(view);
  }

  /* metronome widget */
  function initMetronome() {
    var btn = $('#metroBtn');
    var tempoIn = $('#metroTempo');
    var meterSel = $('#metroMeter');
    var dots = $('#metroDots');

    function paintDots(active) {
      var n = parseInt(meterSel.value, 10);
      dots.innerHTML = '';
      for (var i = 0; i < n; i++) {
        var d = el('span', 'mdot' + (i === active ? ' on' : '') + (i === 0 ? ' accent' : ''));
        dots.appendChild(d);
      }
    }
    paintDots(-1);
    meterSel.addEventListener('change', function () { paintDots(-1); });

    btn.addEventListener('click', function () {
      Audio5.ensure();
      if (Audio5.isMetronomeOn()) {
        Audio5.stopMetronome();
        btn.classList.remove('on');
        btn.textContent = '\u25B6 Metronome';
        paintDots(-1);
      } else {
        Audio5.startMetronome(parseInt(tempoIn.value, 10) || 90, parseInt(meterSel.value, 10), paintDots);
        btn.classList.add('on');
        btn.textContent = '\u25A0 Stop';
      }
    });
    tempoIn.addEventListener('change', function () {
      if (Audio5.isMetronomeOn()) {
        Audio5.stopMetronome();
        Audio5.startMetronome(parseInt(tempoIn.value, 10) || 90, parseInt(meterSel.value, 10), paintDots);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    initMetronome();
    $('#stopAll').addEventListener('click', function () {
      Audio5.stop(); Audio5.stopMetronome();
      var b = $('#metroBtn');
      b.classList.remove('on'); b.textContent = '\u25B6 Metronome';
    });
  });
})();
