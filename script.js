document.addEventListener("DOMContentLoaded", function () {
  const state = {
    nav: "flow",
    situation: "elective",
    reaction: "moderate",
    cmtype: "icm",
    icm: null,
    gbca: null
  };

  const views = {
    flow: document.getElementById("view-flow"),
    switch: document.getElementById("view-switch"),
    tryptase: document.getElementById("view-tryptase"),
    nihr: document.getElementById("view-nihr")
  };

  const flowOutput = document.getElementById("flowOutput");
  const switchOutput = document.getElementById("switchOutput");
  const tryptaseOutput = document.getElementById("tryptaseOutput");
  const nihrOutput = document.getElementById("nihrOutput");

  const icmCard = document.getElementById("icmCard");
  const gbcaCard = document.getElementById("gbcaCard");

  function setBodyMode() {
    document.body.classList.toggle("emergency", state.situation === "emergency");
  }

  function showView(name) {
    Object.keys(views).forEach((key) => {
      views[key].hidden = key !== name;
    });

    document.querySelectorAll(".bottomnav__btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === name);
    });

    state.nav = name;
  }

  function setSegment(seg, value) {
    state[seg] = value;

    document.querySelectorAll(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === value);
    });

    if (seg === "situation") setBodyMode();
    if (seg === "cmtype") {
      icmCard.hidden = value !== "icm";
      gbcaCard.hidden = value !== "gbca";
    }

    renderAll();
  }

  function renderFlow() {
    let title = "";
    let bullets = [];

    if (state.situation === "elective" && state.reaction === "moderate") {
      title = "Elective imaging — prior moderate/severe IHR";
      bullets = [
        "Postpone examination.",
        "Await allergy evaluation results.",
        "Prefer allergist-recommended alternative.",
        "Observe ≥ 30 min with IV access."
      ];
    }

    if (state.situation === "elective" && state.reaction === "mild") {
      title = "Elective imaging — prior mild/unclear reaction";
      bullets = [
        "Proceed if clinically necessary; consider postponing when feasible.",
        "Prefer switching to an alternative CM when feasible.",
        "Consider allergy evaluation if reactions recur or involve multiple agents.",
        "Observe ≥ 30 min with IV access if concern remains."
      ];
    }

    if (state.situation === "emergency" && state.reaction === "moderate") {
      title = "Emergency imaging — prior moderate/severe IHR";
      bullets = [
        "Ensure rapid response/resuscitation capability is available nearby.",
        "Choose a different CM (prefer different structural group).",
        "Premedication: optional only in severe HR with unknown culprit (emergency scenario).",
        "Observe ≥ 30 min with IV access."
      ];
    }

    if (state.situation === "emergency" && state.reaction === "mild") {
      title = "Emergency imaging — prior mild/unclear reaction";
      bullets = [
        "Proceed if clinically necessary; ensure capability to manage acute reactions.",
        "Consider switching to a different CM when feasible.",
        "Premedication is not routine; consider only if clinically justified.",
        "Observe ≥ 30 min with IV access."
      ];
    }

    flowOutput.innerHTML = `
      <div><strong>${title}</strong></div>
      <ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
    `;
  }

  function renderSwitch() {
    if (state.cmtype === "icm") {
      icmCard.hidden = false;
      gbcaCard.hidden = true;

      if (!state.icm) {
        switchOutput.innerHTML = `<div class="hint">Select the involved ICM group above.</div>`;
        return;
      }

      const rules = {
        A: {
          title: "ICM is from Group A",
          text: "Alternative ICM from Group B or D (without classic carbamoyl sidechain).",
          note: "High cross-reactivity between Group A and Group C."
        },
        B: {
          title: "ICM is from Group B",
          text: "Alternative ICM from Group A, C or D.",
          note: ""
        },
        C: {
          title: "ICM is from Group C",
          text: "Alternative ICM from Group B (without classic or methyl-modified carbamoyl sidechain).",
          note: ""
        },
        D: {
          title: "ICM is from Group D",
          text: "Alternative ICM from Group A or B (without methyl-modified carbamoyl sidechain).",
          note: ""
        },
        unknown: {
          title: "When the involved ICM is unknown",
          text: "Due to the higher likelihood that the involved ICM is from Group A, choose the alternative ICM from Group B or D.",
          note: "High cross-reactivity between Group C and Group A."
        }
      };

      const rule = rules[state.icm];
      switchOutput.innerHTML = `
        <div><strong>${rule.title}</strong></div>
        <div style="margin-top:10px">${rule.text}</div>
        ${rule.note ? `<div class="hint" style="margin-top:10px"><em>${rule.note}</em></div>` : ""}
      `;
      return;
    }

    icmCard.hidden = true;
    gbcaCard.hidden = false;

    if (!state.gbca) {
      switchOutput.innerHTML = `<div class="hint">Select the involved GBCA group above.</div>`;
      return;
    }

    const rules = {
      A: {
        title: "GBCA is from Group A",
        text: "Alternative GBCA from Group B.",
        note: ""
      },
      B: {
        title: "GBCA is from Group B",
        text: "Alternative GBCA from Group A.",
        note: ""
      },
      C: {
        title: "GBCA is from Group C",
        text: "Insufficient data for empiric change advice.",
        note: "Prefer specialist input or tested alternative when feasible."
      },
      unknown: {
        title: "When the involved GBCA is unknown",
        text: "It is not possible to recommend a regimen with certainty. Due to the probability of involvement, using a GBCA different from the one routinely administered is suggested.",
        note: ""
      }
    };

    const rule = rules[state.gbca];
    switchOutput.innerHTML = `
      <div><strong>${rule.title}</strong></div>
      <div style="margin-top:10px">${rule.text}</div>
      ${rule.note ? `<div class="hint" style="margin-top:10px"><em>${rule.note}</em></div>` : ""}
    `;
  }

  function renderTryptase() {
    if (!tryptaseOutput.dataset.ready) {
      tryptaseOutput.innerHTML = `<div class="hint">Enter baseline and acute values, then press Calculate.</div>`;
    }
  }

  function calcTryptase() {
    const baseline = Number(document.getElementById("baseline").value);
    const acute = Number(document.getElementById("acute").value);

    if (!isFinite(baseline) || !isFinite(acute) || baseline < 0 || acute < 0) {
      tryptaseOutput.innerHTML = `<div class="hint">Please enter valid numeric values.</div>`;
      return;
    }

    const threshold = 2 + (1.2 * baseline);
    const significant = acute >= threshold;

    tryptaseOutput.innerHTML = `
      <div><strong>Threshold:</strong> ${threshold.toFixed(2)} ng/mL</div>
      <div><strong>Acute:</strong> ${acute.toFixed(2)} ng/mL</div>
      <div style="margin-top:10px"><strong>${significant ? "Suggests/supports IHR." : "Not significant by this rule."}</strong></div>
    `;
    tryptaseOutput.dataset.ready = "1";
  }

  function renderNihr() {
    const anyChecked = Array.from(document.querySelectorAll(".nihr-check")).some((el) => el.checked);

    if (!anyChecked) {
      nihrOutput.innerHTML = `<div class="hint">No red flags selected.</div>`;
      return;
    }

    nihrOutput.innerHTML = `
      <div><strong>Red flags present</strong></div>
      <div style="margin-top:10px">Urgent specialist evaluation recommended (possible SCAR). Avoid culprit agent/class. Premedication is not recommended for NIHR.</div>
    `;
  }

  function renderAll() {
    renderFlow();
    renderSwitch();
    renderTryptase();
    renderNihr();
  }

  function resetAll() {
    state.nav = "flow";
    state.situation = "elective";
    state.reaction = "moderate";
    state.cmtype = "icm";
    state.icm = null;
    state.gbca = null;

    document.body.classList.remove("emergency");

    document.querySelectorAll('.seg__btn[data-seg="situation"]').forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === "elective");
    });

    document.querySelectorAll('.seg__btn[data-seg="reaction"]').forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === "moderate");
    });

    document.querySelectorAll('.seg__btn[data-seg="cmtype"]').forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === "icm");
    });

    document.querySelectorAll('.seg__btn[data-seg="icm"]').forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll('.seg__btn[data-seg="gbca"]').forEach((btn) => btn.classList.remove("active"));

    document.getElementById("baseline").value = "";
    document.getElementById("acute").value = "";
    document.querySelectorAll(".nihr-check").forEach((el) => (el.checked = false));

    delete tryptaseOutput.dataset.ready;

    showView("flow");
    renderAll();
  }

  // ---- EVENTS ----
  document.querySelectorAll(".bottomnav__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showView(btn.dataset.nav);
    });
  });

  document.querySelectorAll('.seg__btn[data-seg="situation"]').forEach((btn) => {
    btn.addEventListener("click", () => setSegment("situation", btn.dataset.value));
  });

  document.querySelectorAll('.seg__btn[data-seg="reaction"]').forEach((btn) => {
    btn.addEventListener("click", () => setSegment("reaction", btn.dataset.value));
  });

  document.querySelectorAll('.seg__btn[data-seg="cmtype"]').forEach((btn) => {
    btn.addEventListener("click", () => setSegment("cmtype", btn.dataset.value));
  });

  document.querySelectorAll('.seg__btn[data-seg="icm"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.icm = btn.dataset.value;
      document.querySelectorAll('.seg__btn[data-seg="icm"]').forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderSwitch();
    });
  });

  document.querySelectorAll('.seg__btn[data-seg="gbca"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.gbca = btn.dataset.value;
      document.querySelectorAll('.seg__btn[data-seg="gbca"]').forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderSwitch();
    });
  });

  document.getElementById("calcTryptase").addEventListener("click", calcTryptase);
  document.querySelectorAll(".nihr-check").forEach((el) => el.addEventListener("change", renderNihr));
  document.getElementById("resetBtn").addEventListener("click", resetAll);

  // ---- INIT ----
  showView("flow");
  renderAll();
})();
