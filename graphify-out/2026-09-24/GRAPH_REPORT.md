# Graph Report - samvritsrinath.github.io  (2026-09-24)

## Corpus Check
- 115 files · ~288,892 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 1, .lock 1)

## Summary
- 579 nodes · 953 edges · 85 communities (32 shown, 53 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1b3fe55`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- honeyllm-flow.tsx
- ui-icons.tsx
- next
- lomaverse-sim.tsx
- layout.tsx
- TypeScript Configuration
- Frontend Dependencies
- specsplit-topology.tsx
- What You Must Do When Invoked
- @playwright/test
- Brutalism Design System Skill (Universal)
- LLM Benchmark Dashboard
- cn
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
- ownership-pipeline.tsx
- devDependencies
- primitives.tsx
- optfantasy-comparison.tsx
- route.ts
- playground/page.tsx
- opengraph-image.tsx
- react
- citm-topology.tsx
- next_dev_types_root_params_d
- next_dev_types_routes_d

## God Nodes (most connected - your core abstractions)
1. `next` - 33 edges
2. `react` - 29 edges
3. `cn()` - 28 edges
4. `compilerOptions` - 16 edges
5. `clean()` - 15 edges
6. `Brutalism Design System Skill (Universal)` - 14 edges
7. `Brutalism Design System Skill (Universal)` - 14 edges
8. `bySlug()` - 12 edges
9. `What You Must Do When Invoked` - 12 edges
10. `site` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContactPage()` --calls--> `cn()`  [EXTRACTED]
  app/contact/page.tsx → lib/utils.ts
- `send()` --calls--> `readUtm()`  [EXTRACTED]
  app/contact/page.tsx → components/utm-capture.tsx
- `generateMetadata()` --calls--> `bySlug()`  [EXTRACTED]
  app/work/[slug]/page.tsx → data/projects.ts
- `ProjectPage()` --calls--> `bySlug()`  [EXTRACTED]
  app/work/[slug]/page.tsx → data/projects.ts
- `CopyButton()` --calls--> `cn()`  [EXTRACTED]
  components/copy-button.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **LomaVerse Simulation Views** — public_assets_projects_lomaverse_binary2d, public_assets_projects_lomaverse_binary3d, public_assets_projects_lomaverse_chaos2d, public_assets_projects_lomaverse_chaos3d, public_assets_projects_lomaverse_solarsystem2d, public_assets_projects_lomaverse_solarsystem3d, public_assets_projects_lomaverse_ui [EXTRACTED 1.00]
- **OptFantasy Performance Analysis** — public_assets_projects_optfantasy_integrality_gap, public_assets_projects_optfantasy_method_cumulative_trajectory, public_assets_projects_optfantasy_method_score_comparison, public_assets_projects_optfantasy_player_value_frontier, public_assets_projects_optfantasy_runtime_vs_score, public_assets_projects_optfantasy_weekly_score_trajectories [EXTRACTED 1.00]
- **Patriots and Paws Inventory System UI** — public_assets_projects_pap_inventory_pap_inventory_1, public_assets_projects_pap_inventory_pap_inventory_2, public_assets_projects_pap_inventory_pap_inventory_3, public_assets_projects_pap_inventory_pap_inventory_4 [EXTRACTED 1.00]
- **SpecSplit Speculative Decoding System** — public_assets_projects_specsplit_architecture_orchestrator, public_assets_projects_specsplit_architecture_draft_worker, public_assets_projects_specsplit_architecture_target_worker, public_assets_projects_specsplit_architecture_ngrok_tunnel [EXTRACTED 1.00]

## Communities (85 total, 53 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.13
Nodes (17): LomaVerseLazy, SpecSplitLazy, LomaVerseOrbit(), RINGS, Visual(), visuals, Club, ContentSection (+9 more)

### Community 1 - "honeyllm-flow.tsx"
Cohesion: 0.19
Nodes (12): CHANNELS, CONTENT, cx(), HoneyLlmFlow(), SIGNAL, GPU, MegakernelAnatomy(), SMs (+4 more)

### Community 2 - "ui-icons.tsx"
Cohesion: 0.10
Nodes (22): ContactPage(), send(), FAQS, Status, ContactSection(), CopyButton(), FloatingContact(), Footer() (+14 more)

### Community 3 - "next"
Cohesion: 0.07
Nodes (35): metadata, metadata, metadata, metadata, generateMetadata(), ProjectPage(), ClubsSection(), EducationSection() (+27 more)

### Community 4 - "lomaverse-sim.tsx"
Cohesion: 0.19
Nodes (14): BodyConfig, clearTrails(), Colors, computeAccel(), makeSim(), place(), reset(), sample() (+6 more)

### Community 5 - "layout.tsx"
Cohesion: 0.05
Nodes (37): app_globals, jetbrainsMono, metadata, outfit, CookieBanner(), GoTop(), LenisProvider(), ScrollProgress() (+29 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "Frontend Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, class-variance-authority, clsx, @emailjs/nodejs, gsap, lenis, motion, next (+9 more)

### Community 8 - "specsplit-topology.tsx"
Cohesion: 0.17
Nodes (12): SpecSplitSimulator(), CLIENT, DRAFT, NODES, OUTPUT, right(), SpecSplitTopology(), TARGET (+4 more)

### Community 9 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 10 - "@playwright/test"
Cohesion: 0.15
Nodes (3): port, @playwright/test, CASES

### Community 11 - "Brutalism Design System Skill (Universal)"
Cohesion: 0.13
Nodes (14): Accessibility, Brand, Brutalism Design System Skill (Universal), Component Rule Expectations, Example Constraint Language, Expected Behavior, Guideline Authoring Workflow, Mission (+6 more)

### Community 12 - "LLM Benchmark Dashboard"
Cohesion: 0.33
Nodes (6): Draft Worker (Llama 3.1 8B), ngrok Tunnel, Orchestrator, Target Worker (Llama 3.1 70B), SpecSplit Pipeline Benchmark Dashboard, TPOT and Throughput vs. Draft Tree Depth

### Community 13 - "cn"
Cohesion: 0.09
Nodes (28): dynamicParams, CoverParallax(), Figure(), Metric(), MetricProps, MetricRow(), Nav(), PaperLink() (+20 more)

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

### Community 74 - "ownership-pipeline.tsx"
Cohesion: 0.16
Nodes (11): PipelineWalkthrough(), STEPS, edges, index, NODES, OVERVIEW_NODES, OwnershipDiagram(), OwnershipPipeline() (+3 more)

### Community 75 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+3 more)

### Community 76 - "primitives.tsx"
Cohesion: 0.18
Nodes (3): visualNodeColor, VisualSignal(), useReducedMotion()

### Community 77 - "optfantasy-comparison.tsx"
Cohesion: 0.25
Nodes (8): GRID_X, LEGEND, OptFantasyComparison(), plot(), Point, POINTS, Series, VisualAxis()

### Community 78 - "route.ts"
Cohesion: 0.18
Nodes (14): ContactPayload, isAllowedOrigin(), isContactPayload(), jsonResponse(), POST(), readLimitedBody(), runtime, takeRateLimit (+6 more)

### Community 79 - "playground/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, Particle, Playground()

### Community 80 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 81 - "react"
Cohesion: 0.11
Nodes (17): metadata, metadata, ProjectCard(), initials(), ProjectCover(), Reveal(), SectionHeading(), SectionHeadingProps (+9 more)

### Community 82 - "citm-topology.tsx"
Cohesion: 0.50
Nodes (4): arc(), CitmTopology(), STOPS, VisualAnnotation()

## Knowledge Gaps
- **249 isolated node(s):** `$schema`, `plugin`, `metadata`, `runtime`, `ContactPayload` (+244 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 329 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `types.ts`, `ui-icons.tsx`, `layout.tsx`, `cn`, `route.ts`, `playground/page.tsx`, `opengraph-image.tsx`, `react`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `types.ts`, `honeyllm-flow.tsx`, `ui-icons.tsx`, `next`, `lomaverse-sim.tsx`, `layout.tsx`, `specsplit-topology.tsx`, `ownership-pipeline.tsx`, `primitives.tsx`, `cn`, `optfantasy-comparison.tsx`, `playground/page.tsx`, `citm-topology.tsx`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Dependencies` to `layout.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `metadata` to the rest of the system?**
  _249 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `ui-icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.07033315705975675 - nodes in this community are weakly interconnected._