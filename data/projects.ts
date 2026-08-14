import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "ip-sage",
    title: "IP-Sage",
    eyebrow: "Research · Network Measurement",
    tagline: "Determining who actually operates 238 million IPv4 addresses.",
    description:
      "IP-Sage is an LLM-powered platform that automates the identification of IPv4 address operators at internet scale. By layering structured Censys lookups with pruning, LLM interpretation, and a persistent cache, it maps 238M addresses to 13.7K unique operators with 87% accuracy and a 66% coverage improvement over prior baselines.",
    category: "Research",
    year: "2025",
    featured: true,
    cover: "/assets/projects/ip-sage/ip-sage-1.webp",
    coverAlt: "IP-Sage terminal interface showing IP operator attribution",
    paper: {
      title: "OperatorLLMs",
      venue: "IMC '25",
      year: "2025",
      href: "/assets/papers/OperatorLLMs_IMC25.pdf",
    },
    metrics: [
      { value: "238M", label: "IPv4 addresses" },
      { value: "13.7K", label: "unique operators" },
      { value: "87.0%", label: "accuracy" },
      { value: "66%", label: "coverage gain" },
    ],
    technologies: ["Python", "Go", "BigQuery", "GCP", "OpenAI", "Claude"],
    links: [],
    sections: [
      {
        type: "prose",
        heading: "Problem",
        body: [
          "Attributing an IP address to the organization that operates it is foundational for network security, policy, and research — but public databases are stale and noisy. The goal was a system that can answer one question at scale: who operates this address?",
        ],
      },
      {
        type: "visual",
        heading: "Pipeline",
        visual: "ownership-pipeline",
        caption:
          "The cache lets previously resolved operators be reused across the full 238M-address snapshot — the warm path skips the expensive LLM step entirely.",
      },
      {
        type: "prose",
        heading: "How it works",
        body: [
          "Each IP is resolved to its hosting domains via Censys, then aggressively pruned — cloud providers, CDNs, parked domains, and 404s never reach the expensive step. The surviving evidence is interpreted by an LLM into an operator classification, with structured guardrails when the model is uncertain.",
          "Because adjacent addresses almost always share an operator, every answer is written back to a BigQuery-backed cache. The cache turns the worst-case cold lookup into a single key scan, which is what makes the full 238M-address sweep tractable.",
        ],
      },
      {
        type: "paper",
        heading: "Research note",
        paper: {
          title: "OperatorLLMs",
          venue: "IMC '25",
          year: "2025",
          href: "/assets/papers/OperatorLLMs_IMC25.pdf",
        },
      },
      {
        type: "metrics",
        heading: "Results",
        metrics: [
          { value: "87.0%", label: "accuracy vs. human labelers" },
          { value: "1.73s", label: "time per IP, cold" },
          { value: "66%", label: "coverage improvement" },
          { value: "13.7K", label: "operators identified" },
        ],
      },
    ],
  },
  {
    slug: "specsplit",
    title: "SpecSplit",
    eyebrow: "Systems · GPU Inference",
    tagline: "Disaggregated speculative decoding across networked GPU nodes.",
    description:
      "SpecSplit decouples draft and target LLM inference over gRPC so a small 8B draft model on one node can speculate tokens for a 70B target on another. Tree-structured drafts, KV cache management, and a full benchmark suite reach 75% token acceptance at γ=1 with <0.1% network overhead.",
    category: "Systems",
    year: "2025",
    featured: true,
    cover: "/assets/projects/specsplit/dashboard.png",
    coverAlt: "SpecSplit dashboard visualizing speculative decoding throughput",
    paper: {
      title: "SpecSplit",
      venue: "Research paper",
      year: "2025",
      href: "/assets/papers/SpecSplit.pdf",
    },
    metrics: [
      { value: "75%", label: "token acceptance" },
      { value: "2 tok/s", label: "throughput" },
      { value: "<0.1%", label: "network overhead" },
      { value: "γ=1", label: "speculation depth" },
    ],
    technologies: ["Python", "PyTorch", "gRPC", "CUDA", "NVIDIA DGX"],
    links: [
      { label: "GitHub", href: "https://github.com/SamvritS/SpecSplit", external: true },
    ],
    sections: [
      {
        type: "prose",
        heading: "Problem",
        body: [
          "Speculative decoding speeds up LLM generation by having a small draft model guess tokens that a large target model verifies in parallel. In practice the two models must be co-located — a real constraint when the target is a 70B parameter model on limited hardware.",
        ],
      },
      {
        type: "visual",
        heading: "Topology",
        visual: "specsplit-topology",
        caption:
          "Draft and target live on separate GPUs — the tree of candidates crosses one gRPC hop, so a rejected branch never poisons later verification.",
      },
      {
        type: "prose",
        heading: "Design decisions",
        body: [
          "Tree-structured drafts let the draft model propose a branching set of continuations in a single round-trip, amortizing network latency against verification cost. KV caches are sharded per speculation tree so rejected branches never poison later verification.",
          "A benchmark harness measures acceptance rate, tokens-per-second, and network overhead across prompt shapes — the γ=1 point accepts three of every four draft tokens, and the whole pipeline sustains 2 tokens/second end-to-end.",
        ],
      },
      {
        type: "figure",
        heading: "Acceptance heatmap",
        figure: {
          src: "/assets/projects/specsplit/acceptance_heatmap.png",
          alt: "Heatmap of token acceptance across speculation depth",
          caption: "Token acceptance by speculation depth and position.",
          source: "SpecSplit",
        },
      },
      {
        type: "gallery",
        heading: "Benchmarks",
        images: [
          {
            src: "/assets/projects/specsplit/tpot_vs_gamma.png",
            alt: "Tokens per token-acceptance versus gamma",
            caption: "Throughput and acceptance as speculation depth γ varies.",
            source: "SpecSplit",
          },
          {
            src: "/assets/projects/specsplit/tokens_per_second_by_prompt.png",
            alt: "Tokens per second by prompt shape",
            caption: "End-to-end tokens per second across prompt categories.",
            source: "SpecSplit",
          },
          {
            src: "/assets/projects/specsplit/network_overhead.png",
            alt: "Network overhead of disaggregated speculation",
            caption: "gRPC network overhead relative to total generation time.",
            source: "SpecSplit",
          },
          {
            src: "/assets/projects/specsplit/verify_vs_draft_time.png",
            alt: "Verification versus draft generation time",
            caption: "Breakdown of draft, verify, and transfer time per request.",
            source: "SpecSplit",
          },
        ],
      },
    ],
  },
  {
    slug: "optfantasy",
    title: "OptFantasy",
    eyebrow: "Optimization · AI/ML",
    tagline: "Convex quadratic lineups for weekly fantasy football.",
    description:
      "A convex quadratic optimization framework that casts lineup selection as an MIQCP with player covariance modeling. Six methods — MILP, LP rounding, an ADP heuristic, McCormick linearization, QCP, and baselines — are compared across the full 2024 NFL season; the ADP heuristic scores 2,089 points out-of-sample in under 0.1 seconds.",
    category: "AI/ML",
    year: "2025",
    featured: false,
    cover: "/assets/projects/optfantasy/method_score_comparison.png",
    coverAlt: "Method score comparison chart for OptFantasy",
    paper: {
      title: "OptFantasy",
      venue: "CSE 203B · Winter 2026",
      year: "2026",
      href: "/assets/papers/OptFantasy.pdf",
    },
    metrics: [
      { value: "2,089", label: "out-of-sample points" },
      { value: "<0.1s", label: "solve time" },
      { value: "6", label: "methods compared" },
      { value: "17", label: "NFL weeks simulated" },
    ],
    technologies: ["Python", "Gurobi", "Pandas", "NumPy", "Matplotlib"],
    links: [
      { label: "GitHub", href: "https://github.com/SamvritS/OptFantasy", external: true },
    ],
    sections: [
      {
        type: "prose",
        heading: "Problem",
        body: [
          "Roster construction under a salary cap is a classic knapsack variant, but expected points alone ignore variance — two lineups with the same mean score can have very different week-to-week risk. Modeling the covariance between players makes the problem quadratic and much harder.",
        ],
      },
      {
        type: "prose",
        heading: "What won",
        body: [
          "The ADP heuristic — a greedy, admissible line construction with iterative refinement — beat every exact method on out-of-sample score while solving in microseconds. It exposes the real tradeoff: exact solvers minimize the wrong objective (in-sample variance) while the heuristic balances risk and ceiling week to week.",
        ],
      },
      {
        type: "visual",
        heading: "Decision landscape",
        visual: "optfantasy-comparison",
        caption:
          "Every method plotted by solve time against out-of-sample score — the ADP heuristic wins on both axes.",
      },
      {
        type: "figure",
        heading: "Player value frontier",
        figure: {
          src: "/assets/projects/optfantasy/player_value_frontier.png",
          alt: "Player value frontier for lineup selection",
          caption: "Expected points against cost, showing the efficient frontier the optimizer navigates.",
          source: "OptFantasy",
        },
      },
      {
        type: "paper",
        heading: "Research note",
        paper: {
          title: "OptFantasy",
          venue: "CSE 203B · Winter 2026",
          year: "2026",
          href: "/assets/papers/OptFantasy.pdf",
        },
      },
      {
        type: "gallery",
        heading: "Season results",
        images: [
          {
            src: "/assets/projects/optfantasy/method_score_comparison.png",
            alt: "Method score comparison across the season",
            caption: "Final out-of-sample scores for all six methods across the 2024 season.",
            source: "OptFantasy",
          },
          {
            src: "/assets/projects/optfantasy/weekly_score_trajectories.png",
            alt: "Weekly score trajectories by method",
            caption: "Week-to-week scores, showing where the ADP heuristic pulls ahead.",
            source: "OptFantasy",
          },
          {
            src: "/assets/projects/optfantasy/integrality_gap.png",
            alt: "Integrality gap of the MIQCP relaxation",
            caption: "Integrality gap between the continuous relaxation and integer solutions.",
            source: "OptFantasy",
          },
          {
            src: "/assets/projects/optfantasy/runtime_vs_score.png",
            alt: "Runtime versus score tradeoff",
            caption: "The runtime-to-score frontier that favors fast heuristics over exact solvers.",
            source: "OptFantasy",
          },
          {
            src: "/assets/projects/optfantasy/method_cumulative_trajectory.webp",
            alt: "Cumulative score trajectory of each method",
            caption: "Cumulative points over the season for every method.",
            source: "OptFantasy",
          },
        ],
      },
    ],
  },
  {
    slug: "lomaverse",
    title: "LomaVerse",
    eyebrow: "Graphics · Scientific Computing",
    tagline: "A differentiable N-body gravitational simulator.",
    description:
      "LomaVerse derives equations of motion from a Hamiltonian formulation using automatic differentiation, then integrates them with multiple numerical schemes. It simulates stable solar systems, binary stars, chaotic three-body interactions, and Lagrange-point dynamics — validated against known celestial configurations.",
    category: "Graphics",
    year: "2025",
    featured: true,
    cover: "/assets/projects/lomaverse/SolarSystem3D.jpg",
    coverAlt: "3D solar system rendered in LomaVerse",
    metrics: [
      { value: "N-body", label: "gravitational physics" },
      { value: "AD", label: "Hamiltonian derivation" },
      { value: "3D+2D", label: "renderers" },
      { value: "4+", label: "integrators" },
    ],
    technologies: ["Loma", "Python", "Three.js", "Flask"],
    links: [
      { label: "GitHub", href: "https://github.com/SamvritS/LomaVerse", external: true },
    ],
    sections: [
      {
        type: "prose",
        heading: "Idea",
        body: [
          "Most physics simulators hand-write the equations of motion. LomaVerse instead starts from the Hamiltonian — the system's total energy — and lets automatic differentiation produce the gradients that drive time integration. Change the potential, and the dynamics follow automatically.",
        ],
      },
      {
        type: "visual",
        heading: "Orbital mechanics",
        visual: "lomaverse-orbit",
        caption:
          "A stable solar system holding its orbits for thousands of steps — the differentiable Hamiltonian core keeps trajectories honest.",
      },
      {
        type: "prose",
        heading: "Validation",
        body: [
          "The simulator is validated against configurations with known solutions: stable solar systems that hold their orbits over thousands of steps, binary stars that stay bound, and the unstable Lagrange points that any integration error quickly destroys. The differentiable core makes it a natural fit for scientific computing experiments.",
        ],
      },
      {
        type: "figure",
        heading: "Chaotic three-body dynamics",
        figure: {
          src: "/assets/projects/lomaverse/Chaos3D.webp",
          alt: "Chaotic three-body interaction rendered in LomaVerse",
          caption: "Three-body chaos, where the differentiable Hamiltonian core keeps trajectories honest.",
          source: "LomaVerse",
        },
      },
      {
        type: "gallery",
        heading: "Simulated systems",
        images: [
          {
            src: "/assets/projects/lomaverse/SolarSystem3D.jpg",
            alt: "Three-dimensional solar system in LomaVerse",
            caption: "A stable solar system rendered in the 3D viewer.",
            source: "LomaVerse",
          },
          {
            src: "/assets/projects/lomaverse/SolarSystem2D.jpg",
            alt: "Two-dimensional solar system orbits",
            caption: "The same system in the 2D orbit renderer.",
            source: "LomaVerse",
          },
          {
            src: "/assets/projects/lomaverse/Binary2D.jpg",
            alt: "Binary star system in 2D",
            caption: "A bound binary pair holding its orbit over thousands of steps.",
            source: "LomaVerse",
          },
          {
            src: "/assets/projects/lomaverse/Binary3D.jpg",
            alt: "Binary star system in 3D",
            caption: "Binary dynamics with the Hamiltonian core enforcing conservation.",
            source: "LomaVerse",
          },
          {
            src: "/assets/projects/lomaverse/Chaos2D.jpg",
            alt: "Chaotic three-body interaction in 2D",
            caption: "Chaotic trajectories where tiny perturbations change outcomes.",
            source: "LomaVerse",
          },
          {
            src: "/assets/projects/lomaverse/UI.jpg",
            alt: "LomaVerse user interface",
            caption: "The LomaVerse UI for configuring masses, potentials, and integrators.",
            source: "LomaVerse",
          },
        ],
      },
    ],
  },
  {
    slug: "honeyllm",
    title: "HoneyLLM",
    eyebrow: "Systems · Security",
    tagline: "Detecting and deterring LLM use in technical interviews.",
    description:
      "A canary-based framework that transforms assessment content into an active defense layer. Five detection modalities — ASCII smuggling, canary URL visitation, solution watermarks, and OCR resistance — surface LLM use during virtual interviews with high attack success rates across providers.",
    category: "Systems",
    year: "2025",
    featured: true,
    cover: "/assets/projects/interview-site/SystemDesign.jpg",
    coverAlt: "HoneyLLM system design diagram",
    paper: {
      title: "HoneyLLM",
      venue: "Research report",
      year: "2025",
      href: "/assets/projects/interview-site/HoneyLLM.pdf",
    },
    metrics: [
      { value: "5", label: "detection modalities" },
      { value: "multi", label: "LLM providers" },
      { value: "active", label: "defense layer" },
      { value: "CSE 291Y", label: "research course" },
    ],
    technologies: ["Next.js", "TypeScript", "Supabase", "Python", "PostgreSQL"],
    links: [
      {
        label: "Live",
        href: "https://interview-platform-ecru-gamma.vercel.app",
        external: true,
      },
    ],
    sections: [
      {
        type: "prose",
        heading: "Problem",
        body: [
          "LLMs can now solve the kinds of assessment problems used in interviews, making it hard to know whether you are evaluating the candidate or the model. HoneyLLM turns the assessment itself into a tripwire.",
        ],
      },
      {
        type: "visual",
        heading: "Defense modalities",
        visual: "honeyllm-flow",
        caption:
          "Canary content fans out into three independent detection channels that converge on a single deterrence signal.",
      },
      {
        type: "prose",
        heading: "How it works",
        body: [
          "Invisible ASCII smuggling canaries leak into whatever the model copies verbatim; canary URLs fire only if the model is asked to visit them; watermarks fingerprint generated solutions. Together they produce high-confidence, provider-agnostic signals that deter misuse rather than just detecting it after the fact.",
        ],
      },
      {
        type: "figure",
        heading: "Results",
        figure: {
          src: "/assets/projects/interview-site/Results.jpg",
          alt: "HoneyLLM detection results across providers",
          caption: "Attack success and detection rates across LLM providers.",
          source: "HoneyLLM",
        },
      },
      {
        type: "gallery",
        heading: "Platform",
        images: [
          {
            src: "/assets/projects/interview-site/SysDesign.jpg",
            alt: "HoneyLLM system design overview",
            caption: "End-to-end system design: content injection, telemetry, and verdicting.",
            source: "HoneyLLM",
          },
          {
            src: "/assets/projects/interview-site/Gemini.png",
            alt: "Gemini response to a canary-injected interview",
            caption: "Gemini leaking an invisible ASCII canary verbatim into its answer.",
            source: "HoneyLLM",
          },
          {
            src: "/assets/projects/interview-site/Qwen.jpg",
            alt: "Qwen response to a canary-injected interview",
            caption: "Qwen exhibiting the same smuggling behaviour.",
            source: "HoneyLLM",
          },
          {
            src: "/assets/projects/interview-site/Cluely.jpg",
            alt: "Cluely response to a canary-injected interview",
            caption: "Cluely preserving the canary, confirming provider-agnostic detection.",
            source: "HoneyLLM",
          },
          {
            src: "/assets/projects/interview-site/Claude.webp",
            alt: "Claude response to a canary-injected interview",
            caption: "Claude reproducing the watermark under adversarial prompting.",
            source: "HoneyLLM",
          },
          {
            src: "/assets/projects/interview-site/HoneyBucket.webp",
            alt: "HoneyBucket canary URL telemetry",
            caption: "Canary URL visitation telemetry recorded per candidate.",
            source: "HoneyLLM",
          },
        ],
      },
    ],
  },
  {
    slug: "country-in-the-middle",
    title: "Country-in-the-Middle",
    eyebrow: "Research · Internet Measurement",
    tagline: "Mapping governments on the paths between users and their states.",
    description:
      "An internet measurement study identifying countries that sit on the network path between users and their governments. Analyzing 9,000+ IP-level paths to government websites from 11 countries, the work examines data sovereignty and foreign surveillance exposure. Part of UCSD's Early Research Scholars Program.",
    category: "Research",
    year: "2024",
    featured: true,
    cover: "/assets/projects/traceroutes/heatmap_violators.png",
    coverAlt: "Heatmap of countries appearing on government network paths",
    paper: {
      title: "Country-in-the-Middle",
      venue: "IMC '25",
      year: "2025",
      href: "/assets/papers/gov_traceroutes_paper.pdf",
    },
    metrics: [
      { value: "9,000+", label: "IP paths analyzed" },
      { value: "11", label: "countries measured" },
      { value: "RIPE", label: "Atlas measurement" },
      { value: "ERSP", label: "UCSD program" },
    ],
    technologies: ["Python", "Pandas", "RIPE Atlas API"],
    links: [],
    sections: [
      {
        type: "prose",
        heading: "Research question",
        body: [
          "When a citizen talks to their government online, that traffic may transit another country's infrastructure. The study quantifies how often, and through whom, by mapping the physical network path between users and their governments' websites across 11 countries.",
        ],
      },
      {
        type: "visual",
        heading: "On the path",
        visual: "citm-topology",
        caption:
          "A request to a government website can pass through a third country's infrastructure — the country in the middle.",
      },
      {
        type: "figure",
        heading: "Path analysis",
        figure: {
          src: "/assets/projects/traceroutes/methodology.png",
          alt: "Country-in-the-Middle methodology diagram",
          caption: "Methodology for attributing IP hops to countries and flagging in-between exposure.",
          source: "Country-in-the-Middle",
        },
      },
      {
        type: "paper",
        heading: "Research note",
        paper: {
          title: "Country-in-the-Middle",
          venue: "IMC '25",
          year: "2025",
          href: "/assets/papers/gov_traceroutes_paper.pdf",
        },
      },
      {
        type: "gallery",
        heading: "Findings",
        images: [
          {
            src: "/assets/projects/traceroutes/heatmap_violators.png",
            alt: "Heatmap of in-between countries",
            caption: "Frequency with which each country appears in the middle of measured paths.",
            source: "Country-in-the-Middle",
          },
          {
            src: "/assets/projects/traceroutes/definitions.png",
            alt: "Definitions of country-in-the-middle",
            caption: "Definitions used to classify countries in the middle of a path.",
            source: "Country-in-the-Middle",
          },
          {
            src: "/assets/projects/traceroutes/types_of_targets.png",
            alt: "Types of government targets measured",
            caption: "Breakdown of the government websites measured in each country.",
            source: "Country-in-the-Middle",
          },
          {
            src: "/assets/projects/traceroutes/cdf_unlabeled_hops.png",
            alt: "CDF of hops that could not be attributed",
            caption: "Distribution of unlabeled hops — the attribution challenge the study faced.",
            source: "Country-in-the-Middle",
          },
          {
            src: "/assets/projects/traceroutes/banjo_graph_with_outline.png",
            alt: "Network graph of paths through countries",
            caption: "Graph of measured paths, highlighting countries that repeatedly sit in the middle.",
            source: "Country-in-the-Middle",
          },
        ],
      },
    ],
  },
  {
    slug: "gpu-megakernels",
    title: "GPU Megakernels",
    eyebrow: "Research · GPU Programming",
    tagline: "Runtime-managed shared memory for LLM megakernels.",
    description:
      "Research on improving ThunderKittens for GPU megakernel optimization. A runtime-managed shared-memory architecture addresses inter-op memory bottlenecks; analysis of Llama-8B with batching identifies concrete memory-movement opportunities inside ThunderKittens kernels.",
    category: "Research",
    year: "2025",
    featured: false,
    cover: "/assets/projects/gpu-kernels/Llama.jpg",
    coverAlt: "Llama kernel memory analysis in ThunderKittens",
    paper: {
      title: "Deep Dive into ThunderKittens",
      venue: "Research report",
      year: "2025",
      href: "/assets/projects/gpu-kernels/Paper.pdf",
    },
    metrics: [
      { value: "Llama-8B", label: "kernel analysis" },
      { value: "CUDA", label: "implementation" },
      { value: "shared", label: "memory management" },
      { value: "TK", label: "ThunderKittens" },
    ],
    technologies: ["CUDA", "C++", "ThunderKittens", "GPU Programming"],
    links: [],
    sections: [
      {
        type: "prose",
        heading: "Approach",
        body: [
          "Megakernels keep an entire LLM step resident on the GPU, avoiding kernel-launch overhead but straining shared memory. This work introduces a runtime-managed shared-memory allocator so ops can hand memory to each other directly instead of bouncing through global memory.",
        ],
      },
      {
        type: "visual",
        heading: "Anatomy",
        visual: "megakernel-anatomy",
        caption:
          "A runtime-managed shared-memory allocator lets SMs hand buffers to each other over a shared bus instead of bouncing through global memory.",
      },
      {
        type: "figure",
        heading: "Memory movement",
        figure: {
          src: "/assets/projects/gpu-kernels/Delay.jpg",
          alt: "Memory delay analysis across megakernel operations",
          caption: "Shared-memory pressure and delay across operations in a batched Llama megakernel.",
          source: "GPU Megakernels",
        },
      },
      {
        type: "gallery",
        heading: "Kernel results",
        images: [
          {
            src: "/assets/projects/gpu-kernels/Llama.jpg",
            alt: "Llama kernel memory analysis",
            caption: "Memory-movement opportunities identified inside a batched Llama-8B megakernel.",
            source: "GPU Megakernels",
          },
          {
            src: "/assets/projects/gpu-kernels/MatrixMult.jpg",
            alt: "Matrix multiplication within a megakernel",
            caption: "Shared-memory allocation for matrix operations under the runtime manager.",
            source: "GPU Megakernels",
          },
          {
            src: "/assets/projects/gpu-kernels/ProcessorPipeline.jpg",
            alt: "Processor pipeline inside the megakernel",
            caption: "Pipeline stages and the memory handoffs between them.",
            source: "GPU Megakernels",
          },
        ],
      },
    ],
  },
  {
    slug: "cs1-llm",
    title: "CS1-LLM Experience Report",
    eyebrow: "Research · CS Education",
    tagline: "Integrating LLMs into introductory computer science.",
    description:
      "An experience report on integrating LLMs into an introductory CS course: the design principles behind a CS1-LLM curriculum, and evaluation of student outcomes and perceptions. Presented at ITiCSE 2024.",
    category: "Research",
    year: "2024",
    featured: false,
    cover: "/assets/research/ITiCSE/LLM_workflow_image.png",
    coverAlt: "LLM workflow diagram for CS1 students",
    paper: {
      title: "CS1-LLM Experience Report",
      venue: "ITiCSE '24",
      year: "2024",
      href: "/assets/papers/CS1_LLM_Experience_Report__ITiCSE_2024_.pdf",
    },
    metrics: [
      { value: "ITiCSE", label: "2024 publication" },
      { value: "CS1", label: "course context" },
      { value: "100s", label: "students measured" },
      { value: "multi", label: "assessment modes" },
    ],
    technologies: ["Curriculum Design", "Python", "Pandas"],
    links: [
      {
        label: "arXiv",
        href: "https://arxiv.org/abs/2406.15379",
        external: true,
      },
    ],
    sections: [
      {
        type: "prose",
        heading: "Design",
        body: [
          "A new CS1 course integrates LLMs as learning tools rather than banning them. Students learn to prompt, critique, and verify model output, and the course's objectives were redesigned around the skills that survive a GenAI world.",
        ],
      },
      {
        type: "prose",
        heading: "Findings",
        body: [
          "Student exam outcomes — including demographic differences — largely matched historical cohorts, large open-ended projects were particularly valuable in the LLM context, and students found the tools helpful while worrying about over-reliance.",
        ],
      },
      {
        type: "figure",
        heading: "Student perceptions",
        figure: {
          src: "/assets/research/ITiCSE/copilot_comfort.png",
          alt: "Student comfort with Copilot in the CS1-LLM course",
          caption: "How helpful students found LLM tools, and their comfort using them.",
          source: "CS1-LLM Experience Report",
        },
      },
      {
        type: "gallery",
        heading: "Course evidence",
        images: [
          {
            src: "/assets/research/ITiCSE/LLM_workflow_image.png",
            alt: "LLM workflow used in the CS1-LLM course",
            caption: "The structured workflow students used when working with LLMs.",
            source: "CS1-LLM Experience Report",
          },
          {
            src: "/assets/research/ITiCSE/copilot_helped_hindered.png",
            alt: "How Copilot helped or hindered students",
            caption: "Where students reported Copilot helping versus hindering their work.",
            source: "CS1-LLM Experience Report",
          },
          {
            src: "/assets/research/ITiCSE/divergent_column_percent_small.png",
            alt: "Divergent responses across assessment columns",
            caption: "Divergence in student responses across assessment formats.",
            source: "CS1-LLM Experience Report",
          },
        ],
      },
    ],
  },
  {
    slug: "problem-decomposition",
    title: "Problem Decomposition",
    eyebrow: "Research · CS Education",
    tagline: "Assessing decomposition in the GenAI era.",
    description:
      "Question Suites — scaffolded sequences that build context before asking students to decompose a problem — assess problem decomposition in CS1. This work documents the design of the assessments and how students received them.",
    category: "Research",
    year: "2025",
    featured: false,
    cover: "/assets/research/ITiCSE/divergent_column_percent_small.png",
    coverAlt: "Assessment results for problem decomposition questions",
    paper: {
      title: "Assessing Problem Decomposition in the GenAI Era",
      venue: "arXiv",
      year: "2025",
      href: "https://arxiv.org/abs/2511.05764",
    },
    metrics: [
      { value: "QA", label: "Question Suites" },
      { value: "CS1", label: "target course" },
      { value: "decomp", label: "assessed skill" },
      { value: "2025", label: "arXiv" },
    ],
    technologies: ["Python", "Pandas", "Curriculum Design", "Assessment"],
    links: [],
    sections: [
      {
        type: "prose",
        heading: "Challenge",
        body: [
          "Problem decomposition — breaking a large task into well-defined pieces — is critical in a world where students can generate code on demand, yet there is no consensus on how to teach or assess it. The defining challenge is that decomposition questions carry necessarily long contexts.",
        ],
      },
      {
        type: "prose",
        heading: "Solution",
        body: [
          "Question Suites scaffold the context: a sequence of smaller questions builds shared understanding before the student attempts the decomposition itself. This practitioner paper reports the assessment design and student impressions.",
        ],
      },
    ],
  },
  {
    slug: "pap-inventory",
    title: "PAP Inventory Processing",
    eyebrow: "Full Stack · Non-profit",
    tagline: "Streamlining furniture delivery for veterans.",
    description:
      "A full-stack application for Patriots and Paws, a 501(c)(3) delivering home furnishings to veterans. Firebase role-based auth for administrators and volunteers, a responsive React/Next.js frontend, and MongoDB for robust inventory and request management — replacing a manual process.",
    category: "Club",
    year: "2024",
    featured: false,
    cover: "/assets/projects/pap-inventory/pap-inventory-1.jpg",
    coverAlt: "PAP Inventory Processing dashboard",
    metrics: [
      { value: "501(c)(3)", label: "non-profit client" },
      { value: "RBAC", label: "role-based auth" },
      { value: "MongoDB", label: "data layer" },
      { value: "Next.js", label: "frontend" },
    ],
    technologies: ["React", "Next.js", "TypeScript", "Firebase", "MongoDB"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/TritonSE/PAP-Inventory-Processing",
        external: true,
      },
    ],
    sections: [
      {
        type: "prose",
        heading: "Scope",
        body: [
          "Built with Triton Software Engineering for Patriots and Paws, replacing a cumbersome manual furniture-request workflow with a structured inventory system: administrators manage items and volunteers process requests through a clean, responsive interface.",
        ],
      },
      {
        type: "gallery",
        heading: "Interface",
        images: [
          {
            src: "/assets/projects/pap-inventory/pap-inventory-1.jpg",
            alt: "PAP Inventory Processing dashboard",
            caption: "The dashboard administrators use to manage the furniture inventory.",
            source: "PAP Inventory Processing",
          },
          {
            src: "/assets/projects/pap-inventory/pap-inventory-2.jpg",
            alt: "Inventory item management screen",
            caption: "Managing individual furniture items and their status.",
            source: "PAP Inventory Processing",
          },
          {
            src: "/assets/projects/pap-inventory/pap-inventory-3.jpg",
            alt: "Request processing workflow",
            caption: "Processing and fulfilling veteran furniture requests.",
            source: "PAP Inventory Processing",
          },
          {
            src: "/assets/projects/pap-inventory/pap-inventory-4.jpg",
            alt: "Mobile-friendly inventory view",
            caption: "The responsive interface used by volunteers on site.",
            source: "PAP Inventory Processing",
          },
        ],
      },
    ],
  },
  {
    slug: "psyches-of-color",
    title: "Psyches of Color App",
    eyebrow: "Mobile · Non-profit",
    tagline: "Connecting Black and Latinx youth with culturally competent care.",
    description:
      "A cross-platform resource directory for Psyches of Color, a 501(c)(3) providing culturally relevant mental-health support. Built with React Native and TypeScript on Firebase, the app connects youth with culturally competent therapists and support groups.",
    category: "Club",
    year: "2024",
    featured: false,
    cover: "/assets/projects/psyches-of-color/psyches-of-color-1.jpg",
    coverAlt: "Psyches of Color app screens",
    metrics: [
      { value: "RN", label: "React Native" },
      { value: "iOS+", label: "Android" },
      { value: "Firebase", label: "backend" },
      { value: "501(c)(3)", label: "non-profit client" },
    ],
    technologies: ["React Native", "TypeScript", "Firebase"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/TritonSE/Psyches-Of-Color-App",
        external: true,
      },
    ],
    sections: [
      {
        type: "prose",
        heading: "Scope",
        body: [
          "Built with Triton Software Engineering to reduce stigma and promote healing: a directory of culturally competent therapists and support groups, delivered as a polished cross-platform mobile app backed by Firebase.",
        ],
      },
      {
        type: "gallery",
        heading: "Screens",
        images: [
          {
            src: "/assets/projects/psyches-of-color/psyches-of-color-1.jpg",
            alt: "Psyches of Color app home screen",
            caption: "The home screen connecting youth to culturally competent care.",
            source: "Psyches of Color App",
          },
          {
            src: "/assets/projects/psyches-of-color/psyches-of-color-2.jpg",
            alt: "Resource directory screen",
            caption: "Browsing therapists and support groups by need.",
            source: "Psyches of Color App",
          },
          {
            src: "/assets/projects/psyches-of-color/psyches-of-color-3.jpg",
            alt: "Therapist profile view",
            caption: "A therapist profile with credentials and specialties.",
            source: "Psyches of Color App",
          },
          {
            src: "/assets/projects/psyches-of-color/psyches-of-color-4.jpg",
            alt: "Support group listing",
            caption: "Support groups and community resources.",
            source: "Psyches of Color App",
          },
        ],
      },
    ],
  },
  {
    slug: "parkinsons-predictor",
    title: "Parkinson's Disease Predictor",
    eyebrow: "Machine Learning",
    tagline: "Predicting risk from social and medical factors.",
    description:
      "A machine learning project analyzing social and medical factors to predict Parkinson's likelihood, reaching 77% accuracy with Logistic Regression and Decision Trees. A deep dive into data cleaning, feature engineering, and model selection.",
    category: "Personal",
    year: "2024",
    featured: false,
    metrics: [
      { value: "77%", label: "accuracy" },
      { value: "2", label: "model families" },
      { value: "ED", label: "feature engineering" },
      { value: "ML", label: "healthcare risk" },
    ],
    technologies: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/COGS108/Group057-FA24",
        external: true,
      },
    ],
    sections: [
      {
        type: "prose",
        heading: "Scope",
        body: [
          "A COGS 108 group project examining how demographic and medical signals predict Parkinson's disease, underscoring how machine learning can identify at-risk populations for earlier intervention.",
        ],
      },
    ],
  },
  {
    slug: "developer-journal",
    title: "Developer Journal",
    eyebrow: "Full Stack · PWA",
    tagline: "A local-first task hub, journal, and file system.",
    description:
      "Led a team of 10 building an all-in-one task hub, journal, and file storage system for developers — a local-first Progressive Web App on Electron and SQLite, with a GitHub Actions CI/CD pipeline using Playwright and Prettier.",
    category: "Personal",
    year: "2024",
    featured: false,
    metrics: [
      { value: "10", label: "people led" },
      { value: "PWA", label: "local-first" },
      { value: "CI/CD", label: "GitHub Actions" },
      { value: "SQLite", label: "storage" },
    ],
    technologies: ["JavaScript", "Electron", "Playwright", "SQLite3"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/cse110-sp24-group7/cse110-sp24-group7",
        external: true,
      },
    ],
    sections: [
      {
        type: "prose",
        heading: "Scope",
        body: [
          "A CSE 110 team project: a developer-oriented task hub, journal, and file storage system with automated QA and deployment baked into the pipeline.",
        ],
      },
    ],
  },
  {
    slug: "sentiment-classifier",
    title: "Political Sentiment Classifier",
    eyebrow: "Machine Learning · NLP",
    tagline: "BERT transformers with 85%+ accuracy.",
    description:
      "Deployed BERT transformers to predict political sentiment from documents with over 85% accuracy, including data processing, visualizations, and k-fold cross-validation to mitigate overfitting using PyTorch and NumPy.",
    category: "Club",
    year: "2023",
    featured: false,
    metrics: [
      { value: "85%+", label: "accuracy" },
      { value: "BERT", label: "transformer" },
      { value: "k-fold", label: "validation" },
      { value: "ACM AI", label: "project" },
    ],
    technologies: ["PyTorch", "Numpy", "TensorFlow", "Matplotlib"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/acmucsd-projects/fa22-ai-team-2",
        external: true,
      },
    ],
    sections: [
      {
        type: "prose",
        heading: "Scope",
        body: [
          "An ACM AI project applying BERT to political sentiment classification, with careful cross-validation to keep the model honest.",
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const spotlightProject = featuredProjects[0];
export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
