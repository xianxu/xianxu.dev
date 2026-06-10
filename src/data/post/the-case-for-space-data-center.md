---
title: The Case for Space Data Centers
publishDate: 2026-06-05
published: true
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

Forget the chips for a moment. Hang a plain slab in Earth orbit and ask what temperature it settles at. Sunlight there delivers $S = 1361\ \mathrm{W/m^2}$ [^tsi] onto the lit face, if perfectly facing the Sun. The slab soaks that up and re-radiates it as infrared from both surfaces (front and back). A surface at temperature $T$ radiates $\varepsilon\sigma T^4$ per face (Stefan–Boltzmann; $\sigma = 5.67\times10^{-8}\ \mathrm{W/m^2K^4}$, emissivity $\varepsilon \approx 1$). Set what comes in equal to what goes out:

$$
S = 2\,\varepsilon\sigma T^4 \quad\Rightarrow\quad T = \left(\frac{S}{2\varepsilon\sigma}\right)^{1/4} = \left(\frac{1361}{2\times5.67\times10^{-8}}\right)^{1/4} \approx 331\ \mathrm{K} \approx 58\,^\circ\mathrm{C}
$$

Fifty-eight degrees. A bare slab in full Sun just sits at about 58°C — a perfectly fine temperature for electronics, and we haven't lifted a finger to cool it. 

### Model v1: now use that 30% electricity to power a GPU

Now make it a data center. We plate one side of our slab solar panels, and the other side, at its center, a GPU chip of dimension about 0.1 m² [^chip]. A good space solar cell turns ~30% of that sunlight (~400 W) into electricity, the electricity runs that GPU, and the GPU turns essentially all of it back into heat (30% of solar energy received). The total energy hasn't changed, but its distribution has — and that change is what drives how hot our GPU gets.

One NVIDIA H100 draws ~700–800 W [^h100], so it rides on about 2 m² of panel ($0.30 \times 1361 \times 2 \approx 800\ \mathrm{W}$). The trouble is the chip is tiny — about **0.1 m²** — sitting on the back of the slab. In this model we are still lazy, and don't provide any heat dissipation to the chip: whatever the chip makes, it has to radiate from its own little footprint (and only the back face — the front is busy collecting sun). That's ~800 W forced out through 0.1 m²:

$$
T_\text{GPU} = \left(\frac{Q}{\varepsilon\sigma A_\text{chip}}\right)^{1/4} = \left(\frac{800}{5.67\times10^{-8}\times 0.1}\right)^{1/4} \approx 613\ \mathrm{K} \approx 340\,^\circ\mathrm{C}
$$

The slab around it is at a comfortable 58°C, but the chip itself is a glowing **~340°C** spot — and silicon gives up above ~100°C.

That, in one number, is the first GPU-in-space problem: how to get that 800 W to radiate out from that 0.1 m² surface and keep it within silicon's operating temperature range.

## Model v2, a slab with heat pipe

It turns out this is solved by a decades-old design in spaceflight: heat pipe. 

A heat pipe is a sealed tube holding a little working fluid — in space, usually **ammonia**. Heat boils it at the hot end; the vapor rushes to the cold end and condenses onto the radiator; and a **wick** (a porous lining on the wall) pulls the liquid back by capillary action. No pump, no moving parts — fully passive, which is exactly why it works in zero-g. It's proven at scale, too: the ISS sheds ~70 kW [^iss] through a couple hundred m² of deployable ammonia radiators — at that size via *pumped* loops rather than passive pipes, but a single 800 W chip needs only a passive pipe or vapor chamber, the kind already in your desktop GPU.

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

To launch ~20 kg to space [^falcon9]:

| Vehicle | Cost to LEO | Per H100-unit | vs. 5-yr ground energy (~$3.5k) |
|---|---|---|---|
| Falcon 9, list price             | ~$3,500/kg | ~$70,000 | ~20× |
| Falcon 9, SpaceX's marginal cost | ~$1,500/kg | ~$30,000 | ~9× |
| Starship, stated goal            | ~$100/kg   | ~$2,000  | ~0.6× |

So if we treat launch cost as the item to offset energy cost in a terrestrial system, we need to get to the stated goal of Starship [^starship] to be advantageous. And we can likely do better still on weight — thin-film arrays and sharing one satellite bus across many chips.

## How to repair in space

Well, you don't, I suspect we will just design software systems to tolerate partial failures of the chips. 

What about radiation — cosmic rays and solar particles wearing the chips down? Real, but largely a known and manageable problem. LEO still benefits from Earth's magnetic shielding — which is why the ISS can run plenty of commercial, off-the-shelf electronics. As with computer components, you don't need to design components for too long a life cycle, as it will be economically obsolete in 5 years. 

I suspect there are a lot of interesting software issues to be solved in a space oriented data center, a lot more automation is needed, since humans can't intervene physically. There are also different constraints and trade-offs in where the data and the computation live. 

## Manufacturing cost: calibrating against Starlink

A current Starlink V2 Mini is the closest real, flying yardstick — a comparable satellite platform, minus the expensive compute:

| One Starlink V2 Mini | Value |
|---|---|
| Mass | ~800 kg [^starlink] |
| Solar array | ~120 m² |
| Power generated (est. @ ~400 W/m²) | ~40–50 kW |
| Build cost (bus only) | ~$0.25–0.5M [^starlink-cost] |
| Launch share (~22 per Falcon 9) | ~$1M |

Read as a compute platform, that ~50 kW would power ~60 H100s — so a Starlink-class satellite is roughly a **60-GPU node**. Spread its ~\$0.25–0.5M bus across those \~60 GPUs and the platform is only **\~\$5–8k per GPU** (and ~13 kg per GPU) — both *below* our per-H100 estimates, since Starlink hauls no dense compute or radiator. The point: the spacecraft hardware is the cheap part — once you add an expensive chip like a GPU. The cost stack is **chip ≫ launch ≳ platform** — the H100, and (until Starship) the launch, dominate; the satellite around it does not.

## The civilizational competition: China vs USA

When I think about space data center, I realize it's not that we don't know how to build data centers on Earth, that part is easy. The messy part is how do you fund such dramatic build-up and where. Let's see some numbers.

If we believe we'll need ~1 billion H100s — roughly one per person in the advanced economies — that's about 1 TW of power, ~30% of all the electricity humanity currently generates [^elec]. 

On one hand, merely increasing power build out by 30% shouldn't be something dramatic, and China seems to be doing just that (they have around 30 reactors under construction [^nuclear]). China has a strong central government that can marshal resources, if they decide they need 1 TW of power supply, they will go build it. 

On the other hand, it's harder to muster the political will in US to build out on the ground. Too many different interests, jurisdictions, environmental reviews, birds to protect [^birds], and different views of future demand. This makes space data center uniquely alluring to the US, and by extension western political system that's decentralized. It's intriguing the "market" is willing to award 1.7 trillion dollars [^IPO] to bet on such an orbital data center, as if the market already picked such a path. 

Space is the new frontier, and in that new frontier, you don't have too much regulatory hurdles, property rights, NIMBY, etc.. 

It's very interesting to see how this competition plays out!

--- 

PS: a fun fact about SSO — plus a pair of AI-generated animations, to illustrate the joint development behind this post. 

<div style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;align-items:flex-start;margin:2rem auto;max-width:760px">
<figure style="flex:1 1 300px;min-width:260px;margin:0">
<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A satellite's orbital plane stays edge-on to the Sun all year by precessing about one degree per day as the Earth travels around the Sun." style="width:100%;height:auto;color:currentColor;font-family:sans-serif">
  <!-- Earth's yearly path around the Sun -->
  <circle cx="320" cy="240" r="160" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="3 7"/>
  <!-- the Sun -->
  <circle cx="320" cy="240" r="30" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="320" y="245" text-anchor="middle" font-size="13" font-weight="700" fill="#7c2d12">Sun</text>
  <!-- Earth + its edge-on orbit + satellite, precessing as one rigid arm around the Sun -->
  <g>
    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 320 240" to="360 320 240" dur="24s" repeatCount="indefinite"/>
    <!-- faint Sun-line: from Earth toward the Sun -->
    <line x1="463" y1="240" x2="354" y2="240" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="2 5"/>
    <!-- Earth's shadow: rays from the Sun's center graze Earth's top and bottom and diverge, so the cone WIDENS away from the Sun (the night side) -->
    <path d="M480,225 L555,218 L555,262 L480,255 Z" fill="#475569" fill-opacity="0.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="5 4"/>
    <!-- orbit ring, FAR half — drawn behind Earth, so it's hidden where it passes behind the globe (top-down view) -->
    <path d="M480,206 A9,34 0 0 0 480,274" fill="none" stroke="#10b981" stroke-width="2" stroke-opacity="0.4"/>
    <!-- satellite, FAR pass: shown only during the 2nd half of the loop (back semicircle), behind Earth — the globe occludes it in the middle, the poles stay visible -->
    <g opacity="0"><animateMotion dur="3s" repeatCount="indefinite" path="M480,206 A9,34 0 1 1 480,274 A9,34 0 1 1 480,206 Z"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" calcMode="discrete" values="0;1" keyTimes="0;0.5"/><rect x="-2" y="-10" width="4" height="20" fill="#60a5fa" stroke="#1e3a8a" stroke-width="0.5"/><circle r="4" fill="#10b981"/></g>
    <!-- Earth (over the shadow base and the far-side orbit) -->
    <circle cx="480" cy="240" r="15" fill="#3b82f6"/>
    <!-- orbit ring, NEAR half — drawn in front of Earth -->
    <path d="M480,206 A9,34 0 0 1 480,274" fill="none" stroke="#10b981" stroke-width="2" stroke-opacity="0.95"/>
    <!-- satellite, NEAR pass: shown only during the 1st half of the loop (front semicircle), riding over the globe -->
    <g opacity="1"><animateMotion dur="3s" repeatCount="indefinite" path="M480,206 A9,34 0 1 1 480,274 A9,34 0 1 1 480,206 Z"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes="0;0.5"/><rect x="-2" y="-10" width="4" height="20" fill="#60a5fa" stroke="#1e3a8a" stroke-width="0.5"/><circle r="4" fill="#10b981"/></g>
  </g>
  <text x="320" y="464" text-anchor="middle" font-size="12.5" font-weight="600" fill="currentColor">The plane stays edge-on to the Sun all year &#8594; it precesses ~1&#176;/day, for free.</text>
</svg>
<figcaption style="text-align:center;font-size:0.8rem;opacity:0.75;margin-top:0.4rem"><strong>With the bulge (real Earth).</strong> The plane precesses ~1&#176;/day, staying edge-on to the Sun all year — panel lit, orbit clear of the shadow.</figcaption>
</figure>
<figure style="flex:1 1 300px;min-width:260px;margin:0">
<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Without precession the orbital plane stays fixed in space, so as the Earth orbits the Sun the plane drifts from edge-on to face-on, the solar panel turns away from the Sun, and the orbit slides into Earth's shadow." style="width:100%;height:auto;color:currentColor;font-family:sans-serif">
  <!-- Earth's yearly path around the Sun -->
  <circle cx="320" cy="240" r="160" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="3 7"/>
  <!-- the Sun -->
  <circle cx="320" cy="240" r="30" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="320" y="245" text-anchor="middle" font-size="13" font-weight="700" fill="#7c2d12">Sun</text>
  <!-- Sun-line + shadow ROTATE around the Sun, so they stay radial (pointing at / away from the Sun). Earth lives in the revolving group below, so it can sit BETWEEN the orbit halves and occlude the back one. -->
  <g>
    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 320 240" to="360 320 240" dur="24s" repeatCount="indefinite"/>
    <!-- faint Sun-line: from Earth toward the Sun -->
    <line x1="463" y1="240" x2="354" y2="240" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="2 5"/>
    <!-- Earth's shadow (night side), trailing away from the Sun -->
    <path d="M480,225 L555,218 L555,262 L480,255 Z" fill="#475569" fill-opacity="0.4" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  </g>
  <!-- COPIED from the LEFT figure's occlusion stack (orbit-far / satellite-far / Earth / orbit-near / satellite-near) — same draw order, so Earth hides the back half. The ONLY difference: this group REVOLVES by <animateMotion rotate="0"> (position circles the Sun, orientation stays FIXED = no precession) instead of the left's rotate (= precession). Contents are relative to Earth's centre at the origin; 24s period matches the Sun-line rotation so Earth + Sun-line stay aligned. -->
  <g>
    <animateMotion dur="24s" repeatCount="indefinite" rotate="0" path="M480,240 A160,160 0 1 1 160,240 A160,160 0 1 1 480,240 Z"/>
    <!-- orbit ring, FAR half — behind Earth (hidden where it passes behind the globe) -->
    <path d="M0,-34 A9,34 0 0 0 0,34" fill="none" stroke="#10b981" stroke-width="2" stroke-opacity="0.4"/>
    <!-- satellite, FAR pass: shown only on the back semicircle, behind Earth -->
    <g opacity="0"><animateMotion dur="3s" repeatCount="indefinite" path="M0,-34 A9,34 0 1 1 0,34 A9,34 0 1 1 0,-34 Z"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" calcMode="discrete" values="0;1" keyTimes="0;0.5"/><rect x="-2" y="-10" width="4" height="20" fill="#60a5fa" stroke="#1e3a8a" stroke-width="0.5"/><circle r="4" fill="#10b981"/></g>
    <!-- Earth (over the far-side orbit + satellite) -->
    <circle cx="0" cy="0" r="15" fill="#3b82f6"/>
    <!-- orbit ring, NEAR half — in front of Earth -->
    <path d="M0,-34 A9,34 0 0 1 0,34" fill="none" stroke="#10b981" stroke-width="2" stroke-opacity="0.95"/>
    <!-- satellite, NEAR pass: shown only on the front semicircle, over Earth; panel (navy) starts facing the Sun, then drifts as the fixed plane fails to track it -->
    <g opacity="1"><animateMotion dur="3s" repeatCount="indefinite" path="M0,-34 A9,34 0 1 1 0,34 A9,34 0 1 1 0,-34 Z"/><animate attributeName="opacity" dur="3s" repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes="0;0.5"/><rect x="-2" y="-10" width="4" height="20" fill="#60a5fa" stroke="#1e3a8a" stroke-width="0.5"/><circle r="4" fill="#10b981"/></g>
  </g>
  <text x="320" y="464" text-anchor="middle" font-size="12.5" font-weight="600" fill="currentColor">Perfect ball &#8594; no precession &#8594; the plane drifts edge-on &#8594; face-on in ~3 months.</text>
</svg>
<figcaption style="text-align:center;font-size:0.8rem;opacity:0.75;margin-top:0.4rem"><strong>Perfect ball — no bulge.</strong> No precession, so by Newton the plane stays fixed in space; a quarter-year on it's face-on — panel edge-on to the Sun, orbit sliding into the shadow.</figcaption>
</figure>
</div>

The only difference between the two is that free ~1&#176;/day nudge from Earth's equatorial bulge. **With it** (left), the orbit plane turns just fast enough to track the Sun all year — a *sun-synchronous* orbit. **Without it** (right), Newton wins: the plane keeps its fixed orientation in space, so as the Earth rounds the Sun the once-perfect dawn–dusk orbit drifts toward noon–midnight in about three months — and the free lunch is gone.

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
