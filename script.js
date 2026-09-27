document.addEventListener("DOMContentLoaded", function () {
  const state = {
    mainNav: "hsr",          // hsr | changes
    hsrTab: "guidance",      // guidance | acute | switch | tryptase | nihr

    // HSR
    situation: null,
    reaction: null,          // mild | moderate | severe
    cmtype: "icm",
    nihrCmtype: null,
    nihrSeverity: null,
    nihrCulpritKnown: null,
    acuteSeverity: "mild",   // mild | moderate | severe
    acutePattern: "mild_general",
    icm: null,
    gbca: null,

    // Global
    lang: "en",

    // Practice Changes tab
    changesMode: "compare", // compare | action
    changesSearch: "",
    selectedChangeId: null
  };

  const i18n = {
    en: {
      app_title: "Radiology Contrast & Safety App",
      reset: "Reset",

      disclaimer_line1: "Educational tool. Follow local protocols.",
      disclaimer_line2: "Information only. Clinical decisions should follow local protocols, source documents and clinical judgement. No patient data are stored.",
      disclaimer_line3: "Contrast safety content adapted from ESUR Contrast Media Safety Committee guidance.",

      nav_hsr: "HSR",
      nav_changes: "Changes",

      // HSR main
      hsr_title: "HSR",
      hsr_subtitle: "Previous-reaction planning, acute management, empiric switch support, tryptase interpretation and NIHR decision support.",
      hsr_tools_title: "HSR tools",
      hsr_guidance_tab: "Previous reaction",
      hsr_acute_tab: "Acute management",
      hsr_switch_tab: "Switch",
      hsr_tryptase_tab: "Tryptase",
      hsr_nihr_tab: "NIHR",

      flow_title: "Previous reaction",
      flow_subtitle: "Educational support for prior contrast media hypersensitivity reactions.",
      flow_step1: "Step 1 — Clinical situation",
      flow_step2: "Step 2 — Prior reaction severity",

      flow_routing_note:
        "Educational support for prior immediate hypersensitivity reactions. For non-immediate reactions, use the NIHR module.",
      hsr_referral_title: "Referral & documentation",
      hsr_referral_specify:
        "When referring the patient to a drug allergy specialist, always specify the used contrast medium.",
      hsr_referral_document:
        "Detailed documentation of the culprit contrast agent and the severity of the reaction, including a grading scheme, is mandatory.",

      elective: "Elective",
      emergency: "Emergency",
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe",

      recommendation: "Recommendation",
      safety_net: "Safety net",
      flow_safety:
        "Acute hypersensitivity reactions should be managed according to local protocols and ESUR acute management guidance.",

      switch_title: "Switch",
      switch_subtitle:
        "Optional, non-validated contrast-agent grouping and practical-experience suggestions for empiric switch consideration.",
      contrast_type: "Contrast type",
      nihr_cmtype_title: "Contrast type",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRI)",
      icm_title: "ICM (iodine-based)",
      gbca_title: "GBCA (gadolinium-based)",
      possible_alternatives: "Possible alternatives",
      safety_note: "Safety note",
      switch_status_optional:
        "This switch overview is optional and based on a non-validated classification and practical experience.",
      switch_cmsc:
        "The CMSC cannot make evidence-based recommendations on a robust scientific basis for change to an alternative contrast agent based on practical experience.",
      switch_cr_structure:
        "Cross-reactivity cannot be predicted on the basis of the chemical structure.",
      switch_cr_frequency:
        "Cross-reactivity can occur with a higher frequency among iodine-based contrast media with a N-(2,3-hydroxypropyl)-carbamoyl side chain and among macrocyclic gadolinium-based contrast agents.",
      switch_best_option:
        "The best option is to choose an alternative based on the results of an allergy evaluation.",
      switch_brand_governance:
        "Brand names are shown for product identification only. ESUR grouping and switch guidance are based on the generic contrast-agent substance.",
      switch_safety_note:
        "This switch overview is optional and based on a non-validated classification and practical experience. The CMSC cannot make evidence-based recommendations on a robust scientific basis for change to an alternative contrast agent based on practical experience. Cross-reactivity cannot be predicted on the basis of the chemical structure. The best option is to choose an alternative based on the results of an allergy evaluation.",
      unknown: "Unknown",
      icm_unknown_hint: "Use when the involved ICM is not known.",
      gbca_unknown_hint: "Use when the involved GBCA is not known.",
      icm_group_a_label: "Group A",
      icm_group_b_label: "Group B",
      icm_group_c_label: "Group C",
      icm_group_d_label: "Group D",
      gbca_group_a_label: "Group A",
      gbca_group_b_label: "Group B",
      gbca_group_c_label: "Group C",
      icm_group_a_names:
        "Omnipaque® — iohexol · Visipaque® — iodixanol · Iomeron® — iomeprol · Optiray® — ioversol",
      icm_group_b_names: "Iopamiro® / Isovue® — iopamidol",
      icm_group_c_names: "Ultravist® — iopromide",
      icm_group_d_names: "Xenetix® — iobitridol",
      gbca_group_a_names: "Dotarem® / Clariscan® — gadoterate meglumine",
      gbca_group_b_names:
        "ProHance® — gadoteridol · Gadovist® / Gadavist® — gadobutrol",
      gbca_group_c_names: "Elucirem® / Vueway® — gadopiclenol",
      switch_nonvalidated:
        "This switch overview is optional and based on a non-validated classification and practical experience.",

      tryptase_title: "Serum tryptase",
      tryptase_sample_measure:
        "Measure serum tryptase within 1–4 h from the start of all moderate-to-severe immediate hypersensitivity reactions to contrast media.",
      tryptase_sample_baseline:
        "A second measurement after ≥ 24 h serves as a baseline for further allergologic examinations.",
      tryptase_sample_ideal:
        "Ideally, three samples should be obtained: the first as early as possible during a suspected hypersensitivity reaction, the second at 1–2 h after the first but no later than 4 h after the onset of the reaction, and the third more than 24 h after all signs and symptoms have subsided.",
      enter_values: "Enter values",
      calculate: "Calculate",
      result: "Result",
      tryptase_default:
        "Enter an acute tryptase value obtained during or within 4 h after symptoms and a baseline tryptase value.",
      tryptase_invalid: "Please enter valid numeric values.",
      tryptase_threshold: "Threshold",
      tryptase_acute: "Acute tryptase",
      tryptase_baseline: "Baseline tryptase",
      tryptase_formula:
        "An acute-over-baseline elevation of tryptase of at least 2 ng/mL + (1.2 × baseline tryptase) during or within 4 h after symptoms is suggestive of an IHR.",
      tryptase_positive:
        "The result is suggestive of an IHR.",
      tryptase_negative:
        "The result does not show an acute-over-baseline elevation of at least 2 ng/mL + (1.2 × baseline tryptase).",
      tryptase_note:
        "In mild or moderate IHR, tryptase levels typically remain normal, and the absence of elevation does not exclude the possibility of a genuine IHR.",

            acute_title: "Acute management",
      acute_subtitle:
        "ESUR acute algorithm. Follow local emergency protocol and verify medication concentration before administration.",
      acute_immediate_title: "Immediate assessment and general actions",
      acute_severity_title: "Severity selector",
      acute_pattern_title: "Dominant reaction pattern",
      acute_output_title: "ESUR acute management",
      acute_dose_reference_title: "Dose safety note",
      acute_dose_reference_note:
        "ESUR dose reference. Verify concentration, route, patient factors and local emergency protocol before administration.",
      acute_severity_mild: "Mild reactions",
      acute_severity_moderate: "Moderate reactions",
      acute_severity_severe: "Severe reactions",
      acute_pattern_mild_general: "Mild reactions",
      acute_pattern_moderate_urticaria: "Diffuse urticaria / diffuse erythema",
      acute_pattern_moderate_angioedema: "Facial edema without stridor",
      acute_pattern_moderate_bronchospasm: "Mild bronchospasm",
      acute_pattern_severe_anaphylaxis: "Anaphylactic reaction or stridor",
      acute_section_clinical: "Clinical pattern / warning",
      acute_section_management: "Management",
      acute_section_escalation: "Escalation / rapid response",
      acute_warning_label: "Warning",
      acute_arrest_title: "Cardiac or respiratory arrest",
      acute_immediate_actions: [
        "Monitor the patient closely and judge for progression of the reaction.",
        "Observe closely for mucosal edema of the nose, mouth, throat, or larynx.",
        "In case of symptoms, check heart rate, arterial blood pressure, and consciousness.",
        "Check and stabilize the patient according to the ABCDE method.",
        "Stop infusing contrast agent and replace the IV line with crystalloid.",
        "Dyspnoea or stridor: let the patient sit up.",
        "Consider measuring serum tryptase, ideally 1–2 h after start of the reaction.",
        "Record acute allergic reactions and the culprit contrast medium in the allergy registry of the electronic health record of the patient."
      ],
      acute_content: {
        mild_general: {
clinical:
  "Mild features: nasal congestion; sneezing, conjunctivitis, rhinorrhoea; limited or scattered urticaria and pruritus; cutaneous oedema; limited itchy or scratchy throat. Classify by the most intense symptom.",
management: [
  "Mild reactions may only need reassurance.",
  "Observe vital signs until symptoms resolve.",
  "Do not remove IV access during observation.",
  "After a mild reaction, keep the patient under surveillance until every symptom has disappeared (minimum 30 minutes, usually less than 60 minutes).",
  "Consider a nonsedating antihistamine for mild allergic reactions, for example desloratadine 5 mg orally or cetirizine 10 mg orally, once daily.",
  "For protracted vomiting: ondansetron 4 mg IV."
],
escalation: [
  "Monitor closely and assess for progression of the reaction."
]
        },
        moderate_urticaria: {
clinical: "Diffuse urticaria / diffuse erythema.",
management: [
  "Give chlorphenamine 20 mg or clemastine 2 mg IV.",
  "Consider transferring the patient to a department with facilities for monitoring vital functions."
],
escalation: [
  "If accompanied by hypotension, treat as anaphylaxis."
]
        },
        moderate_angioedema: {
clinical: "Facial edema without stridor.",
management: [
  "Give oxygen 10 to 15 L/min via a non-rebreathing mask.",
  "Give chlorphenamine 20 mg or clemastine 2 mg IV.",
  "Consider transferring the patient to a department with facilities for monitoring vital functions."
],
escalation: [
  "If edema is severe, near airways, or if stridor develops, treat as anaphylaxis."
]
        },
        moderate_bronchospasm: {
clinical: "Mild bronchospasm.",
management: [
  "Short-acting β2-agonist: 2–4 inhalations of 100 µg of salbutamol via inhalation (depending on severity), with option to repeat every 20 min, or via nebulization (2.5–5 µg diluted in 3 mL of saline solution) until clinical improvement.",
  "Consider transferring the patient to a department with facilities for monitoring vital functions."
],
escalation: [
  "In case of deterioration, give adrenaline 0.5 mg IM and consider consulting the rapid response team.",
  "When bronchospasm increases in severity, consider repeating adrenaline 0.5 mg IM, guided by heart rate."
]
        },
        severe_anaphylaxis: {
clinical: "Anaphylactic reaction or stridor.",
management: [
  "Call the rapid response team.",
  "Give oxygen 10 to 15 L/min with non-rebreathing mask.",
  "Give 0.5 mg adrenaline IM in the lateral upper thigh, repeat as necessary, guided by heart rate.",
  "Give fluid bolus of crystalloid 500 mL IV in 10 min, repeat as necessary.",
  "Short-acting β2-agonist: 2–10 inhalations of 100 µg of salbutamol via inhalation (depending on severity), with option to repeat every 20 min, or via nebulization (2.5–5 µg diluted in 3 mL of saline solution) up to 1 h.",
  "Give chlorphenamine 20 mg or clemastine 2 mg IV, repeat as necessary.",
  "Consider adding corticosteroid (for example, prednisolone 50 mg IV)."
],
arrest: [
  "Call the CPR team.",
  "Start CPR."
]
        }
      },

      nihr_title: "NIHR — non-immediate hypersensitivity reactions",
      nihr_subtitle:
        "For a previous non-immediate hypersensitivity reaction to an iodine-based contrast medium or a gadolinium-based contrast agent when re-administration is being considered.",
      nihr_severity_title: "Previous NIHR severity",
      nihr_severity_mild: "Mild",
      nihr_severity_moderate: "Moderate",
      nihr_severity_severe: "Severe",
      nihr_severity_hint:
        "Mild: skin lesions resolve without treatment. Moderate: skin lesions resolve with outpatient treatment. Severe: hospital admission is required for treatment.",
      nihr_culprit_class_title: "Previous culprit contrast class",
      nihr_cmtype_icm: "ICM",
      nihr_cmtype_gbca: "GBCA",
      nihr_cmtype_unknown: "Contrast class unknown",
      nihr_culprit_known_title: "Exact culprit contrast medium known?",
      nihr_culprit_known: "Culprit CM known",
      nihr_culprit_unknown: "Culprit CM unknown",
      nihr_danger_signs_title: "Danger signs",
      erosions: "Erosive and/or haemorrhagic lesions",
      blistering: "Blistering and skin disruption",
      mucosal_involvement: "Mucosal involvement",
      extracutaneous_involvement: "Extracutaneous organ involvement (high fever, abnormal liver/kidney values, lymphadenopathy)",
      nihr_recommendation_title: "NIHR recommendation",
      nihr_safety_note_title: "Safety note",
      nihr_safety_note: "",
      nihr_recommended_actions: "Recommended actions",
      nihr_class_specific_rule: "Class-specific rule",
      nihr_status_scar: "Severe non-immediate hypersensitivity reaction with danger signs (SCAR)",
      nihr_status_moderate: "Moderate NIHR without danger signs",
      nihr_status_mild: "Mild NIHR without danger signs",
      nihr_scope_guard:
        "This combination is not represented as a separate management pathway in ESUR Part 2 Table 2. Reassess the NIHR severity and documented danger signs.",
      nihr_mild_interview: "Interview the patient about their previous hypersensitivity reaction.",
      nihr_mild_refer:
        "Optionally, refer the patient to a drug allergy specialist (if not done before) when the local drug allergy specialist capacity is sufficient.",
      nihr_moderate_refer: "Refer the patient to a drug allergy specialist (if not done before).",
      nihr_optimize_ehr: "Optimize the allergy registration in the electronic health record.",
      nihr_apply_advice:
        "Apply the advice of the drug allergy specialist for a safe iodine-based contrast medium or gadolinium-based contrast agent.",
      nihr_choose_different:
        "When this advice is not available, choose a different iodine-based contrast medium or gadolinium-based contrast agent if the culprit contrast agent is known.",
      nihr_observe:
        "When the contrast medium is administered, observe the patient for at least 30 min with the IV line in place.",
      nihr_written:
        "Give the patient written instructions for a possible repeat non-immediate hypersensitivity reaction.",
      nihr_recurrence:
        "If a non-immediate hypersensitivity reaction recurs, referral to a drug allergy specialist is mandatory.",
      nihr_preventive_alt:
        "Consider an alternative imaging modality, or consider performing an unenhanced exam if the diagnostic yield is sufficient for the correct management of the patient.",
      nihr_preventive_never_deny:
        "Never deny a patient a clinically well-indicated enhanced examination if alternative imaging strategies are not available.",
      nihr_footnote_crossreact:
        "Consider cross-reactivity of contrast media and an increased risk for non-immediate hypersensitivity reaction with the use of iso-osmolar dimeric iodine-based contrast media.",
      nihr_scar_refer:
        "Refer the patient immediately to a drug allergy specialist (if not done before).",
      nihr_scar_choose_imaging: "Choose an alternative imaging modality.",
      nihr_scar_ehr: "Optimize the allergy registration in the electronic health record.",
      nihr_scar_do_not_give:
        "Do not give the group of contrast media to which the severe skin reaction has occurred.",
      nihr_scar_icm_rule:
        "Avoid all iodine-based contrast media after a severe non-immediate hypersensitivity reaction to an iodine-based contrast medium.",
      nihr_scar_gbca_rule:
        "Avoid all gadolinium-based contrast agents after a severe non-immediate hypersensitivity reaction to a gadolinium-based contrast agent.",
      nihr_scar_unknown_rule:
        "Individualize the approach following multidisciplinary consultation after a severe reaction to an unknown CM.",

            icm_hint:
        "ESUR grouping is based on the generic contrast-agent substance. Brand names are shown for product identification only.\nGrouping according to ESUR Part 2 Fig. 2 / Fig. 3 and Table 1.",
      gbca_hint:
        "ESUR grouping is based on the generic contrast-agent substance. Brand names are shown for product identification only.\nGrouping according to ESUR Part 2 Fig. 2 / Fig. 3 and Table 1.",

      flow_titles: {
        elective_mild: "Elective imaging — prior mild immediate hypersensitivity reaction",
        elective_moderate: "Elective imaging — prior moderate immediate hypersensitivity reaction",
        elective_severe: "Elective imaging — prior severe immediate hypersensitivity reaction",
        emergency_mild: "Emergency imaging — prior mild immediate hypersensitivity reaction",
        emergency_moderate: "Emergency imaging — prior moderate immediate hypersensitivity reaction",
        emergency_severe: "Emergency imaging — prior severe immediate hypersensitivity reaction"
      },

      flow_bullets: {
        elective_mild: [
          "Interview the patient about their previous hypersensitivity reaction.",
          "Optionally, refer the patient to a drug allergy specialist (if not done before) when the local drug allergy specialist capacity is sufficient.",
          "Optimize the allergy registration in the electronic health record.",
          "Apply the advice of the drug allergy specialist for a safe iodine-based contrast medium or gadolinium-based contrast agent, or, when not available, choose a different iodine-based contrast medium or gadolinium-based contrast agent if the culprit contrast agent is known.",
          "When the contrast medium is administered, observe the patient for at least 30 min with the IV line in place.",
          "Be prepared and vigilant for a recurring immediate hypersensitivity reaction.",
          "If an immediate hypersensitivity reaction recurs, referral to a drug allergy specialist is mandatory.",
          "Consider an alternative imaging modality, or consider performing an unenhanced exam if the diagnostic yield is sufficient for the correct management of the patient.",
          "Never deny a patient a clinically well-indicated enhanced examination if alternative imaging strategies are not available."
        ],
        elective_moderate: [
          "Refer the patient to a drug allergy specialist (if not done before).",
          "Optimize the allergy registration in the electronic health record.",
          "Postpone imaging to wait for the results of the allergy analysis.",
          "Apply the advice of the drug allergy specialist for a safe iodine-based contrast medium or gadolinium-based contrast agent.",
          "When the contrast medium is administered, observe the patient for at least 30 min with the IV line in place.",
          "Be prepared and vigilant for a recurring immediate hypersensitivity reaction.",
          "If an immediate hypersensitivity reaction recurs, referral to a drug allergy specialist is mandatory.",
          "Consider an alternative imaging modality, or consider performing an unenhanced exam if the diagnostic yield is sufficient for the correct management of the patient.",
          "Never deny a patient a clinically well-indicated enhanced examination if alternative imaging strategies are not available."
        ],
        elective_severe: [
          "Refer the patient to a drug allergy specialist (if not done before).",
          "Optimize the allergy registration in the electronic health record.",
          "Have a trained rapid response (or resuscitation) team member nearby.",
          "Postpone imaging to wait for the results of the allergy analysis.",
          "Apply the advice of the drug allergy specialist for a safe iodine-based contrast medium or gadolinium-based contrast agent.",
          "When the contrast medium is administered, observe the patient for at least 30 min with the IV line in place.",
          "Be prepared and vigilant for a recurring immediate hypersensitivity reaction.",
          "If an immediate hypersensitivity reaction recurs, referral to a drug allergy specialist is mandatory.",
          "Consider an alternative imaging modality, or consider performing an unenhanced exam if the diagnostic yield is sufficient for the correct management of the patient.",
          "Never deny a patient a clinically well-indicated enhanced examination if alternative imaging strategies are not available."
        ],
        emergency_mild: [
          "Interview the patient about their previous hypersensitivity reaction.",
          "Optionally, refer the patient to a drug allergy specialist (if not done before) when the local drug allergy specialist capacity is sufficient.",
          "Optimize the allergy registration in the electronic health record.",
          "Apply the advice of the drug allergy specialist for a safe iodine-based contrast medium or gadolinium-based contrast agent, or, when not available, choose a different iodine-based contrast medium or gadolinium-based contrast agent if the culprit contrast agent is known.",
          "When the contrast medium is administered, observe the patient for at least 30 min with the IV line in place.",
          "Be prepared and vigilant for a recurring immediate hypersensitivity reaction.",
          "If an immediate hypersensitivity reaction recurs, referral to a drug allergy specialist is mandatory.",
          "Consider an alternative imaging modality, or consider performing an unenhanced exam if the diagnostic yield is sufficient for the correct management of the patient.",
          "Never deny a patient a clinically well-indicated enhanced examination if alternative imaging strategies are not available."
        ],
        emergency_moderate: [
          "Refer the patient to a drug allergy specialist (if not done before).",
          "Optimize the allergy registration in the electronic health record.",
          "Have a trained imaging or emergency room physician nearby.",
          "Choose a different iodine-based contrast medium or gadolinium-based contrast agent if the culprit contrast medium is known.",
          "When the contrast medium is administered, observe the patient for at least 30 min with the IV line in place.",
          "Be prepared and vigilant for a recurring immediate hypersensitivity reaction.",
          "If an immediate hypersensitivity reaction recurs, referral to a drug allergy specialist is mandatory.",
          "Consider an alternative imaging modality, or consider performing an unenhanced exam if the diagnostic yield is sufficient for the correct management of the patient.",
          "Never deny a patient a clinically well-indicated enhanced examination if alternative imaging strategies are not available."
        ],
        emergency_severe: [
          "Refer the patient to a drug allergy specialist (if not done before).",
          "Optimize the allergy registration in the electronic health record.",
          "Have a trained rapid response (or resuscitation) team member nearby.",
          "Consider administration of premedication (EAACI guidelines).",
          "Emergency premedication protocol: 50 mg prednisolone IV (or equivalent) ≥ 30 min before contrast medium administration.",
          "Emergency premedication protocol: 2 mg clemastine IV (or equivalent) ≥ 30 min before contrast medium administration.",
          "Context from Part 2: Routine premedication is not recommended. Premedication is optional in emergency situations where an unidentified culprit contrast medium led to a severe hypersensitivity reaction.",
          "Choose a different iodine-based contrast medium or gadolinium-based contrast agent if the culprit contrast medium is known.",
          "When the contrast medium is administered, observe the patient for at least 30 min with the IV line in place.",
          "Be prepared and vigilant for a recurring immediate hypersensitivity reaction.",
          "If an immediate hypersensitivity reaction recurs, referral to a drug allergy specialist is mandatory.",
          "Consider an alternative imaging modality, or consider performing an unenhanced exam if the diagnostic yield is sufficient for the correct management of the patient.",
          "Never deny a patient a clinically well-indicated enhanced examination if alternative imaging strategies are not available."
        ]
      },

      switch_placeholder_icm: "Select the involved ICM group above.",
      switch_placeholder_gbca: "Select the involved GBCA group above.",

      icm_rules: {
        A: {
          title: "Group A selected",
          text: "Practical-experience suggestion: Alternative ICM from Group B or D (without classic carbamoyl sidechain).",
          note: "High cross-reactivity between Group A and Group C."
        },
        B: {
          title: "Group B selected",
          text: "Practical-experience suggestion: Alternative ICM from Group A, C or D.",
          note: ""
        },
        C: {
          title: "Group C selected",
          text: "Practical-experience suggestion: Alternative ICM from Group B (without classic or methyl-modified carbamoyl sidechain).",
          note: "High cross-reactivity between Group C and Group A."
        },
        D: {
          title: "Group D selected",
          text: "Practical-experience suggestion: Alternative ICM from Group A or B (without methyl-modified carbamoyl sidechain).",
          note: ""
        },
        unknown: {
          title: "ICM unknown",
          text: "Due to the higher likelihood that the involved ICM is from Group A: choose the alternative ICM from Group B or D.",
          note: "High cross-reactivity between Group C and Group A. This is a practical-experience suggestion based on the optional, non-validated classification and is not a robust evidence-based recommendation."
        }
      },

      gbca_rules: {
        A: {
          title: "Group A selected",
          text: "Practical-experience suggestion: Alternative GBCA from Group B.",
          note: ""
        },
        B: {
          title: "Group B selected",
          text: "Practical-experience suggestion: Alternative GBCA from Group A.",
          note: ""
        },
        C: {
          title: "Group C selected",
          text: "Insufficient data for empiric change advice.",
          note: ""
        },
        unknown: {
          title: "GBCA unknown",
          text: "It is not possible to recommend a regimen with certainty. Due to the probability of involvement, using a GBCA different from the one routinely administered is suggested.",
          note: "This is based on practical experience and is not a robust evidence-based recommendation."
        }
      },

      // Practice Changes tab — static UI
      changes_title: "Practice Changes 2025",
      changes_subtitle:
        "ESUR 2025 vs ESUR 10.0 — key practical differences.",
      changes_intro:
        "Compact overview of practice-relevant changes. Educational support only.",
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
      changes_action_mode_badge: "Action mode",
      changes_sources_label: "Sources",
      changes_no_search_results: "No topics match this search.",
      changes_compare_details_label: "Additional comparison details"
    },

    de: {
      app_title: "Radiology Contrast & Safety App",
      reset: "Zurücksetzen",

      disclaimer_line1: "Didaktisches Support-Tool. Lokale Protokolle beachten.",
      disclaimer_line2: "Nur zur Information. Klinische Entscheidungen sollten lokalen Protokollen, den Quellendokumenten und der klinischen Beurteilung folgen. Es werden keine Patientendaten gespeichert.",
      disclaimer_line3: "Inhalt zur Kontrastmittelsicherheit adaptiert aus der Guidance des ESUR Contrast Media Safety Committee.",

      nav_hsr: "HSR",
      nav_changes: "Changes",

      // HSR main
      hsr_title: "HSR",
      hsr_subtitle: "Planung nach früherer Reaktion, Akutmanagement, empirische Switch-Hilfe, Tryptase-Interpretation und NIHR-Entscheidungshilfe.",
      hsr_tools_title: "HSR-Tools",
      hsr_guidance_tab: "Frühere Reaktion",
      hsr_acute_tab: "Akutmanagement",
      hsr_switch_tab: "Switch",
      hsr_tryptase_tab: "Tryptase",
      hsr_nihr_tab: "NIHR",

      flow_title: "Frühere Reaktion",
      flow_subtitle: "Didaktische Orientierung bei früheren Hypersensitivitätsreaktionen auf Kontrastmittel.",
      flow_step1: "Schritt 1 — Klinische Situation",
      flow_step2: "Schritt 2 — Schweregrad der früheren Reaktion",

      flow_routing_note:
        "Didaktische Orientierung bei früheren unmittelbaren Hypersensitivitätsreaktionen. Bei nicht unmittelbaren Reaktionen das NIHR-Modul verwenden.",
      hsr_referral_title: "Überweisung & Dokumentation",
      hsr_referral_specify:
        "Bei einer Überweisung an eine Fachperson für Arzneimittelallergien immer das verwendete Kontrastmittel angeben.",
      hsr_referral_document:
        "Eine detaillierte Dokumentation des auslösenden Kontrastmittels und des Schweregrads der Reaktion einschließlich eines Graduierungsschemas ist verpflichtend.",

      elective: "Elektiv",
      emergency: "Notfall",
      mild: "Mild",
      moderate: "Moderat",
      severe: "Schwer",

      recommendation: "Empfehlung",
      safety_net: "Safety net",
      flow_safety:
        "Akute Hypersensitivitätsreaktionen sollten gemäss lokalen Protokollen und der ESUR-Guidance zum Akutmanagement behandelt werden.",

      switch_title: "Switch",
      switch_subtitle:
        "Optionale, nicht validierte Kontrastmittelgruppierung und Vorschläge aus praktischer Erfahrung zur empirischen Wechselorientierung.",
      contrast_type: "Kontrastmitteltyp",
      nihr_cmtype_title: "Kontrastmitteltyp",
      icm_ct: "ICM (CT)",
      gbca_mri: "GBCA (MRT)",
      icm_title: "ICM (iodhaltig)",
      gbca_title: "GBCA (gadoliniumbasiert)",
      possible_alternatives: "Mögliche Alternativen",
      safety_note: "Sicherheitshinweis",
      switch_status_optional:
        "Diese Switch-Übersicht ist optional und beruht auf einer nicht validierten Klassifikation sowie auf praktischer Erfahrung.",
      switch_cmsc:
        "Das CMSC kann keine evidenzbasierten Empfehlungen auf robuster wissenschaftlicher Grundlage für den Wechsel auf ein alternatives Kontrastmittel auf Basis praktischer Erfahrung geben.",
      switch_cr_structure:
        "Kreuzreaktivität lässt sich nicht auf Grundlage der chemischen Struktur vorhersagen.",
      switch_cr_frequency:
        "Kreuzreaktivität kann häufiger auftreten bei iodhaltigen Kontrastmitteln mit einer N-(2,3-Hydroxypropyl)-carbamoyl-Seitenkette und bei makrozyklischen gadoliniumbasierten Kontrastmitteln.",
      switch_best_option:
        "Die beste Option ist, eine Alternative anhand der Ergebnisse einer allergologischen Abklärung zu wählen.",
      switch_brand_governance:
        "Markennamen dienen ausschließlich der Produktidentifikation. Die ESUR-Gruppierung und die Switch-Orientierung beziehen sich auf den jeweiligen Wirkstoff des Kontrastmittels.",
      switch_safety_note:
        "Diese Switch-Übersicht ist optional und beruht auf einer nicht validierten Klassifikation sowie auf praktischer Erfahrung. Das CMSC kann keine evidenzbasierten Empfehlungen auf robuster wissenschaftlicher Grundlage für den Wechsel auf ein alternatives Kontrastmittel auf Basis praktischer Erfahrung geben. Kreuzreaktivität lässt sich nicht auf Grundlage der chemischen Struktur vorhersagen. Die beste Option ist, eine Alternative anhand der Ergebnisse einer allergologischen Abklärung zu wählen.",
      unknown: "Unbekannt",
      icm_unknown_hint: "Verwenden, wenn das auslösende ICM nicht bekannt ist.",
      gbca_unknown_hint: "Verwenden, wenn das auslösende GBCA nicht bekannt ist.",
      icm_group_a_label: "Gruppe A",
      icm_group_b_label: "Gruppe B",
      icm_group_c_label: "Gruppe C",
      icm_group_d_label: "Gruppe D",
      gbca_group_a_label: "Gruppe A",
      gbca_group_b_label: "Gruppe B",
      gbca_group_c_label: "Gruppe C",
      icm_group_a_names:
        "Omnipaque® — iohexol · Visipaque® — iodixanol · Iomeron® — iomeprol · Optiray® — ioversol",
      icm_group_b_names: "Iopamiro® / Isovue® — iopamidol",
      icm_group_c_names: "Ultravist® — iopromide",
      icm_group_d_names: "Xenetix® — iobitridol",
      gbca_group_a_names: "Dotarem® / Clariscan® — gadoterate meglumine",
      gbca_group_b_names:
        "ProHance® — gadoteridol · Gadovist® / Gadavist® — gadobutrol",
      gbca_group_c_names: "Elucirem® / Vueway® — gadopiclenol",
      switch_nonvalidated:
        "Diese Switch-Übersicht ist optional und beruht auf einer nicht validierten Klassifikation sowie auf praktischer Erfahrung.",

      tryptase_title: "Serumtryptase",
      tryptase_sample_measure:
        "Serumtryptase innerhalb von 1–4 h nach Beginn aller moderaten bis schweren unmittelbaren Hypersensitivitätsreaktionen auf Kontrastmittel messen.",
      tryptase_sample_baseline:
        "Eine zweite Messung nach ≥ 24 h dient als Baseline für weitere allergologische Untersuchungen.",
      tryptase_sample_ideal:
        "Idealerweise sollten drei Proben gewonnen werden: die erste so früh wie möglich während einer vermuteten Hypersensitivitätsreaktion, die zweite 1–2 h nach der ersten, jedoch nicht später als 4 h nach Beginn der Reaktion, und die dritte mehr als 24 h nach Abklingen aller Zeichen und Symptome.",
      enter_values: "Werte eingeben",
      calculate: "Berechnen",
      result: "Ergebnis",
      tryptase_default:
        "Einen akuten Tryptasewert eingeben, der während der Symptome oder innerhalb von 4 h danach gewonnen wurde, sowie einen Baseline-Tryptasewert.",
      tryptase_invalid: "Bitte gültige Zahlenwerte eingeben.",
      tryptase_threshold: "Schwellenwert",
      tryptase_acute: "Akute Tryptase",
      tryptase_baseline: "Baseline-Tryptase",
      tryptase_formula:
        "Ein akuter Anstieg der Tryptase gegenüber der Baseline von mindestens 2 ng/mL + (1,2 × Baseline-Tryptase) während der Symptome oder innerhalb von 4 h danach ist hinweisend auf eine IHR.",
      tryptase_positive:
        "Das Ergebnis ist hinweisend auf eine IHR.",
      tryptase_negative:
        "Das Ergebnis zeigt keinen akuten Anstieg gegenüber der Baseline von mindestens 2 ng/mL + (1,2 × Baseline-Tryptase).",
      tryptase_note:
        "Bei milder oder moderater IHR bleiben die Tryptasewerte typischerweise normal; ein fehlender Anstieg schließt die Möglichkeit einer echten IHR nicht aus.",

            acute_title: "Akutmanagement",
      acute_subtitle:
        "ESUR-Akutalgorithmus. Lokales Notfallprotokoll beachten und Medikamentenkonzentration vor Gabe prüfen.",
      acute_immediate_title: "Sofortbeurteilung und allgemeine Maßnahmen",
      acute_severity_title: "Schweregrad-Auswahl",
      acute_pattern_title: "Dominantes Reaktionsmuster",
      acute_output_title: "ESUR-Akutmanagement",
      acute_dose_reference_title: "Dosissicherheit",
      acute_dose_reference_note:
        "ESUR-Dosisreferenz. Vor Gabe Konzentration, Applikationsweg, Patientensituation und lokales Notfallprotokoll prüfen.",
      acute_severity_mild: "Milde Reaktionen",
      acute_severity_moderate: "Moderate Reaktionen",
      acute_severity_severe: "Schwere Reaktionen",
      acute_pattern_mild_general: "Milde Reaktionen",
      acute_pattern_moderate_urticaria: "Diffuse Urtikaria / diffuses Erythem",
      acute_pattern_moderate_angioedema: "Faziales Ödem ohne Stridor",
      acute_pattern_moderate_bronchospasm: "Milder Bronchospasmus",
      acute_pattern_severe_anaphylaxis: "Anaphylaktische Reaktion oder Stridor",
      acute_section_clinical: "Klinisches Muster / Warnhinweis",
      acute_section_management: "Management",
      acute_section_escalation: "Eskalation / Rapid Response",
      acute_warning_label: "Warnhinweis",
      acute_arrest_title: "Herz- oder Atemstillstand",
      acute_immediate_actions: [
        "Den Patienten engmaschig überwachen und die Progression der Reaktion beurteilen.",
        "Engmaschig auf Schleimhautödem von Nase, Mund, Rachen oder Larynx achten.",
        "Bei Symptomen Herzfrequenz, arteriellen Blutdruck und Bewusstsein prüfen.",
        "Den Patienten gemäß der ABCDE-Methode prüfen und stabilisieren.",
        "Kontrastmittelinfusion stoppen und die i.v.-Leitung durch Kristalloid ersetzen.",
        "Dyspnoe oder Stridor: den Patienten aufsetzen lassen.",
        "Bestimmung der Serumtryptase erwägen, idealerweise 1–2 h nach Beginn der Reaktion.",
        "Akute allergische Reaktionen und das auslösende Kontrastmittel im Allergieregister der elektronischen Patientenakte dokumentieren."
      ],
      acute_content: {
        mild_general: {
clinical:
  "Milde Merkmale: nasale Kongestion; Niesen, Konjunktivitis, Rhinorrhö; begrenzte oder vereinzelte Urtikaria und Pruritus; kutanes Ödem; begrenzter juckender oder kratzender Hals. Maßgeblich ist das stärkste Symptom.",
management: [
  "Milde Reaktionen können allein mit Beruhigung auskommen.",
  "Vitalzeichen beobachten, bis die Symptome abklingen.",
  "Den i.v.-Zugang während der Beobachtung nicht entfernen.",
  "Nach einer milden Reaktion überwachen, bis jedes Symptom verschwunden ist (mindestens 30 Minuten, üblicherweise unter 60 Minuten).",
  "Bei milder allergischer Reaktion ein nicht sedierendes Antihistaminikum erwägen, z. B. Desloratadin 5 mg oral oder Cetirizin 10 mg oral, einmal täglich.",
  "Bei protrahiertem Erbrechen: Ondansetron 4 mg i.v."
],
escalation: [
  "Engmaschig überwachen und auf eine Progredienz der Reaktion achten."
]
        },
        moderate_urticaria: {
clinical: "Diffuse Urtikaria / diffuses Erythem.",
management: [
  "Chlorphenamin 20 mg oder Clemastin 2 mg i.v. geben.",
  "Verlegung in einen Bereich mit Überwachung der Vitalfunktionen erwägen."
],
escalation: [
  "Bei begleitender Hypotonie wie eine Anaphylaxie behandeln."
]
        },
        moderate_angioedema: {
clinical: "Faziales Ödem ohne Stridor.",
management: [
  "Sauerstoff 10 bis 15 L/min über eine Nicht-Rückatmungsmaske geben.",
  "Chlorphenamin 20 mg oder Clemastin 2 mg i.v. geben.",
  "Verlegung in einen Bereich mit Überwachung der Vitalfunktionen erwägen."
],
escalation: [
  "Wenn das Ödem schwer ist, in Atemwegsnähe liegt oder Stridor auftritt, wie eine Anaphylaxie behandeln."
]
        },
        moderate_bronchospasm: {
clinical: "Milder Bronchospasmus.",
management: [
  "Kurzwirksamer β2-Agonist: 2–4 Inhalationen zu je 100 µg Salbutamol (abhängig vom Schweregrad), mit der Option zur Wiederholung alle 20 Minuten, oder per Vernebelung (2,5–5 µg verdünnt in 3 mL Kochsalzlösung) bis zur klinischen Besserung.",
  "Verlegung in einen Bereich mit Überwachung der Vitalfunktionen erwägen."
],
escalation: [
  "Bei Verschlechterung Adrenalin 0,5 mg i.m. geben und die Hinzuziehung des Rapid-Response-Teams erwägen.",
  "Wenn der Bronchospasmus an Schwere zunimmt, Wiederholung von Adrenalin 0,5 mg i.m. erwägen, gesteuert anhand der Herzfrequenz."
]
        },
        severe_anaphylaxis: {
clinical: "Anaphylaktische Reaktion oder Stridor.",
management: [
  "Das Rapid-Response-Team rufen.",
  "Sauerstoff 10 bis 15 L/min mit Nicht-Rückatmungsmaske geben.",
  "0,5 mg Adrenalin i.m. in den lateralen Oberschenkel geben, nach Bedarf wiederholen, gesteuert anhand der Herzfrequenz.",
  "Flüssigkeitsbolus von 500 mL Kristalloid i.v. in 10 min geben, nach Bedarf wiederholen.",
  "Kurzwirksamer β2-Agonist: 2–10 Inhalationen zu je 100 µg Salbutamol (abhängig vom Schweregrad), mit der Option zur Wiederholung alle 20 Minuten, oder per Vernebelung (2,5–5 µg verdünnt in 3 mL Kochsalzlösung) bis zu 1 Stunde.",
  "Chlorphenamin 20 mg oder Clemastin 2 mg i.v. geben, nach Bedarf wiederholen.",
  "Zusatz eines Kortikosteroids erwägen (zum Beispiel Prednisolon 50 mg i.v.)."
],
arrest: [
  "CPR-Team (Reanimationsteam) rufen.",
  "CPR starten."
]
        }
      },

      nihr_title: "NIHR — nicht unmittelbare Hypersensitivitätsreaktionen",
      nihr_subtitle:
        "Für eine frühere nicht unmittelbare Hypersensitivitätsreaktion auf ein iodhaltiges Kontrastmittel oder ein gadoliniumbasiertes Kontrastmittel, wenn eine erneute Gabe erwogen wird.",
      nihr_severity_title: "Schweregrad der früheren NIHR",
      nihr_severity_mild: "Mild",
      nihr_severity_moderate: "Moderat",
      nihr_severity_severe: "Schwer",
      nihr_severity_hint:
        "Mild: Hautläsionen klingen ohne Behandlung ab. Moderat: Hautläsionen klingen unter ambulanter Behandlung ab. Schwer: eine stationäre Aufnahme zur Behandlung ist erforderlich.",
      nihr_culprit_class_title: "Klasse des früher auslösenden Kontrastmittels",
      nihr_cmtype_icm: "ICM",
      nihr_cmtype_gbca: "GBCA",
      nihr_cmtype_unknown: "Kontrastmittelklasse unbekannt",
      nihr_culprit_known_title: "Genaues auslösendes Kontrastmittel bekannt?",
      nihr_culprit_known: "Auslösendes KM bekannt",
      nihr_culprit_unknown: "Auslösendes KM unbekannt",
      nihr_danger_signs_title: "Warnzeichen",
      erosions: "Erosive und/oder hämorrhagische Läsionen",
      blistering: "Blasenbildung und Hautstörung",
      mucosal_involvement: "Schleimhautbeteiligung",
      extracutaneous_involvement: "Extrakutane Organbeteiligung (hohes Fieber, auffällige Leber-/Nierenwerte, Lymphadenopathie)",
      nihr_recommendation_title: "NIHR-Empfehlung",
      nihr_safety_note_title: "Sicherheitshinweis",
      nihr_safety_note: "",
      nihr_recommended_actions: "Empfohlene Maßnahmen",
      nihr_class_specific_rule: "Klassenspezifische Regel",
      nihr_status_scar: "Schwere nicht unmittelbare Hypersensitivitätsreaktion mit Warnzeichen (SCAR)",
      nihr_status_moderate: "Moderate NIHR ohne Warnzeichen",
      nihr_status_mild: "Milde NIHR ohne Warnzeichen",
      nihr_scope_guard:
        "Diese Kombination ist in ESUR Part 2 Table 2 nicht als eigener Managementpfad dargestellt. Schweregrad der NIHR und dokumentierte Warnzeichen erneut prüfen.",
      nihr_mild_interview: "Die Patientin oder den Patienten zur früheren Hypersensitivitätsreaktion befragen.",
      nihr_mild_refer:
        "Optional die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt), wenn die lokale Kapazität für Arzneimittelallergologie ausreicht.",
      nihr_moderate_refer:
        "Die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt).",
      nihr_optimize_ehr: "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
      nihr_apply_advice:
        "Die Empfehlung der Fachperson für Arzneimittelallergien für ein sicheres iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel umsetzen.",
      nihr_choose_different:
        "Wenn diese Empfehlung nicht vorliegt, ein anderes iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel wählen, sofern das auslösende Kontrastmittel bekannt ist.",
      nihr_observe:
        "Wenn das Kontrastmittel verabreicht wird, die Patientin oder den Patienten mindestens 30 Minuten mit liegendem i.v.-Zugang beobachten.",
      nihr_written:
        "Der Patientin oder dem Patienten schriftliche Hinweise für eine mögliche erneute nicht unmittelbare Hypersensitivitätsreaktion mitgeben.",
      nihr_recurrence:
        "Wenn eine nicht unmittelbare Hypersensitivitätsreaktion wieder auftritt, ist die Überweisung an eine Fachperson für Arzneimittelallergien verpflichtend.",
      nihr_preventive_alt:
        "Eine alternative Bildgebungsmodalität erwägen oder eine Untersuchung ohne Kontrastmittel erwägen, wenn die diagnostische Aussagekraft für die korrekte Patientenführung ausreicht.",
      nihr_preventive_never_deny:
        "Eine klinisch gut indizierte kontrastverstärkte Untersuchung nicht verweigern, wenn keine alternativen Bildgebungsstrategien verfügbar sind.",
      nihr_footnote_crossreact:
        "Kreuzreaktivität von Kontrastmitteln und ein erhöhtes Risiko für eine nicht unmittelbare Hypersensitivitätsreaktion bei Verwendung iso-osmolarer dimerer iodhaltiger Kontrastmittel erwägen.",
      nihr_scar_refer:
        "Die Patientin oder den Patienten sofort an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt).",
      nihr_scar_choose_imaging: "Eine alternative Bildgebungsmodalität wählen.",
      nihr_scar_ehr: "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
      nihr_scar_do_not_give:
        "Die Kontrastmittelgruppe, auf die die schwere Hautreaktion aufgetreten ist, nicht geben.",
      nihr_scar_icm_rule:
        "Nach einer schweren nicht unmittelbaren Hypersensitivitätsreaktion auf ein iodhaltiges Kontrastmittel alle iodhaltigen Kontrastmittel vermeiden.",
      nihr_scar_gbca_rule:
        "Nach einer schweren nicht unmittelbaren Hypersensitivitätsreaktion auf ein gadoliniumbasiertes Kontrastmittel alle gadoliniumbasierten Kontrastmittel vermeiden.",
      nihr_scar_unknown_rule:
        "Nach einer schweren Reaktion auf ein unbekanntes Kontrastmittel das Vorgehen nach multidisziplinärer Konsultation individualisieren.",

            icm_hint:
        "Die ESUR-Gruppierung basiert auf dem jeweiligen Kontrastmittelwirkstoff. Markennamen werden ausschließlich zur Produktidentifikation angezeigt.\nGruppierung gemäß ESUR Part 2 Fig. 2 / Fig. 3 und Table 1.",
      gbca_hint:
        "Die ESUR-Gruppierung basiert auf dem jeweiligen Kontrastmittelwirkstoff. Markennamen werden ausschließlich zur Produktidentifikation angezeigt.\nGruppierung gemäß ESUR Part 2 Fig. 2 / Fig. 3 und Table 1.",

      flow_titles: {
        elective_mild: "Elektive Bildgebung — frühere milde unmittelbare Hypersensitivitätsreaktion",
        elective_moderate: "Elektive Bildgebung — frühere moderate unmittelbare Hypersensitivitätsreaktion",
        elective_severe: "Elektive Bildgebung — frühere schwere unmittelbare Hypersensitivitätsreaktion",
        emergency_mild: "Notfallbildgebung — frühere milde unmittelbare Hypersensitivitätsreaktion",
        emergency_moderate: "Notfallbildgebung — frühere moderate unmittelbare Hypersensitivitätsreaktion",
        emergency_severe: "Notfallbildgebung — frühere schwere unmittelbare Hypersensitivitätsreaktion"
      },

      flow_bullets: {
        elective_mild: [
          "Die Patientin oder den Patienten zur früheren Hypersensitivitätsreaktion befragen.",
          "Optional die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt), wenn die lokale Kapazität für Arzneimittelallergologie ausreicht.",
          "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
          "Die Empfehlung der Fachperson für Arzneimittelallergien für ein sicheres iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel umsetzen; oder, wenn diese nicht vorliegt, ein anderes iodhaltiges oder gadoliniumbasiertes Kontrastmittel wählen, sofern das auslösende Kontrastmittel bekannt ist.",
          "Wenn das Kontrastmittel verabreicht wird, die Patientin oder den Patienten mindestens 30 Minuten mit liegendem i.v.-Zugang beobachten.",
          "Auf eine wiederkehrende unmittelbare Hypersensitivitätsreaktion vorbereitet und wachsam sein.",
          "Wenn eine unmittelbare Hypersensitivitätsreaktion wieder auftritt, ist die Überweisung an eine Fachperson für Arzneimittelallergien verpflichtend.",
          "Eine alternative Bildgebungsmodalität erwägen oder eine Untersuchung ohne Kontrastmittel erwägen, wenn die diagnostische Aussagekraft für die korrekte Patientenführung ausreicht.",
          "Eine klinisch gut indizierte kontrastverstärkte Untersuchung nicht verweigern, wenn keine alternativen Bildgebungsstrategien verfügbar sind."
        ],
        elective_moderate: [
          "Die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt).",
          "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
          "Die Bildgebung aufschieben, um die Ergebnisse der Allergieanalyse abzuwarten.",
          "Die Empfehlung der Fachperson für Arzneimittelallergien für ein sicheres iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel umsetzen.",
          "Wenn das Kontrastmittel verabreicht wird, die Patientin oder den Patienten mindestens 30 Minuten mit liegendem i.v.-Zugang beobachten.",
          "Auf eine wiederkehrende unmittelbare Hypersensitivitätsreaktion vorbereitet und wachsam sein.",
          "Wenn eine unmittelbare Hypersensitivitätsreaktion wieder auftritt, ist die Überweisung an eine Fachperson für Arzneimittelallergien verpflichtend.",
          "Eine alternative Bildgebungsmodalität erwägen oder eine Untersuchung ohne Kontrastmittel erwägen, wenn die diagnostische Aussagekraft für die korrekte Patientenführung ausreicht.",
          "Eine klinisch gut indizierte kontrastverstärkte Untersuchung nicht verweigern, wenn keine alternativen Bildgebungsstrategien verfügbar sind."
        ],
        elective_severe: [
          "Die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt).",
          "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
          "Ein geschultes Mitglied des Rapid-Response-Teams (oder Reanimationsteams) in der Nähe haben.",
          "Die Bildgebung aufschieben, um die Ergebnisse der Allergieanalyse abzuwarten.",
          "Die Empfehlung der Fachperson für Arzneimittelallergien für ein sicheres iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel umsetzen.",
          "Wenn das Kontrastmittel verabreicht wird, die Patientin oder den Patienten mindestens 30 Minuten mit liegendem i.v.-Zugang beobachten.",
          "Auf eine wiederkehrende unmittelbare Hypersensitivitätsreaktion vorbereitet und wachsam sein.",
          "Wenn eine unmittelbare Hypersensitivitätsreaktion wieder auftritt, ist die Überweisung an eine Fachperson für Arzneimittelallergien verpflichtend.",
          "Eine alternative Bildgebungsmodalität erwägen oder eine Untersuchung ohne Kontrastmittel erwägen, wenn die diagnostische Aussagekraft für die korrekte Patientenführung ausreicht.",
          "Eine klinisch gut indizierte kontrastverstärkte Untersuchung nicht verweigern, wenn keine alternativen Bildgebungsstrategien verfügbar sind."
        ],
        emergency_mild: [
          "Die Patientin oder den Patienten zur früheren Hypersensitivitätsreaktion befragen.",
          "Optional die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt), wenn die lokale Kapazität für Arzneimittelallergologie ausreicht.",
          "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
          "Die Empfehlung der Fachperson für Arzneimittelallergien für ein sicheres iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel umsetzen; oder, wenn diese nicht vorliegt, ein anderes iodhaltiges oder gadoliniumbasiertes Kontrastmittel wählen, sofern das auslösende Kontrastmittel bekannt ist.",
          "Wenn das Kontrastmittel verabreicht wird, die Patientin oder den Patienten mindestens 30 Minuten mit liegendem i.v.-Zugang beobachten.",
          "Auf eine wiederkehrende unmittelbare Hypersensitivitätsreaktion vorbereitet und wachsam sein.",
          "Wenn eine unmittelbare Hypersensitivitätsreaktion wieder auftritt, ist die Überweisung an eine Fachperson für Arzneimittelallergien verpflichtend.",
          "Eine alternative Bildgebungsmodalität erwägen oder eine Untersuchung ohne Kontrastmittel erwägen, wenn die diagnostische Aussagekraft für die korrekte Patientenführung ausreicht.",
          "Eine klinisch gut indizierte kontrastverstärkte Untersuchung nicht verweigern, wenn keine alternativen Bildgebungsstrategien verfügbar sind."
        ],
        emergency_moderate: [
          "Die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt).",
          "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
          "Eine geschulte Ärztin oder einen geschulten Arzt aus Bildgebung oder Notaufnahme in der Nähe haben.",
          "Ein anderes iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel wählen, sofern das auslösende Kontrastmittel bekannt ist.",
          "Wenn das Kontrastmittel verabreicht wird, die Patientin oder den Patienten mindestens 30 Minuten mit liegendem i.v.-Zugang beobachten.",
          "Auf eine wiederkehrende unmittelbare Hypersensitivitätsreaktion vorbereitet und wachsam sein.",
          "Wenn eine unmittelbare Hypersensitivitätsreaktion wieder auftritt, ist die Überweisung an eine Fachperson für Arzneimittelallergien verpflichtend.",
          "Eine alternative Bildgebungsmodalität erwägen oder eine Untersuchung ohne Kontrastmittel erwägen, wenn die diagnostische Aussagekraft für die korrekte Patientenführung ausreicht.",
          "Eine klinisch gut indizierte kontrastverstärkte Untersuchung nicht verweigern, wenn keine alternativen Bildgebungsstrategien verfügbar sind."
        ],
        emergency_severe: [
          "Die Patientin oder den Patienten an eine Fachperson für Arzneimittelallergien überweisen (falls noch nicht erfolgt).",
          "Die Allergieregistrierung in der elektronischen Patientenakte optimieren.",
          "Ein geschultes Mitglied des Rapid-Response-Teams (oder Reanimationsteams) in der Nähe haben.",
          "Die Gabe einer Prämedikation erwägen (EAACI-Leitlinien).",
          "Notfall-Prämedikationsprotokoll: 50 mg Prednisolon i.v. (oder Äquivalent) ≥ 30 min vor der Kontrastmittelgabe.",
          "Notfall-Prämedikationsprotokoll: 2 mg Clemastin i.v. (oder Äquivalent) ≥ 30 min vor der Kontrastmittelgabe.",
          "Kontext aus Part 2: Eine routinemäßige Prämedikation wird nicht empfohlen. Eine Prämedikation ist in Notfallsituationen optional, wenn ein nicht identifiziertes auslösendes Kontrastmittel zu einer schweren Hypersensitivitätsreaktion geführt hat.",
          "Ein anderes iodhaltiges Kontrastmittel oder gadoliniumbasiertes Kontrastmittel wählen, sofern das auslösende Kontrastmittel bekannt ist.",
          "Wenn das Kontrastmittel verabreicht wird, die Patientin oder den Patienten mindestens 30 Minuten mit liegendem i.v.-Zugang beobachten.",
          "Auf eine wiederkehrende unmittelbare Hypersensitivitätsreaktion vorbereitet und wachsam sein.",
          "Wenn eine unmittelbare Hypersensitivitätsreaktion wieder auftritt, ist die Überweisung an eine Fachperson für Arzneimittelallergien verpflichtend.",
          "Eine alternative Bildgebungsmodalität erwägen oder eine Untersuchung ohne Kontrastmittel erwägen, wenn die diagnostische Aussagekraft für die korrekte Patientenführung ausreicht.",
          "Eine klinisch gut indizierte kontrastverstärkte Untersuchung nicht verweigern, wenn keine alternativen Bildgebungsstrategien verfügbar sind."
        ]
      },

      switch_placeholder_icm: "Bitte oben die beteiligte ICM-Gruppe auswählen.",
      switch_placeholder_gbca: "Bitte oben die beteiligte GBCA-Gruppe auswählen.",

      icm_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Vorschlag aus praktischer Erfahrung: Alternatives ICM aus Gruppe B oder D (ohne klassische Carbamoyl-Seitenkette).",
          note: "Hohe Kreuzreaktivität zwischen Gruppe A und Gruppe C."
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Vorschlag aus praktischer Erfahrung: Alternatives ICM aus Gruppe A, C oder D.",
          note: ""
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Vorschlag aus praktischer Erfahrung: Alternatives ICM aus Gruppe B (ohne klassische oder methylmodifizierte Carbamoyl-Seitenkette).",
          note: "Hohe Kreuzreaktivität zwischen Gruppe C und Gruppe A."
        },
        D: {
          title: "Gruppe D ausgewählt",
          text: "Vorschlag aus praktischer Erfahrung: Alternatives ICM aus Gruppe A oder B (ohne methylmodifizierte Carbamoyl-Seitenkette).",
          note: ""
        },
        unknown: {
          title: "ICM unbekannt",
          text: "Aufgrund der höheren Wahrscheinlichkeit, dass das beteiligte ICM aus Gruppe A stammt: das alternative ICM aus Gruppe B oder D wählen.",
          note: "Hohe Kreuzreaktivität zwischen Gruppe C und Gruppe A. Dies ist ein Vorschlag aus praktischer Erfahrung auf Basis der optionalen, nicht validierten Klassifikation und keine robuste evidenzbasierte Empfehlung."
        }
      },

      gbca_rules: {
        A: {
          title: "Gruppe A ausgewählt",
          text: "Vorschlag aus praktischer Erfahrung: Alternatives GBCA aus Gruppe B.",
          note: ""
        },
        B: {
          title: "Gruppe B ausgewählt",
          text: "Vorschlag aus praktischer Erfahrung: Alternatives GBCA aus Gruppe A.",
          note: ""
        },
        C: {
          title: "Gruppe C ausgewählt",
          text: "Unzureichende Datenlage für eine empirische Wechsel-Empfehlung.",
          note: ""
        },
        unknown: {
          title: "GBCA unbekannt",
          text: "Ein Schema kann nicht mit Sicherheit empfohlen werden. Aufgrund der Beteiligungswahrscheinlichkeit wird die Verwendung eines anderen als des routinemässig eingesetzten GBCA vorgeschlagen.",
          note: "Dies beruht auf praktischer Erfahrung und ist keine robuste evidenzbasierte Empfehlung."
        }
      },

      // Practice Changes tab — static UI
      changes_title: "Practice Changes 2025",
      changes_subtitle:
        "ESUR 2025 vs. ESUR 10.0 — wichtigste Praxisunterschiede.",
      changes_intro:
        "Kompakte Übersicht praxisrelevanter Änderungen. Nur zur didaktischen Unterstützung.",
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
      changes_action_mode_badge: "Action mode",
      changes_sources_label: "Quellen",
      changes_no_search_results: "Keine Themen passen zu dieser Suche.",
      changes_compare_details_label: "Weitere Vergleichsdetails"
    }
  };

  const abbreviationUi = {
    en: {
      label: "Abbreviations",
      organizations: [
        ["ESUR", "European Society of Urogenital Radiology"],
        ["CMSC", "Contrast Media Safety Committee"]
      ],
      switch: [
        ["ICM", "iodine-based contrast medium"],
        ["GBCA", "gadolinium-based contrast agent"]
      ],
      previous: [
        ["EAACI", "European Association of Allergy & Clinical Immunology"]
      ],
      acute: [
        ["CPR", "cardiopulmonary resuscitation"]
      ],
      tryptase: [
        ["IHR", "immediate hypersensitivity reaction"]
      ],
      nihr: [
        ["ICM", "iodine-based contrast medium"],
        ["GBCA", "gadolinium-based contrast agent"],
        ["SCAR", "severe cutaneous adverse reaction"]
      ],
      changes: {
        hypersensitivity: [
          ["ACR", "American College of Radiology"],
          ["SCAR", "severe cutaneous adverse reaction"]
        ],
        waiting_times: [
          ["eGFR", "estimated glomerular filtration rate"]
        ],
        dialysis_refinement: [
          ["NSF", "nephrogenic systemic fibrosis"]
        ],
        new_clinical_scenarios: [
          ["HSG", "hysterosalpingography"],
          ["PAD", "peripheral arterial disease"],
          ["EVAR", "endovascular aneurysm repair"]
        ]
      }
    },
    de: {
      label: "Abkürzungen",
      organizations: [
        ["ESUR", "European Society of Urogenital Radiology"],
        ["CMSC", "Contrast Media Safety Committee"]
      ],
      switch: [
        ["ICM", "iodhaltiges Kontrastmittel"],
        ["GBCA", "gadoliniumbasiertes Kontrastmittel"]
      ],
      previous: [
        ["EAACI", "European Association of Allergy & Clinical Immunology"]
      ],
      acute: [],
      tryptase: [
        ["IHR", "unmittelbare Hypersensitivitätsreaktion"]
      ],
      nihr: [
        ["ICM", "iodhaltiges Kontrastmittel"],
        ["GBCA", "gadoliniumbasiertes Kontrastmittel"],
        ["SCAR", "schwere kutane unerwünschte Reaktion"]
      ],
      changes: {
        hypersensitivity: [
          ["ACR", "American College of Radiology"],
          ["SCAR", "schwere kutane unerwünschte Reaktion"]
        ],
        waiting_times: [
          ["eGFR", "errechnete glomeruläre Filtrationsrate"]
        ],
        dialysis_refinement: [
          ["NSF", "nephrogene systemische Fibrose"]
        ],
        new_clinical_scenarios: [
          ["HSG", "Hysterosalpingographie"],
          ["PAD", "peripheral arterial disease"],
          ["EVAR", "endovascular aneurysm repair"]
        ]
      }
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
          "The 2018 Version 10 quick guide groups topics under three main sections. The 2025 contents list topic headings; its preface announces that the guidelines will also be published electronically on the ESUR webpage and updated annually.",
        keywords: [
          "publication",
          "structure",
          "electronic",
          "yearly update",
          "topic sections",
          "permanent work in progress"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Version 10.0 (2018) was presented as a booklet. Its quick guide groups topics under General adverse reactions, Renal adverse reactions (PC-AKI), and Miscellaneous. The official German 2018 edition also mentions electronic versions of these guidelines on the ESUR website."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The 2025 contents list topic sections including hypersensitivity reactions, prevention of CA-AKI, dialysis, extravasation, waiting times, laboratory interference, and systemic diseases. Under Miscellaneous recommendations and topics, the contents also list CO₂ and HSG.",
                "The 2025 preface announces that, from now on, the guidelines will also be published in electronic form on the ESUR webpage and updated annually. It describes the guidelines as a permanent work in progress."
              ]
            },
            {
              label: "Scope of comparison",
              paragraphs: [
                "The two editions group their contents differently. This structural comparison does not establish whether an individual clinical recommendation changed."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR Guidelines 10.0 (2018 EN), Preface p. 2 / PDF p. 3; Quick Guide p. 3 / PDF p. 4; Contents pp. 4–5 / PDF pp. 5–6",
            "Source: ESUR Guidelines 10.0 (2018 DE), Einleitung and Kurzanleitung, unnumbered / PDF p. 3; Inhalt, unnumbered / PDF pp. 4–5",
            "Source: ESUR CMSC Guidelines 2025, Preface p. 3 / PDF p. 3; Contents pp. 4–5 / PDF pp. 4–5"
          ]
        },
        action: {
          sections: [
            {
              label: "Source notes",
              bullets: [
                "The 2025 preface says that the guidelines summarize key recommendations and encourages readers to consult the original ESUR CMSC guideline publications for a complete understanding of each topic.",
                "The 2025 preface announces that, from now on, the guidelines will also be published in electronic form on the ESUR webpage and updated annually."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The 2025 preface names, among others, updated sections on contrast agent hypersensitivity and extravasation. Its contents alone do not show how an individual clinical recommendation changed."
              ]
            }
          ],
          refs: [
            "Source: ESUR CMSC Guidelines 2025, Preface and Note, p. 3 / PDF p. 3; Contents pp. 4–5 / PDF pp. 4–5"
          ]
        }
      },

      {
        id: "hypersensitivity",
        level: "high",
        icon: "warningDrop",
        title: "Hypersensitivity",
        summary:
          "For adults, the 2025 guidance defines IHR and NIHR and details acute management, documentation, allergy assessment, and pathways for preventing recurrent reactions.",
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
                "The 2018 guideline addressed acute and late adverse reactions and already included allergy testing, documentation, and measures to reduce repeat reactions. Very late adverse reactions were covered separately.",
                "The 2018 guideline separated acute and late reactions. The 2025 guidance explicitly defines IHR and NIHR and sets out separate prevention pathways."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Explicitly defines immediate (IHR) and non-immediate (NIHR) hypersensitivity reactions.",
                "Endorses both ACR and Ring & Messmer classification; Ring & Messmer was already included in the 2018 acute classification.",
                "Specifies ABCDE assessment, observation after treatment, keeping IV access during observation, and symptom-specific positioning and supportive measures.",
                "Specifies tryptase sampling, detailed reaction documentation, and pathways for preventing recurrent reactions.",
                "Sets out pathways by severity; for previous moderate or severe IHR, it distinguishes elective from emergency examinations."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "The 2025 guidance sets out specialist assessment and severity-specific planning for future contrast examinations, particularly after moderate or severe reactions.",
                "Agent-specific documentation was already required in 2018. The 2025 guidance specifies additional reaction details for allergy assessment and later contrast-agent selection."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), A.1 Acute adverse reactions, A.2 Late adverse reactions and A.3 Very late adverse reactions, printed pp. 6–16 / PDF pp. 7–17.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Hypersensitivity reactions to contrast agents (in adults), printed/PDF pp. 6–14; van der Molen et al., Part 1, European Radiology 2025;35:6798–6810 (PDF pp. 1–13); Part 2, European Radiology 2025;35:6811–6825 (PDF pp. 1–15)."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "Refer patients with moderate or severe HSR, recurrent HSR of any severity, or HSR to multiple iodine-based or gadolinium-based contrast agents to a drug allergy specialist; referral after mild HSR is optional when specialist capacity permits.",
                "In the listed IHR pathways and the mild or moderate NIHR pathways without danger signs, observe the patient for at least 30 min with the IV line in place when contrast medium is administered.",
                "If specialist advice is unavailable, choose a different agent when the culprit is known after mild IHR or mild or moderate NIHR without danger signs. In emergencies after moderate or severe IHR, choose a different agent if the culprit is known. For elective examinations after moderate or severe IHR, postpone imaging for allergy-analysis results and apply specialist advice.",
                "After severe NIHR with danger signs (SCAR), urgently refer to a drug allergy specialist, choose alternative imaging, and avoid all agents in the involved class (iodine-based or gadolinium-based); after a severe reaction to an unknown contrast agent, individualize after multidisciplinary consultation.",
                "Measure serum tryptase within 1–4 h from the start of all moderate-to-severe IHR; a second measurement after ≥24 h serves as a baseline."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The 2025 guidance links detailed reaction documentation, specialist assessment, and severity-specific planning when another contrast examination is considered."
              ]
            }
          ],
          refs: [
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Hypersensitivity reactions to contrast agents (in adults), printed/PDF pp. 6–14; van der Molen et al., Part 1, European Radiology 2025;35:6798–6810 (PDF pp. 1–13); Part 2, European Radiology 2025;35:6811–6825 (PDF pp. 1–15).",
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), A.1 Acute adverse reactions, A.2 Late adverse reactions and A.3 Very late adverse reactions, printed pp. 6–16 / PDF pp. 7–17."
          ]
        }
      },

      {
        id: "ca_aki_terminology",
        level: "low",
        icon: "kidney",
        title: "Renal terminology: PC-AKI → CA-AKI",
        summary:
          "In the 2025 iodine-based renal prevention section, the CMSC uses CA-AKI in place of PC-AKI, following the ACR/NKF Consensus 2020.",
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
                "The PC-AKI-to-CA-AKI change identifies the terminology used by the ESUR CMSC from 2025 onward."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), B. Renal adverse reactions (post-contrast acute kidney injury, PC-AKI), definition, printed p. 17 / PDF p. 18.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Prevention of contrast-associated acute kidney injury (CA-AKI) when administering iodine-based contrast media — terminology note and definitions, printed/PDF p. 15."
          ]
        },
        action: {
          sections: [
            {
              label: "Terminology note",
              bullets: [
                "From 2025 onward, the ESUR CMSC uses CA-AKI in place of PC-AKI, following the ACR/NKF Consensus 2020.",
                "The terminology note does not itself state a separate clinical intervention."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The 2025 guidance explicitly attributes the terminology change to the ACR/NKF Consensus 2020; renal risk and prevention measures are described separately."
              ]
            }
          ],
          refs: [
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Prevention of contrast-associated acute kidney injury (CA-AKI) when administering iodine-based contrast media — terminology note and definitions, printed/PDF p. 15.",
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), B. Renal adverse reactions (post-contrast acute kidney injury, PC-AKI), definition, printed p. 17 / PDF p. 18."
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
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), B.6 same-day iodine- and gadolinium-based administration and B.7–B.8 repeat administrations, printed pp. 24–25 / PDF pp. 25–26.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Safe time intervals between contrast agent injections, printed/PDF pp. 21–22."
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
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Safe time intervals between contrast agent injections, printed/PDF pp. 21–22.",
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), B.6 same-day iodine- and gadolinium-based administration and B.7–B.8 repeat administrations, printed pp. 24–25 / PDF pp. 25–26."
          ]
        }
      },

      {
        id: "laboratory_interference",
        level: "high",
        icon: "lab",
        title: "Analytical interference with laboratory tests",
        summary:
          "Version 10.0 already included blood- and urine-sampling advice. The 2025 booklet sets out recommended delays after intravascular contrast agent administration separately for blood and urine across three eGFR groups.",
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
                "For non-emergency biochemical assays, Version 10.0 recommended collecting blood and urine preferably before contrast agent administration. With normal renal function, blood could be collected after 4 h if necessary. With reduced renal function (eGFR <45 mL/min/1.73 m²), blood collection should be delayed for as long as possible. The English version states that urine collection should not be done within 24 h; the official German version specifically refers to “Sammelurin”."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "The 2025 booklet has a separate section on analytical interference of intravascular contrast agents with laboratory tests. It provides expert-consensus guidance, including for iodine- and gadolinium-based compounds, and lists recommended blood- and urine-collection delays by eGFR group."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "Compared with the 2018 guidance, the 2025 booklet specifies three eGFR groups for each sample type, with both minimum and optimal recommended delays for blood collection and minimum recommended delays for urine collection."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018), EN, section C.6 “Non-emergency biochemical assays”, printed p. 30 / PDF p. 31.",
            "Source: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018), section C.6 “Laborchemische Proben in der Routinediagnostik”, printed p. 41 / PDF p. 21 (two-up).",
            "Source: ESUR CMSC Contrast Agent Guidelines 2025 booklet, “Analytical interference of intravascular contrast agents with clinical laboratory tests”, printed/PDF p. 23."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "Recommended delay for blood collection after intravascular contrast agent administration: eGFR >60 mL/min/1.73 m² — at least 4 h; optimally 12 h.",
                "Recommended delay for blood collection after intravascular contrast agent administration: eGFR 30–60 mL/min/1.73 m² — at least 16 h; optimally 48 h.",
                "Recommended delay for blood collection after intravascular contrast agent administration: eGFR <30 mL/min/1.73 m² — at least 2.5 days (60 h); optimally 7 days (168 h).",
                "Recommended delay for urine collection after intravascular contrast agent administration: eGFR >60 mL/min/1.73 m² — at least 24 h; eGFR 30–60 mL/min/1.73 m² — at least 48 h; eGFR <30 mL/min/1.73 m² — at least 7 days (168 h)."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The 2018 guideline already contained specific blood- and urine-collection intervals. The 2025 booklet distinguishes three eGFR groups and provides recommended minimum and optimal delays for blood collection, but only minimum delays for urine collection."
              ]
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018), EN, section C.6 “Non-emergency biochemical assays”, printed p. 30 / PDF p. 31.",
            "Source: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018), section C.6 “Laborchemische Proben in der Routinediagnostik”, printed p. 41 / PDF p. 21 (two-up).",
            "Source: ESUR CMSC Contrast Agent Guidelines 2025 booklet, “Analytical interference of intravascular contrast agents with clinical laboratory tests”, printed/PDF p. 23."
          ]
        }
      },

      {
        id: "extravasation",
        level: "high",
        icon: "extravasation",
        title: "Extravasation",
        summary:
          "The 2025 extravasation guidance adds explicit mild, moderate and severe definitions, more detailed recognition and reporting steps, and specified monitoring and surgical-escalation criteria. The 2018 guidelines already addressed risk factors, prevention, imaging and surgical advice.",
        keywords: [
          "extravasation",
          "contrast leak",
          "severity",
          "mild moderate severe",
          ">150 mL",
          "surgical opinion"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "The 2018 English and official German guidelines already separate technique-related from patient-related risk factors. They describe risk reduction, potentially helpful imaging documentation, conservative treatment in most cases, and surgical advice when serious injury is suspected."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Defines mild, moderate and severe extravasation using clinical findings and instructs assessment of severity.",
                "Retains separate technique-related and patient-related risk factors and specifies further risk-reduction measures, including preferred use of an appropriately sized upper-arm vein, suitable cannula size, appropriate flow and pressure, and contrast-volume minimisation based on indication and patient size.",
                "Specifies recognition during and after injection, recording in the radiology report and local incident system, a patient information leaflet, and a follow-up appointment if necessary.",
                "For moderate or severe cases, two orthogonal radiographic views or cross-sectional imaging can help assess extent and compartmentalisation. If severe injury is suspected, urgently seek advice from a surgeon; surgical opinion is also recommended for extravasated volumes >150 mL."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "Compared with 2018, the 2025 section specifies three severity grades, more recognition and reporting steps, a 2–4-hourly monitoring interval for mild cases, and additional conditions for surgical advice."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "ESUR Guidelines 10.0 (2018), § C.1, printed p. 26 (PDF p. 27).",
            "Official German ESUR Guidelines 10.0 (2018), § C.1, printed p. 36 (PDF p. 19).",
            "ESUR CMSC Guidelines 2025, Management and prevention of contrast agent extravasation, printed pp. 20–21 (PDF pp. 20–21)."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "The 2025 booklet directs classification as mild, moderate or severe. Moderate cases require close monitoring; physician assessment is advised to check for neurovascular compromise.",
                "The 2025 section specifies further prevention details for venous access, cannula size, flow, pressure and contrast volume. Meticulous cannulation and a saline test injection were already described in 2018.",
                "For mild cases, the 2025 booklet specifies limb elevation, ice packs and monitoring every 2–4 hours. Discharge is stated if improving; if there is no improvement, surgical opinion is required.",
                "In moderate or severe cases, two orthogonal radiographic views or cross-sectional imaging can help assess extent and compartmentalisation. The complication is to be recorded in the radiology report and local incident system; a patient information leaflet should be given, and a follow-up appointment arranged if necessary.",
                "If severe injury is suspected, urgently seek advice from a surgeon. Surgical opinion is also recommended when the extravasated volume exceeds 150 mL."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The added 2025 detail concerns severity definitions, recognition, reporting, mild-case monitoring and specific indications for surgical advice; several risk-reduction and management measures were already present in 2018."
              ]
            }
          ],
          refs: [
            "ESUR CMSC Guidelines 2025, Management and prevention of contrast agent extravasation, printed pp. 20–21 (PDF pp. 20–21).",
            "For the 2018 comparison: ESUR Guidelines 10.0, § C.1, printed p. 26 (PDF p. 27)."
          ]
        }
      },

      {
        id: "dialysis_refinement",
        level: "medium",
        icon: "dialysis",
        title: "Dialysis-related refinement",
        summary:
          "The 2025 dialysis section explicitly distinguishes macrocyclic and linear GBCA within separate haemodialysis and CAPD sections.",
        keywords: [
          "dialysis",
          "haemodialysis",
          "macrocyclic",
          "linear",
          "GBCA",
          "CAPD"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "ESUR 10.0 already separated haemodialysis from CAPD and iodine-based contrast from GBCA. In haemodialysis, timing coordination and an extra session were unnecessary for iodine-based contrast; for GBCA, timing coordination and an extra haemodialysis session as soon as possible after administration were recommended.",
                "In CAPD, haemodialysis to remove iodine-based contrast was unnecessary; after GBCA, the need for haemodialysis was to be discussed with the referring physician."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "For patients on haemodialysis, an immediate dialysis session is not needed after macrocyclic GBCA; after linear agents (e.g., liver-specific agents), it is indicated and needs to be repeated on the following two days.",
                "For patients on CAPD, an immediate dialysis session is not needed after macrocyclic GBCA; with linear GBCA, the NSF risk should be weighed against the risk of placing a temporary haemodialysis catheter in consultation with the referring physician."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "Compared with 2018, the 2025 GBCA guidance adds an explicit macrocyclic-versus-linear distinction. The immediate-dialysis instructions differ by dialysis type and GBCA class."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents 10.0 (2018 EN), § B.5 Dialysis and contrast medium administration, printed p. 23 / PDF p. 24.",
            "Source: ESUR Leitlinien für Kontrastmittel 10.0 (official DE), § B.5 Dialyse und Kontrastmittelgabe, printed pp. 33–34 / PDF pp. 17–18.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Safe use of contrast agent administration in patients on dialysis, printed/PDF p. 19."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 action points",
              bullets: [
                "For iodine-based contrast in patients on haemodialysis, coordinating injection with the haemodialysis session or sessions is unnecessary, and extra haemodialysis sessions to remove the contrast medium are not recommended. In CAPD, additional haemodialysis to remove iodine-based contrast is unnecessary.",
                "After macrocyclic GBCA, an immediate dialysis session is not needed in haemodialysis or CAPD.",
                "After linear GBCA in patients on haemodialysis, an immediate dialysis session is indicated and needs to be repeated on the following two days.",
                "For CAPD and linear GBCA, the NSF risk should be weighed against the risk of placing a temporary haemodialysis catheter in consultation with the referring physician."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "The 2025 GBCA instructions differ by dialysis type and GBCA class."
              ]
            }
          ],
          refs: [
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Safe use of contrast agent administration in patients on dialysis — Patients on haemodialysis; Patients on continuous ambulatory peritoneal dialysis, printed/PDF p. 19."
          ]
        }
      },

      {
        id: "new_clinical_scenarios",
        level: "medium",
        icon: "layers",
        title: "Dedicated ESUR 2025 sections: myasthenia gravis, HSG and CO₂ angiography",
        summary:
          "The 2018 EN and DE booklets do not address myasthenia gravis or HSG; both name carbon dioxide only in the terminology definition. The 2025 booklet contains dedicated subsections for all three topics.",
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
                "Neither 2018 edition addresses myasthenia gravis or HSG. Both mention carbon dioxide only as an example of an X-ray contrast medium in the terminology section; neither contains a CO₂ angiography subsection."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Myasthenia gravis appears under “Safe use of contrast agents in patients with systemic diseases”. HSG and CO₂ angiography appear as separate subsections under “Miscellaneous recommendations and topics”."
              ]
            },
            {
              label: "Practical impact",
              paragraphs: [
                "This comparison establishes a change in the booklet’s coverage and section structure."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), Contents C.1–C.11, printed pp. 4–5 / PDF pp. 5–6; Terminology: Contrast agents and contrast media, printed p. 5 / PDF p. 6.",
            "Source: Official German ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), Inhalt C.1–C.11, PDF pp. 4–5; Terminologie: Kontrastmittel und Röntgenkontrastmittel, printed pp. 10–11 / PDF p. 6.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Contents, printed/PDF p. 5; Safe use of contrast agents in patients with myasthenia gravis, p. 29; CO₂ and HSG subsections, p. 31."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR 2025 statements",
              bullets: [
                "For myasthenia gravis, the 2025 booklet states that intravenous low- or iso-osmolar iodine-based contrast media can be associated with symptom exacerbation within the first 24 hours after administration, probably in fewer than 5% of patients receiving these agents intravenously; gadolinium-based contrast agents are described as safe for myasthenia gravis patients.",
                "The 2025 HSG subsection notes limited external validity because some contrast media used in the past are no longer on the market. Compared with water-based contrast media, oil-based contrast media are associated with approximately 10% more pregnancies and live births and significantly better image quality; intravasation occurs with equal frequency. Oil-based contrast media can remain in the abdominal cavity for a prolonged period and have a significantly greater inflammatory effect on the peritoneum; the clinical consequences are unknown, and caution is advised. In every woman receiving oil-based contrast media, thyroid function should be tested before HSG and monitored for 6 months afterwards; routine additional neonatal thyroid function tests after HSG are not indicated.",
                "The 2025 booklet describes the evidence for CO₂ angiography as an alternative to iodine-based contrast media as limited. CO₂ angiography seems to be a safe alternative in vascular procedures and may reduce CA-AKI risk, especially in PAD procedures, while specific contraindications and safety measures and the higher incidence of non-serious adverse events need to be considered. More large-scale RCTs are needed to confirm these findings and further investigate CA-AKI risk factors in EVAR and interventional procedures for PAD."
              ],
              variant: "action"
            },
            {
              label: "Why this matters",
              paragraphs: [
                "These are dedicated subsections in the 2025 booklet; carbon dioxide was already named in the 2018 terminology sections."
              ]
            }
          ],
          refs: [
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Safe use of contrast agents in patients with myasthenia gravis, printed/PDF p. 29.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, Safety of CO₂ as an alternative to iodine-based contrast media in vascular procedures; Safe use of contrast agents in hysterosalpingography (HSG), printed/PDF p. 31."
          ]
        }
      },

      {
        id: "other_reorganized_topics",
        level: "medium",
        icon: "stack",
        title: "Selected 2018 topics in the 2025 booklet",
        summary:
          "The 2025 booklet contains some 2018 topics with differences in wording or placement, uses a different classification for others, and does not reproduce some 2018 topics. Each topic therefore has to be compared separately.",
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
              label: "Present in both booklets",
              bullets: [
                "Pregnancy and lactation, paediatric use, metformin, gadolinium retention, warming and fasting are addressed in both booklets. Their wording and/or placement is not identical.",
                "In 2025, metformin appears under systemic diseases. Warming and fasting remain separate topics under “Miscellaneous”; the 2025 fasting text also includes ultrasound contrast agents.",
                "The 2025 paediatric section does not reproduce the 2018 bullets stating that non-ionic iodine-based contrast media should be used and that high-risk gadolinium-based agents should be avoided."
              ]
            },
            {
              label: "Classification or scope changed",
              bullets: [
                "The 2018 “late adverse reactions” section defined late reactions as occurring 1 hour to 1 week after intravascular iodine-based contrast medium. In 2025, non-immediate/delayed hypersensitivity reactions are handled within the adult HSR section; these are not the same document classification.",
                "The 2018 “very late adverse reactions” umbrella is not retained as such in 2025. Iodine-induced hyperthyroidism is addressed under systemic diseases, while NSF remains present as a dedicated body section.",
                "For extravascular iodine-based contrast administration, the 2018 booklet gave a general precaution when systemic absorption or leakage was possible. The 2025 booklet contains a more detailed HSR-specific paragraph on nonvascular administration and management of hypersensitivity reactions."
              ]
            },
            {
              label: "Not found in the 2025 booklet",
              bullets: [
                "The 2018 sickle cell disease section was not found in the complete 2025 booklet.",
                "The 2018 recommendations on effects of contrast media on blood and endothelium, including thrombosis, were not found in the complete 2025 booklet."
              ]
            },
            {
              label: "Scope limit",
              paragraphs: [
                "“Not found in the 2025 booklet” describes only this booklet comparison and does not mean that ESUR has withdrawn the topic from all guidance. A missing table-of-contents entry alone is not evidence of absence from the body; NSF is present in the 2025 body without its own contents line."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN): A.1.3–A.1.5, printed p. 11 / PDF p. 12; A.2, printed p. 12 / PDF p. 13; A.3, printed p. 13 onward / PDF p. 14 onward; B.4, printed p. 22 / PDF p. 23; C.3–C.3.2, printed pp. 27–28 / PDF pp. 28–29; C.5, printed p. 29 / PDF p. 30; C.7, printed pp. 31–32 / PDF pp. 32–33; C.10, printed p. 35 / PDF p. 36.",
            "Source: Official German ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE): A.1.3–A.1.5 body text, printed pp. 18–19 / PDF p. 10 (the A.1.3 heading in the DE source is mismatched); A.2, printed pp. 20–21 / PDF p. 11; A.3, printed pp. 22–23 / PDF p. 12 onward; B.4, printed p. 33 / PDF p. 17; C.3–C.3.2, printed pp. 37–38 / PDF pp. 19–20; C.5, printed pp. 39–40 / PDF pp. 20–21; C.7, printed pp. 42–43 / PDF p. 22; C.10, printed p. 46 / PDF p. 24.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025: nonvascular iodine administration, printed/PDF p. 10; NSF, pp. 24–26; pregnancy/lactation, pp. 26–27; paediatric use, p. 27; metformin and iodine-induced hyperthyroidism, pp. 27–28; gadolinium retention, pp. 29–30; fasting and warming, pp. 31–32; guidelines currently being updated, p. 33."
          ]
        },
        action: {
          sections: [
            {
              label: "Source-concordant comparison",
              bullets: [
                "Present in both booklets, with wording and/or placement differences: pregnancy and lactation, paediatric use, metformin, gadolinium retention, warming and fasting.",
                "Classification or scope changed: late and very late adverse reactions, and the nonvascular/extravascular iodine-based contrast passages.",
                "Not found in the complete 2025 booklet: the 2018 sickle cell disease section and the 2018 blood/endothelium/thrombosis recommendations."
              ],
              variant: "action"
            },
            {
              label: "Interpretation limit",
              paragraphs: [
                "The comparison describes the authorized 2018 and 2025 booklet texts. It does not establish that a topic absent from the 2025 booklet has been withdrawn from all ESUR guidance."
              ]
            }
          ],
          refs: [
            "Source: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), sections A.1.3–A.3, B.4, C.3–C.3.2, C.5, C.7 and C.10; printed pp. 11–35 / corresponding PDF pp. 12–36.",
            "Source: Official German ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), corresponding sections A.1.3–A.3, B.4, C.3–C.3.2, C.5, C.7 and C.10; PDF pp. 10–24.",
            "Source: ESUR Contrast Media Safety Committee Guidelines 2025, relevant body sections on pp. 10 and 24–33."
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
          "Die Kurzanleitung der Version 10 von 2018 gliedert die Themen in drei Hauptabschnitte. Das Inhaltsverzeichnis 2025 enthält thematische Überschriften; die Einleitung kündigt an, dass die Leitlinien auch in elektronischer Form auf der ESUR-Website erscheinen und jährlich aktualisiert werden sollen.",
        keywords: [
          "publikation",
          "struktur",
          "elektronisch",
          "jährliche aktualisierung",
          "thematische abschnitte",
          "permanent work in progress"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Die Version 10.0 (2018) wurde als Broschüre vorgestellt. Ihre Kurzanleitung gliedert die Themen in Allgemeine unerwünschte Wirkungen, Renale unerwünschte Wirkungen (PC-AKI) und Verschiedenes. Die offizielle deutsche Ausgabe von 2018 erwähnt bereits elektronische Versionen dieser Leitlinien auf der ESUR-Website."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Das Inhaltsverzeichnis 2025 nennt thematische Abschnitte unter anderem zu Hypersensitivitätsreaktionen, Prävention von CA-AKI, Dialyse, Extravasation, Wartezeiten, Laborinterferenz und systemischen Erkrankungen. Unter der Überschrift „Miscellaneous recommendations and topics“ stehen außerdem CO₂ und HSG.",
                "Die Einleitung 2025 kündigt an, dass die Leitlinien von nun an auch in elektronischer Form auf der ESUR-Website erscheinen und jährlich aktualisiert werden sollen. Sie beschreibt die Leitlinien als permanent work in progress."
              ]
            },
            {
              label: "Gegenstand des Vergleichs",
              paragraphs: [
                "Die beiden Ausgaben gliedern ihre Inhalte unterschiedlich. Aus diesem Strukturvergleich lässt sich nicht ableiten, ob sich eine einzelne klinische Empfehlung geändert hat."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR-Leitlinien 10.0 (2018 EN), Preface S. 2 / PDF S. 3; Quick Guide S. 3 / PDF S. 4; Contents S. 4–5 / PDF S. 5–6",
            "Quelle: ESUR-Leitlinien 10.0 (2018 DE), Einleitung und Kurzanleitung, unnummeriert / PDF S. 3; Inhalt, unnummeriert / PDF S. 4–5",
            "Quelle: ESUR CMSC Guidelines 2025, Preface S. 3 / PDF S. 3; Contents S. 4–5 / PDF S. 4–5"
          ]
        },
        action: {
          sections: [
            {
              label: "Hinweise zu den Quellen",
              bullets: [
                "Laut Einleitung fasst die Ausgabe 2025 zentrale Empfehlungen zusammen und regt an, für ein vollständiges Verständnis des jeweiligen Themas die ursprünglichen ESUR-CMSC-Leitlinienpublikationen heranzuziehen.",
                "Die Einleitung 2025 kündigt an, dass die Leitlinien von nun an auch in elektronischer Form auf der ESUR-Website erscheinen und jährlich aktualisiert werden sollen."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die Einleitung 2025 nennt unter anderem aktualisierte Abschnitte zu Kontrastmittel-Hypersensitivität und Extravasation. Das Inhaltsverzeichnis allein zeigt nicht, wie sich eine einzelne klinische Empfehlung geändert hat."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR CMSC Guidelines 2025, Preface und Note, S. 3 / PDF S. 3; Contents S. 4–5 / PDF S. 4–5"
          ]
        }
      },

      {
        id: "hypersensitivity",
        level: "high",
        icon: "warningDrop",
        title: "Hypersensitivität",
        summary:
          "Für Erwachsene definiert die 2025er Guidance IHR und NIHR und beschreibt Akutmanagement, Dokumentation, allergologische Abklärung und Wege zur Prävention erneuter Reaktionen.",
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
                "Die Leitlinie von 2018 behandelte akute und späte unerwünschte Wirkungen und enthielt bereits Allergietests, Dokumentation und Maßnahmen gegen erneute Reaktionen. Sehr späte unerwünschte Wirkungen wurden gesondert behandelt.",
                "Die Leitlinie von 2018 trennte akute und späte Reaktionen. Die Guidance von 2025 definiert IHR und NIHR ausdrücklich und beschreibt getrennte Präventionswege."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Ausdrückliche Definition von immediate hypersensitivity reactions (IHR) und non-immediate hypersensitivity reactions (NIHR).",
                "Das ESUR CMSC 2025 befürwortet sowohl die ACR- als auch die Ring-&-Messmer-Klassifikation; Ring & Messmer war bereits in der Akuteinteilung von 2018 enthalten.",
                "Das Akutmanagement beschreibt ABCDE-Beurteilung, Beobachtung nach Behandlung, Belassen des IV-Zugangs während der Beobachtung sowie symptomabhängige Lagerung und Supportivmaßnahmen.",
                "Konkretisierte Tryptase-Probenahme, detaillierte Reaktionsdokumentation und Wege zur Prävention erneuter Reaktionen.",
                "Wege nach Schweregrad; bei früherer moderater oder schwerer IHR getrennte Wege für elektive und notfallmäßige Untersuchungen."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Die Guidance von 2025 beschreibt die allergologische Abklärung und die Planung künftiger Kontrastmitteluntersuchungen nach Schweregrad, insbesondere nach moderaten oder schweren Reaktionen.",
                "Die Dokumentation des konkreten Kontrastmittels war schon 2018 vorgesehen. Die Guidance von 2025 präzisiert weitere Reaktionsdetails für die allergologische Abklärung und spätere Kontrastmittelauswahl."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), A.1 Akute unerwünschte Wirkungen, A.2 Späte unerwünschte Wirkungen und A.3 Sehr späte unerwünschte Wirkungen, Drucks. 12–26 / PDF-S. 7–14.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Hypersensitivity reactions to contrast agents (in adults)“, Druck-/PDF-S. 6–14; van der Molen et al., Part 1, European Radiology 2025;35:6798–6810 (PDF-S. 1–13); Part 2, European Radiology 2025;35:6811–6825 (PDF-S. 1–15)."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Patienten mit moderater oder schwerer HSR, wiederkehrender HSR jeder Schwere oder HSR auf mehrere iodhaltige oder gadoliniumhaltige Kontrastmittel an einen Spezialisten für Arzneimittelallergien überweisen; nach milder HSR ist die Überweisung bei ausreichender Kapazität optional.",
                "Bei erneuter Kontrastmittelgabe in den beschriebenen IHR-Pfaden und den Pfaden für milde oder moderate NIHR ohne Gefahrenzeichen mindestens 30 min mit liegendem IV-Zugang beobachten.",
                "Wenn keine allergologische Empfehlung vorliegt, nach milder IHR oder milder oder moderater NIHR ohne Gefahrenzeichen bei bekanntem Auslöser ein anderes Mittel wählen. Im Notfall nach moderater oder schwerer IHR bei bekanntem Auslöser ebenfalls ein anderes Mittel wählen. Elektive Untersuchungen nach moderater oder schwerer IHR bis zum Ergebnis der Allergieanalyse verschieben und die allergologische Empfehlung anwenden.",
                "Nach schwerer NIHR mit Gefahrenzeichen (SCAR) dringend an einen Spezialisten für Arzneimittelallergien überweisen, eine alternative Bildgebung wählen und alle Mittel der betroffenen Klasse (iodhaltig oder gadoliniumhaltig) vermeiden; nach schwerer Reaktion auf ein unbekanntes Kontrastmittel das Vorgehen nach multidisziplinärer Beratung individualisieren.",
                "Bei allen moderaten bis schweren IHR Serumtryptase innerhalb von 1–4 h ab Reaktionsbeginn bestimmen; eine zweite Messung nach ≥24 h dient als Baseline."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die Guidance von 2025 verbindet eine detaillierte Reaktionsdokumentation mit allergologischer Abklärung und einer Planung nach Schweregrad, wenn eine weitere Kontrastmitteluntersuchung erwogen wird."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Hypersensitivity reactions to contrast agents (in adults)“, Druck-/PDF-S. 6–14; van der Molen et al., Part 1, European Radiology 2025;35:6798–6810 (PDF-S. 1–13); Part 2, European Radiology 2025;35:6811–6825 (PDF-S. 1–15).",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), A.1 Akute unerwünschte Wirkungen, A.2 Späte unerwünschte Wirkungen und A.3 Sehr späte unerwünschte Wirkungen, Drucks. 12–26 / PDF-S. 7–14."
          ]
        }
      },

      {
        id: "ca_aki_terminology",
        level: "low",
        icon: "kidney",
        title: "Renale Terminologie: PC-AKI → CA-AKI",
        summary:
          "Im Abschnitt zur renalen Prävention bei iodhaltigen Kontrastmitteln verwendet das ESUR CMSC ab 2025 CA-AKI statt PC-AKI gemäß dem ACR/NKF Consensus 2020.",
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
                "Die offizielle deutsche ESUR-Fassung von 2018 verwendet das Kürzel PC-AKI und bezeichnet es als „Kontrastmittel-assoziierte akute Nierenschädigung“. Die englische Fassung löst PC-AKI als „post-contrast acute kidney injury“ auf."
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
                "Der Wechsel von PC-AKI zu CA-AKI bezeichnet die vom ESUR CMSC ab 2025 verwendete Terminologie."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), B. Renale unerwünschte Wirkungen (Kontrastmittel-assoziierte akute Nierenschädigung, PC-AKI), Definition, Drucks. 27 / PDF-S. 14.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Prevention of contrast-associated acute kidney injury (CA-AKI) when administering iodine-based contrast media“ — Terminologiehinweis und Definitionen, Druck-/PDF-S. 15."
          ]
        },
        action: {
          sections: [
            {
              label: "Hinweis zur Terminologie",
              bullets: [
                "Ab 2025 verwendet das ESUR CMSC gemäß dem ACR/NKF Consensus 2020 CA-AKI anstelle von PC-AKI.",
                "Der Terminologiehinweis formuliert für sich genommen keine gesonderte klinische Maßnahme."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die Guidance von 2025 begründet den Terminologiewechsel ausdrücklich mit dem ACR/NKF Consensus 2020; renale Risiko- und Präventionsmaßnahmen werden gesondert beschrieben."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Prevention of contrast-associated acute kidney injury (CA-AKI) when administering iodine-based contrast media“ — Terminologiehinweis und Definitionen, Druck-/PDF-S. 15.",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), B. Renale unerwünschte Wirkungen (Kontrastmittel-assoziierte akute Nierenschädigung, PC-AKI), Definition, Drucks. 27 / PDF-S. 14."
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
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), B.6 gleichzeitige Iod-/Gadolinium-Gabe und B.7–B.8 wiederholte Gaben, Drucks. 34–35 / PDF-S. 18.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Safe time intervals between contrast agent injections“, Druck-/PDF-S. 21–22."
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
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Safe time intervals between contrast agent injections“, Druck-/PDF-S. 21–22.",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), B.6 gleichzeitige Iod-/Gadolinium-Gabe und B.7–B.8 wiederholte Gaben, Drucks. 34–35 / PDF-S. 18."
          ]
        }
      },

      {
        id: "laboratory_interference",
        level: "high",
        icon: "lab",
        title: "Analytische Interferenz mit Labortests",
        summary:
          "Version 10.0 enthielt bereits Empfehlungen zur Blut- und Urinprobenahme. Das Booklet 2025 nennt für die Probenahme nach intravaskulärer Kontrastmittelgabe getrennte empfohlene Wartezeiten für Blut und Urin in drei eGFR-Gruppen.",
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
                "Für laborchemische Proben in der Routinediagnostik empfahl Version 10.0, Urin- und Blutproben vorzugsweise vor der Kontrastmittelgabe abzunehmen. Bei normaler Nierenfunktion konnte eine Blutentnahme bei Bedarf 4 h nach der Gabe erfolgen. Bei reduzierter Nierenfunktion (eGFR <45 ml/min/1,73 m²) sollten Blutentnahmen so lange wie möglich hinausgezögert werden. Die offizielle deutsche Fassung sagt, dass „Sammelurin“ für 24 h unterbleiben sollte; die englische Fassung spricht von „urine collection“."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Das Booklet 2025 enthält einen eigenen Abschnitt zur analytischen Interferenz intravaskulärer Kontrastmittel mit Labortests. Es gibt Empfehlungen auf Grundlage eines Expertenkonsenses, unter anderem für iod- und gadoliniumhaltige Kontrastmittel, und nennt empfohlene Wartezeiten für Blut- und Urinproben nach eGFR-Gruppe."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Im Vergleich zu 2018 nennt das Booklet 2025 drei eGFR-Gruppen für jede Probenart: Für Blutentnahmen werden empfohlene Mindest- und Optimalwartezeiten angegeben, für Urinproben nur empfohlene Mindestwartezeiten."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR Guidelines on Contrast Agents, Version 10.0 (2018), EN, Abschnitt C.6 „Non-emergency biochemical assays“, gedruckte S. 30 / PDF-S. 31.",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018), Abschnitt C.6 „Laborchemische Proben in der Routinediagnostik“, gedruckte S. 41 / PDF-S. 21 (Doppelseite).",
            "Quelle: ESUR CMSC Contrast Agent Guidelines 2025 Booklet, „Analytical interference of intravascular contrast agents with clinical laboratory tests“, gedruckte/PDF-S. 23."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Empfohlene Wartezeit für Blutentnahmen nach intravaskulärer Kontrastmittelgabe: eGFR >60 ml/min/1,73 m² — mindestens 4 h; optimal 12 h.",
                "Empfohlene Wartezeit für Blutentnahmen nach intravaskulärer Kontrastmittelgabe: eGFR 30–60 ml/min/1,73 m² — mindestens 16 h; optimal 48 h.",
                "Empfohlene Wartezeit für Blutentnahmen nach intravaskulärer Kontrastmittelgabe: eGFR <30 ml/min/1,73 m² — mindestens 2,5 Tage (60 h); optimal 7 Tage (168 h).",
                "Empfohlene Wartezeit für Urinproben nach intravaskulärer Kontrastmittelgabe: eGFR >60 ml/min/1,73 m² — mindestens 24 h; eGFR 30–60 ml/min/1,73 m² — mindestens 48 h; eGFR <30 ml/min/1,73 m² — mindestens 7 Tage (168 h)."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die Guideline von 2018 enthielt bereits konkrete Zeitangaben zur Blut- und Urinprobenahme. Das Booklet 2025 unterscheidet drei eGFR-Gruppen und gibt für Blutentnahmen empfohlene Mindest- und Optimalwartezeiten an, für Urinproben jedoch nur empfohlene Mindestwartezeiten."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR Guidelines on Contrast Agents, Version 10.0 (2018), EN, Abschnitt C.6 „Non-emergency biochemical assays“, gedruckte S. 30 / PDF-S. 31.",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018), Abschnitt C.6 „Laborchemische Proben in der Routinediagnostik“, gedruckte S. 41 / PDF-S. 21 (Doppelseite).",
            "Quelle: ESUR CMSC Contrast Agent Guidelines 2025 Booklet, „Analytical interference of intravascular contrast agents with clinical laboratory tests“, gedruckte/PDF-S. 23."
          ]
        }
      },

      {
        id: "extravasation",
        level: "high",
        icon: "extravasation",
        title: "Extravasation",
        summary:
          "Die Extravasationshinweise von 2025 ergänzen ausdrückliche Definitionen für leichte, moderate und schwere Fälle, genauere Schritte zur Erkennung und Meldung sowie konkrete Angaben zur Überwachung und chirurgischen Abklärung. Risikofaktoren, Prävention, Bildgebung und chirurgische Vorstellung waren bereits 2018 behandelt.",
        keywords: [
          "extravasation",
          "kontrastmittelaustritt",
          "schweregrad",
          "mild moderat schwer",
          ">150 mL",
          "chirurgische beurteilung"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "Die englische und die offizielle deutsche Leitlinie von 2018 trennen bereits technische von patientenbezogenen Risikofaktoren. Sie beschreiben Risikoreduktion, eine möglicherweise hilfreiche bildgebende Dokumentation, meist ausreichende konservative Behandlung und die chirurgische Vorstellung bei Verdacht auf schwere Schäden."
              ]
            },
            {
              label: "2025",
              bullets: [
                "Definiert leichte, moderate und schwere Extravasationen anhand klinischer Befunde und sieht die Beurteilung des Schweregrades vor.",
                "Behält die Trennung technischer und patientenbezogener Risikofaktoren bei und konkretisiert weitere Massnahmen zur Risikoreduktion: Eine geeignete Oberarmvene wird bevorzugt; ausserdem nennt der Abschnitt eine geeignete Kanülengrösse, passende Flussraten und Drücke sowie die Minimierung des Kontrastmittelvolumens anhand von Indikation und Patientengrösse.",
                "Konkretisiert die Erkennung während und nach der Injektion, die Dokumentation im radiologischen Bericht und im lokalen Meldesystem, ein Patienteninformationsblatt sowie einen Nachsorgetermin, falls erforderlich.",
                "Bei moderaten oder schweren Fällen können zwei orthogonale Röntgenaufnahmen oder eine Schnittbildgebung helfen, Ausdehnung und Kompartimentierung zu beurteilen. Bei Verdacht auf schwere Schäden ist dringend chirurgischer Rat einzuholen; bei einem extravasierten Volumen >150 mL wird eine chirurgische Beurteilung ebenfalls empfohlen."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Gegenüber 2018 nennt der Abschnitt von 2025 drei Schweregrade, genauere Schritte zur Erkennung und Meldung, eine Überwachung leichter Fälle alle 2–4 Stunden und zusätzliche Anlässe für chirurgischen Rat."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Offizielle deutsche ESUR-Leitlinie 10.0 (2018), § C.1, Druckseite 36 (PDF-Seite 19).",
            "ESUR CMSC Guidelines 2025, Management and prevention of contrast agent extravasation, Druckseiten 20–21 (PDF-Seiten 20–21)."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Das Booklet von 2025 sieht die Einordnung als leicht, moderat oder schwer vor. Moderate Fälle erfordern engmaschige Überwachung; zur Prüfung einer neurovaskulären Beeinträchtigung wird eine ärztliche Beurteilung empfohlen.",
                "Der Abschnitt von 2025 konkretisiert die Prävention bei Venenzugang, Kanülengrösse, Fluss, Druck und Kontrastmittelvolumen. Sorgfältige Kanülierung und eine Testinjektion mit Kochsalzlösung waren bereits 2018 beschrieben.",
                "Für leichte Fälle nennt das Booklet von 2025 Hochlagern der Extremität, Eispackungen und Überwachung alle 2–4 Stunden. Bei Besserung ist die Entlassung vorgesehen; bleibt die Besserung aus, ist chirurgischer Rat erforderlich.",
                "Bei moderaten oder schweren Fällen können zwei orthogonale Röntgenaufnahmen oder eine Schnittbildgebung helfen, Ausdehnung und Kompartimentierung zu beurteilen. Die Komplikation ist im radiologischen Bericht und im lokalen Meldesystem zu dokumentieren; ein Patienteninformationsblatt sollte ausgehändigt und ein Nachsorgetermin vereinbart werden, falls erforderlich.",
                "Bei Verdacht auf schwere Schäden dringend chirurgischen Rat einholen. Auch bei einem extravasierten Volumen von mehr als 150 mL wird eine chirurgische Beurteilung empfohlen."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die zusätzlichen Angaben von 2025 betreffen Schweregraddefinitionen, Erkennung, Meldung, Überwachung leichter Fälle und konkrete Anlässe für chirurgischen Rat; mehrere Massnahmen zur Risikoreduktion und Behandlung standen bereits in der Leitlinie von 2018."
              ]
            }
          ],
          refs: [
            "ESUR CMSC Guidelines 2025, Management and prevention of contrast agent extravasation, Druckseiten 20–21 (PDF-Seiten 20–21).",
            "Für den Vergleich mit 2018: offizielle deutsche ESUR-Leitlinie 10.0, § C.1, Druckseite 36 (PDF-Seite 19)."
          ]
        }
      },

      {
        id: "dialysis_refinement",
        level: "medium",
        icon: "dialysis",
        title: "Dialyse-bezogene Präzisierung",
        summary:
          "Der Dialyseabschnitt von 2025 unterscheidet innerhalb getrennter Abschnitte für Hämodialyse und CAPD ausdrücklich zwischen makrozyklischen und linearen GBCA.",
        keywords: [
          "dialyse",
          "hämodialyse",
          "makrozyklisch",
          "linear",
          "GBCA",
          "CAPD"
        ],
        compare: {
          sections: [
            {
              label: "2018",
              paragraphs: [
                "ESUR 10.0 unterschied bereits Hämodialyse und CAPD sowie iodhaltige Röntgenkontrastmittel und GBCA. Bei Hämodialyse waren für iodhaltige Röntgenkontrastmittel die Abstimmung mit der Hämodialysesitzung nicht erforderlich und eine zusätzliche Hämodialyse zur Elimination nicht notwendig; bei gadoliniumhaltigen Kontrastmitteln wurde empfohlen, die Gabe mit dem Hämodialysezeitpunkt abzustimmen, und nach der Gabe sollte so früh wie möglich eine Hämodialyse durchgeführt werden.",
                "Bei CAPD war eine Hämodialyse zur Elimination iodhaltiger Röntgenkontrastmittel nicht notwendig; nach gadoliniumhaltigen Kontrastmitteln sollte die Notwendigkeit einer Hämodialyse mit dem überweisenden Arzt besprochen werden."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Bei Patientinnen und Patienten unter Hämodialyse ist nach makrozyklischen GBCA keine sofortige Dialysesitzung erforderlich; nach linearen Mitteln (z. B. leberspezifischen Mitteln) ist sie angezeigt und muss an den folgenden zwei Tagen wiederholt werden.",
                "Bei Patientinnen und Patienten unter CAPD ist nach makrozyklischen GBCA keine sofortige Dialysesitzung erforderlich; bei linearen GBCA sollte das NSF-Risiko gegen das Risiko der Anlage eines temporären Hämodialysekatheters abgewogen werden, in Rücksprache mit dem überweisenden Arzt."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Gegenüber 2018 ergänzt die GBCA-Guidance 2025 eine ausdrückliche Unterscheidung zwischen makrozyklischen und linearen Mitteln. Die Vorgaben zur sofortigen Dialyse unterscheiden sich nach Dialyseart und GBCA-Klasse."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR Guidelines on Contrast Agents 10.0 (2018 EN), § B.5 Dialysis and contrast medium administration, Druckseite 23 / PDF-Seite 24.",
            "Quelle: ESUR Leitlinien für Kontrastmittel 10.0 (offizielle DE-Fassung), § B.5 Dialyse und Kontrastmittelgabe, Druckseiten 33–34 / PDF-Seiten 17–18.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, Safe use of contrast agent administration in patients on dialysis, Druck-/PDF-Seite 19."
          ]
        },
        action: {
          sections: [
            {
              label: "ESUR-2025-Kernaussagen",
              bullets: [
                "Bei iodhaltigen Röntgenkontrastmitteln ist für Hämodialysepatienten keine zeitliche Abstimmung der Injektion mit der Hämodialysesitzung oder den Hämodialysesitzungen erforderlich; zusätzliche Hämodialysesitzungen zur Entfernung des Kontrastmittels werden nicht empfohlen. Bei CAPD ist eine zusätzliche Hämodialyse zur Elimination iodhaltigen Röntgenkontrastmittels nicht notwendig.",
                "Nach makrozyklischen GBCA ist bei Hämodialyse oder CAPD keine sofortige Dialysesitzung erforderlich.",
                "Nach linearen GBCA ist bei Patientinnen und Patienten unter Hämodialyse eine sofortige Dialysesitzung angezeigt und muss an den folgenden zwei Tagen wiederholt werden.",
                "Bei CAPD und linearen GBCA sollte das NSF-Risiko in Rücksprache mit dem überweisenden Arzt gegen das Risiko der Anlage eines temporären Hämodialysekatheters abgewogen werden."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Die GBCA-Anweisungen von 2025 unterscheiden sich nach Dialyseart und GBCA-Klasse."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, Safe use of contrast agent administration in patients on dialysis — Patients on haemodialysis; Patients on continuous ambulatory peritoneal dialysis, Druck-/PDF-Seite 19."
          ]
        }
      },

      {
        id: "new_clinical_scenarios",
        level: "medium",
        icon: "layers",
        title: "Eigene ESUR-2025-Abschnitte: Myasthenia gravis, HSG und CO₂-Angiographie",
        summary:
          "Die englische und die offizielle deutsche Ausgabe von 2018 behandeln Myasthenia gravis und HSG nicht; beide nennen Kohlendioxid nur in der Terminologie. Das Booklet 2025 enthält zu allen drei Themen eigene Unterabschnitte.",
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
                "Keine der beiden Ausgaben von 2018 behandelt Myasthenia gravis oder HSG. Beide nennen Kohlendioxid nur als Beispiel eines Röntgenkontrastmittels in der Terminologie; ein Unterabschnitt zur CO₂-Angiographie fehlt."
              ]
            },
            {
              label: "2025",
              paragraphs: [
                "Myasthenia gravis steht unter „Safe use of contrast agents in patients with systemic diseases“. HSG und CO₂-Angiographie stehen als getrennte Unterabschnitte unter „Miscellaneous recommendations and topics“."
              ]
            },
            {
              label: "Praktische Bedeutung",
              paragraphs: [
                "Dieser Vergleich belegt eine Änderung der im Booklet behandelten Themen und ihrer Gliederung."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), Inhaltsverzeichnis C.1–C.11, Drucks. 4–5 / PDF-S. 5–6; „Terminology: Contrast agents and contrast media“, Drucks. 5 / PDF-S. 6.",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), Inhalt C.1–C.11, PDF-S. 4–5; „Terminologie: Kontrastmittel und Röntgenkontrastmittel“, Drucks. 10–11 / PDF-S. 6.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, Inhaltsverzeichnis, Druck-/PDF-S. 5; „Safe use of contrast agents in patients with myasthenia gravis“, S. 29; CO₂- und HSG-Unterabschnitte, S. 31."
          ]
        },
        action: {
          sections: [
            {
              label: "Aussagen der ESUR 2025",
              bullets: [
                "Bei Myasthenia gravis können laut Booklet 2025 intravenös verabreichte niedrig- oder iso-osmolare iodhaltige Röntgenkontrastmittel innerhalb der ersten 24 Stunden nach der Gabe mit einer Verschlechterung der Symptome verbunden sein, wahrscheinlich bei weniger als 5 % der Patientinnen und Patienten, die diese Mittel intravenös erhalten; gadoliniumhaltige Kontrastmittel werden für Patientinnen und Patienten mit Myasthenia gravis als sicher beschrieben.",
                "Der HSG-Unterabschnitt von 2025 weist darauf hin, dass die externe Validität begrenzt ist, weil einige früher verwendete Kontrastmittel nicht mehr auf dem Markt sind. Im Vergleich zu wasserbasierten Kontrastmitteln treten nach HSG mit ölbasierten Kontrastmitteln etwa 10 % mehr Schwangerschaften und Lebendgeburten auf und die Bildqualität ist signifikant besser; Intravasationen treten gleich häufig auf. Ölbasierte Kontrastmittel können längere Zeit in der Bauchhöhle verbleiben und haben einen signifikant stärkeren entzündlichen Effekt auf das Peritoneum; die klinischen Folgen sind unbekannt und bei der Anwendung ist Vorsicht geboten. Bei jeder Frau, die ein ölbasiertes Kontrastmittel erhält, soll die Schilddrüsenfunktion vor der HSG geprüft und danach 6 Monate lang überwacht werden; routinemässige zusätzliche Schilddrüsenfunktionstests beim Neugeborenen nach HSG sind nicht indiziert.",
                "Das Booklet 2025 bezeichnet die Evidenz zur CO₂-Angiographie als Alternative zu iodhaltigen Röntgenkontrastmitteln als begrenzt. CO₂ scheint bei vaskulären Eingriffen eine sichere Alternative zu sein und könnte das CA-AKI-Risiko insbesondere bei PAD-Eingriffen senken; dabei sind spezifische Kontraindikationen und Sicherheitsmassnahmen sowie die höhere Häufigkeit nicht schwerwiegender unerwünschter Ereignisse zu berücksichtigen. Weitere grosse RCTs sind erforderlich, um diese Ergebnisse zu bestätigen und CA-AKI-Risikofaktoren bei EVAR und interventionellen Eingriffen wegen PAD weiter zu untersuchen."
              ],
              variant: "action"
            },
            {
              label: "Warum das wichtig ist",
              paragraphs: [
                "Dies sind eigene Unterabschnitte im Booklet 2025; Kohlendioxid wurde bereits 2018 in der Terminologie genannt."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Safe use of contrast agents in patients with myasthenia gravis“, Druck-/PDF-S. 29.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, „Safety of CO₂ as an alternative to iodine-based contrast media in vascular procedures“ und „Safe use of contrast agents in hysterosalpingography (HSG)“, Druck-/PDF-S. 31."
          ]
        }
      },

      {
        id: "other_reorganized_topics",
        level: "medium",
        icon: "stack",
        title: "Ausgewählte Themen von 2018 im Booklet 2025",
        summary:
          "Einige Themen aus 2018 sind auch im Booklet 2025 enthalten, teils mit anderem Wortlaut oder an anderer Stelle. Andere werden anders klassifiziert, und einige Themen aus 2018 werden im Booklet 2025 nicht wiedergegeben. Deshalb ist jedes Thema einzeln zu vergleichen.",
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
              label: "In beiden Booklets enthalten",
              bullets: [
                "Schwangerschaft und Stillzeit, Pädiatrie, Metformin, Gadoliniumretention, Erwärmen und Nüchternheit werden in beiden Booklets behandelt. Wortlaut und/oder Einordnung sind nicht identisch.",
                "2025 steht Metformin unter systemischen Erkrankungen. Erwärmen und Nüchternheit bleiben getrennte Themen unter „Miscellaneous“; der 2025-Text zur Nüchternheit nennt zusätzlich Ultraschall-Kontrastmittel.",
                "Der Pädiatrie-Abschnitt 2025 gibt die 2018er Aussagen, dass bei iodhaltigen Röntgenkontrastmitteln nicht-ionische Mittel verwendet und bei gadoliniumhaltigen Kontrastmitteln Hochrisikomittel vermieden werden sollen, nicht wieder."
              ]
            },
            {
              label: "Geänderte Klassifikation oder Aussageebene",
              bullets: [
                "Der 2018er Abschnitt zu „späten unerwünschten Wirkungen“ definierte diese als Reaktionen 1 Stunde bis 1 Woche nach intravaskulärer Gabe iodhaltiger Röntgenkontrastmittel. 2025 werden nicht unmittelbare/verzögerte HSR im Erwachsenen-HSR-Abschnitt behandelt; dies ist nicht dieselbe Dokumentklassifikation.",
                "Die 2018er Oberkategorie „sehr späte unerwünschte Wirkungen“ wird 2025 nicht als solche fortgeführt. Jodinduzierte Hyperthyreose steht unter systemischen Erkrankungen; NSF ist weiterhin als eigener Abschnitt im Fließtext vorhanden.",
                "Bei extravaskulärer Gabe iodhaltiger Röntgenkontrastmittel enthielt das Booklet 2018 eine allgemeine Vorsichtsregel, wenn eine systemische Aufnahme oder Leckage möglich war. Das Booklet 2025 enthält einen detaillierteren HSR-spezifischen Absatz zur nichtvaskulären Gabe und zum Management von Überempfindlichkeitsreaktionen."
              ]
            },
            {
              label: "Im Booklet 2025 nicht gefunden",
              bullets: [
                "Der 2018er Abschnitt zur Sichelzellanämie wurde im vollständigen Booklet 2025 nicht gefunden.",
                "Die 2018er Empfehlungen zu Wirkungen von Kontrastmitteln auf Blut und Endothel einschließlich Thrombose wurden im vollständigen Booklet 2025 nicht gefunden."
              ]
            },
            {
              label: "Begrenzung",
              paragraphs: [
                "„Im Booklet 2025 nicht gefunden“ beschreibt nur diesen Booklet-Vergleich und bedeutet nicht, dass ESUR das Thema aus sämtlichen Leitlinien zurückgezogen hat. Ein fehlender Eintrag im Inhaltsverzeichnis belegt für sich allein keine Abwesenheit im Fließtext; NSF ist im 2025er Fließtext vorhanden, obwohl es keine eigene Inhaltsverzeichniszeile hat."
              ],
              variant: "impact"
            }
          ],
          refs: [
            "Quelle: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN): A.1.3–A.1.5, Drucks. 11 / PDF-S. 12; A.2, Drucks. 12 / PDF-S. 13; A.3, ab Drucks. 13 / ab PDF-S. 14; B.4, Drucks. 22 / PDF-S. 23; C.3–C.3.2, Drucks. 27–28 / PDF-S. 28–29; C.5, Drucks. 29 / PDF-S. 30; C.7, Drucks. 31–32 / PDF-S. 32–33; C.10, Drucks. 35 / PDF-S. 36.",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE): Fließtext A.1.3–A.1.5, Drucks. 18–19 / PDF-S. 10 (die Überschrift A.1.3 ist in der DE-Quelle abweichend); A.2, Drucks. 20–21 / PDF-S. 11; A.3, ab Drucks. 22–23 / ab PDF-S. 12; B.4, Drucks. 33 / PDF-S. 17; C.3–C.3.2, Drucks. 37–38 / PDF-S. 19–20; C.5, Drucks. 39–40 / PDF-S. 20–21; C.7, Drucks. 42–43 / PDF-S. 22; C.10, Drucks. 46 / PDF-S. 24.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025: nichtvaskuläre iodhaltige Kontrastmittelgabe, Druck-/PDF-S. 10; NSF, S. 24–26; Schwangerschaft/Stillzeit, S. 26–27; Pädiatrie, S. 27; Metformin und jodinduzierte Hyperthyreose, S. 27–28; Gadoliniumretention, S. 29–30; Nüchternheit und Erwärmen, S. 31–32; aktuell in Überarbeitung befindliche Guidelines, S. 33."
          ]
        },
        action: {
          sections: [
            {
              label: "Quellenkonformer Vergleich",
              bullets: [
                "In beiden Booklets enthalten, mit Unterschieden in Wortlaut und/oder Einordnung: Schwangerschaft und Stillzeit, Pädiatrie, Metformin, Gadoliniumretention, Erwärmen und Nüchternheit.",
                "Geänderte Klassifikation oder Aussageebene: späte und sehr späte unerwünschte Wirkungen sowie die Passagen zur nichtvaskulären/extravaskulären Gabe iodhaltiger Röntgenkontrastmittel.",
                "Im vollständigen Booklet 2025 nicht gefunden: der 2018er Abschnitt zur Sichelzellanämie sowie die 2018er Empfehlungen zu Blut/Endothel/Thrombose."
              ],
              variant: "action"
            },
            {
              label: "Interpretationsgrenze",
              paragraphs: [
                "Der Vergleich beschreibt die autorisierten Booklet-Texte von 2018 und 2025. Er belegt nicht, dass ein im Booklet 2025 fehlendes Thema aus sämtlichen ESUR-Leitlinien zurückgezogen wurde."
              ]
            }
          ],
          refs: [
            "Quelle: ESUR Guidelines on Contrast Agents, Version 10.0 (2018 EN), Abschnitte A.1.3–A.3, B.4, C.3–C.3.2, C.5, C.7 und C.10; Drucks. 11–35 / entsprechende PDF-S. 12–36.",
            "Quelle: Offizielle deutsche ESUR Leitlinien für Kontrastmittel, Version 10.0 (2018 DE), entsprechende Abschnitte A.1.3–A.3, B.4, C.3–C.3.2, C.5, C.7 und C.10; PDF-S. 10–24.",
            "Quelle: ESUR Contrast Media Safety Committee Guidelines 2025, einschlägige Abschnitte auf S. 10 und 24–33."
          ]
        }
      }
    ]
  };

  const views = {
    hsr: document.getElementById("view-hsr"),
    changes: document.getElementById("view-changes")
  };

  const hsrTabs = {
    guidance: document.getElementById("hsr-tab-guidance"),
    acute: document.getElementById("hsr-tab-acute"),
    switch: document.getElementById("hsr-tab-switch"),
    tryptase: document.getElementById("hsr-tab-tryptase"),
    nihr: document.getElementById("hsr-tab-nihr")
  };


  const flowOutput = document.getElementById("flowOutput");
  const flowSafety = document.getElementById("flowSafety");
  const acuteImmediateOutput = document.getElementById("acuteImmediateOutput");
  const acuteOutput = document.getElementById("acuteOutput");
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

  function abbreviationConfig() {
    return abbreviationUi[state.lang] || abbreviationUi.en;
  }

  function renderAbbreviationDisclosure(items, extraClass = "") {
    if (!items || !items.length) return "";
    const config = abbreviationConfig();
    const cls = extraClass ? ` abbr-disclosure--${escapeHtml(extraClass)}` : "";

    return `
      <details class="abbr-disclosure${cls}">
        <summary class="abbr-disclosure__summary">${escapeHtml(config.label)}</summary>
        <dl class="abbr-disclosure__list">
          ${items.map(([abbr, expansion]) => `
            <div class="abbr-disclosure__row">
              <dt>${escapeHtml(abbr)}</dt>
              <dd>${escapeHtml(expansion)}</dd>
            </div>
          `).join("")}
        </dl>
      </details>
    `;
  }

  function isAsciiAlphaNumeric(char) {
    return Boolean(char && /[A-Za-z0-9]/.test(char));
  }

  function containsAbbreviation(text, abbreviation) {
    let index = text.indexOf(abbreviation);

    while (index !== -1) {
      const before = index > 0 ? text[index - 1] : "";
      const afterIndex = index + abbreviation.length;
      const after = afterIndex < text.length ? text[afterIndex] : "";

      if (!isAsciiAlphaNumeric(before) && !isAsciiAlphaNumeric(after)) return true;
      index = text.indexOf(abbreviation, index + abbreviation.length);
    }

    return false;
  }

  function renderedTextWithoutClosedDetails(target) {
    if (!target || target.closest("[hidden]")) return "";

    const clone = target.cloneNode(true);
    clone.querySelectorAll(".abbr-slot").forEach((el) => el.remove());
    clone.querySelectorAll("[hidden]").forEach((el) => el.remove());
    clone.querySelectorAll("details:not([open])").forEach((details) => {
      Array.from(details.children).forEach((child) => {
        if (child.tagName !== "SUMMARY") child.remove();
      });
    });

    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function setContextualAbbreviationDisclosure(slotId, target, candidates, extraClass = "") {
    const slot = document.getElementById(slotId);
    if (!slot) return;

    slot.innerHTML = "";
    if (!target || target.closest("[hidden]") || !candidates || !candidates.length) return;

    const visibleText = renderedTextWithoutClosedDetails(target);
    const items = candidates.filter(([abbr]) => containsAbbreviation(visibleText, abbr));
    slot.innerHTML = renderAbbreviationDisclosure(items, extraClass);
  }

  function updateContextualAbbreviations() {
    const config = abbreviationConfig();

    setContextualAbbreviationDisclosure(
      "previousAbbreviations",
      document.getElementById("hsr-tab-guidance"),
      config.previous
    );

    setContextualAbbreviationDisclosure(
      "acuteAbbreviations",
      document.getElementById("hsr-tab-acute"),
      state.lang === "en" ? config.acute : []
    );

    setContextualAbbreviationDisclosure(
      "switchAbbreviations",
      document.getElementById("hsr-tab-switch"),
      config.switch
    );

    setContextualAbbreviationDisclosure(
      "tryptaseAbbreviations",
      document.getElementById("hsr-tab-tryptase"),
      config.tryptase
    );

    setContextualAbbreviationDisclosure(
      "nihrAbbreviations",
      document.getElementById("hsr-tab-nihr"),
      config.nihr
    );

    const changeCard = document.querySelector(".change-detail-card");
    const changeCandidates = config.changes?.[state.selectedChangeId] || [];
    setContextualAbbreviationDisclosure(
      "changeAbbreviations",
      changeCard,
      changeCandidates,
      "change"
    );
  }

  function fmt(value, digits = 2) {
    return Number(value).toFixed(digits);
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
    document.title = t("app_title");

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
      let organizations = stickyDisclaimer.querySelector('[data-ui-abbr="organizations"]');
      if (!organizations) {
        organizations = document.createElement("span");
        organizations.setAttribute("data-ui-abbr", "organizations");
        stickyDisclaimer.appendChild(organizations);
      }
      organizations.textContent = abbreviationConfig().organizations
        .map(([abbr, expansion]) => `${expansion} (${abbr})`)
        .join(" · ");

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

    const setMultilineText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = escapeHtml(value).replace(/\n/g, "<br />");
    };

    const setGroupLabel = (seg, value, label) => {
      const el = document.querySelector(`.seg__btn[data-seg="${seg}"][data-value="${value}"] > span`);
      if (el) el.textContent = label;
    };

    setMultilineText("icmHint", t("icm_hint"));
    setMultilineText("gbcaHint", t("gbca_hint"));
    fillSwitchPrinciples();

    setGroupLabel("icm", "A", t("icm_group_a_label"));
    setGroupLabel("icm", "B", t("icm_group_b_label"));
    setGroupLabel("icm", "C", t("icm_group_c_label"));
    setGroupLabel("icm", "D", t("icm_group_d_label"));
    setGroupLabel("gbca", "A", t("gbca_group_a_label"));
    setGroupLabel("gbca", "B", t("gbca_group_b_label"));
    setGroupLabel("gbca", "C", t("gbca_group_c_label"));

    setText("icm-group-a-names", t("icm_group_a_names"));
    setText("icm-group-b-names", t("icm_group_b_names"));
    setText("icm-group-c-names", t("icm_group_c_names"));
    setText("icm-group-d-names", t("icm_group_d_names"));
    setText("gbca-group-a-names", t("gbca_group_a_names"));
    setText("gbca-group-b-names", t("gbca_group_b_names"));
    setText("gbca-group-c-names", t("gbca_group_c_names"));

    const baseline = document.getElementById("baseline");
    const acute = document.getElementById("acute");
    if (baseline) baseline.placeholder = `${t("tryptase_baseline")} (ng/mL)`;
    if (acute) acute.placeholder = `${t("tryptase_acute")} (ng/mL)`;

    if (changesSearchInput && changesSearchInput.value !== state.changesSearch) {
      changesSearchInput.value = state.changesSearch;
    }
  }

  function setBodyMode() {
  const hsrView = document.getElementById("view-hsr");
  const guidanceView = document.getElementById("hsr-tab-guidance");

  const isRelevantView =
    hsrView &&
    !hsrView.hidden &&
    guidanceView &&
    !guidanceView.hidden;

  const isEmergencySelected = state.situation === "emergency";

  document.body.classList.toggle(
    "emergency",
    isRelevantView && isEmergencySelected
  );
}
  
  document.addEventListener("click", function () {
  window.requestAnimationFrame(() => {
    setBodyMode();
    updateContextualAbbreviations();
  });
});

  document.addEventListener("toggle", function () {
    window.requestAnimationFrame(updateContextualAbbreviations);
  }, true);
  function showMainView(name) {
    Object.keys(views).forEach((key) => {
      if (views[key]) views[key].hidden = key !== name;
    });

    document.querySelectorAll(".bottomnav__btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mainNav === name);
    });

    state.mainNav = name;
  }

  function showHsrTab(name) {
    Object.keys(hsrTabs).forEach((key) => {
      if (hsrTabs[key]) hsrTabs[key].hidden = key !== name;
    });

    document.querySelectorAll("[data-hsr-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.hsrTab === name);
    });

    state.hsrTab = name;
  }


  function defaultAcutePattern(severity) {
    if (severity === "moderate") return "moderate_urticaria";
    if (severity === "severe") return "severe_anaphylaxis";
    return "mild_general";
  }

  function setSegment(seg, value) {
    state[seg] = value;

    if (seg === "acuteSeverity") {
      state.acutePattern = defaultAcutePattern(value);
    }

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
    const outputCard = flowOutput ? flowOutput.closest(".card") : null;
    const hasCaseSelection = Boolean(state.situation && state.reaction);

    if (outputCard) outputCard.hidden = !hasCaseSelection;
    if (!hasCaseSelection) {
      if (flowOutput) flowOutput.innerHTML = "";
      if (flowSafety) flowSafety.textContent = t("flow_safety");
      return;
    }

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


  function renderAcuteList(items) {
    return `<ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderAcuteManagement() {
    const contentByPattern = t("acute_content");
    if (!contentByPattern[state.acutePattern]) {
      state.acutePattern = defaultAcutePattern(state.acuteSeverity);
    }

    document.querySelectorAll('.seg__btn[data-seg="acuteSeverity"]').forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === state.acuteSeverity);
    });

    document.querySelectorAll('.seg__btn[data-seg="acutePattern"]').forEach((btn) => {
      const isVisible = btn.dataset.acuteSeverity === state.acuteSeverity;
      btn.hidden = !isVisible;
      btn.classList.toggle("active", isVisible && btn.dataset.value === state.acutePattern);
    });

    if (acuteImmediateOutput) {
  const immediateActions = t("acute_immediate_actions") || [];
  const intro = immediateActions[0] || "";
  const actions = immediateActions.slice(1);

  acuteImmediateOutput.innerHTML = `
    ${intro ? `<div>${escapeHtml(intro)}</div>` : ""}
    ${renderAcuteList(actions)}
  `;
}

    if (!acuteOutput) return;

    const content = contentByPattern[state.acutePattern];
    const warning = content.warning
      ? `<div><strong>${escapeHtml(t("acute_warning_label"))}:</strong> ${escapeHtml(content.warning)}</div>`
      : "";
    const escalation = (content.escalation || []).length
      ? renderAcuteList(content.escalation)
      : "";
    const arrest = (content.arrest || []).length
      ? `
        <div>
<strong>${escapeHtml(t("acute_arrest_title"))}:</strong>
${renderAcuteList(content.arrest)}
        </div>
      `
      : "";

    acuteOutput.innerHTML = `
      <div>
        <strong>${escapeHtml(t("acute_section_clinical"))}</strong>
        <div>${escapeHtml(content.clinical)}</div>
        ${warning}
      </div>
      <div>
        <strong>${escapeHtml(t("acute_section_management"))}</strong>
        ${renderAcuteList(content.management)}
      </div>
      <div>
        <strong>${escapeHtml(t("acute_section_escalation"))}</strong>
        ${escalation}
        ${arrest}
      </div>
      <div class="hint">
        <strong>${escapeHtml(t("acute_dose_reference_title"))}:</strong> ${escapeHtml(t("acute_dose_reference_note"))}
      </div>
    `;
  }

  function fillSwitchPrinciples() {
    const items = [
      t("switch_status_optional"),
      t("switch_cmsc"),
      t("switch_cr_structure"),
      t("switch_cr_frequency"),
      t("switch_best_option")
    ];
    const html =
      `<ul>${items.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` +
      `<div class="hint">${escapeHtml(t("switch_brand_governance"))}</div>`;
    const top = document.getElementById("switchNonvalidated");
    const safety = document.getElementById("switchSafety");
    if (top) top.innerHTML = html;
    if (safety) safety.innerHTML = html;
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

    const baselineRaw = document.getElementById("baseline")?.value?.trim() ?? "";
    const acuteRaw = document.getElementById("acute")?.value?.trim() ?? "";

    if (baselineRaw === "" || acuteRaw === "") {
      tryptaseOutput.innerHTML = `<div class="hint">${escapeHtml(t("tryptase_invalid"))}</div>`;
      return;
    }

    const baseline = Number(baselineRaw);
    const acute = Number(acuteRaw);

    if (!Number.isFinite(baseline) || !Number.isFinite(acute) || baseline < 0 || acute < 0) {
      tryptaseOutput.innerHTML = `<div class="hint">${escapeHtml(t("tryptase_invalid"))}</div>`;
      return;
    }

    const threshold = (1.2 * baseline) + 2;
    const significant = acute >= threshold;

    tryptaseOutput.innerHTML = `
      <div><strong>${escapeHtml(t("tryptase_threshold"))}:</strong> ${fmt(threshold)} ng/mL</div>
      <div><strong>${escapeHtml(t("tryptase_acute"))}:</strong> ${fmt(acute)} ng/mL</div>
      <div><strong>${escapeHtml(t("tryptase_baseline"))}:</strong> ${fmt(baseline)} ng/mL</div>
      <div class="hint" style="margin-top:10px">${escapeHtml(t("tryptase_formula"))}</div>
      <div style="margin-top:10px"><strong>${escapeHtml(significant ? t("tryptase_positive") : t("tryptase_negative"))}</strong></div>
      <div class="hint" style="margin-top:10px">${escapeHtml(t("tryptase_note"))}</div>
    `;

    tryptaseOutput.dataset.ready = "1";
  }

  function renderNihr() {
    if (!nihrOutput) return;

    const outputCard = nihrOutput.closest(".card");
    const hasCaseSelection = Boolean(
      state.nihrSeverity && state.nihrCmtype && state.nihrCulpritKnown
    );

    if (outputCard) outputCard.hidden = !hasCaseSelection;
    if (!hasCaseSelection) {
      nihrOutput.innerHTML = "";
      return;
    }

    const hasDangerSigns = Array.from(document.querySelectorAll(".nihr-check")).some((el) => el.checked);
    const severity = state.nihrSeverity;
    const mildValid = severity === "mild" && !hasDangerSigns;
    const moderateValid = severity === "moderate" && !hasDangerSigns;
    const scarValid = severity === "severe" && hasDangerSigns;

    const renderNihrList = (items) =>
      `<ul>${(items || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;

    const adviceItems = () => {
      const items = [t("nihr_apply_advice")];
      if (state.nihrCulpritKnown === "known") items.push(t("nihr_choose_different"));
      return items;
    };

    const followUpItems = [
      t("nihr_observe"),
      t("nihr_written"),
      t("nihr_recurrence"),
      t("nihr_preventive_alt"),
      t("nihr_preventive_never_deny"),
      t("nihr_footnote_crossreact")
    ];

    if (mildValid) {
      nihrOutput.innerHTML = `
        <div><strong>${escapeHtml(t("nihr_status_mild"))}</strong></div>
        <div>
          <strong>${escapeHtml(t("nihr_recommended_actions"))}</strong>
          ${renderNihrList([
            t("nihr_mild_interview"),
            t("nihr_mild_refer"),
            t("nihr_optimize_ehr"),
            ...adviceItems(),
            ...followUpItems
          ])}
        </div>
      `;
      return;
    }

    if (moderateValid) {
      nihrOutput.innerHTML = `
        <div><strong>${escapeHtml(t("nihr_status_moderate"))}</strong></div>
        <div>
          <strong>${escapeHtml(t("nihr_recommended_actions"))}</strong>
          ${renderNihrList([
            t("nihr_moderate_refer"),
            t("nihr_optimize_ehr"),
            ...adviceItems(),
            ...followUpItems
          ])}
        </div>
      `;
      return;
    }

    if (scarValid) {
      const classRule =
        state.nihrCmtype === "gbca"
          ? t("nihr_scar_gbca_rule")
          : state.nihrCmtype === "unknown"
            ? t("nihr_scar_unknown_rule")
            : t("nihr_scar_icm_rule");

      nihrOutput.innerHTML = `
        <div><strong>${escapeHtml(t("nihr_status_scar"))}</strong></div>
        <div>
          <strong>${escapeHtml(t("nihr_recommended_actions"))}</strong>
          ${renderNihrList([
            t("nihr_scar_refer"),
            t("nihr_scar_choose_imaging"),
            t("nihr_scar_ehr"),
            t("nihr_scar_do_not_give")
          ])}
        </div>
        <div>
          <strong>${escapeHtml(t("nihr_class_specific_rule"))}</strong>
          ${renderNihrList([classRule])}
        </div>
      `;
      return;
    }

    nihrOutput.innerHTML = `<div>${escapeHtml(t("nihr_scope_guard"))}</div>`;
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
      if (!search) return true;
      return flattenChangeText(change).includes(search);
    });
  }

  function renderChangeSection(section, extraClass = "") {
    const classes = ["change-section"];
    if (section.variant === "action") classes.push("change-section--action");
    if (section.variant === "impact") classes.push("change-section--impact");
    if (extraClass) classes.push(extraClass);

    const paragraphs = (section.paragraphs || [])
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");

    const bullets = (section.bullets || []).length
      ? `<ul>${section.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
      : "";

    return `
      <section class="${classes.join(" ")}">
        <div class="change-section__label">${escapeHtml(section.label)}</div>
        <div class="change-section__content">
          ${paragraphs}
          ${bullets}
        </div>
      </section>
    `;
  }

  function renderNestedItem(item) {
    return `
      <details class="change-nested__item">
        <summary class="change-nested__head">
          <span class="change-nested__title">${escapeHtml(item.title)}</span>
          ${iconSvg("chevron", "change-nested__chevron")}
        </summary>
        <div class="change-nested__body">
          ${(item.sections || []).map((section) => renderChangeSection(section)).join("")}
        </div>
      </details>
    `;
  }

  function renderRefs(refs) {
    if (!(refs || []).length) return "";
    return `
      <details class="change-sources">
        <summary class="change-sources__summary">
          <span>${escapeHtml(t("changes_sources_label"))}</span>
          ${iconSvg("chevron", "change-sources__chevron")}
        </summary>
        <div class="change-card__refs">
          ${refs.map((ref) => `<span class="change-ref">${escapeHtml(ref)}</span>`).join("")}
        </div>
      </details>
    `;
  }

  function renderChangeTopic(change) {
    const isSelected = change.id === state.selectedChangeId;
    return `
      <button
        class="change-topic ${isSelected ? "active" : ""}"
        type="button"
        data-change-topic="${escapeHtml(change.id)}"
        aria-current="${isSelected ? "true" : "false"}"
      >
        <span class="change-topic__icon">${iconSvg(change.icon, "change-topic__svg")}</span>
        <span class="change-topic__title">${escapeHtml(change.title)}</span>
        <span
          class="change-topic__level change-topic__level--${escapeHtml(change.level)}"
          title="${escapeHtml(levelLabel(change.level))}"
          aria-label="${escapeHtml(levelLabel(change.level))}"
        ></span>
      </button>
    `;
  }

  function renderCompareBody(change) {
    const block = change.compare || {};
    const sections = block.sections || [];
    const primary = sections.filter((section) => section.variant !== "impact");
    const impact = sections.filter((section) => section.variant === "impact");
    const firstTwo = primary.slice(0, 2);
    const remaining = primary.slice(2);
    const nested = (block.nested || []).length
      ? `
        <details class="change-compare-details">
          <summary class="change-compare-details__summary">
            <span>${escapeHtml(t("changes_compare_details_label"))}</span>
            ${iconSvg("chevron", "change-compare-details__chevron")}
          </summary>
          <div class="change-compare-details__body">
            ${block.nested.map(renderNestedItem).join("")}
          </div>
        </details>
      `
      : "";

    return `
      <div class="change-compare-grid">
        ${firstTwo.map((section) => renderChangeSection(section, "change-section--compare")).join("")}
      </div>
      ${remaining.map((section) => renderChangeSection(section)).join("")}
      ${impact.map((section) => renderChangeSection(section, "change-section--impact-full")).join("")}
      ${nested}
      ${renderRefs(block.refs || [])}
    `;
  }

  function renderActionBody(change) {
    const block = change.action || {};
    const sections = (block.sections || []).map((section) => renderChangeSection(section)).join("");
    const nested = (block.nested || []).length
      ? `<div class="change-nested">${block.nested.map(renderNestedItem).join("")}</div>`
      : "";

    return `
      ${sections}
      ${nested}
      ${renderRefs(block.refs || [])}
    `;
  }

  function renderChangeDetail(change) {
    const body = state.changesMode === "action"
      ? renderActionBody(change)
      : renderCompareBody(change);

    return `
      <article class="change-detail-card" data-change-card="${escapeHtml(change.id)}">
        <header class="change-detail__header">
          <div class="change-detail__titleline">
            ${iconSvg(change.icon, "change-detail__icon")}
            <div>
              <h2 class="change-detail__title">${escapeHtml(change.title)}</h2>
              <p class="change-detail__summary">${escapeHtml(change.summary)}</p>
            </div>
          </div>
        </header>

        <div class="abbr-slot abbr-slot--change" id="changeAbbreviations"></div>

        <div class="change-detail__mode" role="group" aria-label="${escapeHtml(t("changes_mode_label"))}">
          <button
            class="change-detail__mode-btn ${state.changesMode === "compare" ? "active" : ""}"
            type="button"
            data-change-mode="compare"
          >${escapeHtml(t("changes_mode_compare"))}</button>
          <button
            class="change-detail__mode-btn ${state.changesMode === "action" ? "active" : ""}"
            type="button"
            data-change-mode="action"
          >${escapeHtml(t("changes_mode_action"))}</button>
        </div>

        <div class="change-detail__body">
          ${body}
        </div>
      </article>
    `;
  }

  function updateChangeControlButtons() {
    if (changesSearchInput && changesSearchInput.value !== state.changesSearch) {
      changesSearchInput.value = state.changesSearch;
    }
  }

  function attachChangeEvents() {
    document.querySelectorAll("[data-change-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedChangeId = btn.dataset.changeTopic;
        renderChanges();
      });
    });

    document.querySelectorAll("[data-change-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.changesMode = btn.dataset.changeMode;
        renderChanges();
      });
    });
  }

  function renderChanges() {
    if (!changesSummaryGrid || !changesList) return;

    updateChangeControlButtons();

    const visible = getVisibleChanges();

    if (!visible.length) {
      changesSummaryGrid.innerHTML = "";
      changesList.innerHTML = `<div class="change-empty">${escapeHtml(t("changes_no_search_results"))}</div>`;
      return;
    }

    if (!state.selectedChangeId || !visible.some((change) => change.id === state.selectedChangeId)) {
      state.selectedChangeId = visible[0].id;
    }

    const selected = visible.find((change) => change.id === state.selectedChangeId) || visible[0];

    changesSummaryGrid.innerHTML = visible.map(renderChangeTopic).join("");
    changesList.innerHTML = renderChangeDetail(selected);

    attachChangeEvents();
    updateContextualAbbreviations();
  }

  function renderAll() {
  setBodyMode();

  applyStaticTranslations();
  renderFlow();
  renderAcuteManagement();
  renderSwitch();
  renderTryptase();
  renderNihr();
  renderChanges();
  updateContextualAbbreviations();
}

  function refreshComputedModulesAfterLanguageChange() {
    const baselineVal = document.getElementById("baseline")?.value ?? "";
    const acuteVal = document.getElementById("acute")?.value ?? "";
    if (baselineVal !== "" && acuteVal !== "") {
      calcTryptase();
    } else {
      renderTryptase();
    }

    renderNihr();
    renderChanges();
    updateContextualAbbreviations();
  }

  function clearButtons(seg) {
    document.querySelectorAll(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      btn.classList.remove("active");
    });
  }

  function resetAll() {
    state.mainNav = "hsr";
    state.hsrTab = "guidance";

    state.situation = null;
    state.reaction = null;
    state.cmtype = "icm";
    state.nihrCmtype = null;
    state.nihrSeverity = null;
    state.nihrCulpritKnown = null;
    state.acuteSeverity = "mild";
    state.acutePattern = "mild_general";
    state.icm = null;
    state.gbca = null;



    state.changesMode = "compare";
    state.changesSearch = "";
    state.selectedChangeId = null;

    document.body.classList.remove("emergency");

    const defaults = {
      situation: null,
      reaction: null,
      cmtype: "icm",
      nihrCmtype: null,
      nihrSeverity: null,
      nihrCulpritKnown: null,
      acuteSeverity: "mild",
      acutePattern: "mild_general",
    };

    Object.keys(defaults).forEach((seg) => {
      document.querySelectorAll(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === defaults[seg]);
      });
    });

    clearButtons("icm");
    clearButtons("gbca");

    document.querySelectorAll("[data-hsr-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.hsrTab === "guidance");
    });


    document.querySelectorAll(".bottomnav__btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mainNav === "hsr");
    });

    const idsToClear = [
      "baseline",
      "acute",
      "changesSearch"
    ];

    idsToClear.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    document.querySelectorAll(".nihr-check").forEach((el) => (el.checked = false));

    if (tryptaseOutput) {
      delete tryptaseOutput.dataset.ready;
      tryptaseOutput.innerHTML = "";
    }

    showMainView("hsr");
    showHsrTab("guidance");
    setBodyMode();
    renderAll();
  }
const stickyDisclaimer = document.getElementById("stickyDisclaimer");

if (stickyDisclaimer) {
  stickyDisclaimer.setAttribute("role", "button");
  stickyDisclaimer.setAttribute("tabindex", "0");
  stickyDisclaimer.setAttribute("aria-expanded", "false");

  const toggleDisclaimer = () => {
    const isOpen = stickyDisclaimer.classList.toggle("is-open");
    stickyDisclaimer.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  stickyDisclaimer.addEventListener("click", toggleDisclaimer);

  stickyDisclaimer.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDisclaimer();
    }
  });
}

  // Main nav
  document.querySelectorAll(".bottomnav__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showMainView(btn.dataset.mainNav);
    });
  });

  // HSR subnav
  document.querySelectorAll("[data-hsr-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showHsrTab(btn.dataset.hsrTab);
    });
  });

  // Generic segment buttons
  [
    "situation",
    "reaction",
    "cmtype",
    "nihrCmtype",
    "nihrSeverity",
    "nihrCulpritKnown",
    "acuteSeverity",
    "acutePattern",
  ].forEach((seg) => {
    document.querySelectorAll(`.seg__btn[data-seg="${seg}"]`).forEach((btn) => {
      btn.addEventListener("click", () => setSegment(seg, btn.dataset.value));
    });
  });

  // ICM/GBCA group selectors
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

  // Practice Changes search; topic and local mode controls are attached after each render.
  if (changesSearchInput) {
    changesSearchInput.addEventListener("input", (event) => {
      state.changesSearch = event.target.value || "";
      renderChanges();
    });
  }

  // Tryptase calculator
  const calcBtn = document.getElementById("calcTryptase");
  if (calcBtn) {
    calcBtn.addEventListener("click", () => {
      calcTryptase();
      updateContextualAbbreviations();
    });
  }



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
      refreshComputedModulesAfterLanguageChange();
    });
  }

  if (langDe) {
    langDe.addEventListener("click", () => {
      state.lang = "de";
      langDe.classList.add("active");
      if (langEn) langEn.classList.remove("active");
      renderAll();
      refreshComputedModulesAfterLanguageChange();
    });
  }

  showMainView("hsr");
  showHsrTab("guidance");
  setBodyMode();
  renderAll();
});
