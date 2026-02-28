// script.js — FULL FILE (for your exact HTML)
// Features:
// - Flow recommendation is fully dynamic (Elective/Emergency + Moderate/Mild)
// - Switch assistant includes "Unknown" logic + full text blocks (ICM + GBCA note)
// - Tryptase calculator works (formula + interpretation)
// - NIHR/SCAR checkbox logic works (dynamic warning)
// - Smooth auto-scroll to outputs + soft transitions
// - Emergency visual accent in Flow (red accent)

(() => {
  const state = {
    nav: "flow",
    situation: "elective", // elective | emergency
    reaction: "moderate",  // moderate | mild
    icm: null,             // A | B | C | D | unknown
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // ---------- FLOW CONTENT ----------
  const FLOW = {
    elective: {
      moderate: {
        title: "Elective imaging — prior moderate/severe IHR",
        bullets: [
          "Postpone examination.",
          "Await allergy evaluation results.",
          "Prefer allergist-recommended alternative.",
          "Observe ≥ 30 min with IV access.",
        ],
      },
      mild: {
        title: "Elective imaging — prior mild/unclear reaction",
        bullets: [
          "Proceed if clinically necessary; assess risk/benefit and follow local protocol.",
          "Prefer an alternative contrast agent when feasible (allergist-guided switch preferred).",
          "Routine premedication is not recommended.",
          "Consider observation ≥ 30 min with IV access if concern or history suggests higher risk.",
        ],
      },
    },
    emergency: {
      moderate: {
        title: "Emergency imaging — prior moderate/severe IHR",
        bullets: [
          "Ensure rapid response/resuscitation capability is available nearby.",
          "Choose a different CM (prefer different structural group).",
          "Premedication: optional only in severe HR with unknown culprit (emergency scenario).",
          "Observe ≥ 30 min with IV access.",
        ],
      },
      mild: {
        title: "Emergency imaging — prior mild/unclear reaction",
        bullets: [
          "Ensure rapid response/resuscitation capability is available nearby.",
          "Prefer a different CM (prefer different structural group).",
          "Premedication is not routine; consider only if justified by urgency and local protocol.",
          "Observe ≥ 30 min with IV access if concern.",
        ],
      },
    },
  };

  // ---------- SWITCHING ASSISTANT ----------
  // Text is intentionally explicit (minimizes “interpretation” and copy/paste errors)
  const SWITCH_ICM = {
    A: {
      title: "ICM involved: Group A",
      text: [
        "Alternative ICM from Group B or D (without classic carbamoyl sidechain).",
        "High cross-reactivity between Group A–Group C.",
      ],
    },
    B: {
      title: "ICM involved: Group B",
      text: [
        "Alternative ICM from Group A, C or D.",
      ],
    },
    C: {
      title: "ICM involved: Group C",
      text: [
        "Alternative ICM from Group B (without classic or methyl-modified carbamoyl sidechain).",
      ],
    },
    D: {
      title: "ICM involved: Group D",
      text: [
        "Alternative ICM from Group A or B (without methyl-modified carbamoyl sidechain).",
      ],
    },
    unknown: {
      title: "ICM involved: Unknown",
      text: [
        "Due to the higher likelihood that the involved ICM is from group A:",
        "Choose the alternative ICM from Group B or D.",
        "High cross-reactivity between Group C–Group A.",
      ],
    },
  };

  // GBCA note (your quote) — displayed as a constant safety note under the ICM output
  const SWITCH_GBCA_NOTE = [
    "Gadolinium-based contrast agents (GBCA):",
    "It is not possible to recommend a regimen with certainty.",
    "Due to the probability of involvement, using a GBCA different from the one routinely administered is suggested.",
  ];

  // ---------- TRYPTASE ----------
  // Rule: acute elevation ≥ 2 ng/mL + (1.2 × baseline) suggests IHR.
  function computeTryptase(baseline, acute) {
    const threshold = 2 + 1.2 * baseline;
    const significant = acute >= threshold;
    return { threshold, significant };
  }

  // ---------- NIHR / SCAR ----------
  const NIHR_RED_FLAGS = {
    blister: "Blistering",
    mucosa: "Mucosal involvement",
    erosion: "Erosions",
    hemorrhagic: "Hemorrhagic lesions",
  };

  // ---------- UX HELPERS ----------
  function withTransition(el, fn) {
    if (!el) return fn();
    el.classList.add("is-updating");
    requestAnimationFrame(() => {
      fn();
      requestAnimationFrame(() => el.classList.remove("is-updating"));
    });
  }

  function smoothScrollTo(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 10);
    }
  }

  function applyEmergencyAccent() {
    const flowView = $("#view-flow");
    if (!flowView) return;
    flowView.classList.toggle("is-emergency", state.situation === "emergency");
  }

  // ---------- NAV ----------
  function setNav(nav) {
    state.nav = nav;

    $$("#app .view").forEach((v) => (v.hidden = true));
    const view = $(`#view-${nav}`);
    if (view) view.hidden = false;

    $$(".bottomnav__btn").forEach((b) => {
      const on = b.dataset.nav === nav;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    // Render current view output when switching tabs
    if (nav === "flow") renderFlow(false);
    if (nav === "switch") renderSwitch(false);
    if (nav === "tryptase") renderTryptase(false);
    if (nav === "nihr") renderNihr(false);

    applyEmergencyAccent();
  }

  // ---------- SEGMENTED CONTROL SETTER ----------
  function setSeg(seg, value) {
    state[seg] = value;

    $$(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      const on = btn.dataset.value === value;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (state.nav === "flow") renderFlow(true);
    if (state.nav === "switch") renderSwitch(true);

    applyEmergencyAccent();
  }

  // ---------- RENDER: FLOW ----------
  function renderFlow(doScroll) {
    const out = $("#flowOutput");
    if (!out) return;

    const card = out.closest(".card") || out;
    const data = FLOW[state.situation][state.reaction];

    withTransition(card, () => {
      out.innerHTML = `
        <div class="output__title">${data.title}</div>
        <ul class="output__ul">
          ${data.bullets.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      `;
    });

    if (doScroll) smoothScrollTo(out);
  }

  // ---------- RENDER: SWITCH ----------
  function renderSwitch(doScroll) {
    const out = $("#switchOutput");
    if (!out) return;

    const card = out.closest(".card") || out;

    // If user hasn't selected anything yet
    if (!state.icm) {
      withTransition(card, () => {
        out.innerHTML = `<div class="output__muted">Select the involved ICM group (A–D) or choose <strong>Unknown</strong>.</div>`;
      });
      return;
    }

    const block = SWITCH_ICM[state.icm];

    withTransition(card, () => {
      out.innerHTML = `
        <div class="output__title">${block.title}</div>
        <ul class="output__ul">
          ${block.text.map((t) => `<li>${t}</li>`).join("")}
        </ul>

        <div class="divider"></div>

        <div class="output__title">GBCA (macrocyclic) — practical note</div>
        <ul class="output__ul">
          ${SWITCH_GBCA_NOTE.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      `;
    });

    if (doScroll) smoothScrollTo(out);
  }

  // ---------- RENDER: TRYPTASE ----------
  function renderTryptase(doScroll) {
    const out = $("#tryptaseOutput");
    if (!out) return;

    // static hint at first render
    if (!out.dataset.ready) {
      out.dataset.ready = "1";
      out.innerHTML = `<div class="output__muted">Enter baseline and acute tryptase values, then tap <strong>Calculate</strong>.</div>`;
    }
    if (doScroll) smoothScrollTo(out);
  }

  function onCalcTryptase() {
    const baselineEl = $("#baseline");
    const acuteEl = $("#acute");
    const out = $("#tryptaseOutput");
    if (!baselineEl || !acuteEl || !out) return;

    const baseline = Number(baselineEl.value);
    const acute = Number(acuteEl.value);

    const card = out.closest(".card") || out;

    if (!Number.isFinite(baseline) || !Number.isFinite(acute) || baseline <= 0 || acute <= 0) {
      withTransition(card, () => {
        out.innerHTML = `<div class="output__warn">Please enter valid positive numbers (ng/mL).</div>`;
      });
      smoothScrollTo(out);
      return;
    }

    const { threshold, significant } = computeTryptase(baseline, acute);

    withTransition(card, () => {
      out.innerHTML = `
        <div class="output__title">Rule check</div>
        <div class="output__kv">
          <div><span class="k">Baseline</span> <span class="v">${baseline.toFixed(2)} ng/mL</span></div>
          <div><span class="k">Acute</span> <span class="v">${acute.toFixed(2)} ng/mL</span></div>
          <div><span class="k">Threshold</span> <span class="v">≥ ${threshold.toFixed(2)} ng/mL</span></div>
        </div>
        <div class="${significant ? "output__ok" : "output__muted"}" style="margin-top:10px">
          ${significant
            ? "Acute elevation meets the rule → suggests IHR."
            : "Does not meet the rule → IHR not supported by tryptase rule alone."}
        </div>
      `;
    });

    smoothScrollTo(out);
  }

  // ---------- RENDER: NIHR ----------
  function renderNihr(doScroll) {
    const out = $("#nihrOutput");
    if (!out) return;

    // default state
    if (!out.dataset.ready) {
      out.dataset.ready = "1";
      out.innerHTML = `<div class="output__muted">Tick any red flags. The assessment updates automatically.</div>`;
    }

    updateNihrAssessment();
    if (doScroll) smoothScrollTo(out);
  }

  function updateNihrAssessment() {
    const out = $("#nihrOutput");
    if (!out) return;

    const checks = $$(".nihr-check");
    const selected = checks.filter((c) => c.checked).map((c) => c.value);

    const card = out.closest(".card") || out;

    withTransition(card, () => {
      if (selected.length === 0) {
        out.innerHTML = `
          <div class="output__title">Assessment</div>
          <div class="output__muted">No SCAR red flags selected. If symptoms evolve, reassess and follow local protocol.</div>
          <div class="divider"></div>
          <div class="output__muted">Timing: NIHR typically occurs 1 hour to 1 week after administration.</div>
        `;
        return;
      }

      const labels = selected.map((k) => NIHR_RED_FLAGS[k] || k);

      out.innerHTML = `
        <div class="output__title">Assessment</div>
        <div class="output__danger">
          Red flags selected → prompt specialist referral recommended (suspected SCAR).
        </div>
        <ul class="output__ul">
          ${labels.map((t) => `<li>${t}</li>`).join("")}
        </ul>
        <div class="divider"></div>
        <div class="output__muted">
          Action: Avoid the culprit agent/class; prompt specialist referral. Premedication is not recommended for NIHR.
        </div>
      `;
    });
  }

  // ---------- RESET ----------
  function resetAll() {
    // reset state
    state.situation = "elective";
    state.reaction = "moderate";
    state.icm = null;

    // reset seg buttons
    setSeg("situation", "elective");
    setSeg("reaction", "moderate");

    // reset ICM seg buttons
    $$(`.seg__btn[data-seg="icm"]`).forEach((btn) => {
      btn.classList.remove("is-on");
      btn.setAttribute("aria-pressed", "false");
    });

    // reset inputs
    const baselineEl = $("#baseline");
    const acuteEl = $("#acute");
    if (baselineEl) baselineEl.value = "";
    if (acuteEl) acuteEl.value = "";

    // reset NIHR checks
    $$(".nihr-check").forEach((c) => (c.checked = false));

    // go to flow
    setNav("flow");
    renderFlow(true);
  }

  // ---------- BIND UI ----------
  function bindUI() {
    // bottom nav
    $$(".bottomnav__btn").forEach((btn) => {
      btn.addEventListener("click", () => setNav(btn.dataset.nav));
    });

    // all seg buttons
    $$(".seg__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const seg = btn.dataset.seg;
        const val = btn.dataset.value;
        if (!seg || !val) return;

        if (seg === "icm") {
          state.icm = val; // A/B/C/D/unknown

          // toggle UI state for ICM buttons
          $$(`.seg__btn[data-seg="icm"]`).forEach((b) => {
            const on = b.dataset.value === val;
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", on ? "true" : "false");
          });

          renderSwitch(true);
          return;
        }

        setSeg(seg, val);
      });
    });

    // reset
    const resetBtn = $("#resetBtn");
    if (resetBtn) resetBtn.addEventListener("click", resetAll);

    // tryptase calc button
    const calcBtn = $("#calcTryptase");
    if (calcBtn) calcBtn.addEventListener("click", onCalcTryptase);

    // NIHR checkboxes
    $$(".nihr-check").forEach((c) => c.addEventListener("change", updateNihrAssessment));
  }

  function init() {
    bindUI();

    // Ensure initial selected states match HTML defaults
    state.situation = "elective";
    state.reaction = "moderate";

    // Render initial view
    setNav("flow");
    renderFlow(false);
    applyEmergencyAccent();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
