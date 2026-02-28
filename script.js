(() => {
  // ---------- STATE ----------
  const state = {
    nav: "flow",
    situation: "elective", // elective | emergency
    reaction: "moderate",  // moderate | mild
    cmtype: "icm",         // icm | gbca  (only if present in HTML)
    icm: null,             // A|B|C|D|unknown|null
    gbca: null             // A|B|C|unknown|null
  };

  // ---------- HELPERS ----------
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function smoothScrollToView(el) {
    if (!el) return;
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    // Scroll whole page (works best on mobile browsers + GitHub Pages)
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior, block: "start" });
      // Small extra nudge to account for sticky header
      requestAnimationFrame(() => {
        window.scrollBy({ top: -10, left: 0, behavior });
      });
    });
  }

  function setEmergencyAccent() {
    document.body.classList.toggle("is-emergency", state.situation === "emergency");
  }

  // ---------- NAV ----------
  function setNav(nav) {
    state.nav = nav;

    // show/hide views
    $$("#app .view").forEach((v) => (v.hidden = true));
    const view = $(`#view-${nav}`);
    if (view) view.hidden = false;

    // active bottomnav button
    $$(".bottomnav__btn").forEach((b) => b.classList.toggle("is-on", b.dataset.nav === nav));

    // UX: soft transition class (optional; harmless if CSS doesn't use it)
    const app = $("#app");
    if (app) {
      app.classList.remove("nav-fade");
      // force reflow
      void app.offsetWidth;
      app.classList.add("nav-fade");
    }

    // IMPORTANT: auto scroll to the top of the selected view
    smoothScrollToView(view);

    // render current view outputs
    if (nav === "flow") renderFlow(true);
    if (nav === "switch") renderSwitch();
    if (nav === "tryptase") renderTryptase(false);
    if (nav === "nihr") renderNihr(false);
  }

  // ---------- SEGMENTS ----------
  function setSeg(seg, value) {
    state[seg] = value;

    $$(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      const on = btn.dataset.value === value;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (seg === "situation") setEmergencyAccent();

    // render dependent outputs
    if (seg === "situation" || seg === "reaction") renderFlow(true);
    if (seg === "cmtype") {
      // toggle visible cards if present
      const icmCard = $("#icmCard");
      const gbcaCard = $("#gbcaCard");
      if (icmCard && gbcaCard) {
        const isIcm = value === "icm";
        icmCard.hidden = !isIcm;
        gbcaCard.hidden = isIcm;
      }
      renderSwitch();
    }
  }

  // ---------- FLOW OUTPUT ----------
  function renderFlow(autoScroll) {
    const out = $("#flowOutput");
    if (!out) return;

    const s = state.situation;
    const r = state.reaction;

    // content (keeps it clinically consistent + clearly different)
    const title =
      s === "elective"
        ? r === "moderate"
          ? "Elective imaging — prior moderate/severe IHR"
          : "Elective imaging — prior mild/unclear reaction"
        : r === "moderate"
        ? "Emergency imaging — prior moderate/severe IHR"
        : "Emergency imaging — prior mild/unclear reaction";

    const bullets = [];

    if (s === "elective" && r === "moderate") {
      bullets.push(
        "Postpone examination.",
        "Await allergy evaluation results.",
        "Prefer allergist-recommended alternative.",
        "Observe ≥ 30 min with IV access."
      );
    }

    if (s === "emergency" && r === "moderate") {
      bullets.push(
        "Ensure rapid response/resuscitation capability is available nearby.",
        "Choose a different CM (prefer different structural group).",
        "Premedication: optional only in severe HR with unknown culprit (emergency scenario).",
        "Observe ≥ 30 min with IV access."
      );
    }

    // Mild / unclear: keep pragmatic and safe (not pretending a guideline)
    if (s === "elective" && r === "mild") {
      bullets.push(
        "Proceed if clinically necessary; consider postponement if risk/benefit allows.",
        "Prefer switching to a different CM (prefer different structural group) when feasible.",
        "If uncertainty persists or repeated reactions → refer for allergy evaluation.",
        "Observe ≥ 30 min with IV access if concern is relevant."
      );
    }

    if (s === "emergency" && r === "mild") {
      bullets.push(
        "Proceed if clinically necessary; ensure capability to manage acute reactions.",
        "Prefer switching to a different CM (prefer different structural group) when feasible.",
        "Premedication is not routine; consider only in exceptional high-risk situations.",
        "Observe ≥ 30 min with IV access if concern is relevant."
      );
    }

    out.innerHTML = `
      <div class="output__headline">${title}</div>
      <ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      <div class="output__note">
        Educational summary based on ESUR CMSC (2025). Not an official guideline.
      </div>
    `;

    // optional: tiny auto-scroll to keep the output visible after taps
    if (autoScroll) {
      const card = out.closest(".card");
      if (card) smoothScrollToView(card);
    }
  }

  // ---------- SWITCHING ASSISTANT ----------
  const ICM_RULES = {
    A: {
      header: "ICM is from Group A",
      rec: "Alternative ICM from Group B or D (without classic carbamoyl sidechain).",
      note: "High cross-reactivity between Group A–Group C."
    },
    B: {
      header: "ICM is from Group B",
      rec: "Alternative ICM from Group A, C or D."
    },
    C: {
      header: "ICM is from Group C",
      rec: "Alternative ICM from Group B (without classic or methyl-modified carbamoyl sidechain)."
    },
    D: {
      header: "ICM is from Group D",
      rec: "Alternative ICM from Group A or B (without methyl-modified carbamoyl sidechain)."
    },
    unknown: {
      header: "When the involved ICM is unknown",
      rec: "Choose the alternative ICM from Group B or D.",
      note: "Due to the higher likelihood that the involved ICM is from Group A. High cross-reactivity between Group C–Group A."
    }
  };

  const GBCA_RULES = {
    A: { header: "GBCA is from Group A", rec: "Alternative GBCA from Group B." },
    B: { header: "GBCA is from Group B", rec: "Alternative GBCA from Group A." },
    C: {
      header: "GBCA is from Group C",
      rec: "Insufficient data for empiric change advice."
    },
    unknown: {
      header: "When the involved GBCA is unknown",
      rec:
        "It is not possible to recommend a regimen with certainty. Due to the probability of involvement, using a GBCA different from the one routinely administered is suggested."
    }
  };

  function renderSwitch() {
    const out = $("#switchOutput");
    if (!out) return;

    // detect if cmtype exists in HTML (otherwise default to ICM only)
    const hasCmType = $$(`.seg__btn[data-seg="cmtype"]`).length > 0;
    const mode = hasCmType ? state.cmtype : "icm";

    if (mode === "gbca") {
      const key = state.gbca || null;
      if (!key) {
        out.innerHTML = `<div class="output__muted">Select the involved GBCA group (A–C) or choose <strong>Unknown</strong>.</div>`;
        return;
      }
      const rule = GBCA_RULES[key];
      out.innerHTML = `
        <div class="output__headline">${rule.header}</div>
        <div class="output__text">${rule.rec}</div>
        <div class="output__note">Cross-reactivity is variable → testing preferred when feasible.</div>
      `;
      return;
    }

    // ICM
    const key = state.icm || null;
    if (!key) {
      out.innerHTML = `<div class="output__muted">Select the involved ICM group (A–D) or choose <strong>Unknown</strong>.</div>`;
      return;
    }
    const rule = ICM_RULES[key];
    out.innerHTML = `
      <div class="output__headline">${rule.header}</div>
      <div class="output__text">${rule.rec}</div>
      ${rule.note ? `<div class="output__note">${rule.note}</div>` : ""}
      <div class="output__note">Cross-reactivity is variable → testing preferred when feasible.</div>
    `;
  }

  // ---------- TRYPTASE ----------
  function renderTryptase(ready) {
    const out = $("#tryptaseOutput");
    if (!out) return;
    if (!ready) {
      out.innerHTML = `<div class="output__muted">Enter baseline and acute tryptase to check the rule: <strong>acute ≥ 2 + (1.2 × baseline)</strong>.</div>`;
    }
  }

  function calcTryptase() {
    const baseline = Number($("#baseline")?.value || "");
    const acute = Number($("#acute")?.value || "");
    const out = $("#tryptaseOutput");
    if (!out) return;

    if (!isFinite(baseline) || !isFinite(acute) || baseline <= 0 || acute <= 0) {
      out.innerHTML = `<div class="output__muted">Please enter valid positive numbers for baseline and acute tryptase.</div>`;
      return;
    }

    const threshold = 2 + 1.2 * baseline;
    const significant = acute >= threshold;

    out.innerHTML = `
      <div class="output__headline">Rule check</div>
      <ul>
        <li>Threshold = <strong>2 + (1.2 × ${baseline.toFixed(2)})</strong> = <strong>${threshold.toFixed(2)} ng/mL</strong></li>
        <li>Acute = <strong>${acute.toFixed(2)} ng/mL</strong></li>
      </ul>
      <div class="output__text">
        ${significant
          ? `<strong>Suggests/supports IHR</strong> (rule met).`
          : `<strong>Not significant by this rule</strong> (rule not met).`}
      </div>
      <div class="output__note">Educational tool. Interpret in clinical context.</div>
    `;
  }

  // ---------- NIHR ----------
  function renderNihr(ready) {
    const out = $("#nihrOutput");
    if (!out) return;
    if (!ready) {
      out.innerHTML = `<div class="output__muted">Select red flags to trigger an urgent referral warning.</div>`;
      return;
    }

    const any = $$(".nihr-check").some((c) => c.checked);
    if (any) {
      out.innerHTML = `
        <div class="output__headline">Red flag(s) present</div>
        <div class="output__text"><strong>Urgent specialist referral</strong> recommended (possible SCAR).</div>
        <div class="output__note">Avoid the culprit agent/class. Premedication is not recommended for NIHR.</div>
      `;
    } else {
      out.innerHTML = `
        <div class="output__headline">No red flags selected</div>
        <div class="output__text">Most NIHR are cutaneous and T-cell mediated; monitor and refer if symptoms progress.</div>
        <div class="output__note">Premedication is not recommended for NIHR.</div>
      `;
    }
  }

  // ---------- RESET (fixes “ghost output”) ----------
  function resetAll() {
    // reset state
    state.situation = "elective";
    state.reaction = "moderate";
    state.cmtype = "icm";
    state.icm = null;
    state.gbca = null;

    // seg buttons
    setSeg("situation", "elective");
    setSeg("reaction", "moderate");

    // cmtype (if exists)
    const hasCmType = $$(`.seg__btn[data-seg="cmtype"]`).length > 0;
    if (hasCmType) setSeg("cmtype", "icm");

    // clear ICM buttons
    $$(`.seg__btn[data-seg="icm"]`).forEach((btn) => {
      btn.classList.remove("is-on");
      btn.setAttribute("aria-pressed", "false");
    });

    // clear GBCA buttons
    $$(`.seg__btn[data-seg="gbca"]`).forEach((btn) => {
      btn.classList.remove("is-on");
      btn.setAttribute("aria-pressed", "false");
    });

    // clear inputs
    const baselineEl = $("#baseline");
    const acuteEl = $("#acute");
    if (baselineEl) baselineEl.value = "";
    if (acuteEl) acuteEl.value = "";

    // clear outputs
    renderFlow(false);

    const sw = $("#switchOutput");
    if (sw) sw.innerHTML = `<div class="output__muted">Select the involved ICM group (A–D) or choose <strong>Unknown</strong>.</div>`;

    renderTryptase(false);

    $$(".nihr-check").forEach((c) => (c.checked = false));
    renderNihr(false);

    // go to flow + scroll
    setNav("flow");
  }

  // ---------- EVENTS ----------
  function wireEvents() {
    // bottom nav
    $$(".bottomnav__btn").forEach((btn) => {
      btn.addEventListener("click", () => setNav(btn.dataset.nav));
    });

    // segmented buttons
    $$(".seg__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const seg = btn.dataset.seg;
        const value = btn.dataset.value;

        if (seg === "icm") {
          state.icm = value;
          $$(`.seg__btn[data-seg="icm"]`).forEach((b) => {
            const on = b.dataset.value === value;
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", on ? "true" : "false");
          });
          renderSwitch();
          // keep output visible
          const card = $("#switchOutput")?.closest(".card");
          if (card) smoothScrollToView(card);
          return;
        }

        if (seg === "gbca") {
          state.gbca = value;
          $$(`.seg__btn[data-seg="gbca"]`).forEach((b) => {
            const on = b.dataset.value === value;
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", on ? "true" : "false");
          });
          renderSwitch();
          const card = $("#switchOutput")?.closest(".card");
          if (card) smoothScrollToView(card);
          return;
        }

        setSeg(seg, value);
      });
    });

    // reset
    $("#resetBtn")?.addEventListener("click", resetAll);

    // tryptase
    $("#calcTryptase")?.addEventListener("click", () => {
      calcTryptase();
      const card = $("#tryptaseOutput")?.closest(".card");
      if (card) smoothScrollToView(card);
    });

    // nihr checks
    $$(".nihr-check").forEach((c) => {
      c.addEventListener("change", () => {
        renderNihr(true);
        const card = $("#nihrOutput")?.closest(".card");
        if (card) smoothScrollToView(card);
      });
    });
  }

  // ---------- INIT ----------
  function init() {
    setEmergencyAccent();
    wireEvents();

    // initial renders
    renderFlow(false);
    renderSwitch();
    renderTryptase(false);
    renderNihr(false);

    // ensure correct view
    setNav("flow");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
