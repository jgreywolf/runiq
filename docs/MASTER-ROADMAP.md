# Runiq Master Roadmap

**Last Updated:** October 17, 2025  
**Purpose:** Single source of truth for all Runiq development planning  
**Note:** Individual diagram type implementations are tracked in [GitHub Issues #1-46](https://github.com/jgreywolf/runiq/issues)  
**Note:** Infrastructure and library enhancements are tracked in [GitHub Issues #47-54](https://github.com/jgreywolf/runiq/issues)

---

## 📊 Current Status Summary

### Completed Features ✅

**Total Shapes Implemented:** 71  
**Total Tests Passing:** 728  
**Core Systems:** Stable and production-ready

#### Major Milestones (2025)

- **October 17, 2025** - **Quantum Circuits** 🎉
  - 12 quantum gate shapes
  - 52 tests passing
  - Full quantum circuit support (H, X, Y, Z, CNOT, SWAP, Toffoli, measurement)
- **October 2025** - **Network Topology Diagrams** 🎉
  - 7 network device shapes (router, switch, firewall, server, cloud, wireless, laptop)
  - 33 tests passing
  - Enterprise network visualization support

- **October 2025** - **Pedigree Charts** 🎉
  - 3 specialized shapes (male, female, union)
  - 32 tests passing
  - Genealogy and family tree support

- **October 2025** - **Core Architecture Improvements**
  - ✅ Migrated from Dagre to ELK layout engine
  - ✅ Hierarchical containers system
  - ✅ UML relationship stereotypes
  - ✅ Block diagram support with export formats (LaTeX, Simulink, SPICE, Verilog)
  - ✅ Use case diagrams
  - ✅ Langium-based DSL parser (replaced PEG.js)

#### Shape Library (71 Total)

**Flowchart & Basic (14 shapes)**

- Rectangle, Rounded, Stadium, Diamond, Circle, Triangle, Hexagon
- Parallelogram, Trapezoid (2 variants), Manual Input, Delay, Cylinder, Document

**Network Topology (7 shapes)**

- Router, Switch, Firewall, Server, Cloud, Wireless AP, Laptop

**Quantum Circuits (12 shapes)**

- Single-qubit gates: H, X, Y, Z, S, T
- Multi-qubit gates: CNOT, SWAP, Toffoli
- Measurement, Control Dot, Barrier

**Pedigree/Genealogy (3 shapes)**

- Male (square), Female (circle), Union (diamond)

**UML & Specialized (35+ shapes)**

- Actor, Use Case, System Boundary
- Class, Interface, Package
- Component, Node, Artifact
- State, Initial State, Final State
- And more...

---

## 🎯 Active Development

### Current Sprint: Documentation & Planning

- ✅ Created comprehensive GitHub issues for 46 diagram types
- ✅ Organized issues into 4 tiers by effort and value
- ✅ Prioritized quick wins and high-value engineering diagrams
- 🔄 Consolidated roadmap documentation (this file)

### Next Up: Tier 1 Quick Wins

Start with highest ROI implementations:

1. **Issue #1: Mindmap Support** (4 hours)
   - Enable ELK radial algorithm
   - No new shapes needed
   - Quick win for brainstorming diagrams

2. **Issue #4: Pneumatic/Hydraulic Circuits** (2-3 days)
   - 25 symbols (ISO 1219 standard)
   - 95% code reuse from electrical circuits
   - **Extremely high industry value** 💰💰💰💰

3. **Issue #14: P&ID (Piping & Instrumentation)** (3-4 days)
   - 60+ symbols (ISA-5.1 standard)
   - Chemical, oil & gas, pharmaceutical industries
   - **Highest industry value** 💰💰💰💰💰

---

## 📋 Roadmap by Category

### 🚀 Tier 1: Quick Wins (1-3 days each)

**All tracked in GitHub Issues #1-12**

| Issue                                               | Diagram Type        | Effort   | Priority      | Value                  |
| --------------------------------------------------- | ------------------- | -------- | ------------- | ---------------------- |
| [#1](https://github.com/jgreywolf/runiq/issues/1)   | Mindmap             | 4 hours  | High          | Medium                 |
| [#2](https://github.com/jgreywolf/runiq/issues/2)   | Circular Flow       | 6 hours  | Medium        | Medium                 |
| [#3](https://github.com/jgreywolf/runiq/issues/3)   | Graph Theory        | 1-2 days | High          | High                   |
| [#4](https://github.com/jgreywolf/runiq/issues/4)   | Pneumatic/Hydraulic | 2-3 days | **Very High** | **Very High** 💰💰💰💰 |
| [#5](https://github.com/jgreywolf/runiq/issues/5)   | Kinematic           | 2-3 days | Medium        | Medium                 |
| [#6](https://github.com/jgreywolf/runiq/issues/6)   | Control Systems     | 2-3 days | High          | High 💰💰💰            |
| [#7](https://github.com/jgreywolf/runiq/issues/7)   | HVAC                | 2-3 days | Medium        | Medium                 |
| [#8](https://github.com/jgreywolf/runiq/issues/8)   | Template Library    | 2-3 days | High          | Medium                 |
| [#9](https://github.com/jgreywolf/runiq/issues/9)   | User Journey        | 1-2 days | Medium        | Medium                 |
| [#10](https://github.com/jgreywolf/runiq/issues/10) | Pie Chart           | 1-2 days | Low           | Low                    |
| [#11](https://github.com/jgreywolf/runiq/issues/11) | Timeline            | 1-2 days | Medium        | Medium                 |
| [#12](https://github.com/jgreywolf/runiq/issues/12) | Quadrant Chart      | 1-2 days | Medium        | Medium                 |

**Recommended Start Order:**

1. #1 (Mindmap) - 4 hours, easiest win
2. #4 (Pneumatic/Hydraulic) - High ROI, code reuse
3. #14 (P&ID) - Highest industry value (see Tier 2)

### 📊 Tier 2: Medium Effort (3-7 days each)

**All tracked in GitHub Issues #13-26**

| Issue                                               | Diagram Type      | Effort   | Priority      | Value                         |
| --------------------------------------------------- | ----------------- | -------- | ------------- | ----------------------------- |
| [#13](https://github.com/jgreywolf/runiq/issues/13) | UML Timing        | 4-6 days | Medium        | Medium                        |
| [#14](https://github.com/jgreywolf/runiq/issues/14) | **P&ID**          | 3-4 days | **Very High** | **Extremely High** 💰💰💰💰💰 |
| [#15](https://github.com/jgreywolf/runiq/issues/15) | XY Chart          | 3-5 days | Medium        | Medium                        |
| [#16](https://github.com/jgreywolf/runiq/issues/16) | Gantt Chart       | 3-5 days | High          | High                          |
| [#17](https://github.com/jgreywolf/runiq/issues/17) | Treemap           | 2-4 days | Low           | Low                           |
| [#18](https://github.com/jgreywolf/runiq/issues/18) | Kanban            | 3-5 days | High          | Medium                        |
| [#19](https://github.com/jgreywolf/runiq/issues/19) | Packet Diagram    | 3-4 days | Medium        | Medium                        |
| [#20](https://github.com/jgreywolf/runiq/issues/20) | GitGraph          | 3-5 days | Medium        | Medium                        |
| [#21](https://github.com/jgreywolf/runiq/issues/21) | Requirement       | 2-3 days | Medium        | Medium                        |
| [#22](https://github.com/jgreywolf/runiq/issues/22) | Mindmap+          | 2-3 days | Medium        | Low                           |
| [#23](https://github.com/jgreywolf/runiq/issues/23) | Ishikawa Fishbone | 3-4 days | Medium        | Medium                        |
| [#24](https://github.com/jgreywolf/runiq/issues/24) | Causal Loop       | 3-5 days | Medium        | Medium                        |
| [#25](https://github.com/jgreywolf/runiq/issues/25) | Threat Modeling   | 4-6 days | Medium        | High                          |
| [#26](https://github.com/jgreywolf/runiq/issues/26) | N×M Matrix        | 2-3 days | Low           | Low                           |

**High Priority Picks:**

- #14 (P&ID) - Chemical/oil/gas industry standard
- #16 (Gantt) - Project management essential
- #18 (Kanban) - Agile workflow visualization

### 🏗️ Tier 3: High Effort (1-3 weeks each)

**All tracked in GitHub Issues #27-43**

| Issue                                               | Diagram Type              | Effort    | Priority     | Strategic Value          |
| --------------------------------------------------- | ------------------------- | --------- | ------------ | ------------------------ |
| [#27](https://github.com/jgreywolf/runiq/issues/27) | **C4 Architecture**       | 1-2 weeks | **CRITICAL** | 🔑 **Unlocks 10+ types** |
| [#28](https://github.com/jgreywolf/runiq/issues/28) | BPMN 2.0                  | 2-3 weeks | High         | Industry standard        |
| [#29](https://github.com/jgreywolf/runiq/issues/29) | Sankey                    | 1-2 weeks | Medium       | Data viz                 |
| [#30](https://github.com/jgreywolf/runiq/issues/30) | Roadmap Visualization     | 1-2 weeks | Medium       | Product planning         |
| [#31](https://github.com/jgreywolf/runiq/issues/31) | Wardley Map               | 2-3 weeks | Low          | Strategic planning       |
| [#32](https://github.com/jgreywolf/runiq/issues/32) | PERT Chart                | 1-2 weeks | Medium       | Project management       |
| [#33](https://github.com/jgreywolf/runiq/issues/33) | Sequential Function Chart | 1-2 weeks | Medium       | Industrial automation    |
| [#34](https://github.com/jgreywolf/runiq/issues/34) | Tiers Diagram             | 1 week    | Low          | Architecture viz         |
| [#35](https://github.com/jgreywolf/runiq/issues/35) | Deployment Diagram+       | 1 week    | Medium       | DevOps                   |
| [#36](https://github.com/jgreywolf/runiq/issues/36) | Hierarchy Diagram+        | 1 week    | Medium       | Org structures           |
| [#37](https://github.com/jgreywolf/runiq/issues/37) | Radar/Spider Chart        | 1 week    | Low          | Data viz                 |
| [#38](https://github.com/jgreywolf/runiq/issues/38) | Structural Equation Model | 2-3 weeks | Low          | Academic research        |
| [#39](https://github.com/jgreywolf/runiq/issues/39) | Event Modeling            | 1-2 weeks | Medium       | DDD/Event sourcing       |
| [#40](https://github.com/jgreywolf/runiq/issues/40) | Railroad Diagram          | 1-2 weeks | Low          | Grammar/syntax viz       |
| [#41](https://github.com/jgreywolf/runiq/issues/41) | Unified Petri Nets        | 2-3 weeks | Low          | Formal methods           |
| [#42](https://github.com/jgreywolf/runiq/issues/42) | Transit Map               | 1-2 weeks | Low          | Public transport         |
| [#43](https://github.com/jgreywolf/runiq/issues/43) | Block Diagram+            | 1 week    | Medium       | Engineering              |

**Critical Path:**

- **Issue #27 (C4) FIRST** - Unlocks hierarchical containers for:
  - Architecture diagrams
  - Component hierarchies
  - Nested subsystems
  - BPMN pools/lanes
  - And 10+ other diagram types

### 🎓 Tier 4: Specialized (Variable effort)

**All tracked in GitHub Issues #44-46**

| Issue                                               | Diagram Type  | Effort | Use Case                     |
| --------------------------------------------------- | ------------- | ------ | ---------------------------- |
| [#44](https://github.com/jgreywolf/runiq/issues/44) | Venn Diagram+ | 1 week | Set theory, logic            |
| [#45](https://github.com/jgreywolf/runiq/issues/45) | Org Chart+    | 1 week | HR, management               |
| [#46](https://github.com/jgreywolf/runiq/issues/46) | Concept Maps  | 1 week | Education, knowledge mapping |

---

## 🏛️ Architecture Roadmap

### Core Systems (Stable)

- ✅ **ELK Layout Engine** - 5 algorithms (layered, force, stress, tree, radial)
- ✅ **Langium DSL Parser** - Extensible, type-safe parsing
- ✅ **SVG Renderer** - Production-ready
- ✅ **Container System** - Hierarchical nesting support
- ✅ **Export Formats** - LaTeX, Simulink, SPICE, Verilog

### Planned Enhancements

#### 1. Hierarchical Containers Enhancement (BLOCKED)

**Status:** ⏸️ Blocked by Issue #27 (C4 Architecture)  
**Why:** Need to implement C4 first to validate container improvements

**Requirements:**

- Nested container styling
- Cross-container edge routing
- Container-aware layout
- Collapse/expand functionality

**Enables:**

- C4 architecture diagrams
- BPMN pools/lanes
- UML package diagrams
- Deployment diagrams
- And 10+ other types

#### 2. Data-Driven Rendering

**Status:** 📋 Planned (no specific issue)  
**Effort:** 1-2 weeks

**Features:**

- JSON/CSV data sources
- Dynamic shape generation from data
- Template-based rendering
- Data binding to shape properties

**Enables:**

- Charts (pie, bar, line, radar)
- Data visualizations
- Dashboards
- Reports

#### 3. Advanced Layout Options

**Status:** 📋 Planned (covered in various issues)  
**Effort:** Ongoing

**Features:**

- Custom constraint-based layout
- Manual positioning override
- Snap-to-grid
- Alignment guides
- Distribution tools

**Enables:**

- Precise diagram control
- Professional formatting
- Consistency across diagrams

#### 4. Interactive Features (Editor App)

**Status:** 📋 Planned (no specific issue)  
**Effort:** 3-4 weeks

**Features:**

- Drag-and-drop shape placement
- Visual edge routing
- Real-time preview
- Undo/redo
- Zoom and pan

**Enables:**

- Visual editing experience
- Faster diagram creation
- User-friendly interface

---

## 📚 Documentation Roadmap

### Completed Documentation ✅

- ✅ API Reference (VitePress)
- ✅ Implementation guides for completed features
- ✅ Comprehensive GitHub issue templates (54 issues)

### Documentation Needs 📝

1. **User Guides** (planned)
   - Getting started tutorial
   - DSL syntax reference
   - Layout algorithm selection guide
   - Style customization guide
   - Export format guide

2. **Developer Guides** (planned)
   - Contributing guidelines
   - Shape implementation tutorial
   - Parser extension guide
   - Layout algorithm integration
   - Testing best practices

3. **Example Gallery** (planned)
   - Sample diagrams for each type
   - Industry-specific examples
   - Best practices showcase
   - Before/after comparisons

---

## 🧪 Quality & Testing Roadmap

### Current Test Coverage

- **Total Tests:** 728 passing
- **Core Library:** ~90% coverage
- **Shape Implementations:** ~80% coverage
- **DSL Parser:** ~95% coverage

### Testing Goals

1. **Maintain High Coverage**
   - Keep core logic >90%
   - All new shapes >80%
   - Parser >95%

2. **Visual Regression Testing** (planned)
   - Screenshot comparisons
   - SVG output validation
   - Layout consistency checks

3. **Performance Testing** (planned)
   - Large diagram benchmarks
   - Memory usage profiling
   - Rendering speed metrics

4. **Integration Testing** (planned)
   - End-to-end DSL parsing
   - Export format validation
   - Editor app workflows

---

## 🎨 Shape Library Roadmap

### Completed Shape Categories

- ✅ Flowchart basics (14 shapes)
- ✅ Network devices (7 shapes)
- ✅ Quantum gates (12 shapes)
- ✅ Pedigree/genealogy (3 shapes)
- ✅ UML basics (35+ shapes)

### Shape Priorities (Referenced in GitHub Issues)

**High Priority (from issues):**

- Pneumatic/hydraulic symbols (Issue #4) - 25 shapes
- P&ID symbols (Issue #14) - 60+ shapes
- Control systems (Issue #6) - 30+ shapes
- BPMN symbols (Issue #28) - 60+ shapes
- HVAC symbols (Issue #7) - 20 shapes

**Medium Priority:**

- Additional flowchart variants (various issues)
- Chart elements (Issues #10, #15, #37)
- Timeline components (Issue #11)

**Low Priority:**

- Specialized academic symbols
- Domain-specific icons
- Decorative elements

---

## 💼 Commercial & Industry Focus

### Target Industries

**Current Strong Support:**

- Software engineering (UML, flowcharts)
- Quantum computing (quantum circuits)
- Network engineering (topology diagrams)
- Genealogy (pedigree charts)

**High-Value Targets (via GitHub issues):**

1. **Process Industries** 💰💰💰💰💰
   - P&ID (Issue #14) - Chemical, oil & gas, pharma
   - BPMN (Issue #28) - Business process automation
2. **Manufacturing & Automation** 💰💰💰💰
   - Pneumatic/Hydraulic (Issue #4)
   - Control Systems (Issue #6)
   - Sequential Function Charts (Issue #33)

3. **Building & Infrastructure** 💰💰💰
   - HVAC (Issue #7)
   - Electrical systems (existing)

4. **Product & Project Management** 💰💰💰
   - Gantt charts (Issue #16)
   - Roadmap visualization (Issue #30)
   - Kanban boards (Issue #18)

### Market Positioning

**Compete With:**

- Lucidchart (general diagramming)
- Draw.io/diagrams.net (open source)
- Microsoft Visio (enterprise standard)
- PlantUML (text-based UML)
- Mermaid.js (text-based diagrams)

**Unique Value Propositions:**

1. **Code-first approach** - DSL for version control
2. **Comprehensive shape library** - 71+ shapes, expanding to 100+
3. **Advanced layout** - ELK with 5 algorithms
4. **Export flexibility** - LaTeX, Simulink, SPICE, Verilog
5. **Industry standards** - ISO, ISA, IEC compliance
6. **Quantum computing** - First-class quantum circuit support

---

## 📅 Suggested Implementation Timeline

### Q4 2025 (Current Quarter)

**Weeks 1-2: Quick Wins**

- [ ] Issue #1: Mindmap (4 hours)
- [ ] Issue #2: Circular Flow (6 hours)
- [ ] Issue #3: Graph Theory (1-2 days)
- [ ] Issue #9: User Journey (1-2 days)
- [ ] Issue #10: Pie Chart (1-2 days)
- [ ] Issue #11: Timeline (1-2 days)
- [ ] Issue #12: Quadrant Chart (1-2 days)

**Weeks 3-4: High-Value Engineering**

- [ ] Issue #4: Pneumatic/Hydraulic (2-3 days)
- [ ] Issue #6: Control Systems (2-3 days)
- [ ] Issue #7: HVAC (2-3 days)

**Weeks 5-8: Industry Standard**

- [ ] Issue #14: P&ID (3-4 days) - Highest value!
- [ ] Issue #16: Gantt Chart (3-5 days)
- [ ] Issue #18: Kanban (3-5 days)
- [ ] Issue #20: GitGraph (3-5 days)

### Q1 2026

**Month 1: Foundation for Advanced Features**

- [ ] Issue #27: C4 Architecture (1-2 weeks) - CRITICAL!
- [ ] Hierarchical container enhancements
- [ ] Testing and documentation

**Month 2-3: Advanced Diagrams**

- [ ] Issue #28: BPMN 2.0 (2-3 weeks)
- [ ] Issue #29: Sankey (1-2 weeks)
- [ ] Issue #30: Roadmap Visualization (1-2 weeks)
- [ ] Issue #32: PERT Chart (1-2 weeks)

### Q2 2026 & Beyond

**Remaining Tier 2 & 3:**

- UML Timing, XY Chart, Treemap
- Packet Diagram, Requirement, Mindmap+
- Ishikawa, Causal Loop, Threat Modeling
- Wardley Map, SFC, Tiers, Deployment
- Hierarchy, Radar, SEM, Event Modeling
- Railroad, UPN, Transit, Block+

**Tier 4 Specialized:**

- Venn+, Org Chart+, Concept Maps

**Stretch Goals:**

- Visual editor enhancements
- Collaboration features
- Cloud storage integration
- Plugin system

---

## 🔗 Reference Links

### Project Resources

- **GitHub Repository:** https://github.com/jgreywolf/runiq
- **GitHub Issues:** https://github.com/jgreywolf/runiq/issues
- **Documentation Site:** (VitePress - local)

### Related Documentation Files

**Planning & Research:**

- `GITHUB-ISSUES-TEMPLATES.md` - Full templates for all 46 diagram type issues
- `ISSUES-READY-SUMMARY.md` - Executive summary of all issues
- `ISSUES-CHECKLIST.md` - Quick reference checklist

**Implementation Guides:**

- `ELECTRICAL-COMPLETE.md` - Electrical circuit implementation guide
- `BLOCK-DIAGRAM-IMPLEMENTATION.md` - Block diagram implementation guide
- `hierarchical-containers-design.md` - Container system design and architecture

### Issue Templates & Scripts

**In `scripts/` directory:**

- `create-all-issues.bat` - Batch script (successfully created all 46 issues)
- `create-issues.sh` - Bash version (Linux/Mac)
- `create-issues.ps1` - PowerShell versions (reference)
- `README.md` - Script usage guide

**CSV Import:**

- `docs/github-issues-bulk-import.csv` - Bulk import format (alternative method)

---

## 📊 Metrics & Goals

### Current Metrics

- **Shapes:** 71 implemented
- **Tests:** 728 passing
- **Test Coverage:** 85-95% across packages
- **Bundle Size:** ~95 KB
- **Diagram Types Fully Supported:** 12+
- **GitHub Issues Open:** 54 (46 diagram types + 8 infrastructure/features)

### 2026 Goals

**By End of Q1 2026:**

- 100+ shapes
- 15+ fully supported diagram types
- 1000+ tests passing
- All Tier 1 issues completed (12 types)
- C4 Architecture implemented (unlocks Tier 3)

**By End of Q2 2026:**

- 150+ shapes
- 25+ fully supported diagram types
- All Tier 2 issues completed (14 types)
- BPMN 2.0 support
- 50% of Tier 3 completed

**By End of 2026:**

- 200+ shapes
- 40+ fully supported diagram types
- All 46 GitHub issues resolved
- Visual editor beta release
- Public documentation site

---

## 🎯 Success Criteria

### Feature Completeness

- ✅ Core flowcharting (complete)
- ✅ UML diagrams (core complete, extensions in progress)
- ✅ Network diagrams (complete)
- ✅ Quantum circuits (complete)
- ✅ Pedigree charts (complete)
- 🔄 Engineering diagrams (in progress - Issues #4, #6, #7, #14)
- 🔄 Project management (in progress - Issues #16, #18, #30)
- 🔄 Business process (planned - Issue #28)
- 🔄 Architecture (planned - Issue #27)

### Quality Metrics

- ✅ Test coverage >85%
- ✅ Zero critical bugs
- ✅ Build succeeds
- ✅ TypeScript strict mode
- 🔄 Performance benchmarks
- 🔄 Visual regression tests
- 🔄 Accessibility compliance

### User Adoption

- 🔄 Documentation completeness
- 🔄 Example gallery
- 🔄 Tutorial series
- 🔄 Community engagement
- 🔄 Industry validation

---

## 🚧 Known Limitations & Technical Debt

### Current Limitations

1. **No Hierarchical Container Enhancements** (Issue #27)
   - Basic containers work
   - Need collapse/expand, styling, cross-container routing
   - Blocks 10+ diagram types

2. **Limited Data Visualization**
   - No built-in charting (Issues #10, #15, #37)
   - No data binding yet
   - Manual data entry only

3. **Editor UX Needs Work**
   - Text-based only (by design)
   - No visual drag-and-drop (planned)
   - No real-time collaboration

### Technical Debt

1. **Test Coverage Gaps**
   - Some edge cases not covered
   - Visual regression testing needed
   - Performance benchmarks needed

2. **Documentation Gaps**
   - User guides incomplete
   - API reference needs expansion
   - Example gallery needed

3. **Code Organization**
   - Some large files need splitting
   - Consistent naming conventions needed
   - Better type safety in some areas

---

## 📝 Notes & Decisions

### Architectural Decisions

1. **ELK over Dagre** (Oct 2025)
   - Superior algorithm quality
   - Better performance
   - More layout options
   - Active maintenance

2. **Langium over PEG.js** (2025)
   - Better TypeScript integration
   - LSP support
   - Maintainability
   - Extensibility

3. **Code-First Approach**
   - Version control friendly
   - Automation-friendly
   - Reproducible
   - Programmable

4. **GitHub Issues for Feature Tracking**
   - Single source of truth
   - Community visibility
   - Structured discussion
   - Progress tracking

### Priority Decisions

1. **Engineering Diagrams First**
   - High industry value
   - Differentiation from competitors
   - Leverage existing electrical circuit code
   - Clear standards (ISO, ISA, IEC)

2. **C4 Before BPMN**
   - C4 unlocks hierarchical features
   - Needed for 10+ other types
   - Simpler implementation than BPMN
   - Strategic foundation

3. **Quick Wins Parallel to Long-Term**
   - Maintain momentum
   - Regular releases
   - User value delivery
   - Balance innovation with utility

---

## 🎉 Conclusion

Runiq is on track to become a comprehensive, code-first diagramming solution with unique strengths in:

- **Quantum computing visualization**
- **Engineering diagrams** (electrical, pneumatic, hydraulic, P&ID)
- **Network topology**
- **Software architecture** (UML, C4, BPMN)
- **Project management** (Gantt, roadmap, Kanban)

With **46 diagram types planned** and **71 shapes already implemented**, the roadmap is clear and achievable. The focus on industry standards, code reuse, and strategic architecture decisions (like C4 first) ensures efficient development and high-quality results.

**Next Steps:**

1. Start with Issue #1 (Mindmap) - 4 hours
2. Move to Issue #4 (Pneumatic/Hydraulic) - 2-3 days, high ROI
3. Tackle Issue #14 (P&ID) - 3-4 days, highest industry value

Let's build the future of code-first diagramming! 🚀

---

**For specific diagram type implementations, see [GitHub Issues #1-46](https://github.com/jgreywolf/runiq/issues)**

**For detailed implementation templates, see [`GITHUB-ISSUES-TEMPLATES.md`](./GITHUB-ISSUES-TEMPLATES.md)**
