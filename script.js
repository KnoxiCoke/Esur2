(() => {
  const state = {
    nav: "flow",
    situation: "elective",   // elective | emergency
    reaction: "moderate",    // moderate | mild
    cmtype: "icm",           // icm | gbca
    icm: null,               // A | B | C | D | unknown
    gbca: null               // A | B | C | unknown
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // ---------- NAV ----------
  function setNav(nav) {
    state.nav = nav;

    $$(".view").forEach(v => {
      v.hidden = true;
    });

    const target = $("#view-" + nav);
    if (target) target.hidden = false;

    $$(".bottomnav__btn").forEach(btn => {
      const on = btn.dataset.nav === nav;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    renderCurrentView();
  }

  // ---------- SEGMENT HANDLING ----------
  function setSeg(seg, value) {
    state[seg] = value;

    $$(`.seg__btn[data-seg="${seg}"]`).forEach(btn => {
      const on = btn.dataset.value === value;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (seg === "situation") {
      document.body.classList.toggle("is-emergency", value === "emergency");
    }

    if (seg === "cmtype") {
      const icmCard = $("#icmCard");
      const gbcaCard = $("#gbcaCard");
      if (icmCard) icmCard.hidden = value !== "icm";
      if (gbcaCard) gbcaCard.hidden = value !== "gbca";
    }

    renderCurrentView();
  }

  function clearGroupButtons(seg) {
    $$(`.seg__btn[data-seg="${seg}"]`).forEach(btn => {
      btn.classList.remove("is-on");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  // ---------- FLOW ----------
  function flowRecommendation() {
    const isEmergency = state.situation === "emergency";
    const isModerate = state.reaction === "moderate";

    if (!isEmergency && isModerate) {
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

    if (!isEmergency && !isModerate) {
      return {
        title: "Elective imaging — prior mild/unclear reaction",
        bullets: [
          "Proceed if clinically necessary; consider postponing when feasible.",
          "Prefer switching to an alternative CM when feasible.",
          "Consider allergy evaluation if reactions recur or involve multiple agents.",
          "Observe ≥ 30 min with IV access if concern remains."
        ]
      };
    }

    if (isEmergency && isModerate) {
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

    return {
      title: "Emergency imaging — prior mild/unclear reaction",
      bullets: [
        "Proceed if clinically necessary; ensure capability to manage acute reactions.",
        "Prefer switching to a different CM when feasible.",
        "Premedication is not routine; consider only if clinically justified.",
        "Observe ≥ 30 min with IV access if concern remains."
      ]
    };
  }

  function renderFlow() {
    const out = $("#flowOutput");
    if (!out) return;

    const data = flowRecommendation();

    out.innerHTML = `
      <div style="font-weight:900;margin-bottom:10px">${data.title}</div>
      <ul>${data.bullets.map(x => `<li>${x}</li>`).join("")}</ul>
    `;
  }

  // ---------- SWITCH ----------
  const ICM_RULES = {
    A: {
      title: "ICM is from Group A",
      text: `Alternative ICM from <strong>Group B or D</strong> (without classic carbamoyl sidechain).`,
      note: `High cross-reactivity between Group A and Group C.`
    },
    B: {
      title: "ICM is from Group B",
      text: `Alternative ICM from <strong>Group A, C or D</strong>.`,
      note: ``
    },
    C: {
      title: "ICM is from Group C",
      text: `Alternative ICM from <strong>Group B</strong> (without classic or methyl-modified carbamoyl sidechain).`,
      note: ``
    },
    D: {
      title: "ICM is from Group D",
      text: `Alternative ICM from <strong>Group A or B</strong> (without methyl-modified carbamoyl sidechain).`,
      note: ``
    },
    unknown: {
      title: "When the involved ICM is unknown",
      text: `Due to the higher likelihood that the involved ICM is from Group A, choose the alternative ICM from <strong>Group B or D</strong>.`,
      note: `High cross-reactivity between Group C and Group A.`
    }
  };

  const GBCA_RULES = {
    A: {
      title: "GBCA is from Group A",
      text: `Alternative GBCA from <strong>Group B</strong>.`,
      note: ``
    },
    B: {
      title: "GBCA is from Group B",
      text: `Alternative GBCA from <strong>Group A</strong>.`,
      note: ``
    },
    C: {
      title: "GBCA is from Group C",
      text: `<em>Insufficient data for empiric change advice.</em>`,
      note: `Prefer specialist input or tested alternative when feasible.`
    },
    unknown: {
      title: "When the involved GBCA is unknown",
      text: `It is not possible to recommend a regimen with certainty. Due to the probability of involvement, using a GBCA different from the one routinely administered is suggested.`,
      note: ``
    }
  };

  function renderSwitch() {
    const out = $("#switchOutput");
    if (!out) return;

    const icmCard = $("#icmCard");
    const gbcaCard = $("#gbcaCard");

    if (icmCard) icmCard.hidden = state.cmtype !== "icm";
    if (gbcaCard) gbcaCard.hidden = state.cmtype !== "gbca";

    if (state.cmtype === "icm") {
      if (!state.icm) {
        out.innerHTML = `<div class="hint">Select the involved ICM group (A–D) or choose <strong>Unknown</strong>.</div>`;
        return;
      }

      const rule = ICM_RULES[state.icm];
      out.innerHTML = `
        <div style="font-weight:900;margin-bottom:10px">${rule.title}</div>
        <div>${rule.text}</div>
        ${rule.note ? `<div class="hint" style="margin-top:10px"><em>${rule.note}</em></div>` : ``}
        <div class="hint" style="margin-top:10px">Cross-reactivity is variable → testing preferred when feasible.</div>
      `;
      return;
    }

    if (!state.gbca) {
      out.innerHTML = `<div class="hint">Select the involved GBCA group (A–C) or choose <strong>Unknown</strong>.</div>`;
      return;
    }

    const rule = GBCA_RULES[state.gbca];
    out.innerHTML = `
      <div style="font-weight:900;margin-bottom:10px">${rule.title}</div>
      <div>${rule.text}</div>
      ${rule.note ? `<div class="hint" style="margin-top:10px"><em>${rule.note}</em></div>` : ``}
      <div class="hint" style="margin-top:10px">Testing preferred when feasible.</div>
    `;
  }

  // ---------- TRYPTASE ----------
  function renderTryptase() {
    const out = $("#tryptaseOutput");
    if (!out) return;

    if (!out.dataset.initialized) {
      out.dataset.initialized = "true";
      out.innerHTML = `<div class="hint">Enter baseline and acute values, then press <strong>Calculate</strong>.</div>`;
    }
  }

  function calcTryptase() {
    const baseline = Number($("#baseline")?.value || "");
    const acute = Number($("#acute")?.value || "");
    const out = $("#tryptaseOutput");
    if (!out) return;

    if (!isFinite(baseline) || !isFinite(acute) || baseline < 0 || acute < 0) {
      out.innerHTML = `<div class="hint"><strong>Invalid input.</strong> Please enter valid numeric values.</div>`;
      return;
    }

    const threshold = 2 + (1.2 * baseline);
    const suggests = acute >= threshold;

    out.innerHTML = `
      <div style="font-weight:900;margin-bottom:10px">Result</div>
      <div class="hint">Threshold = 2 + (1.2 × baseline) = <strong>${threshold.toFixed(2)}</strong> ng/mL</div>
      <div class="hint">Acute = <strong>${acute.toFixed(2)}</strong> ng/mL</div>
      <div style="margin-top:12px;font-weight:900">
        ${suggests ? "✅ Suggests/supports IHR (significant acute elevation)." : "ℹ️ Not significant by this rule."}
      </div>
    `;
  }

  // ---------- NIHR ----------
  function renderNihr() {
    const out = $("#nihrOutput");
    if (!out) return;

    const any = $$(".nihr-check").some(c => c.checked);
    if (!any) {
      out.innerHTML = `<div class="hint">No red flags selected.</div>`;
      return;
    }

    out.innerHTML = `
      <div style="font-weight:900;margin-bottom:10px">⚠️ Red flags present</div>
      <div>Urgent specialist evaluation recommended (possible SCAR).</div>
      <div class="hint" style="margin-top:10px">Avoid culprit agent/class. Premedication is not recommended for NIHR.</div>
    `;
  }

  // ---------- CURRENT VIEW ----------
  function renderCurrentView() {
    if (state.nav === "flow") renderFlow();
    if (state.nav === "switch") renderSwitch();
    if (state.nav === "tryptase") renderTryptase();
    if (state.nav === "nihr") renderNihr();
  }

  // ---------- RESET ----------
  function resetAll() {
    state.nav = "flow";
    state.situation = "elective";
    state.reaction = "moderate";
    state.cmtype = "icm";
    state.icm = null;
    state.gbca = null;

    document.body.classList.remove("is-emergency");

    // reset segmented controls
    setSeg("situation", "elective");
    setSeg("reaction", "moderate");
    setSeg("cmtype", "icm");

    clearGroupButtons("icm");
    clearGroupButtons("gbca");

    // reset form fields
    const baseline = $("#baseline");
    const acute = $("#acute");
    if (baseline) baseline.value = "";
    if (acute) acute.value = "";

    // reset nihr checkboxes
    $$(".nihr-check").forEach(c => {
      c.checked = false;
    });

    // reset outputs explicitly
    const flowOut = $("#flowOutput");
    const switchOut = $("#switchOutput");
    const tryptaseOut = $("#tryptaseOutput");
    const nihrOut = $("#nihrOutput");

    if (flowOut) flowOut.innerHTML = "";
    if (switchOut) switchOut.innerHTML = `<div class="hint">Select the involved ICM group (A–D) or choose <strong>Unknown</strong>.</div>`;
    if (tryptaseOut) {
      tryptaseOut.innerHTML = `<div class="hint">Enter baseline and acute values, then press <strong>Calculate</strong>.</div>`;
      delete tryptaseOut.dataset.initialized;
    }
    if (nihrOut) nihrOut.innerHTML = `<div class="hint">No red flags selected.</div>`;

    setNav("flow");
  }

  // ---------- EVENTS ----------
  function bindEvents() {
    // bottom nav
    $$(".bottomnav__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setNav(btn.dataset.nav);
      });
    });

    // generic segmented buttons
    $$(".seg__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const seg = btn.dataset.seg;
        const value = btn.dataset.value;
        if (!seg || !value) return;

        if (seg === "icm") {
          state.icm = value;
          clearGroupButtons("icm");
          btn.classList.add("is-on");
          btn.setAttribute("aria-pressed", "true");
          renderSwitch();
          return;
        }

        if (seg === "gbca") {
          state.gbca = value;
          clearGroupButtons("gbca");
          btn.classList.add("is-on");
          btn.setAttribute("aria-pressed", "true");
          renderSwitch();
          return;
        }

        setSeg(seg, value);
      });
    });

    // reset
    $("#resetBtn")?.addEventListener("click", resetAll);

    // tryptase
    $("#calcTryptase")?.addEventListener("click", calcTryptase);

    // nihr
    $$(".nihr-check").forEach(c => {
      c.addEventListener("change", renderNihr);
    });
  }

  // ---------- INIT ----------
  function init() {
    bindEvents();
    renderFlow();
    renderSwitch();
    renderTryptase();
    renderNihr();
    setNav("flow");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
