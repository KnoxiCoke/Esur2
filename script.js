document.addEventListener("DOMContentLoaded", function () {
  const state = {
    nav: "flow",
    situation: "elective",
    reaction: "moderate", // mild | moderate | severe | unclear
    cmtype: "icm",
    nihrCmtype: "icm",
    icm: null,
    gbca: null,
    lang: "en"
  };

  const i18n = {
    en: {
      app_title: "ESUR Contrast Media Hypersensitivity Support",
      reset: "Reset",

      disclaimer_line1: "Educational support tool based on ESUR CMSC guidance (2025).",
      disclaimer_line2: "Information only. Clinical decisions should follow local protocols and clinical judgement. No patient data are stored.",
      disclaimer_line3: "Content adapted from the ESUR Contrast Media Safety Committee guidelines (2025).",

      flow_title: "Guidance",
      flow_subtitle: "Educational support for prior contrast media hypersensitivity reactions.",
      flow_step1: "Step 1 — Clinical situation",
      flow_step2: "Step 2 — Prior reaction severity",

      elective: "Elective",
      emergency: "Emergency",
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe",
      unclear: "Unclear",

      recommendation: "Recommendation",
      safety_net: "Safety net",
      flow_safety:
        "Acute hypersensitivity reactions should be managed according to local protocols and ESUR acute management guidance.",

      switch_title: "Switch",
      switch_subtitle: "Educational support for contrast agent switch consideration.",
      contrast_type: "Contrast type",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRI)",
      icm_title: "ICM (iodinated)",
      gbca_title: "GBCA (gadolinium-based)",
      possible_alternatives: "Possible alternatives",
      safety_note: "Safety note",
      switch_safety_note:
        "Cross-reactivity is variable. Selection of an alternative contrast agent should preferably follow allergy evaluation and local expertise.",
      unknown: "Unknown",
      icm_unknown_hint: "Use when the involved ICM is not known.",
      gbca_unknown_hint: "Use when the involved GBCA is not known.",
      switch_nonvalidated:
        "This switch overview is intended as educational support only. It does not replace allergy evaluation or local decision-making.",

      tryptase_title: "Tryptase Rule",
      tryptase_subtitle:
        "ESUR ideally recommends three samples: one as early as possible during the reaction, one 1–2 hours later (no later than 4 hours after symptom onset), and one more than 24 hours after complete resolution as baseline. For the calculation below, the highest available acute tryptase value and the baseline value should be entered.",
      enter_values: "Enter values",
      calculate: "Calculate",
      result: "Result",
      tryptase_default:
        "For the calculation below, the highest available acute tryptase value and the baseline value should be entered.",
      tryptase_invalid: "Please enter valid numeric values.",
      tryptase_threshold: "Threshold",
      tryptase_acute: "Acute tryptase",
      tryptase_baseline: "Baseline tryptase",
      tryptase_formula:
        "Relevant acute increase if acute tryptase ≥ (1.2 × baseline) + 2 ng/mL.",
      tryptase_positive:
        "The result suggests the presence of an immediate hypersensitivity reaction (IHR).",
      tryptase_negative:
        "The result does not support a significant acute tryptase increase.",
      tryptase_note:
        "Results should always be interpreted in the clinical context. A normal tryptase value does not exclude a true immediate hypersensitivity reaction.",

      nihr_title: "NIHR Check",
      nihr_subtitle:
        "Assessment for clinical features suggesting a severe cutaneous adverse reaction (SCAR).",
      red_flags: "Danger signs",
      blistering: "Blistering",
      mucosal_involvement: "Mucosal involvement",
      erosions: "Erosive lesions",
      hemorrhagic_lesions: "Hemorrhagic lesions",
      skin_disruption: "Skin disruption",
      fever: "High fever",
      organ_values: "Abnormal liver or kidney values",
      lymphadenopathy: "Lymphadenopathy",
      assessment: "Assessment",
      nihr_default: "No danger signs selected.",
      nihr_positive_title: "Possible severe cutaneous adverse reaction (SCAR)",
      nihr_positive_text_icm: [
        "Urgent evaluation by a drug allergy or dermatology specialist is recommended.",
        "When possible, an alternative imaging modality should be considered.",
        "After a severe non-immediate hypersensitivity reaction to an iodine-based contrast medium, all iodine-based contrast media should be avoided."
      ],
      nihr_positive_text_gbca: [
        "Urgent evaluation by a drug allergy or dermatology specialist is recommended.",
        "When possible, an alternative imaging modality should be considered.",
        "After a severe non-immediate hypersensitivity reaction to a gadolinium-based contrast agent, all gadolinium-based contrast agents should be avoided."
      ],

      icm_hint:
        "Group A: Iohexol, Iodixanol, Iomeprol, Ioversol · Group B: Iopamidol · Group C: Iopromide · Group D: Iobitridol",
      gbca_hint:
        "Group A: Gadoterate meglumine · Group B: Gadobutrol, Gadoteridol · Group C: Gadopiclenol",

      flow_titles: {
        elective_mild: "Elective imaging — prior mild immediate hypersensitivity reaction",
        elective_moderate: "Elective imaging — prior moderate immediate hypersensitivity reaction",
        elective_severe: "Elective imaging — prior severe immediate hypersensitivity reaction",
        elective_unclear: "Elective imaging — prior reaction severity unclear",
        emergency_mild: "Emergency imaging — prior mild immediate hypersensitivity reaction",
        emergency_moderate: "Emergency imaging — prior moderate immediate hypersensitivity reaction",
        emergency_severe: "Emergency imaging — prior severe immediate hypersensitivity reaction",
        emergency_unclear: "Emergency imaging — prior reaction severity unclear"
      },

      flow_bullets: {
        elective_mild: [
          "The previous reaction should be reviewed.",
          "Allergy documentation should be optimized.",
          "Advice from a drug allergy specialist may be followed or referral may be considered.",
          "If the culprit contrast agent is known, use of an alternative contrast agent may be considered.",
          "If contrast agent administration is required, observation for ≥30 minutes with intravenous access should be ensured.",
          "Clinical vigilance for recurrent reactions should be maintained."
        ],
        elective_moderate: [
          "Postponement of the examination should be considered when clinically feasible.",
          "Referral for a formal allergy evaluation is strongly recommended.",
          "If contrast-enhanced imaging remains necessary, use of an alternative contrast agent should be considered.",
          "Observation for ≥30 minutes with intravenous access should be ensured."
        ],
        elective_severe: [
          "Postponement of the examination should be considered when clinically feasible.",
          "Referral for a formal allergy evaluation is strongly recommended.",
          "If contrast-enhanced imaging remains necessary, use of an alternative contrast agent should be considered.",
          "Availability of a rapid response (or resuscitation) team member should be ensured.",
          "Observation for ≥30 minutes with intravenous access should be ensured."
        ],
        elective_unclear: [
          "The previous reaction should be reviewed.",
          "Allergy documentation should be optimized.",
          "If contrast agent administration remains necessary, clinical judgement and local protocols should guide further management."
        ],
        emergency_mild: [
          "If contrast agent administration is required, the potential risk of recurrence should be considered.",
          "Use of an alternative contrast agent may be considered if the culprit agent is known.",
          "Availability of personnel trained in the management of acute hypersensitivity reactions should be ensured.",
          "Observation for ≥30 minutes with intravenous access should be ensured."
        ],
        emergency_moderate: [
          "If contrast-enhanced imaging is considered necessary, use of an alternative contrast agent should be considered.",
          "Availability of personnel trained in the management of acute hypersensitivity reactions should be ensured.",
          "Observation for ≥30 minutes with intravenous access should be ensured."
        ],
        emergency_severe: [
          "If contrast-enhanced imaging is considered unavoidable, premedication may be considered in accordance with EAACI guidance.",
          "Use of an alternative contrast agent should be considered.",
          "Availability of a rapid response (or resuscitation) team member should be ensured.",
          "Observation for ≥30 minutes with intravenous access should be ensured."
        ],
        emergency_unclear: [
          "If contrast agent administration is considered necessary, the potential risk of recurrence should be considered.",
          "Availability of personnel trained in the management of acute hypersensitivity reactions should be ensured.",
          "Clinical judgement and local protocols should guide further management."
        ]
      },

      switch_placeholder_icm: "Select the involved ICM group above.",
      switch_placeholder_gbca: "Select the involved GBCA group above.",

      icm_rules: {
        A: {
          title: "Group A selected",
          text: "Selection of an alternative contrast agent (preferably from a different structural group) may be considered when contrast agent administration remains necessary.",
          note: "Cross-reactivity is variable. Selection should preferably follow allergy evaluation and local expertise."
        },
        B: {
          title: "Group B selected",
          text: "Selection of an alternative contrast agent (preferably from a different structural group) may be considered when contrast agent administration remains necessary.",
          note: "Cross-reactivity is variable. Selection should preferably follow allergy evaluation and local expertise."
        },
        C: {
          title: "Group C selected",
          text: "Selection of an alternative contrast agent (preferably from a different structural group) may be considered when contrast agent administration remains necessary.",
          note: "Cross-reactivity is variable. Selection should preferably follow allergy evaluation and local expertise."
        },
        D: {
          title: "Group D selected",
          text: "Selection of an alternative contrast agent (preferably from a different structural group) may be considered when contrast agent administration remains necessary.",
          note: "Cross-reactivity is variable. Selection should preferably follow allergy evaluation and local expertise."
        },
        unknown: {
          title: "ICM unknown",
          text: "Selection of an alternative contrast agent may be considered when the culprit agent is not known.",
          note: "Allergy evaluation and local expertise remain preferable."
        }
      },

      gbca_rules: {
        A: {
          title: "Group A selected",
          text: "Selection of an alternative contrast agent (preferably from a different structural group) may be considered when contrast agent administration remains necessary.",
          note: "Selection should preferably follow allergy evaluation and local expertise."
        },
        B: {
          title: "Group B selected",
          text: "Selection of an alternative contrast agent (preferably from a different structural group) may be considered when contrast agent administration remains necessary.",
          note: "Selection should preferably follow allergy evaluation and local expertise."
        },
        C: {
          title: "Group C selected",
          text: "Selection of an alternative contrast agent may be considered with specialist input when available.",
          note: "Evidence for empirical switching is limited."
        },
        unknown: {
          title: "GBCA unknown",
          text: "Selection of an alternative contrast agent may be considered when the culprit agent is not known.",
          note: "Allergy evaluation and local expertise remain preferable."
        }
      }
    },

    de: {
      app_title: "ESUR Support-Tool zu Hypersensitivitätsreaktionen auf Kontrastmittel",
      reset: "Zurücksetzen",

      disclaimer_line1: "Didaktisches Support-Tool auf Grundlage der ESUR-CMSC-Guidance (2025).",
      disclaimer_line2: "Nur zur Information. Klinische Entscheidungen sollten lokalen Protokollen und der klinischen Beurteilung folgen. Es werden keine Patientendaten gespeichert.",
      disclaimer_line3: "Inhaltlich adaptiert aus den Leitlinien des ESUR Contrast Media Safety Committee (2025).",

      flow_title: "Orientierung",
      flow_subtitle: "Didaktische Orientierung bei früheren Hypersensitivitätsreaktionen auf Kontrastmittel.",
      flow_step1: "Schritt 1 — Klinische Situation",
      flow_step2: "Schritt 2 — Schweregrad der früheren Reaktion",

      elective: "Elektiv",
      emergency: "Notfall",
      mild: "Mild",
      moderate: "Moderat",
      severe: "Schwer",
      unclear: "Unklar",

      recommendation: "Empfehlung",
      safety_net: "Safety net",
      flow_safety:
        "Akute Hypersensitivitätsreaktionen sollten gemäss lokalen Protokollen und der ESUR-Guidance zum Akutmanagement behandelt werden.",

      switch_title: "Switch",
      switch_subtitle: "Didaktische Orientierung zum Wechsel des Kontrastmittels.",
      contrast_type: "Kontrastmitteltyp",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRT)",
      icm_title: "ICM (jodhaltig)",
      gbca_title: "GBCA (gadoliniumhaltig)",
      possible_alternatives: "Mögliche Alternativen",
      safety_note: "Sicherheitshinweis",
      switch_safety_note:
        "Kreuzreaktionen sind variabel. Die Auswahl eines alternativen Kontrastmittels sollte vorzugsweise auf einer allergologischen Abklärung und lokaler Expertise beruhen.",
      unknown: "Unbekannt",
      icm_unknown_hint: "Verwenden, wenn das beteiligte ICM nicht bekannt ist.",
      gbca_unknown_hint: "Verwenden, wenn das beteiligte GBCA nicht bekannt ist.",
      switch_nonvalidated:
        "Diese Switch-Übersicht ist nur als didaktische Orientierung gedacht. Sie ersetzt weder eine allergologische Abklärung noch lokale Entscheidungen.",

      tryptase_title: "Tryptase-Regel",
      tryptase_subtitle:
        "ESUR empfiehlt idealerweise drei Proben: eine so früh wie möglich während der Reaktion, eine weitere 1–2 Stunden später (spätestens innerhalb von 4 Stunden nach Symptombeginn) und eine mehr als 24 Stunden nach vollständigem Abklingen als Baseline. Für die Berechnung unten sollten der höchste verfügbare akute Tryptasewert und der Baseline-Wert eingegeben werden.",
      enter_values: "Werte eingeben",
      calculate: "Berechnen",
      result: "Ergebnis",
      tryptase_default:
        "Für die Berechnung unten sollten der höchste verfügbare akute Tryptasewert und der Baseline-Wert eingegeben werden.",
      tryptase_invalid: "Bitte gültige Zahlenwerte eingeben.",
      tryptase_threshold: "Schwellenwert",
      tryptase_acute: "Akute Tryptase",
      tryptase_baseline: "Baseline-Tryptase",
      tryptase_formula:
        "Relevanter akuter Anstieg, wenn akute Tryptase ≥ (1.2 × Baseline) + 2 ng/mL.",
      tryptase_positive:
        "Das Ergebnis spricht für das Vorliegen einer unmittelbaren Hypersensitivitätsreaktion (IHR).",
      tryptase_negative:
        "Das Ergebnis stützt keinen signifikanten akuten Tryptaseanstieg.",
      tryptase_note:
        "Die Resultate sollten immer im klinischen Kontext interpretiert werden. Ein normaler Tryptasewert schliesst eine echte unmittelbare Hypersensitivitätsreaktion nicht aus.",

      nihr_title: "NIHR-Check",
      nihr_subtitle:
        "Beurteilung klinischer Merkmale, die auf eine schwere kutane Nebenwirkung (SCAR) hinweisen können.",
      red_flags: "Warnzeichen",
      blistering: "Blasenbildung",
      mucosal_involvement: "Schleimhautbeteiligung",
      erosions: "Erosive Läsionen",
      hemorrhagic_lesions: "Hämorrhagische Läsionen",
      skin_disruption: "Hautunterbrechung",
      fever: "Hohes Fieber",
      organ_values: "Auffällige Leber- oder Nierenwerte",
      lymphadenopathy: "Lymphadenopathie",
      assessment: "Beurteilung",
      nihr_default: "Keine Warnzeichen ausgewählt.",
      nihr_positive_title: "Mögliche schwere kutane Nebenwirkung (SCAR)",
      nihr_positive_text_icm: [
        "Eine dringliche Beurteilung durch eine allergologische oder dermatologische Fachperson wird empfohlen.",
        "Wenn möglich, sollte ein alternatives Bildgebungsverfahren erwogen werden.",
        "Nach einer schweren nicht-unmittelbaren Hypersensitivitätsreaktion auf ein jodhaltiges Kontrastmittel sollten alle jodhaltigen Kontrastmittel vermieden werden."
      ],
      nihr_positive_text_gbca: [
        "Eine dringliche Beurteilung durch eine allergologische oder dermatologische Fachperson wird empfohlen.",
        "Wenn möglich, sollte ein alternatives Bildgebungsverfahren erwogen werden.",
        "Nach einer schweren nicht-unmittelbaren Hypersensitivitätsreaktion auf ein gadoliniumhaltiges Kontrastmittel sollten alle gadoliniumhaltigen Kontrastmittel vermieden werden."
      ],

      icm_hint:
        "Gruppe A: Iohexol, Iodixanol, Iomeprol, Ioversol · Gruppe B: Iopamidol · Gruppe C: Iopromide · Gruppe D: Iobitridol",
      gbca_hint:
        "Gruppe A: Gadoterat-Meglumin · Gruppe B: Gadobutrol, Gadoteridol · Gruppe C: Gadopiclenol",

      flow_titles: {
        elective_mild: "Elektive Bildgebung — frühere milde unmittelbare Hypersensitivitätsreaktion",
        elective_moderate: "Elektive Bildgebung — frühere moderate unmittelbare Hypersensitivitätsreaktion",
        elective_severe: "Elektive Bildgebung — frühere schwere unmittelbare Hypersensitivitätsreaktion",
        elective_unclear: "Elektive Bildgebung — Schweregrad der früheren Reaktion unklar",
        emergency_mild: "Notfallbildgebung — frühere milde unmittelbare Hypersensitivitätsreaktion",
        emergency_moderate: "Notfallbildgebung — frühere moderate unmittelbare Hypersensitivitätsreaktion",
        emergency_severe: "Notfallbildgebung — frühere schwere unmittelbare Hypersensitivitätsreaktion",
        emergency_unclear: "Notfallbildgebung — Schweregrad der früheren Reaktion unklar"
      },

      flow_bullets: {
        elective_mild: [
          "Die frühere Reaktion sollte überprüft werden.",
          "Die Allergiedokumentation sollte optimiert werden.",
          "Empfehlungen einer allergologischen Fachperson können berücksichtigt oder eine Überweisung kann erwogen werden.",
          "Wenn das auslösende Kontrastmittel bekannt ist, kann die Verwendung eines alternativen Kontrastmittels erwogen werden.",
          "Wenn eine Kontrastmittelgabe erforderlich ist, sollte eine Beobachtung für ≥30 Minuten mit intravenösem Zugang sichergestellt werden.",
          "Auf mögliche wiederkehrende Reaktionen sollte klinisch geachtet werden."
        ],
        elective_moderate: [
          "Ein Aufschub der Untersuchung sollte erwogen werden, wenn dies klinisch möglich ist.",
          "Eine Überweisung zur formellen allergologischen Abklärung wird dringend empfohlen.",
          "Wenn eine kontrastverstärkte Bildgebung weiterhin erforderlich ist, sollte die Verwendung eines alternativen Kontrastmittels erwogen werden.",
          "Eine Beobachtung für ≥30 Minuten mit intravenösem Zugang sollte sichergestellt werden."
        ],
        elective_severe: [
          "Ein Aufschub der Untersuchung sollte erwogen werden, wenn dies klinisch möglich ist.",
          "Eine Überweisung zur formellen allergologischen Abklärung wird dringend empfohlen.",
          "Wenn eine kontrastverstärkte Bildgebung weiterhin erforderlich ist, sollte die Verwendung eines alternativen Kontrastmittels erwogen werden.",
          "Die Verfügbarkeit eines Mitglieds des Rapid-Response- oder Reanimationsteams sollte sichergestellt werden.",
          "Eine Beobachtung für ≥30 Minuten mit intravenösem Zugang sollte sichergestellt werden."
        ],
        elective_unclear: [
          "Die frühere Reaktion sollte überprüft werden.",
          "Die Allergiedokumentation sollte optimiert werden.",
          "Wenn eine Kontrastmittelgabe weiterhin erforderlich ist, sollten klinische Beurteilung und lokale Protokolle das weitere Vorgehen leiten."
        ],
        emergency_mild: [
          "Wenn eine Kontrastmittelgabe erforderlich ist, sollte das potenzielle Risiko eines Wiederauftretens berücksichtigt werden.",
          "Die Verwendung eines alternativen Kontrastmittels kann erwogen werden, wenn das auslösende Kontrastmittel bekannt ist.",
          "Die Verfügbarkeit von Personal mit Schulung im Management akuter Hypersensitivitätsreaktionen sollte sichergestellt werden.",
          "Eine Beobachtung für ≥30 Minuten mit intravenösem Zugang sollte sichergestellt werden."
        ],
        emergency_moderate: [
          "Wenn eine kontrastverstärkte Bildgebung als notwendig erachtet wird, sollte die Verwendung eines alternativen Kontrastmittels erwogen werden.",
          "Die Verfügbarkeit von Personal mit Schulung im Management akuter Hypersensitivitätsreaktionen sollte sichergestellt werden.",
          "Eine Beobachtung für ≥30 Minuten mit intravenösem Zugang sollte sichergestellt werden."
        ],
        emergency_severe: [
          "Wenn eine kontrastverstärkte Bildgebung als unvermeidbar erachtet wird, kann eine Prämedikation gemäss EAACI-Guidance erwogen werden.",
          "Die Verwendung eines alternativen Kontrastmittels sollte erwogen werden.",
          "Die Verfügbarkeit eines Mitglieds des Rapid-Response- oder Reanimationsteams sollte sichergestellt werden.",
          "Eine Beobachtung für ≥30 Minuten mit intravenösem Zugang sollte sichergestellt werden."
        ],
        emergency_unclear: [
          "Wenn eine Kontrastmittelgabe als notwendig erachtet wird, sollte das potenzielle Risiko eines Wiederauftretens berücksichtigt werden.",
          "Die Verfügbarkeit von Personal mit Schulung im Management akuter Hypersensitivitätsreaktionen sollte sichergestellt werden.",
          "Klinische Beurteilung und lokale Protokolle sollten das weitere Vorgehen leiten."
        ]
      },

      switch_placeholder_icm: "Bitte oben die beteiligte ICM-Gruppe auswählen.",
      switch_placeholder_gbca: "Bitte oben die beteiligte GBCA-Gruppe auswählen.",

      icm_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Die Auswahl eines alternativen Kontrastmittels (vorzugsweise aus einer anderen Strukturgruppe) kann erwogen werden, wenn eine Kontrastmittelgabe weiterhin erforderlich ist.",
          note: "Kreuzreaktionen sind variabel. Die Auswahl sollte vorzugsweise auf einer allergologischen Abklärung und lokaler Expertise beruhen."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Die Auswahl eines alternativen Kontrastmittels (vorzugsweise aus einer anderen Strukturgruppe) kann erwogen werden, wenn eine Kontrastmittelgabe weiterhin erforderlich ist.",
          note: "Kreuzreaktionen sind variabel. Die Auswahl sollte vorzugsweise auf einer allergologischen Abklärung und lokaler Expertise beruhen."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Die Auswahl eines alternativen Kontrastmittels (vorzugsweise aus einer anderen Strukturgruppe) kann erwogen werden, wenn eine Kontrastmittelgabe weiterhin erforderlich ist.",
          note: "Kreuzreaktionen sind variabel. Die Auswahl sollte vorzugsweise auf einer allergologischen Abklärung und lokaler Expertise beruhen."
        },
        D: {
          title: "Gruppe D ausgewählt",
          text: "Die Auswahl eines alternativen Kontrastmittels (vorzugsweise aus einer anderen Strukturgruppe) kann erwogen werden, wenn eine Kontrastmittelgabe weiterhin erforderlich ist.",
          note: "Kreuzreaktionen sind variabel. Die Auswahl sollte vorzugsweise auf einer allergologischen Abklärung und lokaler Expertise beruhen."
        },
        unknown: {
          title: "ICM unbekannt",
          text: "Die Auswahl eines alternativen Kontrastmittels kann erwogen werden, wenn das auslösende Kontrastmittel nicht bekannt ist.",
          note: "Eine allergologische Abklärung und lokale Expertise bleiben vorzuziehen."
        }
      },

      gbca_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Die Auswahl eines alternativen Kontrastmittels (vorzugsweise aus einer anderen Strukturgruppe) kann erwogen werden, wenn eine Kontrastmittelgabe weiterhin erforderlich ist.",
          note: "Die Auswahl sollte vorzugsweise auf einer allergologischen Abklärung und lokaler Expertise beruhen."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Die Auswahl eines alternativen Kontrastmittels (vorzugsweise aus einer anderen Strukturgruppe) kann erwogen werden, wenn eine Kontrastmittelgabe weiterhin erforderlich ist.",
          note: "Die Auswahl sollte vorzugsweise auf einer allergologischen Abklärung und lokaler Expertise beruhen."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Die Auswahl eines alternativen Kontrastmittels kann mit fachärztlichem Input erwogen werden, wenn verfügbar.",
          note: "Die Evidenz für ein empirisches Switching ist limitiert."
        },
        unknown: {
          title: "GBCA unbekannt",
          text: "Die Auswahl eines alternativen Kontrastmittels kann erwogen werden, wenn das auslösende Kontrastmittel nicht bekannt ist.",
          note: "Eine allergologische Abklärung und lokale Expertise bleiben vorzuziehen."
        }
      }
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
      if (i18n[state.lang][key] !== undefined) {
        el.textContent = i18n[state.lang][key];
      }
    });

    const stickyDisclaimer = document.getElementById("stickyDisclaimer");
    if (stickyDisclaimer) {
      let extra = stickyDisclaimer.querySelector('[data-i18n="disclaimer_line3"]');
      if (!extra) {
        extra = document.createElement("span");
        extra.setAttribute("data-i18n", "disclaimer_line3");
        stickyDisclaimer.appendChild(extra);
      }
      extra.textContent = t("disclaimer_line3");
    }

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("icmHint", t("icm_hint"));
    setText("gbcaHint", t("gbca_hint"));
    setText("switchNonvalidated", t("switch_nonvalidated"));

    setText("icm-group-a-names", "Iohexol • Iodixanol • Iomeprol • Ioversol");
    setText("icm-group-b-names", "Iopamidol");
    setText("icm-group-c-names", "Iopromide");
    setText("icm-group-d-names", "Iobitridol");
    setText("gbca-group-a-names", state.lang === "de" ? "Gadoterat-Meglumin" : "Gadoterate meglumine");
    setText("gbca-group-b-names", "Gadobutrol • Gadoteridol");
    setText("gbca-group-c-names", "Gadopiclenol");

    const baseline = document.getElementById("baseline");
    const acute = document.getElementById("acute");
    if (baseline) baseline.placeholder = `${t("tryptase_baseline")} (ng/mL)`;
    if (acute) acute.placeholder = `${t("tryptase_acute")} (ng/mL)`;
  }

  function setBodyMode() {
    document.body.classList.toggle("emergency", state.situation === "emergency");
  }

  function showView(name) {
    Object.keys(views).forEach((key) => {
      if (views[key]) views[key].hidden = key !== name;
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
      if (icmCard) icmCard.hidden = value !== "icm";
      if (gbcaCard) gbcaCard.hidden = value !== "gbca";
    }

    renderAll();
  }

  function renderFlow() {
    const key = `${state.situation}_${state.reaction}`;
    const title = t("flow_titles")[key];
    const bullets = t("flow_bullets")[key];

    if (flowOutput) {
      flowOutput.innerHTML = `
        <div><strong>${title}</strong></div>
        <ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      `;
    }

    if (flowSafety) flowSafety.textContent = t("flow_safety");
  }

  function renderSwitch() {
    if (!switchOutput) return;

    if (state.cmtype === "icm") {
      if (icmCard) icmCard.hidden = false;
      if (gbcaCard) gbcaCard.hidden = true;

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

    if (icmCard) icmCard.hidden = true;
    if (gbcaCard) gbcaCard.hidden = false;

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
    if (!tryptaseOutput) return;
    if (!tryptaseOutput.dataset.ready) {
      tryptaseOutput.innerHTML = `
        <div class="hint">${t("tryptase_default")}</div>
        <div class="hint" style="margin-top:10px">${t("tryptase_formula")}</div>
      `;
    }
  }

  function calcTryptase() {
    if (!tryptaseOutput) return;

    const baseline = Number(document.getElementById("baseline")?.value);
    const acute = Number(document.getElementById("acute")?.value);

    if (!isFinite(baseline) || !isFinite(acute) || baseline < 0 || acute < 0) {
      tryptaseOutput.innerHTML = `<div class="hint">${t("tryptase_invalid")}</div>`;
      return;
    }

    const threshold = (1.2 * baseline) + 2;
    const significant = acute >= threshold;

    tryptaseOutput.innerHTML = `
      <div><strong>${t("tryptase_threshold")}:</strong> ${threshold.toFixed(2)} ng/mL</div>
      <div><strong>${t("tryptase_acute")}:</strong> ${acute.toFixed(2)} ng/mL</div>
      <div><strong>${t("tryptase_baseline")}:</strong> ${baseline.toFixed(2)} ng/mL</div>
      <div class="hint" style="margin-top:10px">${t("tryptase_formula")}</div>
      <div style="margin-top:10px"><strong>${significant ? t("tryptase_positive") : t("tryptase_negative")}</strong></div>
      <div class="hint" style="margin-top:10px">${t("tryptase_note")}</div>
    `;

    tryptaseOutput.dataset.ready = "1";
  }

  function renderNihr() {
    if (!nihrOutput) return;

    const anyChecked = Array.from(document.querySelectorAll(".nihr-check")).some((el) => el.checked);

    if (!anyChecked) {
      nihrOutput.innerHTML = `<div class="hint">${t("nihr_default")}</div>`;
      return;
    }

    const lines =
      state.nihrCmtype === "gbca"
        ? t("nihr_positive_text_gbca")
        : t("nihr_positive_text_icm");

    nihrOutput.innerHTML = `
      <div><strong>${t("nihr_positive_title")}</strong></div>
      <ul>${lines.map((line) => `<li>${line}</li>`).join("")}</ul>
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
    state.nihrCmtype = "icm";
    state.icm = null;
    state.gbca = null;

    document.body.classList.remove("emergency");

    ["situation", "reaction", "cmtype", "nihrCmtype"].forEach((seg) => {
      document.querySelectorAll(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
        const defaults = {
          situation: "elective",
          reaction: "moderate",
          cmtype: "icm",
          nihrCmtype: "icm"
        };
        btn.classList.toggle("active", btn.dataset.value === defaults[seg]);
      });
    });

    clearButtons("icm");
    clearButtons("gbca");

    const baseline = document.getElementById("baseline");
    const acute = document.getElementById("acute");
    if (baseline) baseline.value = "";
    if (acute) acute.value = "";
    document.querySelectorAll(".nihr-check").forEach((el) => (el.checked = false));

    if (tryptaseOutput) delete tryptaseOutput.dataset.ready;

    showView("flow");
    renderAll();
  }

  document.querySelectorAll(".bottomnav__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showView(btn.dataset.nav);
    });
  });

  ["situation", "reaction", "cmtype", "nihrCmtype"].forEach((seg) => {
    document.querySelectorAll(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      btn.addEventListener("click", () => setSegment(seg, btn.dataset.value));
    });
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

  const calcBtn = document.getElementById("calcTryptase");
  if (calcBtn) calcBtn.addEventListener("click", calcTryptase);

  document.querySelectorAll(".nihr-check").forEach((el) => el.addEventListener("change", renderNihr));

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  const langEn = document.getElementById("lang-en");
  const langDe = document.getElementById("lang-de");

  if (langEn) {
    langEn.addEventListener("click", () => {
      state.lang = "en";
      langEn.classList.add("active");
      if (langDe) langDe.classList.remove("active");
      renderAll();

      if ((document.getElementById("baseline")?.value ?? "") !== "" && (document.getElementById("acute")?.value ?? "") !== "") {
        calcTryptase();
      }
      renderNihr();
    });
  }

  if (langDe) {
    langDe.addEventListener("click", () => {
      state.lang = "de";
      langDe.classList.add("active");
      if (langEn) langEn.classList.remove("active");
      renderAll();

      if ((document.getElementById("baseline")?.value ?? "") !== "" && (document.getElementById("acute")?.value ?? "") !== "") {
        calcTryptase();
      }
      renderNihr();
    });
  }

  showView("flow");
  setBodyMode();
  renderAll();
});
