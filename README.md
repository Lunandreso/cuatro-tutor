# Cuatro Puertorriqueño — Tutor

A self-contained web app that teaches the Puerto Rican cuatro from first contact with the
instrument through advanced technique, plus a songbook of practice pieces written in tablature
with the key (*tono*) shown for every piece.

## How to open it

Double-click **`index.html`**. That's it — no server, no build step, no dependencies.
Everything runs from `file://` in any modern browser (Chrome, Edge, Firefox, Safari).

Sound uses the Web Audio API and starts only after your first click, as browsers require.

## The four tabs

| Tab | What's in it |
| --- | --- |
| **Lecciones** | 30 lessons in three stages — 10 beginner, 10 intermediate, 10 advanced. Each has a goal, theory, playable tab exercises, practice tips, and a checkpoint. Progress is saved in your browser. |
| **Canciones y Tabs** | 12 practice pieces, each with a prominent **Tono / Key** badge, meter, tempo, scale, chord cycle, strum pattern, and full tab. Includes a "create your own tab" lab. |
| **Acordes** | Chord dictionary with generated diagrams, click-to-hear voicings, and diatonic chord families by key. |
| **Referencia** | Tuner, fretboard map, scale builder, glossary, and tuning reference. |

Every tab can be played back, follows along with a highlight, and can be exported as ASCII tab to
the clipboard.

## Play-along speed controls

Every tab and every accompaniment track carries the same transport:

- **Speed slider** — 30% to 110% of the piece's normal performance tempo. The readout shows both
  the percentage and the resulting BPM, so you always know what you're actually playing at.
- **Preset chips** — 50% · 60% · 75% · 90% · Normal, for jumping straight to a practice speed.
- **Count-in** — one bar of clicks before playback, so you can come in on time.
- **Click** — adds a metronome on top of the playback.
- **Loop** — repeats the section until you press Stop. This is the play-along mode: start the
  accompaniment looping and play the melody over it.
- **Step up** — when looping, nudges the tempo up on each repeat until you reach normal speed.
  Start at 50%, turn on Loop and Step up, and the app walks you to full tempo on its own.

The speed is always expressed relative to the piece, so "75%" means the same thing whether the
tune's normal tempo is 66 or 140 BPM.

## Tuning

The cuatro has **ten strings in five double courses**, all a perfect fourth apart:

```
course 5   B2 / B3   (octave pair)
course 4   E3 / E4   (octave pair)
course 3   A3 / A3   (unison)
course 2   D4 / D4   (unison)
course 1   G4 / G4   (unison)
```

Because every course is a fourth from its neighbour, scale and chord shapes transpose
identically across the neck — unlike a guitar, there is no "B-string" offset. The curriculum
leans on that fact repeatedly.

Note that course 1 (G4) is the **highest** course, so any pitch at or above G4 can only be
played there.

## Melody notation used in the data files

Tabs are not hand-typed fret numbers. Every tab is generated from pitches, so the fretboard
positions, chord diagrams, and audio playback can never drift out of sync.

A melody is a space-separated string of tokens:

```
Note[:beats][@course]
```

- `G4` — G above middle C, one beat
- `A4:0.5` — eighth note (durations are in quarter-note beats)
- `r:2` — two-beat rest
- `C5:2@2` — force this note onto course 2 instead of letting the engine choose
- `|` — accepted and ignored, for readability

Compound meters are expressed with the `beats` field: 6/8 is `beats: 3` with `:0.5` eighths,
3/4 is `beats: 3`.

Each exercise or section may carry a `chords` array with **exactly one symbol per measure**.
The check suite enforces this.

## Running the checks

```powershell
cscript //Nologo tests\run-checks.js
```

This validates the tuning table, round-trips every melody through pitch → fret → pitch, confirms
each piece's bar count matches its chord array, checks that nothing falls outside the playable
range, generates and inspects every chord voicing used anywhere in the app, and verifies the
standard first-position G fingering. It exits non-zero on failure.

`tests/verify.html` runs the same suite in a browser if you'd rather see it there — just open it.

A syntax-only pass over every script (including the DOM/audio files the suite can't execute
headlessly) is available as:

```powershell
cscript //Nologo tests\parse-check.js
```

And the synthesiser's tuning is verified by rendering each pitch and measuring it back with
autocorrelation:

```powershell
cscript //Nologo tests\pitch-check.js
```

This asserts every note lands within 12 cents of its target, is strongly periodic, and that
G4→G5 is a true 2:1 octave.

## How the string sound is made

The plucked-string tone is Karplus-Strong: a delay line one period long, with a damping filter
in its feedback path.

It is **not** built from Web Audio nodes, and that is deliberate. A `DelayNode` placed inside a
feedback loop has its delay clamped to a minimum of one render quantum — 128 samples, about
2.9 ms. Any pitch above roughly 344 Hz therefore collapses to that same clamped period, and
since the cuatro's open 1st course is G4 at 392 Hz, essentially the whole instrument would come
out as one resonant buzz.

Instead the string is rendered sample-by-sample into an `AudioBuffer` in plain JavaScript, then
played through an `AudioBufferSourceNode`. Two details matter for tuning:

- The read uses **fractional delay** (linear interpolation between the N and N+1 sample taps),
  so the period isn't quantised to whole samples.
- The damping filter sits inside the loop, so **its own phase delay is part of the pitch** and
  is subtracted from the delay length. Without that compensation every note plays flat, and
  increasingly so as the pitch rises.

Buffers are cached per pitch and pre-rendered before a passage starts, so rendering cost never
delays the first notes.

## Project layout

```
index.html            app shell and tab navigation
css/styles.css        theme
js/music.js           tuning, pitch↔fret mapping, melody parser, chord voicing generator
js/audio.js           Karplus-Strong plucked-string synthesis and metronome
js/tab.js             tab grid rendering, chord diagrams, ASCII export
js/data/lessons.js    the 30-lesson curriculum
js/data/songs.js      the 12-piece songbook
js/app.js             views, progress tracking, interactive tools
tests/                verification suite (console and browser)
```

## A note on the repertoire

Traditional melodies such as *La Borinqueña*, *Si Me Dan Pasteles*, *Qué Bonita Bandera*, and
*El Coquí* appear as **simplified arrangements** for practice, clearly labelled as such rather
than presented as authoritative transcriptions. The *seis* and *aguinaldo* entries — including
*Aguinaldo Jíbaro* — are original practice arrangements in the traditional style, since those
forms are improvised over formulaic tonic–dominant cycles rather than fixed pieces. They are not
transcriptions of any particular published or copyrighted arrangement. *Estudio de Trémolo*,
*Vals Jíbaro*, and *Bolero para el Cuatro* are original études written for this course.

If you know a different version of any of these tunes, use the **Create your own tab** lab in
the Canciones tab to enter it.
