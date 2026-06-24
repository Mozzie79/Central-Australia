# Graph Report - .  (2026-06-24)

## Corpus Check
- 67 files · ~58,391 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 293 nodes · 341 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.84)
- Token cost: 189,410 input · 49,164 output

## Community Hubs (Navigation)
- [[_COMMUNITY_TDD & Skill Authoring|TDD & Skill Authoring]]
- [[_COMMUNITY_Code Review Workflow|Code Review Workflow]]
- [[_COMMUNITY_Graphify AddWatchMerge|Graphify Add/Watch/Merge]]
- [[_COMMUNITY_Cross-Platform Agent Tooling|Cross-Platform Agent Tooling]]
- [[_COMMUNITY_Systematic Debugging Techniques|Systematic Debugging Techniques]]
- [[_COMMUNITY_Graphify Extraction Pipeline|Graphify Extraction Pipeline]]
- [[_COMMUNITY_Skill Persuasion & Testing|Skill Persuasion & Testing]]
- [[_COMMUNITY_Brainstorming Skill|Brainstorming Skill]]
- [[_COMMUNITY_Graphify Exports & Build Steps|Graphify Exports & Build Steps]]
- [[_COMMUNITY_Plan Writing & Worktrees|Plan Writing & Worktrees]]
- [[_COMMUNITY_Ponytail Lazy-Mode Skills|Ponytail Lazy-Mode Skills]]
- [[_COMMUNITY_Brainstorming WS Helper|Brainstorming WS Helper]]
- [[_COMMUNITY_Render Graphs Script|Render Graphs Script]]
- [[_COMMUNITY_Stop-Server Script|Stop-Server Script]]
- [[_COMMUNITY_Ponytail Audit & Debt|Ponytail Audit & Debt]]
- [[_COMMUNITY_Start-Server Script|Start-Server Script]]
- [[_COMMUNITY_Find-Polluter Script|Find-Polluter Script]]
- [[_COMMUNITY_Frame Template Theme|Frame Template Theme]]

## God Nodes (most connected - your core abstractions)
1. `Systematic Debugging Skill` - 14 edges
2. `Persuasion Principles for Skill Design` - 11 edges
3. `Subagent-Driven Development Skill` - 10 edges
4. `graphify Skill` - 9 edges
5. `Using Superpowers` - 9 edges
6. `Test-Driven Development (TDD)` - 8 edges
7. `Ponytail Skill` - 7 edges
8. `invoke_subagent (Antigravity)` - 7 edges
9. `Writing Plans` - 7 edges
10. `Writing Skills` - 7 edges

## Surprising Connections (you probably didn't know these)
- `REFACTOR Phase: Close Loopholes (Skills)` --semantically_similar_to--> `Red-Green-Refactor Cycle`  [INFERRED] [semantically similar]
  .claude/skills/writing-skills/testing-skills-with-subagents.md → .claude/skills/test-driven-development/SKILL.md
- `invoke_subagent (Antigravity)` --semantically_similar_to--> `Agent tool (Claude Code subagent dispatch)`  [INFERRED] [semantically similar]
  .claude/skills/using-superpowers/references/antigravity-tools.md → .claude/skills/using-superpowers/references/claude-code-tools.md
- `invoke_subagent (Antigravity)` --semantically_similar_to--> `task tool (Copilot CLI subagent dispatch)`  [INFERRED] [semantically similar]
  .claude/skills/using-superpowers/references/antigravity-tools.md → .claude/skills/using-superpowers/references/copilot-tools.md
- `invoke_subagent (Antigravity)` --semantically_similar_to--> `invoke_agent tool (Gemini CLI subagent dispatch)`  [INFERRED] [semantically similar]
  .claude/skills/using-superpowers/references/antigravity-tools.md → .claude/skills/using-superpowers/references/gemini-tools.md
- `invoke_subagent (Antigravity)` --semantically_similar_to--> `pi-subagents subagent tool`  [INFERRED] [semantically similar]
  .claude/skills/using-superpowers/references/antigravity-tools.md → .claude/skills/using-superpowers/references/pi-tools.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brainstorming-to-Implementation Skill Pipeline** — brainstorming_skill_brainstorming, brainstorming_skill_writing_plans_transition, executing_plans_skill_executing_plans, finishing_a_development_branch_skill_finishing_a_development_branch [EXTRACTED 0.90]
- **graphify Full Pipeline Stage Sequence** — graphify_skill_step1_install, graphify_skill_step2_detect, graphify_skill_step3_extract, graphify_skill_step4_build_graph, graphify_skill_step4_5_health_check, graphify_skill_step5_label_communities, graphify_skill_step6_obsidian_html, graphify_skill_step9_manifest_cost_cleanup [EXTRACTED 0.90]
- **graphify Data Integrity Guard Rails** — graphify_skill_empty_graph_guard, graphify_skill_shrink_guard_479, graphify_skill_step4_5_health_check, update_reference_replace_on_reextract_1344 [INFERRED 0.85]
- **Ponytail Skill Family (lazy-coding mode and its companion tools)** — ponytail_ponytail, ponytail_review_ponytail_review, ponytail_gain_ponytail_gain, ponytail_help_ponytail_help [EXTRACTED 0.90]
- **Subagent-Driven Development Workflow (controller, implementer, task reviewer, final reviewer)** — subagent_driven_development_subagent_driven_development, subagent_driven_development_implementer_prompt_template, subagent_driven_development_task_reviewer_prompt_template, requesting_code_review_code_reviewer_template [EXTRACTED 0.90]
- **Systematic Debugging Core Skill and Supporting Techniques** — systematic_debugging_systematic_debugging, root_cause_tracing_root_cause_tracing, defense_in_depth_defense_in_depth, condition_based_waiting_condition_based_waiting [EXTRACTED 0.90]
- **TDD Methodology Applied Across Code and Skill Documentation** — test_driven_development_skill_md_tdd, writing_skills_skill_md_tdd_mapping, testing_skills_with_subagents_md_overview, writing_skills_skill_md_red_green_refactor_for_skills [INFERRED 0.90]
- **Cross-Runtime Tool Mapping Reference Documents** — antigravity_tools_md_overview, claude_code_tools_md_overview, codex_tools_md_overview, copilot_tools_md_overview, gemini_tools_md_overview, pi_tools_md_overview [EXTRACTED 1.00]
- **Skill Bulletproofing and Testing Pipeline** — writing_skills_skill_md_bulletproofing, testing_skills_with_subagents_md_overview, persuasion_principles_md_overview, claude_md_testing_md_overview [INFERRED 0.85]

## Communities (19 total, 3 thin omitted)

### Community 0 - "TDD & Skill Authoring"
Cohesion: 0.08
Nodes (29): Checklist for Effective Skills, Concise Is Key principle, Setting Appropriate Degrees of Freedom, Evaluation-Driven Development for Skills, Skill Authoring Best Practices (Anthropic), Progressive Disclosure Patterns, Skills Runtime Environment, TDD Iron Law: No Production Code Without a Failing Test First (+21 more)

### Community 1 - "Code Review Workflow"
Cohesion: 0.09
Nodes (29): Code Review Output Format (Strengths/Issues/Recommendations/Assessment), Read-Only Review Constraint, Senior Code Reviewer Subagent Role, Issue Severity Calibration (Critical/Important/Minor), Escalation Statuses (BLOCKED/NEEDS_CONTEXT/DONE_WITH_CONCERNS), Implementer Subagent Role, Implementer Self-Review Checklist, No Performative Agreement Rule (+21 more)

### Community 2 - "Graphify Add/Watch/Merge"
Cohesion: 0.08
Nodes (28): graphify add/--watch Reference, Watch Debounce Rationale, graphify.ingest.ingest Function, graphify.watch Module, graphify CLAUDE.md Trigger Rule, graphify clone Command, GitHub Clone and Cross-Repo Merge Reference, graphify merge-graphs Command (+20 more)

### Community 3 - "Cross-Platform Agent Tooling"
Cohesion: 0.10
Nodes (27): define_subagent (Antigravity), invoke_subagent (Antigravity), Antigravity CLI (agy) Tool Mapping, Task Artifact (Antigravity task tracking), view_file with IsSkillFile (skill loading mechanism), Agent tool (Claude Code subagent dispatch), CLAUDE.md instructions file, Claude Code Tool Mapping (+19 more)

### Community 4 - "Systematic Debugging Techniques"
Cohesion: 0.12
Nodes (24): When Arbitrary Timeout Is Correct, Condition-Based Waiting Technique, waitFor() Generic Polling Function, Bulletproofing Elements (language choices, structural defenses, redundancy), Systematic Debugging Skill Creation Log, TDD Reference Enhancement, Four Validation Tests (academic, time pressure, complex system, failed fix), Defense-in-Depth Validation Technique (+16 more)

### Community 5 - "Graphify Extraction Pipeline"
Cohesion: 0.09
Nodes (22): Dispatch One Agent Per Independent Problem Domain, Dispatching Parallel Agents Skill, Parallel Dispatch in Single Response Pattern, Confidence Score Rubric, Extraction Subagent Prompt Spec, Node ID Format Rule, source_file Verbatim Path Rule, Empty Graph Guard (+14 more)

### Community 6 - "Skill Persuasion & Testing"
Cohesion: 0.11
Nodes (21): Documentation Variants (NULL, A, B, C, D), Testing CLAUDE.md Skills Documentation, Test Scenarios (time pressure, sunk cost, authority, familiarity), Testing Protocol, Authority Principle, Cialdini, R. B. (2021) Influence: The Psychology of Persuasion, Commitment Principle, Liking Principle (+13 more)

### Community 7 - "Brainstorming Skill"
Cohesion: 0.10
Nodes (20): Frame Template Brand/Header Block, Options/Cards/Mockup CSS Components, Brainstorming Skill, Brainstorming HARD-GATE Rule, Spec Self-Review Process, Visual Companion Just-in-Time Offer, Transition to writing-plans Skill, Spec Document Reviewer Subagent Template (+12 more)

### Community 8 - "Graphify Exports & Build Steps"
Cohesion: 0.12
Nodes (19): graphify Exports and Benchmark Reference, FalkorDB Export (graphify export falkordb), graphify.serve MCP stdio Server, Neo4j Export (graphify export neo4j), Token Reduction Benchmark (graphify benchmark), /graphify query Subcommand, Step 4.5: Graph Health Check (Integrity Gate), Step 5: Label Communities (+11 more)

### Community 9 - "Plan Writing & Worktrees"
Cohesion: 0.12
Nodes (17): Codex Environment Detection (git worktree/HEAD checks), executing-plans skill, Plan Document Reviewer Prompt Template, subagent-driven-development skill, Step 0: Detect Existing Isolation, EnterWorktree (native tool), Git Worktree Fallback, Native Worktree Tools (preferred) (+9 more)

### Community 10 - "Ponytail Lazy-Mode Skills"
Cohesion: 0.17
Nodes (16): ponytail: Comment Convention, Honesty Boundary (no per-repo savings claims), Ponytail Gain Skill, Ponytail Gain Scoreboard, PONYTAIL_DEFAULT_MODE Configuration, Ponytail Intensity Levels (lite/full/ultra), Ponytail Help Skill, Ponytail Skills Reference Table (+8 more)

### Community 11 - "Brainstorming WS Helper"
Cohesion: 0.33
Nodes (5): connect(), reloadAfterRecovery(), sessionKey(), setStatus(), websocketUrl()

### Community 12 - "Render Graphs Script"
Cohesion: 0.31
Nodes (7): combineGraphs(), { execSync }, extractDotBlocks(), fs, main(), path, renderToSvg()

### Community 13 - "Stop-Server Script"
Cohesion: 0.43
Nodes (4): stop-server.sh script, command_has_server_id(), is_brainstorm_server(), mark_stopped()

### Community 14 - "Ponytail Audit & Debt"
Cohesion: 0.33
Nodes (6): ponytail-audit Scope Boundaries, ponytail-audit Skill, ponytail-audit Tags (delete/stdlib/native/yagni/shrink), ponytail: Comment Marker Convention, no-trigger Rot-Risk Flag, ponytail-debt Skill

## Knowledge Gaps
- **70 isolated node(s):** `find-polluter.sh script`, `fs`, `path`, `{ execSync }`, `Frame Template Brand/Header Block` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Systematic Debugging Skill` connect `Systematic Debugging Techniques` to `Code Review Workflow`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `graphify Skill` connect `Graphify Add/Watch/Merge` to `Graphify Exports & Build Steps`, `Graphify Extraction Pipeline`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `find-polluter.sh script`, `fs`, `path` to the rest of the system?**
  _107 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TDD & Skill Authoring` be split into smaller, more focused modules?**
  _Cohesion score 0.07881773399014778 - nodes in this community are weakly interconnected._
- **Should `Code Review Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.09113300492610837 - nodes in this community are weakly interconnected._
- **Should `Graphify Add/Watch/Merge` be split into smaller, more focused modules?**
  _Cohesion score 0.082010582010582 - nodes in this community are weakly interconnected._
- **Should `Cross-Platform Agent Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._