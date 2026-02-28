(() => {
  const state = {
    nav: "flow",
    situation: "elective",   // elective | emergency
    reaction: "moderate",    // moderate | mild
    cmtype: "icm",           // icm | gbca
    icm: null,               // A|B|C|D|unknown
    gbca: null,              // A|B|C|unknown
    baseline: "",
    acute: ""
  };

  const $  = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const views = ["flow", "switch", "tryptase", "nihr"];

  // ---------------- CONTENT ----------------
  function flowRecommendation() {
    const s = state.situation;
    const r = state.reaction;

    if (s === "elective" && r === "moderate") {
      return {
        title: "Elective imaging — prior moderate/severe IHR",
        bullets: [
          "Postpone examination.",
          "Await allergy evaluation results.",
          "Prefer allergist-recommended alternative.",
          "Observe ≥ 30 min with IV access."
        ]
      };
    }

    if (s === "emergency" && r === "moderate") {
      return {
        title: "Emergency imaging — prior moderate/severe IHR",
        bullets: [
          "Ensure rapid response/resuscitation capability is available nearby.",
          "Choose a different CM (prefer different structural group).",
          "Premedication: optional only in severe HR with unknown culprit (emergency scenario).",
          "Observe ≥ 30 min with IV access."
        ]
      };
    }

    if (s === "elective" && r === "mild") {
      return {
        title: "Elective imaging — prior mild/unclear reaction",
        bullets: [
          "Clarify reaction history if possible (timing, symptoms, agent).",
          "Prefer a different CM (different structural group) when feasible.",
          "Consider allergy referral if reactions recur or involve multiple agents.",
          "Observe ≥ 30 min with IV access if risk is uncertain."
        ]
      };
    }

    return {
      title: "Emergency imaging — prior mild/unclear reaction",
      bullets: [
        "Proceed if clinically necessary; ensure capability to manage acute reactions.",
        "Prefer a different CM (different structural group) when feasible.",
        "Premedication is not routine; consider only case-by-case.",
        "Observe ≥ 30 min with IV access if risk is uncertain."
      ]
    };
  }

  // ICM (ESUR grouping logic + your desired unknown text)
  const ICM_TEXT = {
    A: {
      headline: "ICM is from Group A",
      rec: "Choose an alternative ICM from Group B or D.",
      note: "Classic carbamoyl side chain. Cross-reactivity patterns are variable."
    },
    B: {
      headline: "ICM is from Group B",
      rec: "Choose an alternative ICM from Group A, C or D.",
      note: "No classic carbamoyl side chain."
    },
    C: {
      headline: "ICM is from Group C",
      rec: "Choose an alternative ICM from Group B (preferred) or D.",
      note: "Methyl-modified carbamoyl side chain. High cross-reactivity with Group A can occur."
    },
    D: {
      headline: "ICM is from Group D",
      rec: "Choose an alternative ICM from Group A or B.",
      note: "Two methyl-modified carbamoyl side chains."
    },
    unknown: {
      headline: "When the involved ICM is unknown",
      rec: "Due to the higher likelihood that the involved ICM is from Group A: choose the alternative ICM from Group B or D.",
      note: "High cross-reactivity between Group C and Group A."
    }
  };

  // GBCA (macrocyclic groups + your desired unknown text)
  const GBCA_TEXT = {
    A: {
      headline: "GBCA is from Group A (DOTA chelate)",
      rec: "Prefer switching to Group B when feasible.",
      note: "Cross-reactivity among macrocyclic GBCAs can be substantial; testing preferred."
    },
    B: {
      headline: "GBCA is from Group B (DO3A variants)",
      rec: "Prefer switching to Group A when feasible.",
      note: "Cross-reactivity among macrocyclic GBCAs can be substantial; testing preferred."
    },
    C: {
      headline: "GBCA is from Group C (Pyclen chelate)",
      rec: "Prefer switching to Group A or B when feasible.",
      note: "Data are more limited; specialist guidance preferred."
    },
    unknown: {
      headline: "When the involved GBCA is unknown",
      rec: "It is not possible to recommend a regimen with certainty. Due to the probability of involvement, using a GBCA different from the one routinely administered is suggested.",
      note: "Allergy testing and specialist advice are preferred whenever feasible."
    }
  };

  function switchRecommendationHTML() {
    // Determine which set to use
    if (state.cmtype === "icm") {
      if (!state.icm) {
        return `<div>Select the involved ICM group above to see the recommendation.</div>`;
      }
      const t = ICM_TEXT[state.icm];
      return `
        <div><strong>${t.headline}</strong></div>
        <div style="margin-top:10px">${t.rec}</div>
        ${t.note ? `<div style="margin-top:10px; color: var(--muted)"><em>${t.note}</em></div>` : ``}
      `;
    } else {
      if (!state.gbca) {
        return `<div>Select the involved GBCA group above to see the recommendation.</div>`;
      }
      const t = GBCA_TEXT[state.gbca];
      return `
        <div><strong>${t.headline}</strong></div>
        <div style="margin-top:10px">${t.rec}</div>
        ${t.note ? `<div style="margin-top:10px; color: var(--muted)"><em>${t.note}</em></div>` : ``}
      `;
    }
  }

  function tryptaseHTML() {
    const b = parseFloat(state.baseline);
    const a = parseFloat(state.acute);

    if (!Number.isFinite(b) || !Number.isFinite(a) || b <= 0 || a <= 0) {
      return `Enter baseline and acute tryptase values (ng/mL).`;
    }

    const threshold = 2 + 1.2 * b;
    const significant = a >= threshold;

    return `
      <div><strong>Rule:</strong> Acute elevation ≥ 2 ng/mL + (1.2 × baseline)</div>
      <div style="margin-top:10px"><strong>Baseline:</strong> ${b.toFixed(2)} ng/mL</div>
      <div><strong>Acute:</strong> ${a.toFixed(2)} ng/mL</div>
      <div style="margin-top:10px"><strong>Threshold:</strong> ${threshold.toFixed(2)} ng/mL</div>
      <div style="margin-top:12px; font-weight:900;">
        ${significant ? "✅ Suggests IHR (significant elevation)." : "ℹ️ Not significant by the 2 + 1.2× rule."}
      </div>
    `;
  }

  function nihrHTML() {
    const checked = $$(".nihr-check:checked").map(x => x.value);
    if (checked.length === 0) {
      return `No SCAR red flags selected. If symptoms evolve → specialist referral.`;
    }
    return `
      <div style="font-weight:900; color: var(--danger)">⚠️ SCAR red flags present</div>
      <div style="margin-top:10px">
        Prompt specialist referral is recommended. Avoid the culprit agent/class. Premedication is not recommended for NIHR.
      </div>
    `;
  }

  // ---------------- RENDER ----------------
  function renderFlow() {
    const out = $("#flowOutput");
    const r = flowRecommendation();
    out.innerHTML = `
      <div style="font-weight:900; margin-bottom:10px">${r.title}</div>
      <ul>${r.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
    `;

    const outputCard = out.closest(".card--output");
    const isEmerg = state.situation === "emergency";
    outputCard.classList.toggle("is-emergency", isEmerg);

    // tint the active emergency button
    $$('.seg__btn[data-seg="situation"]').forEach(b => {
      const on = b.classList.contains("is-on");
      b.classList.toggle("is-danger", on && b.dataset.value === "emergency");
    });
  }

  function renderSwitch() {
    // toggle which button row is visible (ICM buttons already in HTML)
    const gbcaCard = $("#gbcaCard");
    const icmBtns = $$('.seg__btn[data-seg="icm"]');
    const showGBCA = state.cmtype === "gbca";

    if (gbcaCard) gbcaCard.hidden = !showGBCA;
    icmBtns.forEach(btn => {
      // hide the ICM row by hiding their parent container if possible
      // but keep it simple: disable + visually dim when GBCA selected
      btn.disabled = showGBCA;
      btn.style.opacity = showGBCA ? "0.35" : "1";
      btn.style.pointerEvents = showGBCA ? "none" : "auto";
    });

    $("#switchOutput").innerHTML = switchRecommendationHTML();
  }

  function renderTryptase() {
    $("#tryptaseOutput").innerHTML = tryptaseHTML();
  }

  function renderNIHR() {
    $("#nihrOutput").innerHTML = nihrHTML();
  }

  function renderAll() {
    renderFlow();
    renderSwitch();
    renderTryptase();
    renderNIHR();
  }

  function setNav(nav) {
    state.nav = nav;
    views.forEach(v => {
      const el = $(`#view-${v}`);
      if (el) el.hidden = (v !== nav);
    });

    $$(".bottomnav__btn").forEach(b => {
      const on = b.dataset.nav === nav;
      b.classList.toggle("is-on", on);
      b.classList.toggle("is-danger", on && nav === "flow" && state.situation === "emergency");
    });

    requestAnimationFrame(() => {
      $("#app")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function setSeg(seg, value) {
    state[seg] = value;

    $$( `.seg__btn[data-seg="${seg}"]` ).forEach(btn => {
      const on = btn.dataset.value === value;
      btn.classList.toggle("is-on", on);
      if (seg === "situation") btn.classList.toggle("is-danger", on && value === "emergency");
    });

    // If switching cmtype, clear the other selection to avoid confusion
    if (seg === "cmtype") {
      if (value === "icm") state.gbca = null;
      if (value === "gbca") state.icm = null;

      // clear selected states on the buttons for both groups
      $$('.seg__btn[data-seg="icm"]').forEach(b => b.classList.remove("is-on"));
      $$('.seg__btn[data-seg="gbca"]').forEach(b => b.classList.remove("is-on"));
    }

    renderAll();

    // Emergency accent in nav if currently on Flow
    $$(".bottomnav__btn").forEach(b => {
      const on = b.dataset.nav === state.nav;
      b.classList.toggle("is-danger", on && state.nav === "flow" && state.situation === "emergency");
    });
  }

  // ---------- RESET (hard reset, no ghost output) ----------
  function resetAll() {
    // reset state
    state.nav = "flow";
    state.situation = "elective";
    state.reaction = "moderate";
    state.cmtype = "icm";
    state.icm = null;
    state.gbca = null;
    state.baseline = "";
    state.acute = "";

    // reset nav
    setNav("flow");

    // reset seg UI for flow
    setSeg("situation", "elective");
    setSeg("reaction", "moderate");

    // reset cmtype UI if present
    const cmBtns = $$('.seg__btn[data-seg="cmtype"]');
    if (cmBtns.length) setSeg("cmtype", "icm");

    // reset ICM buttons
    $$('.seg__btn[data-seg="icm"]').forEach(btn => btn.classList.remove("is-on"));

    // reset GBCA buttons
    $$('.seg__btn[data-seg="gbca"]').forEach(btn => btn.classList.remove("is-on"));

    // reset inputs
    const b = $("#baseline"); const a = $("#acute");
    if (b) b.value = "";
    if (a) a.value = "";

    // reset checkboxes
    $$(".nihr-check").forEach(c => c.checked = false);

    // hard reset outputs
    $("#flowOutput").innerHTML = "";
    $("#switchOutput").innerHTML = `<div>Select the involved ICM group above to see the recommendation.</div>`;
    $("#tryptaseOutput").innerHTML = `Enter baseline and acute tryptase values (ng/mL).`;
    $("#nihrOutput").innerHTML = `No SCAR red flags selected. If symptoms evolve → specialist referral.`;

    // final render
    renderAll();
  }

  // ---------------- EVENTS ----------------
  function bind() {
    // bottom nav
    $$(".bottomnav__btn").forEach(btn => {
      btn.addEventListener("click", () => setNav(btn.dataset.nav));
    });

    // flow segs
    $$('.seg__btn[data-seg="situation"]').forEach(btn => {
      btn.addEventListener("click", () => setSeg("situation", btn.dataset.value));
    });
    $$('.seg__btn[data-seg="reaction"]').forEach(btn => {
      btn.addEventListener("click", () => setSeg("reaction", btn.dataset.value));
    });

    // cmtype segs (if present)
    $$('.seg__btn[data-seg="cmtype"]').forEach(btn => {
      btn.addEventListener("click", () => setSeg("cmtype", btn.dataset.value));
    });

    // icm buttons
    $$('.seg__btn[data-seg="icm"]').forEach(btn => {
      btn.addEventListener("click", () => {
        state.icm = btn.dataset.value;
        $$('.seg__btn[data-seg="icm"]').forEach(x => x.classList.toggle("is-on", x === btn));
        renderSwitch();
        requestAnimationFrame(() => $("#switchOutput")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      });
    });

    // gbca buttons
    $$('.seg__btn[data-seg="gbca"]').forEach(btn => {
      btn.addEventListener("click", () => {
        state.gbca = btn.dataset.value;
        $$('.seg__btn[data-seg="gbca"]').forEach(x => x.classList.toggle("is-on", x === btn));
        renderSwitch();
        requestAnimationFrame(() => $("#switchOutput")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      });
    });

    // tryptase
    $("#calcTryptase")?.addEventListener("click", () => {
      state.baseline = $("#baseline")?.value ?? "";
      state.acute = $("#acute")?.value ?? "";
      renderTryptase();
      requestAnimationFrame(() => $("#tryptaseOutput")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    });

    // NIHR
    $$(".nihr-check").forEach(chk => {
      chk.addEventListener("change", () => {
        renderNIHR();
        requestAnimationFrame(() => $("#nihrOutput")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      });
    });

    // reset
    $("#resetBtn")?.addEventListener("click", resetAll);
  }

  // ---------------- BOOT ----------------
  window.addEventListener("DOMContentLoaded", () => {
    bind();
    setNav("flow");
    renderAll();
  });
})();
