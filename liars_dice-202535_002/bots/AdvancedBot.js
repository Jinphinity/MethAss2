// BOT_NAME: AdvancedBot
// Authorship: [Your Name] (Student #[Number])
// Date: 2025-10-31
//
// Strategy: Multi-factor opponent modeling with adaptive thresholds
// - Tracks opponent bid patterns and liar accuracy (observable metrics only)
// - Adjusts thresholds based on opponent classification (Conservative/Adaptive/Aggressive)
// - Applies position-aware modifiers (early vs late position in round)
// - Counter-strategies: conservative raises vs aggressive, match pace for adaptive
//
// Reused from Baseline.js: binomPMF, binomTail, probabilityAtLeast (with attribution)
// Original additions: opponent profiling, position awareness, adaptive thresholds

const FACE_PROB = 1/6;
const OPENING_CAP_FRAC = 0.70;

// ============================================================================
// PROBABILITY ENGINE (From Baseline.js - with attribution)
// ============================================================================

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

function binomPMF(n, k, p) {
  if (k < 0 || k > n) return 0;
  let coeff = 1;
  for (let i = 1; i <= k; i++) coeff = coeff * (n - (k - i)) / i;
  return coeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function binomTail(n, k, p) {
  if (k <= 0) return 1;
  if (k > n) return 0;
  let term = binomPMF(n, k, p), sum = term;
  for (let x = k + 1; x <= n; x++) {
    term = term * ((n - (x - 1)) / x) * (p / (1 - p));
    sum += term;
    if (term < 1e-12) break;
  }
  return clamp01(sum);
}

function probabilityAtLeast(face, qty, myFaceCounts, unknownDiceCount) {
  const mySupport = myFaceCounts[face] || 0;
  const needFromUnknown = Math.max(0, qty - mySupport);
  return binomTail(unknownDiceCount, needFromUnknown, FACE_PROB);
}

// ============================================================================
// OPPONENT MODELING (MVP: Observable metrics only)
// ============================================================================

const opponentProfiles = {};

function initOpponentProfile(playerId) {
  opponentProfiles[playerId] = {
    raiseCount: 0,        // Total raises made
    liarCount: 0,         // Total liar calls made
    liarSuccesses: 0,     // When liar call resolved as correct
    totalRaiseDelta: 0,   // Sum of (Q - prevQ) increments
    raiseDeltaCount: 0,   // Count of raises for averaging
    lastActions: []       // Recent 10 actions
  };
}

function updateOpponentMetrics(playerId, action, prevQty, newQty) {
  if (!opponentProfiles[playerId]) initOpponentProfile(playerId);
  const profile = opponentProfiles[playerId];

  if (action === 'raise') {
    profile.raiseCount++;
    const delta = newQty - prevQty;
    profile.totalRaiseDelta += delta;
    profile.raiseDeltaCount++;
    profile.lastActions.push({ action: 'raise', delta: delta });
  } else if (action === 'liar') {
    profile.liarCount++;
    profile.lastActions.push({ action: 'liar' });
  }

  // Keep only last 10 actions
  if (profile.lastActions.length > 10) {
    profile.lastActions.shift();
  }
}

function classifyOpponent(playerId) {
  if (!opponentProfiles[playerId]) return 'conservative';
  const profile = opponentProfiles[playerId];

  const totalActions = profile.raiseCount + profile.liarCount;
  if (totalActions < 3) return 'conservative'; // Not enough data, assume conservative

  const raiseFreq = profile.raiseCount / totalActions;
  const avgDelta = profile.raiseDeltaCount > 0 ? profile.totalRaiseDelta / profile.raiseDeltaCount : 1;

  // Classification thresholds (from 3.1a MVP approach)
  if (raiseFreq > 0.75 && avgDelta > 2.5) return 'aggressive';
  if (raiseFreq < 0.60 && avgDelta < 1.5) return 'conservative';
  return 'adaptive';
}

// ============================================================================
// POSITION AWARENESS
// ============================================================================

function getPositionModifier(playerIndex, totalPlayers) {
  // Estimate position in current round (rough approximation)
  // Early (0-1): more conservative
  // Late (3-4): more aggressive
  const positionRatio = playerIndex / totalPlayers;

  if (positionRatio < 0.4) {
    return -0.05; // Early position: increase liar threshold (more conservative)
  } else if (positionRatio > 0.7) {
    return 0.05;  // Late position: decrease liar threshold (more aggressive)
  }
  return 0;
}

// ============================================================================
// ADAPTIVE THRESHOLD CALCULATION
// ============================================================================

function getAdaptiveThreshold(history, yourIndex, totalPlayers) {
  let baseLiarThreshold = 0.22; // From Baseline

  // Analyze table aggression from recent history
  const recent = history.slice(-20);
  let raiseCount = 0, liarCount = 0;

  for (const h of recent) {
    if (h.action === 'raise') raiseCount++;
    else if (h.action === 'liar') liarCount++;
  }

  const tableActivity = raiseCount + liarCount;
  if (tableActivity === 0) return baseLiarThreshold;

  const liarRate = liarCount / tableActivity;

  // If table is calling liar frequently, become more skeptical
  if (liarRate > 0.25) {
    baseLiarThreshold = 0.28; // High momentum skeptic (from MomentumAdaptive)
  } else if (liarRate < 0.10) {
    baseLiarThreshold = 0.15; // Low momentum friendly
  }

  // Apply position modifier
  const positionMod = getPositionModifier(yourIndex, totalPlayers);
  baseLiarThreshold = clamp01(baseLiarThreshold + positionMod);

  return baseLiarThreshold;
}

// ============================================================================
// COUNTER-STRATEGY ENGINE
// ============================================================================

function getCounterStrategy(opponentClass, raiseTarget) {
  switch (opponentClass) {
    case 'conservative':
      // Conservative opponents are predictable, we can be more aggressive
      return 0.35; // Lower target, easier raises
    case 'aggressive':
      // Aggressive opponents bluff more, be conservative with raises
      return 0.50; // Higher target, stricter raises
    case 'adaptive':
      // Adaptive opponents match the table, use baseline
      return 0.40;
    default:
      return raiseTarget;
  }
}

// ============================================================================
// MAIN BOT LOGIC
// ============================================================================

self.onmessage = (e) => {
  const { state } = e.data;

  const myDice = state.you.dice || [];
  const players = state.players || [];
  const currentBid = state.currentBid || null;
  const history = state.history || [];

  const totalDiceOnTable = players.reduce((sum, p) => sum + p.diceCount, 0);
  const unknownDiceCount = totalDiceOnTable - myDice.length;

  // Unpack my face counts
  const myFaceCounts = Array(7).fill(0);
  for (const d of myDice) if (d >= 1 && d <= 6) myFaceCounts[d]++;

  // Find my player index
  let myPlayerIndex = 0;
  const myId = state.you.id;
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === myId) {
      myPlayerIndex = i;
      break;
    }
  }

  // Update opponent profiles from history
  for (const h of history) {
    if (h.action === 'raise' && h.actor !== myId) {
      const prevQty = h.prevQuantity || (h.quantity - 1);
      updateOpponentMetrics(h.actor, 'raise', prevQty, h.quantity);
    } else if (h.action === 'liar' && h.actor !== myId) {
      updateOpponentMetrics(h.actor, 'liar');
    }
  }

  // ---- OPENING: no current bid ----
  if (!currentBid) {
    let bestFace = 1, bestCount = -1;
    for (let f = 1; f <= 6; f++) {
      if (myFaceCounts[f] > bestCount) {
        bestFace = f;
        bestCount = myFaceCounts[f];
      }
    }

    const expectedUnknown = unknownDiceCount * FACE_PROB;
    let q = Math.max(1, Math.floor(bestCount + expectedUnknown));

    const openingCap = Math.min(totalDiceOnTable, Math.ceil(totalDiceOnTable * OPENING_CAP_FRAC));
    q = Math.min(q, openingCap);

    // Use adaptive threshold for opening
    const raiseTarget = 0.40;
    while (q + 1 <= openingCap && probabilityAtLeast(bestFace, q + 1, myFaceCounts, unknownDiceCount) >= raiseTarget) {
      q++;
    }

    self.postMessage({ action: 'raise', quantity: q, face: bestFace });
    return;
  }

  // ---- REACTING: current bid exists ----
  const { quantity: prevQty, face: prevFace } = currentBid;
  const probPrevTrue = probabilityAtLeast(prevFace, prevQty, myFaceCounts, unknownDiceCount);

  // Get adaptive threshold based on table state and position
  const liarThreshold = getAdaptiveThreshold(history, myPlayerIndex, players.length);

  // Analyze opponent types on the table
  let numAggressive = 0, numConservative = 0, numAdaptive = 0;
  for (const p of players) {
    if (p.id === myId) continue;
    const classification = classifyOpponent(p.id);
    if (classification === 'aggressive') numAggressive++;
    else if (classification === 'conservative') numConservative++;
    else numAdaptive++;
  }

  // Determine counter-strategy based on table composition
  let raiseTarget = 0.40;
  if (numAggressive > numConservative) {
    raiseTarget = 0.50; // More aggressive table, be conservative
  } else if (numConservative > numAggressive) {
    raiseTarget = 0.35; // More conservative table, be aggressive
  }

  // Try minimal legal raises
  const raiseCandidates = [{ quantity: prevQty + 1, face: prevFace }];
  for (let f = prevFace + 1; f <= 6; f++) {
    raiseCandidates.push({ quantity: prevQty, face: f });
  }

  let chosenRaise = null;
  for (const r of raiseCandidates) {
    const p = probabilityAtLeast(r.face, r.quantity, myFaceCounts, unknownDiceCount);
    if (p >= raiseTarget) {
      chosenRaise = r;
      break;
    }
  }

  if (chosenRaise) {
    self.postMessage({ action: 'raise', quantity: chosenRaise.quantity, face: chosenRaise.face });
    return;
  }

  // No credible raise: call LIAR if claim is unlikely
  if (probPrevTrue < liarThreshold) {
    self.postMessage({ action: 'liar' });
    return;
  }

  // Fallback: conservative nudge (increase quantity)
  const nudge = { quantity: prevQty + 1, face: prevFace };
  self.postMessage({ action: 'raise', quantity: nudge.quantity, face: nudge.face });
};
