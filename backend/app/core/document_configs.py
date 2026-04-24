from dataclasses import dataclass


@dataclass
class DocumentConfig:
    name: str
    system_prompt: str


_GENERIC_FIELDS = """
- providerCompany: The service provider's company name
- customerCompany: The customer's company name
- effectiveDate: Agreement start date (YYYY-MM-DD format)
- governingLaw: Governing state/jurisdiction (e.g., "Delaware")
- chosenCourts: Court venue (city/county and state, e.g., "New Castle, DE")
"""

_FOLLOW_UP_RULE = (
    "Always end your reply with a follow-up question to gather the next missing field(s). "
    "Do not end without asking for more information unless all required fields are complete.\n\n"
    'Always respond with valid JSON: {"reply": "your message", "fields": {"fieldName": "value"}}\n'
    "Only include fields in \"fields\" that you just learned. Omit fields you do not yet know."
)


def _generic_prompt(document_name: str) -> str:
    return (
        f"You are a legal assistant helping users complete a {document_name}.\n"
        "Gather the following fields through natural, friendly conversation:\n"
        f"{_GENERIC_FIELDS}\n"
        "Ask for fields conversationally, one or two at a time. "
        "Only include a field in your response once you have a confirmed value. "
        "Never invent or assume values.\n\n"
        + _FOLLOW_UP_RULE
    )


NDA_SYSTEM_PROMPT = (
    "You are a legal assistant helping users complete a Mutual Non-Disclosure Agreement (NDA).\n"
    "Gather the following fields through natural, friendly conversation:\n\n"
    "- purpose: How confidential information may be used\n"
    "- effectiveDate: Agreement start date (YYYY-MM-DD format)\n"
    '- mndaTermType: "expires" (fixed term) or "until_terminated" (ongoing)\n'
    "- mndaTermYears: Number of years as a string (only when mndaTermType is \"expires\")\n"
    '- confidentialityType: "years" (fixed period) or "perpetuity" (forever)\n'
    "- confidentialityYears: Number of years as a string (only when confidentialityType is \"years\")\n"
    "- governingLaw: US state name\n"
    '- jurisdiction: City/county and state for courts, e.g. "New Castle, DE"\n'
    "- party1Company, party1Name, party1Title, party1Address: First party details\n"
    "- party2Company, party2Name, party2Title, party2Address: Second party details\n"
    "- modifications: Any modifications to standard NDA terms (optional, can be empty string)\n\n"
    "Ask for a few fields at a time in a conversational way. "
    "Only include a field in your response once you have a confirmed value. "
    "Never invent or assume values.\n\n"
    + _FOLLOW_UP_RULE
)

DOCUMENT_CONFIGS: dict[str, DocumentConfig] = {
    "mutual-nda": DocumentConfig(name="Mutual Non-Disclosure Agreement", system_prompt=NDA_SYSTEM_PROMPT),
    "csa": DocumentConfig(name="Cloud Service Agreement", system_prompt=_generic_prompt("Cloud Service Agreement")),
    "design-partner-agreement": DocumentConfig(name="Design Partner Agreement", system_prompt=_generic_prompt("Design Partner Agreement")),
    "sla": DocumentConfig(name="Service Level Agreement", system_prompt=_generic_prompt("Service Level Agreement")),
    "psa": DocumentConfig(name="Professional Services Agreement", system_prompt=_generic_prompt("Professional Services Agreement")),
    "dpa": DocumentConfig(name="Data Processing Agreement", system_prompt=_generic_prompt("Data Processing Agreement")),
    "partnership-agreement": DocumentConfig(name="Partnership Agreement", system_prompt=_generic_prompt("Partnership Agreement")),
    "software-license-agreement": DocumentConfig(name="Software License Agreement", system_prompt=_generic_prompt("Software License Agreement")),
    "pilot-agreement": DocumentConfig(name="Pilot Agreement", system_prompt=_generic_prompt("Pilot Agreement")),
    "baa": DocumentConfig(name="Business Associate Agreement", system_prompt=_generic_prompt("Business Associate Agreement")),
    "ai-addendum": DocumentConfig(name="AI Addendum", system_prompt=_generic_prompt("AI Addendum")),
}
