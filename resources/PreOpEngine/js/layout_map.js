raloxifene_info = "<h1>Selective Estrogen Receptor Modulator Use Near Surgery with Breast Cancer</h1><p>SERMs can be continued without interruption for low- and moderate-risk surgeries while providing appropriate VTE prophylaxis.</p><p>For surgeries with a high-risk of VTE, our approach depends upon the specific SERM and the indication for its use.</p><p>For patients taking a SERM (eg, tamoxifen) for breast cancer treatment, the decision to discontinue is more difficult, and consultation with an oncologist is recommended. We typically recommend continuing SERMs in this setting while providing appropriate VTE prophylaxis.<sup>[UTD_Drugs]</sup></p>";
var layout_map = {
    "very_high_cardiac_risk": {
        "title": "Very High Cardiac Risk",
        "mode": "checkbox",
        "info": "<h1>Very high risk</h1><p>Patients with recent MI (60 days) or unstable angina, decompensated heart failure, high-grade arrhythmias, or hemodynamically important valvular heart disease (aortic stenosis in particular) are at very high risk for perioperative MI, heart failure, ventricular fibrillation or primary cardiac arrest, complete heart block, and cardiac death. All such patients should be optimally treated, with possible referral to a cardiologist for further evaluation and management. <sup>[UTD]</sup></p>",
        "items": {
            "mi_in_last_60": {
                "display_text": "MI in the last 60 days"
            },
            "unstable_angina": {
                "display_text": "unstable angina",
                "info": "<h1>Unstable Angina</h1><p>CCS III angina or worse. (Unable to climb a flight (~14 steps) of stairs without chest discomfort.)</p>"
            },
            "uncompensated_heart_failure": {
                "display_text": "uncompensated heart failure",
                "info": "<h1>Uncompensated Heart Failure</h1><p>NYHA IV or new onset heart failure.</p>"
            },
            "significant_arrhythmia": {
                "display_text": "significant arrhythmia",
                "info": "<h1>Significant Arrhythmia</h1><ul><li>High-grade atrioventricular block</li><li>Mobitz II atrioventricular block</li><li>Third degree atrioventricular block</li><li>Symptomatic ventricular arrhythmias</li><li>Supraventricular arrhythmias (including atrial fibrillation) with an uncontrolled ventricular rate &gt; 100 bpm at rest.</li><li>Symptomatic bradycardia</li><li>Newly recognized ventricular tachycardia</li></ul><sup>[AHA2009]</sup>",
                "bullet_checked": "plan to obtain a baseline preoperative ECG"
            },
            "valvular_heart_disease": {
                "display_text": "suspected moderate or greater degree of valvular heart disease",
                "info": "<h1>Valvular Disease</h1><p>It is recommended that patients with clinically suspected moderate or greater degrees of valvular stenosis or regurgitation undergo preoperative echocardiography if there has been either 1) no prior echocardiography within 1 year or 2) a significant change in clinical status or physical examination since last evaluation. (Class I)<sup>[AHA]</sup>.</p><p>Severe aortic stenosis is particularly dangerous.<sup>[UTD]</sup></p><p>A cardiologist should evaluate whether or not the patient should have the valve treated prior to surgery. (LOE C)<sup>[AHA]</sup></p><p>If the patient is asymptomatic, then the cardiologist may elect to have the patient proceed even with severe valvular disease (Class IIa &amp; IIb depending on the valvular disease type).<sup>[AHA]</sup>"
            }
        }
    },
    
    "risk_of_mace": {
        "title": "The patient's risk of MACE using the <a href='https://riskcalculator.facs.org/RiskCalculator/'>NSQIP</a>",
        "mode": "radiobox",
        "info": "<h1>Risk of Major Adverse Cardiovascular Event</h1><p>Use the American College of Surgeons NSQIP risk calculator to estimate surgical risk.</p>",
        "items": {
            "less_than_1_percent": {"display_text": "< 1%"},
            "greater_than_or_equal_to_1_percent": {"display_text": ">= 1%"}
        }
    },
    
    "functional_capacity": {
        "title": "The patient's functional capacity is",
        "mode": "radiobox",
        "parent": "risk_of_mace",
        "info": "<h1>Metabolic Equivalent of Task</h1><p>4 METs is roughly equivalent to:</p><ul><li>Having sex</li><li>climbing 1 flight of stairs (about 14 steps)</li><li>Golf, bowling, dancing, doubles tennis, walking up a hill, throwing a baseball or football</li><li>Walking 4 miles per hour across the long length of a football field</li><li>Yard work such as raking leaves, weeding, and pushing a power mower.</ul><sup>[FamPrac]</sup><p>In those patients with unknown functional capacity, exercise stress testing may be reasonable to perform. If the stress test is abnormal, consider coronary angiography and revascularization depending on the extent of the abnormal test.<sup>[AHA]</sup></p>",
        "items": {
            "unknown_mets": {"display_text": "unknown"},
            "less_than_4_mets": {"display_text": "< 4 METs"},
            "between_4_and_10_mets": {"display_text": "4-10 METs"},
            "greater_than_10_mets": {"display_text": "> 10 METs"}
        }
    },
    
    "testing_worthile_question": {
        "title": "Is further testing worthwhile?",
        "mode": "radiobox",
        "parent": "functional_capacity",
        "info": "<h1>Is Testing Worthwhile?</h1><p>Revascularization before noncardiac surgery is recommended in circumstances in which revascularization is indicated according to existing care practice guidelines.<sup>[AHA]</sup></p>",
        "items": {
            "testing_not_worthwhile": {"display_text": "The patient understands the increased risk of surgery and would like to proceed without delaying for further testing."},
            "testing_worthwhile": {"display_text": "The patient is uncomfortable with the risks of surgery and would be willing to undergo stress testing and coronary angiography with revascularization if indicated prior to the procedure. The patient understands that revascularization may delay the surgery by up to one year."},
        }
    },
    
    "able_to_do_exercise": {
        "title": "Is the Patient Able to do an Exercise Stress Test?",
        "mode": "radiobox",
        "parent": "testing_worthile_question",
        "items": {
            "able_to_exercise": {"display_text": "The patient would be able to complete an exercise stress test."},
            "not_able_to_exercise": {"display_text": "The patient would not be able to complete an exercise stress test."}
        },
        
    },
    
    "other_cardiac_risk_factors": {
        "title": "Other Cardiac Risk Factors",
        "mode": "checkbox",
        "parent": "risk_of_mace",
        "info": "<h1>Other Cardiac Risk Factors</h1><p>Preoperative resting 12-lead electrocardiogram (ECG) is reasonable for patients with known coronary heart disease, significant arrhythmia, peripheral arterial disease, cerebrovascular disease, or other significant structural heart disease, except for those undergoing low-risk surgery. (Class IIa).<sup>[AHA]</sup></p><p>The purpose of this ECG is to be able to compare it to an abnormal postoperative ECG<sup>[UTD]</sup></p>",
        "items": {
            "coronary_artery_disease": {"display_text": "coronary artery disease"},
            "peripheral_artery_disease": {"display_text": "peripheral artery disease"},
            "cerebrovascular_disease": {"display_text": "cerebrovascular disease"},
            "structural_heart_disease": {"display_text": "significant structural heart disease"}
        }
    },
    
    "left_ventricular_dysfunction": {
        "title": "Left Ventricular Dysfunction",
        "mode": "radiobox",
        "items": {
            "dyspnea_of_unknown_origin": {
                "display_text": "dyspnea of unknown origin",
                "info": "<h1>Dyspnea of Unknown Origin</h1><p>It is reasonable for patients with dyspnea of unknown origin to undergo preoperative evaluation of left ventricular (LV) function. (Class IIa, LOE: C). <sup>[AHA]</sup></p>"
            },
            "hf_and_worsening": {
                "display_text": "a known history of heart failure with complaint of worsening heart failure symptoms",
                "info": "<h1>Worsening Heart Failure</h1><p>It is reasonable for patients with heart failure (HF) with worsening dyspnea or other change in clinical status to undergo preoperative evaluation of LV function. (Class IIa) (LOE: C) <sup>[AHA]</sup></p>"
            },
            "stable_but_hx_of_lv_dsfxn": {
                "display_text": "a history of left ventricular dysfunction",
                "info": "<h1>LV Dysfunction = Low Ejection Fraction</h1><p>Reassessment of LV function in clinically stable patients with previously documented LV dysfunction may be considered if there has been no assessment within a year. (Class IIb) (LOE: C) <sup>[AHA]</sup></p><table><tr><td>Hyperdynamic</td><td>LVEF &ge; 70%</td><td rowspan='2' style='background-color: #48bd77; padding-left: 5px; padding-right: 5px;'>Normal</td></tr><td>Normal</td><td>LVEF 50-70%</td></tr><tr><td>Mild dysfunction</td><td>LVEF 40-49%</td><td rowspan='3' style='background-color: #ff6666; padding-left: 5px; padding-right: 5px;'>Dysfunctional</td></tr><tr><td>Moderate dysfunction</td><td>LVEF 30-39%</td></tr><tr><td>Severe Dysfunction</td><td>LVEF &lt; 30%</td></tr></table>"
            }
        }
    },
    
    "has_patient_had_echo_in_last_year": {
        "title": "Echocardiogram",
        "mode": "radiobox",
        "parent": "left_ventricular_dysfunction",
        "items": {
            "echo_in_last_year": {"display_text": "The patient has had an echocardiogram in the last year."},
            "no_echo_in_last_year": {"display_text": "The patient has not had an echocardiogram in the last year."}
        }
    },
    
    "pulmonary_hypertension_section": {
        "title": "Pulmonary Hypertension",
        "mode": "checkbox",
        "parent": "risk_of_mace",
        "info": "<h1>Pulmonary Hypertension</h1><p>NYHA class III or IV symptoms and at least 1 of the following:</p><ul><li>pulmonary artery systolic pressures > 70 mm Hg</li><li>moderate or greater right ventricular dilatation and/or dysfunction</li> <li>pulmonary vascular resistance >3 Wood units</li></ul><sup>[AHA]<p>Unless the risks of delay outweigh the potential benefits, preoperative evaluation by a pulmonary hypertension specialist before noncardiac surgery can be beneficial for patients with pulmonary hypertension, particularly for those with features of increased perioperative risk (51).* (Level of Evidence: C)<sup>[AHA]</sup></p>",
        "items": {
            "pulmonary_hypertension": {"display_text": "The patient has a known diagnosis of pulmonary hypertension."}
        }
    },
    
    "cied_present": {
        "title": "Cardiovascular Implantable Electronic Device",
        "mode": "checkbox",
        "info": "<h1>Cardiovascular Implantable Electronic Device</h1><p>Before elective surgery in a patient with a CIED, the surgical/procedure team and clinician following the CIED should communicate in advance to plan perioperative management of the CIED. (Level of Evidence: C) <sup>[AHA]</sup></p>",
        "items": {
            "has_cied": {"display_text": "The patient has a CIED."}
        }
    },
    
    "recent_cv_surgery": {
        "title": "Recent Coronary Surgery",
        "mode": "checkbox",
        "info": "<h1>Recent Coronary Intervention</h1><p>Elective noncardiac surgery should be delayed 14 days after balloon angioplasty (Level of Evidence: C) and 30 days after BMS implantation (Level of Evidence B). <sup>[AHA]</sup></p><p>Elective noncardiac surgery should optimally be delayed 365 days after drug-eluting stent (DES) implantation. (Level of Evidence: B) <sup>[AHA]</sup></p><p>Elective noncardiac surgery after DES implantation may be considered after 180 days if the risk of further delay is greater than the expected risks of ischemia and stent thrombosis. (Level of Evidence: B) <sup>[AHA]</sup></p><p>Elective noncardiac surgery should not be performed within 30 days after BMS implantation or within 12 months after DES implantation in patients in whom dual antiplatelet therapy will need to be discontinued perioperatively (99-105, 107). (Level of Evidence: B)</p>",
        "items": {
            "recent_balloon_angioplasty": {"display_text": "balloon angioplasty within the last 14 days"},
            "recent_bms_implantation": {"display_text": "bare metal stent implanted within the last 30 days."},
            "recent_des_placement": {"display_text": "drug-eluding stent placed within the last 365 days."}
        }
    },
    
    "is_the_patient_possibly_pregnant": {
        "title": "Possibly Pregnant",
        "mode": "checkbox",
        "info": "We recommend a serum pregnancy test prior to surgery in all women of childbearing age. <sup>[UTD_Drugs]</sup>",
        "items": {
            "possibly_pregnant": {"display_text": "The patient is female, of childbearing age, and sexually active."}
        }
    },
    
    "does_the_patient_smoke_tobacco": {
        "title": "Smoking",
        "mode": "checkbox",
        "info": "<h1>Tobacco Cessation</h1><p>Smokers who quit within 8 weeks of surgery tend to have increased salivary secretions with an increased rate of pulmonary complications, but they still have fewer complications overall than those who continue to smoke.<sup>[FamPrac]</sup></p>",
        "items": {
            "smokes_tobacco": {"display_text": "The patient smokes tobacco."}
        }
    },
    
    "medications": {
        "title": "The patient uses the following medications:",
        "mode": "checkbox",
        "items": {
            "acei_use": {"display_text": "an ACE inhibitor"},
            "arb_use": {
                "display_text": "an ARB",
                "info": "<h1>ARB Use</h1><p>We recommend resuming these agents as soon as possible postoperatively, as failure to restart ARBs within 48 hours after surgery has been associated with increased 30-day mortality.<sup>[UTD_Drugs]</sup></p>"
            },
            "diuretic_use": {"display_text": "one or more diuretics"},
            "non_statins_use": {
                "display_text": "one or more non-statin hypolipidemic agents",
                "info": "<h1>Non-Statins</h1><ul><li>Niacin</li><li>Gemfibrozil</li><li>Fenofibrate</li><li>Cholestyramine</li><li>Colestipol</li><li>Ezetimibe</li></ul>"
            },
            "theophylline_use": {"display_text": "theophylline"},
            "combined_oc_use": {
                "display_text": "a combined oral contraceptive",
                "info": "<h1>Combined Oral Contraceptives</h1><p>In general, combined OC's should be continued during surgery, but for those who are at high risk of VTE, discontinuation of combined OC's may be reasonable to mitigate additional VTE risk.<sup>[UTD_Drugs]</sup></p>"
            },
            "estrogen_use": {
                "display_text": "a systemic estrogen",
                "info": "<h1>Estrogen</h1><p>Ideally, women undergoing procedures associated with moderate to high risk for VTE should stop hormone therapy at least two weeks prior to elective surgery and resume treatment postoperatively once the period of elevated risk for VTE has resolved.<sup>[UTD_Drugs]</sup></p><p>Manufacturers recommend that estrogens should be discontinued at least four to six weeks prior to a surgical procedure with increased risk of VTE or during periods of prolonged immobilization, but evidence to support this recommendation is insufficient, particularly for HT.<sup>[UTD_Drugs]</sup></p>",
            },
            "raloxifene_use": {
                "display_text": "raloxifene",
                "info": raloxifene_info
            },
            "tamoxifen_use": {
                "display_text": "tamoxifen",
                "info": raloxifene_info
            },
            "bisphosphonate_use": {
                "display_text": "a bisphosphonate",
                "info": "<h1>Bisphosphonates</h1><p>We recommend withholding bisphosphonates only on the morning of surgery, as they are typically taken with at least 8 ounces of water and the patient is supposed to remain upright for at least 30 minutes and until after eating a meal.<sup>[UTD_Drugs]</sup></p>"
            },
            "aspirin": {
                "display_text": "aspirin",
                "info": "<h1>Aspirin</h1><p>Recommendations to continue or discontinue aspirin vary depending on what surgery is planned and the patient’s indication for aspirin. <sup>[UTD_Drugs]</sup></p>"
            },
            "warfarin": {
                "display_text": "warfarin"
            },
            "factor_xa_inhibitor": {
                "display_text": "a factor Xa inhibitor",
                "info": "<h1>Factor Xa Inhibitors</h1><ul><li>Rivaroxaban</li><li>Apixaban</li></ul>"
            },
            "clopidogrel": {
                "display_text": "clopidogrel"
            },
            "ticlopidine": {
                "display_text": "ticlopidine"
            },
            "prasugrel": {
                "display_text": "prasugrel"
            },
            "dabigatran": {
                "display_text": "dabigatran"
            },
            "ibuprofen_use": {
                "display_text": "ibuprofen",
            },
            "non_ibuprofen_nsaid_use": {
                "display_text": "a non-ibuprofen NSAID",
                "info": "<h1>NSAIDs</h1><p>For most NSAIDs, platelet function normalizes within three days of discontinuation, suggesting that NSAIDs should generally be discontinued at least three days before surgery; ibuprofen can be stopped 24 hours prior to surgery.<sup>[UTD_Drugs]</sup></p>"
            },
            "maoi_use": {
                "display_text": "an MAOI",
                "info": "<h1>Monoamine Oxidase Inhibitors</h1><p>The decision to continue or withhold nonselective MAO inhibitors before surgery requires close collaboration with the anesthesiologist and psychiatrist.<sup>[UTD_Drugs]</sup></p><ul><li>Isocarboxazid</li><li>Phenelzine</li><li>Tranylcypromine</li><li>Selegiline</li><li>Rasagiline</li></ul>",
            },
            "antipsychotic_use": {
                "display_text": "an antipsychotic",
                "info": "<h1>Antipsychotic</h1><p>These agents should be withheld in patients whose baseline or follow-up electrocardiogram (ECG) demonstrates prolongation of the QT interval. Shorter-acting and low-dose antipsychotics should be considered, and complete discontinuation may be preferable after consultation with a psychiatrist.<sup>[UTD_Drugs]</sup></p>",
            },
            "psychostimulant_use": {
                "display_text": "a psychostimulant",
                "info": "<h1>Psychostimulants</h1><p>Psychostimulant medications, used in the treatment of attention deficit hyperactivity disorder, may increase risk for hypertension and arrhythmias, lower the seizure threshold, and interact with medications that could be needed in the perioperative period (eg, vasopressors).<sup>[UTD_Drugs]</sup></p><p>Data are limited but risks are low of temporarily discontinuing psychostimulant medications. We recommend they be withheld on the day of surgery and resumed when the patient is stable.<sup>[UTD_Drugs]</sup></p>"
            },
            "naltrexone_use": {
                "display_text": "naltrexone",
                "info": "<h1>Naltrexone</h1><p>Naltrexone should be discontinued (or the intramuscular dose held) in anticipation of surgery, and a multimodal approach to pain management should be implemented.<sup>[UTD_Drugs]</sup></p>",
            },
            "colchicine_use": {
                "display_text": "colchicine",
                "info": "<h1>Colchicine</h1><p>Colchicine has a narrow therapeutic index and can cause muscle weakness and polyneuropathy in the setting of renal impairment or drug interactions.<sup>[UTD_Drugs]</sup></p><p>We recommend that colchicine be held on the morning of surgery and resumed when the patient is able to tolerate oral medications.<sup>[UTD_Drugs]</sup></p>"
            },
            "metformin_use": {
                "display_text": "metformin",
                "info": "<h1>Metformin</h1><p>There is a low risk of lactic acidosis.<sup>[FamPrac]</sup></p>"
            },
            "sulfonylurea_use": {
                "display_text": "a sulfonylurea",
                "info": "<h1>Sulfonylurea</h1><ul><li>Chlorpropramide</li><li>glipizide</li><li>glyburide</li><li>glimepiride</li></ul><p>Increases the risk of hypoglycemia and possible increased risk of ischemia.<sup>FamPrac</sup></p>"
            },
            "thiazolidinedione_use": {
                "display_text": "a thiazolidinedione",
                "info": "<h1>Thiazolidinediones</h1><ul><li>Pioglitazone</li><li>Rosiglitazone</li></ul>"
            },
            "dpp4i_use": {
                "display_text": "DPP4-i",
                "info": "<h1>Dipeptidyl Peptidase 4 Inhibitors</h1><ul><li>Sitagliptin</li><li>Vildagliptin</li><li>Saxagliptin</li><li>Linagliptin</li></ul>"
            },
            "glp1_a_use": {
                "display_text": "GLP-1 agonist",
                "info": "<h1>GLP-1 Agonists</h1><ul><li>Exenatide</li><li>Dulaglutide</li><li>Liraglutide</li></ul>"
            }
        }
    },
    
    "vte_risk": {
        "title": "VTE Risk using the <a href='https://www.mdcalc.com/caprini-score-venous-thromboembolism-2005'>Caprini Score</a>",
        "mode": "radiobox",
        "parent": "medications",
        "items": {
            "caprini_low": {"display_text": "The patient's Caprini risk score for VTE risk is low."},
            "caprini_high": {"display_text": "The patient's Caprini risk score for VTE risk is high."},
        }
    },
    
    "has_breast_cancer": {
        "title": "Does the patient have breast cancer or a history of breast cancer?",
        "mode": "radiobox",
        "parent": "medications",
        "items": {
            "no_breast_cancer": {"display_text": "The patient does not have a history of breast cancer."},
            "hx_of_breast_cancer": {"display_text": "The patient has a history of breast cancer."},
            "breast_cancer": {"display_text": "The patient has breast cancer."},
        }
    },
    
    "is_using_herbals": {
        "title": "The patient uses the following herbal supplements:",
        "mode": "checkbox",
        "items": {
            "ephedra_use": {
                "display_text": "ephedra",
                "info": "<h1>Ephedra</h1><p>Also called ma huang</p><p>May increase the risk of heart attack and stroke and should be discontinued at least 24 hours prior to surgery.<sup>[UTD_Drugs]</sup></p>"
            },
            "garlic_use": {
                "display_text": "garlic",
                "info": "<h1>Garlic</h1><p>May increase bleeding risk and should be discontinued at least seven days prior to surgery.<sup>[UTD_Drugs]</sup></p>"
            },
            "ginkgo_use": {
                "display_text": "ginkgo",
                "info": "<h1>Ginkgo</h1><p>May increase bleeding risk and should be discontinued at least 36 hours prior to surgery.<sup>[UTD_Drugs]</sup></p>"
            },
            "ginseng_use": {
                "display_text": "ginseng",
                "info": "<h1>Ginseng</h1><p>Lowers blood sugar and may increase bleeding risk and should be discontinued at least seven days prior to surgery.<sup>[UTD_Drugs]</sup></p>"
            },
            "kava_use": {
                "display_text": "kava",
                "info": "<h1>Kava</h1><p>May increase the sedative effect of anesthetics and should be discontinued at least 24 hours prior to surgery. An association between kava use and fatal hepatotoxicity has been reported.<sup>[UTD_Drugs]</sup></p>"
            },
            "st_johns_wort_use": {
                "display_text": "St. John's Wort",
                "info": "<h1>St John's Wort</h1><p>May diminish the effects of several drugs by induction of cytochrome P450 enzymes and should be discontinued at least five days prior to surgery.<sup>[UTD_Drugs]</sup></p></p>"
            },
            "valerian_use": {
                "display_text": "valerian",
                "info": "<h1>Valerian</h1><p>may increase the sedative effect of anesthetics and is associated with benzodiazepine-like withdrawal. There are no data on preoperative discontinuation. Ideally it is tapered weeks before surgery; if not, withdrawal is treated with benzodiazepines.<sup>[UTD_Drugs]</sup></p>"
            }
        }
    }
}
