document.addEventListener("DOMContentLoaded", function () {
  const state = {
    nav: "flow",
    situation: "elective",
    reaction: "moderate", // mild | moderate | severe
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
      flow_subtitle: "Quick guidance for prior contrast hypersensitivity reactions.",
      flow_step1: "Step 1 — Situation",
      flow_step2: "Step 2 — Prior reaction severity",

      elective: "Elective",
      emergency: "Emergency",
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe",

      recommendation: "Recommendation",
      safety_net: "Safety net",
      flow_safety:
        "If a reaction occurs: follow acute management guidance and local protocols. ESUR recommends readiness, monitoring, IV access when indicated, and escalation according to severity.",

      switch_title: "Switch",
      switch_subtitle: "Empiric switch guidance only. Allergy-based selection is preferred when available.",
      contrast_type: "Contrast type",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRI)",
      icm_title: "ICM (iodine-based)",
      gbca_title: "GBCA",
      possible_alternatives: "Possible alternatives",
      safety_note: "Safety note",
      switch_safety_note:
        "Cross-reactivity is variable. ESUR states that empiric switching is not robustly evidence-based; allergy evaluation with testing is preferred when available.",
      unknown: "Unknown",
      icm_unknown_hint: "Use when the involved ICM is not known.",
      gbca_unknown_hint: "Use when the involved GBCA is not known.",
      switch_nonvalidated:
        "This grouping is optional practical guidance only and should not be presented as a validated rule.",

      tryptase_title: "Tryptase Rule",
      tryptase_subtitle:
        "For moderate to severe immediate hypersensitivity reactions (IHR): sample 1 as early as possible during the reaction, sample 2 at 1–2 h after the first sample but no later than 4 h after symptom onset, and sample 3 more than 24 h after complete resolution as baseline.",
      enter_values: "Enter values",
      calculate: "Calculate",
      result: "Result",

      nihr_title: "NIHR Check",
      nihr_subtitle: "Check for danger signs suggesting severe delayed cutaneous reaction (SCAR).",
      red_flags: "Danger signs",
      blistering: "Blistering",
      mucosal_involvement: "Mucosal involvement",
      erosions: "Erosions",
      hemorrhagic_lesions: "Hemorrhagic lesions",
      skin_disruption: "Skin disruption",
      fever: "High fever",
      organ_values: "Abnormal liver / kidney values",
      lymphadenopathy: "Lymphadenopathy",
      assessment: "Assessment",

      icm_hint:
        "Group A: Iohexol, Iodixanol, Iomeprol, Ioversol · Group B: Iopamidol · Group C: Iopromide · Group D: Iobitridol",
      gbca_hint:
        "Group A: Gadoterate meglumine · Group B: Gadobutrol, Gadoteridol · Group C: Gadopiclenol",

      flow_titles: {
        elective_mild: "Elective imaging — prior mild IHR",
        elective_moderate: "Elective imaging — prior moderate IHR",
        elective_severe: "Elective imaging — prior severe IHR",
        emergency_mild: "Emergency imaging — prior mild IHR",
        emergency_moderate: "Emergency imaging — prior moderate IHR",
        emergency_severe: "Emergency imaging — prior severe IHR"
      },

      flow_bullets: {
        elective_mild: [
          "Interview the patient about the previous reaction.",
          "Optimize allergy documentation in the electronic health record.",
          "Apply the advice of the drug allergy specialist when available, or consider a different contrast agent if the culprit agent is known.",
          "When contrast is administered, observe the patient for at least 30 min with IV access in place.",
          "Be prepared and vigilant for recurrence."
        ],
        elective_moderate: [
          "Refer the patient to a drug allergy specialist if not done before.",
          "Optimize allergy documentation in the electronic health record.",
          "Postpone elective imaging to await the allergy analysis.",
          "Apply the advice of the drug allergy specialist for a safer contrast agent.",
          "When contrast is administered, observe the patient for at least 30 min with IV access in place.",
          "Be prepared and vigilant for recurrence."
        ],
        elective_severe: [
          "Refer the patient to a drug allergy specialist if not done before.",
          "Optimize allergy documentation in the electronic health record.",
          "Have a trained rapid response or resuscitation team member nearby.",
          "Postpone elective imaging to await the allergy analysis.",
          "Apply the advice of the drug allergy specialist for a safer contrast agent.",
          "When contrast is administered, observe the patient for at least 30 min with IV access in place.",
          "Be prepared and vigilant for recurrence."
        ],
        emergency_mild: [
          "Interview the patient about the previous reaction if possible.",
          "Optimize allergy documentation in the electronic health record.",
          "Consider a different contrast agent if the culprit agent is known.",
          "When contrast is administered, observe the patient for at least 30 min with IV access in place.",
          "Be prepared and vigilant for recurrence."
        ],
        emergency_moderate: [
          "Refer to a drug allergy specialist later if not already done.",
          "Optimize allergy documentation in the electronic health record.",
          "Have a trained imaging or emergency room physician nearby.",
          "Choose a different contrast agent if the culprit agent is known.",
          "When contrast is administered, observe the patient for at least 30 min with IV access in place.",
          "Be prepared and vigilant for recurrence."
        ],
        emergency_severe: [
          "Refer to a drug allergy specialist later if not already done.",
          "Optimize allergy documentation in the electronic health record.",
          "Have a trained rapid response or resuscitation team member nearby.",
          "Consider premedication according to EAACI guidance.",
          "Choose a different contrast agent if the culprit agent is known.",
          "When contrast is administered, observe the patient for at least 30 min with IV access in place.",
          "Be prepared and vigilant for recurrence."
        ]
      },

      switch_placeholder_icm: "Select the involved ICM group above.",
      switch_placeholder_gbca: "Select the involved GBCA group above.",

      icm_rules: {
        A: {
          title: "Group A selected",
          text: "Possible empiric alternative ICM groups: B or D.",
          note: "Cross-reactivity may occur. Allergy-guided selection is preferred."
        },
        B: {
          title: "Group B selected",
          text: "Possible empiric alternative ICM groups: A, C or D.",
          note: "Cross-reactivity may occur. Allergy-guided selection is preferred."
        },
        C: {
          title: "Group C selected",
          text: "Possible empiric alternative ICM group: B.",
          note: "Cross-reactivity may occur. Allergy-guided selection is preferred."
        },
        D: {
          title: "Group D selected",
          text: "Possible empiric alternative ICM groups: A or B.",
          note: "Cross-reactivity may occur. Allergy-guided selection is preferred."
        },
        unknown: {
          title: "ICM unknown",
          text: "Possible empiric alternative ICM groups: B or D.",
          note: "This is practical guidance only; Group A agents are commonly used."
        }
      },

      gbca_rules: {
        A: {
          title: "Group A selected",
          text: "A GBCA from Group B may be considered as empiric practical guidance.",
          note: "Specialist evaluation is preferred when available."
        },
        B: {
          title: "Group B selected",
          text: "A GBCA from Group A may be considered as empiric practical guidance.",
          note: "Specialist evaluation is preferred when available."
        },
        C: {
          title: "Group C selected",
          text: "Insufficient data for empiric change advice.",
          note: "Specialist evaluation is preferred."
        },
        unknown: {
          title: "GBCA unknown",
          text: "If urgent re-administration is necessary, use of a different GBCA may be considered.",
          note: "This is practical guidance only; specialist evaluation is preferred."
        }
      },

      tryptase_default:
        "Enter the acute tryptase value and the baseline value (>24 h after complete symptom resolution), then press Calculate.",
      tryptase_invalid: "Please enter valid numeric values.",
      tryptase_threshold: "Threshold",
      tryptase_acute: "Acute",
      tryptase_formula: "Relevant acute increase if acute ≥ 2 ng/mL + (1.2 × baseline).",
      tryptase_positive: "Result supports a significant acute tryptase rise.",
      tryptase_negative: "Result does not show a significant acute tryptase rise.",
      tryptase_note:
        "Interpret together with timing and clinical context. A normal tryptase result does not exclude true immediate hypersensitivity reaction.",

      nihr_default: "No danger signs selected.",
      nihr_positive_title: "Possible severe cutaneous adverse reaction (SCAR).",
      nihr_positive_text:
        "Urgent drug allergy / dermatology assessment is indicated. Choose an alternative imaging modality when possible. Do not administer the contrast group to which the severe reaction occurred."
    },

    de: {
      app_title: "ESUR KM-Hypersensitivitäts-Tool",
      reset: "Reset",

      disclaimer_line1: "Didaktisches Tool auf Grundlage der ESUR-CMSC-Guidance (2025).",
      disclaimer_line2: "Nur zur Information. Ersetzt nicht klinische Beurteilung oder lokale Protokolle. Keine Speicherung von Patientendaten.",

      flow_title: "Orientierung",
      flow_subtitle: "Orientierung bei früheren Kontrastmittel-Hypersensitivitätsreaktionen.",
      flow_step1: "Schritt 1 — Situation",
      flow_step2: "Schritt 2 — Schweregrad der früheren Reaktion",

      elective: "Elektiv",
      emergency: "Notfall",
      mild: "Mild",
      moderate: "Moderat",
      severe: "Schwer",

      recommendation: "Empfehlung",
      safety_net: "Safety Net",
      flow_safety:
        "Wenn eine Reaktion auftritt: Akutmanagement und lokale Protokolle befolgen. ESUR betont Bereitschaft, Überwachung, venösen Zugang bei Bedarf und Eskalation je nach Schweregrad.",

      switch_title: "Switch",
      switch_subtitle: "Nur empirische Switch-Orientierung. Allergologisch gestützte Auswahl ist vorzuziehen, wenn verfügbar.",
      contrast_type: "Kontrastmitteltyp",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRT)",
      icm_title: "ICM (jodhaltig)",
      gbca_title: "GBCA",
      possible_alternatives: "Mögliche Alternativen",
      safety_note: "Sicherheitshinweis",
      switch_safety_note:
        "Kreuzreaktionen sind variabel. ESUR betont, dass empirisches Wechseln nicht robust evidenzbasiert ist; eine allergologische Abklärung mit Testung ist vorzuziehen, wenn verfügbar.",
      unknown: "Unbekannt",
      icm_unknown_hint: "Verwenden, wenn das beteiligte ICM nicht bekannt ist.",
      gbca_unknown_hint: "Verwenden, wenn das beteiligte GBCA nicht bekannt ist.",
      switch_nonvalidated:
        "Diese Gruppierung ist nur optionale praktische Orientierung und keine validierte Regel.",

      tryptase_title: "Tryptase-Regel",
      tryptase_subtitle:
        "Für moderate bis schwere unmittelbare Hypersensitivitätsreaktionen (IHR): Probe 1 so früh wie möglich während der Reaktion, Probe 2 nach 1–2 h nach der ersten Probe, jedoch spätestens innerhalb von 4 h nach Symptombeginn, und Probe 3 mehr als 24 h nach vollständigem Abklingen als Baseline.",
      enter_values: "Werte eingeben",
      calculate: "Berechnen",
      result: "Ergebnis",

      nihr_title: "NIHR-Check",
      nihr_subtitle: "Prüfung auf Danger Signs einer schweren verzögerten kutanen Reaktion (SCAR).",
      red_flags: "Danger Signs",
      blistering: "Blasenbildung",
      mucosal_involvement: "Schleimhautbeteiligung",
      erosions: "Erosionen",
      hemorrhagic_lesions: "Hämorrhagische Läsionen",
      skin_disruption: "Hautunterbrechung",
      fever: "Hohes Fieber",
      organ_values: "Auffällige Leber- / Nierenwerte",
      lymphadenopathy: "Lymphadenopathie",
      assessment: "Beurteilung",

      icm_hint:
        "Gruppe A: Iohexol, Iodixanol, Iomeprol, Ioversol · Gruppe B: Iopamidol · Gruppe C: Iopromide · Gruppe D: Iobitridol",
      gbca_hint:
        "Gruppe A: Gadoterat-Meglumin · Gruppe B: Gadobutrol, Gadoteridol · Gruppe C: Gadopiclenol",

      flow_titles: {
        elective_mild: "Elektive Bildgebung — frühere milde IHR",
        elective_moderate: "Elektive Bildgebung — frühere moderate IHR",
        elective_severe: "Elektive Bildgebung — frühere schwere IHR",
        emergency_mild: "Notfallbildgebung — frühere milde IHR",
        emergency_moderate: "Notfallbildgebung — frühere moderate IHR",
        emergency_severe: "Notfallbildgebung — frühere schwere IHR"
      },

      flow_bullets: {
        elective_mild: [
          "Patient zur früheren Reaktion befragen.",
          "Allergiedokumentation in der elektronischen Krankengeschichte optimieren.",
          "Wenn verfügbar, Empfehlung des Drug-Allergy-Specialist anwenden; alternativ kann bei bekanntem Auslöser ein anderes Kontrastmittel erwogen werden.",
          "Bei Kontrastmittelgabe mindestens 30 min mit liegendem venösem Zugang beobachten.",
          "Auf eine erneute Reaktion vorbereitet und wachsam sein."
        ],
        elective_moderate: [
          "Überweisung an einen Drug-Allergy-Specialist, falls noch nicht erfolgt.",
          "Allergiedokumentation in der elektronischen Krankengeschichte optimieren.",
          "Elektive Bildgebung verschieben, bis die Allergieabklärung vorliegt.",
          "Empfehlung des Drug-Allergy-Specialist für ein sichereres Kontrastmittel anwenden.",
          "Bei Kontrastmittelgabe mindestens 30 min mit liegendem venösem Zugang beobachten.",
          "Auf eine erneute Reaktion vorbereitet und wachsam sein."
        ],
        elective_severe: [
          "Überweisung an einen Drug-Allergy-Specialist, falls noch nicht erfolgt.",
          "Allergiedokumentation in der elektronischen Krankengeschichte optimieren.",
          "Ein Mitglied des Rapid-Response- oder Reanimationsteams in unmittelbarer Nähe haben.",
          "Elektive Bildgebung verschieben, bis die Allergieabklärung vorliegt.",
          "Empfehlung des Drug-Allergy-Specialist für ein sichereres Kontrastmittel anwenden.",
          "Bei Kontrastmittelgabe mindestens 30 min mit liegendem venösem Zugang beobachten.",
          "Auf eine erneute Reaktion vorbereitet und wachsam sein."
        ],
        emergency_mild: [
          "Wenn möglich, den Patienten zur früheren Reaktion befragen.",
          "Allergiedokumentation in der elektronischen Krankengeschichte optimieren.",
          "Bei bekanntem Auslöser kann ein anderes Kontrastmittel erwogen werden.",
          "Bei Kontrastmittelgabe mindestens 30 min mit liegendem venösem Zugang beobachten.",
          "Auf eine erneute Reaktion vorbereitet und wachsam sein."
        ],
        emergency_moderate: [
          "Spätere Überweisung an einen Drug-Allergy-Specialist, falls noch nicht erfolgt.",
          "Allergiedokumentation in der elektronischen Krankengeschichte optimieren.",
          "Einen geschulten Imaging- oder Notfallarzt in unmittelbarer Nähe haben.",
          "Bei bekanntem Auslöser ein anderes Kontrastmittel wählen.",
          "Bei Kontrastmittelgabe mindestens 30 min mit liegendem venösem Zugang beobachten.",
          "Auf eine erneute Reaktion vorbereitet und wachsam sein."
        ],
        emergency_severe: [
          "Spätere Überweisung an einen Drug-Allergy-Specialist, falls noch nicht erfolgt.",
          "Allergiedokumentation in der elektronischen Krankengeschichte optimieren.",
          "Ein Mitglied des Rapid-Response- oder Reanimationsteams in unmittelbarer Nähe haben.",
          "Premedikation gemäss EAACI-Guidance erwägen.",
          "Bei bekanntem Auslöser ein anderes Kontrastmittel wählen.",
          "Bei Kontrastmittelgabe mindestens 30 min mit liegendem venösem Zugang beobachten.",
          "Auf eine erneute Reaktion vorbereitet und wachsam sein."
        ]
      },

      switch_placeholder_icm: "Bitte oben die beteiligte ICM-Gruppe auswählen.",
      switch_placeholder_gbca: "Bitte oben die beteiligte GBCA-Gruppe auswählen.",

      icm_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Mögliche empirische alternative ICM-Gruppen: B oder D.",
          note: "Kreuzreaktionen sind möglich. Eine allergologisch geführte Auswahl ist vorzuziehen."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Mögliche empirische alternative ICM-Gruppen: A, C oder D.",
          note: "Kreuzreaktionen sind möglich. Eine allergologisch geführte Auswahl ist vorzuziehen."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Mögliche empirische alternative ICM-Gruppe: B.",
          note: "Kreuzreaktionen sind möglich. Eine allergologisch geführte Auswahl ist vorzuziehen."
        },
        D: {
          title: "Gruppe D ausgewählt",
          text: "Mögliche empirische alternative ICM-Gruppen: A oder B.",
          note: "Kreuzreaktionen sind möglich. Eine allergologisch geführte Auswahl ist vorzuziehen."
        },
        unknown: {
          title: "ICM unbekannt",
          text: "Mögliche empirische alternative ICM-Gruppen: B oder D.",
          note: "Das ist nur praktische Orientierung; Substanzen der Gruppe A sind häufig."
        }
      },

      gbca_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Ein GBCA aus Gruppe B kann als empirische praktische Orientierung erwogen werden.",
          note: "Wenn möglich, ist eine fachärztliche Abklärung vorzuziehen."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Ein GBCA aus Gruppe A kann als empirische praktische Orientierung erwogen werden.",
          note: "Wenn möglich, ist eine fachärztliche Abklärung vorzuziehen."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Für einen empirischen Wechsel besteht unzureichende Datenlage.",
          note: "Eine fachärztliche Abklärung ist vorzuziehen."
        },
        unknown: {
          title: "GBCA unbekannt",
          text: "Falls eine rasche erneute Gabe nötig ist, kann ein anderes GBCA erwogen werden.",
          note: "Das ist nur praktische Orientierung; eine fachärztliche Abklärung ist vorzuziehen."
        }
      },

      tryptase_default:
        "Bitte Akutwert und Baseline-Wert (>24 h nach vollständigem Abklingen der Symptome) eingeben und dann Berechnen drücken.",
      tryptase_invalid: "Bitte gültige Zahlenwerte eingeben.",
      tryptase_threshold: "Schwellenwert",
      tryptase_acute: "Akutwert",
      tryptase_formula: "Relevanter akuter Anstieg, wenn Akutwert ≥ 2 ng/mL + (1.2 × Baseline).",
      tryptase_positive: "Das Ergebnis stützt einen signifikanten akuten Tryptaseanstieg.",
      tryptase_negative: "Das Ergebnis zeigt keinen signifikanten akuten Tryptaseanstieg.",
      tryptase_note:
        "Immer zusammen mit Zeitpunkt und klinischem Kontext interpretieren. Ein normaler Tryptasewert schliesst eine echte unmittelbare Hypersensitivitätsreaktion nicht aus.",

      nihr_default: "Keine Danger Signs ausgewählt.",
      nihr_positive_title: "Mögliche schwere kutane Arzneimittelreaktion (SCAR).",
      nihr_positive_text:
        "Eine dringliche allergologische / dermatologische Abklärung ist angezeigt. Wenn möglich, sollte ein alternatives Bildgebungsverfahren gewählt werden. Die Kontrastmittelgruppe, zu der die schwere Reaktion aufgetreten ist, darf nicht erneut verabreicht werden."
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

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (i18n[state.lang][key]) {
        el.textContent = i18n[state.lang][key];
      }
    });

    document.getElementById("icmHint").textContent = t("icm_hint");
    document.getElementById("gbcaHint").textContent = t("gbca_hint");

    const switchNonvalidated = document.getElementById("switchNonvalidated");
    if (switchNonvalidated) {
      switchNonvalidated.textContent = t("switch_nonvalidated");
    }

    document.getElementById("icm-group-a-names").textContent = "Iohexol • Iodixanol • Iomeprol • Ioversol";
    document.getElementById("icm-group-b-names").textContent = "Iopamidol";
    document.getElementById("icm-group-c-names").textContent = "Iopromide";
    document.getElementById("icm-group-d-names").textContent = "Iobitridol";

    document.getElementById("gbca-group-a-names").textContent =
      state.lang === "en" ? "Gadoterate meglumine" : "Gadoterat-Meglumin";
    document.getElementById("gbca-group-b-names").textContent = "Gadobutrol • Gadoteridol";
    document.getElementById("gbca-group-c-names").textContent = "Gadopiclenol";

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
      tryptaseOutput.innerHTML = `
        <div class="hint">${t("tryptase_default")}</div>
        <div class="hint" style="margin-top:10px">${t("tryptase_formula")}</div>
      `;
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
      <div class="hint" style="margin-top:10px">${t("tryptase_formula")}</div>
      <div style="margin-top:10px"><strong>${significant ? t("tryptase_positive") : t("tryptase_negative")}</strong></div>
      <div class="hint" style="margin-top:10px">${t("tryptase_note")}</div>
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

  document.getElementById("calcTryptase").addEventListener("click", calcTryptase);

  document.querySelectorAll(".nihr-check").forEach((el) => el.addEventListener("change", renderNihr));

  document.getElementById("resetBtn").addEventListener("click", resetAll);

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

  showView("flow");
  setBodyMode();
  renderAll();
});
