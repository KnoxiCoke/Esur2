document.addEventListener("DOMContentLoaded", function () {
  const state = {
    nav: "flow",
    situation: "elective",
    reaction: "moderate",
    cmtype: "icm",
    icm: null,
    gbca: null,
    lang: "en"
  };

  const i18n = {
    en: {
      app_title: "ESUR CM Hypersensitivity Support",
      reset: "Reset",

      disclaimer_line1: "Educational tool based on ESUR CMSC guidance (2025).",
      disclaimer_line2: "Information only. Does not replace clinical judgement or local protocols. No patient data stored.",

      flow_title: "Guidance",
      flow_subtitle: "Quick guidance for prior contrast reactions.",
      flow_step1: "Step 1 — Situation",
      flow_step2: "Step 2 — Prior reaction",

      elective: "Elective",
      emergency: "Emergency",
      moderate_severe: "Moderate / Severe",
      mild_unclear: "Mild / Unclear",

      recommendation: "Recommendation",
      safety_net: "Safety net",
      flow_safety: "If a reaction occurs → follow Poster 1 (Acute Management) and local protocols.",

      switch_title: "Switch",
      switch_subtitle: "Check possible alternative contrast groups.",
      contrast_type: "Contrast type",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRI)",
      icm_title: "ICM (Iodine-based)",
      gbca_title: "GBCA (Macrocyclic)",
      possible_alternatives: "Possible alternatives",
      safety_note: "Safety note",
      switch_safety_note: "Cross-reactivity is variable. Testing is preferred when available.",
      unknown: "Unknown",
      icm_unknown_hint: "Use when the involved ICM is not known.",
      gbca_unknown_hint: "Use when the involved GBCA is not known.",

      tryptase_title: "Tryptase Rule",
      tryptase_subtitle: "Check the tryptase rule used for suspected IHR.",
      enter_values: "Enter values",
      calculate: "Calculate",
      result: "Result",

      nihr_title: "NIHR Check",
      nihr_subtitle: "Check for possible delayed hypersensitivity.",
      red_flags: "Red flags",
      blistering: "Blistering",
      mucosal_involvement: "Mucosal involvement",
      erosions: "Erosions",
      hemorrhagic_lesions: "Hemorrhagic lesions",
      assessment: "Assessment",

      icm_hint:
        "Group A: Iohexol, Iodixanol, Iomeprol, Ioversol · Group B: Iopamidol · Group C: Iopromide · Group D: Iobitridol",
      gbca_hint:
        "Group A: Gadoterate meglumine · Group B: Gadobutrol, Gadoteridol · Group C: Gadopiclenol",

      flow_titles: {
        elective_moderate: "Elective imaging — prior moderate/severe reaction",
        elective_mild: "Elective imaging — prior mild/unclear reaction",
        emergency_moderate: "Emergency imaging — prior moderate/severe reaction",
        emergency_mild: "Emergency imaging — prior mild/unclear reaction"
      },

      flow_bullets: {
        elective_moderate: [
          "Consider postponing the examination.",
          "Allergy evaluation may be considered when available.",
          "A different contrast agent may be considered.",
          "Observation ≥ 30 min with IV access may be appropriate."
        ],
        elective_mild: [
          "Proceed if clinically needed; postponement may be considered.",
          "A different contrast agent may be considered.",
          "Allergy evaluation may be considered if reactions recur.",
          "Observation ≥ 30 min with IV access may be appropriate."
        ],
        emergency_moderate: [
          "Ensure resuscitation capability nearby.",
          "A different contrast agent may be considered.",
          "Premedication may be considered in severe reactions when the culprit agent is unknown.",
          "Observation ≥ 30 min with IV access may be appropriate."
        ],
        emergency_mild: [
          "If imaging is clinically needed, local protocols apply.",
          "A different contrast agent may be considered.",
          "Premedication is not routine.",
          "Observation ≥ 30 min with IV access may be appropriate."
        ]
      },

      switch_placeholder_icm: "Select the involved ICM group above.",
      switch_placeholder_gbca: "Select the involved GBCA group above.",

      icm_rules: {
        A: {
          title: "Group A selected",
          text: "Possible alternative ICM groups: B or D.",
          note: "Cross-reactivity between groups may occur."
        },
        B: {
          title: "Group B selected",
          text: "Possible alternative ICM groups: A, C or D.",
          note: "Cross-reactivity between groups may occur."
        },
        C: {
          title: "Group C selected",
          text: "Possible alternative ICM groups: B.",
          note: "Cross-reactivity between groups may occur."
        },
        D: {
          title: "Group D selected",
          text: "Possible alternative ICM groups: A or B.",
          note: "Cross-reactivity between groups may occur."
        },
        unknown: {
          title: "ICM unknown",
          text: "Possible alternative ICM groups: B or D.",
          note: "Group A agents are commonly used."
        }
      },

      gbca_rules: {
        A: {
          title: "Group A selected",
          text: "A GBCA from Group B may be considered.",
          note: "Specialist evaluation is preferred when available."
        },
        B: {
          title: "Group B selected",
          text: "A GBCA from Group A may be considered.",
          note: "Specialist evaluation is preferred when available."
        },
        C: {
          title: "Group C selected",
          text: "A GBCA from Group A or B may be considered.",
          note: "Specialist evaluation is preferred when available."
        },
        unknown: {
          title: "GBCA unknown",
          text: "Use of a different GBCA may be considered.",
          note: "Specialist evaluation is preferred when available."
        }
      },

      tryptase_default: "Enter baseline and acute values, then press Calculate.",
      tryptase_invalid: "Please enter valid numeric values.",
      tryptase_threshold: "Threshold",
      tryptase_acute: "Acute",
      tryptase_positive: "Result may support possible IHR.",
      tryptase_negative: "Result does not clearly support IHR.",

      nihr_default: "No red flags selected.",
      nihr_positive_title: "Possible severe cutaneous reaction (SCAR).",
      nihr_positive_text: "Urgent specialist evaluation should be considered."
    },

    de: {
      app_title: "ESUR KM-Hypersensitivitäts-Tool",
      reset: "Reset",

      disclaimer_line1: "Didaktisches Tool auf Grundlage der ESUR-CMSC-Guidance (2025).",
      disclaimer_line2: "Nur zur Information. Ersetzt nicht klinische Beurteilung oder lokale Protokolle. Keine Speicherung von Patientendaten.",

      flow_title: "Orientierung",
      flow_subtitle: "Kurze Orientierung bei früheren Kontrastmittelreaktionen.",
      flow_step1: "Schritt 1 — Situation",
      flow_step2: "Schritt 2 — Frühere Reaktion",

      elective: "Elektiv",
      emergency: "Notfall",
      moderate_severe: "Moderat / Schwer",
      mild_unclear: "Mild / Unklar",

      recommendation: "Hinweis",
      safety_net: "Safety Net",
      flow_safety: "Wenn eine Reaktion auftritt → Poster 1 (Akutmanagement) und lokale Protokolle beachten.",

      switch_title: "Switch",
      switch_subtitle: "Mögliche alternative Kontrastmittelgruppen prüfen.",
      contrast_type: "Kontrastmitteltyp",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRT)",
      icm_title: "ICM (jodhaltig)",
      gbca_title: "GBCA (makrozyklisch)",
      possible_alternatives: "Mögliche Alternativen",
      safety_note: "Sicherheitshinweis",
      switch_safety_note: "Kreuzreaktionen sind variabel. Wenn möglich, ist eine Testung vorzuziehen.",
      unknown: "Unbekannt",
      icm_unknown_hint: "Verwenden, wenn das beteiligte ICM nicht bekannt ist.",
      gbca_unknown_hint: "Verwenden, wenn das beteiligte GBCA nicht bekannt ist.",

      tryptase_title: "Tryptase-Regel",
      tryptase_subtitle: "Prüfung der Tryptase-Regel bei Verdacht auf IHR.",
      enter_values: "Werte eingeben",
      calculate: "Berechnen",
      result: "Ergebnis",

      nihr_title: "NIHR-Check",
      nihr_subtitle: "Prüfung auf mögliche verzögerte Hypersensitivität.",
      red_flags: "Red Flags",
      blistering: "Blasenbildung",
      mucosal_involvement: "Schleimhautbeteiligung",
      erosions: "Erosionen",
      hemorrhagic_lesions: "Hämorrhagische Läsionen",
      assessment: "Beurteilung",

      icm_hint:
        "Gruppe A: Iohexol, Iodixanol, Iomeprol, Ioversol · Gruppe B: Iopamidol · Gruppe C: Iopromide · Gruppe D: Iobitridol",
      gbca_hint:
        "Gruppe A: Gadoterat-Meglumin · Gruppe B: Gadobutrol, Gadoteridol · Gruppe C: Gadopiclenol",

      flow_titles: {
        elective_moderate: "Elektive Bildgebung — frühere moderate/schwere Reaktion",
        elective_mild: "Elektive Bildgebung — frühere milde/unklare Reaktion",
        emergency_moderate: "Notfallbildgebung — frühere moderate/schwere Reaktion",
        emergency_mild: "Notfallbildgebung — frühere milde/unklare Reaktion"
      },

      flow_bullets: {
        elective_moderate: [
          "Eine Verschiebung der Untersuchung kann erwogen werden.",
          "Eine allergologische Abklärung kann berücksichtigt werden, wenn verfügbar.",
          "Ein anderes Kontrastmittel kann erwogen werden.",
          "Eine Beobachtung ≥ 30 min bei venösem Zugang kann sinnvoll sein."
        ],
        elective_mild: [
          "Bei klinischer Notwendigkeit kann untersucht werden; eine Verschiebung kommt in Betracht.",
          "Ein anderes Kontrastmittel kann erwogen werden.",
          "Bei wiederholten Reaktionen kann eine allergologische Abklärung erwogen werden.",
          "Eine Beobachtung ≥ 30 min bei venösem Zugang kann sinnvoll sein."
        ],
        emergency_moderate: [
          "Reanimationsfähigkeit in unmittelbarer Nähe sicherstellen.",
          "Ein anderes Kontrastmittel kann erwogen werden.",
          "Eine Premedikation kann bei schweren Reaktionen mit unbekanntem Auslöser erwogen werden.",
          "Eine Beobachtung ≥ 30 min bei venösem Zugang kann sinnvoll sein."
        ],
        emergency_mild: [
          "Bei klinischer Notwendigkeit gelten lokale Protokolle.",
          "Ein anderes Kontrastmittel kann erwogen werden.",
          "Eine routinemässige Premedikation ist nicht vorgesehen.",
          "Eine Beobachtung ≥ 30 min bei venösem Zugang kann sinnvoll sein."
        ]
      },

      switch_placeholder_icm: "Bitte oben die beteiligte ICM-Gruppe auswählen.",
      switch_placeholder_gbca: "Bitte oben die beteiligte GBCA-Gruppe auswählen.",

      icm_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Mögliche alternative ICM-Gruppen: B oder D.",
          note: "Kreuzreaktionen zwischen Gruppen sind möglich."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Mögliche alternative ICM-Gruppen: A, C oder D.",
          note: "Kreuzreaktionen zwischen Gruppen sind möglich."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Mögliche alternative ICM-Gruppen: B.",
          note: "Kreuzreaktionen zwischen Gruppen sind möglich."
        },
        D: {
          title: "Gruppe D ausgewählt",
          text: "Mögliche alternative ICM-Gruppen: A oder B.",
          note: "Kreuzreaktionen zwischen Gruppen sind möglich."
        },
        unknown: {
          title: "ICM unbekannt",
          text: "Mögliche alternative ICM-Gruppen: B oder D.",
          note: "Substanzen der Gruppe A werden häufig verwendet."
        }
      },

      gbca_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Ein GBCA aus Gruppe B kann erwogen werden.",
          note: "Wenn möglich, ist eine fachärztliche Abklärung vorzuziehen."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Ein GBCA aus Gruppe A kann erwogen werden.",
          note: "Wenn möglich, ist eine fachärztliche Abklärung vorzuziehen."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Ein GBCA aus Gruppe A oder B kann erwogen werden.",
          note: "Wenn möglich, ist eine fachärztliche Abklärung vorzuziehen."
        },
        unknown: {
          title: "GBCA unbekannt",
          text: "Ein anderes GBCA kann erwogen werden.",
          note: "Wenn möglich, ist eine fachärztliche Abklärung vorzuziehen."
        }
      },

      tryptase_default: "Bitte Baseline- und Akutwert eingeben und dann Berechnen drücken.",
      tryptase_invalid: "Bitte gültige Zahlenwerte eingeben.",
      tryptase_threshold: "Schwellenwert",
      tryptase_acute: "Akutwert",
      tryptase_positive: "Das Ergebnis kann den Verdacht auf eine IHR unterstützen.",
      tryptase_negative: "Das Ergebnis stützt eine IHR nicht eindeutig.",

      nihr_default: "Keine Red Flags ausgewählt.",
      nihr_positive_title: "Mögliche schwere kutane Reaktion (SCAR).",
      nihr_positive_text: "Eine dringliche fachärztliche Abklärung sollte erwogen werden."
    }
  };

  const views = {
    flow: document.getElementById("view-flow"),
    switch: document.getElementById("view-switch"),
    tryptase: document.getElementById("view-tryptase"),
    nihr: document.getElementById("view-nihr")
  };

  const flowOutput = document.getElementById("flowOutput");
  const flowSafety = document.getElementById("flowSafety");
  const switchOutput = document.getElementById("switchOutput");
  const tryptaseOutput = document.getElementById("tryptaseOutput");
  const nihrOutput = document.getElementById("nihrOutput");

  const icmCard = document.getElementById("icmCard");
  const gbcaCard = document.getElementById("gbcaCard");

  function t(key) {
    return i18n[state.lang][key];
  }

  function applyStaticTranslations() {
    document.documentElement.lang = state.lang;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (i18n[state.lang][key]) {
        el.textContent = i18n[state.lang][key];
      }
    });

    document.getElementById("icmHint").textContent = t("icm_hint");
    document.getElementById("gbcaHint").textContent = t("gbca_hint");

    document.getElementById("icm-group-a-names").innerHTML = "Iohexol • Iodixanol • Iomeprol • Ioversol";
    document.getElementById("icm-group-b-names").innerHTML = "Iopamidol";
    document.getElementById("icm-group-c-names").innerHTML = "Iopromide";
    document.getElementById("icm-group-d-names").innerHTML = "Iobitridol";

    document.getElementById("gbca-group-a-names").innerHTML =
      state.lang === "en" ? "Gadoterate meglumine" : "Gadoterat-Meglumin";
    document.getElementById("gbca-group-b-names").innerHTML = "Gadobutrol • Gadoteridol";
    document.getElementById("gbca-group-c-names").innerHTML = "Gadopiclenol";

    document.getElementById("baseline").placeholder =
      state.lang === "en" ? "Baseline (ng/mL)" : "Baseline (ng/mL)";
    document.getElementById("acute").placeholder =
      state.lang === "en" ? "Acute (ng/mL)" : "Akut (ng/mL)";
  }

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
    const key = `${state.situation}_${state.reaction}`;
    const title = t("flow_titles")[key];
    const bullets = t("flow_bullets")[key];

    flowOutput.innerHTML = `
      <div><strong>${title}</strong></div>
      <ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
    `;

    flowSafety.textContent = t("flow_safety");
  }

  function renderSwitch() {
    if (state.cmtype === "icm") {
      icmCard.hidden = false;
      gbcaCard.hidden = true;

      if (!state.icm) {
        switchOutput.innerHTML = `<div class="hint">${t("switch_placeholder_icm")}</div>`;
        return;
      }

      const rule = t("icm_rules")[state.icm];
      switchOutput.innerHTML = `
        <div><strong>${rule.title}</strong></div>
        <div style="margin-top:10px">${rule.text}</div>
        <div class="hint" style="margin-top:10px">${rule.note}</div>
      `;
      return;
    }

    icmCard.hidden = true;
    gbcaCard.hidden = false;

    if (!state.gbca) {
      switchOutput.innerHTML = `<div class="hint">${t("switch_placeholder_gbca")}</div>`;
      return;
    }

    const rule = t("gbca_rules")[state.gbca];
    switchOutput.innerHTML = `
      <div><strong>${rule.title}</strong></div>
      <div style="margin-top:10px">${rule.text}</div>
      <div class="hint" style="margin-top:10px">${rule.note}</div>
    `;
  }

  function renderTryptase() {
    if (!tryptaseOutput.dataset.ready) {
      tryptaseOutput.innerHTML = `<div class="hint">${t("tryptase_default")}</div>`;
    }
  }

  function calcTryptase() {
    const baseline = Number(document.getElementById("baseline").value);
    const acute = Number(document.getElementById("acute").value);

    if (!isFinite(baseline) || !isFinite(acute) || baseline < 0 || acute < 0) {
      tryptaseOutput.innerHTML = `<div class="hint">${t("tryptase_invalid")}</div>`;
      return;
    }

    const threshold = 2 + (1.2 * baseline);
    const significant = acute >= threshold;

    tryptaseOutput.innerHTML = `
      <div><strong>${t("tryptase_threshold")}:</strong> ${threshold.toFixed(2)} ng/mL</div>
      <div><strong>${t("tryptase_acute")}:</strong> ${acute.toFixed(2)} ng/mL</div>
      <div style="margin-top:10px"><strong>${significant ? t("tryptase_positive") : t("tryptase_negative")}</strong></div>
    `;

    tryptaseOutput.dataset.ready = "1";
  }

  function renderNihr() {
    const anyChecked = Array.from(document.querySelectorAll(".nihr-check")).some((el) => el.checked);

    if (!anyChecked) {
      nihrOutput.innerHTML = `<div class="hint">${t("nihr_default")}</div>`;
      return;
    }

    nihrOutput.innerHTML = `
      <div><strong>${t("nihr_positive_title")}</strong></div>
      <div style="margin-top:10px">${t("nihr_positive_text")}</div>
    `;
  }

  function renderAll() {
    applyStaticTranslations();
    renderFlow();
    renderSwitch();
    renderTryptase();
    renderNihr();
  }

  function clearButtons(seg) {
    document.querySelectorAll(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      btn.classList.remove("active");
    });
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

    clearButtons("icm");
    clearButtons("gbca");

    document.getElementById("baseline").value = "";
    document.getElementById("acute").value = "";
    document.querySelectorAll(".nihr-check").forEach((el) => (el.checked = false));

    delete tryptaseOutput.dataset.ready;

    showView("flow");
    renderAll();
  }

  // Bottom nav
  document.querySelectorAll(".bottomnav__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showView(btn.dataset.nav);
    });
  });

  // Segments
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
      clearButtons("icm");
      btn.classList.add("active");
      renderSwitch();
    });
  });

  document.querySelectorAll('.seg__btn[data-seg="gbca"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.gbca = btn.dataset.value;
      clearButtons("gbca");
      btn.classList.add("active");
      renderSwitch();
    });
  });

  // Tryptase
  document.getElementById("calcTryptase").addEventListener("click", calcTryptase);

  // NIHR
  document.querySelectorAll(".nihr-check").forEach((el) => el.addEventListener("change", renderNihr));

  // Reset
  document.getElementById("resetBtn").addEventListener("click", resetAll);

  // Language switch with live refresh of calculated / selected outputs
  document.getElementById("lang-en").addEventListener("click", () => {
    state.lang = "en";
    document.getElementById("lang-en").classList.add("active");
    document.getElementById("lang-de").classList.remove("active");
    renderAll();

    if (document.getElementById("baseline").value !== "" && document.getElementById("acute").value !== "") {
      calcTryptase();
    }
    renderNihr();
  });

  document.getElementById("lang-de").addEventListener("click", () => {
    state.lang = "de";
    document.getElementById("lang-de").classList.add("active");
    document.getElementById("lang-en").classList.remove("active");
    renderAll();

    if (document.getElementById("baseline").value !== "" && document.getElementById("acute").value !== "") {
      calcTryptase();
    }
    renderNihr();
  });

  // Init
  showView("flow");
  setBodyMode();
  renderAll();
});
