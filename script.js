document.addEventListener("DOMContentLoaded", function () {
  const state = {
    nav: "flow",
    situation: "elective",
    reaction: "moderate", // mild | moderate | severe | unclear
    cmtype: "icm",
    nihrCmtype: "icm",
    icm: null,
    gbca: null,
    lang: "en",

    // Practice Changes tab
    changesFilter: "all",   // all | high | medium | low
    changesMode: "compare", // compare | action
    changesSearch: "",
    openChanges: new Set()
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
      switch_subtitle:
        "Educational support for empiric contrast agent switch consideration based on practical experience.",
      contrast_type: "Contrast type",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRI)",
      icm_title: "ICM (iodinated)",
      gbca_title: "GBCA (gadolinium-based)",
      possible_alternatives: "Possible alternatives",
      safety_note: "Safety note",
      switch_safety_note:
        "These suggestions are based on practical experience only. Allergy evaluation remains preferable whenever available.",
      unknown: "Unknown",
      icm_unknown_hint: "Use when the involved ICM is not known.",
      gbca_unknown_hint: "Use when the involved GBCA is not known.",
      switch_nonvalidated:
        "This switch overview is optional, non-validated guidance based on practical experience. It does not replace allergy evaluation or local decision-making.",

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
        "Group A: Gadoterate meglumine · Group B: Gadoteridol, Gadobutrol · Group C: Gadopiclenol",

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
          text: "Alternative ICM from Group B or D may be considered.",
          note: "High cross-reactivity has been reported between Group A and Group C. This suggestion is based on practical experience only."
        },
        B: {
          title: "Group B selected",
          text: "Alternative ICM from Group A, C or D may be considered.",
          note: "This suggestion is based on practical experience only."
        },
        C: {
          title: "Group C selected",
          text: "Alternative ICM from Group B may be considered.",
          note: "High cross-reactivity has been reported between Group C and Group A. This suggestion is based on practical experience only."
        },
        D: {
          title: "Group D selected",
          text: "Alternative ICM from Group A or B may be considered.",
          note: "This suggestion is based on practical experience only."
        },
        unknown: {
          title: "ICM unknown",
          text: "Alternative ICM from Group B or D may be considered.",
          note: "This suggestion is based on practical experience only and reflects the higher likelihood that the involved ICM belongs to Group A."
        }
      },

      gbca_rules: {
        A: {
          title: "Group A selected",
          text: "Alternative GBCA from Group B may be considered.",
          note: "This suggestion is based on practical experience only."
        },
        B: {
          title: "Group B selected",
          text: "Alternative GBCA from Group A may be considered.",
          note: "This suggestion is based on practical experience only."
        },
        C: {
          title: "Group C selected",
          text: "Insufficient data for empiric change advice.",
          note: "Specialist input is preferable."
        },
        unknown: {
          title: "GBCA unknown",
          text: "No regimen can be recommended with certainty. Use of a GBCA different from the routinely administered agent may be considered.",
          note: "This suggestion is based on practical experience only."
        }
      },

      // Practice Changes tab — static UI
      changes_title: "Practice Changes 2025",
      changes_subtitle:
        "ESUR-based summary of what changed from ESUR 10.0 (2018) to ESUR 2025. Educational support only.",
      changes_intro:
        "This tab highlights practice-relevant differences between ESUR 10.0 (2018) and ESUR 2025, with transparent source attribution. It is intended as educational support and not as a stand-alone clinical decision tool.",
      badge_practice_changing: "Practice-changing",
      badge_refined: "Refined",
      badge_structural: "Structural / terminological",
      changes_filter_title: "Filter",
      changes_filter_label: "Relevance",
      changes_mode_label: "Reading mode",
      changes_search_label: "Search",
      changes_filter_all: "All",
      changes_filter_high: "Practice-changing",
      changes_filter_medium: "Refined",
      changes_filter_low: "Structural",
      changes_mode_compare: "Compare",
      changes_mode_action: "Action mode",
      changes_search_placeholder: "Search topics (e.g. hypersensitivity, CA-AKI, waiting times)",
      changes_open: "Open",
      changes_no_results:
        "No topics match the current filter. Try another search term or switch back to “All”.",
      changes_compare_mode_badge: "Compare",
      changes_action_mode_badge: "Action mode"
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
      switch_subtitle:
        "Didaktische Orientierung zum empirischen Wechsel des Kontrastmittels auf Basis praktischer Erfahrung.",
      contrast_type: "Kontrastmitteltyp",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRT)",
      icm_title: "ICM (jodhaltig)",
      gbca_title: "GBCA (gadoliniumhaltig)",
      possible_alternatives: "Mögliche Alternativen",
      safety_note: "Sicherheitshinweis",
      switch_safety_note:
        "Diese Vorschläge beruhen nur auf praktischer Erfahrung. Eine allergologische Abklärung bleibt vorzuziehen, wenn verfügbar.",
      unknown: "Unbekannt",
      icm_unknown_hint: "Verwenden, wenn das beteiligte ICM nicht bekannt ist.",
      gbca_unknown_hint: "Verwenden, wenn das beteiligte GBCA nicht bekannt ist.",
      switch_nonvalidated:
        "Diese Switch-Übersicht ist eine optionale, nicht validierte Orientierung auf Basis praktischer Erfahrung. Sie ersetzt weder eine allergologische Abklärung noch lokale Entscheidungen.",

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
        "Gruppe A: Gadoterat-Meglumin · Gruppe B: Gadoteridol, Gadobutrol · Gruppe C: Gadopiclenol",

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
          text: "Ein alternatives ICM aus Gruppe B oder D kann erwogen werden.",
          note: "Eine hohe Kreuzreaktivität wurde zwischen Gruppe A und Gruppe C beschrieben. Dieser Vorschlag beruht nur auf praktischer Erfahrung."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Ein alternatives ICM aus Gruppe A, C oder D kann erwogen werden.",
          note: "Dieser Vorschlag beruht nur auf praktischer Erfahrung."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Ein alternatives ICM aus Gruppe B kann erwogen werden.",
          note: "Eine hohe Kreuzreaktivität wurde zwischen Gruppe C und Gruppe A beschrieben. Dieser Vorschlag beruht nur auf praktischer Erfahrung."
        },
        D: {
          title: "Gruppe D ausgewählt",
          text: "Ein alternatives ICM aus Gruppe A oder B kann erwogen werden.",
          note: "Dieser Vorschlag beruht nur auf praktischer Erfahrung."
        },
        unknown: {
          title: "ICM unbekannt",
          text: "Ein alternatives ICM aus Gruppe B oder D kann erwogen werden.",
          note: "Dieser Vorschlag beruht nur auf praktischer Erfahrung und berücksichtigt die höhere Wahrscheinlichkeit, dass das beteiligte ICM zu Gruppe A gehört."
        }
      },

      gbca_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Ein alternatives GBCA aus Gruppe B kann erwogen werden.",
          note: "Dieser Vorschlag beruht nur auf praktischer Erfahrung."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Ein alternatives GBCA aus Gruppe A kann erwogen werden.",
          note: "Dieser Vorschlag beruht nur auf praktischer Erfahrung."
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Für einen empirischen Wechsel besteht eine unzureichende Datenlage.",
          note: "Fachärztlicher Input ist vorzuziehen."
        },
        unknown: {
          title: "GBCA unbekannt",
          text: "Es kann kein Schema mit Sicherheit empfohlen werden. Die Verwendung eines anderen als des routinemässig eingesetzten GBCA kann erwogen werden.",
          note: "Dieser Vorschlag beruht nur auf praktischer Erfahrung."
        }
      },

      // Practice Changes tab — static UI
      changes_title: "Practice Changes 2025",
      changes_subtitle:
        "ESUR-basierte Zusammenfassung der Unterschiede zwischen ESUR 10.0 (2018) und ESUR 2025. Nur zur didaktischen Unterstützung.",
      changes_intro:
        "Dieser Tab hebt praxisrelevante Unterschiede zwischen ESUR 10.0 (2018) und ESUR 2025 hervor und zeigt die Quellen transparent an. Er dient der didaktischen Unterstützung und nicht als eigenständiges klinisches Entscheidungstool.",
      badge_practice_changing: "Praxisrelevant verändert",
      badge_refined: "Präzisiert",
      badge_structural: "Strukturell / terminologisch",
      changes_filter_title: "Filter",
      changes_filter_label: "Relevanz",
      changes_mode_label: "Lesemodus",
      changes_search_label: "Suche",
      changes_filter_all: "Alle",
      changes_filter_high: "Praxisrelevant verändert",
      changes_filter_medium: "Präzisiert",
      changes_filter_low: "Strukturell",
      changes_mode_compare: "Vergleich",
      changes_mode_action: "Action mode",
      changes_search_placeholder: "Themen suchen (z. B. Hypersensitivität, CA-AKI, Wartezeiten)",
      changes_open: "Öffnen",
      changes_no_results:
        "Keine Themen passen zum aktuellen Filter. Versuche einen anderen Suchbegriff oder stelle auf „Alle“ zurück.",
      changes_compare_mode_badge: "Vergleich",
      changes_action_mode_badge: "Action mode"
    }
  };

  const changesLibrary = {
    en: [
      {
        id: "publication_structure",
        level: "low",
        icon: "document",
        title: "Publication model and structure",
        summary:
          "2025 moves from a booklet-style version update to an electronic, modular guidance framework with yearly updates.",
        keywords: [
          "publication",
          "structure",
          "electronic",
          "yearly update",
          "modular",
          "permanent work in progress"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "ESUR 10.0 was presented as a classical guideline booklet with the large sections General adverse reactions, Renal adverse reactions (PC-AKI), and Miscellaneous."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The 2025 document is organized as topic-based modules such as hypersensitivity, CA-AKI, dialysis, extravasation, waiting times, laboratory interference, systemic diseases, HSG, and CO₂.",
                "It is also described as an electronic, annually updated document and a permanent work in progress."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "The newer structure is easier to map to concrete clinical questions and should not be read as a simple static reprint of the 2018 booklet."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 summary guideline"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "When citing current ESUR contrast safety guidance, use the 2025 electronic guidance rather than treating it as a conventional booklet update.",
                "Expect topic-based modules and yearly electronic updates when checking whether a practice point has changed."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "This is a structural change in how the guidance is maintained and accessed, even where the underlying clinical rule has not dramatically changed."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 summary guideline",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "hypersensitivity",
        level: "high",
        icon: "warningDrop",
        title: "Hypersensitivity",
        summary:
          "This is the strongest clinical redesign in the 2025 guidance: clearer classification, stronger allergy work-up, and more structured re-exposure pathways.",
        keywords: [
          "hypersensitivity",
          "immediate",
          "non-immediate",
          "tryptase",
          "allergy assessment",
          "SCAR",
          "re-exposure",
          "documentation",
          "premedication"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "The 2018 guideline already addressed acute, late, and very late adverse reactions, but the structure was less centered on modern allergy work-up and formal re-exposure pathways.",
                "Classification and management were less explicitly separated into immediate and non-immediate hypersensitivity reactions."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Distinguishes immediate and non-immediate hypersensitivity reactions more clearly.",
                "Explicitly uses both ACR and Ring & Messmer classification frameworks.",
                "Expands acute management, including structured observation, IV access, ABCDE-style thinking, and clearer positioning / supportive measures.",
                "Strengthens tryptase use, documentation, and prevention of recurrent reactions.",
                "Separates recurrent-reaction management by severity and by elective versus emergency situations."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "Compared with 2018, the 2025 framework is more allergy-oriented and more structured for future contrast decisions, especially after moderate or severe reactions.",
                "Documentation of the exact agent and the reaction details becomes much more important because later testing and re-exposure planning depend on it."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 hypersensitivity guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "ESUR 2025 recommends formal allergy assessment after moderate or severe reactions and after clinically relevant non-immediate reactions.",
                "During future contrast administration, observation for at least 30 min with IV access in place is described.",
                "If the culprit agent is known and no allergy-based recommendation is available, use of a different contrast agent may be considered.",
                "For severe NIHR / SCAR, avoidance of the involved contrast agent class is described.",
                "Tryptase sampling is described within 4 h, with a baseline sample after ≥24 h."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "This part of the guideline is no longer just about labeling a prior reaction. It is now built around structured risk documentation, specialist work-up, and better-controlled re-exposure decisions."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 hypersensitivity guidance",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "ca_aki_terminology",
        level: "low",
        icon: "kidney",
        title: "Renal terminology: PC-AKI → CA-AKI",
        summary:
          "The renal section is renamed and aligned with newer terminology, but the core preventive framework is not completely rebuilt.",
        keywords: [
          "pc-aki",
          "ca-aki",
          "renal",
          "terminology",
          "contrast-associated acute kidney injury"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "The 2018 renal chapter used the term PC-AKI (post-contrast acute kidney injury)."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The 2025 guidance uses CA-AKI (contrast-associated acute kidney injury) and explicitly aligns this wording with newer consensus terminology."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "This mainly affects terminology, communication, and alignment with newer literature. It should not be mistaken for the strongest practical change in the renal section."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 CA-AKI guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "Use the term CA-AKI in current communication and documentation when referring to the updated ESUR framework.",
                "Do not overstate this wording change as a major new bedside rule."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The terminology change aligns ESUR with newer nephrology / radiology consensus language, while much of the underlying risk framework remains familiar."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 CA-AKI guidance",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "waiting_times",
        level: "high",
        icon: "clock",
        title: "Safe time intervals between contrast administrations",
        summary:
          "2025 turns waiting times into a distinct practice block and separates mixed MRI/CT scenarios from repeated iodine-only and gadolinium-only administrations.",
        keywords: [
          "waiting times",
          "time interval",
          "gbca",
          "icm",
          "same day",
          "mri first",
          "repeat contrast",
          "dialysis sessions"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "The 2018 guideline already discussed same-day iodine + gadolinium administration, two iodine administrations, and two gadolinium administrations, but as older stand-alone chapters with a less operational framework."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The 2025 guidance makes this a more explicit practice section and separates scenario-specific intervals, including mixed MRI / CT workflows and repeated administrations of the same contrast class."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "This topic should not be reduced to one generic eGFR rule. The 2025 guidance differentiates between mixed GBCA → ICM workflows, two ICM injections, and two GBCA injections."
              ],
              variant: "impact"
            }
          ],
          nested: [
            {
              title: "1. Mixed elective MRI + CT/(coronary) angiography",
              sections: [
                {
                  label: "2018",
                  paragraphs: [
                    "Same-day iodine + gadolinium combinations were already discussed, but in a less explicit operational format."
                  ]
                },
                {
                  label: "2025",
                  bullets: [
                    "For elective same-day combinations, ESUR 2025 states it is better to start with MRI, except CT urography.",
                    "GBCA → ICM: eGFR >60: minimum 2 h, optimal 6 h.",
                    "GBCA → ICM: eGFR 30–60: minimum 16 h, optimal 48 h.",
                    "GBCA → ICM: eGFR <30: minimum 60 h, optimal 168 h.",
                    "In emergency or life-threatening situations, no waiting time / back-to-back administration may be used."
                  ]
                },
                {
                  label: "Practical impact",
                  paragraphs: [
                    "The order of studies matters. Mixed same-day contrast workflows should be planned more deliberately than before."
                  ],
                  variant: "impact"
                }
              ]
            },
            {
              title: "2. Two iodine-based contrast administrations",
              sections: [
                {
                  label: "2025",
                  bullets: [
                    "eGFR >60: minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: minimum 16 h, optimal 48 h.",
                    "eGFR <30: minimum 60 h, optimal 168 h.",
                    "Dialysis without remnant renal function: at least 3 dialysis sessions."
                  ]
                }
              ]
            },
            {
              title: "3. Two gadolinium-based contrast administrations",
              sections: [
                {
                  label: "2025",
                  bullets: [
                    "Without known renal impairment: minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: minimum 16 h, optimal 48 h.",
                    "eGFR <30: minimum 60 h, optimal 168 h.",
                    "Dialysis without remnant renal function: at least 3 dialysis sessions."
                  ]
                }
              ]
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 waiting-time guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "Why this topic needs separate scenarios",
              paragraphs: [
                "ESUR 2025 does not use one single waiting-time rule for every situation. The mixed MRI/CT scenario is handled separately from repeated iodine-only and gadolinium-only administrations."
              ]
            }
          ],
          nested: [
            {
              title: "Mixed elective MRI + CT/(coronary) angiography",
              sections: [
                {
                  label: "ESUR 2025 action points",
                  bullets: [
                    "For elective same-day combinations, ESUR 2025 states it is better to start with MRI, except CT urography.",
                    "If GBCA is given before ICM: eGFR >60: minimum 2 h, optimal 6 h.",
                    "If GBCA is given before ICM: eGFR 30–60: minimum 16 h, optimal 48 h.",
                    "If GBCA is given before ICM: eGFR <30: minimum 60 h, optimal 168 h.",
                    "In emergency or life-threatening situations, no waiting time / back-to-back administration may still be used."
                  ],
                  variant: "action"
                },
                {
                  label: "Why this matters",
                  paragraphs: [
                    "This is the scenario where a too-simplified “4 h / 12 h for everyone” rule becomes wrong."
                  ]
                }
              ]
            },
            {
              title: "Two iodine-based contrast administrations",
              sections: [
                {
                  label: "ESUR 2025 action points",
                  bullets: [
                    "eGFR >60: minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: minimum 16 h, optimal 48 h.",
                    "eGFR <30: minimum 60 h, optimal 168 h.",
                    "Dialysis without remnant renal function: at least 3 dialysis sessions."
                  ],
                  variant: "action"
                }
              ]
            },
            {
              title: "Two gadolinium-based contrast administrations",
              sections: [
                {
                  label: "ESUR 2025 action points",
                  bullets: [
                    "Without known renal impairment: minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: minimum 16 h, optimal 48 h.",
                    "eGFR <30: minimum 60 h, optimal 168 h.",
                    "Dialysis without remnant renal function: at least 3 dialysis sessions."
                  ],
                  variant: "action"
                }
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 waiting-time guidance",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "laboratory_interference",
        level: "high",
        icon: "lab",
        title: "Analytical interference with laboratory tests",
        summary:
          "2025 makes laboratory interference a distinct practice block with clearer eGFR-based timing for blood and urine collection.",
        keywords: [
          "laboratory",
          "blood",
          "urine",
          "interference",
          "analytical",
          "timing",
          "post contrast"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "The 2018 guideline discussed interaction with other drugs and clinical tests, but the advice was more general: collect blood and urine before contrast whenever possible and delay post-contrast testing, especially in renal impairment."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The 2025 guidance presents laboratory interference as its own section and gives clearer timing recommendations after intravascular iodine- or gadolinium-based contrast administration."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "This turns an older cautionary topic into a more usable timing framework for everyday blood and urine collection after contrast studies."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 laboratory-interference guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "For blood collection after intravascular contrast: eGFR >60: minimum 4 h, optimal 12 h.",
                "For blood collection after intravascular contrast: eGFR 30–60: minimum 16 h, optimal 48 h.",
                "For blood collection after intravascular contrast: eGFR <30: minimum 60 h, optimal 168 h.",
                "For urine collection after intravascular contrast: eGFR >60: minimum 24 h; eGFR 30–60: minimum 48 h; eGFR <30: minimum 7 days."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The 2025 document gives a much more explicit practice framework than the older “delay if possible” approach."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 laboratory-interference guidance",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "extravasation",
        level: "high",
        icon: "extravasation",
        title: "Extravasation",
        summary:
          "2025 is much more operational here, with severity framing, clearer prevention, structured detection, and escalation criteria.",
        keywords: [
          "extravasation",
          "contrast leak",
          "severity",
          "mild moderate severe",
          "150 mL",
          "surgical opinion"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Extravasation was already addressed in 2018, but with a simpler management frame and less detailed separation of risk factors, recognition steps, and escalation pathways."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Uses a clearer mild / moderate / severe framing.",
                "Separates technique-related and patient-related risk factors.",
                "Expands prevention, detection, documentation, follow-up, and escalation.",
                "Specifically addresses radiographic documentation in moderate / severe cases and surgical input for severe injury concerns."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "The 2025 approach is less dependent on local habit and more like an operational pathway."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 extravasation guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "Use a structured mild / moderate / severe framework rather than treating all extravasations as one category.",
                "Consider technique-related and patient-related risk factors separately.",
                "For moderate / severe cases, radiographic documentation is described.",
                "If severe injury is suspected, surgical assessment is described; a surgical opinion is also described for extravasation volumes >150 mL."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "Compared with 2018, this section is far more explicit about prevention, recognition, documentation, and escalation."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 extravasation guidance",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "dialysis_refinement",
        level: "medium",
        icon: "dialysis",
        title: "Dialysis-related refinement",
        summary:
          "2025 refines the dialysis section, especially for GBCA, and differentiates more clearly between macrocyclic and linear agents.",
        keywords: [
          "dialysis",
          "haemodialysis",
          "macrocyclic",
          "linear",
          "GBCA",
          "CAPD",
          "rest diuresis"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "The 2018 guideline was more general: no special timing with dialysis for iodine-based contrast, and dialysis correlation / extra haemodialysis was recommended more broadly for GBCA."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The newer guidance is more explicit: after macrocyclic GBCA, immediate dialysis is not required, whereas after linear agents immediate dialysis is described and repetition on the following two days is advised.",
                "It also highlights the relevance of remnant renal function and CAPD-specific trade-offs."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "The dialysis section is no longer just “dialyse soon after GBCA.” It is more agent-specific and more nuanced."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 dialysis guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "After macrocyclic GBCA, immediate dialysis is not described as necessary.",
                "After linear GBCA, immediate dialysis is described and repetition on the following two days is advised.",
                "In CAPD and similar settings, the guideline describes weighing the NSF risk of linear agents against the risk of temporary haemodialysis access.",
                "For iodine-based contrast in end-stage renal failure, the role of remnant diuresis is highlighted more clearly."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The 2025 section is more specific and avoids lumping all GBCA into one dialysis rule."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 dialysis guidance",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "new_clinical_scenarios",
        level: "medium",
        icon: "layers",
        title: "New clinical scenarios: myasthenia gravis, HSG, CO₂",
        summary:
          "2025 explicitly adds or foregrounds topics that were absent or not separately framed in the 2018 booklet.",
        keywords: [
          "myasthenia gravis",
          "HSG",
          "hysterosalpingography",
          "CO2",
          "vascular procedures",
          "systemic diseases"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "The 2018 booklet did not have dedicated practice chapters for myasthenia gravis, hysterosalpingography, or CO₂ as an alternative intravascular contrast option."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The 2025 guidance explicitly includes myasthenia gravis within systemic diseases and adds dedicated sections for HSG and for CO₂ as an alternative to iodine-based contrast media in vascular procedures."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "These areas are easier to find and use in the 2025 guidance, rather than requiring extrapolation from broader sections."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 2025 summary guideline",
            "Source: ESUR 10.0 guideline"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "Use the 2025 guidance when questions arise about myasthenia gravis and contrast use, because this topic is now explicitly addressed.",
                "Use the 2025 dedicated section for hysterosalpingography rather than extrapolating from general contrast rules.",
                "Use the 2025 CO₂ section when considering CO₂ as an alternative to iodine-based contrast in vascular procedures."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "These are genuine additions or newly explicit topic areas, not just cosmetic rearrangements."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 summary guideline",
            "Source: ESUR 10.0 guideline"
          ]
        }
      },

      {
        id: "other_reorganized_topics",
        level: "medium",
        icon: "stack",
        title: "Other reorganized or continued topics",
        summary:
          "Several subjects are retained, regrouped, or expanded in 2025 without always becoming headline changes.",
        keywords: [
          "pregnancy",
          "lactation",
          "paediatric",
          "metformin",
          "retention",
          "warming",
          "fasting",
          "nonvascular iodine",
          "systemic diseases",
          "sickle cell"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Pregnancy / lactation, paediatric use, metformin, gadolinium retention, warming / fasting, and several older miscellaneous topics already existed in the 2018 booklet.",
                "Some topics such as late reactions, very late reactions, sickle cell disease, and effects on blood / endothelium were more separately visible in the older structure."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Many of these topics remain, but are regrouped differently. Pregnancy / lactation and paediatric use continue, metformin is embedded within systemic diseases, gadolinium retention remains, and nonvascular iodine administration is described in more detail.",
                "At the same time, some 2018 topics are less separately foregrounded in the 2025 summary structure."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "Absence from the 2025 table of contents should not automatically be interpreted as “removed.” In several cases the content is retained but reorganized."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR 10.0 guideline",
            "Source: ESUR 2025 summary guideline"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "Do not assume that a topic is gone just because it is less separately visible in the 2025 summary structure.",
                "Use the systemic-diseases block in 2025 for regrouped items such as metformin and other disease-related topics.",
                "Use the 2025 text if you need the expanded wording on nonvascular iodine-based contrast administration."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "Not every difference between 2018 and 2025 is a new rule. Some are changes in framing, grouping, or level of emphasis."
              ]
            }
          ],
          refs: [
            "Source: ESUR 2025 summary guideline",
            "Source: ESUR 10.0 guideline"
          ]
        }
      }
    ],

    de: [
      {
        id: "publication_structure",
        level: "low",
        icon: "document",
        title: "Publikationsmodell und Struktur",
        summary:
          "2025 verschiebt sich die Guidance von einer Booklet-artigen Versionslogik zu einem elektronischen, modularen und jährlich aktualisierten Rahmen.",
        keywords: [
          "publikation",
          "struktur",
          "elektronisch",
          "jährliche aktualisierung",
          "modular",
          "permanent work in progress"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "ESUR 10.0 war als klassisches Leitlinien-Booklet aufgebaut, mit den grossen Bereichen General adverse reactions, Renal adverse reactions (PC-AKI) und Miscellaneous."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Die 2025er Guidance ist themenbasiert modular aufgebaut, etwa zu Hypersensitivität, CA-AKI, Dialyse, Extravasation, Wartezeiten, Laborinterferenz, systemischen Erkrankungen, HSG und CO₂.",
                "Sie wird zudem als elektronisches, jährlich aktualisiertes Dokument und als permanent work in progress beschrieben."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Die neuere Struktur lässt sich direkter auf konkrete klinische Fragen abbilden und sollte nicht als einfacher statischer Nachdruck des 2018er Booklets gelesen werden."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 Summary Guideline"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Wenn du aktuelle ESUR-Kontrastmittel-Guidance zitierst oder vermittelst, sollte die elektronische 2025er Guidance als Referenz dienen und nicht nur ein klassisches Booklet-Update.",
                "Es sollte erwartet werden, dass topic-basierte Module und jährliche elektronische Aktualisierungen relevant sind, wenn ein Praxispunkt neu überprüft wird."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Das ist eine strukturelle Änderung in der Pflege und Zugänglichkeit der Guidance, auch dort, wo sich die zugrunde liegende klinische Regel nicht dramatisch verändert hat."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Summary Guideline",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "hypersensitivity",
        level: "high",
        icon: "warningDrop",
        title: "Hypersensitivität",
        summary:
          "Das ist der stärkste klinische Umbau der 2025er Guidance: klarere Klassifikation, stärkerer allergologischer Fokus und strukturiertere Re-Exposure-Pfade.",
        keywords: [
          "hypersensitivität",
          "immediate",
          "non-immediate",
          "tryptase",
          "allergieabklärung",
          "SCAR",
          "re-exposure",
          "dokumentation",
          "prämedikation"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Die 2018er Guideline behandelte akute, späte und sehr späte Reaktionen bereits, war aber weniger um moderne allergologische Abklärung und formalisierte Re-Exposure-Pfade herum aufgebaut.",
                "Klassifikation und Management waren weniger explizit in immediate und non-immediate hypersensitivity reactions getrennt."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Klare Trennung zwischen immediate und non-immediate hypersensitivity reactions.",
                "Explizite Nutzung sowohl der ACR- als auch der Ring-&-Messmer-Klassifikation.",
                "Deutlich ausgebautes Akutmanagement mit strukturierter Beobachtung, liegendem IV-Zugang, ABCDE-Denke sowie präziserer Lagerung / Supportivmassnahmen.",
                "Stärkerer Fokus auf Tryptase, Dokumentation und Prävention erneuter Reaktionen.",
                "Getrennte Re-Exposure-Logik nach Schweregrad sowie nach elektiver versus notfallmässiger Situation."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Im Vergleich zu 2018 ist die 2025er Guidance deutlich allergologischer und strukturierter, vor allem nach moderaten oder schweren Reaktionen.",
                "Die exakte Dokumentation des auslösenden Kontrastmittels und der Reaktionsdetails wird viel wichtiger, weil spätere Tests und Re-Exposure-Entscheidungen davon abhängen."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 Hypersensitivitäts-Guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Nach moderaten oder schweren Reaktionen sowie nach klinisch relevanten NIHR beschreibt ESUR 2025 eine formelle allergologische Abklärung.",
                "Bei zukünftiger Kontrastmittelgabe wird eine Beobachtung von mindestens 30 min mit liegendem IV-Zugang beschrieben.",
                "Wenn das auslösende Mittel bekannt ist und keine allergologisch basierte Empfehlung vorliegt, kann die Verwendung eines anderen Kontrastmittels erwogen werden.",
                "Bei schweren NIHR / SCAR wird die Vermeidung der betroffenen Kontrastmittelklasse beschrieben.",
                "Eine Tryptase-Bestimmung innerhalb von 4 h sowie eine Baseline-Bestimmung nach ≥24 h werden beschrieben."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Dieser Guideline-Teil dreht sich nicht mehr nur um das Etikett einer früheren Reaktion. Er ist jetzt auf strukturierte Risikodokumentation, Fachabklärung und kontrolliertere Re-Exposure-Entscheidungen ausgerichtet."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Hypersensitivitäts-Guidance",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "ca_aki_terminology",
        level: "low",
        icon: "kidney",
        title: "Renale Terminologie: PC-AKI → CA-AKI",
        summary:
          "Der renale Abschnitt wird umbenannt und an neuere Terminologie angepasst, ohne dass das präventive Grundgerüst komplett neu gebaut wird.",
        keywords: [
          "pc-aki",
          "ca-aki",
          "renal",
          "terminologie",
          "contrast-associated acute kidney injury"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Die 2018er Guideline verwendete im renalen Kapitel den Begriff PC-AKI (post-contrast acute kidney injury)."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Die 2025er Guidance verwendet CA-AKI (contrast-associated acute kidney injury) und verknüpft diese Wortwahl explizit mit neuerer Konsensterminologie."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Das betrifft vor allem Terminologie, Kommunikation und den Anschluss an die neuere Literatur. Es sollte nicht als grösste praktische Änderung des renalen Abschnitts fehlinterpretiert werden."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 CA-AKI-Guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "In aktueller Kommunikation und Dokumentation sollte im aktualisierten ESUR-Rahmen der Begriff CA-AKI verwendet werden.",
                "Diese sprachliche Änderung sollte nicht als grosser neuer klinischer Bedside-Algorithmus überbewertet werden."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die Terminologie wird an neuere nephrologische / radiologische Konsenssprache angepasst, während grosse Teile des zugrunde liegenden Risikorahmens vertraut bleiben."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 CA-AKI-Guidance",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "waiting_times",
        level: "high",
        icon: "clock",
        title: "Sichere Zeitintervalle zwischen Kontrastmittelgaben",
        summary:
          "2025 wird daraus ein eigener Praxisblock, der gemischte MRI/CT-Szenarien von wiederholten jodhaltigen bzw. gadoliniumhaltigen Gaben trennt.",
        keywords: [
          "wartezeiten",
          "zeitintervall",
          "gbca",
          "icm",
          "same day",
          "mri zuerst",
          "wiederholte kontrastmittelgabe",
          "dialysesitzungen"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Die 2018er Guideline behandelte bereits die Kombination Iod + Gadolinium am selben Tag, zwei Iod-Gaben und zwei Gadolinium-Gaben, aber als ältere Einzelkapitel mit weniger operativer Logik."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Die 2025er Guidance macht daraus einen expliziteren Praxisblock und trennt szenariospezifische Intervalle, inklusive gemischter MRI-/CT-Workflows und wiederholter Gaben derselben Kontrastmittelklasse."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Dieses Thema darf nicht auf eine einzige generische eGFR-Regel reduziert werden. Die 2025er Guidance trennt zwischen gemischten GBCA → ICM-Abläufen, zwei ICM-Gaben und zwei GBCA-Gaben."
              ],
              variant: "impact"
            }
          ],
          nested: [
            {
              title: "1. Elektive Kombination MRI + CT/(koronare) Angiographie",
              sections: [
                {
                  label: "2018",
                  paragraphs: [
                    "Die Kombination von Iod + Gadolinium am selben Tag wurde bereits erwähnt, aber weniger explizit operativ strukturiert."
                  ]
                },
                {
                  label: "2025",
                  bullets: [
                    "Für elektive Same-Day-Kombinationen sagt ESUR 2025, dass MRI vorzuziehen ist, ausser bei CT-Urographie.",
                    "GBCA → ICM: eGFR >60: Minimum 2 h, optimal 6 h.",
                    "GBCA → ICM: eGFR 30–60: Minimum 16 h, optimal 48 h.",
                    "GBCA → ICM: eGFR <30: Minimum 60 h, optimal 168 h.",
                    "Bei Notfall oder lebensbedrohlicher Situation können keine Wartezeit / back-to-back-Gaben verwendet werden."
                  ]
                },
                {
                  label: "Praktische Bedeutung",
                  paragraphs: [
                    "Die Reihenfolge der Untersuchungen ist relevant. Gemischte Same-Day-Workflows sollten bewusster geplant werden als früher."
                  ],
                  variant: "impact"
                }
              ]
            },
            {
              title: "2. Zwei jodhaltige Kontrastmittelgaben",
              sections: [
                {
                  label: "2025",
                  bullets: [
                    "eGFR >60: Minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: Minimum 16 h, optimal 48 h.",
                    "eGFR <30: Minimum 60 h, optimal 168 h.",
                    "Dialyse ohne Restfunktion: mindestens 3 Dialysesitzungen."
                  ]
                }
              ]
            },
            {
              title: "3. Zwei gadoliniumhaltige Kontrastmittelgaben",
              sections: [
                {
                  label: "2025",
                  bullets: [
                    "Ohne bekannte Niereninsuffizienz: Minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: Minimum 16 h, optimal 48 h.",
                    "eGFR <30: Minimum 60 h, optimal 168 h.",
                    "Dialyse ohne Restfunktion: mindestens 3 Dialysesitzungen."
                  ]
                }
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 Wartezeiten-Guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "Warum dieses Thema getrennte Szenarien braucht",
              paragraphs: [
                "ESUR 2025 verwendet keine einzige Wartezeiten-Regel für alle Situationen. Das gemischte MRI-/CT-Szenario wird getrennt von wiederholten rein jodhaltigen bzw. rein gadoliniumhaltigen Gaben behandelt."
              ]
            }
          ],
          nested: [
            {
              title: "Elektive Kombination MRI + CT/(koronare) Angiographie",
              sections: [
                {
                  label: "ESUR-2025-Kernaussagen",
                  bullets: [
                    "Für elektive Same-Day-Kombinationen sagt ESUR 2025, dass MRI vorzugsweise zuerst erfolgen sollte, ausser bei CT-Urographie.",
                    "Wenn GBCA vor ICM gegeben wird: eGFR >60: Minimum 2 h, optimal 6 h.",
                    "Wenn GBCA vor ICM gegeben wird: eGFR 30–60: Minimum 16 h, optimal 48 h.",
                    "Wenn GBCA vor ICM gegeben wird: eGFR <30: Minimum 60 h, optimal 168 h.",
                    "Bei Notfall oder lebensbedrohlicher Situation können weiterhin keine Wartezeit / back-to-back-Gaben verwendet werden."
                  ],
                  variant: "action"
                },
                {
                  label: "Warum das wichtig ist",
                  paragraphs: [
                    "Genau in diesem Szenario wäre eine zu grobe „4 h / 12 h für alle“-Regel falsch."
                  ]
                }
              ]
            },
            {
              title: "Zwei jodhaltige Kontrastmittelgaben",
              sections: [
                {
                  label: "ESUR-2025-Kernaussagen",
                  bullets: [
                    "eGFR >60: Minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: Minimum 16 h, optimal 48 h.",
                    "eGFR <30: Minimum 60 h, optimal 168 h.",
                    "Dialyse ohne Restfunktion: mindestens 3 Dialysesitzungen."
                  ],
                  variant: "action"
                }
              ]
            },
            {
              title: "Zwei gadoliniumhaltige Kontrastmittelgaben",
              sections: [
                {
                  label: "ESUR-2025-Kernaussagen",
                  bullets: [
                    "Ohne bekannte Niereninsuffizienz: Minimum 4 h, optimal 12 h.",
                    "eGFR 30–60: Minimum 16 h, optimal 48 h.",
                    "eGFR <30: Minimum 60 h, optimal 168 h.",
                    "Dialyse ohne Restfunktion: mindestens 3 Dialysesitzungen."
                  ],
                  variant: "action"
                }
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Wartezeiten-Guidance",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "laboratory_interference",
        level: "high",
        icon: "lab",
        title: "Analytische Interferenz mit Labortests",
        summary:
          "2025 wird Laborinterferenz zu einem eigenen Praxisblock mit klareren eGFR-basierten Zeitangaben für Blut- und Urinsammlung.",
        keywords: [
          "labor",
          "blut",
          "urin",
          "interferenz",
          "analytisch",
          "timing",
          "nach kontrastmittel"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Die 2018er Guideline behandelte Wechselwirkungen mit anderen Medikamenten und klinischen Tests, aber deutlich allgemeiner: Blut und Urin nach Möglichkeit vor Kontrastmittelgabe abnehmen und Nachkontrollen insbesondere bei Niereninsuffizienz hinauszögern."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Die 2025er Guidance führt Laborinterferenz als eigenen Abschnitt und gibt klarere Zeitangaben nach intravaskulärer Gabe iodhaltiger oder gadoliniumhaltiger Kontrastmittel."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Aus einem älteren Vorsichtsthema wird ein deutlich praktikableres Timing-Schema für Blut- und Urinabnahmen nach Kontrastmitteluntersuchungen."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 Laborinterferenz-Guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Für Blutentnahmen nach intravaskulärem Kontrastmittel: eGFR >60: Minimum 4 h, optimal 12 h.",
                "Für Blutentnahmen nach intravaskulärem Kontrastmittel: eGFR 30–60: Minimum 16 h, optimal 48 h.",
                "Für Blutentnahmen nach intravaskulärem Kontrastmittel: eGFR <30: Minimum 60 h, optimal 168 h.",
                "Für Urinentnahmen nach intravaskulärem Kontrastmittel: eGFR >60: Minimum 24 h; eGFR 30–60: Minimum 48 h; eGFR <30: Minimum 7 Tage."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die 2025er Guidance ist hier viel klarer und praxisnäher als der ältere Ansatz „wenn möglich verzögern“."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Laborinterferenz-Guidance",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "extravasation",
        level: "high",
        icon: "extravasation",
        title: "Extravasation",
        summary:
          "2025 wird dieser Bereich viel operativer: Severity-Framing, klarere Prävention, strukturierte Erkennung und definiertere Eskalationskriterien.",
        keywords: [
          "extravasation",
          "kontrastmittelaustritt",
          "schweregrad",
          "mild moderat schwer",
          "150 mL",
          "chirurgische beurteilung"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Extravasation wurde bereits 2018 behandelt, aber mit einfacherem Management-Rahmen und weniger detaillierter Trennung von Risikofaktoren, Erkennungsschritten und Eskalationswegen."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Klarere Einteilung in mild / moderat / schwer.",
                "Trennung zwischen technikbezogenen und patientenbezogenen Risikofaktoren.",
                "Deutlich mehr Details zu Prävention, Erkennung, Dokumentation, Follow-up und Eskalation.",
                "Explizite radiographische Dokumentation bei moderaten / schweren Fällen sowie chirurgischer Input bei Verdacht auf schwere Verletzung."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Der 2025er Ansatz ist weniger von lokaler Gewohnheit abhängig und stärker wie ein operativer Pathway aufgebaut."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 Extravasations-Guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Es sollte ein strukturiertes mild / moderat / schwer-Schema verwendet werden, statt alle Extravasationen als eine Kategorie zu behandeln.",
                "Technikbezogene und patientenbezogene Risikofaktoren sollten getrennt betrachtet werden.",
                "Für moderate / schwere Fälle wird radiographische Dokumentation beschrieben.",
                "Bei Verdacht auf schwere Verletzung wird chirurgische Beurteilung beschrieben; zusätzlich wird eine chirurgische Beurteilung bei >150 mL beschrieben."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Im Vergleich zu 2018 ist dieser Abschnitt deutlich expliziter in Prävention, Erkennung, Dokumentation und Eskalation."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Extravasations-Guidance",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "dialysis_refinement",
        level: "medium",
        icon: "dialysis",
        title: "Dialyse-bezogene Präzisierung",
        summary:
          "2025 wird der Dialyse-Abschnitt insbesondere für GBCA klarer und unterscheidet deutlicher zwischen makrozyklischen und linearen Mitteln.",
        keywords: [
          "dialyse",
          "hämodialyse",
          "makrozyklisch",
          "linear",
          "GBCA",
          "CAPD",
          "restdiurese"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Die 2018er Guideline war allgemeiner: für iodhaltige Kontrastmittel keine spezielle zeitliche Abstimmung mit Dialyse, und für GBCA eher breitere Empfehlungen zur Korrelation mit Dialyse bzw. zusätzlicher Hämodialyse."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Die neuere Guidance ist konkreter: nach makrozyklischen GBCA ist keine sofortige Dialyse nötig, nach linearen Mitteln wird eine sofortige Dialyse beschrieben und eine Wiederholung an den folgenden zwei Tagen empfohlen.",
                "Zudem werden Restfunktion der Niere und CAPD-spezifische Abwägungen klarer betont."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Der Dialyse-Abschnitt ist nicht mehr einfach „nach GBCA möglichst rasch dialysieren“. Er ist mittel- und situationsspezifischer geworden."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 Dialyse-Guidance"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Nach makrozyklischen GBCA wird eine sofortige Dialyse nicht als notwendig beschrieben.",
                "Nach linearen GBCA wird eine sofortige Dialyse beschrieben, mit Wiederholung an den folgenden zwei Tagen.",
                "Bei CAPD und ähnlichen Situationen beschreibt die Guideline eine Abwägung zwischen NSF-Risiko linearer Mittel und dem Risiko eines temporären Hämodialysezugangs.",
                "Für iodhaltige Kontrastmittel bei terminalem Nierenversagen wird die Bedeutung der Restdiurese klarer hervorgehoben."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die 2025er Guidance ist hier deutlich spezifischer und behandelt nicht mehr alle GBCA unter derselben Dialyse-Regel."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Dialyse-Guidance",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "new_clinical_scenarios",
        level: "medium",
        icon: "layers",
        title: "Neue klinische Szenarien: Myasthenia gravis, HSG, CO₂",
        summary:
          "2025 werden Themen explizit ergänzt oder hervorgehoben, die im 2018er Booklet fehlten oder nicht separat gerahmt waren.",
        keywords: [
          "myasthenia gravis",
          "HSG",
          "hysterosalpingographie",
          "CO2",
          "vaskuläre eingriffe",
          "systemische erkrankungen"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Das 2018er Booklet hatte keine eigenen Praxis-Kapitel zu Myasthenia gravis, Hysterosalpingographie oder CO₂ als alternative intravaskuläre Kontrastoption."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Die 2025er Guidance enthält Myasthenia gravis explizit im Block zu systemischen Erkrankungen und ergänzt eigene Abschnitte zu HSG sowie zu CO₂ als Alternative zu iodhaltigen Kontrastmitteln bei vaskulären Eingriffen."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Diese Themen sind in der 2025er Guidance leichter auffindbar und nutzbar, anstatt aus breiteren Abschnitten abgeleitet werden zu müssen."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Summary Guideline",
            "Quelle: ESUR 10.0 Guideline"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Bei Fragen zu Myasthenia gravis und Kontrastmittel sollte die 2025er Guidance verwendet werden, weil dieses Thema jetzt explizit adressiert wird.",
                "Für HSG sollte der dedizierte 2025er Abschnitt verwendet werden, statt nur von allgemeinen Kontrastmittelregeln auszugehen.",
                "Wenn CO₂ als Alternative zu iodhaltigem Kontrastmittel bei vaskulären Eingriffen erwogen wird, sollte der 2025er CO₂-Abschnitt herangezogen werden."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Das sind echte Ergänzungen bzw. neu explizit gemachte Themenbereiche und nicht nur kosmetische Umstellungen."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Summary Guideline",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      },

      {
        id: "other_reorganized_topics",
        level: "medium",
        icon: "stack",
        title: "Weitere reorganisierte oder fortgeführte Themen",
        summary:
          "Mehrere Inhalte bleiben erhalten, werden umgruppiert oder ausgebaut, ohne dass sie immer als grosse Headline-Änderungen erscheinen.",
        keywords: [
          "schwangerschaft",
          "laktation",
          "pädiatrie",
          "metformin",
          "retention",
          "warming",
          "fasting",
          "nichtvaskuläres jod",
          "systemische erkrankungen",
          "sickle cell"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Schwangerschaft / Laktation, pädiatrische Anwendung, Metformin, Gadolinium-Retention, Warming / Fasting und mehrere ältere Miscellaneous-Themen waren bereits im 2018er Booklet enthalten.",
                "Einige Themen wie late reactions, very late reactions, sickle cell disease und effects on blood / endothelium waren im älteren Aufbau stärker separat sichtbar."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Viele dieser Inhalte bleiben erhalten, werden aber anders gruppiert. Schwangerschaft / Laktation und Pädiatrie bleiben, Metformin ist in systemische Erkrankungen eingebettet, Gadolinium-Retention bleibt, und die nichtvaskuläre Gabe iodhaltiger Kontrastmittel wird breiter beschrieben.",
                "Gleichzeitig werden manche 2018 prominenter sichtbaren Themen im 2025er Summary-Aufbau weniger separat hervorgehoben."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Dass ein Thema im 2025er Inhaltsverzeichnis weniger prominent erscheint, bedeutet nicht automatisch, dass es inhaltlich entfernt wurde. In mehreren Fällen wurde es fortgeführt, aber umgruppiert."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR 10.0 Guideline",
            "Quelle: ESUR 2025 Summary Guideline"
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Es sollte nicht automatisch angenommen werden, dass ein Thema verschwunden ist, nur weil es im 2025er Summary-Aufbau weniger separat sichtbar ist.",
                "Für umgruppierte Inhalte wie Metformin und weitere krankheitsbezogene Themen sollte in 2025 der Block zu systemischen Erkrankungen genutzt werden.",
                "Wenn die breitere Formulierung zur nichtvaskulären Gabe iodhaltiger Kontrastmittel gebraucht wird, sollte der 2025er Text verwendet werden."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Nicht jede Differenz zwischen 2018 und 2025 ist eine neue Regel. Teilweise geht es um Framing, Gruppierung oder unterschiedliche Betonung."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR 2025 Summary Guideline",
            "Quelle: ESUR 10.0 Guideline"
          ]
        }
      }
    ]
  };

  const views = {
    flow: document.getElementById("view-flow"),
    switch: document.getElementById("view-switch"),
    tryptase: document.getElementById("view-tryptase"),
    nihr: document.getElementById("view-nihr"),
    changes: document.getElementById("view-changes")
  };

  const flowOutput = document.getElementById("flowOutput");
  const flowSafety = document.getElementById("flowSafety");
  const switchOutput = document.getElementById("switchOutput");
  const tryptaseOutput = document.getElementById("tryptaseOutput");
  const nihrOutput = document.getElementById("nihrOutput");

  const icmCard = document.getElementById("icmCard");
  const gbcaCard = document.getElementById("gbcaCard");

  const changesSummaryGrid = document.getElementById("changesSummaryGrid");
  const changesList = document.getElementById("changesList");
  const changesSearchInput = document.getElementById("changesSearch");

  function t(key) {
    return i18n[state.lang][key];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function levelLabel(level) {
    if (level === "high") return t("badge_practice_changing");
    if (level === "medium") return t("badge_refined");
    return t("badge_structural");
  }

  function modeLabel(mode) {
    return mode === "action" ? t("changes_action_mode_badge") : t("changes_compare_mode_badge");
  }

  function iconSvg(name, className) {
    const cls = className ? ` class="${className}"` : "";
    const common = `fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;

    const icons = {
      document: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <path ${common} d="M8 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 20V5a1.5 1.5 0 0 1 1.5-1.5Z"/>
          <path ${common} d="M14 3.5V8h4"/>
          <path ${common} d="M9.5 12h5"/>
          <path ${common} d="M9.5 15.5h5"/>
        </svg>
      `,
      warningDrop: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <path ${common} d="M12 4.5 3.8 18.3a1.3 1.3 0 0 0 1.1 2h14.2a1.3 1.3 0 0 0 1.1-2L12 4.5Z"/>
          <path ${common} d="M12 10v3.8"/>
          <path ${common} d="M12 17.2h.01"/>
          <path ${common} d="M18.8 4.2c-1.6 1.2-3 2.7-3 4.6 0 1.6 1.2 2.8 2.8 2.8 1.7 0 3.1-1.3 3.1-3.1 0-1.5-1-3.1-2.9-4.3Z"/>
        </svg>
      `,
      kidney: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <path ${common} d="M9.4 4.4c-2.8 0-5 2.2-5 5v2.1c0 3.3 2.5 6 5.6 6 2.4 0 4.4-1.9 4.4-4.3V8.8c0-2.4-1.9-4.4-4.4-4.4Z"/>
          <path ${common} d="M14.6 4.4c2.8 0 5 2.2 5 5v2.1c0 3.3-2.5 6-5.6 6-2.4 0-4.4-1.9-4.4-4.3V8.8c0-2.4 1.9-4.4 4.4-4.4Z"/>
        </svg>
      `,
      clock: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <circle ${common} cx="12" cy="12" r="8.5"/>
          <path ${common} d="M12 7.7v4.9l3.3 1.8"/>
        </svg>
      `,
      lab: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <path ${common} d="M9 3.8h6"/>
          <path ${common} d="M10.4 3.8v5.1l-4.7 8.3a2.2 2.2 0 0 0 1.9 3.3h8.8a2.2 2.2 0 0 0 1.9-3.3l-4.7-8.3V3.8"/>
          <path ${common} d="M8.2 14.2h7.6"/>
        </svg>
      `,
      extravasation: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <path ${common} d="M6.2 13.2 8 7.6c.3-.9 1.2-1.5 2.2-1.5h1.1c1 0 1.9.6 2.2 1.5l1.5 4.7"/>
          <path ${common} d="M5.5 14.4h9.6c1.7 0 3 1.3 3 3v.2a2.8 2.8 0 0 1-2.8 2.8H9.9a4.2 4.2 0 0 1-4.1-4.1v-1.9c0-.6.5-1 1-1Z"/>
          <path ${common} d="M18.2 5.4c-1.2.9-2.2 2-2.2 3.5 0 1.2.9 2.2 2.2 2.2 1.4 0 2.5-1.1 2.5-2.5 0-1.2-.8-2.4-2.5-3.2Z"/>
        </svg>
      `,
      dialysis: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <rect ${common} x="4.5" y="5.2" width="6.4" height="13.6" rx="1.6"/>
          <path ${common} d="M10.9 8.2h2.7a3.8 3.8 0 0 1 3.8 3.8v0a3.8 3.8 0 0 1-3.8 3.8h-2.7"/>
          <path ${common} d="M17.4 6.1v2.1"/>
          <path ${common} d="M17.4 15.8v2.1"/>
          <path ${common} d="M6.5 9.2h2.4"/>
          <path ${common} d="M6.5 14.8h2.4"/>
        </svg>
      `,
      layers: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <path ${common} d="m12 4.4 8 4.2-8 4.2-8-4.2 8-4.2Z"/>
          <path ${common} d="m4 12.1 8 4.2 8-4.2"/>
          <path ${common} d="m6.2 17.1 5.8 3 5.8-3"/>
        </svg>
      `,
      stack: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <rect ${common} x="5" y="4.5" width="11.8" height="7" rx="1.4"/>
          <rect ${common} x="7.2" y="9.1" width="11.8" height="7" rx="1.4"/>
          <rect ${common} x="9.4" y="13.7" width="9.6" height="5.8" rx="1.4"/>
        </svg>
      `,
      chevron: `
        <svg viewBox="0 0 24 24"${cls} aria-hidden="true">
          <path ${common} d="m6.8 9.5 5.2 5 5.2-5"/>
        </svg>
      `
    };

    return icons[name] || icons.document;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = state.lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (i18n[state.lang][key] !== undefined) {
        el.textContent = i18n[state.lang][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (i18n[state.lang][key] !== undefined) {
        el.placeholder = i18n[state.lang][key];
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
    setText("gbca-group-b-names", "Gadoteridol • Gadobutrol");
    setText("gbca-group-c-names", "Gadopiclenol");

    const baseline = document.getElementById("baseline");
    const acute = document.getElementById("acute");
    if (baseline) baseline.placeholder = `${t("tryptase_baseline")} (ng/mL)`;
    if (acute) acute.placeholder = `${t("tryptase_acute")} (ng/mL)`;

    if (changesSearchInput && changesSearchInput.value !== state.changesSearch) {
      changesSearchInput.value = state.changesSearch;
    }
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
        <div><strong>${escapeHtml(title)}</strong></div>
        <ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
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
        switchOutput.innerHTML = `<div class="hint">${escapeHtml(t("switch_placeholder_icm"))}</div>`;
        return;
      }

      const rule = t("icm_rules")[state.icm];
      switchOutput.innerHTML = `
        <div><strong>${escapeHtml(rule.title)}</strong></div>
        <div style="margin-top:10px">${escapeHtml(rule.text)}</div>
        <div class="hint" style="margin-top:10px">${escapeHtml(rule.note)}</div>
      `;
      return;
    }

    if (icmCard) icmCard.hidden = true;
    if (gbcaCard) gbcaCard.hidden = false;

    if (!state.gbca) {
      switchOutput.innerHTML = `<div class="hint">${escapeHtml(t("switch_placeholder_gbca"))}</div>`;
      return;
    }

    const rule = t("gbca_rules")[state.gbca];
    switchOutput.innerHTML = `
      <div><strong>${escapeHtml(rule.title)}</strong></div>
      <div style="margin-top:10px">${escapeHtml(rule.text)}</div>
      <div class="hint" style="margin-top:10px">${escapeHtml(rule.note)}</div>
    `;
  }

  function renderTryptase() {
    if (!tryptaseOutput) return;
    if (!tryptaseOutput.dataset.ready) {
      tryptaseOutput.innerHTML = `
        <div class="hint">${escapeHtml(t("tryptase_default"))}</div>
        <div class="hint" style="margin-top:10px">${escapeHtml(t("tryptase_formula"))}</div>
      `;
    }
  }

  function calcTryptase() {
    if (!tryptaseOutput) return;

    const baseline = Number(document.getElementById("baseline")?.value);
    const acute = Number(document.getElementById("acute")?.value);

    if (!isFinite(baseline) || !isFinite(acute) || baseline < 0 || acute < 0) {
      tryptaseOutput.innerHTML = `<div class="hint">${escapeHtml(t("tryptase_invalid"))}</div>`;
      return;
    }

    const threshold = (1.2 * baseline) + 2;
    const significant = acute >= threshold;

    tryptaseOutput.innerHTML = `
      <div><strong>${escapeHtml(t("tryptase_threshold"))}:</strong> ${threshold.toFixed(2)} ng/mL</div>
      <div><strong>${escapeHtml(t("tryptase_acute"))}:</strong> ${acute.toFixed(2)} ng/mL</div>
      <div><strong>${escapeHtml(t("tryptase_baseline"))}:</strong> ${baseline.toFixed(2)} ng/mL</div>
      <div class="hint" style="margin-top:10px">${escapeHtml(t("tryptase_formula"))}</div>
      <div style="margin-top:10px"><strong>${escapeHtml(significant ? t("tryptase_positive") : t("tryptase_negative"))}</strong></div>
      <div class="hint" style="margin-top:10px">${escapeHtml(t("tryptase_note"))}</div>
    `;

    tryptaseOutput.dataset.ready = "1";
  }

  function renderNihr() {
    if (!nihrOutput) return;

    const anyChecked = Array.from(document.querySelectorAll(".nihr-check")).some((el) => el.checked);

    if (!anyChecked) {
      nihrOutput.innerHTML = `<div class="hint">${escapeHtml(t("nihr_default"))}</div>`;
      return;
    }

    const lines =
      state.nihrCmtype === "gbca"
        ? t("nihr_positive_text_gbca")
        : t("nihr_positive_text_icm");

    nihrOutput.innerHTML = `
      <div><strong>${escapeHtml(t("nihr_positive_title"))}</strong></div>
      <ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    `;
  }

  function getChanges() {
    return changesLibrary[state.lang];
  }

  function flattenChangeText(change) {
    const chunks = [change.title, change.summary, ...(change.keywords || [])];

    const readSections = (block) => {
      if (!block) return;

      (block.sections || []).forEach((section) => {
        chunks.push(section.label || "");
        (section.paragraphs || []).forEach((p) => chunks.push(p));
        (section.bullets || []).forEach((b) => chunks.push(b));
      });

      (block.nested || []).forEach((item) => {
        chunks.push(item.title || "");
        (item.sections || []).forEach((section) => {
          chunks.push(section.label || "");
          (section.paragraphs || []).forEach((p) => chunks.push(p));
          (section.bullets || []).forEach((b) => chunks.push(b));
        });
      });

      (block.refs || []).forEach((r) => chunks.push(r));
    };

    readSections(change.compare);
    readSections(change.action);

    return chunks.join(" ").toLowerCase();
  }

  function getVisibleChanges() {
    const search = state.changesSearch.trim().toLowerCase();
    return getChanges().filter((change) => {
      const levelMatch = state.changesFilter === "all" || change.level === state.changesFilter;
      if (!levelMatch) return false;
      if (!search) return true;
      return flattenChangeText(change).includes(search);
    });
  }

  function renderChangeSection(section) {
    const classes = ["change-section"];
    if (section.variant === "action") classes.push("change-section--action");
    if (section.variant === "impact") classes.push("change-section--impact");

    const paragraphs = (section.paragraphs || [])
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");

    const bullets = (section.bullets || []).length
      ? `<ul>${section.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
      : "";

    return `
      <div class="${classes.join(" ")}">
        <div class="change-section__label">${escapeHtml(section.label)}</div>
        <div class="change-section__content">
          ${paragraphs}
          ${bullets}
        </div>
      </div>
    `;
  }

  function renderNestedItem(item) {
    return `
      <div class="change-nested__item">
        <div class="change-nested__head">
          <div class="change-nested__title">${escapeHtml(item.title)}</div>
        </div>
        <div class="change-nested__body">
          ${(item.sections || []).map(renderChangeSection).join("")}
        </div>
      </div>
    `;
  }

  function renderRefs(refs) {
    return `
      <div class="change-card__refs">
        ${(refs || []).map((ref) => `<span class="change-ref">${escapeHtml(ref)}</span>`).join("")}
      </div>
    `;
  }

  function renderChangeBody(change) {
    const block = state.changesMode === "action" ? change.action : change.compare;
    const sections = (block.sections || []).map(renderChangeSection).join("");
    const nested = (block.nested || []).length
      ? `<div class="change-nested">${block.nested.map(renderNestedItem).join("")}</div>`
      : "";

    return `
      <div class="change-card__body" ${state.openChanges.has(change.id) ? "" : "hidden"}>
        ${sections}
        ${nested}
        ${renderRefs(block.refs || [])}
      </div>
    `;
  }

  function renderChangeSummary(change) {
    return `
      <article class="change-summary" data-change-summary="${escapeHtml(change.id)}">
        <div class="change-summary__top">
          <div class="change-summary__titlewrap">
            <div class="change-summary__titleline">
              ${iconSvg(change.icon, "change-summary__icon")}
              <div class="change-summary__title">${escapeHtml(change.title)}</div>
            </div>
            <span class="change-pill change-pill--${escapeHtml(change.level)}">${escapeHtml(levelLabel(change.level))}</span>
          </div>
        </div>
        <div class="change-summary__text">${escapeHtml(change.summary)}</div>
        <button class="change-summary__jump" type="button" data-change-open="${escapeHtml(change.id)}">${escapeHtml(t("changes_open"))}</button>
      </article>
    `;
  }

  function renderChangeCard(change) {
    const isOpen = state.openChanges.has(change.id);
    return `
      <article class="change-card ${isOpen ? "is-open" : ""}" id="change-card-${escapeHtml(change.id)}" data-change-card="${escapeHtml(change.id)}">
        <button class="change-card__header" type="button" data-change-toggle="${escapeHtml(change.id)}" aria-expanded="${isOpen ? "true" : "false"}">
          <div class="change-card__titlewrap">
            <div class="change-card__titleline">
              ${iconSvg(change.icon, "change-card__icon")}
              <div class="change-card__title">${escapeHtml(change.title)}</div>
            </div>
            <div class="change-card__meta">
              <span class="change-pill change-pill--${escapeHtml(change.level)}">${escapeHtml(levelLabel(change.level))}</span>
              <span class="change-pill change-pill--mode">${escapeHtml(modeLabel(state.changesMode))}</span>
            </div>
          </div>
          ${iconSvg("chevron", "change-card__chevron")}
        </button>
        ${renderChangeBody(change)}
      </article>
    `;
  }

  function updateChangeControlButtons() {
    document.querySelectorAll("[data-change-filter]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.changeFilter === state.changesFilter);
    });

    document.querySelectorAll("[data-change-mode]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.changeMode === state.changesMode);
    });

    if (changesSearchInput && changesSearchInput.value !== state.changesSearch) {
      changesSearchInput.value = state.changesSearch;
    }
  }

  function attachChangeEvents() {
    document.querySelectorAll("[data-change-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.changeToggle;
        if (state.openChanges.has(id)) {
          state.openChanges.delete(id);
        } else {
          state.openChanges.add(id);
        }
        renderChanges();
      });
    });

    document.querySelectorAll("[data-change-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.changeOpen;
        state.openChanges.add(id);
        renderChanges();

        requestAnimationFrame(() => {
          const target = document.getElementById(`change-card-${id}`);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    });
  }

  function renderChanges() {
    if (!changesSummaryGrid || !changesList) return;

    updateChangeControlButtons();

    const visible = getVisibleChanges();

    if (!visible.length) {
      const empty = `<div class="change-empty">${escapeHtml(t("changes_no_results"))}</div>`;
      changesSummaryGrid.innerHTML = empty;
      changesList.innerHTML = "";
      return;
    }

    changesSummaryGrid.innerHTML = visible.map(renderChangeSummary).join("");
    changesList.innerHTML = visible.map(renderChangeCard).join("");

    attachChangeEvents();
  }

  function renderAll() {
    applyStaticTranslations();
    renderFlow();
    renderSwitch();
    renderTryptase();
    renderNihr();
    renderChanges();
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

    state.changesFilter = "all";
    state.changesMode = "compare";
    state.changesSearch = "";
    state.openChanges = new Set();

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

    document.querySelectorAll("[data-change-filter]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.changeFilter === "all");
    });

    document.querySelectorAll("[data-change-mode]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.changeMode === "compare");
    });

    clearButtons("icm");
    clearButtons("gbca");

    const baseline = document.getElementById("baseline");
    const acute = document.getElementById("acute");
    if (baseline) baseline.value = "";
    if (acute) acute.value = "";
    if (changesSearchInput) changesSearchInput.value = "";

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

  document.querySelectorAll("[data-change-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.changesFilter = btn.dataset.changeFilter;
      renderChanges();
    });
  });

  document.querySelectorAll("[data-change-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.changesMode = btn.dataset.changeMode;
      renderChanges();
    });
  });

  if (changesSearchInput) {
    changesSearchInput.addEventListener("input", (event) => {
      state.changesSearch = event.target.value || "";
      renderChanges();
    });
  }

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
