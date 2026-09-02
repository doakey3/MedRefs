var baseline_ecg = "obtain baseline preoperative ECG";
var obtain_echo = "obtain peroperative echocarcardiogram";
var ok_to_surgery = "The patient may proceed to surgery.";

var not_ok_to_surgery = "The patient should undergo further evaluation prior to surgery."

var logic_map = {
    // DISPLAY
    "show_mace_children": {
        "targets": get_children_question_ids("risk_of_mace"),
        "logic": {
            "mace_1": ["greater_than_or_equal_to_1_percent"]
        }
    },
    
    
    "show_further_testing": {
        "targets": get_children_question_ids("functional_capacity"),
        "logic": {
            "functional_capcity_1": ["unknown_mets", "less_than_4_mets"]
        }
    },
    
    
    "show_able_to_exercise": {
        "targets": ["able_to_do_exercise"],
        "logic": {
            "no_high_risk_0": get_children_ids("very_high_cardiac_risk"),
            "testing_worthwhile_1": ["testing_worthwhile"]
        }
    },
    
    "show_echocardiogram_in_last_year": {
        "targets": get_children_question_ids("left_ventricular_dysfunction"),
        "logic": {
            "hx_of_lv_dysfxn_1": ["stable_but_hx_of_lv_dsfxn"]
        }
    },
    
    "show_caprini_risk2": {
        "targets": ["vte_risk"],
        "logic": {
            "serm_at_least_1": ["raloxifene_use", "tamoxifen_use"],
            "mace_high_1": ["greater_than_or_equal_to_1_percent"]
        }
    },
    
    "show_caprini_risk": {
        "targets": ["vte_risk"],
        "logic": {
            "estrogen_at_least_1": ["combined_oc_use", "estrogen_use"]
        }
    },
    
    "show_has_breast_cancer": {
        "targets": ["has_breast_cancer"],
        "logic": {
            "serm_at_least_1": ["raloxifene_use", "tamoxifen_use"],
            "caprini_high_1": ["caprini_high"]
        }
    },
    
    // STATEMENTS
    "one_or_more_high_risk_cardiac_conditions": {
        "statement": "The patient has one or more high risk cardiac conditions including:",
        "method": "and",
        "appendage": ".",
        "conjunction": get_id_dict("very_high_cardiac_risk")
    },
    
    
    "no_high_risk_cardiac_conditions": {
        "statement": "The patient does not have any high risk cardiac conditions.",
        "logic": {
            "high_risk_0": get_children_ids("very_high_cardiac_risk"),
            "mace_at_least_1": get_children_ids("risk_of_mace")
        }
    },
    
    "risk_of_mace": {
        "statement": "The patient's risk of MACE is",
        "appendage": "according to the NSQIP calculator.",
        "conjunction": get_id_dict("risk_of_mace")
    },
    
    "functional_capacity": {
        "statement": "The patient's functional capacity is",
        "appendage": ".",
        "conjunction": get_id_dict("functional_capacity")
    },
    
    "further_testing_worthwhile": {
        "statement": "",
        "conjunction": get_id_dict("testing_worthile_question")
    },
    
    "able_to_exercise_stress_test": {
        "statement": "",
        "conjunction": get_id_dict("able_to_do_exercise")
    },
    
    "other_cardiac_risk_factors": {
        "statement": "The patient has one or more moderate cardiac risk factors including:",
        "method": "and",
        "appendage": ".",
        "conjunction": get_id_dict("other_cardiac_risk_factors")
    },
    
    "lv_dysfunction": {
        "statement": "The patient has",
        "appendage": ".",
        "method": "and",
        "conjunction": get_id_dict("left_ventricular_dysfunction")
    },
    
    "yes_echo": {
        "statement": get_statement("echo_in_last_year"),
        "logic": {
            "echo_1": ["echo_in_last_year"]
        }
    },
    
    "no_echo": {
        "statement": get_statement("no_echo_in_last_year"),
        "logic": {
            "no_echo_1": ["no_echo_in_last_year"]
        }
    },
    
    "cied_present": {
        "statement": "The patient has a CIED.",
        "logic": {
            "has_cied_1": ["has_cied"],
        }
    },
    
    "pulmonary_hypertension_present": {
        "statement": "The patient has a known diagnosis of pulmonary hypertension.",
        "logic": {
            "pulm_htn_1": ["pulmonary_hypertension"],
        }
    },
    
    "recent_surgery": {
        "statement": "The patient has had a",
        "method": "and",
        "appendage": ".",
        "conjunction": get_id_dict("recent_cv_surgery")
    },
    
    "possibly_pregnant": {
        "statement": get_statement("possibly_pregnant"),
        "logic": {
            "poss_preg_1": ["possibly_pregnant"]
        }
    },
    
    "smokes_tobacco": {
        "statement": get_statement("smokes_tobacco"),
        "logic": {
            "smokes_1": ["smokes_tobacco"]
        }
    },
    
    "medication_use": {
        "statement": "The patient uses",
        "appendage": ".",
        "method": "and",
        "conjunction": get_id_dict("medications")
    },
    
    "caprini_score": {
        "statement": "",
        "conjunction": get_id_dict("vte_risk")
    },
    
    "has_breast_cancer": {
        "statement": "",
        "conjunction": get_id_dict("has_breast_cancer")
    },
    
    "herb_use": {
        "statement": "The patient uses",
        "appendage": ".",
        "method": "and",
        "conjunction": get_id_dict("is_using_herbals")
    },
    
    "ok_to_surgery": {
        "statement": ok_to_surgery,
        "logic": {
            "no_high_risk_0": get_children_ids("very_high_cardiac_risk"),
            "mace_at_least_1": get_children_ids("risk_of_mace"),
            "enough_mets_0": ["unknown_mets", "less_than_4_mets"]
        }
    },
    
    "ok_to_surgery2": {
        "statement": ok_to_surgery,
        "logic": {
            "no_high_risk_0": get_children_ids("very_high_cardiac_risk"),
            "mace_at_least_1": get_children_ids("risk_of_mace"),
            "not_enough_mets_1": ["unknown_mets", "less_than_4_mets"],
            "further_testing_worthless_1": ["testing_not_worthwhile"]
        }
    },
    
    "not_ok_to_surgery": {
        "statement": not_ok_to_surgery,
        "logic": {
            "high_risk_at_least_1": get_children_ids("very_high_cardiac_risk"),
        }
    },
    
    "not_ok_to_surgery2": {
        "statement": not_ok_to_surgery,
        "logic": {
            "no_high_risk_0": get_children_ids("very_high_cardiac_risk"),
            "mace_at_least_1": get_children_ids("risk_of_mace"),
            "not_enough_mets_1": ["unknown_mets", "less_than_4_mets"],
            "further_testing_worthwhile_1": ["testing_worthwhile"]
        }
    },
    
    // BULLETS
    "consult_cv_for_high_risk": {
        "bullet": "consult cardiology for further evaluation and treatment",
        "logic": {
            "has_high_risk_at_least_1": get_children_ids("very_high_cardiac_risk")
        }
    },
    
    "obtain_exercise_stress_test": {
        "bullet": "obtain an exercise stress test",
        "logic": {
            "able2exrcz_1": ["able_to_exercise"]
        }
    },
    
    "obtain_pharmacologic_stress_test": {
        "bullet": "obtain a pharmacologic stress test",
        "logic": {
            "ntable2exrcz_1": ["not_able_to_exercise"]
        }
    },
    
    "consult_cv_for_cied": {
        "bullet": "consult cardiology to plan perioperative management of the patient's CIED",
        "logic": {
            "has_cied_1": ["has_cied"]
        }
    },
    
    "obtain_baseline_ecg": {
        "bullet": baseline_ecg,
        "logic": {
            "other_cardiac_rfs_at_least_1": get_children_ids("other_cardiac_risk_factors"),
            "mace_1": ["greater_than_or_equal_to_1_percent"]
        }
    },
    
    "obtain_baseline_ecg2": {
        "bullet": baseline_ecg,
        "logic": {
            "at_least_1": ["significant_arrhythmia", "antipsychotic_use"]
        }
    },
    
    "delay_14_days": {
        "bullet": "delay surgery at least until 14 days have passed since the balloon angioplasty",
        "logic": {
            "recent_balloon_angioplasty_1": ["recent_balloon_angioplasty"]
        }
    },
    
    "delay_30_days": {
        "bullet": "delay surgery at least until 30 days have passed since the BMS implantation",
        "logic": {
            "recent_bms_1": ["recent_bms_implantation"]
        }
    },
    
    "delay_365_days": {
        "bullet": "delay surgery at least until 365 days have passed since the DES was placed. A delay of 180 days may be considered if the benefits of surgery outweigh the risks, but dual antiplatelet therapy should only be held perioperatively for urgent surgeries in which the risk of bleeding outweighs the risk of thrombosis.",
        "logic": {
            "recent_des_placement_1": ["recent_des_placement"]
        }
    },
    
    "consult_pulm_for_phtn": {
        "bullet": "refer to a pulmonary hypertension specialist if time allows",
        "logic": {
            "pulm_htn_1": ["pulmonary_hypertension"],
            "mace_1": ["greater_than_or_equal_to_1_percent"]
        }
    },
    
    "get_echo_2a": {
        "bullet": obtain_echo,
        "logic": {
            "doe_or_worsening_at_least_1": ["dyspnea_of_unknown_origin", "hf_and_worsening"]
        }
    },
    
    "get_echo_2b": {
        "bullet": obtain_echo,
        "logic": {
            "hx_of_dysfxn_1": ["stable_but_hx_of_lv_dsfxn"],
            "no_echo_in_year_1": ["no_echo_in_last_year"],
            "no_obvious_reason_0": ["dyspnea_of_unknown_origin", "hf_and_worsening"]
        }
    },
    
    "get_preggo_test": {
        "bullet": "check a preoperative serum pregnancy test",
        "logic": {
            "poss_preg_1": ["possibly_pregnant"]
        }
    },
    
    "stop_smoking": {
        "bullet": "recommend tobacco cessation, ideally at least 8 weeks prior to surgery",
        "logic": {
            "smokes_1": ["smokes_tobacco"]
        }
    },
    
    "taper_weeks_prior": {
        "bullet": "taper then stop the",
        "method": "and",
        "appendage": "several weeks prior to surgery",
        "conjunction": {
            "valerian_use": "valerian"
        }
    },
    
    "hold_oc_4_weeks_prior": {
        "bullet": "hold the combined oral contraceptive 4 weeks prior to surgery",
        "logic": {
            "caprini_high_1": ["caprini_high"],
            "combined_oc_1": ["combined_oc_use"],
        }
    },
    
    "hold_ht_2_weeks_prior": {
        "bullet": "hold the estrogen 2 weeks prior to surgery",
        "logic": {
            "caprini_high_1": ["caprini_high"],
            "estrogen_use_1": ["estrogen_use"],
        }
    },
    
    "hold_tamoxifen_2_weeks_prior": {
        "bullet": "hold the tamoxifen 2 weeks prior to surgery",
        "logic": {
            "tamoxifen_1": ["tamoxifen_use"],
            "vte_high_risk_1": ["caprini_high"],
            "has_breast_cancer_0": ["hx_of_breast_cancer", "breast_cancer"]
        }
    },
    
    "hold_7_days_prior": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "7 days prior to surgery",
        "conjunction": {
            "garlic_use": "garlic",
            "ginseng_use": "ginseng",
        }
    },
    
    "hold_5_days_prior": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "5 days prior to surgery",
        "conjunction": {
            "st_johns_wort_use": "St John's Wort",
        }
    },
    
    "hold_raloxifene_3_days_prior": {
        "bullet": "hold the raloxifene 3 days prior to surgery",
        "logic": {
            "raloxifene_1": ["raloxifene_use"],
            "vte_high_risk_1": ["caprini_high"],
            "mace_high_1": ["greater_than_or_equal_to_1_percent"],
            "has_no_breast_cancer_1": ["no_breast_cancer"]
        }
    },
    
    "hold_3_days_prior_to_surgery": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "72 hours prior to surgery",
        "conjunction": {
            "non_ibuprofen_nsaid_use": "non-ibuprofen NSAID"
        }
    },
    
    "hold_36_hours_prior_to_surgery": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "36 hours prior to surgery",
        "conjunction": {
            "ginkgo_use": "ginkgo"
        }
    },
    
    "hold_24_hours_prior_to_surgery": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "24 hours prior to surgery",
        "conjunction": {
            "ibuprofen_use": "ibuprofen",
            "metformin_use": "metformin",
            "ephedra_use": "ephedra",
            "kava_use": "kava",
        }
    },
    
    "hold_day_before": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "on the day before surgery.",
        "conjunction": {
            "non_statins_use": "non-statin hypolipidemic agent(s)"
        }
    },
    
    "hold_evening_before": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "on the evening before surgery.",
        "conjunction": {
            "theophylline_use": "theophylline"
        }
    },
    
    "hold_morning_of_surgery": {
        "bullet": "hold the",
        "method": "and",
        "appendage": "on the morning of surgery", // to prevent hypotension
        "conjunction": {
            "acei_use": "ACE-i",
            "arb_use": "ARB",
            "diuretic_use": "diuretic(s)",
            "bisphosphonate_use": "bisphosphonate",
            "psychostimulant_use": "psychostimulant",
            "colchicine_use": "colchicine",
            "sulfonylurea_use": "sulfonylurea",
            "thiazolidinedione_use": "thiazolidinedione",
            "dpp4i_use": "DPP4-i",
            "glp1_a_use": "GLP-1 agonist"
        }
    },
    
    "discontinue_prior_to_surgery": {
        "bullet": "discontinue the",
        "method": "and",
        "appendage": "prior to surgery",
        "conjunction": {
            "naltrexone_use": "naltrexone"
        }
    },
    
    "consult_oncology_for_serm": {
        "bullet": "consult oncology for management of the patient's selective estrogen receptor modulator perioperatively",
        "logic": {
            "serm_at_least_1": ["raloxifene_use", "tamoxifen_use"],
            "vte_high_risk_1": ["caprini_high"],
            "has_breast_cancer_1": ["hx_of_breast_cancer", "breast_cancer"]
        }
    },
    
    "defer_to_surgery": {
        "bullet": "defer to surgery to decide whether to hold or continue the",
        "method": "and",
        "appendage": "perioperatively.",
        "conjunction": {
            "aspirin": "aspirin",
            "warfarin": "warfarin",
            "factor_xa_inhibitor": "factor Xa inhibitor",
            "dabigatran": "dabigatran",
            "clopidogrel": "clopidogrel",
            "ticlopidine": "ticlopidine",
            "prasugrel": "prasugrel"
        }
    },
    
    "consult_psychiatry_for_maoi": {
        "bullet": "consult psychiatry and anesthesiology for management of the patient's MAOI perioperatively",
        "logic": {
            "maoi_use_1": ["maoi_use"]
        }
    },
    
    "consult_psychiatry_for_antipsychotic": {
        "bullet": "consult psychiatry for management of the patient's antipsychotic perioperatively",
        "logic": {
            "antipsychotic_use_1": ["antipsychotic_use"]
        }
    },
}
