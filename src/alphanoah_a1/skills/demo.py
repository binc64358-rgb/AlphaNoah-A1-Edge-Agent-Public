"""Two synthetic declarative Skills for Task 04.5C demonstration."""

from ..skill import SkillDefinition, SkillStatus

RESTAURANT_AIRCON_SHUTDOWN_SKILL = SkillDefinition(
    skill_id="restaurant-aircon-shutdown",
    version="1.0-demo",
    status=SkillStatus.ACTIVE,
    supported_event_types=("device_not_shutdown",),
    supported_asset_types=("air_conditioner",),
    analysis_instructions=(
        "Analyze the synthetic after-closing air-conditioner report. "
        "Consider energy waste, confirm whether people remain on site, "
        "request verification of the reported state, identify duty-staff "
        "follow-up, and treat smart-plug or remote power-off only as a "
        "proposal requiring authorization. Never direct an unqualified "
        "person to perform a high-risk electrical action."
    ),
    escalation_rules=(
        "Escalate unresolved after-closing status to authorized duty staff.",
        "Require a human to confirm any electrical power action.",
    ),
    knowledge_query_hints=(
        "aircon shutdown",
        "closing checklist",
        "energy exception",
        "smart plug guidance",
    ),
)

INDUSTRIAL_EQUIPMENT_SHUTDOWN_SKILL = SkillDefinition(
    skill_id="industrial-equipment-shutdown",
    version="1.0-demo",
    status=SkillStatus.ACTIVE,
    supported_event_types=("device_not_shutdown",),
    supported_asset_types=("industrial_machine",),
    analysis_instructions=(
        "Analyze the synthetic industrial-machine shutdown report. "
        "Prioritize personnel safety, equipment wear, residual energy, "
        "the approved shutdown SOP, lockout/tagout guidance when applicable, "
        "and escalation to authorized maintenance. Never direct an "
        "unauthorized person to operate or isolate equipment."
    ),
    escalation_rules=(
        "Escalate uncertain equipment state to authorized maintenance.",
        "Require human confirmation before shutdown or isolation activity.",
    ),
    knowledge_query_hints=(
        "equipment shutdown",
        "lockout tagout",
        "maintenance escalation",
        "safety inspection",
    ),
)

DEMO_SKILL_DEFINITIONS = (
    INDUSTRIAL_EQUIPMENT_SHUTDOWN_SKILL,
    RESTAURANT_AIRCON_SHUTDOWN_SKILL,
)

__all__ = [
    "DEMO_SKILL_DEFINITIONS",
    "INDUSTRIAL_EQUIPMENT_SHUTDOWN_SKILL",
    "RESTAURANT_AIRCON_SHUTDOWN_SKILL",
]
