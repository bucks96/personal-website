## Role at Shoppingate (Jun 2026 – present)

I joined Shoppingate on 8 June 2026 as a Senior Product Manager. Shoppingate is a superapp built for people in the Kingdom of Saudi Arabia (KSA). I head product for three verticals: flights, hotels, and food delivery. Other verticals have their own PMs, so a lot of my work involves coordinating with them and with the growth managers.

Running three very different verticals inside one app is a big part of the challenge. Each vertical needs its own set of metrics, its own requirements, and its own user journeys, so I can't just apply one playbook across all of them.

Answers: what is your current role, where do you work now, what is Shoppingate, what do you do at Shoppingate.


## First month at Shoppingate: onboarding and quick wins

In my first month at Shoppingate I focused on learning fast and shipping small, visible improvements.

To learn, I connected with the different teams and stakeholders to understand how work got done and how the tech was set up. I did market research on the culture and behaviour of the KSA population, since I was building for a market I was new to. I also went through the whole app as a newcomer and listed the UX gaps I noticed, and I watched recordings of internal testing sessions to see where users actually got stuck.

At the same time I got a batch of bugs fixed and small features released:
- Tapping the search bar needed two taps to activate it; I got that down to one.
- In food, if a customisation had only one option, the app now selects it by default.
- A direct-flights filter on the flight search form.
- Confirmation emails after hotel and flight bookings.
- Filter chips.
- A "recently visited and purchased" section in food.
- Previously searched queries in travel.
- Many UI fixes in travel, from spelling mistakes and UI consistency to properly displaying hotel policies.
- A checklist for changing the colour theme ("skin") of the food vertical.

I also got dashboards built so that each vertical has a single, at-a-glance view of how it is doing.

Answers: how do you approach a new job, your first 30/90 days, quick wins, how do you get up to speed.


## Making flights and hotels feel fast at Shoppingate

Flight and hotel search at Shoppingate was slow: users waited about 10 seconds before seeing anything, because the external travel APIs took a long time to respond. In my first month I got this changed to progressive loading, so the first results start showing within 2–3 seconds and the rest fill in as they arrive.

In my second month I went further on perceived speed. Since we couldn't make the APIs themselves faster, we decided to show the user progress at every step: first a loader on the search button itself, then shimmer placeholders, then individual elements and buttons loading in as data arrives. The idea was that the user should never be looking at a frozen screen and wondering whether the app is working.

Answers: performance improvements, slow loading, perceived performance, working with slow APIs, travel UX.


## Food delivery work at Shoppingate

Food delivery is one of the three verticals I head at Shoppingate, and a lot of my work there came from customer feedback and order data.

Cart redesign: users told us they had mistakenly ordered to the wrong address, so we updated the cart UI to make the delivery address much harder to miss.

Free delivery nudge: I added an animation and a nudge to show users when they qualify for free delivery, or how close they are to it.

Default customisations: first, if a customisation had only one option, we selected it automatically. Later we extended this: when there are multiple options, the 0 SAR (free) option is selected by default, so users don't have to work through every choice.

Geofencing: we added geofencing so that we never show restaurants to users who are outside their delivery area. Before this, users could browse restaurants that couldn't actually serve them, which leaked users out of the funnel.

Redesign: I led a redesign of the food vertical, built around customer feedback.

Data-led features: I analysed order data for insights, for example that a large share of food orders are brand-heavy (users ordering from brands they already know), and built experiences around those patterns. I also enabled bank-based cashback offers to attract users from specific customer segments.

Answers: food delivery, cart, conversion, customer feedback, geofencing, using data to build features.


## Analytics and event tracking overhaul at Shoppingate

Fixing analytics became one of my biggest projects at Shoppingate.

In my second month I went through Mixpanel and found serious gaps in how user behaviour was tracked: some events were missing entirely, others needed new parameters, and some needed renaming. I got those fixed. In my third month I did a comprehensive audit of every event in both Mixpanel and CleverTap, coordinating with the PMs of each vertical and the growth managers, and renamed events and parameters so the whole app follows one clean structure.

Two problems made this harder than usual. First, the app runs in both Arabic and English, so the tracking had to be designed so that metrics are always recorded in a single language no matter which language the user chose, while still respecting the different UX expectations of each language. Second, every vertical needs different metrics, so the structure had to work across very different journeys.

In my fourth month I explored and led the rollout of more Mixpanel features: session replay, Lexicon definitions, event verification, custom metrics, and custom events (which helped us move to the new naming without breaking old reports). I added business context and descriptions to events in Mixpanel so anyone looking at the data gets accurate information.

In my fifth month I compared different A/B testing tools, integrated Firebase A/B testing, and set up tracking for experiments in Mixpanel. I also set up alerts on key user metrics to catch anomalies proactively, and monitoring alerts on third-party APIs based on errors and latency.

Answers: analytics, Mixpanel, CleverTap, tracking, metrics, A/B testing, data quality, monitoring.


## Using AI and Claude to scale product work at Shoppingate

I use AI heavily to make myself and my team more effective at Shoppingate.

In my fourth month I created a shareable skill using Claude that the whole product team can use. It standardises event names, encourages reusing existing events so the event list doesn't get out of hand, and helps the QA team verify tracking. I wrote an onboarding guide so other PMs could start using it.

In my fifth month I set up a knowledge base in Obsidian with richer detail on each project, and built a set of AI agents with different focuses:
- QA agent: thinks through edge cases in a requirement so we address them before development, not after.
- Monitor agent: regularly goes through all tickets and responses to flag anything that needs my attention or reply, and writes a weekly update on what I've done and where we are on the roadmap.
- Researcher agent: goes through customer queries to understand what customers are asking for or struggling with, does weekly market research on trends and developments in the industry and region, and proposes experiences we could build from those insights.
- Alert agent: monitors Mixpanel data daily and alerts the team about anything unusual.

Answers: how do you use AI, Claude, AI agents, productivity, automation, tools you use.


## Roadmap, execution and external partners at Shoppingate

I built the roadmap for my verticals at Shoppingate based on insights from user behaviour and the company's objectives.

Some big tasks needed a lot of QA bandwidth and kept getting delayed. I brainstormed different implementation plans for them and executed them to get those tasks moving.

Flights, hotels and food all depend on external API providers, and those providers have limitations we can't change. A recurring part of my job is designing around those limitations so the customer experience doesn't suffer, for example the progressive loading work on travel search.

Answers: roadmap, prioritisation, execution, working with QA, external dependencies, API partners.


## Failures and lessons at Shoppingate

Two things in my third month at Shoppingate didn't go the way I wanted.

The Almosafer change: Almosafer, one of our travel partners, reached out about a change they needed us to make. I deprioritised it because it didn't improve conversion. I later regretted that when they started pushing back.

The catalog proposal: I wanted us to store and sync catalogs, and I put together a proper plan for it. Even so, I failed to convince the CTO.

Answers: tell me about a failure, a mistake, a time you were wrong, a time you couldn't convince someone, stakeholder management.
