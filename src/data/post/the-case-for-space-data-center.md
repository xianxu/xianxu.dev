---
title: The Case for Space Data Centers
publishDate: 2026-06-05
published: false
excerpt: "With SpaceX IPO looming, let's take a look at the case of space data center. And as you poke around, you realize it is matter of time to run data centers in space, and you also realize, you DON'T need Starship to do it. "
tags:
  - tech
  - ai
highlight: true
---

Is space data center a great idea, a stupid idea, or something in between? 
I haven't heard about why it would work much, but plenty of: _you can't cool anything in space, you can't fix things in space, too expensive to launch data centers into space, etc._ All sound reasonable on surface. But with SpaceX going IPO, I decide to take a closer look, and boy, it's intriguing. I realize it is just a matter of time for us to run data centers in space, it makes a lot of sense and "merely" engineering problems. On the other hand, you don't need Starship to do it, as it's not the main bottleneck.

> This, btw, is another use my "brain extension" (nous/brain). AI taught me bunch of things along the way (facts, maths), and I pushed back a bunch (long range logical consistency and intent). I did author this post myself in an AI assisted flow I'll make another post about. 

---

## The nice things about space

First of all, the allure of space is the eternal sun-shine, 24/7, without atmosphere (thus stronger), without cloudy days, without hurricanes, and most important: without nights. So a space data center can be powered largely for free, probably not even need much battery backups for its operation. It's like the perfect environment for silicon lives! 

Now, the question is, can we engineer our way out of the other engineering and economical issues, to really put data center in space. Let's take a look.

## The form factor assumption

Picture the simplest possible configuration: a slab of solar panel. Chips embedded on the backside of it, away from the sun. The sun-facing side captures the energy; and both sides radiate them away, leveraging the coldness of the space. That's it, just a slab, that looks like the solar panels on your roof, probably much larger, as large as rocket can send them up, without fancy folding etc, which would add complexity and cost. 

## How do you cool things in space

Cooling things on earth often is about moving cooler air/fluid through surface of a hot object. When you are sweating, use a fan. There's no air in space for you to fan, and some had used it as the death knell of the whole idea of space data center. That's lazy. Space is really really really cold, like near absolute zero kelvin cold. There radiation cool things down. The question is: is it enough? Let's do some math. 

### Base model v0: a bare slab in the sun

Forget the chips for a moment. Hang a plain slab in Earth orbit and ask what temperature it settles at. Sunlight there delivers $S = 1361\ \mathrm{W/m^2}$ onto the lit face. The slab soaks that up and re-radiates it as infrared — and it radiates from **both** faces, since the sun blocks only a negligible sliver of the front's view of cold space. A surface at temperature $T$ radiates $\varepsilon\sigma T^4$ per face (Stefan–Boltzmann; $\sigma = 5.67\times10^{-8}\ \mathrm{W/m^2K^4}$, emissivity $\varepsilon \approx 1$). Set what comes in equal to what goes out:

$$
S = 2\,\varepsilon\sigma T^4 \quad\Rightarrow\quad T = \left(\frac{S}{2\varepsilon\sigma}\right)^{1/4} = \left(\frac{1361}{2\times5.67\times10^{-8}}\right)^{1/4} \approx 331\ \mathrm{K} \approx 58\,^\circ\mathrm{C}
$$

Fifty-eight degrees. A bare slab in full sun just sits at about 58°C — a perfectly fine temperature for electronics, and we haven't lifted a finger to cool it. (Let it radiate from only one face and you'd get ~120°C; using both faces is what buys the comfortable number.) So the lazy "you can't lose heat in space" is simply wrong — space sheds the entire solar load at a benign temperature. **Shedding capacity is not the problem.**

### Base model v1: now turn 30% into a GPU

Now make it a data center. A good space solar cell turns ~30% of that sunlight into electricity, the electricity runs a GPU, and the GPU turns essentially all of it back into heat. The *total* energy hasn't changed — but now it matters enormously **where** the heat appears.

One NVIDIA H100 draws ~700–800W, so it rides on about 2 m² of panel ($0.30 \times 1361 \times 2 \approx 800\ \mathrm{W}$). The trouble is the chip is tiny — about **0.1 m²** — sitting on the back of the slab. In this base model we allow **no heat conduction**: whatever the chip makes, it has to radiate from its own little footprint (and only the back face — the front is busy collecting sun). That's ~800W forced out through 0.1 m²:

$$
T_\text{GPU} = \left(\frac{Q}{\varepsilon\sigma A_\text{chip}}\right)^{1/4} = \left(\frac{800}{5.67\times10^{-8}\times 0.1}\right)^{1/4} \approx 613\ \mathrm{K} \approx 340\,^\circ\mathrm{C}
$$

The slab around it is at a comfortable 58°C, but the chip itself is a glowing **~340°C** spot — and silicon gives up the ghost above ~100°C. (Even generously letting it radiate from both faces only brings it down to ~240°C — still cooked.)

That, in one number, is the whole GPU-in-space problem. It was never about whether space can absorb the heat — v0 already settled that. It's that the heat is **born in a tiny spot with nowhere to go**. Everything that follows — heat pipes, spreading the silicon thin — is about getting that 800W *out of the 0.1 m² and onto the slab that's already happy to radiate it.*

## How to move heat from GPU to the back of solar panel

So, at equilibrium, we can stay cool just putting a slab in space. Running GPU cause on other real problem we need to solve: GPU will generate heat in a very concentrated way. How to move heat fast enough from that point to rest of heat sink to be radiated away? Some math:

Our solar panel will receive 1361 W/m², at 30% conversion efficiency, and take a conservative number at ~400W/m². We need about 700W to support one NVidia's H100, so about 2m². The H100 as a heat source is tiny, its surface is only about 0.1m². And remember the chips sit on the back of the slab; the front is busy collecting sunlight, so we really only have that one back face to dump the chip's heat into space. So the problem is: move 700W from a 0.1m² hot spot out across the whole 2m² back panel, fast enough that the chip doesn't melt.

The trick isn't to find a better metal — it's the **heat pipe**, and it's worth knowing what it actually is, because it isn't really "conduction" at all. A heat pipe is a sealed tube with a little working fluid inside — in space, usually **ammonia**. At the hot end the fluid boils, soaking up a lot of heat as it evaporates; the vapor rushes to the cold end and condenses, dumping that heat into the radiator; and a wick draws the liquid back to do it all over again. No pump, no moving parts — it's driven entirely by capillary action, which is exactly why it keeps working in zero gravity where you can't rely on anything to fall. The whole tube stays nearly the same temperature end to end, so it behaves like a "conductor" hundreds of times better than copper, without copper's crushing weight. This isn't exotic: it's how the International Space Station rejects its ~70+ kW of waste heat — ammonia loops carrying heat out to big radiator panels.

So we put a heat pipe (or its flat cousin, a vapor chamber) between the GPU and the back panel. It carries the H100's 700W from the 0.1m² chip out across the whole 2m² back with only a small temperature penalty — counting the losses where heat enters and leaves the pipe, in practice about **10–30°C**.

Now the back panel just has to radiate those 700W into space from its one available face:

$$
T_\text{rad} = \left(\frac{Q}{\varepsilon\sigma A}\right)^{1/4} = \left(\frac{700}{0.9 \times 5.67\times10^{-8} \times 2}\right)^{1/4} \approx 288\ \mathrm{K} \approx 15\,^\circ\mathrm{C}
$$

That's just 350 W/m², a light load, so the radiator sits at a chilly ~15°C and the GPU — one heat-pipe hop away — lands at roughly **25–45°C**. Comfortable, with margin to spare. (One honest caveat: this assumes the cool back radiator is thermally separated from the hot sun-facing front. If the whole slab is instead one big lump of conductor, front and back average out toward the ~58°C we found earlier, and the GPU rides at ~70–85°C — still perfectly fine. Either way, the heat pipe turns the scary "concentrated heat" problem into a non-issue.)

But notice the escape hatch: the problem only exists if heat is _generated_ far from where it's _radiated_. So don't do that. Match the silicon footprint to the radiating footprint — **spread the compute thin, one flat layer, run it at low power density.** Then the conduction distance is centimeters everywhere and the gradient collapses. You're not solving the transport problem; you're designing it out of existence.

And here's the kicker: getting down to ~300 W/m² means **underclocking and undervolting** the chips. Power scales with voltage² × frequency while performance scales with frequency, so dropping the clock buys you a big jump in performance-per-watt. The constraint that space imposes (low W/m²) happens to push you straight into the most energy-efficient operating regime there is. Terrestrial instinct is _clock high, pack dense, blow cold air._ Space wants _slow, wide, flat, cool._ The physics doesn't fight you — it redirects you toward a better design point.

## Debunking #3: "Hardware fails and you can't send a technician"

True, though irrelevant. Terrestrial data centers don't repair individual GPUs either — they run a server until it's decommissioned, then replace the whole thing. The only difference in orbit is that "replace" means "deorbit", you also save on recycling cost. 

So model it as attrition. Assume some annual failure rate from radiation and thermal cycling. You don't deorbit the satellite when the first chips die — you keep going until enough died that the revenue it generates is lower than the cost to keep it in the orbit.

There's even a happy accident here. A low Earth orbit at ~550 km naturally decays in about five years from atmospheric drag — which is roughly the economic life of a chip. End-of-life disposal is **free and automatic**: the satellite deorbits itself right as the silicon goes obsolete. 

## Debunking #4: "Link speed, how do you get petabytes up there"

This one dissolves the moment you separate the two workloads.

**Training** runs on a static dataset reused over many epochs. So ingest it _once_ — physically ship the "disks" on the same launch. A few petabytes of flash masses kilograms. And in a world of real space data center consternation, you would have regular launches, multiple times a day, so it's just "logistics". 

**Inference** is not data intensive to begin with, mostly compute, and the free solar power helps a lot.

How about all the multimedia? Those stay terrestrial for now. 

## Debunking #5: "Latency makes inference impossible"

The objection that _sounds_ most physical, and mostly evaporates because of how inference actually works: **modern LLM serving streams.** You pay the network round-trip once — request goes up, first token comes down — and then tokens flow continuously as they're generated. So latency only adds to time-to-first-token, not to the gaps between tokens. And the response already takes seconds.

| Orbit | Round-trip latency | Verdict for chat |
|---|---|---|
| GEO (~35,800 km) | ~240 ms | +240 ms to first token — ~8% of a 3s reply. Fine. No handoff, always overhead. |
| MEO (~8,000 km) | ~55 ms | Comfortable. |
| LEO (~550 km) | ~4 ms | Trivial — but satellites move, so sessions need handoff. |

For anything conversational, even GEO's quarter-second is buried under the model's own thinking time. The slice that genuinely _doesn't_ fit is real-time voice and live interactive work, where 240 ms is audible — and that slice is exactly what the LEO tier picks back up at 4 ms. The "latency kills it" claim is true only for a narrow band, and that band has its own answer.

## Debunking #6: "Launch is prohibitively expensive"

The headline objection — and the one most thoroughly overtaken by events. Yes, launch is the gating cost _today_. But it's also the cost falling fastest, and the framing hides something. 🤖[provide some number based on Falcon 9 reusable rocket's launch price]{Falcon 9 reusable ≈ $3,000/kg (SpaceX's own marginal cost likely ~$1,500). At ~3.5 kg per H100-equivalent that's ~$5–10k of launch per chip — already under the ~$25k chip itself, and offset by the ~$2.6k of 5-yr ground power you skip. So it pencils out on Falcon 9 *today*; Starship (~$200/kg → ~$700/chip) just makes launch a rounding error — the "you don't need Starship" point. Want a Falcon 9 row added to the table?}

Take a 1 km² array at ~2 kg/m² — about 2,000 tonnes, or 15–20 Starship loads. Spread across the about ~600,000 H100-equivalents of compute that array can power, that's  ~3 kg of launched mass per chip. Now price the launch:

| Launch price | Cost per chip-equivalent | vs. the $25k chip |
|---|---|---|
| $1000/kg (near-term) | ~$3,100 | 12% |
| $200/kg (Starship target) | ~$620 | 2.5% |
| $50/kg (aspirational) | ~$155 | 0.6% |

Now compare that to what it _replaces._ A terrestrial GPU burns ~700 W, ~1 kW after cooling overhead, over a five-year life — roughly **$2,600 of electricity** at $0.06/kWh, plus the chillers and the grid hookup. Look at those two numbers: at Starship-target prices, the cost to _launch_ a chip (~$620) is **smaller than the electricity you'd have spent running it on the ground** (~$2,600). They roughly cancel, and both are noise next to the $25k of silicon.

So "launch cost is the only problem" is nearly the opposite of true at maturity. Launch ≈ the energy bill you avoid. Once it's even moderately cheap, it stops being the deciding term.

## Well, there are still some real problems. 

Here's where intellectual honesty earns its keep. After every physical objection falls, two real constraints remain — and neither is the one people shout about.

**1. Obsolescence, made worse by the elegant design.** Chips obsolesce on a ~1–2 year generation cadence even though they physically run for ~5 years. On the ground, this is survivable because the _durable_ infrastructure — building, grid interconnect, cooling plant, 15–25 year lifespans — is **decoupled** from the fast-obsolescing servers. H100s drop into the same racks the A100s left. You refresh only the cheap layer and amortize the expensive layer across three or four generations. 🤖[this seems off, your H100 is much more expensive than the data center housing?]{You're right — H100 (~$25k) > facility share per GPU (~$12–18k). So the chip, not the building, is the dominant cost, and *both* space and ground re-buy that $25k chip every generation. Ground only saves the reused facility layer. I overstated the asymmetry; this whole "real problem" is weaker than I wrote — see your next two markers, which knock it down further. Will rewrite once we settle 1+2 together.}

In orbit, the integrated panel — the very thing that solved the thermal problem — **couples** them. You can't swap the chip without re-launching the solar array and the radiator, which have no obsolescence at all (a photon is a photon). So when the silicon ages out, you strand a perfectly good power-and-cooling system and re-pay the entire launch. The design's elegance is also its trap.

The way out is to break the coupling: make the array a reusable orbital **socket** you re-chip rather than re-launch — robotic swap, modular docking, a durable photon-handling layer that the obsolescing silicon plugs into. Solve that and space's free-power advantage dominates. Fail to, and you're re-flying 2 kg/m² every five years and the launch-cost math gets brutal again. 🤖[solar panel life's 25 years I think, so we are talking about a factor of 5x here?. the cost of solar panel is not that high, compared to the GPU, so likely ok]{Agreed, and this is the key deflation. You strand ~80% of a 25-yr array at the 5-yr chip swap (your 5x), but the array (~$3–8k) is cheap next to the $25k chip you'd re-buy anyway — so the wasted capital is minor. The "reusable socket" drops from make-or-break to a nice optimization. Net: obsolescence is NOT a real blocker. Propose cutting #1 down to a short "you waste some cheap hardware, no big deal" note.}

**2. Serving availability.** This is the one genuinely inference-specific cost, and it's not latency or bandwidth — it's uptime. Inference is customer-facing 24/7; an eclipse gap or a node failure is a _serving outage._ Training just checkpoints and resumes — it doesn't care if a node drops for half an hour. So inference demands sun-synchronous orbits (no eclipse) plus constellation redundancy plus failover, which training can skip. That's why training is the easier _first_ workload — not because of data, but because of SLAs. 🤖[well we will have many of such thing flying, the reliability problem can be easily solved with software. ]{Largely agree — at constellation scale you route around eclipsed/failed nodes like any CDN, so availability becomes a distributed-systems problem, not a hardware blocker. One real caveat to keep: eclipse is *correlated* (a whole orbital plane darkens on schedule) and latency-bound inference needs a *nearby* lit node, so you size for spare capacity and inter-sat routing. Net: cost/engineering, not fundamental. Propose downgrading from "real constraint" to "a thing the constellation+software handles."}

## The part that's actually beautiful

Set the problems aside for a second, because there's an upside the cost framing misses entirely.

A LEO satellite is ~550 km straight up — which for most of humanity is **closer than the nearest big data center.** A well-connected user reaches a regional data center in 10–40 ms; someone in a remote region or mid-ocean is 80–200 ms away, if they can reach one at all. A compute node directly overhead is ~4 ms. Space compute is _edge_ compute, by default, for the entire planet. It serves the half of the world that terrestrial data centers can't reach in under 100 ms — maritime, aviation, remote regions, direct-to-handset anywhere.

That flips the whole economic argument. Everything up to here was _defensive_ — at what launch price and electricity cost does space _match_ the ground? But coverage is _offensive_: space can serve latency and reach tiers the ground **physically cannot**, at which point you're not competing on cost-parity, you're addressing demand whose terrestrial price is infinity.

And the pieces compose. The natural architecture is two tiers: a **bulk tier** in sun-synchronous or geostationary orbit running big arrays for training and batch and latency-tolerant inference; and an **edge tier** in LEO running smaller distributed nodes for real-time inference close to users. The edge tier reopens exactly the real-time slice the bulk tier had to give up. There's even a power-profile match: inference is a steady 24/7 load, and a sun-synchronous orbit is a steady 24/7 power supply — better matched than bursty training against constant sunlight. And it sidesteps the thing increasingly strangling terrestrial AI buildout: the multi-year grid-interconnection queue. "300 megawatts with no interconnection application" is a moat the launch-cost obsession never sees.

## The pattern

Here's what struck me, going objection by objection: **every lazy dismissal turned out narrower than its slogan.** Cooling — fine, you were solving the wrong equation. Heat transport — real, but you design it away and get free efficiency. Failures — priced in, and physics deorbits the asset for you. Data — ship a disk, or it's 2 KB. Latency — streaming hides it everywhere except one slice that LEO recovers. Launch — real today, self-cancelling against terrestrial energy tomorrow.

None of the physics objections is the binding constraint. What's actually left is a **financial** question — can you beat a depreciation schedule? — and a **design** question — can you decouple the obsolescing chip from the durable array? Those are hard. But they're _engineering and economics_, not laws of nature. And that's a completely different conversation than "you can't cool things in space."

The case for space data centers isn't that it's easy. It's that the reasons people give for why it's impossible are, almost without exception, wrong — and the reasons it's _actually_ hard are the kind we know how to chip away at.
