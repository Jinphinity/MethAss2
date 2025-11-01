# Question 1 — Liar’s Dice (Bot Improvement & Evaluation)

You’ll receive [a browser-only tournament runner and four starter bots](https://mycanvas.mohawkcollege.ca/courses/122969/files/24563516?wrap=1 "liars_dice-202535_002.zip") [Download a browser-only tournament runner and four starter bots](https://mycanvas.mohawkcollege.ca/courses/122969/files/24563516/download?download_frd=1)[Open this document with ReadSpeaker docReader](https://docreader.readspeaker.com/docreader/?cid=7118&lang=en_us&url=https%3A%2F%2Finst-fs-yul-prod.inscloudgate.net%2Ffiles%2Fd82e7e6d-1507-47b6-b27d-3f95652d87e6%2Fliars_dice-202535_002.zip%3Ftoken%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NjE4OTI0MTUsInVzZXJfaWQiOm51bGwsInJlc291cmNlIjoiL2ZpbGVzL2Q4MmU3ZTZkLTE1MDctNDdiNi1iMjdkLTNmOTU2NTJkODdlNi9saWFyc19kaWNlLTIwMjUzNV8wMDIuemlwIiwiaG9zdCI6bnVsbCwianRpIjoiZGFhYzZkNGItNWVhZC00MjY5LTg3NTMtMGM5MTI2OGZlZDVkIiwiZXhwIjoxNzYxOTc4ODE1fQ.po_PTCXdjFSAmyneLWHoK3N9iLemBoPHR79X1E_XeNnh0CQB3cc4oj5cqC2W-BBydAaoyUZso2vmH0v7Uh4-Ig "Open this document with ReadSpeaker docReader")in `/bots/`:  `Baseline.js`, `ProbabilityTuned.js`, `MomentumAdaptive.js`, `AggroBluffer.js`.

**Your task:** Create **your own bot** (a single `.js` file) that **beats the starters** under fixed, reproducible conditions. You’ll run five scenarios and report the results. Note that the first line is a comment that names your bot.

You may use GPT or other tools, but you **must** acknowledge usage and paste the exact prompts in your report. Put a **statement of authorship** (name + student number) at the top of your bot file and report.

### Submission:

- Submit to Canvas **by due date** (late penalties per course policy). You may also use the GitHub classroom assignment for early peeks towards your bonus standing.
    
- **Every code file must end with `.txt`** (e.g., `myBot.js.txt`).
    
- Include **statement of authorship** (name + student number) in a comment near the top of each file.
    
- Code that fails to run or has significant runtime errors or that fails to meet the requirements will be graded as **0**.
    

---

## Experiments you must run (5 scenarios, 5-player tables)

Use the tournament page exactly as provided. For each scenario you will play 2500 rounds with seed 10185 (to make the results deterministic). Each table will have your bot, plus 4 opponents. To fill the table you will need to make copies of the bots provided. To smooth out positional advantage the game will shuffle the seats after each round.

Using FAST simulate on is recommended, 2500 games should take less than 1 minute.

**Scenarios:**

- - You vs **4× Baseline**
        
    - You vs **4× ProbabilityTuned**
        
    - You vs **4× MomentumAdaptive**
        
    - You vs **4× AggroBluffer**
        
    - **Mixed table:** 1× each starter + you
        

**Record the final result for your bot** for each scenario (a table is recommended). We grade using **Avg TS** (Tournament Score per game). This is what the table looks like, if your bot was "Aggro Bluffer" you'd note the Average TS of 47.26.

![image.png](https://mycanvas.mohawkcollege.ca/courses/122969/files/24563389/preview)

---

## **Scoring (per scenario)**

`BestBaseTS` = **highest Avg TS among the four starter bots** at that scenario (from your run) (above it would be 59.70)

`MyAvgTS` = your bot’s Avg TS at that scenario. (of course, we don't have a bot in the above, so no example)

`Δ = MyAvgTS − BestBaseTS`.

|Condition on Δ (Avg TS − BestBaseTS)|Points|
|---|---|
|Δ ≥ **+4.00**|8|
|**+2.00 ≤ Δ < +4.00**|6|
|**+0.75 ≤ Δ < +2.00**|4|
|**+0.25 ≤ Δ < +0.75**|2|
|Δ < **+0.25**|0|

## Bonus (class tournament) — up to **+20** marks

There will be a round robin tournament run from all the submitted bots. All bots submitted that outscore the starter bots are automatically eligible. Your bonus mark will be the percentile of your score * 20. E.g. if you had one of the best scores in the class, landing in the 90th percentile you would get 20 * 90% = 18.

You may use the Github Classroom assignment submitter to get an early access sneak peek at your bonus mark. Details to follow in the announcements.

---

## Fair-Play Policy

To earn scenario points, your bot must satisfy **all** of:

1. **Original strategy:** Not a superficial rename/constant-tweak of any starter. You may use any elements of the starter bots as part of your bot, but must note the code's origin. The choice of elements and their weight in the bot's decision making is a key outcome, so there is no penalty for using parts of the code. It was provided to help you focus on the critical thinking over grinding out the mathematical ideas, but it's important that you don't just submit the starter code.
    
2. **Determinism:** Given the fixed seed (`10185`) and runner, the bot’s decisions must be reproducible. Do not rely on a random number generator internal to your bot.
    
3. **Performance discipline:** No timeouts (>200ms per move). Timeouts count as automatic **“liar”** and will crush your results.
    
4. **Design notes:** Your report must explain what you changed and **why it should outperform** the baseline logic (signal processing, opponent modeling, threshold logic, bluff policy, call policy, etc.).
    
    - If your code changes are modest _but_ your reasoning is tight and testable, you can still receive marks for the analysis.
        
5. **No DOM/network use:** Bots run in **Web Workers** (no DOM, no network). You must not attempt to escape the sandbox. The starter code was not meant to be industrial strength casino code. Direct any questions about fair play to me via email.
    

---

## What to hand in

**Files (with `.txt` extension):**

- `yourBot.js.txt` (your single bot file; authorship header required)
    
- `A2_Report.pdf` or other reasonable word processor format (your results & notes; name and student number and date required)
    

**A2_Report must include (use this template):**

### A. Method (1–2 pages)

- Your bot’s **strategy** (what changed vs. which starter, and why).
    
- Your **call policy** (when to call LIAR) and **raise policy** (how you increase Q/F).
    
- Any **opponent modeling** or **seat-position heuristics**.
    

This does not have to be a massive mathematical proof of your strategy. Just walk through your reasoning.

### B. Reproducible runs (5 tables)

For each scenario, paste the final results table and write:

- `BestBaseTS`, `MyAvgTS`, `Δ`, **points awarded from the band**.
    
- Confirmed settings: **Seed=10185**, **Rounds=2500**, **Max players=5**, **FAST**=on.
    

> Example snippet per scenario (fill with your numbers):  
> • BestBaseTS = 63.12 (MomentumAdaptive)  
> • MyAvgTS = 66.08 → Δ = +2.96 → **Silver = 6 pts**.

### C. Brief discussion (5–10 lines)

- Key insight(s). What helped most? What didn’t? Any trade-offs you discovered?
    

---

## Marking scheme (**40 base + 20 write up + up to 20 bonus**)

- note that in order for all the assignments to be weighted the same, the above will be scaled to be /100 not /60.

## Quick “How to run” checklist (students)

1. Copy `yourBot.js` into `/bots/` (then rename to `yourBot.js.txt` for submission).
    
2. In the page: pick **your bot + 4 opponents** as per scenario.
    
3. Set **Rounds=2500**, **Seed=10185**, **Max Players=5**, **FAST** checked.
    
4. Click **Start**. When done, copy the **Overall Results** table into your report.
    
5. Repeat for all 5 scenarios (including the mixed table).
    

# Bot API (Worker) — Quick Spec

Your bot runs in a **Web Worker** sandbox (no DOM, no network).

For **each turn**, the tournament engine sends your worker a single message as JSON:

```
{
```

You must reply within **200 ms** with ONE of:

// Raise the bid (must be legal: increase quantity, OR same quantity & higher face)  
{ action: "raise", quantity: Q, face: F }

// Call LIAR on the current bid  
{ action: "liar" }

If you take too long or send an illegal raise, it’s treated as **LIAR** from you (which often hurts!).

---

## History quick reference (for “table personality”)

The `history` array lets you infer behavior without knowing real bot names.

Typical records:

- `action:"raise"` → `{actor:"P3", pos:2, quantity:Q, face:F, hand, turn}`
    
- `action:"liar"` → `{actor:"P1", pos:0, on:{quantity, face}}`
    
- `action:"resolution"` → `{claimTrue:Boolean, losers:["P2","P5", ...]}`
    
- `action:"resolution-illegal"` → like above, for an illegal raise auto-resolution
    

**Tips:**

- Count recent raises per `actor` to detect **aggression** by seat.
    
- Track how often a seat’s **LIAR calls** are correct.
    
- Track typical **raise deltas** (how fast quantity climbs) at this table.
    

IDs `P1..Pn` are **per-game only** and **match seat order**; they are reshuffled next game. You cannot (and should not try to) target named opponents across games.

A minimal bot template (called template.js) is provided. You must rename the file and change the bot name comment.