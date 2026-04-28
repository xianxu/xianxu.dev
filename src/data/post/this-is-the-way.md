---
title: This is the Way
publishDate: 2025-09-24
comments: false
excerpt: "Healthcare's fragmentation isn't an accident — it's federalism plus misaligned incentives, where EHR vendors profit by locking customers in. NexHealth's Synchronizer attacks the problem at the technical layer, with the law (and a recent 4th Circuit ruling) on its side, eventually."
tags:
  - tech
---
`"Show me the incentive, and I will show you the outcome." - Charlie Munger`

### The Fragmentation in Healthcare

One striking feature of the American healthcare system is its fragmentation. This stems both from the locally oriented nature of healthcare and from the divided authority between federal and state governments in our constitutional setup. The effect is especially visible in the software behind the system: you have hundreds of Electronic Health Record (EHR) systems! 

On the market side, healthcare is a physical service built on local, personal relationships. Unlike digital products, it resists centralization; beyond a certain scale, efficiency gains are likely limited. On the regulatory side, federalism entrenches state authority, particularly in healthcare, leaving the federal government with only partial influence, mostly through an expansive but not unlimited commerce clause. That's why you have laws that promote interoperability, with penalty of exclusion from the Medicare and Medicaid programs...

This fragmentation makes innovation harder. Imagine a startup building an AI receptionist for clinics (actually a [real example: Dentina.AI](https://synchronizer.io/case-studies/all-star-pediatric-dentistry)), or new kind of Dental Insurance [Clerri](https://clerri.com/). Building the voice agent that answers phone calls to schedule appointments itself is difficult enough; integrating the actual appointments into dozens of EHR systems, each with unique APIs (or no API at all), formats, and quirks, is harder still. Each system represents a small TAM, further raising the barrier to entry for startups.

That is why NexHealth exists: to be the integration layer between fragmented EHRs and the innovators in healthcare.

### The Misaligned Incentives

Fragmentation is only half the story. Misaligned incentives are the other [^othman]. As Charlie Munger has noted, misalignment shapes outcomes [^munger]. EHR vendors profit by locking in customers, they have little incentive to open data. Innovators in the healthcare space, by contrast, need access to data to deliver value. When incentives diverge, failure is predictable: startups intending to create uniform API inevitably discover the limitations of official APIs, fall victim to sudden API policy changes, or face exorbitant fees that make their businesses unsustainable. All those have happened to our API customers! 

### The Synchronizer Way

NexHealth took a fundamentally different approach. Instead of relying solely on vendor-provided APIs, or absence of which, we built the Synchronizer: using myriad of technical means to access directly at different layers in EHR's technical stack. This native integration gives us the necessary flexibility and adaptability to serve customers regardless EHRs' support levels.

This may sound many shades of gray. But the law is actually on our side. The government is on our side against [EHR information block](https://www.hhs.gov/press-room/hhs-crackdown-health-data-blocking.html)[^info-blocking], as they always want to promote innovations in the healthcare space, and allowing data freely flowing is a key part of it. Courts are siding with innovators too: the 4th Circuit recently held that EHRs can be [held accountable](https://www.ca4.uscourts.gov/opinions/241773.p.pdf) during preliminary injunction stage, under state unfair competition laws when the EHR leveraged their position to block rivals.

Taking many steps back, at its core, this is just common sense. The data belongs to doctors and patients, not to EHR vendors, who are merely custodians. Blocking authorized access undermines care and innovation. While this may not be the only reason for rising healthcare cost, it must be one of them.

### Changing the Market Dynamics

So how does the landscape change from here? The secret of NexHealth is to align incentives, one market vertical at a time. By delivering the best customer experience to doctors and patients, we establish ourselves as the de facto standard in that market: the only platform that consistently can offer seamless access across diverse EHRs in that market. Once we reach a critical point, market dynamics shift: big enterprises come to us to make previously impossible integration happen. And in time, EHR vendors will have to work with us rather than ignore or fight us.

We are early in this journey, but the path is clear and we see market changing. It is indeed an exciting time.

**So, this is the way: to disrupt the status quo in healthcare, focus on customers and change market dynamics by creating aligned incentives.**

### We Are Hiring!

We’re building something ambitious, and we’re looking for talented engineers to join us on this journey. If this mission excites you, connect with me on [LinkedIn](https://www.linkedin.com/in/xianxu/), I’d love to hear from you! Check out our [jobs page](https://www.linkedin.com/company/nexhealth-inc/jobs/).


[^othman]: Othman Laraki, "To Learn a New Market, Start by Building Your Product", [link](https://review.firstround.com/to-learn-a-new-market-start-by-building-your-product/)
[^info-blocking]: Read more about federal government's position around [information blockin](https://www.healthit.gov/topic/information-blocking)
[^munger]: Charlie Munger: "Show me the incentive and I'll show you the outcome".
