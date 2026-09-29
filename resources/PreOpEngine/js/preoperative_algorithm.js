var preoperative_algorithm = {
    "start": {
        "html": "Patient scheduled for surgery with known risk factors for CAD",
        "connect": ["emergency"]
    },
    "emergency": {
        "html": "Emergency?",
        "type": "condition",
        "connect": ["risk_stratify", "ACS"]
    },
    "risk_stratify": {
        "html": "Clinical risk stratification and proceed to surgery"
    },
    "ACS": {
        "html": "ACS?",
        "type": "condition",
        "connect": ["estimate_MACE", "eval_and_treat"]
    },
    "eval_and_treat": {
        "html": "Evaluate and treat according to GDMT",
        "connect": ["estimate_MACE"]
    },
    "estimate_MACE": {
        "html": "Estimated perioperative risk of MACE based on combined clinical or surgical risk",
        "connect": ["low_risk", "elevated_risk"]
    },
    "low_risk": {
        "html": "Low risk (&lt; 1%)",
        "connect": ["no_further_testing"]
    },
    "elevated_risk": {
        "html": "Elevated risk (&ge; 1%)",
        "connect": ["mets_lt_4_or_unk", "mets_ge_4"]
    },
    "no_further_testing": {
        "html": "No further testing. Proceed to surgery",
    },
    "mets_lt_4_or_unk": {
        "html": "METs &lt; 4 or unknown",
        "connect": ["worth_it"]
    },
    "mets_ge_4": {
        "html": "METs &ge; 4",
        "connect": ["proceed_to_surgery"]
    },
    "worth_it": {
        "html": "Will further testing impact decision making or perioperative care?",
        "type": "condition",
        "connect": ["proceed_but", "pharm_stress"]
    },
    "proceed_to_surgery": {
        "html": "Proceed to surgery"
    },
    "pharm_stress": {
        "html": "Pharmacologic stress testing",
        "type": "condition",
        "words": ["Normal", "Abnormal"],
        "connect": ["proceed_but", "revasc"]
    },
    "revasc": {
        "html": "Coronary revascularization",
        "connect": ["proceed_but"]
    },
    "proceed_but": {
        "html": "Proceed to surgery according to GDMT or alternate strategies (noninvasive tx or palliation)"
    },
}
