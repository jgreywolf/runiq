# Parser/Grammar System Evaluation for Runiq

**Date:** October 14, 2025  
**Current System:** Chevrotain 11.0.3  
**Candidates:** Chevrotain, Jison, Langium, ANTLR 4

## Executive Summary

This document evaluates four parser generator/parsing systems for the Runiq diagram DSL project, considering that **Mermaid.js is actively migrating from Jison/Langium to ANTLR** as their strategic choice for future diagram parsers.

### Quick Recommendation Matrix

| Criterion              | Chevrotain                 | Jison                  | Langium                    | ANTLR 4                  |
| ---------------------- | -------------------------- | ---------------------- | -------------------------- | ------------------------ |
| **TypeScript Native**  | ✅ Excellent               | ❌ No                  | ✅ Excellent               | ⚠️ Good (runtime)        |
| **LSP Integration**    | ❌ Manual                  | ❌ No                  | ✅ Built-in                | ⚠️ Possible              |
| **Performance**        | ✅ Blazing Fast            | ⚠️ Moderate            | ✅ Fast (Chevrotain-based) | ✅ Very Fast             |
| **Learning Curve**     | ⚠️ Moderate                | ✅ Easy (Bison-like)   | ⚠️ Moderate                | ⚠️ Steep                 |
| **Maintenance Status** | ⚠️ Last update 2 years ago | ❌ Stale (8 years)     | ✅ Active                  | ✅ Very Active           |
| **Community Size**     | Good (2.7M weekly)         | Declining (72K weekly) | Growing (1.3M weekly)      | Excellent (Used by 71K+) |
| **Mermaid Trajectory** | Not used                   | Being replaced         | Partially used             | **Future direction**     |

---

## 1. Chevrotain (Current)

### Overview

- **Type:** Embedded JavaScript parser toolkit
- **Version:** 11.0.3 (Apache 2.0 License)
- **Weekly Downloads:** 2,748,917
- **Last Publish:** 2 years ago ⚠️
- **GitHub:** https://github.com/chevrotain/chevrotain

### Strengths

#### ✅ **Performance Leader**

- "Several times faster than other JavaScript parsing libraries"
- Can compete with hand-crafted parsers
- Zero code generation overhead - direct JavaScript execution

#### ✅ **TypeScript-First Design**

- Native TypeScript implementation
- Built-in type declarations
- Full IDE support with autocomplete and type checking

#### ✅ **Developer Experience**

- **No build step required** - pure JavaScript DSL
- Debug with your favorite JavaScript debugger
- No external tools to install or learn
- Immediate feedback during development

#### ✅ **Current Investment**

- Already implemented in Runiq with full lexer + parser
- Team has learned the API
- 12.46 KB parser bundle size (small footprint)
- Working grammar with auto-node generation

#### ✅ **Proven Architecture**

- Clean separation of lexing and parsing
- Excellent error recovery (fault tolerant)
- Can generate syntax diagrams for documentation

### Weaknesses

#### ❌ **No Built-in LSP Support**

- Language Server Protocol features require manual implementation
- No auto-generation of IDE tooling
- More work for VS Code extension features like:
  - Semantic highlighting
  - Go-to-definition
  - Find references
  - Rename refactoring

#### ⚠️ **Maintenance Concerns**

- Last published **2 years ago** (2023)
- May be in maintenance-only mode
- Risk of becoming unmaintained over time

#### ⚠️ **Steeper Learning Curve**

- Requires understanding of LL(k) parsing
- More code to write vs. declarative grammars
- CST visitor pattern can be verbose

#### ⚠️ **Not Industry Standard**

- Jison/Yacc grammar is more universally known
- Grammar cannot be ported to other languages
- Limited ecosystem of tools

### Use Case Fit for Runiq

**Best For:**

- Projects prioritizing **raw performance**
- Teams comfortable with programmatic parsing
- When LSP features are secondary
- Building standalone CLI tools

**Concerns:**

- SvelteKit editor will need **manual LSP implementation**
- No future-proofing against Chevrotain abandonment
- Diverges from Mermaid.js trajectory

---

## 2. Jison

### Overview

- **Type:** Bison-style parser generator
- **Version:** 0.4.18 (MIT License)
- **Weekly Downloads:** 72,739 ⬇️ (declining)
- **Last Publish:** **8 years ago** ❌
- **GitHub:** https://github.com/zaach/jison

### Strengths

#### ✅ **Familiar Grammar Syntax**

- Yacc/Bison-compatible format
- Easy for developers with C/C++ parsing background
- Extensive Bison documentation applies

#### ✅ **Proven in Production**

- Used by Mermaid.js for years
- 12,600+ packages depend on it
- Battle-tested in complex scenarios

#### ✅ **Simple Mental Model**

- Grammar file → JavaScript parser (code generation)
- Bottom-up LR parsing (handles left-recursion well)
- Familiar to compiler engineers

### Weaknesses

#### ❌ **Effectively Abandoned**

- **Last update in 2017** (8 years ago)
- No TypeScript support
- No modern JavaScript features
- 138 open issues, 24 open PRs

#### ❌ **Mermaid is Migrating Away**

- Official deprecation notice in Mermaid docs:
  > "JISON grammars are deprecated in mermaid. Please use Langium instead."
  > "New diagrams with JISON grammars will not be accepted."
- Mermaid moving to **ANTLR** as strategic replacement

#### ❌ **Poor TypeScript Experience**

- Generated parsers are untyped JavaScript
- No type safety in grammar actions
- Requires `@ts-ignore` comments everywhere
- Manual type definition maintenance

#### ❌ **No LSP Support**

- No language server capabilities
- No IDE tooling generation
- Manual implementation required

#### ❌ **Build Complexity**

- Requires code generation step
- Separate lexer file (`.jisonlex`)
- Debugging generated code is painful

### Use Case Fit for Runiq

**Best For:**

- Legacy systems maintaining Bison compatibility
- Teams migrating from C/C++ parsers

**Deal-Breakers:**

- Project is **effectively dead**
- Going against industry trend (Mermaid dropping it)
- Poor TypeScript story
- No path to LSP features

**Recommendation:** ❌ **Do Not Choose** - Use a maintained alternative

---

## 3. Langium

### Overview

- **Type:** Language engineering framework with LSP support
- **Version:** 4.1.0 (MIT License)
- **Weekly Downloads:** 1,376,273
- **Last Publish:** 25 days ago ✅
- **Website:** https://langium.org/

### Strengths

#### ✅ **Built for VS Code**

- First-class Language Server Protocol support
- Native VS Code extension integration
- Eclipse Theia compatibility

#### ✅ **TypeScript-Native**

- Written in TypeScript, runs in Node.js
- Generates **typed AST definitions** from grammar
- Full type safety throughout

#### ✅ **Comprehensive Tooling**

- Automatic semantic highlighting
- Code completion
- Go-to-definition
- Find references
- Rename refactoring
- All come "for free" from grammar

#### ✅ **Proven by Mermaid**

- Mermaid.js actively using for **new diagrams**:
  - Architecture diagrams
  - Git Graph
  - Radar charts
  - Treemap
  - Pie charts
  - Packet diagrams
- Production-proven at scale

#### ✅ **Built on Chevrotain**

- Uses Chevrotain under the hood for parsing
- Inherits Chevrotain's performance
- "High performance by using Chevrotain—the blazing fast parser library—under the hood"

#### ✅ **Active Development**

- Published 25 days ago
- Backed by TypeFox and Eclipse Foundation
- Growing community
- Regular updates

#### ✅ **Declarative Grammar**

- Xtext-inspired grammar language
- Clean, concise syntax
- Lower barrier to entry than Chevrotain

#### ✅ **Extensibility**

- Override default implementations
- Custom TokenBuilder, Lexer, Parser, ValueConverter
- Dependency injection architecture

### Weaknesses

#### ⚠️ **Heavier Framework**

- More complex setup than raw Chevrotain
- Requires Langium CLI for code generation
- Larger learning curve for advanced features

#### ⚠️ **Build Step Required**

- Grammar → TypeScript generation step
- Not as "live" as Chevrotain's embedded DSL
- Build time added to development cycle

#### ⚠️ **Abstraction Overhead**

- More layers between grammar and parsing
- Harder to debug than direct Chevrotain
- Some magic behavior

#### ⚠️ **Mermaid is Moving Away**

- While Mermaid **currently uses** Langium for new diagrams
- Strategic direction is **ANTLR**
- Langium may be a transition technology

### Use Case Fit for Runiq

**Best For:**

- Building **language servers** and IDE extensions
- When **LSP features are critical** (which they are for Runiq!)
- TypeScript-first projects
- Need for semantic analysis

**Perfect Fit for Runiq:**

- SvelteKit editor needs LSP for Monaco integration ✅
- TypeScript monorepo ✅
- Want syntax highlighting, completion, validation ✅
- Already have Chevrotain parser (migration path exists) ✅

**Considerations:**

- Mermaid trending toward ANTLR (but still actively using Langium)
- May need future migration if following Mermaid's path

---

## 4. ANTLR 4

### Overview

- **Type:** LL(\*) parser generator
- **Version:** 4.13.2 (BSD-3-Clause License)
- **Used By:** 71,100+ repositories
- **GitHub Stars:** 18,400+
- **Website:** https://www.antlr.org/

### Strengths

#### ✅ **Industry Standard**

- Most widely used parser generator
- Lingua franca of language tools
- Extensive books, tutorials, courses

#### ✅ **Multi-Language**

- **10 target runtimes:**
  - Java, JavaScript, TypeScript ✅
  - Python, C++, C#, Go, Swift, Dart, PHP
- Grammar can be reused across languages
- Runiq grammar could compile to Python CLI, Go server, etc.

#### ✅ **Massive Grammar Library**

- **grammars-v4** repository has 200+ grammars
- SQL, JSON, GraphQL, Markdown, etc. all available
- Can reference/import existing grammars

#### ✅ **Mermaid's Strategic Choice**

- **ZenUML** in Mermaid already uses ANTLR
- Mermaid documentation indicates ANTLR migration:
  > "Mermaid is about to move things to antlr"
- Future-proof choice aligned with Mermaid roadmap

#### ✅ **Excellent Tooling**

- **ANTLRWorks** - visual grammar debugger
- Parse tree visualization
- Grammar profiling
- Test rig for rapid development

#### ✅ **Very Active**

- 361 contributors
- Regular releases (4.13.2 in Aug 2024)
- Strong community support

#### ✅ **TypeScript Runtime**

- Official TypeScript target
- Type definitions included
- Good npm integration

#### ✅ **Powerful Parsing**

- ALL(_) parsing algorithm (adaptive LL(_))
- Handles ambiguous grammars better
- Automatic error recovery
- Syntax error suggestions

### Weaknesses

#### ⚠️ **Java Dependency**

- ANTLR tool itself requires Java 11+
- Generation step needs JVM
- CI/CD must have Java runtime
- Not pure JavaScript/TypeScript workflow

#### ⚠️ **Steeper Learning Curve**

- More concepts to learn (visitor vs. listener, contexts)
- Grammar syntax is powerful but complex
- Debugging can be challenging

#### ⚠️ **Build Complexity**

- Requires code generation step
- Grammar → Parser/Lexer generation
- Must integrate ANTLR CLI into build process
- Slower iteration cycle than Chevrotain

#### ⚠️ **No Built-in LSP**

- Like Chevrotain and Jison, no LSP out-of-box
- Must manually implement language server
- More work than Langium for IDE features

#### ⚠️ **Larger Bundle Size**

- Generated parsers + ANTLR runtime is heavier
- May not matter for CLI, but consider for browser

#### ⚠️ **TypeScript Target Maturity**

- TypeScript support newer than Java/JavaScript
- Smaller community compared to Java target
- Some advanced features may lag

### Use Case Fit for Runiq

**Best For:**

- Building **production language tools**
- When **multi-language support** is valuable
- Industry-standard grammar is important
- Following **Mermaid's strategic direction**

**Considerations for Runiq:**

- Requires Java in development environment
- More complex build setup
- Manual LSP implementation needed (like Chevrotain)
- Future-proof choice if Mermaid adopts fully

---

## Detailed Comparison

### Performance Benchmarks

```
Speed (fastest to slowest):
1. Chevrotain - "Blazing fast", optimized JavaScript execution
2. ANTLR 4 - "Very fast", efficient C-like performance
3. Langium - Fast (built on Chevrotain)
4. Jison - Moderate, older code generation

Note: For Runiq's DSL complexity, all would be fast enough.
Performance difference matters at scale (1000s of diagrams).
```

### TypeScript Integration

| Feature       | Chevrotain   | Jison      | Langium               | ANTLR 4      |
| ------------- | ------------ | ---------- | --------------------- | ------------ |
| Written in TS | ✅ Yes       | ❌ No      | ✅ Yes                | ❌ No (Java) |
| TS Runtime    | ✅ Native    | ⚠️ Untyped | ✅ Full               | ✅ Good      |
| Typed AST     | ✅ Manual    | ❌ No      | ✅ **Auto-generated** | ⚠️ Partial   |
| IDE Support   | ✅ Excellent | ❌ Poor    | ✅ Excellent          | ✅ Good      |

**Winner:** Langium (auto-generates typed AST from grammar)

### LSP / IDE Features

| Feature             | Chevrotain | Jison  | Langium    | ANTLR 4 |
| ------------------- | ---------- | ------ | ---------- | ------- |
| LSP Built-in        | ❌ No      | ❌ No  | ✅ **Yes** | ❌ No   |
| Syntax Highlighting | Manual     | Manual | ✅ Auto    | Manual  |
| Completion          | Manual     | Manual | ✅ Auto    | Manual  |
| Go-to-Def           | Manual     | Manual | ✅ Auto    | Manual  |
| Diagnostics         | Manual     | Manual | ✅ Auto    | Manual  |

**Winner:** Langium (only one with built-in LSP)

### Maintenance & Community

| Metric        | Chevrotain  | Jison           | Langium         | ANTLR 4        |
| ------------- | ----------- | --------------- | --------------- | -------------- |
| Last Update   | 2 years ago | **8 years ago** | 25 days ago     | 2 months ago   |
| Weekly DL     | 2.7M        | 72K ⬇️          | 1.3M            | N/A (Java)     |
| GitHub Stars  | ~6K         | 4.4K            | ~4K             | **18.4K**      |
| Active Issues | Moderate    | Many stale      | Active          | Very active    |
| Backing       | SAP         | None            | TypeFox/Eclipse | University/OSS |

**Winner:** ANTLR 4 (most active, largest community)

### Developer Experience

```
Best DX (subjective):
1. Chevrotain - Live coding, no build step, immediate feedback
2. Langium - Declarative grammar, auto-tooling, but build step
3. ANTLR - Powerful tools, but Java dependency, complex
4. Jison - Simple but outdated, poor TypeScript experience
```

### Ecosystem Alignment

**Mermaid.js Timeline:**

1. **Past (2014-2023):** Jison for all diagrams
2. **Present (2024-2025):** Langium for new diagrams
3. **Future (2025+):** ANTLR migration planned

**Runiq Options:**

- **Follow Mermaid's past:** Jison ❌ (deprecated)
- **Follow Mermaid's present:** Langium ✅ (current best practice)
- **Follow Mermaid's future:** ANTLR 4 ✅ (strategic bet)
- **Chart own course:** Chevrotain ✅ (performance, simplicity)

---

## Migration Considerations

### From Chevrotain → Langium

**Effort:** Low-Medium (Langium uses Chevrotain under the hood)

**Process:**

1. Write Langium `.langium` grammar file
2. Grammar structure similar to Chevrotain rules
3. Reuse token definitions (mostly)
4. Get LSP features for free ✅

**Pros:**

- Keep Chevrotain performance
- Gain LSP tooling
- Relatively smooth migration

**Cons:**

- Add build step
- Learn Langium concepts

### From Chevrotain → ANTLR

**Effort:** Medium-High (different parsing paradigm)

**Process:**

1. Write ANTLR4 `.g4` grammar file
2. Different grammar syntax (LL vs Recursive Descent)
3. Rewrite AST construction
4. Setup Java-based build pipeline

**Pros:**

- Industry standard
- Multi-language future
- Align with Mermaid's direction

**Cons:**

- Java dependency
- No LSP out-of-box
- Significant rewrite

### From Chevrotain → Jison

**Effort:** N/A

**Recommendation:** ❌ **Don't do this** - project is dead

---

## Decision Framework

### Scenario 1: Prioritize LSP Features (Monaco Editor)

**Requirement:** SvelteKit editor needs syntax highlighting, completion, validation

**Best Choice:** **Langium**

**Rationale:**

- Only option with built-in LSP
- Proven by Mermaid for new diagrams
- TypeScript-native
- Uses Chevrotain under the hood (familiar)

### Scenario 2: Prioritize Long-Term Alignment with Mermaid

**Requirement:** Stay compatible with Mermaid.js ecosystem

**Best Choice:** **ANTLR 4**

**Rationale:**

- Mermaid's strategic direction
- Multi-language support (if Runiq expands)
- Industry standard
- Future-proof

### Scenario 3: Prioritize Development Speed & Simplicity

**Requirement:** Ship fast, minimize complexity

**Best Choice:** **Keep Chevrotain**

**Rationale:**

- Already working
- No build step
- Team knows it
- Fast iteration

### Scenario 4: Prioritize Community & Ecosystem

**Requirement:** Large community, extensive resources

**Best Choice:** **ANTLR 4**

**Rationale:**

- 18K+ GitHub stars
- 71K+ dependent repos
- Extensive documentation
- Huge grammar library

---

## Recommendation

### 🎯 Primary Recommendation: **Langium**

**Reasons:**

1. **LSP Requirements are Critical**
   - Runiq's SvelteKit editor **needs** Monaco LSP integration
   - Manual LSP implementation is expensive and error-prone
   - Langium provides this out-of-box

2. **TypeScript-Native**
   - Perfect fit for TS monorepo
   - Auto-generated typed AST
   - Excellent developer experience

3. **Proven by Mermaid**
   - Actively used in production
   - All new Mermaid diagrams use Langium
   - Demonstrates maturity

4. **Smooth Migration Path**
   - Built on Chevrotain (current system)
   - Can reuse much of existing knowledge
   - Incremental adoption possible

5. **Active Maintenance**
   - Updated 25 days ago
   - TypeFox + Eclipse backing
   - Growing community

**Migration Strategy:**

```
Phase 1: Add Langium grammar alongside Chevrotain (parallel)
Phase 2: Wire Langium parser to LSP service
Phase 3: Test Monaco editor integration
Phase 4: Remove Chevrotain parser
Phase 5: Expand grammar with validation rules
```

---

### 🥈 Alternative Recommendation: **ANTLR 4**

**When to Choose ANTLR Instead:**

1. **If LSP is secondary** - Can defer editor features
2. **If multi-language is valuable** - Want Python/Go/Rust runtimes
3. **If following Mermaid strictly** - Bet on their future direction
4. **If team has ANTLR experience** - Existing expertise

**Trade-offs:**

- ❌ Lose LSP out-of-box
- ❌ Add Java dependency
- ✅ Gain industry-standard grammar
- ✅ Future-proof with Mermaid

---

### ⚠️ **Do Not Choose: Jison**

**Reasons:**

- Unmaintained for 8 years
- Deprecated by Mermaid
- Poor TypeScript support
- No LSP capabilities
- No future

---

## Implementation Checklist

### If Choosing Langium:

- [ ] Install `langium` and `langium-cli`
- [ ] Create `packages/parser-langium/` directory
- [ ] Write `runiq.langium` grammar file
- [ ] Configure `langium-config.json`
- [ ] Generate parser with `langium generate`
- [ ] Implement custom `TokenBuilder` (for syntax like `->`)
- [ ] Implement `ValueConverter` for string handling
- [ ] Create LSP service module
- [ ] Wire to SvelteKit editor via Monaco
- [ ] Test syntax highlighting, completion, diagnostics
- [ ] Add validation rules for diagram types
- [ ] Update CLI to use Langium parser
- [ ] Remove Chevrotain dependency
- [ ] Update documentation

### If Choosing ANTLR:

- [ ] Install Java 11+ in development environment
- [ ] Install ANTLR4 tool
- [ ] Install `antlr4ts` npm package
- [ ] Create `Runiq.g4` grammar file
- [ ] Setup `antlr4ts-cli` in build process
- [ ] Generate TypeScript parser
- [ ] Implement visitor pattern for AST construction
- [ ] Integrate generated parser with CLI
- [ ] Test parsing of all diagram types
- [ ] Implement LSP manually (future)
- [ ] Update CI/CD to include Java
- [ ] Update documentation

### If Keeping Chevrotain:

- [ ] Accept no out-of-box LSP
- [ ] Plan manual LSP implementation
- [ ] Monitor Chevrotain maintenance status
- [ ] Consider community fork if needed
- [ ] Document grammar extensively
- [ ] Build custom IDE tooling

---

## Conclusion

**For Runiq**, the **Langium** path offers the best balance of:

- ✅ TypeScript-native development
- ✅ Built-in LSP for Monaco editor
- ✅ Production-proven by Mermaid
- ✅ Active maintenance
- ✅ Smooth migration from Chevrotain

**ANTLR** is a strong second choice if:

- Multi-language support is needed
- Strict Mermaid alignment is priority
- Java dependency is acceptable

**Chevrotain** can stay if:

- LSP is deferred
- Team wants simplest solution
- Development speed is critical

**Jison** should be avoided entirely due to abandonment.

---

## Next Steps

1. **Validate assumptions** - Prototype Langium with small subset of Runiq grammar
2. **Measure LSP needs** - How critical are Monaco features for launch?
3. **Evaluate Java** - Is JVM in CI/CD a blocker for ANTLR?
4. **Team consensus** - Present analysis to team, gather input
5. **Make decision** - Choose Langium vs ANTLR vs Keep Chevrotain
6. **Create spike** - 1-week proof-of-concept with chosen system
7. **Commit** - Full migration plan with milestones

---

**Document Version:** 1.0  
**Author:** GitHub Copilot  
**Last Updated:** October 14, 2025
