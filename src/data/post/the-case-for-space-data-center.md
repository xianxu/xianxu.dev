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

Is space data center a great idea, a stupid idea, or something in between? I haven't heard much about why it would work, but plenty of naysayers, for example, there's no air to cool things off in space. With SpaceX going IPO, I decide to take a closer look, and it's intriguing. My prediction: it's just a matter of time before we run data centers in space. It makes a lot of sense — there are "merely" engineering problems left. Let's take a look at the feasibility and cost perspective. 

> This, btw, is another use my "brain extension" (nous/brain) [^brain]. AI taught me a bunch of things along the way (facts, maths), and I pushed back a bunch (long range logical consistency, intent, compare to terrestrial data centers etc.). I did author this post myself in an AI assisted flow I'll make another post about. 

---

## The nice things about space

First of all, the allure of space is the eternal sunshine, 24/7 (if we go with sun-synchronous orbit [^SSO]), without atmosphere (thus more energy), without cloudy days, without hurricanes. So a space data center can be powered largely for free. It's like the perfect environment for silicon "lives"! 

Now, the question is, can we engineer our way out of the engineering and economic challenges to really put a data center in space. Will it be economically viable? 

Let's take a look. 

## The form factor assumption

Picture the simplest possible configuration: a slab of solar panel. Chips embedded on the backside of it, away from the Sun. The Sun-facing side captures the energy; and both sides radiate them away, leveraging the coldness of the space. That's it, just a slab, that looks like the solar panels on your roof, as large as a rocket can send up without any mechanical folding.

## How do you cool things in space without air?

Cooling things on Earth is usually about moving cooler air or fluid across the surface of a hotter object. When you sweat, you use a fan. There's no air in space for you to fan, and some have used it as the death knell of the whole idea of a space data center. That's lazy. Space is really really really cold, like near absolute zero kelvin cold. There, radiation cools things down. The question is: is it enough? Intuitively, if you were ejected into space without a space suit, you'd imagine you'd freeze pretty fast. Let's do some math. 

### Model v0: a bare slab in the Sun

Forget the chips for a moment. Hang a plain slab in Earth orbit and ask what temperature it settles at. Sunlight there delivers $S = 1361\ \mathrm{W/m^2}$[^tsi] onto the lit face, if perfectly facing the Sun. The slab soaks that up and re-radiates it as infrared from both surfaces (front and back). A surface at temperature $T$ radiates $\varepsilon\sigma T^4$ per face (Stefan–Boltzmann; $\sigma = 5.67\times10^{-8}\ \mathrm{W/m^2K^4}$, emissivity $\varepsilon \approx 1$). Set what comes in equal to what goes out:

$$
S = 2\,\varepsilon\sigma T^4 \quad\Rightarrow\quad T = \left(\frac{S}{2\varepsilon\sigma}\right)^{1/4} = \left(\frac{1361}{2\times5.67\times10^{-8}}\right)^{1/4} \approx 331\ \mathrm{K} \approx 58\,^\circ\mathrm{C}
$$

Fifty-eight degrees. A bare slab in full Sun just sits at about 58°C — a perfectly fine temperature for electronics, and we haven't lifted a finger to cool it. 

### Model v1: now use that 30% electricity to power a GPU

Now make it a data center. We plate one side of our slab solar panels, and the other side, at its center, a GPU chip of dimension about 0.1 m²[^chip]. A good space solar cell turns ~30% of that sunlight (~400 W) into electricity, the electricity runs that GPU, and the GPU turns essentially all of it back into heat (30% of solar energy received). The total energy hasn't changed, but its distribution has — and that change is what drives how hot our GPU gets.

One NVIDIA H100 draws ~700–800 W[^h100], so it rides on about 2 m² of panel ($0.30 \times 1361 \times 2 \approx 800\ \mathrm{W}$). The trouble is the chip is tiny — about **0.1 m²** — sitting on the back of the slab. In this model we are still lazy, and don't provide any heat dissipation to the chip: whatever the chip makes, it has to radiate from its own little footprint (and only the back face — the front is busy collecting sun). That's ~800 W forced out through 0.1 m²:

$$
T_\text{GPU} = \left(\frac{Q}{\varepsilon\sigma A_\text{chip}}\right)^{1/4} = \left(\frac{800}{5.67\times10^{-8}\times 0.1}\right)^{1/4} \approx 613\ \mathrm{K} \approx 340\,^\circ\mathrm{C}
$$

The slab around it is at a comfortable 58°C, but the chip itself is a glowing **~340°C** spot — and silicon gives up above ~100°C.

That, in one number, is the first GPU-in-space problem: how to get that 800 W to radiate out from that 0.1 m² surface and keep it within silicon's operating temperature range.

## Model v2, a slab with heat pipe

It turns out this is solved by a decades-old design in spaceflight: heat pipe. 

A heat pipe is a sealed tube holding a little working fluid — in space, usually **ammonia**. Heat boils it at the hot end; the vapor rushes to the cold end and condenses onto the radiator; and a **wick** (a porous lining on the wall) pulls the liquid back by capillary action. No pump, no moving parts — fully passive, which is exactly why it works in zero-g. It's proven at scale, too: the ISS sheds ~70 kW[^iss] through a couple hundred m² of deployable ammonia radiators — at that size via *pumped* loops rather than passive pipes, but a single 800 W chip needs only a passive pipe or vapor chamber, the kind already in your desktop GPU.

A quick reality check on radiator size: the ISS rejects on the order of ~280 W per m² — a rough real-world benchmark (the exact area depends on how you count). By that yardstick our 800 W chip wants ~2.8 m², a bit more than the 2 m² it rides on. So 2 m² is marginal: size up a little, or let it run a touch warmer.

So we put a heat pipe (or its flat cousin, a vapor chamber) between the GPU and the back panel. It carries the H100's 800 W from the 0.1 m² chip out across the whole 2 m² back with only a small temperature penalty — counting the losses where heat enters and leaves the pipe, in practice about **10–30°C**. (That's not a clean formula — it's the pipe's thermal resistance times the load: a good vapor chamber runs ~0.01–0.04 °C per watt, so at 800 W that's ~10–30°C, almost all of it at the two end interfaces, since the vapor transport itself is nearly isothermal.)

Now the back panel just has to radiate those 800 W into space from the back face of the slab, while also helping the front dissipate the rest ~2722 W of sunlight. From base model v0, we know roughly the slab would be at **~58°C** in equilibrium temperature. The solar panel enjoys that cool 58°C, and the GPU sits one heat-pipe hop above → **~68–88°C**, within GPU's operating range.

## How expensive is launching such a slab into LEO?

First, we need to figure out how heavy it is. Let's estimate it bottom-up, for one **2 m² slab carrying a single H100**. A rough mass budget:

| Component | Mass |
|---|---|
| Solar array, 2 m² | ~3 kg |
| Radiator + heat pipes, 2 m² | ~3 kg |
| Compute — H100 + board + memory + power + NIC (no Earth-style cooling) | ~4 kg |
| Structure / frame | ~2 kg |
| Avionics + laser comms + attitude control | ~3 kg |
| Electric thruster + propellant + eclipse battery | ~3 kg |
| **Total per H100** | **~18–20 kg** |

Is ~10 kg/m² realistic? Yes — a real, flying Starlink satellite comes in around **6.7 kg/m²** (more on that in the Starlink calibration below); our slab's extra mass is just the dense compute and radiator Starlink doesn't carry. So ~20 kg per H100 is a sane, even slightly conservative figure — not wishful thinking.

To launch ~20 kg to space[^falcon9]:

| Vehicle | Cost to LEO | Per H100-unit | vs. 5-yr ground energy (~$3.5k) |
|---|---|---|---|
| Falcon 9, list price             | ~$3,500/kg | ~$70,000 | ~20× |
| Falcon 9, SpaceX's marginal cost | ~$1,500/kg | ~$30,000 | ~9× |
| Starship, stated goal            | ~$100/kg   | ~$2,000  | ~0.6× |

So if we treat launch cost as the item to offset energy cost in a terrestrial system, we need to get to the stated goal of Starship[^starship] to be advantageous. And we can likely do better still on weight — thin-film arrays and sharing one satellite bus across many chips.

## How to repair in space

Well, you don't, I suspect we will just design software systems to tolerate partial failures of the chips. 

What about radiation — cosmic rays and solar particles wearing the chips down? Real, but largely a known and manageable problem. LEO still benefits from Earth's magnetic shielding — which is why the ISS can run plenty of commercial, off-the-shelf electronics. As with computer components, you don't need to design components for too long a life cycle, as it will be economically obsolete in 5 years. 

I suspect there are a lot of interesting software issues to be solved in a space oriented data center, a lot more automation is needed, since humans can't intervene physically. There are also different constraints and trade-offs in where the data and the computation live. 

## Manufacturing cost: calibrating against Starlink

A current Starlink V2 Mini is the closest real, flying yardstick — a comparable satellite platform, minus the expensive compute:

| One Starlink V2 Mini | Value |
|---|---|
| Mass | ~800 kg[^starlink] |
| Solar array | ~120 m² |
| Power generated (est. @ ~400 W/m²) | ~40–50 kW |
| Build cost (bus only) | ~$0.25–0.5M[^starlink-cost] |
| Launch share (~22 per Falcon 9) | ~$1M |

Read as a compute platform, that ~50 kW would power ~60 H100s — so a Starlink-class satellite is roughly a **60-GPU node**. Spread its ~$0.25–0.5M bus across those ~60 GPUs and the platform is only **~$5–8k per GPU** (and ~13 kg per GPU) — both *below* our per-H100 estimates, since Starlink hauls no dense compute or radiator. The point: the spacecraft hardware is the cheap part — once you add an expensive chip like a GPU. The cost stack is **chip ≫ launch ≳ platform** — the H100, and (until Starship) the launch, dominate; the satellite around it does not.

## The civilizational competition: China vs USA

When I think about space data center, I realize it's not that we don't know how to build data centers on Earth, that part is easy. The messy part is how do you fund such dramatic build-up and where. Let's see some numbers.

If we believe we'll need ~1 billion H100s — roughly one per person in the advanced economies — that's about 1 TW of power, ~30% of all the electricity humanity currently generates[^elec]. 

On one hand, merely increasing power build out by 30% shouldn't be something dramatic, and China seems to be doing just that (they have around 30 reactors under construction[^nuclear]). China has a strong central government that can marshal resources, if they decide they need 1 TW of power supply, they will go build it. 

On the other hand, it's harder to muster the political will in US to build out on the ground. Too many different interests, jurisdictions, environmental reviews, birds to protect [^birds], and different views of future demand. This makes space data center uniquely alluring to the US, and by extension western political system that's decentralized. It's intriguing the "market" is willing to award 1.7 trillion dollars [^IPO] to bet on such an orbital data center, as if the market already picked such a path. 

Space is the new frontier, and in that new frontier, you don't have too much regulatory hurdles, property rights, NIMBY, etc.. 

It's very interesting to see how this competition plays out!

--- 

PS: a fun fact about SSO — plus an AI-generated diagram, to illustrate the joint development behind this post. 

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

[^SSO]: Sun-synchronous orbit itself is a very clever trick.
[^brain]: Briefly touched in [this post](./the-value-of-personal-data.md).
[^birds]: A Starship launch was held up partly by environmental review — including protections for nesting shorebirds. Not kidding. https://www.space.com/spacex-starship-florida-move-texas-birds-protection
[^tsi]: Total solar irradiance averages ~1361 W/m² at 1 AU (it varies ~0.1% over the solar cycle). [NASA](https://earth.gsfc.nasa.gov/climate/projects/solar-irradiance/data)
[^h100]: The H100 SXM's rated TDP is ~700 W; the ~800 W used here is the per-slab budget (the chip plus its board and power-conversion overhead). [NVIDIA](https://www.nvidia.com/en-us/data-center/h100/)
[^iss]: The ISS External Active Thermal Control System is designed to reject ~70 kW via two pumped, single-phase **ammonia** loops (2 × 35 kW) feeding deployable radiators; published radiator area ranges widely (~150–420 m²) depending on which radiators and whether one or both faces are counted, so the per-m² figure is a rough order-of-magnitude, not a spec. [NASA ATCS overview (PDF)](https://www.nasa.gov/pdf/473486main_iss_atcs_overview.pdf)
[^chip]: 0.1 m² is a generous stand-in for the chip's mounting footprint; the bare H100 die is only ~800 mm², so a truly unspread chip would run far hotter than the figure here — which only sharpens the point.
[^falcon9]: Falcon 9 lifts ~22.8 tons to LEO at a ~$67M list price (≈ $3,000/kg expendable, ~$4,000/kg on a reused booster); the ~$1,500/kg "marginal" figure is a widely-cited estimate of SpaceX's internal cost, not a published price. [SpaceX](https://www.spacex.com/vehicles/falcon-9/)
[^starship]: Starship's ~$100/kg (and lower) is an aspirational target tied to full reuse and a high flight rate, not a published operational price.
[^starlink]: A Starlink V2 Mini masses ~800 kg with roughly 100–120 m² of solar array (area figures are compiled estimates, not an official SpaceX spec). [SpaceX Gen2 (PDF)](https://www.starlink.com/public-files/Gen2StarlinkSatellites.pdf)
[^starlink-cost]: SpaceX doesn't publish a per-satellite cost; ~$0.25–0.5M to build is a widely-cited estimate. (The ~$500–1,300 figures often quoted are the *user terminal*, not the satellite.) [Starlink — Wikipedia](https://en.wikipedia.org/wiki/Starlink)
[^elec]: 1 TW continuous ≈ 8,760 TWh/yr; world electricity generation is ~30,000 TWh/yr, i.e. ~28–30%. [IEA](https://www.iea.org/)
[^nuclear]: China has on the order of 30 reactors under construction (sources give ~30–40 depending on start-date definitions). [World Nuclear](https://world-nuclear.org/nuclear-reactor-database/summary/China)
[^IPO]: SpaceX set IPO price at $135, valuing the company at 1.77 trillion USD. https://www.nytimes.com/2026/06/03/technology/spacex-ipo-pricing.html
