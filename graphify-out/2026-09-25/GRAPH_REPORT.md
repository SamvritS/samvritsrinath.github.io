# Graph Report - samvritsrinath.github.io  (2026-09-25)

## Corpus Check
- 127 files · ~306,598 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 1, .lock 1)

## Summary
- 648 nodes · 1036 edges · 88 communities (33 shown, 55 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1b3fe55`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- registry.tsx
- honeyllm-flow.tsx
- layout.tsx
- resume/page.tsx
- lomaverse-sim.tsx
- package.json
- TypeScript Configuration
- Frontend Dependencies
- specsplit-topology.tsx
- What You Must Do When Invoked
- @playwright/test
- Brutalism Design System Skill (Universal)
- LLM Benchmark Dashboard
- types.ts
- Graphify Plugin Configuration
- Brutalism Design System Skill (Universal)
- graphify reference: extra exports and benchmark
- next-env.d.ts
- graphify reference: query, path, explain
- OpenCode Plugin Schema
- Product Demo Documentation
- PostCSS Configuration
- OptFantasy Research Paper
- SpecSplit Research Paper
- Profile Assets
- Matrix Multiplication Diagram
- Processor Execution Trace
- System Design Diagram
- IP-Sage Pipeline Diagram
- Binary Star 2D Visualization
- Binary Star 3D Visualization
- Chaotic 3-Body 2D Visualization
- Chaotic 3-Body 3D Visualization
- Solar System 2D Visualization
- Solar System 3D Visualization
- LomaVerse User Interface
- OptFantasy Integrality Gap
- Weekly Score Trajectories
- Out-of-Sample Comparisons
- Player Value Frontier
- Runtime Performance Analysis
- Season Cumulative Trajectories
- Service Requests Dashboard
- Case Details View
- Military Background Form
- Login Screen UI
- Mood Tracker UI
- Psyches Dashboard UI
- Reflection Interface
- Activities Interface
- Token Acceptance Heatmap
- Network Overhead Analysis
- Throughput Performance Chart
- RPC Time Scatter Plot
- Traceroute Country Analysis
- Unlabeled Hops CDF
- Path Definition Diagram
- Country-in-the-Middle Heatmap
- Domain Discovery Methodology
- Violator Path Map
- GenAI Tool Survey
- Learning Impact Survey
- Programming Confidence Survey
- Function Design Workflow
- Hue Field + Product Staging Implementation Plan
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- pipeline-walkthrough.tsx
- ownership-pipeline.tsx
- primitives.tsx
- optfantasy-comparison.tsx
- route.ts
- Portfolio Refactor v5 — execution plan (2026-09-25)
- next
- Technical Product System — execution plan (2026-09-25)
- specsplit-simulator.tsx
- next_dev_types_root_params_d
- next_dev_types_routes_d
- Security audit (2026-09-26, portfolio v5)
- verify-tropes.sh
- components_ui_icons_circlenotch

## God Nodes (most connected - your core abstractions)
1. `next` - 33 edges
2. `react` - 29 edges
3. `cn()` - 26 edges
4. `@playwright/test` - 16 edges
5. `compilerOptions` - 16 edges
6. `clean()` - 15 edges
7. `Brutalism Design System Skill (Universal)` - 14 edges
8. `Brutalism Design System Skill (Universal)` - 14 edges
9. `Portfolio Refactor v5 — execution plan (2026-09-25)` - 13 edges
10. `What You Must Do When Invoked` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Contract changes log` --references--> `useMailto()`  [INFERRED]
  docs/superpowers/plans/-portfolio-refactor-v5.md → components/utm-capture.tsx
- `Contract changes log` --references--> `HeroTitles()`  [INFERRED]
  docs/superpowers/plans/-portfolio-refactor-v5.md → components/hero-titles.tsx
- `ProjectPage()` --calls--> `bySlug()`  [EXTRACTED]
  app/work/[slug]/page.tsx → data/projects.ts
- `ContactPage()` --calls--> `cn()`  [EXTRACTED]
  app/contact/page.tsx → lib/utils.ts
- `send()` --calls--> `readUtm()`  [EXTRACTED]
  app/contact/page.tsx → components/utm-capture.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **LomaVerse Simulation Views** — public_assets_projects_lomaverse_binary2d, public_assets_projects_lomaverse_binary3d, public_assets_projects_lomaverse_chaos2d, public_assets_projects_lomaverse_chaos3d, public_assets_projects_lomaverse_solarsystem2d, public_assets_projects_lomaverse_solarsystem3d, public_assets_projects_lomaverse_ui [EXTRACTED 1.00]
- **OptFantasy Performance Analysis** — public_assets_projects_optfantasy_integrality_gap, public_assets_projects_optfantasy_method_cumulative_trajectory, public_assets_projects_optfantasy_method_score_comparison, public_assets_projects_optfantasy_player_value_frontier, public_assets_projects_optfantasy_runtime_vs_score, public_assets_projects_optfantasy_weekly_score_trajectories [EXTRACTED 1.00]
- **Patriots and Paws Inventory System UI** — public_assets_projects_pap_inventory_pap_inventory_1, public_assets_projects_pap_inventory_pap_inventory_2, public_assets_projects_pap_inventory_pap_inventory_3, public_assets_projects_pap_inventory_pap_inventory_4 [EXTRACTED 1.00]
- **SpecSplit Speculative Decoding System** — public_assets_projects_specsplit_architecture_orchestrator, public_assets_projects_specsplit_architecture_draft_worker, public_assets_projects_specsplit_architecture_target_worker, public_assets_projects_specsplit_architecture_ngrok_tunnel [EXTRACTED 1.00]

## Communities (88 total, 55 thin omitted)

### Community 0 - "registry.tsx"
Cohesion: 0.32
Nodes (5): LomaVerseOrbit(), RINGS, VisualFigureProvider, visuals, VisualMode

### Community 1 - "honeyllm-flow.tsx"
Cohesion: 0.15
Nodes (17): arc(), CitmTopology(), STOPS, CHANNELS, CONTENT, cx(), HoneyLlmFlow(), SIGNAL (+9 more)

### Community 2 - "layout.tsx"
Cohesion: 0.06
Nodes (37): ContactPage(), send(), FAQS, Status, app_globals, jetbrainsMono, metadata, outfit (+29 more)

### Community 3 - "resume/page.tsx"
Cohesion: 0.09
Nodes (32): metadata, metadata, generateMetadata(), ClubsSection(), EducationSection(), ExperienceSection(), Hero(), ProjectCard() (+24 more)

### Community 4 - "lomaverse-sim.tsx"
Cohesion: 0.16
Nodes (17): BodyConfig, clearTrails(), Colors, computeAccel(), makeSim(), place(), reset(), sample() (+9 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (35): eslintConfig, devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node (+27 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "Frontend Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, class-variance-authority, clsx, @emailjs/nodejs, gsap, lenis, motion, next (+9 more)

### Community 8 - "specsplit-topology.tsx"
Cohesion: 0.25
Nodes (8): CLIENT, DRAFT, NODES, OUTPUT, right(), SpecSplitTopology(), TARGET, TREE

### Community 9 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 10 - "@playwright/test"
Cohesion: 0.09
Nodes (6): port, @playwright/test, INTRINSIC, VIEWPORTS, CASES, ROUTES

### Community 11 - "Brutalism Design System Skill (Universal)"
Cohesion: 0.13
Nodes (14): Accessibility, Brand, Brutalism Design System Skill (Universal), Component Rule Expectations, Example Constraint Language, Expected Behavior, Guideline Authoring Workflow, Mission (+6 more)

### Community 12 - "LLM Benchmark Dashboard"
Cohesion: 0.33
Nodes (6): Draft Worker (Llama 3.1 8B), ngrok Tunnel, Orchestrator, Target Worker (Llama 3.1 70B), SpecSplit Pipeline Benchmark Dashboard, TPOT and Throughput vs. Draft Tree Depth

### Community 13 - "types.ts"
Cohesion: 0.06
Nodes (46): metadata, dynamicParams, ProjectPage(), CoverParallax(), LomaVerseLazy, SpecSplitLazy, Figure(), Metric() (+38 more)

### Community 14 - "Graphify Plugin Configuration"
Cohesion: 0.40
Nodes (3): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path

### Community 15 - "Brutalism Design System Skill (Universal)"
Cohesion: 0.13
Nodes (14): Accessibility, Brand, Brutalism Design System Skill (Universal), Component Rule Expectations, Example Constraint Language, Expected Behavior, Guideline Authoring Workflow, Mission (+6 more)

### Community 16 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 17 - "next-env.d.ts"
Cohesion: 0.50
Nodes (3): NOTE: This file should not be edited, next_types_root_params_d, next_types_routes_d

### Community 18 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 67 - "Hue Field + Product Staging Implementation Plan"
Cohesion: 0.40
Nodes (4): Hue Field + Product Staging Implementation Plan, Locked refinements, Skills loaded, Tasks

### Community 68 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 69 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 70 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 74 - "pipeline-walkthrough.tsx"
Cohesion: 0.40
Nodes (4): PipelineWalkthrough(), STEPS, OwnershipPipeline(), gsap

### Community 75 - "ownership-pipeline.tsx"
Cohesion: 0.11
Nodes (18): CACHE, CLUSTERS, FIELD, FieldDots(), LATTICE, OperatorLattice(), OUTPUT, OWNERSHIP_STAGES (+10 more)

### Community 76 - "primitives.tsx"
Cohesion: 0.14
Nodes (4): VisualFigureContext, visualNodeColor, VisualNodeState, VisualFrame()

### Community 77 - "optfantasy-comparison.tsx"
Cohesion: 0.22
Nodes (9): GRID_X, LEGEND, OptFantasyComparison(), plot(), Point, POINTS, Series, VisualAnnotation() (+1 more)

### Community 78 - "route.ts"
Cohesion: 0.14
Nodes (16): ContactPayload, isAllowedOrigin(), isContactPayload(), jsonResponse(), POST(), readLimitedBody(), runtime, takeRateLimit (+8 more)

### Community 79 - "Portfolio Refactor v5 — execution plan (2026-09-25)"
Cohesion: 0.12
Nodes (16): HeroTitles(), TITLES, Contract changes log, Phase 0 baseline (recorded 2026-09-25), Phase 10 — Full verification, Phase 1 — Figure optics (Defect 1), Phase 2 — Hero product stage (Defect 2), Phase 3 — Visual story hygiene (Defect 5) (+8 more)

### Community 81 - "next"
Cohesion: 0.06
Nodes (23): alt, contentType, size, metadata, metadata, metadata, metadata, Particle (+15 more)

### Community 83 - "Technical Product System — execution plan (2026-09-25)"
Cohesion: 0.25
Nodes (7): Dependency policy, Final verification (2026-09-25), Hard bans (machine-enforced), Non-negotiables (abridged), Phase 0 baseline (recorded 2026-09-25, branch `redesign`, dirty tree), Phases 1–9, Technical Product System — execution plan (2026-09-25)

### Community 84 - "specsplit-simulator.tsx"
Cohesion: 0.47
Nodes (4): SpecSplitSimulator(), BenchmarkPoint, interpolate(), specsplitBenchmarks

### Community 87 - "Security audit (2026-09-26, portfolio v5)"
Cohesion: 0.40
Nodes (4): Implemented (verified by `tests/e2e/contact-api.spec.ts`), N/A with reason (one line each), Security audit (2026-09-26, portfolio v5), v5 changes (re-verified this round)

## Knowledge Gaps
- **288 isolated node(s):** `$schema`, `plugin`, `metadata`, `runtime`, `ContactPayload` (+283 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 373 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `layout.tsx` to `registry.tsx`, `honeyllm-flow.tsx`, `resume/page.tsx`, `lomaverse-sim.tsx`, `package.json`, `specsplit-topology.tsx`, `pipeline-walkthrough.tsx`, `ownership-pipeline.tsx`, `primitives.tsx`, `types.ts`, `optfantasy-comparison.tsx`, `Portfolio Refactor v5 — execution plan (2026-09-25)`, `next`, `specsplit-simulator.tsx`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `registry.tsx`, `layout.tsx`, `resume/page.tsx`, `package.json`, `types.ts`, `route.ts`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `@playwright/test` connect `@playwright/test` to `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `metadata` to the rest of the system?**
  _288 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `honeyllm-flow.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.062146892655367235 - nodes in this community are weakly interconnected._
- **Should `resume/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08705882352941176 - nodes in this community are weakly interconnected._