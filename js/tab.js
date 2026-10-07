/* Cuatro Tutor - tablature rendering.
   Builds a 5-line cuatro tab (course 1 on top) with measure bars, a transport,
   playback highlighting, and ASCII export. */
(function (global) {
  'use strict';

  var idSeq = 0;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function durLabel(d) {
    if (d >= 4) return '\u1D15\u1D15';
    if (d >= 2) return '';
    return '';
  }

  /* piece = { melody: "<text>", tempo, beats (per measure), key, chords: [...] } */
  function renderTab(piece, options) {
    options = options || {};
    var notes = Music.parseMelody(piece.melody, { maxFret: piece.maxFret, preferFret: piece.preferFret });
    var beats = piece.beats || 4;
    var tempo = piece.tempo || 90;
    var wrap = el('div', 'tabwrap');
    wrap.dataset.tabId = 'tab' + (++idSeq);

    /* transport */
    var SPEED_PRESETS = [50, 60, 75, 90, 100];

    function checkbox(label, on, title) {
      var l = el('label', 'tab-check');
      var i = el('input');
      i.type = 'checkbox';
      i.checked = !!on;
      l.appendChild(i);
      l.appendChild(el('span', null, label));
      if (title) l.title = title;
      return { el: l, input: i };
    }

    var bar = el('div', 'tab-controls');
    var play = el('button', 'btn btn-play', '\u25B6 Play');
    var stop = el('button', 'btn btn-ghost', '\u25A0 Stop');

    var speedWrap = el('div', 'speed-ctl');
    speedWrap.appendChild(el('span', 'speed-cap', 'Speed'));
    var slider = el('input');
    slider.type = 'range';
    slider.min = 30; slider.max = 110; slider.step = 5; slider.value = 100;
    slider.title = 'Percentage of the normal performance tempo';
    speedWrap.appendChild(slider);
    var speedOut = el('span', 'speed-val');
    speedOut.innerHTML = '<b>100%</b><span>' + tempo + ' bpm</span>';
    speedWrap.appendChild(speedOut);

    var presets = el('div', 'speed-presets');
    var presetBtns = [];
    SPEED_PRESETS.forEach(function (p) {
      var b = el('button', 'btn btn-chip', p === 100 ? 'Normal' : p + '%');
      b.dataset.pct = String(p);
      presets.appendChild(b);
      presetBtns.push(b);
    });

    var loopChk = checkbox('Loop', false, 'Repeat the section until you press Stop');
    var clickChk = checkbox('Click', true, 'Play a metronome click along with the tab');
    var countChk = checkbox('Count-in', true, 'One bar of clicks before playback starts');
    var stepChk = checkbox('Step up', false, 'While looping, speed up a little on every repeat until you reach normal speed');

    var opts = el('div', 'tab-opts');
    opts.appendChild(loopChk.el);
    opts.appendChild(clickChk.el);
    opts.appendChild(countChk.el);
    opts.appendChild(stepChk.el);

    var status = el('div', 'tab-status', '');

    var copy = el('button', 'btn btn-ghost', 'Copy ASCII');
    bar.appendChild(play);
    bar.appendChild(stop);
    bar.appendChild(speedWrap);
    bar.appendChild(presets);
    bar.appendChild(opts);
    if (options.showCopy !== false) bar.appendChild(copy);
    bar.appendChild(status);
    wrap.appendChild(bar);

    /* staff */
    var staff = el('div', 'tabstaff');
    var labels = el('div', 'tab-labels');
    Music.COURSES.forEach(function (c) {
      var l = el('div', 'tab-label');
      l.innerHTML = '<b>' + c.label + '</b><span>' + c.course + '</span>';
      labels.appendChild(l);
    });
    staff.appendChild(labels);

    var scroller = el('div', 'tab-scroll');
    var cols = el('div', 'tab-cols');
    var measures = Music.toMeasures(notes, beats);
    var noteIndex = 0;
    var cells = [];

    measures.forEach(function (bar, bi) {
      var mg = el('div', 'measure');
      var head = el('div', 'measure-no', String(bi + 1));
      mg.appendChild(head);
      var inner = el('div', 'measure-inner');
      if (piece.chords && piece.chords[bi]) {
        var ch = el('div', 'measure-chord', piece.chords[bi]);
        mg.appendChild(ch);
      } else {
        mg.appendChild(el('div', 'measure-chord', ''));
      }
      bar.forEach(function (n) {
        var col = el('div', 'tabcol');
        col.dataset.note = String(noteIndex);
        if (n.dur >= 2) col.classList.add('wide');
        if (n.dur <= 0.5) col.classList.add('narrow');
        for (var s = 0; s < 5; s++) {
          var cell = el('div', 'tabcell');
          if (!n.rest && n.courseIndex === s) {
            cell.classList.add('hit');
            cell.textContent = String(n.fret);
          } else {
            cell.textContent = '\u2500';
          }
          col.appendChild(cell);
        }
        var nm = el('div', 'tabnote', n.rest ? '\u00B7' : n.name.replace(/(\d)$/, ''));
        col.appendChild(nm);
        cells[noteIndex] = col;
        inner.appendChild(col);
        noteIndex++;
      });
      mg.appendChild(inner);
      cols.appendChild(mg);
    });

    scroller.appendChild(cols);
    staff.appendChild(scroller);
    wrap.appendChild(staff);

    /* wiring */
    var pct = 100;

    function tempoAt(p) { return Math.max(20, Math.round(tempo * p / 100)); }

    function refreshSpeed() {
      speedOut.innerHTML = '<b>' + pct + '%</b><span>' + tempoAt(pct) + ' bpm</span>';
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

    function clearHi() {
      cells.forEach(function (c) { if (c) c.classList.remove('playing'); });
    }

    function reset() {
      clearHi();
      play.classList.remove('active');
      play.textContent = '\u25B6 Play';
      status.textContent = '';
    }

    play.addEventListener('click', function () {
      Audio5.ensure();
      play.classList.add('active');
      var startTempo = tempoAt(pct);
      var stepping = stepChk.input.checked && loopChk.input.checked && pct < 100;
      var passes = Math.max(1, Math.round((100 - pct) / 5));

      status.textContent = stepping
        ? 'Stepping up to normal speed'
        : (pct < 100 ? 'Practising at ' + pct + '% of normal' : '');

      Audio5.playMelody(notes, startTempo, {
        beatsPerBar: beats,
        click: clickChk.input.checked,
        countIn: countChk.input.checked ? beats : 0,
        loop: loopChk.input.checked,
        speedStep: stepping ? Math.max(1, (tempo - startTempo) / passes) : 0,
        maxTempo: tempo,
        onCount: function (left) {
          play.textContent = left > 0 ? String(left) : '\u25B6 Play';
        },
        onPass: function (p, bpm) {
          var atPct = Math.round(bpm / tempo * 100);
          status.textContent = (loopChk.input.checked ? 'Pass ' + p + ' \u00B7 ' : '') +
            atPct + '% \u00B7 ' + Math.round(bpm) + ' bpm';
        },
        onNote: function (i) {
          clearHi();
          var c = cells[i];
          if (c) {
            c.classList.add('playing');
            var box = scroller.getBoundingClientRect();
            var cb = c.getBoundingClientRect();
            if (cb.right > box.right - 40 || cb.left < box.left) {
              scroller.scrollLeft += (cb.left - box.left) - 80;
            }
          }
        },
        onStop: reset
      });
    });

    stop.addEventListener('click', function () { Audio5.stop(); reset(); });

    copy.addEventListener('click', function () {
      var txt = toAscii(piece, notes, measures);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () {
          copy.textContent = 'Copied!';
          setTimeout(function () { copy.textContent = 'Copy ASCII'; }, 1400);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = txt; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        copy.textContent = 'Copied!';
        setTimeout(function () { copy.textContent = 'Copy ASCII'; }, 1400);
      }
    });

    return wrap;
  }

  function toAscii(piece, notes, measures) {
    var lines = ['', '', '', '', ''];
    var header = (piece.title ? piece.title + '\n' : '');
    if (piece.key) header += 'Key / tono: ' + piece.key + '   Meter: ' + (piece.meter || '4/4') + '   Tempo: ' + (piece.tempo || 90) + ' bpm\n';
    header += 'Tuning (low->high): B2/B3  E3/E4  A3  D4  G4\n\n';
    for (var s = 0; s < 5; s++) lines[s] = Music.COURSES[s].label + '|';
    measures.forEach(function (bar) {
      bar.forEach(function (n) {
        var w = n.rest ? 1 : String(n.fret).length;
        for (var s = 0; s < 5; s++) {
          if (!n.rest && n.courseIndex === s) lines[s] += String(n.fret) + '-';
          else lines[s] += new Array(w + 1).join('-') + '-';
        }
      });
      for (var s2 = 0; s2 < 5; s2++) lines[s2] += '|';
    });
    return header + lines.join('\n') + '\n';
  }

  /* ---- chord diagram -------------------------------------------------- */
  function renderChordDiagram(symbol, voicing, opts) {
    opts = opts || {};
    var frets = voicing.frets;
    var played = frets.filter(function (f) { return f > 0; });
    var minF = played.length ? Math.min.apply(null, played) : 0;
    var startFret = minF > 3 ? minF : 1;
    var rows = 4;

    var box = el('div', 'chordbox');
    var head = el('div', 'chord-name', symbol);
    box.appendChild(head);

    var grid = el('div', 'chord-grid');
    if (startFret > 1) grid.appendChild(el('div', 'chord-basefret', startFret + 'fr'));

    var topRow = el('div', 'chord-top');
    for (var c = 0; c < 5; c++) {
      var mark = el('div', 'chord-mark');
      mark.textContent = frets[c] === -1 ? '\u00D7' : (frets[c] === 0 ? '\u25CB' : '');
      topRow.appendChild(mark);
    }
    grid.appendChild(topRow);

    var board = el('div', 'chord-board');
    for (var r = 0; r < rows; r++) {
      var row = el('div', 'chord-brow');
      for (var cc = 0; cc < 5; cc++) {
        var cell = el('div', 'chord-cell');
        if (frets[cc] === startFret + r) {
          var dot = el('div', 'chord-dot');
          cell.appendChild(dot);
        }
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
    grid.appendChild(board);

    var nameRow = el('div', 'chord-strings');
    Music.COURSES.forEach(function (co) { nameRow.appendChild(el('div', null, co.label)); });
    grid.appendChild(nameRow);
    box.appendChild(grid);

    var fretTxt = frets.map(function (f) { return f === -1 ? 'x' : f; }).join('-');
    box.appendChild(el('div', 'chord-frets', fretTxt + '  (1\u21925)'));

    box.addEventListener('click', function () {
      Audio5.ensure();
      Audio5.strum(frets, 'down');
    });
    box.title = 'Click to hear it';
    return box;
  }

  global.Tab = { renderTab: renderTab, renderChordDiagram: renderChordDiagram, toAscii: toAscii };
})(window);
