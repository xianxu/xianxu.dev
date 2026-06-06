---
title: The Case for Space Data Centers
publishDate: 2026-06-05
published: false
excerpt: "With SpaceX IPO looming, let's take a look at the case of space data center, how realistic it is. As I poked around, I realize it's a matter of time before we run data centers in space, and that we really DO need Starship to pull it off economically. That is, if we look at the problem in the time frame of decades."
tags:
  - tech
  - ai
highlight: true
---

Is space data center a great idea, a stupid idea, or something in between? I haven't heard about why it would work much, but plenty of naysayers, for example, there's no air to cool things off in space. With SpaceX going IPO, I decide to take a closer look, and it's intriguing. I realize it is just a matter of time for us to run data centers in space, it makes a lot of sense and "merely" engineering problems left. Let's take a look at the feasibility and cost perspective. 

> This, btw, is another use my "brain extension" (nous/brain). AI taught me bunch of things along the way (facts, maths), and I pushed back a bunch (long range logical consistency, intent, compare to terrestrial data centers etc.). I did author this post myself in an AI assisted flow I'll make another post about. 

---

## The nice things about space

First of all, the allure of space is the eternal sun-shine, 24/7 (if we go with sun-synchronous orbit [^SSO]), without atmosphere (thus more energy), without cloudy days, without hurricanes, and most important: without nights. So a space data center can be powered largely for free. It's like the perfect environment for silicon "lives"! 

Now, the question is, can we engineer our way out of the other engineering and economical issues, to really put data center in space. Let's take a look.

## The form factor assumption

Picture the simplest possible configuration: a slab of solar panel. Chips embedded on the backside of it, away from the sun. The sun-facing side captures the energy; and both sides radiate them away, leveraging the coldness of the space. That's it, just a slab, that looks like the solar panels on your roof, probably much larger, as large as rocket can send them up, without fancy folding etc, which would add complexity and cost. 

## How do you cool things in space without air?

Cooling things on earth often is about moving cooler air/fluid through surface of a hot object. When you are sweating, use a fan. There's no air in space for you to fan, and some had used it as the death knell of the whole idea of space data center. That's lazy. Space is really really really cold, like near absolute zero kelvin cold. There radiation cool things down. The question is: is it enough? Intuitively, if you got ejected in space without a space suite, you'd imagine you freeze pretty fast? Let's do some math. 

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

That, in one number, is the first GPU-in-space problem: how to get that 800W radiate out from that 0.1m² surface, and keep at silicon's operation temperature range.

## Model v3, a slab with heat pipe

It turns out this is solved by a decades-old design in spaceflight: heat pipe. 

A heat pipe is a sealed tube holding a little working fluid — in space, usually **ammonia**. Heat boils it at the hot end; the vapor rushes to the cold end and condenses onto the radiator; and a **wick** (a porous lining on the wall) pulls the liquid back by capillary action. No pump, no moving parts — fully passive, which is exactly why it works in zero-g. It's proven at scale, too: the ISS sheds ~70 kW through ~250 m² of deployable ammonia radiators — at that size via *pumped* loops rather than passive pipes, but a single 800W chip needs only a passive pipe or vapor chamber, the kind already in your desktop GPU.

A quick reality check on radiator size: the ISS rejects ~280 W per m² — a real-world figure with losses baked in. By that yardstick our 800W chip wants ~2.8 m², a bit more than the 2 m² it rides on. So 2 m² is marginal: size up a little, or let it run a touch warmer.

So we put a heat pipe (or its flat cousin, a vapor chamber) between the GPU and the back panel. It carries the H100's 800W from the 0.1m² chip out across the whole 2m² back with only a small temperature penalty — counting the losses where heat enters and leaves the pipe, in practice about **10–30°C**. (That's not a clean formula — it's the pipe's thermal resistance times the load: a good vapor chamber runs ~0.01–0.04 °C per watt, so at 800W that's ~10–30°C, almost all of it at the two end interfaces, since the vapor transport itself is nearly isothermal.)

Now the back panel just has to radiate those 800W into space from back face of the slab:
$$
T_\text{rad} = \left(\frac{Q}{\varepsilon\sigma A}\right)^{1/4} = \left(\frac{800}{0.9 \times 5.67\times10^{-8} \times 2}\right)^{1/4} \approx 297\ \mathrm{K} \approx 24\,^\circ\mathrm{C}
$$

That's it, the same 2 m² slab: the front absorbs ~2722W of sunlight and ships ~800W of it to the GPU as electricity. In reality, they are the same slab and heat travels from front to the back. Let's see what happens when the whole slab is one conductive sheet, so it settles at a single temperature, radiating the full 2722W from *both* faces — which is exactly base model v0: **~58°C**. The cells enjoy that cool 58°C, and the GPU sits one heat-pipe hop above → **~70–85°C** (that's where that number came from: the 58°C slab plus the 10–30°C pipe penalty).

## How expensive is launching those data center slabs into space?

First, we need to figure out how heavy are things. Let's estimate it bottom-up, for one **2 m² slab carrying a single H100**. A rough mass budget:

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

What's the right yardstick? Not the chip's $25k sticker — what you're really buying is ~5 years of *running* that GPU, which on the ground costs real money. Just the electricity for an 800W GPU over five years is ~35,000 kWh ≈ **$3,500** (nearer $5,000 with cooling, and use $0.1 per KW) — and in orbit the sun delivers it for free. That's the last column above: on Falcon 9, launch costs ~9–20× the energy it would save; only at **Starship's ~$100/kg does launch (~$2,000) drop *below* the five years of energy it replaces**. 

## Can we make the slab lighter?

Launch is billed by the kilogram, so mass *is* the game — and a datacenter GPU's weight is mostly things space lets you throw away. On the ground a server is largely chassis, fans, finned heatsinks, and power supplies; in orbit the slab itself is the heatsink, there's nothing to fan, and solar power arrives as DC so you feed the chip almost directly — no heavy PSUs. Strip it to bare die on a vapor chamber with a minimal shared host. The same logic runs through every component:

| Component | Earth-style | In orbit |
|---|---|---|
| Compute (GPU + board + power) | ~4 kg | ~1.5 kg — no chassis/fans/PSU, bare-die |
| Solar array, 2 m² | ~3 kg | ~1.5 kg — thin-film (~1 kg/m²) |
| Radiator | ~3 kg | ~1.5 kg — doubles as structure; run it hotter to shrink it |
| Structure | ~2 kg | ~1 kg — zero-g, only launch loads to survive |
| Bus (avionics, comms, attitude, thruster, battery) | ~6 kg | ~1 kg — amortized over thousands of chips per platform; a dawn–dusk sun-synchronous orbit has no eclipse, so almost no battery |
| **Per H100** | **~18–20 kg** | **~6–8 kg** |

None of that needs new physics — it's mostly *deleting* terrestrial overhead and sharing one satellite bus across thousands of chips. Call it a ~3× cut, with a hard floor near ~5 kg (the HBM stack, the die, and the minimum panel and radiator can't vanish).

And it pulls the launch math right back. At ~7 kg per slab:

- **Falcon 9, list price** (~$3,500/kg) → ~**$25k** — still 7x cost of terrestrial energy source. SpaceX's internal cost's probably bringing this down to 3x corresponding terrestrial cost.
- **Starship goal** (~$100/kg) → ~**$700** — 20% of terrestrial energy cost.

So, somewhere between Falcon 9 and Starship, we will have total ownership energy cost of space data center beating terrestrial counter part. 

## How to repair in space

Well, you don't, I suspect we will just design software systems to tolerate partial failures of the chips, maybe even have automatic de-orbiting capabilities when certain keep-alive signals stops arriving at those orbiting slabs.

What about radiation — cosmic rays and solar particles wearing the chips down? Real, but largely a known and manageable problem. Two effects matter: *single-event upsets* (a stray particle flips a bit) and *total ionizing dose* (cumulative damage that slowly ages the silicon). The first is mostly a software problem — datacenter GPUs already ship with error-correcting memory, and you add watchdog resets and fleet-level redundancy. The second is the real lifecycle limiter, but in **low Earth orbit it's relatively mild**: Earth's magnetic field deflects most of the flux (it's why the ISS runs ordinary electronics), and a few millimeters of shielding plus the slab's own structure buys margin. Over a ~5-year life the chip is far likelier to hit *economic* obsolescence than radiation death — so it folds into the same "tolerate attrition, fly down the curve, then deorbit" model.

I suspect there are a lot of software issues to be solved in a space oriented data center, a lot more automation's needed as human can't intervene physically. There are also different constraints and trade offs of where the data and computation capabilities is. 

## The other part that works in favor of space data center: edge compute

Set the problems aside for a second, because there's an upside the cost framing misses entirely.

A LEO satellite is ~550 km straight up — which for most of humanity is **closer than the nearest big data center.** A well-connected user reaches a regional data center in 10–40 ms; someone in a remote region or mid-ocean is 80–200 ms away, if they can reach one at all. A compute node directly overhead is ~4 ms. Space compute is new edge compute, by default, for the entire planet. It serves the half of the world that terrestrial data centers can't reach in under 100 ms — maritime, aviation, remote regions, direct-to-handset anywhere.

This basically had already been demonstrated by SpaceX's Starlink system.

## The civilizational competition: China vs USA

If we are to believe that we need 1 billion H100s, sort of one for each of human, we need about 1TW of power, about 30% of all electricity human currently has. 

On one hand, merely increase power build out by 30% shouldn't be something dramatic, and China seems to be doing fine in that regards (they have 30 nuclear power plants under construction). China has a strong central government that can marshal resources, if they decide to they need to build 1TW power supply, they will go build it. 

On the other hand, the US seems simply can't muster political will to build it out on the ground, too many different interests, and different projection of the future needs. This makes space data center uniquely alluring to the US, and by extension western political system that's decentralized. Space is the new frontier, the new West, without too much regulatory hurdles, property rights, NIMBY, etc.. It's very interesting to see how this competition plays out!

--- 

PS: fun fact of SSO, a diagram generated by AI, to really illustrate the power of joined development of this blog post. 

<figure style="margin:2rem auto;max-width:640px">
<svg viewBox="0 0 640 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A sun-synchronous orbit: the satellite's orbit plane stays edge-on to the Sun all year, precessing about one degree per day as Earth travels around the Sun." style="width:100%;height:auto;color:currentColor">
  <circle cx="320" cy="240" r="160" fill="none" stroke="currentColor" stroke-opacity="0.28" stroke-dasharray="3 7"/>
  <path d="M451,148 A160,160 0 0 0 400,101" fill="none" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#a)"/>
  <circle cx="320" cy="240" r="28" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="320" y="245" text-anchor="middle" font-size="13" font-weight="700" fill="#7c2d12">Sun</text>
  <line x1="348" y1="240" x2="466" y2="240" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="2 4"/>
  <circle cx="480" cy="240" r="14" fill="#3b82f6"/>
  <ellipse cx="480" cy="240" rx="7" ry="28" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="480" cy="212" r="3.5" fill="#10b981"/>
  <text x="512" y="244" font-size="12" fill="currentColor">Jan</text>
  <line x1="320" y1="212" x2="320" y2="94" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="2 4"/>
  <circle cx="320" cy="80" r="14" fill="#3b82f6"/>
  <ellipse cx="320" cy="80" rx="28" ry="7" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="348" cy="80" r="3.5" fill="#10b981"/>
  <text x="320" y="52" text-anchor="middle" font-size="12" fill="currentColor">Apr</text>
  <line x1="292" y1="240" x2="174" y2="240" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="2 4"/>
  <circle cx="160" cy="240" r="14" fill="#3b82f6"/>
  <ellipse cx="160" cy="240" rx="7" ry="28" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="160" cy="268" r="3.5" fill="#10b981"/>
  <text x="128" y="244" text-anchor="end" font-size="12" fill="currentColor">Jul</text>
  <line x1="320" y1="268" x2="320" y2="386" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="2 4"/>
  <circle cx="320" cy="400" r="14" fill="#3b82f6"/>
  <ellipse cx="320" cy="400" rx="28" ry="7" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="292" cy="400" r="3.5" fill="#10b981"/>
  <text x="320" y="430" text-anchor="middle" font-size="12" fill="currentColor">Oct</text>
  <text x="320" y="458" text-anchor="middle" font-size="12.5" font-weight="600" fill="currentColor">The plane stays edge-on to the Sun all year → it precesses ~1°/day, for free.</text>
  <defs>
    <marker id="a" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="currentColor" fill-opacity="0.5"/></marker>
  </defs>
</svg>
<figcaption style="text-align:center;font-size:0.85rem;opacity:0.7;margin-top:0.5rem">Each blue dot is Earth a season apart on its yearly trip around the Sun; the green dot is the satellite. The thin ring is the orbit seen edge-on — notice it stays perpendicular to the Sun-line at every season. Keeping it there as Earth moves requires the plane to turn ~1°/day, which Earth's equatorial bulge does for free.</figcaption>
</figure>

---
### Footnotes

[^SSO]: Sun-synchronous orbit itself is a very clever trick.
