# AI Plan Specification: Liar's Dice Bot Development

**Project**: Mathematics Assignment 2 - Liar's Dice Bot Improvement & Evaluation
**Objective**: Create a superior bot that outperforms 4 starter bots across 5 test scenarios
**Due Date**: Per course schedule
**Success Criteria**: Achieve Δ ≥ +4.00 (8 points per scenario) for full marks
**MVP Target**: Δ ≥ +2.00 average (6 pts/scenario = 30/40 base) with stretch goals on easier scenarios

---

## 1. Project Analysis

### 1.1 Assignment Requirements

**Core Task** (from MethAss 2.md, line 5):
> "Create **your own bot** (a single `.js` file) that **beats the starters** under fixed, reproducible conditions."

**Testing Protocol** (line 22-24):
> "For each scenario you will play **2500 rounds with seed 10185** (to make the results deterministic). Each table will have your bot, plus 4 opponents."

**Scoring System** (line 49-53):
> "`BestBaseTS` = **highest Avg TS among the four starter bots** at that scenario... `Δ = MyAvgTS − BestBaseTS`"

**Performance Constraint** (line 79):
> "No timeouts (>**200ms per move**). Timeouts count as automatic **'liar'** and will crush your results."

**Determinism Requirement** (line 77):
> "Given the fixed seed (`10185`) and runner, the bot's decisions must be **reproducible**. Do not rely on a **random number generator internal to your bot**."

**Sandbox Constraint** (line 85):
> "Bots run in **Web Workers** (no DOM, no network). You must not attempt to escape the sandbox."

### 1.2 Starter Bot Analysis

| Bot | Strategy | Liar Threshold | Raise Threshold | Key Weakness |
|-----|----------|----------------|-----------------|--------------|
| **Baseline** | Conservative probability-based | 22% | 40% | Too conservative, predictable |
| **ProbabilityTuned** | Similar to Baseline | 22% | 40% | Nearly identical to Baseline |
| **MomentumAdaptive** | Dynamic thresholds based on bidding pace | 15%-28% | Variable | Limited momentum calculation |
| **AggroBluffer** | Aggressive bluffing | 12% | 30% (push limit) | Over-aggressive, predictable |

### 1.2 Code Reuse Policy (CRITICAL CLARIFICATION)

**Assignment Explicitly Permits Reusing Starter Code** (line 75):
> "You may use **any elements of the starter bots** as part of your bot, but **must note the code's origin**. The choice of elements and their weight in the bot's decision making is a key outcome, so **there is no penalty for using parts of the code**. It was provided to help you **focus on the critical thinking over grinding out the mathematical ideas**, but it's important that you don't just submit the starter code."

**What This Means**:
- ✅ **CAN reuse**: Probability calculations (binomTail, binomAtLeast), threshold logic, history tracking structures
- ✅ **CAN reuse**: Adaptive threshold mechanisms from MomentumAdaptive.js
- ✅ **CAN borrow**: Math functions and proven algorithms from any starter bot
- ❌ **CANNOT do**: Superficial rename or simple constant tweak of any starter bot
- ❌ **MUST DO**: Comment origin of borrowed code (e.g., "// From Baseline.js: binomTail calculation")
- ❌ **MUST DO**: Show original strategic combination/weighting that differentiates from starters

**Strategic Implication**: Rather than reimplementing probability math, focus effort on:
1. Opponent modeling (original)
2. Position-aware thresholds (original)
3. Strategic weighting of starter elements (original)

### 1.3 Competition Scenarios
1. **vs 4× Baseline** - Conservative opponents
2. **vs 4× ProbabilityTuned** - Conservative opponents
3. **vs 4× MomentumAdaptive** - Adaptive opponents
4. **vs 4× AggroBluffer** - Aggressive opponents
5. **Mixed Table** - 1× each starter + our bot (most challenging)

---

## 2. Strategic Framework

### 2.0 Critical Implementation Constraints

**Determinism Guarantee Strategy** (Assignment line 77):
> "Do not rely on a **random number generator internal to your bot**."

**Requirements**:
- ❌ **NO** `Math.random()` calls in decision logic
- ❌ **NO** probabilistic selection between equal-value options
- ✅ **DO** use deterministic game state (seed 10185 controls game randomness)
- ✅ **DO** base all decisions on: hand value, history, board state
- ✅ **DO** validate with multiple runs: Run same scenario 3×, verify identical decisions

**Worker API Compliance** (Assignment line 151-159):
> "Your bot runs in a **Web Worker** sandbox (no DOM, no network). You must reply within **200 ms** with ONE of: `{action:'raise', quantity:Q, face:F}` OR `{action:'liar'}`"

**Implementation Requirements**:
- Single `.js` file with `self.onmessage` handler
- Parse incoming game state JSON
- Return valid action object within 200ms
- No setTimeout/setInterval (blocks responses)
- No external dependencies or library imports
- No DOM access, no fetch/XMLHttpRequest

**Authorship Requirements** (Assignment line 7, 15):
> "Put a **statement of authorship** (name + student number) at the top of your bot file and report."

**File Submission Requirements** (Assignment line 13):
> "**Every code file must end with `.txt`** (e.g., `myBot.js.txt`)."

### 2.1 Core Competitive Advantages
1. **Multi-Factor Opponent Modeling** - Track individual player patterns
2. **Adaptive Threshold System** - Dynamic decision boundaries
3. **Position-Aware Strategy** - Leverage bidding position
4. **Counter-Strategy Engine** - Specific tactics per opponent type
5. **Risk-Calibrated Bluffing** - Strategic deception timing

### 2.2 Decision Engine Architecture

```
Input: Game State → [Opponent Model] → [Position Analysis] → [Probability Engine] → [Strategy Selection] → Output: Action
```

**Components**:
- **Opponent Tracker**: History-based player profiling
- **Probability Calculator**: Enhanced binomial calculations
- **Position Analyzer**: Round position and player count effects
- **Strategy Selector**: Adaptive tactical selection
- **Bluff Engine**: Strategic deception manager

---

## 3. Implementation Specification

### 3.1 Core Data Structures

```javascript
// Opponent modeling (observable metrics only - MVP approach)
const opponentProfiles = {
  [playerId]: {
    raiseFrequency: Number,      // % of turns they raise (vs call liar)
    avgRaiseDelta: Number,       // Average Q/F increment per raise
    liarCallRate: Number,        // % of turns they call liar
    liarSuccessRate: Number,     // % of liar calls that were correct (when resolved)
    lastNActions: Array          // Recent 5-10 actions for pattern detection
  }
}

// Dynamic thresholds
const adaptiveThresholds = {
  liarThreshold: Number,        // Current liar call threshold
  raiseThreshold: Number,       // Current raise threshold
  bluffThreshold: Number,       // Bluffing activation threshold (based on bid pace)
  positionModifier: Number      // Position-based adjustment
}
```

**MVP Rationale**: These metrics are **always observable** without requiring resolution events:
- `raiseFrequency`: Count raises vs liars from history every round
- `avgRaiseDelta`: Track Q/F increments in every raise
- `liarCallRate`: Count liar calls from history every round
- `liarSuccessRate`: Update only when resolution occurs (rare but reliable)
- `lastNActions`: Direct access to history array

### 3.1a Opponent Metrics Limitations (CRITICAL - Resolution Events are Rare)

**Tournament Engine Reality** (MethAss 2.md, lines 175-184, tournament.js:612-695):
> Resolution events (where `claimTrue` is revealed) only occur when:
> 1. A LIAR call is made (rare - ~15-25% of turns)
> 2. An illegal raise occurs (very rare)
> 3. Most raises end without any resolution event

**Impact on Opponent Modeling**:
- ❌ **CANNOT** reliably detect "bluff frequency" - most raises never get resolved
- ❌ **CANNOT** measure "true vs false claims" - insufficient resolution data
- ✅ **CAN** measure raise frequency (always observable)
- ✅ **CAN** measure bid acceleration (Q/F increments)
- ✅ **CAN** measure liar call frequency (always observable)
- ✅ **CAN** measure liar success rate (only when resolved, but reliable)

**MVP Solution: Use Bid Aggression as Proxy for Bluffing**

Instead of trying to detect bluffs, use observable bid behavior:
- **Conservative Player**: Low raise frequency (<60%), small increments (ΔQ=1-2)
- **Adaptive Player**: Variable patterns, changes with game momentum
- **Aggressive Player**: High raise frequency (>75%), large increments (ΔQ=3+)

This classification requires NO resolution data and works from round 1.

### 3.1b CRITICAL: Per-Game Opponent IDs (NOT Cross-Game)

**Assignment Line 195**:
> "IDs `P1..Pn` are **per-game only** and **match seat order**; they are **reshuffled next game**. You cannot (and should not try to) target named opponents across games."

**Impact on Opponent Modeling**:
- ❌ **CANNOT** build persistent profiles across games (each game has new P1-P5 assignments)
- ✅ **CAN** model within-game patterns (aggression, liar accuracy, raise frequency)
- ✅ **MUST** focus on FAST adaptation in first 10-20 rounds of each game
- ✅ **DO** reset all opponent profiles at the start of each new game

**Revised Opponent Modeling Strategy**:
- **Rounds 1-5**: Collect baseline data, use conservative defaults
- **Rounds 6-20**: Build confidence in player classifications (Conservative/Adaptive/Aggressive)
- **Rounds 21+**: Apply learned counter-strategies
- **Every new game**: Reset profiles, start over with same methodology

### 3.2 Key Algorithms

**Opponent Modeling Algorithm**:
```
1. Track all player actions and outcomes
2. Calculate aggression metrics per player
3. Identify bluffing patterns and frequencies
4. Assess LIAR call accuracy rates
5. Update player profiles after each round
```

**Adaptive Threshold Algorithm**:
```
1. Base thresholds on opponent composition
2. Adjust for table aggression level
3. Modify based on current position
4. Factor in personal hand strength
5. Apply game phase considerations (early/late)
```

**Position-Aware Strategy**:
```
1. Early position: Conservative, information gathering
2. Middle position: Balanced, reactive to trends
3. Late position: Aggressive, exploit gathered information
4. Final position: Risk-calibrated, end-game tactics
```

### 3.3 Counter-Strategy Matrix

| Opponent Type | Liar Threshold | Raise Strategy | Bluff Frequency |
|---------------|----------------|----------------|-----------------|
| Conservative (Baseline/PT) | 25% | Moderate aggression | Low (10%) |
| Adaptive (Momentum) | 20% | Match their pace | Medium (20%) |
| Aggressive (Bluffer) | 15% | Conservative raises | High (30%) |
| Mixed Table | Dynamic 15-25% | Opponent-specific | Variable 10-30% |

---

## 4. Performance Optimization

### 4.1 Parameter Tuning Strategy
1. **Initial Parameters**: Conservative baseline derived from starter bot analysis
2. **Iterative Testing**: Small parameter adjustments with performance feedback
3. **Scenario-Specific Tuning**: Optimize for each of the 5 test scenarios
4. **Cross-Validation**: Ensure improvements don't hurt other scenarios

### 4.2 Expected Performance Targets with Scoring Breakdown

**Scoring Formula** (Assignment lines 49-61):
> - Δ ≥ **+4.00** → **8 points**
> - **+2.00 ≤ Δ < +4.00** → **6 points**
> - **+0.75 ≤ Δ < +2.00** → **4 points**
> - **+0.25 ≤ Δ < +0.75** → **2 points**
> - Δ < **+0.25** → **0 points**

**Maximum possible base score**: 40 points (8 pts × 5 scenarios)

| Scenario | MVP Target Δ | Full Marks Δ | Target Points | Confidence | Strategy Focus |
|----------|--------------|--------------|---------------|------------|----------------|
| vs 4× Baseline | +2.0 | +4.0 | 8 pts (stretch) | High | Maximum aggression vs conservative |
| vs 4× ProbabilityTuned | +2.0 | +4.0 | 8 pts (stretch) | High | Maximum aggression vs conservative |
| vs 4× MomentumAdaptive | +2.0 | +3.0 | 6 pts (MVP) | Medium | Adaptive counter-play |
| vs 4× AggroBluffer | +1.5 | +2.5 | 6 pts (MVP) | Medium | Conservative raise policy |
| Mixed Table | +1.0 | +2.0 | 4 pts (MVP) | Low | Balanced multi-opponent approach |
| **REALISTIC TOTAL** | **+1.7 avg** | **+3.3 avg** | **32 pts base** | **Medium** | Achievable with MVP bot |

**Bonus Tournament** (Assignment lines 63-67):
> "There will be a round robin tournament... your bonus mark will be the percentile of your score * 20. E.g. if you had one of the best scores in the class, landing in the 90th percentile you would get 20 * 90% = 18."

**Maximum total score**: 40 base + 20 writeup + 20 bonus = 100 points

### 4.3 Risk Management
- **Fallback Strategies**: Graceful degradation if opponent modeling fails
- **Performance Monitoring**: Real-time strategy effectiveness tracking
- **Emergency Conservative Mode**: Switch to proven strategy if performance drops

---

## 5. Implementation Plan

### 5.1 Development Phases

**Phase 1: Foundation (30% effort)**
- Implement core probability calculations
- Create basic opponent tracking structure
- Establish adaptive threshold framework

**Phase 2: Intelligence (40% effort)**
- Develop opponent modeling algorithms
- Implement position-aware decision making
- Create counter-strategy selection logic

**Phase 3: Optimization (20% effort)**
- Tune parameters for each scenario
- Optimize performance and response time
- Validate deterministic behavior

**Phase 4: Testing & Documentation (10% effort)**
- Run all test scenarios and collect results
- Prepare technical report and documentation
- Final verification and submission preparation

### 5.2 Quality Assurance
- **Code Review**: Ensure clean, maintainable implementation
- **Performance Testing**: Verify <200ms response time requirement
- **Determinism Validation**: Confirm reproducible results with seed 10185
- **Edge Case Testing**: Handle unusual game states gracefully

---

## 6. Success Metrics

### 6.1 Primary Metrics
- **Tournament Score Delta**: Target +2.0 average across all scenarios
- **Win Rate**: Achieve >20% win rate in each scenario (vs 20% baseline)
- **Consistency**: Minimize variance in performance across runs

### 6.2 Secondary Metrics
- **Response Time**: Target <150ms average (200ms hard limit per Assignment line 79)
- **Code Quality**: Clean, documented, maintainable implementation
- **Strategy Robustness**: Graceful handling of unexpected situations

### 6.3 Bonus Objectives
- **Class Tournament**: Aim for top 25% performance for bonus marks
- **Innovation Points**: Novel strategies not seen in starter bots
- **Technical Excellence**: Superior code organization and documentation

---

## 7. Risk Assessment & Mitigation

### 7.1 Technical Risks
- **Complexity Creep**: Keep implementation focused and simple
- **Performance Issues**: Profile code and optimize bottlenecks
- **Determinism Failure**: Thoroughly test with fixed seed

### 7.2 Strategic Risks
- **Over-optimization**: Avoid overfitting to specific scenarios
- **Opponent Adaptation**: Ensure strategy remains effective if opponents change
- **Mixed Table Challenge**: Prepare for most difficult scenario

### 7.3 Mitigation Strategies
- **Modular Design**: Allow easy parameter adjustments
- **Fallback Logic**: Conservative backup strategies
- **Extensive Testing**: Validate across multiple runs and scenarios

---

## 8. Deliverables

### 8.1 Code Deliverable
- **File**: `AdvancedBot.js.txt`
- **Requirements**: Bot name comment, authorship header, clear documentation, <200ms response
- **Quality**: Clean, maintainable, well-commented code

**First Line Requirement** (Assignment line 5):
> "Note that the first line is a comment that names your bot."

**Required Format**:
```javascript
// BOT_NAME: AdvancedBot
// Authorship: [Your Name] (Student #[Number])
// Date: [Submission Date]
```

### 8.2 Documentation Deliverable
- **File**: `A2_Report.pdf` (Assignment line 96)
- **Content**: Must include 3 sections per Assignment lines 101-127

**Section A: Method (1-2 pages)** (Assignment lines 101-110):
> "Your bot's **strategy** (what changed vs. which starter, and why). Your **call policy** (when to call LIAR) and **raise policy** (how you increase Q/F). Any **opponent modeling** or **seat-position heuristics**. This does not have to be a massive mathematical proof of your strategy. Just walk through your reasoning."

**Section B: Reproducible Runs (5 tables)** (Assignment lines 112-123):
> "For each scenario, paste the final results table and write: `BestBaseTS`, `MyAvgTS`, `Δ`, **points awarded from the band**. Confirmed settings: **Seed=10185**, **Rounds=2500**, **Max players=5**, **FAST**=on."

**Section C: Brief Discussion (5-10 lines)** (Assignment line 125-127):
> "Key insight(s). What helped most? What didn't? Any trade-offs you discovered?"

**Additional Required Content** (Assignment line 7, 81):
> "You **must** acknowledge usage and paste the exact prompts in your report."
> "Your report must explain what you changed and **why it should outperform** the baseline logic."

### 8.3 Supporting Materials
- **Test Results**: Complete tournament results for all 5 scenarios
- **Performance Analysis**: Strategy effectiveness breakdown
- **Source Code**: Well-documented implementation with clear logic flow

---

## 9. Execution Timeline

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| Analysis & Planning | 10% | Complete starter bot analysis, finalize strategy |
| Core Implementation | 40% | Basic bot working, initial testing complete |
| Intelligence Layer | 30% | Opponent modeling, adaptive thresholds implemented |
| Optimization & Testing | 15% | Parameter tuning, full scenario testing |
| Documentation | 5% | Report completed, submission ready |

**Total Effort**: Estimated 15-20 hours for comprehensive implementation and testing

---

---

## 10. Fair Play Policy Compliance Checklist

**To earn scenario points, all 5 conditions must be met** (Assignment lines 73-86):

### ✅ Condition 0: Submission Format
**Assignment (line 5, 13)**:
> "Note that the first line is a comment that names your bot... **Every code file must end with `.txt`**"

**Verification**:
- [ ] First line is bot name comment (e.g., `// BOT_NAME: AdvancedBot`)
- [ ] Second line is authorship (e.g., `// Authorship: Name (Student #123)`)
- [ ] File extension is `.txt` (e.g., `AdvancedBot.js.txt`)
- [ ] File runs without syntax errors

### ✅ Condition 1: Original Strategy
**Assignment (line 75)**:
> "Not a superficial rename/constant-tweak of any starter. You may use any elements of the starter bots as part of your bot, but must note the code's origin... The choice of elements and their weight in the bot's decision making is a key outcome."

**Verification**:
- [ ] Code comments identify borrowed elements (e.g., "// From Baseline.js")
- [ ] Strategic weighting differs from any single starter
- [ ] Opponent modeling is original (not in any starter)
- [ ] Position-aware logic is original
- [ ] Not a simple constant tweak (thresholds 22% → 25% only)

### ✅ Condition 2: Determinism
**Assignment (line 77)**:
> "Given the fixed seed (`10185`) and runner, the bot's decisions must be reproducible. Do not rely on a random number generator internal to your bot."

**Verification**:
- [ ] No `Math.random()` calls in decision code
- [ ] All decisions are functions of: hand, history, board state
- [ ] Run same scenario 3× with seed 10185
- [ ] Verify identical moves at identical game states (move-by-move match)
- [ ] Document determinism validation in report

### ✅ Condition 3: Performance Discipline
**Assignment (line 79)**:
> "No timeouts (>200ms per move). Timeouts count as automatic **'liar'** and will crush your results."

**Verification**:
- [ ] Profile code with browser dev tools (Console.time)
- [ ] Target <150ms average, <200ms maximum
- [ ] Test with full 5-player table (worst case)
- [ ] Measure from message receipt to response
- [ ] Include performance metrics in report if >100ms observed

### ✅ Condition 4: Design Notes & Justification
**Assignment (line 81)**:
> "Your report must explain what you changed and **why it should outperform** the baseline logic (signal processing, opponent modeling, threshold logic, bluff policy, call policy, etc.)."

**Verification**:
- [ ] Section A explains all strategy changes
- [ ] Section A explains WHY each change improves performance
- [ ] Report shows measurable evidence (Δ values)
- [ ] Reasoning is "tight and testable" even if code changes are modest

### ✅ Condition 5: No Sandbox Escape
**Assignment (line 85)**:
> "Bots run in **Web Workers** (no DOM, no network). You must not attempt to escape the sandbox."

**Verification**:
- [ ] No `document` references
- [ ] No `window` references
- [ ] No `fetch` or `XMLHttpRequest` calls
- [ ] No `setTimeout`/`setInterval` for delayed responses
- [ ] Code is self-contained in single `.js` file

---

*This specification provides a comprehensive roadmap for developing a superior Liar's Dice bot that leverages advanced AI techniques to outperform existing implementations while meeting all assignment requirements.*