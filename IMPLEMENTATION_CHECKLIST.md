# AdvancedBot Implementation Checklist

## ✅ PHASE 1: SPECIFICATION (COMPLETE)

- [x] Analyzed assignment requirements (MethAss 2.md)
- [x] Created comprehensive specification (AI_Plan_Specification.md)
- [x] Fixed critical issues (success criteria, BOT_NAME requirement, bluff detection)
- [x] Verified all 5 fair-play conditions documented
- [x] Set realistic performance targets (MVP +1.7Δ, Stretch +3.3Δ)

## ✅ PHASE 2: IMPLEMENTATION (COMPLETE)

- [x] Created bot file: `AdvancedBot.js` (275 lines, fully commented)
- [x] Created submission copy: `AdvancedBot.js.txt` (.txt extension)
- [x] Implemented probability engine (from Baseline with attribution)
- [x] Implemented opponent modeling (original)
- [x] Implemented classification engine (original)
- [x] Implemented position awareness (original)
- [x] Implemented adaptive thresholds (original)
- [x] Implemented counter-strategy engine (original)
- [x] Verified Web Worker compliance (no DOM/network/timers)
- [x] Verified determinism (no Math.random())
- [x] Verified syntax (node -c passed)

## 🔲 PHASE 3: BEFORE TOURNAMENT TESTING

### Update Bot File with Your Details
- [ ] Open `/bots/AdvancedBot.js`
- [ ] Line 2: Replace `[Your Name]` with your actual name
- [ ] Line 2: Replace `[Number]` with your actual student number
- [ ] Save the file

### Copy to Tournament Runner
- [ ] Copy `/bots/AdvancedBot.js.txt` to tournament runner directory
- [ ] Verify file copied successfully
- [ ] Verify `.txt` extension preserved

## 🔲 PHASE 4: TOURNAMENT TESTING (5 SCENARIOS)

For each scenario, use settings:
- Seed: **10185** (deterministic)
- Rounds: **2500**
- Max Players: **5**
- FAST: **On**

### Scenario 1: You vs 4× Baseline
- [ ] Set table: AdvancedBot + 4× Baseline.js
- [ ] Run tournament
- [ ] Record Avg TS from results table
- [ ] Save screenshot or copy table

### Scenario 2: You vs 4× ProbabilityTuned
- [ ] Set table: AdvancedBot + 4× ProbabilityTuned.js
- [ ] Run tournament
- [ ] Record Avg TS from results table
- [ ] Save screenshot or copy table

### Scenario 3: You vs 4× MomentumAdaptive
- [ ] Set table: AdvancedBot + 4× MomentumAdaptive.js
- [ ] Run tournament
- [ ] Record Avg TS from results table
- [ ] Save screenshot or copy table

### Scenario 4: You vs 4× AggroBluffer
- [ ] Set table: AdvancedBot + 4× AggroBluffer.js
- [ ] Run tournament
- [ ] Record Avg TS from results table
- [ ] Save screenshot or copy table

### Scenario 5: Mixed Table
- [ ] Set table: AdvancedBot + 1× Baseline + 1× ProbabilityTuned + 1× MomentumAdaptive + 1× AggroBluffer
- [ ] Run tournament
- [ ] Record Avg TS from results table
- [ ] Save screenshot or copy table

## 🔲 PHASE 5: CALCULATE RESULTS

For each scenario:
- [ ] Identify BestBaseTS (highest Avg TS among 4 starters)
- [ ] Identify MyAvgTS (your bot's Avg TS)
- [ ] Calculate Δ = MyAvgTS - BestBaseTS
- [ ] Determine points from band:
  - Δ ≥ +4.00 → 8 points
  - +2.00 ≤ Δ < +4.00 → 6 points
  - +0.75 ≤ Δ < +2.00 → 4 points
  - +0.25 ≤ Δ < +0.75 → 2 points
  - Δ < +0.25 → 0 points

## 🔲 PHASE 6: CREATE REPORT (A2_Report.pdf)

### Title Page
- [ ] Title: "Liar's Dice Bot - AdvancedBot"
- [ ] Your Name
- [ ] Student Number
- [ ] Date

### Section A: Method (1-2 pages)
- [ ] Explain bot strategy (multi-factor opponent modeling)
- [ ] Explain call policy (when to call LIAR based on adaptive thresholds)
- [ ] Explain raise policy (minimal legal raises meeting probability target)
- [ ] Explain opponent modeling approach (raiseFrequency, avgRaiseDelta, liarCallRate, liarSuccessRate)
- [ ] Explain position-aware heuristics (early/late position adjustments)
- [ ] Explain why strategy should outperform:
  - vs Baseline: Per-opponent profiling vs static threshold
  - vs ProbabilityTuned: Same improvements as Baseline
  - vs MomentumAdaptive: Per-opponent + position vs only table momentum
  - vs AggroBluffer: Counter-strategy vs fixed aggressive

### Section B: Reproducible Runs (5 tables)
For each scenario (copy from tournament runner):
- [ ] Paste complete results table
- [ ] Write: `BestBaseTS = X.XX (Bot Name)`
- [ ] Write: `MyAvgTS = Y.YY`
- [ ] Write: `Δ = Y.YY - X.XX = +Z.ZZ`
- [ ] Write: `Points = N (from band)`
- [ ] Confirm: Seed=10185, Rounds=2500, Max=5, FAST=on

**Example snippet**:
```
Scenario 1: You vs 4× Baseline
Results table: [copy from tournament]
BestBaseTS = 59.70 (Baseline)
MyAvgTS = 62.66
Δ = 62.66 - 59.70 = +2.96
Points = 6 (Silver band: +2.00 ≤ Δ < +4.00)
Settings: Seed=10185, Rounds=2500, Max=5, FAST=on
```

### Section C: Discussion (5-10 lines)
- [ ] What helped most? (opponent modeling, position awareness, counter-strategies)
- [ ] What didn't? (any surprises or limitations discovered)
- [ ] Any trade-offs discovered? (simplicity vs accuracy, MVP approach)
- [ ] Key insights? (which opponent types easiest/hardest to beat)

### AI Tool Acknowledgment
- [ ] List tools used: Claude Code, AI_Plan_Specification
- [ ] List prompts or describe usage
- [ ] Example:
```
AI Tool Acknowledgment:
- Claude Code used for bot implementation
- AI_Plan_Specification used for strategic planning
- Key prompts: [describe the main guidance given]
```

## 🔲 PHASE 7: SUBMISSION (TO CANVAS)

### Files to Submit
- [ ] `AdvancedBot.js.txt` (bot file with .txt extension)
- [ ] `A2_Report.pdf` (or Word format if preferred)

### Pre-Submission Checklist
- [ ] Bot file syntax verified (node -c)
- [ ] Bot file has BOT_NAME on first line
- [ ] Bot file has authorship with your name and student #
- [ ] Bot file has .txt extension
- [ ] Report has title page with name, student #, date
- [ ] Report has Section A (Method, 1-2 pages)
- [ ] Report has Section B (5 result tables with Δ calculations)
- [ ] Report has Section C (Discussion, 5-10 lines)
- [ ] Report has AI Tool Acknowledgment section
- [ ] All files organized in Canvas submission folder

### Final Submission
- [ ] Upload AdvancedBot.js.txt to Canvas
- [ ] Upload A2_Report.pdf to Canvas
- [ ] Verify files uploaded successfully
- [ ] Note submission time (check for late penalties)

---

## Expected Outcomes

**MVP Target**: +1.7Δ average → **28/40 base points**
**Stretch Goal**: +3.3Δ average → **36-40/40 base points**
**Writeup**: **20/20 points** (with comprehensive Section A/B/C)
**Total**: **48-60/60 points** (scales to **80-100/100** after weighting)
**Bonus**: Up to +20 points from class tournament (percentile based)

---

## Questions or Issues?

If bot doesn't run:
1. Check Web Worker compliance (no DOM/network)
2. Check JavaScript syntax (node -c)
3. Verify message handler: `self.onmessage = (e) => { ... }`
4. Check response format: `{ action: 'raise'|'liar', quantity?: Q, face?: F }`

If performance is slow (<150ms target):
1. Profile with browser dev tools (Console.time)
2. Check for loops >20 iterations (all history windows capped at 20)
3. Check for recursive calls (none in current implementation)
4. Optimize opponent profile lookups if needed

---

**Status**: Ready for Phase 3 (Update bot file with your details)
**Timeline**: Phase 3-7 should take ~4-6 hours total
