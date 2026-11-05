# How a computer actually works (long-form, ~5.5 min, 6 standalone beats)

- **Content type:** Explainer / fun fact (science & tech), long-form 16:9; each beat also stands alone as a 40-60 s
  vertical Short
- **Angle (from the user's brief):** a computer can only tell whether a switch is on or off; everything else is that,
  repeated at a speed that stops making sense.
- **Publish order as Shorts:** 3 → 1 → 5 → 2 (→ 4, possibly long-form only)
- **Word count:** see below (each beat 110-140 words ≈ 45-55 s at Dot's pace)

## Voiceover

### 1. Only two things
Your computer can't actually do anything. Not the way you think. Every photo, song and game on it comes down to one tiny trick, repeated over and over. Inside the chip are billions of tiny parts called transistors. Each one holds a single answer, like a yes or a no. Eight of them in a row can stand for any one of two hundred and fifty-six things, like a letter, a colour, or a number. Line up enough of them, and you can describe a song, or a face. Change them fast enough, and the picture moves. So what's the trick? Each transistor is a switch. And all your computer can do is tell whether a switch is on, or off.

### 2. The number
Two thousand three hundred switches. That's all the first computer chip you could buy had. The chips we use now have far more, and the real number is hard to even picture. That first chip was Intel's 4004, from 1971. Each of its switches, called a transistor, is simply on or off. Say you tried to count them, one every second, without ever sleeping. Two thousand three hundred would take you under an hour. A billion would take you over thirty years. Even an everyday laptop chip has billions. And the biggest yet, Apple's M2 Ultra from 2023, has a hundred and thirty-four billion, about fifty-eight million times the first. Counting those would take you more than four thousand years.

### 3. Grace Hopper's wire
Grace Hopper carried a nanosecond in her pocket. And it shows something strange about the computer you're using right now. Hopper was a computer pioneer and a US Navy admiral. At her talks, she handed out pieces of wire about thirty centimetres long. That, she said, is a nanosecond, a billionth of a second: the farthest light can travel in that time. A microsecond was a coil three hundred metres long. She joked that programmers should hang one around their neck, to see what they were wasting. Now, a processor running at three gigahertz takes one step every third of a nanosecond. So cut her wire into three. In one tick of your computer's clock, light, the fastest thing there is, only gets about ten centimetres. Roughly the width of your hand.

### 4. A lot of waiting
Your processor spends a lot of its time doing nothing at all. It isn't broken, and it isn't lazy. And engineers have some clever tricks to stop it. A processor can finish a step in a fraction of a nanosecond. That's so fast that the rest of the computer often can't keep up. The information it needs is usually stored somewhere else, in memory, and fetching it takes time, even at the speed of electricity. So it waits. Here are the tricks. Small stores of memory right next to the processor, called caches, keep what it's likely to need close by. And it guesses what it will need next, and starts early. A lot of what makes a chip fast is simply waiting less.

### 5. Why it gets hot
Why does your computer need a fan? The heat comes from somewhere you can't see. Inside the chip are billions of tiny switches, called transistors. They flip on and off, up to billions of times a second, whenever your computer does anything at all. Each flip takes a tiny bit of electricity. On its own, that's nothing. But billions of switches, billions of times a second, add up. And that electricity doesn't get stored away anywhere. Almost all of it ends up as heat. So the fan, the metal fins and the little pipes are there to carry it away, before the chip has to slow itself down. When your fan spins up, that's the sound of arithmetic.

### 6. None of it means anything
Your computer has never seen a single photo. Not even the ones it shows you every day. All it does is shuffle patterns of on and off, very, very fast. When you open a photo, the chip isn't looking at a face. It's moving numbers that say how bright each tiny dot on your screen should be. When you play a song, it's sending numbers to a speaker. The switches don't know what a face is, or a song, or a joke. They just flip. So where does the meaning come from? It only happens when the pattern reaches you. All the meaning is on your side of the screen.

## Notes for production

- Each beat opens with its own hook and re-explains "switch / transistor" briefly, so it works alone as a Short.
- Hook and payoff (dot-script rules, Nov 2026): every beat leads with the strange fact in its first ~5 words (no
  "If/When/So" opener), opens a loop in its first two lines, and closes it in its last 5-8 s. Reordered from the first
  draft: beat 1 now reveals "it's all on/off switches" at the end; beat 2 builds to the 134 billion; beat 4 to the
  caches and guessing; beat 5 to "almost all of it ends up as heat"; beat 6 to "the meaning is on your side".
- Frame 0 of every beat is in motion (cutout skill, section 1 rule 3).
- Real person (Grace Hopper): shown only through objects (the wire, the coil) and a name label, not a drawn likeness.
- Hedges kept: "a lot of the time" (beat 4, no latency figures), "almost all the electricity... ends up as heat",
  "up to billions of times a second", "about ten centimetres". No process-node names ("3nm" etc.).
- Corrections to the brief: one 3 GHz tick = 0.33 ns ≈ 10 cm of light ≈ 3.9 in (not 3.7 in); "yours has a hundred
  billion" changed to "the biggest ones today have more than a hundred billion" (everyday chips have billions).

## Sources

- Transistor counts (Intel 4004, 1971, ~2,300; Apple M2 Ultra, 2023, 134 billion): https://en.wikipedia.org/wiki/Transistor_count
- Grace Hopper's nanosecond (11.8 in wire, 984 ft microsecond coil, "hang one over every programmer's desk (or around
  their neck)"): https://highscalability.com/grace-hopper-to-programmers-mind-your-nanoseconds/ ,
  https://computerhope.com/jargon/n/nanosec.htm
- Light travel per nanosecond: speed of light 299,792,458 m/s → 29.98 cm per ns; 3 GHz → 0.333 ns per cycle → ~10 cm
- 8 bits = 2^8 = 256 values; 10^9 s ≈ 31.7 years; 1.34 × 10^11 s ≈ 4,246 years
