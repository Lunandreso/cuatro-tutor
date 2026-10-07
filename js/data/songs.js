/* Cuatro Tutor - songbook.
   Each piece lists its key (tono), meter, tempo, chord cycle and strum, plus one
   or more sections of tab. Melody token format: Note[:beats][@course]. */
(function (global) {
  'use strict';

  var SONGS = [
    {
      id: 'aguinaldo-jibaro',
      title: 'Aguinaldo Jíbaro',
      titleEs: 'Aguinaldo Jíbaro',
      style: 'Aguinaldo',
      difficulty: 'Intermediate',
      key: 'D minor (relative F major)',
      keyEs: 'Re menor (relativo Fa mayor)',
      scale: 'D harmonic minor (D E F G A A# C#) + F major in the coro',
      meter: '6/8', beats: 3, tempo: 104,
      cycle: 'Dm &ndash; A7 &ndash; Gm &ndash; Dm, with an F &ndash; C7 coro',
      strum: '&#9661; &#9651;&#9661;&#9651; &#9661; &#9651; &mdash; accent beats 1 and 4',
      about: 'The <i>aguinaldo jíbaro</i> is the mountain-country branch of the aguinaldo family &mdash; the song of the <i>jíbaro</i>, the Puerto Rican highland farmer. Like all aguinaldos it exists to carry improvised <i>décimas</i>, so the melody is a flexible frame rather than a fixed tune. It alternates a minor <i>verso</i> with a brighter coro in the relative major, which is what gives the form its characteristic lift.',
      arrangementNote: 'Original practice arrangement in the traditional style, set in D minor / F major to match the tonality of the widely circulated arrangements of this tune. It is <b>not</b> a transcription of any particular published or copyrighted arrangement &mdash; use it as a practice frame and substitute the version you know with the "Create your own tab" lab below.',
      tips: [
        'Start at 50&ndash;60% speed with the count-in and click on, and only move up when you can play a full pass without stopping.',
        'C# belongs to A7 and the harmonic minor; over Dm and Gm use C natural. That single note is what makes the cadence sound Puerto Rican rather than merely minor.',
        'The A# in the Gm bars is the same finger shape as the F chord &mdash; think of it as borrowing from the coro key.',
        'When the coro arrives in F major, lighten the strum. The contrast between verso and coro is the whole point of the form.'
      ],
      sections: [
        {
          name: 'Verso (D minor)',
          chords: ['Dm', 'Dm', 'A7', 'A7', 'Dm', 'Gm', 'A7', 'Dm'],
          melody: 'D5:0.5 C5:0.5 A4:0.5 D5:1.5 ' +
                  'A4:0.5 D5:0.5 F5:0.5 E5:1.5 ' +
                  'E5:0.5 D5:0.5 C#5:0.5 A4:1.5 ' +
                  'C#5:0.5 E5:0.5 A4:0.5 C#5:1.5 ' +
                  'D5:0.5 F5:0.5 D5:0.5 A4:1.5 ' +
                  'G4:0.5 A#4:0.5 D5:0.5 A#4:1.5 ' +
                  'A4:0.5 C#5:0.5 E5:0.5 C#5:1.5 ' +
                  'D5:3'
        },
        {
          name: 'Coro (F major)',
          chords: ['F', 'C7', 'F', 'Dm', 'Gm', 'A7', 'Dm', 'Dm'],
          melody: 'F4:0.5 A4:0.5 C5:0.5 A4:1.5 ' +
                  'G4:0.5 A#4:0.5 E4:0.5 G4:1.5 ' +
                  'A4:0.5 C5:0.5 F5:0.5 C5:1.5 ' +
                  'D5:0.5 A4:0.5 F4:0.5 D4:1.5 ' +
                  'G4:0.5 A#4:0.5 D5:0.5 A#4:1.5 ' +
                  'A4:0.5 C#5:0.5 E5:0.5 C#5:1.5 ' +
                  'D5:0.5 C5:0.5 A4:0.5 F4:1.5 ' +
                  'D4:3'
        }
      ]
    },
    {
      id: 'aguinaldo-cagueno',
      title: 'Aguinaldo Cagüeño',
      titleEs: 'Aguinaldo Cagüeño',
      style: 'Aguinaldo',
      difficulty: 'Beginner',
      key: 'A minor',
      keyEs: 'La menor',
      scale: 'A harmonic minor (A B C D E F G#)',
      meter: '6/8', beats: 3, tempo: 100,
      cycle: 'Am &harr; E7',
      strum: '&#9661; &#9651;&#9661;&#9651; &#9661; &#9651; &mdash; accent beats 1 and 4',
      about: 'The aguinaldo is Puerto Rico\'s Christmas song form, sung door to door during the <i>parrandas</i>. The "cagüeño" variety, named for Caguas, is one of the most widely sung, and its melody is built to carry improvised ten-line verses (<i>décimas</i>).',
      arrangementNote: 'Practice arrangement in the traditional style &mdash; the melody of an aguinaldo changes with every singer, so treat this as a frame to decorate rather than a fixed text.',
      tips: [
        'The G# comes from the harmonic minor and only appears over E7. Over Am, use G natural.',
        'Keep the 6/8 lilt: count "ONE-two-three FOUR-five-six" and let beats 1 and 4 breathe.'
      ],
      sections: [
        {
          name: 'Melodía',
          chords: ['Am', 'E7', 'E7', 'Am', 'Am', 'E7', 'E7', 'Am'],
          melody: 'A4:0.5 A4:0.5 B4:0.5 C5:0.5 B4:0.5 A4:0.5 ' +
                  'G#4:0.5 A4:0.5 B4:0.5 A4:1.5 ' +
                  'E4:0.5 G#4:0.5 B4:0.5 D5:0.5 C5:0.5 B4:0.5 ' +
                  'A4:1.5 r:1.5 ' +
                  'C5:0.5 C5:0.5 D5:0.5 E5:0.5 D5:0.5 C5:0.5 ' +
                  'B4:0.5 C5:0.5 D5:0.5 C5:1.5 ' +
                  'B4:0.5 A4:0.5 G#4:0.5 A4:0.5 B4:0.5 G#4:0.5 ' +
                  'A4:3'
        }
      ]
    },
    {
      id: 'aguinaldo-orocoveno',
      title: 'Aguinaldo Orocoveño',
      style: 'Aguinaldo',
      difficulty: 'Beginner',
      key: 'A minor',
      keyEs: 'La menor',
      scale: 'A natural + harmonic minor',
      meter: '6/8', beats: 3, tempo: 96,
      cycle: 'Am &ndash; E7 &ndash; Dm &ndash; Am',
      strum: '&#9661; &#9651;&#9661;&#9651; &#9661; &#9651;',
      about: 'Named for the mountain town of Orocovis, in the very centre of the island. It is slightly more melancholy than the cagüeño and uses the iv chord (Dm), which gives it a darker colour.',
      arrangementNote: 'Practice arrangement in the traditional style.',
      tips: [
        'The drop to Dm in bar 3 is the signature move &mdash; lean into it.',
        'Try playing the melody once plain, then once with grace notes from Lesson 23.'
      ],
      sections: [
        {
          name: 'Melodía',
          chords: ['Am', 'E7', 'Dm', 'Am', 'Am', 'E7', 'E7', 'Am'],
          melody: 'E4:0.5 A4:0.5 A4:0.5 B4:0.5 A4:0.5 G#4:0.5 ' +
                  'A4:1.5 E4:1.5 ' +
                  'E4:0.5 F4:0.5 E4:0.5 D4:0.5 C4:0.5 B3:0.5 ' +
                  'A3:1.5 r:1.5 ' +
                  'A4:0.5 B4:0.5 C5:0.5 B4:0.5 A4:0.5 G#4:0.5 ' +
                  'A4:0.5 B4:0.5 C5:0.5 D5:1.5 ' +
                  'C5:0.5 B4:0.5 A4:0.5 G#4:0.5 B4:0.5 D5:0.5 ' +
                  'A4:3'
        }
      ]
    },
    {
      id: 'seis-chorreao',
      title: 'Seis Chorreao',
      style: 'Seis',
      difficulty: 'Advanced',
      key: 'A minor',
      keyEs: 'La menor',
      scale: 'A natural minor, with G# over E7',
      meter: '4/4', beats: 4, tempo: 140,
      cycle: 'Am &harr; E7 (relentless)',
      strum: '&#9661; x &#9661;&#9651; x &mdash; hard chop on 2 and 4',
      about: 'The fastest and most virtuosic of the seis family &mdash; the name suggests music "pouring out". Played at 140&ndash;180 bpm with continuous sixteenth-note cuatro lines over a tonic&ndash;dominant cycle, it is the showpiece of the jíbaro repertoire.',
      arrangementNote: 'A practice solo built from traditional chorreao vocabulary. Learn it, then recombine the fragments in your own order &mdash; that is exactly how the style works.',
      tips: [
        'Start at 90 bpm. The run must be perfectly even before it is allowed to be fast.',
        'Accent the first of every group of four sixteenths or the line turns to mush.',
        'Bars 7&ndash;8 are the classic turnaround lick &mdash; memorise them in all keys.'
      ],
      sections: [
        {
          name: 'Solo cuatro',
          chords: ['Am', 'E7', 'E7', 'Am', 'Am', 'Dm', 'E7', 'Am'],
          melody: 'A4:0.25 B4:0.25 C5:0.25 B4:0.25 A4:0.25 G4:0.25 E4:0.25 G4:0.25 A4:0.5 E4:0.5 A4:0.5 C5:0.5 ' +
                  'B4:0.25 A4:0.25 G#4:0.25 A4:0.25 B4:0.25 C5:0.25 D5:0.25 B4:0.25 E4:1 r:1 ' +
                  'E4:0.25 G#4:0.25 B4:0.25 D5:0.25 C5:0.25 B4:0.25 A4:0.25 G#4:0.25 A4:1 E4:1 ' +
                  'A4:2 r:2 ' +
                  'C5:0.25 B4:0.25 A4:0.25 G4:0.25 F4:0.25 E4:0.25 D4:0.25 C4:0.25 B3:0.5 C4:0.5 D4:0.5 E4:0.5 ' +
                  'F4:0.25 E4:0.25 D4:0.25 C4:0.25 B3:0.25 C4:0.25 D4:0.25 E4:0.25 A3:1 r:1 ' +
                  'E4:0.25 G#4:0.25 B4:0.25 E5:0.25 D5:0.25 C5:0.25 B4:0.25 A4:0.25 G#4:1 B4:1 ' +
                  'A4:4'
        }
      ]
    },
    {
      id: 'seis-fajardeno',
      title: 'Seis Fajardeño',
      style: 'Seis',
      difficulty: 'Intermediate',
      key: 'A major',
      keyEs: 'La mayor',
      scale: 'A major (A B C# D E F# G#)',
      meter: '4/4', beats: 4, tempo: 120,
      cycle: 'A &ndash; D &ndash; E7 &ndash; A',
      strum: '&#9661; &#9651;&#9661;&#9651; &#9661;&#9651; &mdash; bright and driving',
      about: 'From Fajardo on the east coast. Unlike most seises it lives in a <b>major</b> key, which makes it sound festive and open rather than plaintive. A favourite for dancing.',
      arrangementNote: 'Practice arrangement in the traditional style.',
      tips: [
        'Three sharps: F#, C# and G#. Play the A major scale for two minutes before starting.',
        'Bar 6 is an A major arpeggio across three courses &mdash; let it ring.'
      ],
      sections: [
        {
          name: 'Melodía',
          chords: ['A', 'A', 'D', 'E7', 'E7', 'A', 'E7', 'A'],
          melody: 'A4:0.5 B4:0.5 C#5:0.5 A4:0.5 E4:1 A4:1 ' +
                  'C#5:0.5 B4:0.5 A4:0.5 B4:0.5 C#5:1 A4:1 ' +
                  'D5:0.5 C#5:0.5 B4:0.5 A4:0.5 F#4:1 A4:1 ' +
                  'B4:0.5 C#5:0.5 D5:0.5 B4:0.5 A4:2 ' +
                  'E4:0.5 F#4:0.5 G#4:0.5 A4:0.5 B4:1 G#4:1 ' +
                  'A4:0.5 C#5:0.5 E5:0.5 C#5:0.5 A4:2 ' +
                  'D5:0.5 C#5:0.5 B4:0.5 A4:0.5 G#4:0.5 F#4:0.5 E4:1 ' +
                  'A4:4'
        }
      ]
    },
    {
      id: 'seis-mapeye',
      title: 'Seis Mapeyé',
      style: 'Seis',
      difficulty: 'Intermediate',
      key: 'A minor / E Phrygian',
      keyEs: 'La menor',
      scale: 'A natural minor over the Andalusian cadence',
      meter: '4/4', beats: 4, tempo: 66,
      cycle: 'Am &ndash; G &ndash; F &ndash; E7 (Andalusian cadence)',
      strum: 'Slow arpeggios or soft &#9661; on 1 and 3 &mdash; often nearly free in time',
      about: 'The slow, mournful seis. The mapeyé is sung rubato, the cuatro following the singer rather than driving them, and its harmony is the ancient Andalusian cadence inherited from Spain. One of the deepest sounds in the tradition.',
      arrangementNote: 'Practice arrangement in the traditional style.',
      tips: [
        'Do not play this in strict time. Stretch the long notes; wait at the end of each phrase.',
        'Hold the final E7 far longer than feels comfortable &mdash; that weight is the style.',
        'Try the whole thing with tremolo (Lesson 21) for a singing sustained tone.'
      ],
      sections: [
        {
          name: 'Melodía',
          chords: ['Am', 'G', 'F', 'E7', 'Am', 'G', 'F', 'E7'],
          melody: 'A4:2 G4:1 A4:1 ' +
                  'B4:1 A4:1 G4:2 ' +
                  'F4:2 E4:1 F4:1 ' +
                  'E4:3 r:1 ' +
                  'C5:2 B4:1 A4:1 ' +
                  'B4:1 A4:1 G4:2 ' +
                  'A4:1 G4:1 F4:1 E4:1 ' +
                  'E4:4'
        }
      ]
    },
    {
      id: 'la-borinquena',
      title: 'La Borinqueña',
      style: 'Danza',
      difficulty: 'Beginner',
      key: 'G major',
      keyEs: 'Sol mayor',
      scale: 'G major (G A B C D E F#)',
      meter: '6/8', beats: 3, tempo: 92,
      cycle: 'G &ndash; C &ndash; D7 &ndash; G',
      strum: 'Gentle &#9661; &#9651;&#9661;&#9651; or arpeggiated &mdash; this is salon music, not a seis',
      about: 'The most famous danza puertorriqueña, with music attributed to Félix Astol Artés (1867) and now the island\'s anthem. The danza is an elegant 19th-century salon form &mdash; play it with a light touch and a little rubato.',
      arrangementNote: '<b>Simplified arrangement</b> for practice in first position. Many versions of this melody are sung; adjust the notes to the version you know &mdash; the "Create your own tab" panel at the bottom of this page lets you type your own.',
      tips: [
        'Soft attack, pick near the fretboard. Danza is never aggressive.',
        'Bars 4 and 8 are long notes &mdash; this is the perfect place to practise tremolo.'
      ],
      sections: [
        {
          name: 'Tema',
          chords: ['G', 'C', 'D7', 'G', 'G', 'C', 'D7', 'G'],
          melody: 'G4:0.5 A4:0.5 B4:0.5 B4:0.5 A4:0.5 G4:0.5 ' +
                  'A4:0.5 B4:0.5 C5:1 B4:1 ' +
                  'B4:0.5 A4:0.5 G4:0.5 F#4:0.5 G4:1 ' +
                  'G4:3 ' +
                  'B4:0.5 C5:0.5 D5:0.5 D5:0.5 C5:0.5 B4:0.5 ' +
                  'C5:0.5 B4:0.5 A4:1 G4:1 ' +
                  'A4:0.5 B4:0.5 A4:0.5 F#4:0.5 D4:1 ' +
                  'G4:3'
        }
      ]
    },
    {
      id: 'si-me-dan-pasteles',
      title: 'Si Me Dan Pasteles',
      style: 'Aguinaldo / Villancico',
      difficulty: 'Beginner',
      key: 'D major',
      keyEs: 'Re mayor',
      scale: 'D major (D E F# G A B C#)',
      meter: '4/4', beats: 4, tempo: 112,
      cycle: 'D &harr; A7',
      strum: '&#9661; &#9651;&#9661;&#9651; &#9661;&#9651; &mdash; happy and bouncing',
      about: 'A traditional Christmas <i>parranda</i> song, sung at the door when the group arrives demanding food: "if you give me pasteles, give them to me hot &mdash; cold pasteles upset people". Everyone on the island knows it.',
      arrangementNote: '<b>Simplified arrangement</b> for practice. The tune is sung many different ways; use this as a starting frame.',
      tips: [
        'Two sharps only: F# and C#.',
        'Great first song to play for other people &mdash; it only uses two chords.'
      ],
      sections: [
        {
          name: 'Melodía',
          chords: ['D', 'A7', 'D', 'A7', 'D', 'A7', 'A7', 'D'],
          melody: 'F#4:0.5 F#4:0.5 F#4:0.5 G4:0.5 A4:1 F#4:1 ' +
                  'E4:0.5 E4:0.5 E4:0.5 F#4:0.5 G4:1 E4:1 ' +
                  'F#4:0.5 G4:0.5 A4:0.5 B4:0.5 A4:1 F#4:1 ' +
                  'E4:2 D4:2 ' +
                  'A4:0.5 A4:0.5 B4:0.5 A4:0.5 G4:1 F#4:1 ' +
                  'G4:0.5 F#4:0.5 E4:0.5 D4:0.5 E4:2 ' +
                  'F#4:0.5 G4:0.5 A4:0.5 F#4:0.5 E4:1 D4:1 ' +
                  'D4:4'
        }
      ]
    },
    {
      id: 'que-bonita-bandera',
      title: 'Qué Bonita Bandera',
      style: 'Plena',
      difficulty: 'Beginner',
      key: 'C major',
      keyEs: 'Do mayor',
      scale: 'C major (C D E F G A B)',
      meter: '4/4', beats: 4, tempo: 100,
      cycle: 'C &harr; G7',
      strum: '&#9661; x &#9661;&#9651; x &mdash; percussive, leaving room for the panderetas',
      about: 'A beloved traditional plena celebrating the Puerto Rican flag. The plena is the "sung newspaper" &mdash; topical verses over a driving 2/4 hand-drum rhythm. Simple harmony, enormous rhythmic life.',
      arrangementNote: '<b>Simplified arrangement</b> of the chorus for practice.',
      tips: [
        'The chop on beats 2 and 4 matters more than the melody here. Plena is rhythm first.',
        'Try anticipating each chord change by an eighth note (Lesson 26) &mdash; it instantly sounds more authentic.'
      ],
      sections: [
        {
          name: 'Coro',
          chords: ['C', 'G7', 'C', 'C', 'C', 'G7', 'G7', 'C'],
          melody: 'G4:0.5 G4:0.5 A4:0.5 G4:0.5 E4:1 C4:1 ' +
                  'D4:0.5 E4:0.5 F4:0.5 E4:0.5 D4:2 ' +
                  'E4:0.5 F4:0.5 G4:0.5 G4:0.5 E4:1 C4:1 ' +
                  'C4:2 r:2 ' +
                  'C5:0.5 B4:0.5 C5:0.5 G4:0.5 E4:1 G4:1 ' +
                  'A4:0.5 G4:0.5 F4:0.5 E4:0.5 D4:2 ' +
                  'E4:0.5 D4:0.5 C4:0.5 D4:0.5 E4:1 G4:1 ' +
                  'C4:4'
        }
      ]
    },
    {
      id: 'el-coqui',
      title: 'El Coquí',
      style: 'Canción tradicional',
      difficulty: 'Beginner',
      key: 'C major',
      keyEs: 'Do mayor',
      scale: 'C major',
      meter: '4/4', beats: 4, tempo: 96,
      cycle: 'C &ndash; F &ndash; G7 &ndash; C',
      strum: '&#9661; &#9661; &#9661; &#9661; or &#9661; &#9651;&#9661;&#9651;',
      about: 'The traditional children\'s song about the tiny tree frog whose song fills the Puerto Rican night. Usually the first melody a child on the island learns to sing.',
      arrangementNote: '<b>Simplified arrangement</b> for practice &mdash; a perfect first melody because every note sits in first position.',
      tips: [
        'No sharps or flats &mdash; ideal for learning the fretboard in C.',
        'Play it slowly and sing along. Connecting voice to hands is the fastest way to learn.'
      ],
      sections: [
        {
          name: 'Melodía',
          chords: ['C', 'G7', 'C', 'C', 'F', 'C', 'G7', 'C'],
          melody: 'E4:1 E4:1 F4:1 G4:1 ' +
                  'G4:1 F4:1 E4:2 ' +
                  'D4:1 E4:1 F4:1 E4:1 ' +
                  'D4:2 C4:2 ' +
                  'F4:1 F4:1 E4:1 D4:1 ' +
                  'E4:1 D4:1 C4:2 ' +
                  'D4:1 E4:1 D4:1 B3:1 ' +
                  'C4:4'
        }
      ]
    },
    {
      id: 'estudio-tremolo',
      title: 'Estudio de Trémolo No. 1',
      style: 'Estudio (original)',
      difficulty: 'Advanced',
      key: 'D major',
      keyEs: 'Re mayor',
      scale: 'D major',
      meter: '4/4', beats: 4, tempo: 72,
      cycle: 'D &ndash; A7 &ndash; G &ndash; D',
      strum: 'Melody is tremoloed throughout &mdash; no strumming',
      about: 'An original study for this course. Every written note is played as a continuous tremolo for its full value, so the melody sings like a voice. The challenge is changing notes without the shimmer ever breaking.',
      arrangementNote: 'Original étude written for this course.',
      tips: [
        'Change the left hand exactly on a downstroke, never between strokes.',
        'Swell and fade each long note. A tremolo at constant volume sounds mechanical.',
        'Practise at 60 bpm first; the tremolo speed stays the same, only the note changes slow down.'
      ],
      sections: [
        {
          name: 'Estudio',
          chords: ['D', 'A7', 'D', 'D', 'G', 'D', 'A7', 'D'],
          melody: 'D5:4 ' +
                  'C#5:2 B4:2 ' +
                  'A4:4 ' +
                  'F#4:2 A4:2 ' +
                  'B4:4 ' +
                  'A4:2 G4:2 ' +
                  'F#4:2 E4:2 ' +
                  'D5:4'
        }
      ]
    },
    {
      id: 'vals-jibaro',
      title: 'Vals Jíbaro',
      style: 'Vals (original)',
      difficulty: 'Intermediate',
      key: 'G major',
      keyEs: 'Sol mayor',
      scale: 'G major',
      meter: '3/4', beats: 3, tempo: 120,
      cycle: 'G &ndash; C &ndash; D7 &ndash; Em',
      strum: '&#9661; &#9651; &#9651; &mdash; strong first beat, light 2 and 3',
      about: 'The waltz arrived in Puerto Rico through the 19th-century salons and was absorbed into the countryside repertoire. An original waltz here, written to practise arpeggiated melody and three-beat phrasing.',
      arrangementNote: 'Original piece written for this course.',
      tips: [
        'Accent beat 1 heavily and keep 2 and 3 light &mdash; that imbalance <i>is</i> the waltz.',
        'The melody outlines each chord. Name the chord tones as you play them.'
      ],
      sections: [
        {
          name: 'Tema',
          chords: ['G', 'G', 'C', 'D7', 'G', 'Em', 'D7', 'G'],
          melody: 'D4:1 G4:1 B4:1 ' +
                  'D5:2 B4:1 ' +
                  'C5:1 B4:1 A4:1 ' +
                  'B4:2 D4:1 ' +
                  'G4:1 B4:1 D5:1 ' +
                  'E5:2 D5:1 ' +
                  'C5:1 B4:1 A4:1 ' +
                  'G4:3'
        }
      ]
    },
    {
      id: 'bolero-cuatro',
      title: 'Bolero para el Cuatro',
      style: 'Bolero (original)',
      difficulty: 'Intermediate',
      key: 'A minor',
      keyEs: 'La menor',
      scale: 'A natural minor, G# over E7',
      meter: '4/4', beats: 4, tempo: 76,
      cycle: 'Am &ndash; E7 &ndash; Dm &ndash; F &ndash; Am',
      strum: 'Arpeggios, or the <i>cinquillo</i> rhythm &mdash; soft and romantic',
      about: 'An original bolero to practise lyrical playing. The bolero is the great romantic form of the Caribbean, slow and expressive, where the cuatro plays rich arpeggios behind a singer and takes short, singing solos.',
      arrangementNote: 'Original piece written for this course.',
      tips: [
        'Play at half your usual volume. Boleros are intimate.',
        'The F chord in bar 5 is the emotional peak &mdash; swell into it.',
        'Combine with the bolero arpeggio texture from Lesson 19 as an accompaniment.'
      ],
      sections: [
        {
          name: 'Tema',
          chords: ['Am', 'E7', 'Dm', 'Am', 'F', 'Dm', 'E7', 'Am'],
          melody: 'A4:1 C5:1 B4:2 ' +
                  'A4:1 G#4:1 A4:2 ' +
                  'D5:1 C5:1 B4:2 ' +
                  'A4:4 ' +
                  'C5:1 D5:1 E5:2 ' +
                  'D5:1 C5:1 B4:2 ' +
                  'B4:1 A4:1 G#4:2 ' +
                  'A4:4'
        }
      ]
    }
  ];

  global.SONGBOOK = SONGS;
})(window);
