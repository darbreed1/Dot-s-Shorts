---
name: dot-script
description: Research a topic and write one 20-30 second voiceover script for Dot, the cartoon explainer, ready for /cutout-cartoon-shorts. Use when asked for Dot's next script, topic or episode idea.
---

# Dot script (Step 1 of a Dot episode)

Research the internet and write one original YouTube Shorts script for Dot, a curious cartoon explainer who looks closer at things and figures them out. The video will use simple 2D animations and should be 20-30 seconds long, with around 50-70 words of narration. If the user names a topic or content type, use it; otherwise choose yourself without asking.

## Subjects and content types

Dot covers a wide mix of subjects: history, science, biology, health, the human body, animals, space, engineering, technology, food, culture, and everyday mysteries. Rotate between these content types so the channel stays balanced:
- Trending or viral: a topic, claim, video, discovery, or debate that is getting a lot of attention online right now. Dot investigates what is actually true, explains why it is happening, or checks whether the viral claim holds up.
- Current affairs: a recent news event, discovery, or announcement from the last few weeks, explained simply. Dot explains what happened, why it matters, or the surprising detail most coverage missed.
- Fun fact or interesting question: an unusual question, surprising explanation, or strange fact. For example, "Why don't we throw trash into volcanoes?" works because it suggests a simple solution and makes people wonder why we don't use it.
- Niche subject: a little-known corner of history, science, or nature that most people have never heard of but would find fascinating.

Dot can investigate, comment on, or respond to the subject. He can test a claim, react to a viral idea, or walk through what would happen. He stays curious and fair rather than mocking anyone.

## Avoid repeats

Before researching, read `catalog.json` in the dot-studio project (if it exists) and `scripts/` (earlier scripts), plus any ideas visible in this conversation. Do not repeat a topic or make a slight variation of one. Vary both the subject category and the content type compared with the last few entries. If you cannot access previous ideas, don't claim you checked them.

## Research and verify

Research several ideas across different content types before choosing the strongest one. For trending and current topics, search for what is trending or newly reported right now and use the current date in your searches. Confirm the topic is recent and genuinely getting attention, and don't rely on older news. Choose something that can be explained clearly in 20-30 seconds, has a surprising answer or consequence, is easy to show through simple 2D animations, and makes sense without background knowledge.

Verify the central fact using reliable sources, preferably original research, universities, museums, government agencies, established scientific or health organizations, or reputable news outlets for current events. Cross-check the explanation where possible. For viral claims, check the original source of the claim, not just posts repeating it. For health topics, rely on health authorities or peer-reviewed research, explain rather than advise, and don't present early or single studies as settled. For political or contested topics, explain what is known without taking sides. Avoid tragedies, disasters, or graphic events as topics for a light cartoon. Do not invent facts, numbers, quotes, or consequences, and keep uncertainty where it matters. If something is still unconfirmed or developing, say so in the script. If you cannot browse the internet, say so rather than pretending you researched the topic.

## Write

Start the script immediately with a specific question or surprising statement, without a greeting or introduction. Build curiosity by explaining what would happen, why the obvious answer is wrong, what the viral version gets wrong, or what makes the situation unusual, then deliver a clear, satisfying answer near the end. Build toward that answer without filler or dragging out the explanation.

Hook and payoff (from channel analytics, Nov 2026: a Short that opened "If the US bombs..." and answered its title question at 9 s of 32 had 43 % stayed-to-watch and 54 % average viewed, against 48-69 % stayed-to-watch for the channel's stronger Shorts):
- The first line puts the stakes in the first ~1.5 seconds (about the first 5 words). No conditional or scene-setting opener ("If...", "When...", "So, ..."): lead with the question or the strange fact itself ("Could one bomb on this mountain spread nuclear fallout?").
- Open one loop early and close it late: within the first two lines, hint that the obvious answer is not the whole story ("...but the real danger is something else"), and give the full answer only in the last 5-8 seconds. The middle builds toward it.
- Check: if a viewer could leave with the main answer to the title before about 60 % of the script, reorder it so the main answer comes last. Use simple, natural, conversational English with short, connected sentences that sound good when spoken aloud. Every sentence should add useful information. Avoid generic hooks like "Did you know?", "This will blow your mind," or "You won't believe this." Avoid forced suspense, exaggerated claims, AI-sounding phrases, and calls to action. No "!" lines and no hype words (incredible, shocking, amazing, insane): they make the voice over-act. Use original wording and do not copy another creator's script or a news article's wording.

## Deliver

Give the user:
- the content type (trending, current affairs, fun fact, or niche);
- for trending or current topics, one line on why it's relevant now, with the date it was reported or started trending;
- a one-sentence description of the idea;
- the complete voiceover, ready to record, without scene directions;
- the narration word count;
- links to the sources that support the explanation.

If you can write files, also save the script, word count, content type and source links to `scripts/<short-slug>.md` in the dot-studio project.

Then stop and wait for the user to approve the script or ask for changes. Do not generate pictures, voice or animation. Once approved, the next step is `/cutout-cartoon-shorts`, which picks up this script by itself.
