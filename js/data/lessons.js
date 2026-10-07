/* Cuatro Tutor - curriculum data.
   30 lessons, beginner -> advanced. Exercises are either:
     { type:'tab', melody:'<note tokens>', beats, tempo, meter, chords:[per measure] }
     { type:'progression', chords:[...one per bar], beats, tempo, meter }
   Melody token format: Note[:beats][@course]  e.g. G4  A4:0.5  r:1  C5:2@2 */
(function (global) {
  'use strict';

  var LESSONS = [
    /* ================= BEGINNER ================= */
    {
      n: 1, level: 'beginner', title: 'Meet the Cuatro',
      titleEs: 'Conoce el cuatro', minutes: 20,
      goal: 'Understand the instrument, hold it correctly, and make your first clean sound.',
      theory: [
        'The <b>cuatro puertorriqueño</b> is the national instrument of Puerto Rico. The modern cuatro has <b>ten steel strings in five double courses</b>. Each course is played as if it were a single string &mdash; your pick hits both strings at once, which is what gives the cuatro its shimmering, mandolin-like voice.',
        'Parts to know: the <i>clavijero</i> (headstock), <i>cejuela</i> (nut), <i>diapasón</i> (fretboard), <i>boca</i> (soundhole), <i>puente</i> (bridge), and the violin-shaped body called <i>aviolinado</i>.',
        '<b>Posture:</b> sit upright, rest the lower bout on your right thigh, and let the neck angle slightly upward at about 30&deg;. The cuatro should balance against your chest and forearm &mdash; your left hand must stay completely free to move, never supporting the neck.',
        '<b>The pick (púa):</b> hold a medium pick (0.7&ndash;0.88&nbsp;mm) between thumb and the side of your index finger, with only 3&ndash;4&nbsp;mm of tip showing. Keep the wrist relaxed; motion comes from the wrist, not the elbow.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Open courses, one at a time',
          instructions: 'Play each open course twice with a relaxed downstroke. Listen for a clean, ringing sound with no buzz. Both strings of the pair should speak together.',
          melody: 'B2:1 B2:1 E3:1 E3:1 A3:1 A3:1 D4:1 D4:1 G4:1 G4:1 r:1 G4:1 D4:1 A3:1 E3:1 B2:1',
          beats: 4, tempo: 70, meter: '4/4'
        }
      ],
      tips: [
        'If you hear a buzz, you are either hitting the course at an angle or pressing too lightly later on. For open strings, check that your pick passes through both strings in one motion.',
        'Rest your right forearm lightly on the edge of the body &mdash; do not anchor your palm hard on the bridge.'
      ],
      checkpoint: 'You can play all five open courses cleanly, in order, without buzzing.'
    },
    {
      n: 2, level: 'beginner', title: 'Tuning the Cuatro',
      titleEs: 'Afinando el cuatro', minutes: 25,
      goal: 'Tune all five courses accurately and understand the octave pairs.',
      theory: [
        'Standard tuning, from the <b>lowest</b> course (5th, closest to your chin) to the <b>highest</b> (1st):',
        '<table class="tuning-table"><tr><th>Course</th><th>Note name</th><th>Actual pitches</th><th>Pairing</th></tr>' +
        '<tr><td>5th (lowest)</td><td>B &mdash; Si</td><td>B2 + B3</td><td><b>Octave</b></td></tr>' +
        '<tr><td>4th</td><td>E &mdash; Mi</td><td>E3 + E4</td><td><b>Octave</b></td></tr>' +
        '<tr><td>3rd</td><td>A &mdash; La</td><td>A3 + A3</td><td>Unison</td></tr>' +
        '<tr><td>2nd</td><td>D &mdash; Re</td><td>D4 + D4</td><td>Unison</td></tr>' +
        '<tr><td>1st (highest)</td><td>G &mdash; Sol</td><td>G4 + G4</td><td>Unison</td></tr></table>',
        'Every course is a <b>perfect fourth</b> above the one below it: B &rarr; E &rarr; A &rarr; D &rarr; G. This "all fourths" layout is the cuatro\'s superpower: <b>any shape you learn can be moved to any pair of courses without changing its fingering</b>. Guitar players lose this because of the guitar\'s B-string offset &mdash; the cuatro never breaks the pattern.',
        '<b>Tuning by ear (5th-fret method):</b> fret 5 on any course and it matches the <i>next open course up</i>. Fret 5 of the 5th course (B) = open 4th (E). Fret 5 of the 4th = open 3rd (A), and so on.',
        'The two lowest courses are strung in <b>octaves</b>. When you tune them, you must tune the thin string a full octave above the thick one &mdash; this is what gives the low end its sparkle.'
      ],
      exercises: [
        {
          type: 'tab', title: 'The 5th-fret check',
          instructions: 'Each pair should sound identical. Play the fretted note, then the open course above it, and adjust until the beating stops.',
          melody: 'B2:1 E3:1 E3:1 A3:1 A3:1 D4:1 D4:1 G4:1',
          beats: 2, tempo: 60, meter: '4/4',
          note: 'The engine automatically places these notes; listen to the pairs as fret-5 then open.'
        }
      ],
      tips: [
        'Tune <b>up</b> to the target pitch, never down &mdash; approaching from below takes the slack out of the string and holds better.',
        'Steel strings on a short scale go out of tune quickly with temperature. Re-check between every practice session.'
      ],
      checkpoint: 'All five courses are in tune and the octave pairs on courses 4 and 5 sound like one rich note, not two separate ones.'
    },
    {
      n: 3, level: 'beginner', title: 'The Right Hand: Picking',
      titleEs: 'La mano derecha', minutes: 25,
      goal: 'Build a steady, even alternate-picking motion.',
      theory: [
        '<b>Alternate picking</b> means strict down-up-down-up (&#9661;&#9651;&#9661;&#9651;). On the cuatro this is the engine behind every fast jíbaro run. Mark it mentally: downstrokes land on the beat, upstrokes on the "and".',
        'The motion is a small wrist rotation, like turning a key. Your pick should travel just far enough to clear both strings of the course &mdash; excess motion is the single biggest limit on speed.',
        'Keep the pick <b>almost parallel</b> to the strings but angled 10&ndash;15&deg; so it slices rather than slaps. This is what prevents the "clack" sound beginners get on the doubled strings.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Eighth-note pulse on one course',
          instructions: 'Strict down-up. Count "1 and 2 and 3 and 4 and". Start at 60 bpm; only raise the tempo when 10 reps are flawless.',
          melody: 'G4:0.5 G4:0.5 G4:0.5 G4:0.5 G4:0.5 G4:0.5 G4:0.5 G4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5',
          beats: 4, tempo: 66, meter: '4/4'
        },
        {
          type: 'tab', title: 'Crossing courses',
          instructions: 'The hard part is changing course without losing the down-up pattern. Keep the wrist moving even while crossing.',
          melody: 'G4:0.5 D4:0.5 G4:0.5 D4:0.5 D4:0.5 A3:0.5 D4:0.5 A3:0.5 A3:0.5 E3:0.5 A3:0.5 E3:0.5 E3:0.5 B2:0.5 E3:0.5 B2:0.5',
          beats: 4, tempo: 66, meter: '4/4'
        }
      ],
      tips: [
        'Practise with the metronome at the top of the page. Evenness beats speed every single time.',
        'If your hand tenses up, stop for 20 seconds and shake it out. Tension is a habit you can learn &mdash; do not install it.'
      ],
      checkpoint: 'Two minutes of continuous eighth notes at 80 bpm with no hesitation when crossing courses.'
    },
    {
      n: 4, level: 'beginner', title: 'Reading Cuatro Tab',
      titleEs: 'Leyendo tablatura', minutes: 15,
      goal: 'Read and play from the tab format used throughout this course.',
      theory: [
        'Cuatro tab has <b>five lines, one per course</b>. The <b>top</b> line is the 1st course (G, highest sounding) and the <b>bottom</b> line is the 5th course (B, lowest). This is upside-down compared to pitch on a staff, but it matches what you see looking down at the instrument.',
        'A number on a line means "press that fret on that course and play it". <b>0</b> means play the course open. Numbers stacked vertically are played together as a chord; numbers left-to-right are played in sequence.',
        'In this app each column also shows the <b>note name</b> underneath, the <b>measure number</b> above, and the <b>chord symbol</b> for the bar. Press <b>&#9654; Play</b> to hear exactly what the tab says, and watch the highlight follow along.',
        'Column width hints at rhythm: wide columns are long notes, narrow columns are eighth notes.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Read and play',
          instructions: 'Say each fret number out loud as you play it. Then play it again saying the note names instead.',
          melody: 'G3:1 A3:1 B3:1 C4:1 D4:1 C4:1 B3:1 A3:1 G3:2 r:2',
          beats: 4, tempo: 72, meter: '4/4', chords: ['G', 'G', 'G']
        }
      ],
      tips: ['Tab tells you <i>where</i>, not <i>how long</i> &mdash; always listen to the playback to absorb the rhythm.'],
      checkpoint: 'You can look at any column in the tab and instantly say which course and fret it means.'
    },
    {
      n: 5, level: 'beginner', title: 'Your First Scale: G Major',
      titleEs: 'La escala de Sol mayor', minutes: 30,
      goal: 'Play a one-octave G major scale in first position with correct left-hand form.',
      theory: [
        '<b>Left-hand form:</b> thumb behind the neck, roughly opposite your second finger. Fingers curved, pressing <i>just behind</i> the fret wire &mdash; not on top of it, not in the middle of the space. Pressing closer to the fret means less force and no buzz.',
        'In first position each finger owns a fret: index = fret 1, middle = fret 2, ring = fret 3, pinky = fret 4. Keep fingers hovering over their fret even when not playing.',
        'The G major scale is <b>G A B C D E F# G</b>. Notice it has one sharp, F#. This is the home key of a huge amount of jíbaro and seis repertoire.',
        'Look at the tab: the scale walks across four courses and never goes above fret 4. That compactness is the all-fourths tuning working for you.'
      ],
      exercises: [
        {
          type: 'tab', title: 'G major, one octave, up and down',
          instructions: 'Slow and perfect. Let every note ring its full value before the next one starts.',
          melody: 'G3:1 A3:1 B3:1 C4:1 D4:1 E4:1 F#4:1 G4:1 F#4:1 E4:1 D4:1 C4:1 B3:1 A3:1 G3:2',
          beats: 4, tempo: 72, meter: '4/4', chords: ['G', 'G', 'D7', 'G']
        },
        {
          type: 'tab', title: 'Scale in eighth notes',
          instructions: 'Same notes, twice the speed, strict alternate picking.',
          melody: 'G3:0.5 A3:0.5 B3:0.5 C4:0.5 D4:0.5 E4:0.5 F#4:0.5 G4:0.5 F#4:0.5 E4:0.5 D4:0.5 C4:0.5 B3:0.5 A3:0.5 G3:1',
                    beats: 4, tempo: 72, meter: '4/4', chords: ['G', 'G']
        }
      ],
      tips: [
        'Keep each finger down as long as it is useful &mdash; lifting everything between notes wastes motion.',
        'Practise the scale with your eyes closed to build the map in your hand instead of your eyes.'
      ],
      checkpoint: 'G major ascending and descending at 100 bpm in eighth notes, clean and even.'
    },
    {
      n: 6, level: 'beginner', title: 'Your First Chords: G, C, D7',
      titleEs: 'Primeros acordes', minutes: 30,
      goal: 'Finger and strum the three chords that unlock hundreds of songs.',
      theory: [
        '<b>G, C and D7</b> are the I, IV and V7 of the key of G &mdash; the backbone of seis, aguinaldo, plena and bolero accompaniment.',
        'Read the chord diagrams below: courses run left to right as <b>G D A E B</b> (1st to 5th). A circle above means play open, an <b>&times;</b> means do not play that course, dots show where your fingers go.',
        '<b>Changing chords</b> is a separate skill from <i>holding</i> them. Practise the move itself: form G, lift all fingers an inch, place C, lift, place D7. Twenty times, no strumming. Then add the strum.',
        'Aim for a <b>pivot finger</b> &mdash; any finger that stays on the same note between two chords. Pivots make changes nearly instant.'
      ],
      chordFocus: ['G', 'C', 'D7'],
      exercises: [
        {
          type: 'progression', title: 'Two beats per chord',
          instructions: 'Four downstrokes per bar. Do not stop the strumming hand even if the chord is not perfect yet &mdash; the rhythm is more important than the clarity at this stage.',
          chords: ['G', 'G', 'C', 'C', 'D7', 'D7', 'G', 'G'],
          beats: 4, tempo: 70, meter: '4/4'
        }
      ],
      tips: [
        'Press with the <b>tips</b> of your fingers so you do not accidentally mute the neighbouring course.',
        'Strum from the wrist over the end of the fretboard, not back by the bridge &mdash; it is warmer and more típico.'
      ],
      checkpoint: 'You can change G &rarr; C &rarr; D7 &rarr; G in time at 70 bpm without a gap in the rhythm.'
    },
    {
      n: 7, level: 'beginner', title: 'Rhythm in 4/4 and the Rasgueo',
      titleEs: 'El ritmo y el rasgueo', minutes: 30,
      goal: 'Play three essential strum patterns with a steady pulse.',
      theory: [
        'A <b>rasgueo</b> is a strum. On the cuatro, patterns are built from down (&#9661;), up (&#9651;) and <b>muted chops</b> (x), where you release left-hand pressure just enough to deaden the strings while you strum.',
        '<b>Pattern 1 &ndash; basic:</b> &#9661; &#9661; &#9661; &#9661; (one per beat). The foundation.',
        '<b>Pattern 2 &ndash; eighth-note:</b> &#9661;&#9651; &#9661;&#9651; &#9661;&#9651; &#9661;&#9651;. The hand never stops moving; it floats down-up continuously.',
        '<b>Pattern 3 &ndash; típico with chop:</b> &#9661; &nbsp;x&nbsp; &#9661;&#9651; &nbsp;x&nbsp; &mdash; the chop on beats 2 and 4 imitates the güiro and instantly makes you sound Puerto Rican.',
        'The golden rule: your <b>strumming hand keeps moving in a constant eighth-note pendulum</b>. To leave a note out, you simply miss the strings on that stroke. This is how you stay locked to the beat.'
      ],
      chordFocus: ['G', 'C', 'D7'],
      exercises: [
        {
          type: 'progression', title: 'One chord, three patterns',
          instructions: 'Turn the metronome on. Play 8 bars of G with pattern 1, then 8 with pattern 2, then 8 with pattern 3.',
          chords: ['G', 'G', 'G', 'G', 'C', 'C', 'D7', 'G'],
          beats: 4, tempo: 76, meter: '4/4'
        }
      ],
      tips: ['Tap your foot on beats 1 and 3. If the foot stops, the music has stopped.'],
      checkpoint: 'You can hold pattern 3 for a full minute without drifting from the metronome.'
    },
    {
      n: 8, level: 'beginner', title: 'I&ndash;IV&ndash;V: Playing in a Key',
      titleEs: 'Tocando en tonalidad', minutes: 25,
      goal: 'Understand chord numbering and change chords smoothly inside a key.',
      theory: [
        'Number the chords built on each step of the scale with roman numerals. In <b>G major</b>: I=G, ii=Am, iii=Bm, IV=C, V=D (or D7), vi=Em, vii&deg;=F#dim.',
        'The <b>I&ndash;IV&ndash;V7</b> trio carries most traditional repertoire because V7 creates tension that <i>wants</i> to fall back to I. That pull is the engine of the seis and the aguinaldo.',
        'Because you now think in numbers, the same progression transfers to any key: in D major, I&ndash;IV&ndash;V7 = D&ndash;G&ndash;A7. Learn the pattern once, use it everywhere.',
        'Open the <b>Chords</b> tab and switch the key selector to see the full family of chords for any key, with diagrams generated for the cuatro.'
      ],
      chordFocus: ['G', 'C', 'D7', 'Em', 'Am'],
      exercises: [
        {
          type: 'progression', title: 'The vi turn: G&ndash;Em&ndash;C&ndash;D7',
          instructions: 'A classic 8-bar cycle. Use the eighth-note pendulum strum.',
          chords: ['G', 'Em', 'C', 'D7', 'G', 'Em', 'C', 'D7'],
          beats: 4, tempo: 80, meter: '4/4'
        },
        {
          type: 'tab', title: 'Melody over the changes',
          instructions: 'Play this line while hearing the chords in your head. Each bar targets a chord tone.',
          melody: 'B3:1 D4:1 G4:1 D4:1 B3:1 E4:1 G4:1 E4:1 C4:1 E4:1 G4:1 E4:1 D4:1 F#4:1 A4:1 F#4:1',
          beats: 4, tempo: 80, meter: '4/4', chords: ['G', 'Em', 'C', 'D7']
        }
      ],
      tips: ['Say the roman numeral out loud as you change. You are training analysis and hands at the same time.'],
      checkpoint: 'You can play the G&ndash;Em&ndash;C&ndash;D7 cycle at 90 bpm and name each chord\'s number without thinking.'
    },
    {
      n: 9, level: 'beginner', title: 'The Aguinaldo Lilt: 6/8 and 3/4',
      titleEs: 'El aire de aguinaldo', minutes: 30,
      goal: 'Feel and play in compound time, the heartbeat of the aguinaldo.',
      theory: [
        'Much of Puerto Rico\'s Christmas repertoire &mdash; the <b>aguinaldo</b> &mdash; lives in <b>6/8</b>: six eighth notes per bar, grouped in two pulses of three. Count "<b>ONE</b>-two-three <b>FOUR</b>-five-six".',
        'In <b>3/4</b> you get three even beats instead. The famous ambiguity between the two (<i>hemiola</i>) is everywhere in danza and seis &mdash; the same six eighths heard as 3+3 or 2+2+2.',
        'The characteristic cuatro strum for 6/8 is <b>&#9661; &#9651;&#9661;&#9651; &#9661; &#9651;</b> with the accent landing hard on beats 1 and 4.',
        'Melodically, aguinaldos love <b>stepwise motion and repeated notes</b>, because they were built to carry improvised sung verses (<i>décimas</i>).'
      ],
      chordFocus: ['G', 'C', 'D7', 'Am'],
      exercises: [
        {
          type: 'tab', title: '6/8 melody in G',
          instructions: 'Count the six eighths out loud. Accent the first note of each group of three.',
          melody: 'G4:0.5 A4:0.5 B4:0.5 A4:0.5 G4:0.5 F#4:0.5 G4:0.5 A4:0.5 B4:0.5 C5:1.5 B4:0.5 A4:0.5 G4:0.5 F#4:0.5 E4:0.5 D4:0.5 G4:3',
          beats: 3, tempo: 96, meter: '6/8', chords: ['G', 'C', 'D7', 'G']
        }
      ],
      tips: ['Conduct with your free hand: big down on 1, big down on 4. The body learns compound time faster than the brain does.'],
      checkpoint: 'You can switch between counting a bar as 6/8 and as 3/4 while playing the same six notes.'
    },
    {
      n: 10, level: 'beginner', title: 'First Full Piece',
      titleEs: 'Tu primera pieza', minutes: 40,
      goal: 'Combine scale, chords and rhythm into one complete 16-bar piece.',
      theory: [
        'This is your beginner checkpoint. The piece uses only notes from G major in first position, and the chords G, C, D7 and Em that you already know.',
        'Structure: <b>A section</b> (8 bars, the melody) then <b>B section</b> (8 bars, a higher answer). This question-and-answer shape is how nearly all traditional melodies are built.',
        'Practise it in three passes: (1) melody alone slowly, (2) chords alone with the strum, (3) melody at tempo. If you have a friend or a second recording, play one part each &mdash; that is how jíbaro music actually works.'
      ],
      chordFocus: ['G', 'C', 'D7', 'Em'],
      exercises: [
        {
          type: 'tab', title: 'Mi Primera Melodía &mdash; A section',
          instructions: 'Key of G major. Keep it legato and singing.',
          melody: 'D4:1 G4:1 B4:1 G4:1 A4:2 F#4:2 E4:1 G4:1 B4:1 D5:1 B4:2 A4:2 G4:1 F#4:1 E4:1 D4:1 G4:4',
          beats: 4, tempo: 84, meter: '4/4', chords: ['G', 'D7', 'Em', 'C', 'D7', 'G']
        },
        {
          type: 'tab', title: 'Mi Primera Melodía &mdash; B section',
          instructions: 'The answering phrase, one octave up in feel. Watch the F# in bar 3.',
          melody: 'B4:1 C5:1 D5:1 B4:1 A4:2 G4:2 A4:1 B4:1 C5:1 A4:1 F#4:2 D4:2 G4:1 A4:1 B4:1 A4:1 G4:4',
          beats: 4, tempo: 84, meter: '4/4', chords: ['G', 'C', 'Em', 'D7', 'D7', 'G']
        }
      ],
      tips: ['Record yourself. It is uncomfortable and it is the fastest feedback you will ever get.'],
      checkpoint: 'Both sections played back-to-back at 84 bpm, from memory, with no stops.'
    },

    /* ================= INTERMEDIATE ================= */
    {
      n: 11, level: 'intermediate', title: 'New Keys: D and A',
      titleEs: 'Nuevas tonalidades', minutes: 30,
      goal: 'Expand your chord vocabulary and play comfortably in D and A major.',
      theory: [
        '<b>D major</b> (F#, C#) and <b>A major</b> (F#, C#, G#) are the other two home keys of the jíbaro tradition, chosen because they sit well for singers.',
        'In D major: I=D, IV=G, V7=A7, vi=Bm. In A major: I=A, IV=D, V7=E7, vi=F#m.',
        'Notice how the families overlap: D and G appear in both keys. Many seis performances simply shift between these neighbouring keys.',
        'With all-fourths tuning, the <b>movable shapes</b> matter more than named chords. Learn one major shape and one minor shape that use no open strings, and you can play all twelve keys by sliding.'
      ],
      chordFocus: ['D', 'G', 'A7', 'Bm', 'A', 'E7', 'F#m'],
      exercises: [
        {
          type: 'progression', title: 'D major cycle',
          instructions: 'I&ndash;vi&ndash;IV&ndash;V7 in D. Then repeat the whole thing in A major by moving every shape.',
          chords: ['D', 'Bm', 'G', 'A7', 'D', 'Bm', 'G', 'A7'],
          beats: 4, tempo: 84, meter: '4/4'
        },
        {
          type: 'tab', title: 'D major scale, first position',
          instructions: 'Two sharps: F# and C#. Say them as you pass them.',
          melody: 'D4:1 E4:1 F#4:1 G4:1 A4:1 B4:1 C#5:1 D5:1 C#5:1 B4:1 A4:1 G4:1 F#4:1 E4:1 D4:2',
          beats: 4, tempo: 84, meter: '4/4', chords: ['D', 'D', 'A7', 'D']
        }
      ],
      tips: ['When a new key feels alien, play its scale for two minutes before touching any chord. Ears first.'],
      checkpoint: 'You can play a I&ndash;vi&ndash;IV&ndash;V7 cycle fluently in G, D and A.'
    },
    {
      n: 12, level: 'intermediate', title: 'The All-Fourths Fretboard',
      titleEs: 'El diapasón en cuartas', minutes: 35,
      goal: 'Navigate the whole neck using one repeating shape system.',
      theory: [
        'Because every course is a perfect fourth apart, <b>a shape keeps its sound anywhere on the neck</b> &mdash; move it up a course, it transposes up a fourth; move it up a fret, it transposes up a semitone. No exceptions, no "B-string correction".',
        'Practical consequence: the major scale has only <b>three</b> fingering shapes across the whole neck, not five like the guitar\'s CAGED system.',
        'A useful anchor: the <b>octave shape</b>. From any note, the same note one octave higher is <b>two courses up and three frets higher</b>. Memorise that one relationship and you can find any note instantly.',
        'Another: a note <b>one course up at the same fret</b> is a perfect fourth higher. Two courses up at the same fret is a minor seventh higher.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Octave leaps',
          instructions: 'Each pair is the same note an octave apart: 2 courses up, 3 frets higher. Feel the shape, do not read the numbers.',
          melody: 'E3:1 E4:1 F#3:1 F#4:1 G3:1 G4:1 A3:1 A4:1 B3:1 B4:1 C4:1 C5:1 D4:1 D5:1 E4:2',
          beats: 4, tempo: 80, meter: '4/4'
        },
        {
          type: 'tab', title: 'One shape, moved up the neck',
          instructions: 'A four-note cell repeated in three positions. Identical fingering each time.',
          melody: 'G3:0.5 A3:0.5 B3:0.5 C4:0.5 A3:0.5 B3:0.5 C#4:0.5 D4:0.5 B3:0.5 C#4:0.5 D#4:0.5 E4:0.5 C4:0.5 D4:0.5 E4:0.5 F4:0.5',
          beats: 4, tempo: 80, meter: '4/4'
        }
      ],
      tips: ['Name every note out loud while you play it. Fretboard fluency is 80% naming, 20% fingering.'],
      checkpoint: 'Given any note, you can find three places to play it within two seconds.'
    },
    {
      n: 13, level: 'intermediate', title: 'Minor Keys and the Am&ndash;E7 Cycle',
      titleEs: 'Tonalidades menores', minutes: 35,
      goal: 'Play natural and harmonic minor, and the dominant cycle that defines the seis.',
      theory: [
        '<b>A natural minor</b>: A B C D E F G. <b>A harmonic minor</b> raises the 7th to G#, creating the leading tone that makes <b>E7</b> pull strongly home to Am.',
        'The <b>Am &harr; E7</b> alternation is the single most common harmonic cycle in jíbaro music. Many seises are sung over nothing else, bar after bar, while the cuatro improvises above.',
        'The G# of E7 against the G natural of the melody is the characteristic flavour. Learn to hear it &mdash; that half-step clash is the sound of the tradition.',
        'Related keys: Am is the relative minor of C major (same notes). Em is the relative minor of G. Moving between relative major and minor is a core expressive device.'
      ],
      chordFocus: ['Am', 'E7', 'Dm', 'G', 'C', 'F'],
      exercises: [
        {
          type: 'tab', title: 'A harmonic minor',
          instructions: 'Notice the wide step between F and G# &mdash; that is the exotic interval that gives the scale its character.',
          melody: 'A3:1 B3:1 C4:1 D4:1 E4:1 F4:1 G#4:1 A4:1 G#4:1 F4:1 E4:1 D4:1 C4:1 B3:1 A3:2',
          beats: 4, tempo: 80, meter: '4/4', chords: ['Am', 'E7', 'Am', 'Am']
        },
        {
          type: 'progression', title: 'The seis cycle',
          instructions: 'Two bars each. Let the E7 ring with tension before resolving.',
          chords: ['Am', 'Am', 'E7', 'E7', 'Am', 'Am', 'E7', 'Am'],
          beats: 4, tempo: 92, meter: '4/4'
        }
      ],
      tips: ['Over E7, land on G# or D. Over Am, land on A, C or E. That alone makes you sound like you know what you are doing.'],
      checkpoint: 'You can improvise 8 bars over the Am&ndash;E7 cycle using only scale tones, landing on chord tones at each change.'
    },
    {
      n: 14, level: 'intermediate', title: 'Seis Accompaniment',
      titleEs: 'Acompañamiento de seis', minutes: 35,
      goal: 'Play authentic rhythmic accompaniment behind a singer or soloist.',
      theory: [
        'When another instrument takes the melody, the cuatro switches to <b>acompañamiento</b>: a dense, percussive strum that locks with the güiro.',
        '<b>The chop:</b> on beats 2 and 4, flatten your fretting fingers just enough to kill the ring, and strum. You get a dry "chk" that functions like a snare drum. This is the backbone of seis and plena accompaniment.',
        '<b>Dynamic shaping:</b> accent beat 1 strongly, keep 2 and 4 crisp and quiet, and let the "and" of 3 lift. Flat, unaccented strumming is the mark of a beginner.',
        '<b>Voicing choice:</b> for accompaniment, favour voicings in the middle of the neck so you do not collide with the singer or the bordonúa.'
      ],
      chordFocus: ['Am', 'E7', 'G', 'C', 'D7'],
      exercises: [
        {
          type: 'progression', title: 'Chop pattern over the seis cycle',
          instructions: 'Pattern: &#9661; x &#9661;&#9651; x. Keep the pendulum going; the chop replaces a strum, it never pauses the hand.',
          chords: ['Am', 'E7', 'Am', 'E7', 'Am', 'Dm', 'E7', 'Am'],
          beats: 4, tempo: 100, meter: '4/4'
        }
      ],
      tips: ['Practise the chop on a single chord for five minutes until it is dry and consistent. It is a percussion skill, not a chord skill.'],
      checkpoint: 'Your chop is audible as rhythm with no pitch bleeding through, at 110 bpm.'
    },
    {
      n: 15, level: 'intermediate', title: 'Picking Speed and String Crossing',
      titleEs: 'Velocidad y cruce de cuerdas', minutes: 35,
      goal: 'Develop accurate alternate picking at higher tempos.',
      theory: [
        'Speed is not effort &mdash; it is <b>efficiency</b>. Three limits to attack: pick depth (too deep), pick travel (too far), and left-right synchronisation (the real culprit 90% of the time).',
        '<b>Synchronisation drill:</b> play a four-note pattern and listen specifically for notes that sound "soft". A soft note means the finger landed late relative to the pick.',
        'The hardest crossing is an <b>outside</b> change (upstroke on one course then downstroke on the next course over). Isolate those; everything else gets easier for free.',
        'Protocol: find the tempo where you are 100% clean. Practise there for 5 minutes. Raise by 4 bpm. If you break, drop 8 bpm. This beats grinding at your failure tempo every time.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Four-note chromatic cell',
          instructions: 'Index-middle-ring-pinky, one finger per fret. Every note must be equally loud.',
          melody: 'E3:0.25 F3:0.25 F#3:0.25 G3:0.25 A3:0.25 A#3:0.25 B3:0.25 C4:0.25 D4:0.25 D#4:0.25 E4:0.25 F4:0.25 G4:0.25 G#4:0.25 A4:0.25 A#4:0.25',
          beats: 4, tempo: 72, meter: '4/4'
        },
        {
          type: 'tab', title: 'Scale sequence in fours',
          instructions: 'G major, groups of four, ascending. The classic speed builder.',
          melody: 'G3:0.25 A3:0.25 B3:0.25 C4:0.25 A3:0.25 B3:0.25 C4:0.25 D4:0.25 B3:0.25 C4:0.25 D4:0.25 E4:0.25 C4:0.25 D4:0.25 E4:0.25 F#4:0.25 D4:0.25 E4:0.25 F#4:0.25 G4:0.25 E4:0.25 F#4:0.25 G4:0.25 A4:0.25 F#4:0.25 G4:0.25 A4:0.25 B4:0.25 G4:1',
          beats: 4, tempo: 76, meter: '4/4'
        }
      ],
      tips: ['Five focused minutes daily beats an hour on Sunday. Speed is built by the nervous system overnight, not in the session.'],
      checkpoint: 'Sixteenth notes at 100 bpm, clean and even, for 8 bars.'
    },
    {
      n: 16, level: 'intermediate', title: 'Arpeggios',
      titleEs: 'Arpegios', minutes: 30,
      goal: 'Outline chords melodically across the courses.',
      theory: [
        'An <b>arpeggio</b> plays a chord one note at a time. It is the bridge between accompaniment and soloing: you keep the harmony clear while generating a melodic line.',
        'The cuatro arpeggio sound &mdash; bright, harp-like, with doubled strings ringing &mdash; is one of the most recognisable textures in Puerto Rican music, used constantly in boleros and danzas.',
        '<b>Technique:</b> let notes ring into each other. Keep the whole chord shape held down while you pick through it, rather than fretting one note at a time.',
        'Practise <b>inversions</b>: start the arpeggio from the 3rd or 5th instead of the root. This is how you create smooth bass motion between chords.'
      ],
      chordFocus: ['G', 'C', 'D7', 'Em'],
      exercises: [
        {
          type: 'tab', title: 'Triad arpeggios through the cycle',
          instructions: 'Hold each chord shape; let the notes overlap and ring.',
          melody: 'G3:0.5 B3:0.5 D4:0.5 G4:0.5 D4:0.5 B3:0.5 G3:0.5 B3:0.5 E3:0.5 G3:0.5 B3:0.5 E4:0.5 B3:0.5 G3:0.5 E3:0.5 G3:0.5 C4:0.5 E4:0.5 G4:0.5 E4:0.5 C4:0.5 G3:0.5 E3:0.5 C4:0.5 D4:0.5 F#4:0.5 A4:0.5 F#4:0.5 D4:0.5 A3:0.5 F#4:0.5 A4:0.5',
          beats: 4, tempo: 80, meter: '4/4', chords: ['G', 'Em', 'C', 'D7']
        }
      ],
      tips: ['If the arpeggio sounds choppy, you are lifting fingers too early. Hold the shape.'],
      checkpoint: 'You can arpeggiate any of your chords up and down without looking at the fretboard.'
    },
    {
      n: 17, level: 'intermediate', title: 'Double Stops: 3rds and 6ths',
      titleEs: 'Terceras y sextas', minutes: 35,
      goal: 'Harmonise melodies with the signature two-note cuatro sound.',
      theory: [
        'Playing <b>two courses at once</b> in parallel 3rds or 6ths is the most characteristic harmonic device in cuatro playing. It instantly thickens a melody and mimics two singers.',
        '<b>3rds</b> sound sweet and close; <b>6ths</b> sound open and ringing. Both are simply the melody plus a harmony note from the same scale.',
        '<b>Technique:</b> strike both courses with a single controlled stroke, angling the pick so it sweeps through all four strings evenly. This takes practice &mdash; it is not a strum and not a single-note pluck.',
        'In jíbaro soloing, players typically lead into the final phrase of a verse with a run of 3rds, then resolve to a single note.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Harmonised G scale in 3rds (melody line)',
          instructions: 'First learn the harmony line alone, then add it under the melody from Lesson 5.',
          melody: 'B3:1 C4:1 D4:1 E4:1 F#4:1 G4:1 A4:1 B4:1 A4:1 G4:1 F#4:1 E4:1 D4:1 C4:1 B3:2',
          beats: 4, tempo: 76, meter: '4/4', chords: ['G', 'G', 'D7', 'G']
        },
        {
          type: 'tab', title: '6ths descending',
          instructions: 'Wider and more open. Great for endings.',
          melody: 'G4:1 E4:1 F#4:1 D4:1 E4:1 C4:1 D4:1 B3:1 C4:1 A3:1 B3:1 G3:1 A3:1 F#3:1 G3:2',
          beats: 4, tempo: 76, meter: '4/4', chords: ['G', 'C', 'G', 'D7']
        }
      ],
      tips: ['Pick angle is everything. Rotate the pick slightly flatter so it glides across both courses.'],
      checkpoint: 'A full G major scale harmonised in 3rds, both courses speaking cleanly.'
    },
    {
      n: 18, level: 'intermediate', title: 'Legato: Hammer-ons, Pull-offs, Slides',
      titleEs: 'Ligados', minutes: 30,
      goal: 'Produce notes with the left hand for fluid, vocal phrasing.',
      theory: [
        '<b>Hammer-on:</b> pick a note, then slam a higher finger down onto the same course to sound the next note without picking. Drop the finger from the knuckle, fast and close.',
        '<b>Pull-off:</b> the reverse &mdash; the fretting finger plucks sideways as it releases, sounding the lower note underneath. It must be a pluck, not a lift.',
        '<b>Slide:</b> keep pressure and move along the course. The cuatro\'s short scale makes slides quick and expressive; they are everywhere in típico playing.',
        'Legato is not just technique &mdash; it is <b>phrasing</b>. Picked notes are consonants, legato notes are vowels. A line that is entirely picked sounds mechanical.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Hammer-on / pull-off pairs',
          instructions: 'Pick only the first note of each pair; the second comes from the left hand alone.',
          melody: 'A3:0.5 B3:0.5 B3:0.5 C4:0.5 C4:0.5 D4:0.5 D4:0.5 E4:0.5 E4:0.5 D4:0.5 D4:0.5 C4:0.5 C4:0.5 B3:0.5 A3:1',
          beats: 4, tempo: 78, meter: '4/4', chords: ['Am', 'Am']
        },
        {
          type: 'tab', title: 'Slides into target notes',
          instructions: 'Slide from a fret below into each strong beat. Keep the pressure constant through the slide.',
          melody: 'F#4:0.5 G4:1.5 A4:0.5 B4:1.5 C5:0.5 D5:1.5 B4:0.5 G4:1.5',
          beats: 2, tempo: 78, meter: '4/4', chords: ['G', 'G', 'C', 'G']
        }
      ],
      tips: ['Pull-offs are weak for almost everyone. Give them twice the practice time of hammer-ons.'],
      checkpoint: 'You can play a scale entirely legato (picking only once per course) at a steady tempo.'
    },
    {
      n: 19, level: 'intermediate', title: 'Danza and Bolero Feel',
      titleEs: 'Aire de danza y bolero', minutes: 30,
      goal: 'Play the elegant salon styles with correct rhythm and touch.',
      theory: [
        'The <b>danza puertorriqueña</b> is a 19th-century salon form &mdash; graceful, often in 2/4 or 6/8, with a formal structure: a <i>paseo</i> (introduction) followed by contrasting sections. <i>La Borinqueña</i> is the most famous example.',
        'The <b>bolero</b> is slower and romantic, built on the <i>cinquillo</i> rhythm: a five-note cell of long-short-long-short-long filling two beats. Internalising the cinquillo is the key to the style.',
        '<b>Touch:</b> both styles ask for a much softer attack than the seis. Play nearer the fretboard, reduce pick depth, and let arpeggios replace percussive strumming.',
        'Harmonically these styles are richer: expect <b>secondary dominants</b> (a V7 of a chord other than the tonic), diminished passing chords, and 6th and maj7 colours.'
      ],
      chordFocus: ['G', 'C', 'D7', 'E7', 'Am', 'A7', 'Bm'],
      exercises: [
        {
          type: 'progression', title: 'Danza progression with a secondary dominant',
          instructions: 'Note the E7 in bar 3 &mdash; it is the V7 of Am, borrowed to make the move more elegant.',
          chords: ['G', 'G', 'E7', 'Am', 'A7', 'D7', 'G', 'D7'],
          beats: 4, tempo: 76, meter: '4/4'
        },
        {
          type: 'tab', title: 'Bolero arpeggio texture',
          instructions: 'Soft and even. This is accompaniment, not a solo &mdash; stay out of the singer\'s way.',
          melody: 'A3:0.5 C4:0.5 E4:0.5 A4:0.5 E4:0.5 C4:0.5 A3:0.5 C4:0.5 D4:0.5 F4:0.5 A4:0.5 D5:0.5 A4:0.5 F4:0.5 D4:0.5 F4:0.5 E3:0.5 G#3:0.5 B3:0.5 E4:0.5 B3:0.5 G#3:0.5 E3:0.5 B3:0.5 A3:0.5 C4:0.5 E4:0.5 A4:0.5 A4:1 r:1',
          beats: 4, tempo: 72, meter: '4/4', chords: ['Am', 'Dm', 'E7', 'Am']
        }
      ],
      tips: ['Danza lives on <i>rubato</i> &mdash; small, tasteful tempo stretches. Learn it strict first, then breathe.'],
      checkpoint: 'You can play the same progression twice: once as a driving seis, once as a gentle bolero.'
    },
    {
      n: 20, level: 'intermediate', title: 'Starting to Improvise',
      titleEs: 'Comenzando a improvisar', minutes: 40,
      goal: 'Create your own melodic lines over the traditional cycles.',
      theory: [
        'Improvisation on the cuatro is <b>not</b> running scales. It is making short sung-sounding phrases with space between them, exactly like the <i>trovador</i> improvising a décima.',
        '<b>Rule 1 &mdash; leave space.</b> Play a two-bar phrase, then rest for two bars. Beginners fill every beat; masters frame their ideas with silence.',
        '<b>Rule 2 &mdash; target chord tones on strong beats.</b> Over Am, land on A, C or E at beat 1. Over E7, land on E, G#, B or D. Everything between can be scale motion.',
        '<b>Rule 3 &mdash; repeat and vary.</b> Say an idea, then say it again slightly changed. Repetition is what makes an improvisation sound composed instead of random.',
        'Start with just <b>three notes</b>. Severe limits force musicality; unlimited choice produces noodling.'
      ],
      chordFocus: ['Am', 'E7', 'G', 'C', 'D7'],
      exercises: [
        {
          type: 'tab', title: 'Call and response over Am&ndash;E7',
          instructions: 'Bars 1-2 are the "call", bars 3-4 the "response". Then make up your own response.',
          melody: 'A4:0.5 C5:0.5 B4:1 A4:1 r:1 E4:0.5 G#4:0.5 B4:1 E4:1 r:1 C5:0.5 B4:0.5 A4:1 G#4:1 r:1 A4:2 r:2',
          beats: 4, tempo: 90, meter: '4/4', chords: ['Am', 'E7', 'E7', 'Am']
        },
        {
          type: 'progression', title: 'Backing track to solo over',
          instructions: 'Press play and improvise on top. Three notes only to start: A, C and E.',
          chords: ['Am', 'Am', 'E7', 'E7', 'Am', 'Am', 'E7', 'Am'],
          beats: 4, tempo: 96, meter: '4/4'
        }
      ],
      tips: ['Sing the phrase before you play it. If you cannot sing it, you are playing your fingers\' ideas, not your own.'],
      checkpoint: 'Sixteen bars of improvisation over the seis cycle that another person would call "a melody", not "an exercise".'
    },

    /* ================= ADVANCED ================= */
    {
      n: 21, level: 'advanced', title: 'Tremolo',
      titleEs: 'El trémolo', minutes: 40,
      goal: 'Sustain a singing melody with rapid repeated picking.',
      theory: [
        'The cuatro cannot sustain a long note by itself, so players use <b>tremolo</b> &mdash; very fast repeated down-up picking on a single course &mdash; to create the illusion of a continuous, vocal tone. It is the cuatro\'s most beautiful effect.',
        '<b>Mechanics:</b> minimal pick depth (barely clearing the strings), very small wrist rotation, loose grip. The grip is the key: too tight and you cannot exceed about 8 notes per second.',
        '<b>Evenness over speed.</b> An uneven fast tremolo sounds frantic; an even moderate one sounds like a held note. Aim for a smooth continuous shimmer with no audible individual attacks.',
        '<b>Moving tremolo:</b> the hard part is changing notes while the tremolo continues, so the sustain never breaks. Practise changing the left hand exactly on a downstroke.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Tremolo note change',
          instructions: 'Each written note is actually tremoloed for its full value. Change the left hand without interrupting the right.',
          melody: 'A4:2 B4:2 C5:2 B4:2 A4:2 G4:2 A4:4',
          beats: 4, tempo: 72, meter: '4/4', chords: ['Am', 'Am', 'E7', 'Am']
        },
        {
          type: 'tab', title: 'Tremolo melody in D',
          instructions: 'A lyrical line. Keep the dynamic swelling and fading like a singer would.',
          melody: 'D5:2 C#5:1 B4:1 A4:2 F#4:2 G4:2 A4:2 B4:1 A4:1 D5:2',
          beats: 4, tempo: 72, meter: '4/4', chords: ['D', 'A7', 'G', 'D']
        }
      ],
      tips: ['Practise tremolo on one open course for 60 seconds at a time, watching only for evenness. Boring, and it works.'],
      checkpoint: 'A 30-second tremolo melody where a listener cannot pick out individual pick strokes.'
    },
    {
      n: 22, level: 'advanced', title: 'Seis Chorreao at Speed',
      titleEs: 'Seis chorreao', minutes: 45,
      goal: 'Execute fast sixteenth-note runs in the fastest traditional seis style.',
      theory: [
        'The <b>seis chorreao</b> is the fast, driving seis &mdash; "chorreao" suggesting something pouring out. Tempos commonly run 140&ndash;180 bpm with continuous sixteenth-note cuatro lines over a relentless Am&ndash;E7 or G&ndash;D7 cycle.',
        'At this speed you cannot think note-by-note. You must have <b>pre-built vocabulary</b>: scale fragments, arpeggio shapes and turnarounds that your hands already own, which you assemble in real time.',
        '<b>Economy:</b> favour runs that stay inside one position. Every position shift at 160 bpm is a risk; the great players shift at phrase boundaries, not mid-run.',
        '<b>Accenting</b> is what keeps a long sixteenth-note run musical: accent the first of each group of four, and occasionally displace the accent to create drive.'
      ],
      chordFocus: ['Am', 'E7', 'Dm'],
      exercises: [
        {
          type: 'tab', title: 'Sixteenth-note run, A minor',
          instructions: 'Start at 90 bpm. Accent every fourth note. Only accelerate when it is perfectly even.',
          melody: 'A3:0.25 B3:0.25 C4:0.25 D4:0.25 E4:0.25 F4:0.25 G4:0.25 A4:0.25 B4:0.25 A4:0.25 G4:0.25 F4:0.25 E4:0.25 D4:0.25 C4:0.25 B3:0.25 A3:0.25 C4:0.25 B3:0.25 D4:0.25 C4:0.25 E4:0.25 D4:0.25 F4:0.25 E4:0.25 G#4:0.25 B4:0.25 E4:0.25 A4:0.5 r:0.5',
          beats: 4, tempo: 90, meter: '4/4', chords: ['Am', 'E7']
        },
        {
          type: 'tab', title: 'Chorreao turnaround lick',
          instructions: 'A vocabulary phrase to end a verse. Memorise it in all three common keys.',
          melody: 'E4:0.25 G#4:0.25 B4:0.25 D5:0.25 C5:0.25 B4:0.25 A4:0.25 G#4:0.25 B4:1 D5:1 A4:2 E4:1 A3:1',
          beats: 4, tempo: 100, meter: '4/4', chords: ['E7', 'Am']
        }
      ],
      tips: ['Record at target tempo and listen back. The ear in the moment lies; the recording does not.'],
      checkpoint: 'Eight bars of continuous sixteenths at 140 bpm with clear accents.'
    },
    {
      n: 23, level: 'advanced', title: 'Jíbaro Ornamentation',
      titleEs: 'Adornos jíbaros', minutes: 35,
      goal: 'Decorate melodies with the ornaments that define the traditional voice.',
      theory: [
        '<b>Grace note (mordente):</b> a lightning-fast note a step above or below, crushed into the main note. Written as a tiny note; played as a hammer-on or pull-off that barely occupies time.',
        '<b>Chromatic approach:</b> arrive at a target note from a half step below. It creates a pull that makes simple melodies sound professional. Use it on strong beats.',
        '<b>Turn (grupeto):</b> main note, note above, main note, note below, main note &mdash; all fast. A hallmark of the danza and the more ornate seis styles.',
        '<b>Where to ornament:</b> on long notes and at phrase ends &mdash; exactly where a singer would. Ornamenting every note destroys the melody; ornamenting the destination note illuminates it.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Chromatic approach notes',
          instructions: 'Every strong beat is approached from a half step below.',
          melody: 'F#4:0.25 G4:0.75 A#4:0.25 B4:0.75 C5:0.25 C#5:0.25 D5:1.5 C#5:0.5 D5:1.5 B4:0.25 C5:0.25 B4:1.5',
          beats: 2, tempo: 84, meter: '4/4', chords: ['G', 'G', 'D7', 'G']
        },
        {
          type: 'tab', title: 'Turns on long notes',
          instructions: 'The four fast notes before each long one form the turn. Keep them light.',
          melody: 'A4:0.25 B4:0.25 A4:0.25 G4:0.25 A4:2 r:1 C5:0.25 D5:0.25 C5:0.25 B4:0.25 C5:2 r:1',
          beats: 4, tempo: 80, meter: '4/4', chords: ['Am', 'C']
        }
      ],
      tips: ['Ornaments steal time from the <i>previous</i> note, not the target. The target must land exactly on the beat.'],
      checkpoint: 'You can take a plain 8-bar melody and ornament it tastefully on the fly.'
    },
    {
      n: 24, level: 'advanced', title: 'Navigating the Whole Neck',
      titleEs: 'Dominando el diapasón', minutes: 40,
      goal: 'Play any scale in any position and shift between them invisibly.',
      theory: [
        'Thanks to all-fourths tuning, the major scale needs only <b>three fingering shapes</b> to cover the neck, and each repeats every course. Learn the three, and the neck is solved.',
        '<b>Shifting invisibly:</b> move position during a <i>slide</i>, a <i>legato</i> note, or an open string &mdash; never during a picked note on a strong beat. The listener should hear music, not travel.',
        '<b>Guide fingers:</b> when shifting, keep one finger lightly on the course as you move. It preserves accuracy and gives a subtle, idiomatic portamento.',
        '<b>Position practice:</b> take a melody you know and play it in three different positions. Same notes, completely different fingerings &mdash; this is what fretboard freedom actually means.'
      ],
      exercises: [
        {
          type: 'tab', title: 'G major across three positions',
          instructions: 'Ascend in low position, continue in middle, finish high. Mark where you shift.',
          melody: 'G3:0.5 A3:0.5 B3:0.5 C4:0.5 D4:0.5 E4:0.5 F#4:0.5 G4:0.5 A4:0.5 B4:0.5 C5:0.5 D5:0.5 E5:0.5 F#5:0.5 G5:1',
          beats: 4, tempo: 80, meter: '4/4', chords: ['G', 'G']
        },
        {
          type: 'tab', title: 'Two-octave descending run',
          instructions: 'Coming down is harder. Plan your shifts in advance and keep them at the same spots every time.',
          melody: 'G5:0.25 F#5:0.25 E5:0.25 D5:0.25 C5:0.25 B4:0.25 A4:0.25 G4:0.25 F#4:0.25 E4:0.25 D4:0.25           C4:0.25 B3:0.25 A3:0.25 G3:0.5',
                    beats: 4, tempo: 84, meter: '4/4', chords: ['G']
        }
      ],
      tips: ['Practise shifts silently: move the hand between positions with no picking, 20 times, until it is muscle memory.'],
      checkpoint: 'Any major scale, any position, two octaves, without hesitation.'
    },
    {
      n: 25, level: 'advanced', title: 'Chord Melody',
      titleEs: 'Melodía armonizada', minutes: 45,
      goal: 'Play melody and harmony simultaneously as a solo arrangement.',
      theory: [
        '<b>Chord melody</b> means the melody is always the top note, with chord tones filling underneath. One cuatro becomes a whole ensemble.',
        '<b>Method:</b> (1) learn the melody, (2) identify the chord for each melody note, (3) find a voicing of that chord with the melody note on top, (4) connect them with as little hand movement as possible.',
        'You do not need full chords. <b>Two or three notes</b> under the melody is usually richer and far more playable &mdash; often just the 3rd and 7th, which define the chord quality.',
        'Add <b>bass motion</b> on weak beats: melody on 1 and 3, a low chord root on 2 and 4. This creates the illusion of two players.'
      ],
      chordFocus: ['G', 'C', 'D7', 'Em', 'Am'],
      exercises: [
        {
          type: 'tab', title: 'Melody with alternating bass',
          instructions: 'Melody notes on the beat, low notes between. Keep the two layers at different volumes.',
          melody: 'G4:0.5 G3:0.5 B4:0.5 G3:0.5 A4:0.5 D4:0.5 F#4:0.5 D4:0.5 G4:0.5 E3:0.5 E4:0.5 E3:0.5 C4:0.5 C4:0.5 E4:0.5 G3:0.5 D4:0.5 D4:0.5 F#4:0.5 A3:0.5 G4:2',
          beats: 4, tempo: 72, meter: '4/4', chords: ['G', 'Em', 'D7']
        }
      ],
      tips: ['Arrange one 8-bar melody you love. One good arrangement teaches more than twenty exercises.'],
      checkpoint: 'A complete 8-bar chord-melody arrangement of a tune from the Songs tab.'
    },
    {
      n: 26, level: 'advanced', title: 'Syncopation, Plena and Bomba',
      titleEs: 'Síncopa, plena y bomba', minutes: 40,
      goal: 'Play Afro-Puerto Rican rhythms and displaced accents convincingly.',
      theory: [
        '<b>Plena</b> is the "sung newspaper" of Puerto Rico &mdash; a 2/4 rhythm driven by hand drums called <i>panderetas</i>. The cuatro plays a syncopated, percussive figure that leaves space for the drums.',
        '<b>Bomba</b> is older and more African in origin, built on call-and-response between a lead drum and a dancer. Harmonically simple, rhythmically complex &mdash; often one or two chords with enormous rhythmic variation.',
        '<b>Syncopation</b> means accenting the weak parts of the beat &mdash; the "and" and the "e-a" subdivisions. The pendulum rule still applies: keep the hand moving in constant eighths or sixteenths and simply miss the strings where you want silence.',
        '<b>Anticipation</b> is the most important device: play the chord change an eighth note <i>early</i>, tying it over the barline. This single habit transforms stiff playing into Caribbean playing.'
      ],
      chordFocus: ['C', 'G7', 'F', 'Am', 'D7'],
      exercises: [
        {
          type: 'progression', title: 'Plena groove',
          instructions: 'Accent the "and" of 2. Chop on the downbeats, let the offbeats ring.',
          chords: ['C', 'G7', 'C', 'G7', 'C', 'F', 'G7', 'C'],
          beats: 4, tempo: 104, meter: '4/4'
        },
        {
          type: 'tab', title: 'Syncopated melodic figure',
          instructions: 'Almost nothing lands on the downbeat. Count out loud the whole way through.',
          melody: 'r:0.5 G4:0.5 r:0.5 A4:0.5 G4:0.5 r:0.5 E4:1 r:0.5 C5:0.5 r:0.5 B4:0.5 A4:0.5 r:0.5 G4:1',
          beats: 4, tempo: 96, meter: '4/4', chords: ['C', 'G7']
        }
      ],
      tips: ['Clap the rhythm away from the instrument first. If you cannot clap it, you cannot play it.'],
      checkpoint: 'You can anticipate every chord change by an eighth note without losing the pulse.'
    },
    {
      n: 27, level: 'advanced', title: 'Modal Colours: Mapeyé and Fandango',
      titleEs: 'Colores modales', minutes: 40,
      goal: 'Use modal scales for the deeper, older seis varieties.',
      theory: [
        'Not every seis is major or minor. The slow, mournful <b>seis mapeyé</b> and the ceremonial <b>seis fandango</b> carry strong modal and Andalusian colouring inherited from Spain.',
        '<b>Phrygian</b> (E F G A B C D over an E root) gives the flamenco-adjacent sound: the flat 2nd (F over E) is the signature. The <i>Andalusian cadence</i> &mdash; Am&ndash;G&ndash;F&ndash;E &mdash; is its harmonic form and appears throughout jíbaro music.',
        '<b>Dorian</b> (minor with a raised 6th) sounds less sad than natural minor &mdash; useful for medium-tempo seises that should not sound heavy.',
        '<b>Mixolydian</b> (major with a flat 7th) fits dominant-chord vamps and gives a bright, folk-like openness.',
        'The mapeyé is often played <b>rubato</b>, nearly free in time, following the singer. Learn to stretch.'
      ],
      chordFocus: ['Am', 'G', 'F', 'E7', 'Dm'],
      exercises: [
        {
          type: 'tab', title: 'E Phrygian line',
          instructions: 'Lean on the F natural &mdash; the flat 2nd is the whole flavour.',
          melody: 'E4:1 F4:1 G4:1 A4:1 B4:1 A4:1 G4:1 F4:1 E4:2 F4:0.5 E4:0.5 D4:1 E4:4',
          beats: 4, tempo: 70, meter: '4/4', chords: ['E7', 'Am', 'F', 'E7']
        },
        {
          type: 'progression', title: 'Andalusian cadence',
          instructions: 'Am&ndash;G&ndash;F&ndash;E, the oldest cadence in the repertoire. Play it slow and heavy.',
          chords: ['Am', 'G', 'F', 'E7', 'Am', 'G', 'F', 'E7'],
          beats: 4, tempo: 68, meter: '4/4'
        }
      ],
      tips: ['Hold the final E chord much longer than feels comfortable. Mapeyé is about weight and patience.'],
      checkpoint: 'You can improvise in E Phrygian over an Andalusian cadence and make it sound ancient, not academic.'
    },
    {
      n: 28, level: 'advanced', title: 'Arpeggio Targeting Over Turnarounds',
      titleEs: 'Arpegios sobre giros', minutes: 40,
      goal: 'Solo with harmonic precision through fast chord movement.',
      theory: [
        'When chords move quickly, scales alone sound vague. <b>Arpeggio targeting</b> means consciously landing on a defining chord tone at each change &mdash; usually the 3rd or 7th, because those carry the chord\'s identity.',
        '<b>Guide tones:</b> in a ii&ndash;V&ndash;I, the 7th of one chord falls by a half step to the 3rd of the next. Follow that thread and your line will spell the harmony automatically.',
        '<b>Secondary dominants:</b> a V7 of any chord. Over them, use the harmonic-minor scale of the chord being targeted &mdash; this is what gives traditional players their distinctive pre-resolution tension.',
        '<b>Enclosure:</b> approach a target note from a half step above and a half step below before landing on it. It is the single most effective way to make a line sound deliberate.'
      ],
      chordFocus: ['Am', 'Dm', 'E7', 'G', 'C', 'A7', 'D7'],
      exercises: [
        {
          type: 'tab', title: 'Guide-tone line, ii&ndash;V&ndash;i in A minor',
          instructions: 'Each bar lands on the 3rd or 7th of the chord. Hear how the line pulls itself forward.',
          melody: 'D4:0.5 F4:0.5 A4:0.5 C5:0.5 B4:0.5 A4:0.5 G#4:0.5 B4:0.5 G#4:0.5 B4:0.5 D5:0.5 B4:0.5 A4:0.5 E4:0.5 C4:0.5 A3:0.5 A3:2 r:2',
          beats: 4, tempo: 88, meter: '4/4', chords: ['Dm', 'E7', 'Am']
        },
        {
          type: 'tab', title: 'Enclosure drill',
          instructions: 'Every target note is surrounded first from above, then below.',
          melody: 'A4:0.25 F#4:0.25 G4:1.5 B4:0.25 G#4:0.25 A4:1.5 D5:0.25 B4:0.25 C5:1.5 A4:0.25 F#4:0.25 G4:1.5',
          beats: 2, tempo: 84, meter: '4/4', chords: ['G', 'Am', 'C', 'G']
        }
      ],
      tips: ['Practise playing <i>only</i> the target notes first &mdash; one note per bar. Then connect them. Structure before decoration.'],
      checkpoint: 'You can solo over a fast turnaround and a listener can hear the chord changes from your line alone.'
    },
    {
      n: 29, level: 'advanced', title: 'Building a Solo',
      titleEs: 'Construyendo un solo', minutes: 45,
      goal: 'Shape a complete improvised statement with narrative arc.',
      theory: [
        'A great solo is a <b>story</b>, not a demonstration. It has an opening statement, development, a climax, and a resolution &mdash; exactly like a well-sung décima.',
        '<b>Motif development:</b> state a short idea (2&ndash;4 notes). Then repeat it transposed, rhythmically displaced, inverted, extended, fragmented. One idea can sustain an entire chorus.',
        '<b>Shape:</b> start in the middle register and quietly. Build register, density and volume toward the climax around three-quarters through. Then resolve low and calm. Most players start at 100% and have nowhere to go.',
        '<b>Dynamics</b> are produced by pick depth and attack point: nearer the bridge is brighter and louder, over the soundhole is warmer and softer. Use the whole range.',
        '<b>Vocabulary:</b> keep a notebook of licks that work. Great improvisers are not inventing from nothing &mdash; they are recombining a deep, personal library.'
      ],
      exercises: [
        {
          type: 'tab', title: 'Motif and four developments',
          instructions: 'Bar 1 is the motif. Bars 2-5 develop it: transposed, displaced, extended, fragmented.',
          melody: 'A4:0.5 C5:0.5 B4:1 r:2 D5:0.5 F5:0.5 E5:1 r:2 r:1 A4:0.5 C5:0.5 B4:1 r:1 A4:0.5 C5:0.5 B4:0.5 D5:0.5 C5:0.5 B4:0.5 A4:1 A4:0.5 C5:0.5 r:1 B4:2 A4:4',
          beats: 4, tempo: 88, meter: '4/4', chords: ['Am', 'Dm', 'E7', 'Am', 'E7', 'Am']
        },
        {
          type: 'progression', title: 'Full-form backing for a solo',
          instructions: '16 bars. Plan your arc before you press play: where is your climax?',
          chords: ['Am', 'Am', 'Dm', 'Dm', 'E7', 'E7', 'Am', 'Am', 'C', 'C', 'G', 'G', 'Dm', 'E7', 'Am', 'E7'],
          beats: 4, tempo: 100, meter: '4/4'
        }
      ],
      tips: ['Give yourself a one-word emotional instruction before each solo &mdash; "patient", "defiant", "homesick". It works better than any theory.'],
      checkpoint: 'A 16-bar solo with a clear climax that you could describe in words afterwards.'
    },
    {
      n: 30, level: 'advanced', title: 'Performance and Arrangement',
      titleEs: 'Interpretación y arreglo', minutes: 45,
      goal: 'Arrange a complete performance and play effectively in an ensemble.',
      theory: [
        'In the traditional <b>orquesta jíbara</b>, the cuatro is the lead voice, the <b>guitar</b> holds the harmony, the <b>bordonúa</b> or bass carries the low end, and the <b>güiro</b> drives the rhythm. Your job changes constantly between melody, fills and accompaniment &mdash; and knowing when to stop playing is the most valuable skill of all.',
        '<b>Arrangement template:</b> Intro (4&ndash;8 bars, often the last phrase of the melody) &rarr; Head (the melody) &rarr; Solo section &rarr; Head again &rarr; Tag ending (repeat the final phrase two or three times, slowing) &rarr; final chord.',
        '<b>Dynamics in ensemble:</b> drop your volume by half when accompanying a singer. The difference between an amateur and a professional group is almost entirely dynamic discipline.',
        '<b>Trading:</b> swapping 4- or 8-bar solos with another player. Listen to their phrase and answer it &mdash; respond to their idea rather than playing your prepared one.',
        '<b>Practice routine going forward:</b> 10 min technique (scales, tremolo, picking), 10 min repertoire, 10 min improvisation, 10 min new material. Daily beats marathon.'
      ],
      chordFocus: ['G', 'C', 'D7', 'Em', 'Am', 'E7'],
      exercises: [
        {
          type: 'tab', title: 'Intro and tag ending',
          instructions: 'The intro sets the key and tempo; the tag repeats and slows. Use both on any song in the Songs tab.',
          melody: 'D5:0.5 B4:0.5 G4:0.5 D4:0.5 E4:0.5 F#4:0.5 G4:1 A4:0.5 B4:0.5 D5:1 B4:0.5 A4:0.5 G4:1 A4:1 B4:1 A4:1 F#4:1 G4:2 r:2 B4:0.5 A4:0.5 G4:1 B4:0.5 A4:0.5 G4:1 G4:4',
          beats: 4, tempo: 84, meter: '4/4', chords: ['G', 'C', 'D7', 'G', 'D7', 'G']
        }
      ],
      tips: [
        'Learn to count the band in: "Uno, dos, tres, cuatro" at the exact tempo you want. Sloppy counts cause sloppy starts.',
        'Play for dancers and singers whenever possible. The tradition is social music, and it teaches things no exercise can.'
      ],
      checkpoint: 'A complete performance of one piece with intro, melody, a solo chorus, and a tag ending &mdash; played start to finish without stopping.'
    }
  ];

  var LEVELS = [
    { id: 'beginner', title: 'Beginner', es: 'Principiante', desc: 'Hold it, tune it, and play your first scale, chords and complete piece.' },
    { id: 'intermediate', title: 'Intermediate', es: 'Intermedio', desc: 'New keys, the all-fourths fretboard, traditional rhythms, and your first improvisations.' },
    { id: 'advanced', title: 'Advanced', es: 'Avanzado', desc: 'Tremolo, fast seis runs, ornamentation, chord melody, modal playing and performance.' }
  ];

  global.CURRICULUM = { lessons: LESSONS, levels: LEVELS };
})(window);
