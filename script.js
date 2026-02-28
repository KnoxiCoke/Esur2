(() => {
  // -----------------------------
  // State
  // -----------------------------
  const state = {
    nav: "flow",
    situation: "elective",     // elective | emergency
    reaction: "moderate",      // moderate | mild
    icm: "unknown",            // A | B | C | D | unknown
    culpritKnown: "known",     // known | unknown (optional, falls Buttons exist)
  };

  // -----------------------------
  // Text content (Flow + Switch + NIHR)
  // -----------------------------
  const FLOW_TEXT = {
    elective: {
      moderate: [
        "Postpone examination.",
        "Await allergy evaluation results.",
        "Prefer allergist-recommended alternative.",
        "Observe ≥ 30 min with IV access."
      ],
      mild: [
        "Proceed with caution.",
        "Consider switching contrast agent (prefer different structural group).",
        "Ensure IV access and monitor patient.",
        "Observe ≥ 30 min based on local protocol."
      ]
    },
    emergency: {
      moderate: [
        "Ensure rapid response/resuscitation capability is available nearby.",
        "Choose a different CM (prefer different structural group).",
        "Premedication: optional only in severe HR with unknown culprit (emergency scenario).",
        "Observe ≥ 30 min with IV access."
      ],
      mild: [
        "Proceed with caution.",
        "Have trained staff nearby and monitor vitals.",
        "Consider using a different CM than routinely administered.",
        "Observe ≥ 30 min based on local protocol."
      ]
    }
  };

  // ICM switching groups (operative)
  const ALT_GROUPS = {
    ICM: { A: ["B", "D"], B: ["A", "C", "D"], C: ["B"], D: ["A", "B"], unknown: ["B", "D"] }
  };

  // Unknown culprit text (dein Text 1:1)
  const UNKNOWN_TEXT = {
    ICM: [
      "Due to the higher likelihood that the involved ICM is from group A.",
      "Choose the alternative ICM from Group B or D.",
      "High cross-reactivity between Group C and Group A."
    ],
    GBCA: [
      "It is not possible to recommend a regimen with certainty.",
      "Due to the probability of involvement, using a GBCA different from the one routinely administered is suggested."
    ]
  };

  // -----------------------------
  // Helpers
  // -----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setActiveSegButton(segName, value) {
    const btns = $$(`.seg__btn[data-seg="${segName}"]`);
    btns.forEach(b => b.classList.toggle("is-on", b.dataset.value === value));
  }

  function showView(nav) {
    state.nav = nav;

    // views
    const views = {
      flow: $("#view-flow"),
      switch: $("#view-switch"),
      tryptase: $("#view-tryptase"),
      nihr: $("#view-nihr"),
    };

    Object.entries(views).forEach(([k, el]) => {
      if (!el) return;
      el.hidden = k !== nav;
    });

    // bottom nav active
    $$(".bottomnav__btn").forEach(b => b.classList.toggle("is-on", b.dataset.nav === nav));

    // re-render outputs
    renderAll();
  }

  // -----------------------------
  // Renderers
  // -----------------------------
  function renderFlow() {
    const out = $("#flowOutput");
    if (!out) return;

    const lines = FLOW_TEXT?.[state.situation]?.[state.reaction] || [];
    out.innerHTML = `
      <ul class="ul">
        ${lines.map(t => `<li>${t}</li>`).join("")}
      </ul>
    `;
  }

  function renderSwitch() {
    const out = $("#switchOutput");
    if (!out) return;

    // In deiner HTML gibt es aktuell nur ICM-Buttons.
    // (GBCA-Text ist hinterlegt, falls du später GBCA UI ergänzt.)
    const mode = "ICM";

    const isUnknown =
      state.culpritKnown === "unknown" ||
      state.icm === "unknown";

    if (isUnknown) {
      const lines = UNKNOWN_TEXT[mode];
      out.innerHTML = `
        <div>
          <div style="font-weight:700; margin-bottom:8px;">${mode} — Unknown culprit</div>
          <ul class="ul">
            ${lines.map(t => `<li>${t}</li>`).join("")}
          </ul>
          <div class="note" style="margin-top:10px;">
            Cross-reactivity is high and variable → testing preferred when feasible.
          </div>
        </div>
      `;
      return;
    }

    const alts = ALT_GROUPS[mode][state.icm] || [];
    out.innerHTML = `
      <div>
        <div style="font-weight:700; margin-bottom:8px;">${mode} culprit group: Group ${state.icm}</div>
        <div><strong>Suggested alternative group(s):</strong> ${alts.map(g => `Group ${g}`).join(", ")}</div>
        <div class="note" style="margin-top:10px;">
          Cross-reactivity is high and variable → testing preferred when feasible.
        </div>
      </div>
    `;
  }

  function renderTryptase() {
    const out = $("#tryptaseOutput");
    if (!out) return;

    // Only render if values exist
    const baseline = parseFloat($("#baseline")?.value || "");
    const acute = parseFloat($("#acute")?.value || "");

    if (!Number.isFinite(baseline) || !Number.isFinite(acute)) {
      out.innerHTML = `Enter baseline and acute values.`;
      return;
    }

    const threshold = 2 + (1.2 * baseline);
    const significant = acute >= threshold;

    out.innerHTML = `
      <div>
        <div><strong>Rule:</strong> Acute ≥ 2 ng/mL + (1.2 × baseline)</div>
        <div><strong>Computed threshold:</strong> ${threshold.toFixed(2)} ng/mL</div>
        <div style="margin-top:10px; font-weight:700;">
          ${significant ? "Suggests mast cell activation / supports IHR." : "Not significant by ESUR rule."}
        </div>
      </div>
    `;
  }

  function renderNIHR() {
    const out = $("#nihrOutput");
    if (!out) return;

    const checks = $$(".nihr-check");
    const any = checks.some(c => c.checked);

    if (!any) {
      out.innerHTML = `No SCAR red flags selected. If symptoms persist/worsen → consider specialist referral per local protocol.`;
      return;
    }

    out.innerHTML = `
      <div style="font-weight:700; margin-bottom:6px;">SCAR red flags present.</div>
      <div>Prompt specialist referral is recommended.</div>
    `;
  }

  function renderAll() {
    // always keep outputs current
    renderFlow();
    renderSwitch();
    renderNIHR();

    // Only render tryptase on that page to avoid annoying "enter values" message
    if (state.nav === "tryptase") renderTryptase();
  }

  // -----------------------------
  // Event wiring
  // -----------------------------
  function wireSegButtons() {
    // Generic handler for all segmented buttons
    $$(".seg__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const seg = btn.dataset.seg;
        const val = btn.dataset.value;

        if (!seg) return;

        // update state
        state[seg] = val;

        // set active styling within that segment
        setActiveSegButton(seg, val);

        // re-render
        renderAll();
      });
    });
  }

  function wireBottomNav() {
    $$(".bottomnav__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const nav = btn.dataset.nav;
        if (!nav) return;
        showView(nav);
      });
    });
  }

  function wireReset() {
    const resetBtn = $("#resetBtn");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", () => {
      // reset state
      state.nav = "flow";
      state.situation = "elective";
      state.reaction = "moderate";
      state.icm = "unknown";
      state.culpritKnown = "known";

      // reset UI seg active
      setActiveSegButton("situation", "elective");
      setActiveSegButton("reaction", "moderate");
      setActiveSegButton("icm", "unknown");
      setActiveSegButton("culpritKnown", "known");

      // reset NIHR checks
      $$(".nihr-check").forEach(c => (c.checked = false));

      // reset tryptase inputs
      const b = $("#baseline");
      const a = $("#acute");
      if (b) b.value = "";
      if (a) a.value = "";

      showView("flow");
    });
  }

  function wireTryptaseCalcButton() {
    const btn = $("#calcTryptase");
    if (!btn) return;
    btn.addEventListener("click", () => {
      renderTryptase();
    });
  }

  function wireNIHRChecks() {
    $$(".nihr-check").forEach(c => {
      c.addEventListener("change", () => renderNIHR());
    });
  }

  // -----------------------------
  // Init
  // -----------------------------
  function init() {
    // set initial UI state for default "is-on" buttons (keeps consistent)
    setActiveSegButton("situation", state.situation);
    setActiveSegButton("reaction", state.reaction);
    setActiveSegButton("icm", state.icm);
    setActiveSegButton("culpritKnown", state.culpritKnown);

    wireSegButtons();
    wireBottomNav();
    wireReset();
    wireTryptaseCalcButton();
    wireNIHRChecks();

    showView("flow");
  }

  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
