import type { ContentSection } from "@/lib/types";

export const projectArticles: Record<string, ContentSection[]> = {
  "ip-sage": [
    {
      type: "prose",
      heading: "The question WHOIS stopped answering",
      body: [
        "For vulnerability disclosure and network measurement, the question that matters is who is actually using an address. WHOIS records and AS ownership were never built to answer it. Cloud hosting, virtual hosts, and IP leasing mean the registered owner and the real operator are different organizations more often than not, and the public databases that might bridge the gap are stale, noisy, or both.",
        "So the work falls back on people, and people are slow. During the ground-truth labeling behind this project, attributing a single host took about 81 seconds. That is tolerable for ten addresses and hopeless for a snapshot of hundreds of millions. Manual attribution is also hard to audit after the fact: a guess written down without its evidence is a guess with a timestamp.",
        "What we wanted was not one confident answer per address but a repeatable one, evidence attached: which address, which fields, which operator, and which answers are too weak to use. That last piece is the one manual attribution never provides, because a human asked to guess will usually guess.",
      ],
    },
    {
      type: "visual",
      heading: "Pipeline",
      visual: "ownership-pipeline",
      caption:
        "The full pipeline across a 238M-address snapshot. Once an operator has been resolved from a set of evidence, the cache reuses it, and the warm path never calls the model at all.",
    },
    {
      type: "prose",
      heading: "From raw scan to five fields",
      body: [
        "Every address starts as a Censys app-layer scan, and a raw scan is far too much to hand a language model. The pipeline prunes it into five evidence fields: WHOIS patterns for cloud and ISP ranges, ASN names pulled through ASdb, TLS certificates checked against a trusted CA list, DNS names after normalization and hash filtering, and HTTP status codes. The order is not arbitrary. Cheap, structured evidence runs first, and a field that cannot help tell two operators apart gets dropped before the model ever sees it.",
        "This pruning is where most of the token cost dies. What survives goes to o3-mini in batches of five, under a prompt with a scoped definition of what counts as an operator, structured reasoning, two worked examples, and guardrails that push toward Indiscernible whenever the evidence is thin, on the theory that a missing label beats a wrong one. DNS ends up the most decisive field at 56%, ahead of TLS at 36% and WHOIS at 20%. That ranking is also why the cache keys on each evidence field separately rather than on the final label alone, a choice that pays off below.",
      ],
    },
    {
      type: "system",
      heading: "Anatomy",
      components: [
        { name: "Lookup", receives: "address list", emits: "Censys app-layer scans via the official Python SDK" },
        { name: "Prune", receives: "raw scans", emits: "pruned JSON across five evidence fields" },
        { name: "Cache check", receives: "pruned features", emits: "operator on hit, miss to the model otherwise" },
        { name: "Interpret", receives: "pruned JSON batches of five", emits: "operator label or Indiscernible via o3-mini" },
        { name: "Write back", receives: "every answer", emits: "BigQuery rows keyed per evidence field" },
      ],
    },
    {
      type: "prose",
      heading: "Why the cache carries the scale run",
      body: [
        "Every answer is written back to BigQuery keyed on each evidence field, not on the address alone. The next time the same evidence shows up under a different address, the pipeline skips the model entirely. On the warm path the work is pure lookup and prune: no inference, no per-row API call. That is the only reason a snapshot this size is tractable at roughly $0.006 per IP instead of the price of a fresh model call for every address.",
        "The cache also changes what the measurement can honestly say. It raises the number of identifiable addresses without inflating the number of distinct operators, because one organization shows up under many addresses and many evidence combinations. On the 150K-address run, the pipeline identified 13,777 unique operators. Coverage and operator diversity are different quantities, and conflating them would make the results look stronger than they are.",
      ],
    },
    {
      type: "evidence",
      heading: "Measurements",
      items: [
        { result: "87.0%", basis: "model accuracy against 250 hand-labeled addresses, with human labelers scoring lower on the same set" },
        { result: "46x", basis: "faster than manual attribution: 1.73 seconds per IP against about 81 seconds per host" },
        { result: "$0.006", basis: "cost per IP for the 150K-address run, about $600 over 40 hours" },
        { result: "DNS 56%", basis: "most decisive evidence field, ahead of TLS at 36% and WHOIS at 20%" },
      ],
    },
    {
      type: "prose",
      heading: "Knowing what it does not claim",
      body: [
        "A weak evidence set returns Indiscernible, and those labels get counted rather than hidden. Against the 250 hand-labeled addresses, the model scored higher than the human labelers did on the same set, which says as much about how hard this task is as it does about the model. Neither number makes the system an ownership authority. It is a measurement aid: it records the evidence behind every label and flags the ones it is not confident about.",
        "The open question is time. Operators change, snapshots age, and a single-pass map is a photograph rather than a movie. The cache is exactly what would make a second pass affordable, since everything already resolved costs nothing the next time around. Repeated runs are the obvious next step, because they would turn a static map into one that can show operators appearing and disappearing.",
      ],
    },
  ],

  specsplit: [
    {
      type: "prose",
      heading: "Why split draft and target",
      body: [
        "Speculative decoding is a simple idea: a small draft model guesses a few tokens, and the large target model checks all of them in one forward pass. When the guesses are good you get several tokens for the price of one. Nearly every implementation keeps both models on the same machine, which is a hardware requirement, not a mathematical one. It is also the part that hurts. A 70B target model does not fit alongside its draft model on hardware that tight, so the speedup is unavailable exactly where memory is scarcest.",
        "Splitting the two across machines changes the constraint. A small GPU runs the draft, a larger one runs the target, and the only thing that has to travel is the candidate token sequence plus the scalars needed to verify it. The question we set out to answer was whether that network hop costs more than the co-location it replaces.",
      ],
    },
    {
      type: "visual",
      heading: "Topology",
      visual: "specsplit-topology",
      caption:
        "Draft and target on separate GPUs. Candidates cross one gRPC hop, and a rejected branch never poisons the verification that follows.",
    },
    {
      type: "prose",
      heading: "What actually crosses the wire",
      body: [
        "We built the three pieces from scratch. The draft worker runs a small instruct model with greedy decoding and a local KV cache that resets on a prefix miss. The target worker keeps a session KV cache with O(1) rollback, verifies in a single forward pass, and emits a correction token whenever the prefix diverges. A CPU orchestrator owns the accepted sequence and dispatches to both workers asynchronously, so neither side sits waiting on the other's lock.",
        "Only token IDs and scalar log-probs cross the network, over two RPCs: GenerateDrafts and VerifyDrafts. No hidden states, no weights, nothing that would balloon the payload. One constraint is worth stating plainly, because it is easy to miss: both workers have to share a tokenizer, since verification is an exact greedy match. That is a real limitation of the design, not an assumption we get to quietly make.",
      ],
    },
    {
      type: "figure",
      heading: "Acceptance",
      figure: {
        src: "/assets/projects/specsplit/acceptance_heatmap.png",
        width: 885,
        height: 768,
        fit: "contain",
        blend: "multiply",
        cropMarks: true,
        alt: "Heatmap of token acceptance across speculation depth",
        caption:
          "Token acceptance by speculation depth and position in the draft. Structured prompts cluster near the top of the range; open-ended generation sits far lower.",
        source: "SpecSplit",
      },
    },
    {
      type: "prose",
      heading: "Acceptance depends on what you ask",
      body: [
        "The headline number, 74.6% acceptance at depth one, is an average over 62 prompts in six categories, and the average hides most of the story. Structured factual prompts accept near the top of the range, around 95%. Open-ended generation falls into the low forties. Same draft model, very different tool, depending entirely on the workload.",
        "The heatmap adds the second dimension: acceptance also moves with speculation depth and with position in the draft. On a predictable prompt, a shallow draft gets accepted almost wholesale. Push deeper and the target burns compute checking candidates that never survive. The right depth depends on the prompt mix, so the benchmark reports it per category instead of settling on one number.",
      ],
    },
    {
      type: "figure",
      heading: "Throughput versus depth",
      figure: {
        src: "/assets/projects/specsplit/tpot_vs_gamma.png",
        width: 1050,
        height: 600,
        fit: "contain",
        blend: "multiply",
        alt: "Tokens per token-acceptance versus gamma",
        caption:
          "Throughput and acceptance as speculation depth changes. Rates rise at shallow depth and fall as the tree grows.",
        source: "SpecSplit",
      },
    },
    {
      type: "prose",
      heading: "The cost of guessing deeper",
      body: [
        "Depth trades cheap draft work against expensive verification work. At shallow depth the draft is cheap and most candidate tokens survive, so throughput climbs. As the tree widens, the target spends more of its time checking guesses that get rejected, and the useful tokens per round fall with them. By depth five the end-to-end rate is roughly half the shallow-depth rate, which is why the paper treats depth as a tuning parameter rather than a quality dial.",
        "Tokens per round and tokens per second pull in opposite directions as the tree grows, and that divergence is the tradeoff. The measurements do not support a single best depth. They support a family of operating points, each tied to a prompt category and a latency budget.",
      ],
    },
    {
      type: "figure",
      heading: "Prompt categories",
      figure: {
        src: "/assets/projects/specsplit/tokens_per_second_by_prompt.png",
        width: 1183,
        height: 2512,
        fit: "contain",
        blend: "multiply",
        alt: "Tokens per second by prompt shape",
        caption:
          "End-to-end tokens per second by prompt category, from structured factual work down to open-ended generation.",
        source: "SpecSplit",
      },
    },
    {
      type: "prose",
      heading: "Is the network the bottleneck?",
      body: [
        "We kept the transport narrow on purpose: token IDs and scalar log-probs, nothing else. Measured payloads stay small enough that bandwidth never becomes the issue, and the RPC hop adds roughly two milliseconds against a verify window measured in tens of milliseconds. Verification, not transport, is the expensive step. That single fact is what makes the split design viable at all.",
        "One caveat we are upfront about: the evaluation ran over ngrok, which inflates the RPC path relative to a real datacenter link. Verify time still dominated every round we measured, so the qualitative conclusion holds, but the absolute throughput numbers are not competitive with a co-located engine. The paper is making a feasibility argument, not telling anyone to deploy this as-is.",
      ],
    },
    {
      type: "figure",
      heading: "Network overhead",
      figure: {
        src: "/assets/projects/specsplit/network_overhead.png",
        width: 900,
        height: 600,
        fit: "contain",
        blend: "multiply",
        alt: "Network overhead of disaggregated speculation",
        caption:
          "gRPC overhead relative to total generation time. The hop is visible; it is just not the dominant term.",
        source: "SpecSplit",
      },
    },
    {
      type: "figure",
      heading: "Verify versus draft",
      figure: {
        src: "/assets/projects/specsplit/verify_vs_draft_time.png",
        width: 900,
        height: 750,
        fit: "contain",
        blend: "multiply",
        alt: "Verification versus draft generation time",
        caption:
          "Draft, verify, and transfer time per request. Verification is the largest block on every configuration measured.",
        source: "SpecSplit",
      },
    },
    {
      type: "prose",
      heading: "Verification is the cost that remains",
      body: [
        "On every configuration we measured, verification took 3.5 to 5.5 times longer than drafting, and the transfer is smaller than both. Once you split the machines, the target forward pass is the cost that is left. That is the strongest argument for disaggregation: the expensive model can live wherever it fits, while the cheap model and the orchestrator stay close to the request.",
        "The T4-plus-A100 topology in the paper is a simulation, an estimate of what the split would save per hour against a dual-A100 setup, and we kept it clearly separate from the measured results for exactly that reason. What we measured is the working split itself, the rollback-safe session cache, and the harness that makes acceptance, throughput, and payload comparable across depths.",
      ],
    },
    {
      type: "system",
      heading: "Anatomy",
      components: [
        { name: "Draft worker", receives: "prompt prefix", emits: "greedy token guesses from a small instruct model" },
        { name: "Target worker", receives: "draft tokens", emits: "verdict plus correction token from one forward pass" },
        { name: "Orchestrator", receives: "both streams", emits: "authoritative accepted sequence over async dispatch" },
        { name: "Transport", receives: "token IDs and log-probs", emits: "GenerateDrafts and VerifyDrafts RPCs with small payloads" },
      ],
    },
    {
      type: "evidence",
      heading: "Measurements",
      items: [
        { result: "62 prompts", basis: "six prompt categories, with structured factual QA near 95% acceptance and open-ended generation in the low forties" },
        { result: "1.73 tok/s", basis: "end-to-end throughput at the shallow depth, falling to 0.85 at depth five" },
        { result: "3.5-5.5x", basis: "verify time over draft time on every measured round" },
        { result: "47%", basis: "simulated hourly saving of a T4-plus-A100 topology over dual A100, not yet measured" },
      ],
    },
    {
      type: "prose",
      heading: "What is still untested",
      body: [
        "The evaluation covers linear speculation only. Tree-attention drafting is designed and partly implemented, but it is not in the numbers, because an incomplete implementation would tell us nothing. Cross-family drafting and long-context KV synchronization are untested too, and neither is a small gap: a different draft family could shift acceptance rates, and a long context changes what rollback has to undo.",
        "The network path is the other open question. A datacenter link would cut the RPC cost, but it would also change the deployment economics that make disaggregation interesting in the first place. The next step worth taking is a measured deployment with a co-located baseline on the same hardware. A larger extrapolation from the current pair would just be a bigger guess.",
      ],
    },
  ],

  optfantasy: [
    {
      type: "prose",
      heading: "Projection is not the whole story",
      body: [
        "Pick a fantasy football roster under a salary cap and you have a knapsack problem, the kind operations research solved a long time ago. The catch is that projected points ignore risk. Two rosters with the same expected total can carry completely different week-to-week variance, because players on the same NFL team move together: a quarterback and his top receiver share passing volume, and the whole offense shares a bye week. A roster that looks great on paper can be unplayable the week its best players are all off.",
        "Modeling the covariance between players makes the problem quadratic, and quadratic integer programs are a different animal entirely. The question our course group set out to answer was which formulation you would actually defend: the exact one, the linearized one, or a fast heuristic that gives up a little score. We ran all of them against the same 103 players and 17 weeks of PPR data, then scored every method on the real 2024 season.",
      ],
    },
    {
      type: "prose",
      heading: "Eight methods, one season",
      body: [
        "We compared eight methods end to end. The exact MIQCP keeps the quadratic covariance constraint and binary variables and solves with spatial branch and bound. A McCormick MILP linearizes the pairwise terms with Glover transforms. LP-rounding variants relax the quadratic constraint and repair the fractional answer. An ADP heuristic builds a roster greedily and refines it, and the baselines include brute force on instances small enough to enumerate.",
        "Each method answers a different question, so we kept them all in the scoreboard. The exact solver is the reference for score. The MILP tests whether linearization preserves the optimum. The heuristic measures how much score a fast construction gives up. The rounding variants test whether the quadratic constraint is doing real work at all.",
        "My share of the work was the solver pipelines and the evaluation: CVXPY and Gurobi for the exact program, PuLP and CBC for the linearized ones, the sensitivity sweeps, and the 2024 backtest. The formulation and the dual analysis belonged to my teammates.",
      ],
    },
    {
      type: "implementation",
      heading: "Formulations",
      decisions: [
        { choice: "MIQCP exact", why: "Binary variables with spatial branch and bound; wins the season but teaches nothing about speed" },
        { choice: "McCormick MILP", why: "Glover linearization of pairwise terms; matches the exact score at 47 times the cost" },
        { choice: "ADP heuristic", why: "Greedy construction with refinement; near-optimal points in a fraction of a second" },
        { choice: "2024 backtest", why: "Train on 2021 to 2023, test the full 2024 season, bootstrap the gaps" },
      ],
    },
    {
      type: "prose",
      heading: "How the season came out",
      body: [
        "The exact MIQCP won the season, and the McCormick MILP matched its score exactly while taking 47 times longer. That is a genuinely useful negative result: on this instance, the linearization hands you the same roster at a fraction of the speed. A model that is slower for the same answer needs some other reason to exist, and we did not find one.",
        "The ADP heuristic is the other headline. It lands within striking distance of the optimum in a fraction of a second. The covariance modeling earns its keep too, adding a real margin over the variance-blind MILP, and the bootstrap across 4,000 resamples separates the exact method from the rounding baseline at p = 0.014. The scoreboard ended up as a map of which simplifications survive a full season.",
      ],
    },
    {
      type: "figure",
      heading: "Method comparison",
      figure: {
        src: "/assets/projects/optfantasy/method_score_comparison.webp",
        width: 3600,
        height: 1800,
        fit: "contain",
        blend: "multiply",
        alt: "Method score comparison across the season",
        caption:
          "Final 2024 actuals for all eight methods. The exact solver leads on points, the ADP heuristic on solve time.",
        source: "OptFantasy",
      },
    },
    {
      type: "prose",
      heading: "Bye weeks are where it shows",
      body: [
        "The final table hides the most interesting part. Week by week, the methods separate. The greedy baseline collapses on bye weeks because nothing in its objective ever saw the shared absence coming. The covariance-aware lineups hold up through those same weeks, because the constraint priced the joint risk before the season started.",
        "That is the argument for the quadratic model in one picture. Two rosters can carry the same projection and live very different seasons. The optimizer is not predicting the future any better than anyone else; it is choosing a distribution of outcomes that survives the schedule.",
      ],
    },
    {
      type: "figure",
      heading: "Weekly trajectories",
      figure: {
        src: "/assets/projects/optfantasy/weekly_score_trajectories.png",
        width: 2373,
        height: 1174,
        fit: "contain",
        blend: "multiply",
        alt: "Weekly score trajectories by method",
        caption:
          "Week-to-week scores. The greedy baseline collapses on bye weeks; the covariance-aware methods hold.",
        source: "OptFantasy",
      },
    },
    {
      type: "prose",
      heading: "The menu the solver picks from",
      body: [
        "The player-value plot, expected points against cost, is the clearest explanation of what the optimizer actually does. It walks the upper edge of that cloud, trading draft capital for projected production, while the covariance constraint keeps the roster from turning into a single bet on one offense.",
        "The failure modes are visible in the same plot. A point below the edge leaves value on the table. A point past the cap is not feasible. And where the frontier goes flat, several rosters have near-identical projections, and the covariance term is what breaks the tie.",
      ],
    },
    {
      type: "figure",
      heading: "Player value frontier",
      figure: {
        src: "/assets/projects/optfantasy/player_value_frontier.png",
        width: 2176,
        height: 1374,
        fit: "contain",
        blend: "multiply",
        cropMarks: true,
        alt: "Player value frontier for lineup selection",
        caption:
          "Expected points against cost. The optimizer works along the upper edge of this cloud.",
        source: "OptFantasy",
      },
    },
    {
      type: "prose",
      heading: "Reading the integrality gap",
      body: [
        "The integrality gap measures how far the continuous relaxation sits from the integer answer. At the binding variance target it reaches 4.08%, split into an integer part and a rounding part. A small gap means the rounding step is doing little work. A larger one means the relaxation is advertising a score the integer problem cannot actually reach, which is worth knowing before anyone trusts the bound.",
        "Reporting the gap next to the score is what keeps the optimization honest. The bound is not a promise, and the repair step is part of the result, not an implementation detail to mention in passing.",
      ],
    },
    {
      type: "figure",
      heading: "Integrality gap",
      figure: {
        src: "/assets/projects/optfantasy/integrality_gap.png",
        width: 3000,
        height: 1800,
        fit: "contain",
        blend: "multiply",
        alt: "Integrality gap of the MIQCP relaxation",
        caption:
          "The integrality gap between the continuous relaxation and the integer solutions, peaking where the variance constraint binds.",
        source: "OptFantasy",
      },
    },
    {
      type: "prose",
      heading: "Score against solve time",
      body: [
        "No method wins every column. The exact solver wins on points and still finishes in about a quarter of a second at this instance size. The McCormick MILP is slower for the same score. The ADP heuristic gives up a little score for an enormous amount of time, which is the right trade if the roster has to be rebuilt over and over.",
        "We kept all three families in the writeup because the right answer depends on what the roster is for: a one-shot draft, a nightly rebuild, or a sanity check on what the linear relaxation claims.",
      ],
    },
    {
      type: "visual",
      heading: "Decision landscape",
      visual: "optfantasy-comparison",
      caption:
        "Every method by solve time against out-of-sample score. The exact MIQCP leads on points, the ADP heuristic on speed.",
    },
    {
      type: "figure",
      heading: "Cumulative trajectory",
      figure: {
        src: "/assets/projects/optfantasy/method_cumulative_trajectory.webp",
        width: 3600,
        height: 2100,
        fit: "contain",
        blend: "multiply",
        alt: "Cumulative score trajectory of each method",
        caption:
          "Cumulative points over the season. The gap opens in the weeks where the variance-aware methods dodge the bye-week collapse.",
        source: "OptFantasy",
      },
    },
    {
      type: "evidence",
      heading: "Scoreboard",
      items: [
        { result: "1,849.36", basis: "MIQCP actual 2024 PPR points, matched exactly by the MILP" },
        { result: "+42.8", basis: "points added by covariance modeling over the variance-blind MILP" },
        { result: "4.08%", basis: "integrality gap at the binding variance target, decomposed into integer and rounding parts" },
        { result: "p 0.014", basis: "bootstrap significance of MIQCP over QCP rounding across 4,000 resamples" },
      ],
    },
    {
      type: "paper",
      heading: "Research note",
      paper: {
        title: "OptFantasy: A Quadratically Constrained Programming Approach to Season-Long Fantasy Football Roster Optimization",
        venue: "CSE 203B · Winter 2026",
        year: "2026",
        href: "/assets/papers/OptFantasy.pdf",
      },
    },
    {
      type: "prose",
      heading: "What I would change next",
      body: [
        "One season, one player pool, one scoring format. The bootstrap tells you whether a gap is stable across resamples; it cannot tell you whether the same method wins next year. And the covariance estimate is itself a model: if the pairwise structure is wrong, the optimizer will be confidently wrong in a new way.",
        "The paper's next steps are the ones I would actually take. Better projections from time-series models instead of a decayed seasonal average, a semidefinite relaxation of the covariance constraint, and Ledoit-Wolf shrinkage on the covariance estimate itself. The projections are probably the biggest lever, since the optimizer can only be as good as the numbers it is handed.",
      ],
    },
  ],

  lomaverse: [
    {
      type: "prose",
      heading: "Why start from the Hamiltonian",
      body: [
        "Most physics simulators hand-write their equations of motion, one potential at a time. LomaVerse does it differently: you write down the Hamiltonian, the total energy of the system, and automatic differentiation produces the gradients the integrator steps forward. Change the potential and the dynamics follow. The physics still happens; it just lives in one place instead of being re-derived for every system.",
        "I built it to test whether that abstraction survives contact with reality: stable orbits, bound binaries, and the genuinely chaotic three-body problem. The payoff, if it works, is extensibility. A new potential is just another energy function, and the integration machinery carries over untouched.",
      ],
    },
    {
      type: "visual",
      heading: "Orbital mechanics",
      visual: "lomaverse-orbit",
      caption:
        "A stable solar system holding its orbits over thousands of steps, driven by the differentiable Hamiltonian core.",
    },
    {
      type: "prose",
      heading: "From energy to motion",
      body: [
        "Mechanically, the Hamiltonian is differentiated into the equations of motion, and an integrator advances the state one timestep at a time. Velocity Verlet is the reference; the configuration surface exposes several other integrators so the same initial conditions can be run under different schemes and compared. Masses, positions, velocities, and potentials are all data rather than code, which is what makes the presets reproducible.",
        "The presets are a contract, and I take that seriously. A solar system, a bound binary, a chaotic three-body run, and a Lagrange-point configuration all share one body schema. The renderer never draws a body the integrator did not produce, and the demo never shows a trajectory the figures cannot reproduce. If those two ever disagree, it is a bug, not a feature of the visualization.",
      ],
    },
    {
      type: "figure",
      heading: "Solar system in 3D",
      figure: {
        src: "/assets/projects/lomaverse/SolarSystem3D.webp",
        width: 2200,
        height: 782,
        fit: "cover",
        alt: "Three-dimensional solar system in LomaVerse",
        caption: "A stable solar system in the 3D viewer.",
        source: "LomaVerse",
      },
    },
    {
      type: "prose",
      heading: "Two views of the same state",
      body: [
        "The 2D and 3D renderers are not two simulations. They read the same state and the same presets, so a change in the configuration shows up in both. The 3D view makes the orbital plane and depth legible; the 2D view shows the path shape without perspective getting in the way. Switching between them changes the representation, never the physics.",
        "The configuration UI sits on the same surface. Masses, potentials, and integrators are set there, and the live demo updates with them. I kept the UI plain, because the interesting object on screen is the trajectory, not the controls around it.",
      ],
    },
    {
      type: "figure",
      heading: "Solar system in 2D",
      figure: {
        src: "/assets/projects/lomaverse/SolarSystem2D.jpg",
        width: 1674,
        height: 980,
        fit: "cover",
        alt: "Two-dimensional solar system orbits",
        caption: "The same system in the 2D orbit renderer.",
        source: "LomaVerse",
      },
    },
    {
      type: "prose",
      heading: "What the validation suite actually checks",
      body: [
        "The way I check the simulator is to run configurations whose behavior is known in advance. A stable solar system should hold its orbits for thousands of steps. A bound binary should stay bound. A Lagrange-point configuration should hover near equilibrium, and it is the strictest test in the suite because integration error wrecks it quickly. A chaotic three-body run should diverge the way the equations demand, not in some way the solver invented.",
        "None of this is a proof of correctness for every potential. It is a set of tripwires: if the Hamiltonian core or the integrator is broken, at least one of these configurations will show it. Passing the easy cases is necessary and nowhere near sufficient, so I weight the Lagrange and chaos runs more heavily than the pretty solar-system render.",
      ],
    },
    {
      type: "figure",
      heading: "Bound binary in 2D",
      figure: {
        src: "/assets/projects/lomaverse/Binary2D.jpg",
        width: 2380,
        height: 1332,
        fit: "cover",
        alt: "Binary star system in 2D",
        caption: "A bound binary holding its orbit over thousands of steps.",
        source: "LomaVerse",
      },
    },
    {
      type: "figure",
      heading: "Bound binary in 3D",
      figure: {
        src: "/assets/projects/lomaverse/Binary3D.jpg",
        width: 1426,
        height: 1364,
        fit: "cover",
        alt: "Binary star system in 3D",
        caption: "The same binary in 3D, with the Hamiltonian core enforcing conservation.",
        source: "LomaVerse",
      },
    },
    {
      type: "prose",
      heading: "Chaos is not a solver failure",
      body: [
        "Three-body motion is chaotic in the technical sense: nearby initial conditions separate fast, and a small integration error changes the long-run path completely. That makes the chaos preset a different kind of test. I do not expect it to reproduce one specific trajectory forever. I expect it to reproduce the qualitative behavior and to stay consistent with the Hamiltonian formulation.",
        "Showing the same run in 2D and 3D makes the distinction concrete. The projections look different, but both views come from the same state and the same integrator. The question that matters is whether the two views agree about the dynamics, not which one looks better.",
      ],
    },
    {
      type: "figure",
      heading: "Chaotic three-body dynamics",
      figure: {
        src: "/assets/projects/lomaverse/Chaos3D.webp",
        width: 2454,
        height: 1496,
        fit: "cover",
        alt: "Chaotic three-body interaction rendered in LomaVerse",
        caption: "Three-body chaos in 3D, where nearby trajectories diverge.",
        source: "LomaVerse",
      },
    },
    {
      type: "figure",
      heading: "Chaos in 2D",
      figure: {
        src: "/assets/projects/lomaverse/Chaos2D.jpg",
        width: 2456,
        height: 1500,
        fit: "cover",
        alt: "Chaotic three-body interaction in 2D",
        caption: "The same chaotic run in the 2D orbit view.",
        source: "LomaVerse",
      },
    },
    {
      type: "prose",
      heading: "Configuration is part of the model",
      body: [
        "The configuration UI exposes masses, potentials, and integrators because those choices change the dynamics, and hiding them would turn the demo into a cartoon. You can build a system, watch it in either renderer, and reset it without touching code. The presets exist to keep the comparison honest: the same starting state can be run under different integrators, and the differences are right there on screen.",
        "The live velocity-Verlet demo adds pause, speed, and reset controls. Those are not decoration. They let you slow a trajectory down to a speed where you can actually inspect it, and compare what you are seeing against the rendered figures. The demo is the same simulation the figures came from, not a separate illustration.",
      ],
    },
    {
      type: "figure",
      heading: "Configuration surface",
      figure: {
        src: "/assets/projects/lomaverse/UI.jpg",
        width: 530,
        height: 1566,
        fit: "contain",
        aspect: "4:3",
        alt: "LomaVerse user interface",
        caption:
          "The configuration surface: masses, potentials, and integrators.",
        source: "LomaVerse",
      },
    },
    {
      type: "system",
      heading: "Anatomy",
      components: [
        { name: "Potential", receives: "mass and configuration JSON", emits: "Hamiltonian energy function" },
        { name: "Autodiff", receives: "Hamiltonian", emits: "equations of motion as gradients" },
        { name: "Integrator", receives: "gradients plus timestep", emits: "stepped positions and velocities" },
        { name: "Renderers", receives: "trajectories", emits: "2D orbit and 3D scene views" },
      ],
    },
    {
      type: "prose",
      heading: "What this is not",
      body: [
        "LomaVerse is a research prototype, not a general-purpose physics engine. The validated configurations are exactly the ones in the suite, and the integrators are exposed for comparison rather than tuned for production workloads. The renderer is a way to inspect state, not a substitute for numerical analysis.",
        "The honest claim is narrower than the screenshots suggest: a differentiable Hamiltonian core can drive a set of known N-body configurations, and both renderers stay consistent with the same state. That is enough to make the abstraction worth building on, and not enough to promise that every potential behaves. The next thing I would add is stiffer tests, configurations with invariants the current suite does not exercise.",
      ],
    },
  ],

  honeyllm: [
    {
      type: "prose",
      heading: "When the model takes the interview",
      body: [
        "LLMs can now handle the kinds of problems technical interviews are built on, which leaves the interviewer with an uncomfortable question: when a good answer comes back, who produced it? Tab tracking and screen sharing see nothing when the candidate pastes the problem into another window or photographs it with a phone. The assessment itself has to carry the evidence.",
        "HoneyLLM turns the problem statement into a tripwire. Every problem is rendered with canary content, and every session gets a unique token. A model that copies the text, visits a link, or follows an instruction inside it leaves a signal the interviewer can inspect, even though nothing happened inside the proctored window.",
      ],
    },
    {
      type: "visual",
      heading: "Defense modalities",
      visual: "honeyllm-flow",
      caption:
        "Canary content fans out into three detection channels that converge on one deterrence signal.",
    },
    {
      type: "prose",
      heading: "How a canary works",
      body: [
        "The mechanics are simple. Each problem renders with canaries injected, and each session mints a unique token, so a ping on a canary endpoint identifies both the interview and the session. Copying the text appends directives the candidate never sees in the IDE. A screenshot feeds those same visible injections to whatever OCR pipeline is running on top of it.",
        "Server-side, the User-Agent string separates model-originated HTTP clients from human browsers, and an IP comparison separates datacenter inference traffic from a residential candidate. The verdict is assembled from several weak signals rather than one detector that has to be right: a visited link, a copied directive, a sanitized tag, a watermarked variable name, or an OCR pipeline that swallowed an instruction it should have ignored.",
      ],
    },
    {
      type: "figure",
      heading: "System design",
      figure: {
        src: "/assets/projects/interview-site/SysDesign.jpg",
        width: 1024,
        height: 559,
        fit: "contain",
        blend: "multiply",
        cropMarks: true,
        alt: "HoneyLLM system design with injection and telemetry paths",
        caption:
          "End-to-end design: canary injection, per-session tokens, and server-side verdicting.",
        source: "HoneyLLM",
      },
    },
    {
      type: "prose",
      heading: "What we tested, and what came back",
      body: [
        "We ran five techniques against six models, with repeated simulated interviews for each combination, and the useful output is not one success rate but the shape of the matrix. Visible hyperlinks and visible URL pings work well, because models tend to preserve links and to follow instructions they can read. Hidden ASCII barely works at all: several models sanitize it before acting on anything.",
        "Watermarking and OCR distraction land in between. A watermark has to survive into generated code as a style constraint, which is asking a lot. An OCR pipeline has to ingest a visible instruction from a screenshot, which Cluely, at least, reliably does. Both are noisier than a URL visit, and both need a human to look at the flagged output before anything happens.",
      ],
    },
    {
      type: "figure",
      heading: "Attack success matrix",
      figure: {
        src: "/assets/projects/interview-site/Results.jpg",
        width: 1050,
        height: 610,
        fit: "contain",
        blend: "multiply",
        cropMarks: true,
        alt: "HoneyLLM attack success matrix across providers and techniques",
        caption:
          "Attack success by technique and model across the full trial set. Visible hyperlinks and URL pings lead; hidden ASCII mostly gets sanitized away.",
        source: "HoneyLLM",
      },
    },
    {
      type: "prose",
      heading: "Every model breaks differently",
      body: [
        "The per-model differences taught us more than the averages did. Gemini was most exposed to the visible hyperlink. Claude shrugged off every hidden technique and still visited the visible URL. Qwen echoed the canary link back instead of writing any code. The practical lesson: a detection technique is a property of a model family, not a switch that works the same way everywhere.",
        "The ensemble result follows directly from that. Combining techniques raised success on every model we tested, because the channels fail independently. A model that strips zero-width tags may still follow a visible link; a model that ignores the link may still reproduce a watermark. Canaries work best when they are not all the same kind of canary.",
      ],
    },
    {
      type: "figure",
      heading: "Watermarked code",
      figure: {
        src: "/assets/projects/interview-site/Gemini.png",
        width: 914,
        height: 848,
        fit: "cover",
        alt: "Gemini generating watermarked code with constrained variable names",
        caption:
          "Gemini writing watermarked code: plain-English variables ending in e, plus a forced pass block.",
        source: "HoneyLLM",
      },
    },
    {
      type: "figure",
      heading: "Canary hyperlink",
      figure: {
        src: "/assets/projects/interview-site/Qwen.jpg",
        width: 1668,
        height: 974,
        fit: "cover",
        alt: "Qwen emitting a canary Solution hyperlink instead of code",
        caption:
          "Qwen echoing the canary Solution hyperlink instead of writing code.",
        source: "HoneyLLM",
      },
    },
    {
      type: "prose",
      heading: "The platform is the experiment",
      body: [
        "I built the interview platform end to end on Vercel and Supabase, and the detection machinery is part of the live product rather than a separate test harness: per-session canary tokens, User-Agent attribution, IP comparison, and URL-visitation telemetry all run in production. That matters, because the experiment depends on the same rendering and session boundaries the candidate actually sees.",
        "The design stays small: a problem renderer, a canary service, a telemetry endpoint, and a verdict view. The smaller the surface, the easier it is to explain to an interviewer why a signal fired. A detection system that cannot explain its verdict is not useful, even when the signal is real.",
      ],
    },
    {
      type: "figure",
      heading: "Claude visit",
      figure: {
        src: "/assets/projects/interview-site/Claude.webp",
        width: 1672,
        height: 978,
        fit: "cover",
        alt: "Claude complying with a canary URL visit and the resulting platform alert",
        caption:
          "Claude visiting the canary URL. The ping surfaces as an interviewer alert.",
        source: "HoneyLLM",
      },
    },
    {
      type: "prose",
      heading: "What a ping proves",
      body: [
        "The visitation record is a timeline, not a single alert. The per-session token ties a ping back to a specific interview, and the User-Agent and IP context separate a model-originated request from a human browser. A reviewer can see when the visit happened and which channel caught it.",
        "The timeline is also the honest limit. A ping proves an endpoint was reached; it does not prove intent. The context around the visit is what makes the signal usable, so the platform records that context instead of collapsing the event into a pass or a fail.",
      ],
    },
    {
      type: "figure",
      heading: "Canary telemetry",
      figure: {
        src: "/assets/projects/interview-site/HoneyBucket.webp",
        width: 718,
        height: 672,
        fit: "cover",
        alt: "HoneyBucket canary URL telemetry",
        caption: "Canary URL visitation telemetry, recorded per session.",
        source: "HoneyLLM",
      },
    },
    {
      type: "figure",
      heading: "OCR distraction",
      figure: {
        src: "/assets/projects/interview-site/Cluely.jpg",
        width: 1674,
        height: 978,
        fit: "cover",
        alt: "Cluely distracted into generating irrelevant output by a visible injection",
        caption:
          "Cluely ingesting a visible injection through OCR and generating a cake recipe instead of an answer.",
        source: "HoneyLLM",
      },
    },
    {
      type: "system",
      heading: "Modalities",
      components: [
        { name: "Hidden ASCII", receives: "zero-width tag characters in problem text", emits: "3.1% average success; stripped by GPT and Claude" },
        { name: "Visible copy-paste", receives: "clipboard-appended directives", emits: "60.9% URL ping success, strongest reliable signal" },
        { name: "Visible hyperlink", receives: "reference-solution link in the statement", emits: "77.6% success; models echo links from training priors" },
        { name: "Watermark", receives: "hidden style constraints on generated code", emits: "33.3% success; needs manual review of flagged code" },
        { name: "OCR distraction", receives: "visible injections on screen", emits: "degraded outputs from screenshot pipelines like Cluely" },
      ],
    },
    {
      type: "evidence",
      heading: "Trials",
      items: [
        { result: "160", basis: "simulated interview trials, 32 per technique across six models" },
        { result: "96.9%", basis: "visible-hyperlink success on Gemini 3 Pro, the single best model-technique cell" },
        { result: "87.5%", basis: "visible-URL success on Claude Sonnet 4.5, which resists every hidden technique outright" },
        { result: "ensemble", basis: "combining techniques lifts success on every model tested, especially Qwen3-Max" },
      ],
    },
    {
      type: "prose",
      heading: "What this should and should not be used for",
      body: [
        "Everything here is probabilistic. A missed signal does not prove the candidate worked honestly, and a fired signal does not prove they cheated. Model versions are moving targets, and a provider update can silently change which canary survives. The output is evidence for a human reviewer, never an automatic verdict.",
        "False positives are the other half of the problem. A security scanner can visit a visible link, a copy event can be accidental, and an OCR pipeline can be a legitimate accessibility tool. That is why the deployment story is a review workflow rather than a ban button, and why the platform keeps the context around every signal it raises.",
      ],
    },
  ],

  "country-in-the-middle": [
    {
      type: "prose",
      heading: "The question we started with",
      body: [
        "When someone visits their government's tax portal, the traffic does not necessarily stay inside the country. It can cross a border, ride another country's backbone for a while, and come back. We set out to measure how often that happens and through whom, by mapping the physical network path between residents and their own government websites across 11 countries.",
        "The reason to care is that a country in the middle can observe traffic, shape it, or become a point of failure, whether or not it chooses to. Nobody had a map of this exposure at government scale. The study is a first map, not a complete inventory of every route.",
      ],
    },
    {
      type: "visual",
      heading: "On the path",
      visual: "citm-topology",
      caption:
        "A request to a government website can pass through a third country's infrastructure: the country in the middle.",
    },
    {
      type: "figure",
      heading: "Path analysis",
      figure: {
        src: "/assets/projects/traceroutes/methodology.png",
        width: 1532,
        height: 484,
        fit: "contain",
        blend: "multiply",
        alt: "Country-in-the-Middle methodology diagram",
        caption:
          "How hops get attributed to countries, and how in-between exposure gets flagged.",
        source: "Country-in-the-Middle",
      },
    },
    {
      type: "system",
      heading: "How the measurement works",
      components: [
        { name: "Targets", receives: "UN and official government site lists", emits: "about 100 validated domains per country" },
        { name: "Probes", receives: "RIPE Atlas placement across ASes", emits: "Paris traceroutes with on-probe DNS" },
        { name: "Attribution", receives: "IPinfo plus RTT checks plus Hoiho hostnames", emits: "per-hop countries with manual review of middle hops" },
        { name: "Sanitization", receives: "raw paths", emits: "anycast, private, and squatting hops stripped" },
      ],
    },
    {
      type: "prose",
      heading: "Who ends up in the middle",
      body: [
        "The headline output is a heatmap of how often each country appears inside somebody else's paths. The Philippines tops the exposure list, Kenya follows, and Belarus and the United States sit near zero. The spread itself is the finding: geography alone does not predict which country becomes a middle hop.",
        "One caveat applies to everything below. Of roughly 10,272 traceroutes collected in February 2024, 9,278 came back clean enough to use, and every count in the study is a lower bound. An unresponsive hop can hide a middle country, and a path that looks direct at the IP layer can still cross infrastructure we cannot attribute. The heatmap shows the exposure we could see, not all the exposure there is.",
      ],
    },
    {
      type: "figure",
      heading: "In-between frequency",
      figure: {
        src: "/assets/projects/traceroutes/heatmap_violators.webp",
        width: 2009,
        height: 1221,
        fit: "contain",
        blend: "multiply",
        cropMarks: true,
        alt: "Heatmap of in-between countries",
        caption:
          "How often each country appears in the middle of someone else's measured paths.",
        source: "Country-in-the-Middle",
      },
    },
    {
      type: "prose",
      heading: "Convergent and divergent paths",
      body: [
        "The analysis leans on two path shapes. A convergent path ends inside the resident's own country. A divergent path leaves it and may transit a third country before reaching the government target. The distinction matters because the divergent case is where a foreign network gets to see both the request and the response.",
        "The same definitions drive the sanitization rules. Anycast addresses, private hops, and squatting ranges are stripped before any country gets assigned, because none of them identify a stable middle network. The rule is conservative: it is better to undercount than to accuse a country of sitting on a path it was never on.",
      ],
    },
    {
      type: "figure",
      heading: "Definitions",
      figure: {
        src: "/assets/projects/traceroutes/definitions.png",
        width: 1650,
        height: 1275,
        fit: "contain",
        blend: "multiply",
        alt: "Definitions of country-in-the-middle",
        caption: "The definitions used to classify a country as in-the-middle.",
        source: "Country-in-the-Middle",
      },
    },
    {
      type: "prose",
      heading: "What went into the measurement",
      body: [
        "Target selection sounds dull until you get it wrong. We started from UN and official government lists and validated each country down to about 100 domains, covering services people actually use: tax portals, court systems, identity services, ministries. Probes came from RIPE Atlas, placed across ASes rather than parked at a single vantage point, running Paris traceroutes with on-probe DNS, which is far less sensitive to per-flow load balancing than a naive traceroute.",
        "Attribution combined three sources, IPinfo for base geolocation, RTT sanity checks, and Hoiho hostnames, followed by a manual review of all 2,088 middle hops. That manual pass is the expensive part, and it is why the study covers 11 countries instead of many more. We chose depth over breadth: a smaller map where every middle hop has been reviewed is worth more than a large one with unverified labels.",
      ],
    },
    {
      type: "figure",
      heading: "Target types",
      figure: {
        src: "/assets/projects/traceroutes/types_of_targets.png",
        width: 728,
        height: 909,
        fit: "contain",
        blend: "multiply",
        alt: "Types of government targets measured",
        caption:
          "The government websites measured in each country, by type.",
        source: "Country-in-the-Middle",
      },
    },
    {
      type: "prose",
      heading: "What the measurement cannot see",
      body: [
        "The CDF of unlabeled hops sits in the paper as an honesty mechanism, and it belongs in any read of the results. It shows how much of each path could not be attributed, and it is the reason every finding is phrased as a lower bound. A country can be absent from the heatmap because it is genuinely not on the path, or because the probes could not see it. Those are different facts, and the paper keeps them separate.",
        "The remaining limits are the usual measurement limits, worth stating anyway: IP geolocation is approximate, anycast makes one address appear in several places at once, and a forward traceroute cannot see an asymmetric return path. The study reports what the probes saw, with the uncertainty attached, rather than smoothing it into a single ranking.",
      ],
    },
    {
      type: "figure",
      heading: "Unlabeled hops",
      figure: {
        src: "/assets/projects/traceroutes/cdf_unlabeled_hops.png",
        width: 1159,
        height: 648,
        fit: "contain",
        blend: "multiply",
        alt: "CDF of hops that could not be attributed",
        caption:
          "How much of each path could not be attributed. Every count in the study is a floor, not a ceiling.",
        source: "Country-in-the-Middle",
      },
    },
    {
      type: "prose",
      heading: "Where the paths go",
      body: [
        "The per-country cases are where the argument gets concrete. Taiwan reaches its own sites through Hong Kong carriers. Kenya reaches government services through UK and South African exchanges. The UAE routes through Singapore on SEA-ME-WE 5. Traffic from Vancouver to eastern Canada dips through United States carriers. None of these are hypotheticals; they are the measured routes for real government targets.",
        "The cases also show who the middle countries actually are: usually a regional exchange or a submarine-cable landing point, not a deliberate adversary. The measurement cannot assign intent. What it can do is show exactly where the physical path creates exposure, and leave the interpretation to people whose job that is.",
      ],
    },
    {
      type: "figure",
      heading: "Path graph",
      figure: {
        src: "/assets/projects/traceroutes/banjo_graph_with_outline.png",
        width: 1185,
        height: 884,
        fit: "contain",
        blend: "multiply",
        alt: "Network graph of paths through countries",
        caption:
          "Measured paths as a graph. Countries that repeatedly sit in the middle stand out.",
        source: "Country-in-the-Middle",
      },
    },
    {
      type: "prose",
      heading: "What the numbers say",
      body: [
        "The Philippines tops exposure at 43%, Kenya sits at 38%, and Belarus and the United States sit near zero. Treat the ranking as a starting point for policy questions, not a trust score. A low count can mean a genuinely domestic path, or it can mean the measurement could not see the middle, and those two cases sit next to each other in the same table.",
        "The contribution is the method as much as the map: a repeatable way to ask which countries sit between a population and its government, with the uncertainty out in the open. The next version should widen the country set, automate more of the hop review, and measure path asymmetry instead of the forward route alone.",
      ],
    },
    {
      type: "prose",
      heading: "Why this matters",
      body: [
        "A country in the middle is a point of observation and a point of failure, and both roles matter even when nobody acts on them. The study does not claim every middle country is hostile or that exposure is intentional. It gives researchers and policymakers a concrete, path-level fact to investigate instead of a geopolitical assumption.",
        "There is also a methodological point worth keeping: lower bounds are worth publishing. A map that says what it cannot see is more useful than one that hides its blind spots, especially when the subject is traffic between people and their governments.",
      ],
    },
  ],

  "gpu-megakernels": [
    {
      type: "prose",
      heading: "Why megakernels, and what breaks",
      body: [
        "Megakernels keep an entire LLM forward pass resident on one GPU, which eliminates kernel-launch overhead but puts serious pressure on shared memory. ThunderKittens manages that pressure with producer-consumer warps and carefully audited tiling, and it works. The trouble is scheduling. Its Interpreter template caps inter-op pipeline depth at two, and its VM template leans on a static Python schedule: efficient when the workload matches it, brittle when it does not.",
        "Our proposal was to replace the static schedule with runtime management: decoupled memory and compute flows talking over signal queues, an on-GPU allocator for shared-memory pages, and dependencies resolved at execution time. Before arguing for a mechanism, though, we wanted to measure the size of the prize. My share of the work was the profiling and instrumentation.",
      ],
    },
    {
      type: "prose",
      heading: "What a runtime would change",
      body: [
        "A static schedule decides where every buffer lives before execution begins. A runtime allocator can instead hand pages to whichever SM needs them, and a signal queue can tell a consumer that its input is ready. The two flows stop sharing a single barrier, so a slow tile no longer stalls an unrelated operation.",
        "The cost is coordination. Runtime management adds bookkeeping and new failure modes: a page can arrive late, a queue can back up, and a dependency can surface only at execution time. A runtime that saves less than it costs is not an improvement, so the measurement comes first and the proposal second.",
      ],
    },
    {
      type: "implementation",
      heading: "Method",
      decisions: [
        { choice: "Timestamp injection", why: "Record the instant a consumer wait returns, splitting wall time into delay, stalls, and true work" },
        { choice: "Ten-opcode decomposition", why: "Map the Llama block onto VM instructions so each kernel is measurable alone" },
        { choice: "Theory comparison", why: "Divide measured stalls by HBM3 transfer minima to prove coordination, not bandwidth, dominates" },
        { choice: "Decoupled proposal", why: "Memory and compute flows over signal queues, with an on-GPU page allocator" },
      ],
    },
    {
      type: "prose",
      heading: "How the stalls were measured",
      body: [
        "The evidence comes from instrumenting the C++ device runtime on a GCP A3 H100. A timestamp fires the moment a consumer warp's wait returns, which splits each kernel into total time, delay before real compute, stalls during compute, and true work. That split is the difference between knowing a kernel is slow and knowing which part of the kernel is doing the waiting.",
        "We decomposed the Llama block into ten opcodes so each kernel could be measured alone and then placed back on the critical path. The decomposition is not a performance model. It is an accounting scheme: every microsecond gets assigned to a named phase, and the phases sum back to the whole.",
      ],
    },
    {
      type: "evidence",
      heading: "Stalls",
      items: [
        { result: "28.8%", basis: "of layer latency recoverable: 22.22 of 77 microseconds across the six-op critical path" },
        { result: "7.46us", basis: "output-projection round trip, about 1,400 times the HBM3 transfer minimum" },
        { result: "6.50us", basis: "attention-reduction barrier wait for the slowest partial tile" },
        { result: "355.5us", basis: "per-token saving extrapolated over 16 Llama-1B layers" },
      ],
    },
    {
      type: "figure",
      heading: "Memory movement",
      figure: {
        src: "/assets/projects/gpu-kernels/Delay.jpg",
        width: 1374,
        height: 750,
        fit: "contain",
        blend: "multiply",
        cropMarks: true,
        alt: "Memory delay analysis across megakernel operations",
        caption:
          "Shared-memory pressure and delay across operations in a batched Llama megakernel.",
        source: "GPU Megakernels",
      },
    },
    {
      type: "prose",
      heading: "Where the time goes",
      body: [
        "Two stalls dominate the story. The attention reduction waits on a coarse all-arrived barrier for the slowest partial tile. The output projection stalls on an HBM round trip that theory says should take nanoseconds. Different mechanisms, same signature: the hardware is waiting on coordination, not arithmetic.",
        "Across the six-op critical path, more than a quarter of the measured latency is recoverable. The output projection is the clearest case: its data movement runs about 1,400 times slower than the HBM3 transfer minimum, which no amount of bandwidth explains. The bottleneck is when the transfer happens, not how fast the link is.",
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
      type: "prose",
      heading: "The bandwidth is not the problem",
      body: [
        "HBM3 could service these transfers hundreds of times faster than what we observed. That gap is the argument for persistence and finer-grained synchronization: keep the data closer, hand it over when the consumer is ready, and stop paying a global-memory round trip for a buffer that never needed to leave the GPU.",
        "It is worth separating what we measured from what we are proposing. The runtime allocator and the signal queues are a design, not a shipped kernel. The measurements say coordination dominates. They do not prove that this particular runtime recovers the lost time; only building it can answer that.",
      ],
    },
    {
      type: "figure",
      heading: "Llama memory map",
      figure: {
        src: "/assets/projects/gpu-kernels/Llama.webp",
        width: 1344,
        height: 624,
        fit: "contain",
        blend: "multiply",
        alt: "Llama kernel memory analysis",
        caption:
          "Memory-movement opportunities inside a batched Llama-8B megakernel.",
        source: "GPU Megakernels",
      },
    },
    {
      type: "prose",
      heading: "Reading the memory map",
      body: [
        "The Llama memory map is a schedule more than a heat map. It shows where buffers live and where they have to move, which is exactly the layer the runtime proposal changes. A buffer that never needs to leave its SM should not be bounced back to global memory just because a static schedule drew the arrow that way.",
        "The map also explains why the stalls are not uniform. Some operations are dominated by a barrier, others by a round trip, others by the producer-consumer handoff. A single runtime policy would have to handle all three.",
      ],
    },
    {
      type: "figure",
      heading: "Matrix multiplication",
      figure: {
        src: "/assets/projects/gpu-kernels/MatrixMult.jpg",
        width: 1346,
        height: 340,
        fit: "contain",
        blend: "multiply",
        alt: "Matrix multiplication within a megakernel",
        caption:
          "Shared-memory allocation for matrix operations under the runtime manager.",
        source: "GPU Megakernels",
      },
    },
    {
      type: "figure",
      heading: "Pipeline stages",
      figure: {
        src: "/assets/projects/gpu-kernels/ProcessorPipeline.jpg",
        width: 2710,
        height: 506,
        fit: "contain",
        blend: "multiply",
        alt: "Processor pipeline inside the megakernel",
        caption: "Pipeline stages, and the memory handoffs between them.",
        source: "GPU Megakernels",
      },
    },
    {
      type: "prose",
      heading: "What the evidence does and does not support",
      body: [
        "The numbers come from one GPU model, one Llama-size workload, and one instrumentation path. The per-token saving across 16 layers is an extrapolation, not a deployment measurement. The runtime allocator remains a proposal; the numbers are the case for building it.",
        "Even so, the result is useful, because it turns a vague complaint about megakernel overhead into named stalls with measured costs. The next step is a working runtime benchmarked against the static schedule on the same kernels. Anything beyond that is extrapolation, and we tried not to lean on it.",
      ],
    },
  ],

  "cs1-llm": [
    {
      type: "prose",
      heading: "The bet we made in week one",
      body: [
        "The course made one bet up front: teach Copilot from the first week instead of banning it. Four principles followed from that. Prepare students for a workforce where these tools are the norm. Keep the equity practices that serve underrepresented students. Favor open-ended work where creativity still matters, and serve majors and non-majors alike. The tool was treated as part of the curriculum, not as a shortcut to be caught.",
        "In practice the term split into two halves. The first four weeks covered reading, tracing, and explaining code, with Copilot-assisted debugging as a normal activity. The next six ran the software-engineering loop, decomposition, testing, and debugging, across three domains. The workflow we taught was deliberately boring: prompt, read the response, test it, and only then decide whether to trust it.",
      ],
    },
    {
      type: "prose",
      heading: "What changed in the classroom",
      body: [
        "The center of gravity moved from writing syntax to reading and testing it. Students still write code, but they spend more time explaining what a generated block does, constructing tests that would catch a wrong answer, and breaking a problem down before asking for a solution. The open-ended projects in data science, image processing, and game design give those skills somewhere to land.",
        "Assessment moved with the teaching. Some quizzes allow Copilot and some forbid it, so fluency in both modes gets measured. PrairieLearn carries the frequent formative reps on tracing, explaining, and testing before anything summative counts. The mixed format is the point: a student who can only work with the tool is as unprepared as one who cannot work without it.",
      ],
    },
    {
      type: "prose",
      heading: "What students reported",
      body: [
        "The survey came back positive but not tidy. Most students were comfortable programming with GenAI tools by the end of the term, and a smaller majority said Copilot helped their learning of the fundamentals. The number that stayed with me is the 31% who were unsure which problems they should be solving without Copilot at all. That uncertainty is the real cost of the redesign, and it deserves to be reported as prominently as the comfort figures.",
        "The exam evidence tempers both readings. Tracing and reading scores held level with past cohorts, while from-scratch writing dipped slightly. The course accepted that trade because the skill mix it cares about changed. The survey cannot prove the redesign caused the parity, but it does show the course did not collapse when the tool arrived.",
      ],
    },
    {
      type: "figure",
      heading: "Student comfort",
      figure: {
        src: "/assets/research/ITiCSE/copilot_comfort.png",
        width: 943,
        height: 167,
        fit: "contain",
        blend: "multiply",
        cropMarks: true,
        alt: "Student comfort with Copilot in the CS1-LLM course",
        caption:
          "How helpful students found the tools, and how comfortable they were using them.",
        source: "CS1-LLM Experience Report",
      },
    },
    {
      type: "prose",
      heading: "What the comfort number does not mean",
      body: [
        "Comfort is a distribution, not a verdict. A student can be comfortable with a tool and still uncertain whether the tool's answer is right, and the survey asks those questions separately, which is why the comfort figure is never presented as a learning outcome.",
        "Self-report is also a blunt instrument. Students who use Copilot daily may rate it highly because it removes friction, not because it teaches them more. That is why the survey sits next to exam evidence instead of standing alone.",
      ],
    },
    {
      type: "figure",
      heading: "The workflow",
      figure: {
        src: "/assets/research/ITiCSE/LLM_workflow_image.webp",
        width: 1144,
        height: 458,
        fit: "contain",
        blend: "multiply",
        alt: "LLM workflow used in the CS1-LLM course",
        caption:
          "The workflow students were taught: prompt, read, test, then trust.",
        source: "CS1-LLM Experience Report",
      },
    },
    {
      type: "figure",
      heading: "Helped versus hindered",
      figure: {
        src: "/assets/research/ITiCSE/copilot_helped_hindered.png",
        width: 858,
        height: 120,
        fit: "contain",
        blend: "multiply",
        alt: "How Copilot helped or hindered students",
        caption:
          "Where students said Copilot helped, and where it got in the way.",
        source: "CS1-LLM Experience Report",
      },
    },
    {
      type: "prose",
      heading: "Reading the help split",
      body: [
        "The helped-versus-hindered chart is the most honest picture in the set, because it holds both directions at once. Students report that Copilot gets them unstuck. They also report that it can short-circuit the struggle that produces understanding. Same tool, both sides of the ledger.",
        "That tension is the design problem in one image. The course does not try to remove the tool, and it does not pretend the tradeoff is free. It tries to make the tradeoff visible in the workflow and in the assessment.",
      ],
    },
    {
      type: "figure",
      heading: "Assessment divergence",
      figure: {
        src: "/assets/research/ITiCSE/divergent_column_percent_small.webp",
        width: 849,
        height: 415,
        fit: "contain",
        blend: "multiply",
        alt: "Divergent responses across assessment columns",
        caption:
          "How responses diverge across assessment formats.",
        source: "CS1-LLM Experience Report",
      },
    },
    {
      type: "implementation",
      heading: "Mechanics",
      decisions: [
        { choice: "Copilot from week one", why: "Students learn the tool alongside Python instead of unlearning solo habits later" },
        { choice: "Mixed assessments", why: "Some quizzes allow Copilot, some forbid it, so fluency both ways gets measured" },
        { choice: "Three open projects", why: "Data science, images, and games let students pick personally relevant work" },
        { choice: "PrairieLearn homework", why: "Frequent formative reps on tracing, explaining, and testing before summatives" },
      ],
    },
    {
      type: "evidence",
      heading: "Outcomes",
      items: [
        { result: "79%", basis: "comfortable programming with GenAI tools at term end" },
        { result: "59%", basis: "said Copilot helped their learning of fundamentals" },
        { result: "parity", basis: "tracing and reading exam scores level with historical cohorts" },
        { result: "31%", basis: "unsure which problems they should solve without Copilot, the honest cost" },
      ],
    },
    {
      type: "prose",
      heading: "Limits and adoption lessons",
      body: [
        "One course, one institution, one set of tools. The survey is self-report, and the comparison against historical cohorts is not a randomized trial. A different population, a different model, or a different assessment mix could land somewhere else entirely.",
        "The adoption lessons travel better than the results. Expect non-determinism and design around it: tool behavior changes between terms, students arrive with different prior exposure, and an assignment that worked once may need a new prompt or a new test the next time. This is a practice report, not a plug-in curriculum.",
      ],
    },
  ],

  "problem-decomposition": [
    {
      type: "prose",
      heading: "What makes decomposition hard to test",
      body: [
        "Problem decomposition, breaking a large task into well-defined pieces, is arguably the skill that matters most now that students can generate code on demand. It is also the skill with the least consensus on how to assess it. The structural problem is context: a decomposition question has to carry a lot of it. A short prompt can test whether a student knows the syntax for a dictionary. It cannot test whether they can hold a system in their head and cut it into the right pieces.",
        "The long-context requirement makes life hard on both sides of the desk. It strains students during the task, and it strains graders afterward, because a question that needs a page of setup is expensive to write, slow to answer, and difficult to score consistently.",
      ],
    },
    {
      type: "prose",
      heading: "The Question Suite",
      body: [
        "A Question Suite scaffolds the context instead of demanding it all at once. A sequence of smaller questions builds shared understanding first: the domain, the constraints, the shape of the system. Only then does the student attempt the decomposition itself, breaking the problem into pieces, naming the interfaces between them, and explaining the order of work.",
        "The format was designed for reuse. An instructor can adopt the suite structure without adopting any specific prompt, and the graded decomposition happens after the context is genuinely shared. That makes the resulting grade easier to defend: the student is not penalized for missing a hidden premise, and the grader is not reverse-engineering the premise out of a free-form answer.",
      ],
    },
    {
      type: "implementation",
      heading: "Suite structure",
      decisions: [
        { choice: "Scaffold first", why: "Smaller questions build the context decomposition needs before it is attempted" },
        { choice: "Decompose second", why: "The graded attempt happens once shared understanding exists" },
        { choice: "Practitioner framing", why: "Instructors adopt the format; the paper optimizes for reuse" },
      ],
    },
    {
      type: "prose",
      heading: "What the paper claims, and what it does not",
      body: [
        "As first author I owned the format and the evidence: the suite structure, the assessment design writeup, and the analysis of how students responded to it. The paper is aimed at instructors who need decomposition grades they can defend in a course where GenAI is allowed.",
        "I want to be precise about the scale of that evidence. It shows that a scaffolded suite is workable in a real course and that students can respond to it. It does not establish that the format measures decomposition better than every alternative; that would need comparisons this paper does not run. The contribution is a reusable assessment pattern and an honest account of the long-context constraint, not a validated instrument.",
      ],
    },
  ],

  "pap-inventory": [
    {
      type: "prose",
      heading: "How requests worked before",
      body: [
        "Patriots and Paws delivers home furnishings to veterans, and when we started, the entire request workflow ran on phone calls and spreadsheets. A volunteer would take a request, check what was available by asking around, and write the answer down somewhere the next volunteer might never see. There was no shared view of inventory and no real boundary between the people managing items and the people fulfilling requests.",
        "What the nonprofit needed was a system shaped like its existing workflow. Administrators manage inventory. Volunteers process requests, often from a phone, often standing in a living room mid-delivery. A generic database would have missed the point: the roles, and the handoff between them, had to be part of the interface.",
      ],
    },
    {
      type: "prose",
      heading: "What we built",
      body: [
        "The application is a responsive Next.js frontend over MongoDB, with Firebase authentication separating administrators from volunteers. Inventory items and fulfillment requests live in one queryable store, so a request can point at a real item instead of at a row in somebody's spreadsheet. The role boundary shows up in the UI as well as the auth layer: each role sees the tools it needs and nothing else.",
        "The stack choices are ordinary, and that is a feature. Firebase RBAC keeps both roles in one auth system. MongoDB keeps inventory and requests together. Responsive-first layout accepts that volunteers work on site, not at a desk. We were fitting a small system to a real workflow, not importing a platform the client would have to babysit.",
      ],
    },
    {
      type: "figure",
      heading: "Administrator dashboard",
      figure: {
        src: "/assets/projects/pap-inventory/pap-inventory-1.webp",
        width: 1172,
        height: 1126,
        fit: "cover",
        alt: "PAP Inventory Processing dashboard",
        caption:
          "The administrator dashboard for the furniture inventory.",
        source: "PAP Inventory Processing",
      },
    },
    {
      type: "figure",
      heading: "Item management",
      figure: {
        src: "/assets/projects/pap-inventory/pap-inventory-2.jpg",
        width: 1644,
        height: 1406,
        fit: "cover",
        alt: "Inventory item management screen",
        caption: "Managing individual furniture items and their status.",
        source: "PAP Inventory Processing",
      },
    },
    {
      type: "prose",
      heading: "What changed",
      body: [
        "The shared data model killed the repeated question. An item has a state, a request points at an item, and both roles see the same state at the same time. The volunteer view is deliberately smaller and more mobile, because the volunteer is usually in the middle of a delivery, not sitting at a desk.",
        "We did not try to automate the nonprofit's judgment calls. The system makes state visible and roles explicit, which is the part a spreadsheet could never do. The result is smaller than what a consultant might have proposed, and it has fewer places for a request to quietly disappear.",
      ],
    },
    {
      type: "figure",
      heading: "Request fulfillment",
      figure: {
        src: "/assets/projects/pap-inventory/pap-inventory-3.jpg",
        width: 1376,
        height: 1262,
        fit: "cover",
        alt: "Request processing workflow",
        caption: "Processing and fulfilling veteran furniture requests.",
        source: "PAP Inventory Processing",
      },
    },
    {
      type: "figure",
      heading: "Volunteer view",
      figure: {
        src: "/assets/projects/pap-inventory/pap-inventory-4.jpg",
        width: 1682,
        height: 1154,
        fit: "cover",
        alt: "Mobile-friendly inventory view",
        caption: "The responsive volunteer view, built for use mid-delivery.",
        source: "PAP Inventory Processing",
      },
    },
    {
      type: "implementation",
      heading: "Decisions",
      decisions: [
        { choice: "Firebase RBAC", why: "Administrators and volunteers see different tools from one auth system" },
        { choice: "MongoDB requests", why: "Inventory items and fulfillment requests share one queryable store" },
        { choice: "Responsive first", why: "Volunteers work on site from phones, not desks" },
      ],
    },
  ],

  "psyches-of-color": [
    {
      type: "prose",
      heading: "The directory problem",
      body: [
        "Black and Latinx youth looking for mental-health support run into the same wall in most directories: a list of providers with no indication of whether those providers understand their context. A generic directory can make the search harder right at the moment a person has the least bandwidth to carry it. Psyches of Color's premise is the opposite: cultural competence is a first-class filter, not a paragraph buried in a profile.",
        "We built the app with Triton Software Engineering for the nonprofit. The product question was never how to list every provider. It was how to help someone find a provider they might actually trust.",
      ],
    },
    {
      type: "prose",
      heading: "What the app does",
      body: [
        "It is a cross-platform React Native app backed by Firebase. The home screen opens the directory. Need-based browsing lets a visitor start from what they are dealing with, rather than forcing them to learn a provider taxonomy first. Therapist profiles lead with credentials and specialties. Support groups and community resources sit beside the clinical listings instead of in a separate section.",
        "Firebase keeps the directory in sync without asking a nonprofit to operate a server, and the data shape is the real product: every listing carries the tags that make need-based browsing work, and every profile carries the trust cues that make a listing worth acting on. Weak tags would turn the whole thing back into a longer list.",
      ],
    },
    {
      type: "figure",
      heading: "Home",
      figure: {
        src: "/assets/projects/psyches-of-color/psyches-of-color-1.webp",
        width: 1094,
        height: 818,
        fit: "cover",
        alt: "Psyches of Color app home screen",
        caption:
          "The home screen, connecting youth to culturally competent care.",
        source: "Psyches of Color App",
      },
    },
    {
      type: "figure",
      heading: "Browsing by need",
      figure: {
        src: "/assets/projects/psyches-of-color/psyches-of-color-2.jpg",
        width: 632,
        height: 1068,
        fit: "contain",
        aspect: "4:3",
        alt: "Resource directory screen",
        caption: "Browsing therapists and support groups by need.",
        source: "Psyches of Color App",
      },
    },
    {
      type: "prose",
      heading: "Trust cues",
      body: [
        "The profile view is where the directory earns its name. Credentials and specialties are visible before a visitor commits to calling anyone, and the need tags from browsing repeat inside the profile so the thread does not get lost. The app does not claim to verify cultural competence. It surfaces the information the nonprofit chose to publish and lets the visitor decide.",
        "That is a modest claim, and it is the right one. An app cannot fix the shortage of culturally competent providers. It can lower the cost of searching for one, and make the relevant facts easier to compare side by side.",
      ],
    },
    {
      type: "figure",
      heading: "Therapist profile",
      figure: {
        src: "/assets/projects/psyches-of-color/psyches-of-color-3.jpg",
        width: 840,
        height: 1184,
        fit: "contain",
        aspect: "4:3",
        alt: "Therapist profile view",
        caption: "A therapist profile with credentials and specialties up front.",
        source: "Psyches of Color App",
      },
    },
    {
      type: "figure",
      heading: "Community resources",
      figure: {
        src: "/assets/projects/psyches-of-color/psyches-of-color-4.jpg",
        width: 576,
        height: 1146,
        fit: "contain",
        aspect: "4:3",
        alt: "Support group listing",
        caption: "Support groups and community resources.",
        source: "Psyches of Color App",
      },
    },
    {
      type: "implementation",
      heading: "Decisions",
      decisions: [
        { choice: "React Native", why: "One codebase covers the iOS and Android youth audience" },
        { choice: "Firebase backend", why: "Directory data syncs without operating servers for a nonprofit" },
        { choice: "Need-based browsing", why: "Visitors filter by need instead of learning provider taxonomy" },
      ],
    },
  ],

  "parkinsons-predictor": [
    {
      type: "prose",
      heading: "Question",
      body: [
        "Can demographic and medical signals flag Parkinson's risk early enough to matter? That is the question our group took on, with the stated goal of identifying at-risk populations for earlier intervention. The framing matters: this is a modeling comparison, not a clinical tool, and we treated that boundary as part of the work rather than a disclaimer bolted on at the end.",
        "The dataset is small and tabular, and that shaped every choice downstream. A deep model would bring more capacity than the evidence could support, so we compared simpler families on the same engineered features and reported the result at course scale.",
      ],
    },
    {
      type: "prose",
      heading: "What was built",
      body: [
        "The work covers the unglamorous parts first: data cleaning choices, documented rather than improvised, and feature engineering over the demographic and medical signals. Then a head-to-head comparison, Logistic Regression against Decision Trees, with the same features going to both. That last part is the point. When both families see identical inputs, the difference in performance is about the model class, not about two different preprocessing pipelines.",
        "The best held-out accuracy is reported below as a course-project finding. The writeup is explicit about the sample size and the validation gaps, and it treats the modeling comparison as the contribution rather than the predictions themselves.",
      ],
    },
    {
      type: "evidence",
      heading: "Results",
      items: [
        { result: "77%", basis: "best accuracy across the two compared model families on held-out splits" },
        { result: "2-way", basis: "Logistic Regression against Decision Trees on identical engineered features" },
        { result: "course scope", basis: "small tabular sample; no clinical validity claimed" },
      ],
    },
    {
      type: "prose",
      heading: "What the result does not mean",
      body: [
        "That accuracy number does not mean the model can screen a patient. The dataset is small, the splits are not a clinical trial, and the features are not a diagnosis. The result says the features carry signal worth studying. It does not provide a threshold anyone should act on.",
        "The honest next step is a larger, better-controlled dataset and a prospective validation design. The project stops short of both, and the writeup says so explicitly. Where a course project stops is part of reporting it.",
      ],
    },
  ],

  "developer-journal": [
    {
      type: "prose",
      heading: "What we set out to build",
      body: [
        "Developer workflows scatter. Tasks live in one app, notes in another, files in a folder nobody can find, and nothing ties them together offline. Our group built the version of that hub we wanted for ourselves: a developer-oriented task list, journal, and file storage system, shipped as a local-first Progressive Web App on Electron and SQLite, with automated testing and deployment wired in from the start.",
        "Local-first was a scoping decision as much as an architectural one. The app owns its data and works offline; sync is explicitly out of scope. That kept the data model coherent and made the desktop shell the whole product boundary: one web codebase, shipped as a desktop app, with no backend for anyone to operate.",
      ],
    },
    {
      type: "prose",
      heading: "What leading a team of ten changed",
      body: [
        "I led a team of ten, which meant the architecture had to survive ten authors. The structural choices were local-first storage and a clean shell around Electron and SQLite. The social choice was merge discipline: small pull requests, Prettier-clean diffs, and Playwright suites that ran before any human laid eyes on a change.",
        "The CI pipeline ended up being as much a coordination tool as a quality gate. When every change proves itself with tests and uniform formatting, review conversations stay on behavior and architecture instead of formatting churn. With a group that size, that is the difference between reviewing code and refereeing it.",
      ],
    },
    {
      type: "implementation",
      heading: "Decisions",
      decisions: [
        { choice: "Local-first SQLite", why: "The app owns its data and works offline; sync stays out of scope" },
        { choice: "Electron shell", why: "One web codebase ships as a desktop app without a backend to operate" },
        { choice: "Playwright plus Prettier in CI", why: "Every change proves itself with tests and uniform formatting" },
      ],
    },
    {
      type: "prose",
      heading: "Limits",
      body: [
        "The app does not sync across devices, and that is a constraint we chose, not a feature we missed. A real product would need a sync design, conflict handling, and a migration story, all of which sat outside a course quarter.",
        "The other result worth keeping is the process. Ten authors can ship one codebase when the boundaries are explicit and the pipeline is boring. We documented that process as carefully as the app itself, and it is the part I would carry into the next team project of that size.",
      ],
    },
  ],

  "sentiment-classifier": [
    {
      type: "prose",
      heading: "Small dataset, political text",
      body: [
        "Off-the-shelf sentiment tools miss political language: the register, the irony, the vocabulary of a party platform. And the datasets small enough for a student team invite overfitting, because a model can memorize one partition of a small corpus and post an accuracy that collapses on an unseen split. We treated validation as the central problem of the project, not a step at the end.",
        "The task is document-level political sentiment classification. The interesting question was never whether a transformer can fit the training set. It was whether the result survives folds and a threshold choice.",
      ],
    },
    {
      type: "prose",
      heading: "The model and the folds",
      body: [
        "The model is a fine-tuned BERT. Pretrained representations give a small dataset a far better starting point than training from scratch, and fine-tuning adapts them to political text. Around that, the validation design does the real work: k-fold cross-validation, so the reported accuracy is always measured on data the model has not seen, and a threshold analysis that picks the operating point from the tradeoff instead of assuming one.",
        "That is where the headline accuracy figure comes from: a model plus a decision threshold, evaluated across folds. It is a course-project result, not a claim about political sentiment in the wild.",
      ],
    },
    {
      type: "implementation",
      heading: "Decisions",
      decisions: [
        { choice: "BERT fine-tuning", why: "Pretrained representations beat from-scratch models on small political text" },
        { choice: "k-fold validation", why: "Unseen splits prove the figure instead of memorizing one partition" },
        { choice: "Threshold analysis", why: "The operating point is chosen from the tradeoff, not assumed" },
      ],
    },
    {
      type: "prose",
      heading: "Limits",
      body: [
        "The corpus is small, the domain is narrow, and the labels are only as good as the annotation process behind them. A political sentiment classifier will also encode the perspective of its training data, and pretending otherwise would be the least defensible thing in the project. We report the validation design and the threshold analysis so a reader can see exactly how the number was produced.",
        "The honest use of this is as a baseline for further study, not a moderation tool. The value is the method: fine-tune, cross-validate, choose the operating point, and state the scope. That sequence transfers; the specific number does not.",
      ],
    },
  ],
};
