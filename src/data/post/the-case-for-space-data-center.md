---
title: The Case for Space Data Centers
publishDate: 2026-06-05
published: false
excerpt: "With SpaceX IPO looming, let's take a look at the case of space data center. And as you poke around, you realize it's a matter of time before we run data centers in space — and that you really DO need Starship to pull it off. (Maybe buy the stock.)"
tags:
  - tech
  - ai
highlight: true
---

Is space data center a great idea, a stupid idea, or something in between? 
I haven't heard about why it would work much, but plenty of: _you can't cool anything in space, you can't fix things in space, too expensive to launch data centers into space, etc._ All sound reasonable on surface. But with SpaceX going IPO, I decide to take a closer look, and boy, it's intriguing. I realize it is just a matter of time for us to run data centers in space, it makes a lot of sense and "merely" engineering problems. With one real catch: the whole thing hinges on launch cost — so you *do* need Starship to make it pencil out. (Maybe buy the stock.)

> This, btw, is another use my "brain extension" (nous/brain). AI taught me bunch of things along the way (facts, maths), and I pushed back a bunch (long range logical consistency and intent). I did author this post myself in an AI assisted flow I'll make another post about. 

---

## The nice things about space

First of all, the allure of space is the eternal sun-shine, 24/7, without atmosphere (thus stronger), without cloudy days, without hurricanes, and most important: without nights. So a space data center can be powered largely for free, probably not even need much battery backups for its operation. It's like the perfect environment for silicon lives! 

Now, the question is, can we engineer our way out of the other engineering and economical issues, to really put data center in space. Let's take a look.

## The form factor assumption

Picture the simplest possible configuration: a slab of solar panel. Chips embedded on the backside of it, away from the sun. The sun-facing side captures the energy; and both sides radiate them away, leveraging the coldness of the space. That's it, just a slab, that looks like the solar panels on your roof, probably much larger, as large as rocket can send them up, without fancy folding etc, which would add complexity and cost. 

## How do you cool things in space

Cooling things on earth often is about moving cooler air/fluid through surface of a hot object. When you are sweating, use a fan. There's no air in space for you to fan, and some had used it as the death knell of the whole idea of space data center. That's lazy. Space is really really really cold, like near absolute zero kelvin cold. There radiation cool things down. The question is: is it enough? Let's do some math. 

### Model v0: a bare slab in the sun

Forget the chips for a moment. Hang a plain slab in Earth orbit and ask what temperature it settles at. Sunlight there delivers $S = 1361\ \mathrm{W/m^2}$ onto the lit face, if perfectly facing the sun. The slab soaks that up and re-radiates it as infrared from both surfaces (front and back). A surface at temperature $T$ radiates $\varepsilon\sigma T^4$ per face (Stefan–Boltzmann; $\sigma = 5.67\times10^{-8}\ \mathrm{W/m^2K^4}$, emissivity $\varepsilon \approx 1$). Set what comes in equal to what goes out:

$$
S = 2\,\varepsilon\sigma T^4 \quad\Rightarrow\quad T = \left(\frac{S}{2\varepsilon\sigma}\right)^{1/4} = \left(\frac{1361}{2\times5.67\times10^{-8}}\right)^{1/4} \approx 331\ \mathrm{K} \approx 58\,^\circ\mathrm{C}
$$

Fifty-eight degrees. A bare slab in full sun just sits at about 58°C — a perfectly fine temperature for electronics, and we haven't lifted a finger to cool it. 

### Model v1: now turn 30% into a GPU

Now make it a data center. We plate one side of our slab solar panels, and the other side, at its center, a GPU chip of dimension about 0.1m². A good space solar cell turns ~30% of that sunlight (~400W) into electricity, the electricity runs that GPU, and the GPU turns essentially all of it back into heat (30% of solar energy received). The *total* energy hasn't changed but its distribution changes, and this change affect how hot our GPU is going to be.

One NVIDIA H100 draws ~700–800W, so it rides on about 2 m² of panel ($0.30 \times 1361 \times 2 \approx 800\ \mathrm{W}$). The trouble is the chip is tiny — about **0.1 m²** — sitting on the back of the slab. In this model we are still lazy, and don't provide any heat dissipation to the chip: whatever the chip makes, it has to radiate from its own little footprint (and only the back face — the front is busy collecting sun). That's ~800W forced out through 0.1 m²:

$$
T_\text{GPU} = \left(\frac{Q}{\varepsilon\sigma A_\text{chip}}\right)^{1/4} = \left(\frac{800}{5.67\times10^{-8}\times 0.1}\right)^{1/4} \approx 613\ \mathrm{K} \approx 340\,^\circ\mathrm{C}
$$

The slab around it is at a comfortable 58°C, but the chip itself is a glowing **~340°C** spot — and silicon gives up above ~100°C.

That, in one number, is the whole GPU-in-space problem: how to get that 800W radiate out from that 0.1m² surface, and keep at silicon's operation temperature range.

## How to move heat from GPU

The trick is to use **heat pipe**, a decades-old design in spaceflight.  

A heat pipe is a sealed tube holding a little working fluid — in space, usually **ammonia**. Heat boils it at the hot end; the vapor rushes to the cold end and condenses onto the radiator; and a **wick** (a porous lining on the wall) pulls the liquid back by capillary action. No pump, no moving parts — fully passive, which is exactly why it works in zero-g. It's proven at scale, too: the ISS sheds ~70 kW through ~250 m² of deployable ammonia radiators — at that size via *pumped* loops rather than passive pipes, but a single 800W chip needs only a passive pipe or vapor chamber, the kind already in your desktop GPU.

A quick reality check on radiator size: the ISS rejects ~280 W per m² — a real-world figure with losses baked in. By that yardstick our 800W chip wants ~2.8 m², a bit more than the 2 m² it rides on. So 2 m² is marginal: size up a little, or let it run a touch warmer.

So we put a heat pipe (or its flat cousin, a vapor chamber) between the GPU and the back panel. It carries the H100's 800W from the 0.1m² chip out across the whole 2m² back with only a small temperature penalty — counting the losses where heat enters and leaves the pipe, in practice about **10–30°C**. (That's not a clean formula — it's the pipe's thermal resistance times the load: a good vapor chamber runs ~0.01–0.04 °C per watt, so at 800W that's ~10–30°C, almost all of it at the two end interfaces, since the vapor transport itself is nearly isothermal.)

Now the back panel just has to radiate those 800W into space from back face of the slab:
$$
T_\text{rad} = \left(\frac{Q}{\varepsilon\sigma A}\right)^{1/4} = \left(\frac{800}{0.9 \times 5.67\times10^{-8} \times 2}\right)^{1/4} \approx 297\ \mathrm{K} \approx 24\,^\circ\mathrm{C}
$$

That's just 400 W/m², a light load, so the radiator sits at a cool ~24°C and the GPU — one heat-pipe hop away — lands at roughly **35–55°C**. Comfortable, with margin to spare. But that ~24°C quietly assumed one thing: that the cool back radiator only has to handle the GPU, kept apart from the sun-baked front. Front and back are two sides of the same slab, though — so whether we put a thermal break between them matters. Let's model it.

### Model v3: solar in front, GPU in back, no insulation

Same 2 m² slab: the front absorbs ~2722W of sunlight and ships ~800W of it to the GPU as electricity. In reality, they are the same slab and heat travels from front to the back. Let's see what happens when the whole slab is one conductive sheet, so it settles at a single temperature, radiating the full 2722W from *both* faces — which is exactly base model v0: **~58°C**. The cells enjoy that cool 58°C, and the GPU sits one heat-pipe hop above → **~70–85°C** (that's where that number came from: the 58°C slab plus the 10–30°C pipe penalty).

## How to repair in space

Well, you don't, I suspect we will just design software systems to tolerate partial failures of the chips, maybe even have automatic de-orbiting capabilities when certain keep-alive signals stops arriving at those orbiting slabs.

What about radiation — cosmic rays and solar particles wearing the chips down? Real, but largely a known and managed problem. Two effects matter: *single-event upsets* (a stray particle flips a bit) and *total ionizing dose* (cumulative damage that slowly ages the silicon). The first is mostly a software problem — datacenter GPUs already ship with error-correcting memory, and you add watchdog resets and fleet-level redundancy. The second is the real lifecycle limiter, but in **low Earth orbit it's relatively mild**: Earth's magnetic field deflects most of the flux (it's why the ISS runs ordinary electronics), and a few millimeters of shielding plus the slab's own structure buys margin. Over a ~5-year life the chip is far likelier to hit *economic* obsolescence than radiation death — so it folds into the same "tolerate attrition, fly down the curve, then deorbit" model.

I suspect there are a lot of software issues to be solved in a space oriented data center, a lot more automation's needed as human can't intervene physically. There are also different constraints and trade offs of where the data and computation capabilities is. 

## How expensive is launching those data center slabs into space?

Let's estimate it bottom-up, for one **2 m² slab carrying a single H100**. A rough mass budget:

| Component | Mass |
|---|---|
| Solar array, 2 m² | ~3 kg |
| Radiator + heat pipes, 2 m² | ~3 kg |
| Compute — H100 + board + memory + power + NIC (no Earth-style cooling) | ~4 kg |
| Structure / frame | ~2 kg |
| Avionics + laser comms + attitude control | ~3 kg |
| Electric thruster + propellant + eclipse battery | ~3 kg |
| **Total per H100** | **~18–20 kg** |

That's ~5× heavier than a bare solar array would suggest — dense compute, a real radiator, and a maneuvering bus dominate, not the panel. Now the launch bill, at ~20 kg per chip:

| Vehicle | Cost to LEO | Per H100-unit | vs. 5-yr ground energy (~$3.5k) |
|---|---|---|---|
| Falcon 9, list price | ~$3,500/kg | **~$70,000** | ~20× |
| Falcon 9, SpaceX's marginal cost | ~$1,500/kg | ~$30,000 | ~9× |
| Starship, stated goal | ~$100/kg | **~$2,000** | ~0.6× |

What's the right yardstick? Not the chip's $25k sticker — what you're really buying is ~5 years of *running* that GPU, which on the ground costs real money. Just the electricity for an 800W GPU over five years is ~35,000 kWh ≈ **$3,500** (nearer $5,000 with cooling) — and in orbit the sun delivers it for free. That's the last column above: on Falcon 9, launch costs ~9–20× the energy it would save; only at **Starship's ~$100/kg does launch (~$2,000) drop *below* the five years of energy it replaces** — and that's before counting free cooling and skipping the multi-year grid-interconnect queue.

So the verdict flips from where we started, and the physics didn't lie: launch economics are the real gate. **You do need Starship** — and if it all works, maybe buy the stock.

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
