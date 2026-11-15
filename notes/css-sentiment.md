# How engineers talk about CSS

Notes for the layoutkit.dev copy. Every quote below is from a page fetched on 15 November 2026. Nothing here is paraphrased into a fake quotation. LayoutKit's own talk transcript is included because the product work started from it.

## What people who dislike CSS actually say

They rarely complain that the syntax has too many semicolons. They complain that the result will not do the obvious thing, that responsive layout eats the day, and that they do not want a second career in visual design.

Hacker News, "Ask HN: Is it just me, or is CSS too damn hard?" (https://news.ycombinator.com/item?id=19021719):

> I can't center my divs properly. I can't say "hey, CSS, this is the parent div, and all child divs must obey its size". I can't do anything basic on CSS without turning for help.

A reply on "I hate CSS: how can I build UIs?" names a concrete trap that still shows up in app shells (https://news.ycombinator.com/item?id=38153212):

> One example: to prevent your flex container with an height from expanding to more than that height, you need to set the min-height to 0. There is surely a good reason for that (I know there is, and I don't care why it is technically necessary), but this means that to use a very modern layout mechanism (flex) in a way that makes sense for the user (e.g. you want an app that is limited to the height of the page) you need to use another css rule that doesn't make apparent sense.

The original post on that thread is the job-to-be-done, in the poster's words (https://hn.algolia.com/api/v1/search?query=I%20hate%20CSS&tags=story&hitsPerPage=8, story 38153212):

> Trying to learn to develop simple UIs, but just keep hitting my head against CSS. It just does not click. Is there something out there that will just let me put things on the screen, where I won't need to care about padding, margins, overflow etc? I don't care if it's not very customisable. I just need something to test product ideas quickly.

Another Ask HN post, from the same Algolia response (story 29056426):

> I really hate working with CSS, it's not the syntax that I struggle with, it's the fact that making a site responsive really really is something I hate, I mostly hate working with UIs.

The 2011 thread is old, and the examples (vertical centering, tables) are from before flex and grid. The feeling is the same one later threads still use: the language does not match the task in the author's head (https://news.ycombinator.com/item?id=2271690):

> Example: vertical centering in CSS is far harder than it should be. Why doesn't "vertical-align: middle" just work for divs like it does for table cells?

State of CSS 2025 still ranks those tasks as pain. On the layout page, the top free-text pain points were Grid (272), flexbox issues (125), browser support (109), height (94), overflow (76), then masonry, flexbox again, responsive design, positioning, and alignment (https://2025.stateofcss.com/en-US/features/layout/). The conclusion says the same thing in prose (https://2025.stateofcss.com/en-US/conclusion/):

> Despite the progress, many respondents still struggle with complex layout issues and the speed of change, and say that controlling height, overflow and alignment can be frustrating.

On the usage page, "Browser support" was the top other pain point, but only 41 of 419 respondents on that question named it. "Excessive Tailwind usage" was fifth, with 13 answers (https://2025.stateofcss.com/en-US/usage/). Satisfaction with CSS is up even so:

> happiness with CSS specifically shows a clear upwards trend in recent years

The chart is labeled with 3,929 responses, 71% answering, and a score of 4. The same page says most respondents are not caught up: the pace-of-change average is 2.8 out of the scale they plotted, and 1,324 people chose "I've learned about and tried out some of the features."

State of CSS 2024's conclusion is the "I learned this once and it kept moving" complaint (https://2024.stateofcss.com/en-US/conclusion/):

> Over the past two years, CSS has evolved so much that keeping up with all the new features feels like a full-time job.

Dylan Beattie, "Do It With Style" (NDC Oslo 2026), describes the maintenance failure mode that makes people add a sixteenth button style instead of editing the first fifteen. From the auto-caption transcript:

> CSS is a difficult language to maintain which means that most projects they start off with something minimal. Somebody else gets involved. They change something and it breaks and it breaks something they had no idea could possibly be affected by what they did. So they become afraid. They don't want to modify it. They don't want to evolve it. So they just add more.

## What people who like CSS defend

They talk about the browser as the layout engine, about fewer instructions rather than more, and about features that remove JavaScript. They get irritated when a library pretends CSS is broken, or when markup becomes a list of visual utilities.

A reply on the 2019 Hacker News thread argues the model on purpose (https://news.ycombinator.com/item?id=19021719):

> CSS isn't a programming language, it's a constraint language. The browser has lots of default, complex behaviors that drive layout, and whereas in a traditional programming language you tend to "build up" from nothing, CSS is more about paring down and guiding that automatic engine with as few statements as necessary.

Same thread, on flex and grid versus the float era:

> Today we have flex-box, which quite elegantly serves 90% of people's layout needs, and CSS Grid which fills in the rest.

Every Layout's own introduction (https://every-layout.dev/):

> If you find yourself wrestling with CSS layout, it’s likely you’re making decisions for browsers they should be making themselves.

> Employing algorithmic layout design means doing away with `@media` breakpoints, “magic numbers”, and other hacks, to create context-independent layout components.

Jeremy Keith, "Declarative design", as republished on his Every Layout tag page (https://adactio.com/tags/everylayout):

> They all focus on creating the right inputs rather than trying to control every possible output. Leave the final calculations for those outputs to the browser—that’s what computers are good at.

He quotes Andy Bell:

> Be the browser’s mentor, not its micromanager.

And he draws the line LayoutKit has to pick a side of:

> If you agree with this statement, you should probably use an imperative design tool: "CSS is broken and I want my tools to work around the way CSS has been designed."
>
> But if you agree with this statement, you should probably use a declarative design tool: "CSS is awesome and I want my tools to amplify the way that CSS had been designed."

> I think that Tailwind might be a good example of an imperative design tool. It’s only about the specific outputs. Systematic thinking is actively discouraged; instead you say exactly what you want the final pixels on the screen to be.

Una Kravets, "The new responsive" (https://web.dev/articles/new-responsive), on why viewport breakpoints are the wrong tool for a component:

> You can use global viewport information to style your components, but they still don't own their styles, and that doesn't work when our design systems are component-based and not page-based.

> Container queries provide a much more dynamic approach to responsive design. This means that if you put this card component in a sidebar or hero section or within a grid inside of the main body of a page, the component itself owns its responsive information and sizes according to the container, not the viewport.

State of CSS 2025, favorite features started that year: `:has()` (369), nesting (182), container size queries (149). The features respondents said had changed how they write CSS over five years: Grid (461), `:has()` (290), nesting (245), flexbox (211), custom properties (178) (https://2025.stateofcss.com/en-US/usage/). The conclusion names the ones that "moved from wish lists to everyday practice":

> The `:has` selector, container queries and `subgrid` have moved from wish lists to everyday practice, and respondents rank them among the most loved features.

The same usage page is blunt about what is still uneven: anchor positioning was the top "I avoid this because of support" answer (106), then scroll-driven animations (50) and the View Transition API (49). Nesting and `:has()` "lost ground" on that list "since these features are now supported in all major browsers."

Josh Comeau, on styled kits versus behavior (https://threadreaderapp.com/thread/1357709670325059592.html):

> Anecdotally, the students who tried using a component library like Material UI spent longer on styling, and didn’t wind up with a nicer UI. You get off the ground quicker, but you burn so much more time trying to polish and finish the app.

> I think of tools like Reach UI as the “missing standard library of the DOM”. They fill in the gaps that the platform really should have natively, things like dialogs and tooltips and comboboxes. But they don’t prescribe any styles. That’s up to you.

> TL;DR — unless you’re building a short-term project (prototype, hackathon), CSS frameworks can be harmful, *increasing* the amount of time you need to spend on the UI. I recommend using a style-agnostic tool like Reach UI instead. Use third-party functionality, not styles.

He separates Tailwind from Bootstrap in that thread ("Tailwind isn’t my favourite tool, but I think it deftly avoids the issues I’ve been talking about here") so a CSS-lover's objection to Tailwind is not the same objection as an objection to a skinned component kit.

Dylan's talk is the lover's version of "stop reaching for a plugin":

> The next time you find yourself reaching for something like a React component or you find yourself looking for a way to do something in JavaScript, just take a moment and ask Copilot, ask Claude, "Hey, can I do this in pure CSS, because you probably can."

He also refuses to pretend partial support is fine without a fallback:

> If we are launching things which are not widely supported, we need a nice way to say, look, if you're not ready for this yet, ignore the whole thing.

## Objections both sides raise to a new CSS library

**Another dependency, and a build step that rots.** Jeremy Keith's journal page (https://adactio.com/journal/20609) quotes the complaint directly:

> One of my least favorite things as a developer is wanting to do a quick patch fix on an older project—I’m talking a simple one-line of CSS kind of fix—but first having to spend 30 minutes patching my build tools to get them running again.

> If you have a project that uses just plain HTML, CSS, and JavaScript, you can just open up the files and start working on them at any time.

**Lock-in and unreadable markup.** r/webdev, "Why I personally hate Tailwind" (https://www.reddit.com/r/webdev/comments/y7lkgs/why_i_personally_hate_tailwind/):

> But tailwind goes too far. It basically make your markup include the presentation layer again. It's messy and unstructured. It means you have basically redundant CSS that you never want to change and you have to endlessly tweek chess in the markup to get things looking right.

A reply on the same thread is the other side of that argument, and it is why "no utility classes" is not a universal win:

> I can't tell you how sick I was of creating a `.sidebar-container-left-widget-bottom` class just so I could add 10px of padding to an element. I was sick of *naming* things. I was sick of having to figure out which of the 30 .scss files contained the class for an element.

**Browser support.** State of CSS 2025's incompatibilities list is the practical version: anchor positioning, scroll-driven animations, view transitions, and style queries are the features people still avoid. The conclusion says browser differences "have not disappeared entirely." Dylan's talk says `interpolate-size` was still missing in Firefox and Safari, and customizable `<select>` was not in Safari and Firefox yet. Can I use, fetched the same day, is more recent than the talk for one of those: `appearance: base-select` is supported in Safari 27 and Chrome 135, and disabled by default in Firefox (https://caniuse.com/mdn-css_properties_appearance_base-select). `interpolate-size: allow-keywords` is still Chrome and Edge only among stable engines; Safari's row is Technology Preview (https://caniuse.com/mdn-css_properties_interpolate-size_allow-keywords).

**"How is this different from Tailwind, Bootstrap, or Every Layout?"**

- Tailwind, from the people who hate it: presentation moves back into the markup. From the people who like it: it stops you inventing class names. A layout vocabulary has to be shorter than both a stylesheet full of one-off classes and a `class="flex flex-col gap-4"`.
- Bootstrap and Material, from Comeau: you spend the saved time overriding the skin. From Dylan: the accordion plugins are divs and JavaScript around a pattern `details` and `summary` already have.
- Every Layout already teaches stack, sidebar, switcher, cluster, cover, grid, frame, and the imposter, and it ships them as custom elements. LayoutKit is in that family. Pretending otherwise is how a library sounds like a clone.

## What the copy should do with this

- Show a before and after for one layout, including the `min-width: 0` / `min-inline-size: 0` sort of fix, instead of promising that CSS is easy now.
- Say what the file weighs and that using it is a stylesheet link, not a build.
- Say which features are on in current Firefox, Safari, and Chrome, and which ones no-op.
- Compare Tailwind, Bootstrap, and Every Layout in plain sentences. LayoutKit is declarative and unskinned. It is not the book, and it is not a utility framework.
- Do not sneer at people who find CSS arbitrary, and do not sneer at people who like Tailwind. Both descriptions are in the threads above.
