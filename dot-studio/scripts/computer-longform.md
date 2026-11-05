# How a computer actually works (long-form, ~5.5 min, 6 standalone beats)

- **Content type:** Explainer / fun fact (science & tech), long-form 16:9; each beat also stands alone as a 40-60 s
  vertical Short
- **Angle (from the user's brief):** a computer can only tell whether a switch is on or off; everything else is that,
  repeated at a speed that stops making sense.
- **Publish order as Shorts:** 3 → 1 → 5 → 2 (→ 4, possibly long-form only)
- **Word count:** see below (each beat 110-140 words ≈ 45-55 s at Dot's pace)

## Voiceover

### 1. Only two things
Your computer can't actually do anything. All it can do is tell whether a switch is on, or off. That's it. Each switch is a tiny part called a transistor, and on a chip it's used like a light switch: on or off, nothing in between. So where do the photos, songs and games come from? Patterns. Eight switches in a row can stand for any one of two hundred and fifty-six things, like a letter, a colour, or a number. Line up enough of them, and you can describe a song, or a face. Flip them fast enough, and the pattern starts to move. That doesn't sound like much. Until you see how many switches there are.

### 2. The number
The first computer chip you could buy had about two thousand three hundred switches. The biggest ones today have more than a hundred billion. In 1971, Intel's 4004 fitted two thousand three hundred tiny switches, called transistors, onto one chip. In 2023, Apple's M2 Ultra packed in a hundred and thirty-four billion. That's about fifty-eight million times more. Even an everyday laptop chip has billions. So how big is a billion? If you counted one switch every second, without ever sleeping, a billion would take you over thirty years. A hundred and thirty-four billion would take more than four thousand years. And every single one of those switches is just on, or off.

### 3. Grace Hopper's wire
Grace Hopper carried a nanosecond in her pocket. Hopper was a computer pioneer and a US Navy admiral. At her talks, she handed out pieces of wire about thirty centimetres long. That, she said, is a nanosecond, a billionth of a second: the farthest light can travel in that time. A microsecond was a coil three hundred metres long. She joked that programmers should hang one around their neck, to see what they were wasting. Now here's the twist. A processor running at three gigahertz takes one step every third of a nanosecond. So cut her wire into three. In one tick of your computer's clock, light, the fastest thing there is, only gets about ten centimetres. Roughly the width of your hand.

### 4. A lot of waiting
A lot of the time, your processor is waiting. It can finish a step in a fraction of a nanosecond. But the information it needs is often stored somewhere else, in memory, and even at the speed of electricity, fetching it takes time. So the processor waits. A big part of a chip's design is about waiting less. Small stores of memory right next to the processor, called caches, keep the things it's likely to need close by. It also guesses what it will need next, and starts early. When the guess is right, it saves time. When it's wrong, it throws that work away and tries again. A lot of what makes a chip fast is simply waiting less.

### 5. Why it gets hot
Why does your computer need a fan? Because of switches. Every chip is made of billions of tiny switches, called transistors, flipping on and off up to billions of times a second. Each flip uses a tiny bit of energy. On its own, that's nothing. But billions of switches, billions of times a second, add up. And almost all the electricity a chip uses ends up as heat. So a busy chip gets hot, fast. The fan, the metal fins and the little pipes inside are there to carry that heat away, before the chip has to slow itself down to stay safe. So when your fan spins up, that's the sound of arithmetic.

### 6. None of it means anything
None of it knows what any of it means. Your computer is shuffling patterns of on and off, very, very fast. When you look at a photo, the chip isn't seeing a face. It's moving numbers that say how bright each tiny dot on your screen should be. When you play a song, it's sending numbers to a speaker. The switches don't know what a face is, or a song, or a joke. The meaning only happens when the pattern reaches you. So the most complicated machine you own does one simple thing, billions of times a second. And all the meaning is on your side of the screen.

## Notes for production

- Each beat opens with its own hook and re-explains "switch / transistor" briefly, so it works alone as a Short.
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
