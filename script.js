// script.js — FULL FILE (GitHub Pages compatible)
(() => {
  const state = {
    nav: "flow",
    situation: "elective", // 'elective' | 'emergency'
    reaction: "moderate",  // 'moderate' | 'mild'
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // ---- CONTENT (Flow) ----
  const FLOW_TEXT = {
    elective: {
      moderate: [
        "Postpone examination.",
        "Await allergy evaluation results.",
        "Prefer allergist-recommended alternative.",
        "Observe ≥ 30 min with IV access.",
      ],
      mild: [
        "Proceed if clinically necessary; consider risk/benefit and local protocol.",
        "Prefer using an alternative contrast agent (ideally allergist-guided if available).",
        "Routine premedication is not recommended; consider only per local protocol.",
        "Observe ≥ 30 min with IV access if any concern.",
      ],
    },
    emergency: {
      moderate: [
        "Ensure rapid response/resuscitation capability is available nearby.",
        "Choose a different CM (prefer different structural group).",
        "Premedication: optional only in severe HR with unknown culprit (emergency scenario).",
        "Observe ≥ 30 min with IV access.",
      ],
      mild: [
        "Ensure rapid response/resuscitation capability is available nearby.",
        "Prefer a different CM (prefer different structural group).",
        "Premedication is not routine; consider only if justified by urgency and local protocol.",
        "Observe ≥ 30 min with IV access if any concern.",
      ],
    },
  };

  const SAFETY_NET =
    "If a breakthrough reaction occurs → follow Poster 1 (Acute Management) and local emergency protocols.";

  // ---- NAV (bottom tabs) ----
  function setNav(nav) {
    state.nav = nav;

    // show/hide views
    $$("#app .view").forEach((v) => (v.hidden = true));
    const view = $(`#view-${nav}`);
    if (view) view.hidden = false;

    // active tab
    $$(".bottomnav__btn").forEach((b) => {
      const on = b.dataset.nav === nav;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    // ensure correct accent
    applyEmergencyAccent();
  }

  // ---- SEGMENTED CONTROLS ----
  function setSeg(seg, value) {
    state[seg] = value;

    // toggle pressed state
    $$(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      const on = btn.dataset.value === value;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    // render affected views
    if (state.nav === "flow") renderFlow(true);
    if (state.nav === "switch") renderSwitch?.(true);
    if (state.nav === "tryptase") renderTryptase?.(true);
    if (state.nav === "nihr") renderNihr?.(true);

    applyEmergencyAccent();
  }

  // ---- FLOW RENDER (DYNAMIC + TRANSITION + AUTO SCROLL) ----
  function labelSituation() {
    return state.situation === "elective" ? "Elective imaging" : "Emergency imaging";
  }
  function labelReaction() {
    return state.reaction === "moderate" ? "moderate/severe IHR" : "mild/unclear IHR";
  }

  function applyEmergencyAccent() {
    // add a red accent ONLY in flow view when emergency selected
    const flowView = $("#view-flow");
    if (!flowView) return;
    flowView.classList.toggle("is-emergency", state.situation === "emergency");
  }

  function withTransition(containerEl, fn) {
    if (!containerEl) return fn();

    // start transition
    containerEl.classList.add("is-updating");
    // allow CSS to apply class before DOM changes
    requestAnimationFrame(() => {
      fn();
      // end transition
      requestAnimationFrame(() => {
        containerEl.classList.remove("is-updating");
      });
    });
  }

  function scrollToFlowOutput() {
    const target =
      $("#flowOutput") ||
      $("#flowCard") ||
      $("#flowRecommendation") ||
      $("#view-flow .card--output") ||
      $("#view-flow");
    if (!target) return;

    // smooth scroll (mobile friendly)
    try {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      // fallback
      window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 10);
    }
  }

  function renderFlow(doScroll = false) {
    const out = $("#flowOutput");
    if (!out) return;

    const lines = (FLOW_TEXT?.[state.situation]?.[state.reaction]) || [];

    const title = `${labelSituation()} — prior ${labelReaction()}`;

    // transition wrapper = the closest card if available
    const card = out.closest(".card") || out;

    withTransition(card, () => {
      out.innerHTML = `
        <div class="output__title">${title}</div>
        <ul class="output__ul">
          ${lines.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      `;

      // safety net (if element exists)
      const sn = $("#flowSafetyNet");
      if (sn) sn.textContent = SAFETY_NET;
    });

    if (doScroll) scrollToFlowOutput();
  }

  // ---- OPTIONAL: KEEP EXISTING OTHER VIEWS SAFE ----
  // If you already have these functions in your old script, you can delete these stubs.
  function renderSwitch() {
    // no-op here (keeps your app from breaking if you removed it accidentally)
  }
  function renderTryptase() {}
  function renderNihr() {}

  // ---- RESET ----
  function resetAll() {
    setSeg("situation", "elective");
    setSeg("reaction", "moderate");
    setNav("flow");
    renderFlow(true);
  }

  // ---- INIT BINDINGS ----
  function bindUI() {
    // bottom nav
    $$(".bottomnav__btn").forEach((btn) => {
      btn.addEventListener("click", () => setNav(btn.dataset.nav));
    });

    // segmented buttons
    $$(".seg__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const seg = btn.dataset.seg;
        const val = btn.dataset.value;
        if (!seg || !val) return;
        setSeg(seg, val);
      });
    });

    // reset
    const resetBtn = $("#resetBtn") || $(".topbar__reset");
    if (resetBtn) resetBtn.addEventListener("click", resetAll);
  }

  function init() {
    bindUI();

    // set initial pressed states
    setSeg("situation", state.situation);
    setSeg("reaction", state.reaction);

    // initial nav + render
    setNav("flow");
    renderFlow(false);
  }

  // wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
