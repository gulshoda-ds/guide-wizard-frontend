# Bolt Prompt — Add Communication Pathway Questions to "Create your portrait prompt"

## Context
This app builds a portrait/avatar prompt for breast-cancer-screening education videos (Synthesia/Descript). The **"Create your portrait prompt"** tool currently collects identity and cultural details (facial features, cultural group, race, religion [optional], income, setting/expression) and generates an avatar prompt.

I need to add a **Communication Style** section to this same tool, pulling in the 4 pathway questions that currently live in the **"Build my personalized script"** tool. The goal is to capture how the person prefers to receive information so it can be mapped to our communication pathways downstream.

## Task
In the **"Create your portrait prompt"** tool, add a new section titled **"How you like to be talked to"** (or "Communication Style") placed **after** the identity/cultural questions and **before** the prompt is generated. Do **not** remove or change any existing questions, fields, or the avatar-prompt generation logic.

Add exactly **4 single-select questions**, each with **2 options**. Each option must store a hidden internal `pathway` value (not shown to the user) so the answers can be exported for knowledge-graph mapping later.

## The 4 questions

**Q1. How do you like to be convinced?**
- "Show me the evidence and the numbers" → `pathway: elm_central`
- "I trust people's experiences, not statistics" → `pathway: elm_peripheral`

**Q2. How much detail do you want about the risks and the procedure?**
- "Keep it simple — just the essentials" → `pathway: blunting`
- "Tell me everything — all the details" → `pathway: monitoring`

**Q3. How should the message feel?**
- "Reassure me — tell me it'll be okay" → `pathway: supportive`
- "Be direct — just tell me how it is" → `pathway: directive`

**Q4. Who would you trust most to talk to you about this?**
- "A doctor or medical authority" → `pathway: authority`
- "A friend or someone like me sharing their experience" → `pathway: peer`

## Output / data requirements
- Store each answer's hidden `pathway` value in the app's state, not just the visible label.
- Extend the existing JSON export so the generated object includes a `communication_style` block alongside the existing identity/culture fields. Example shape:

```json
{
  "identity": { "...existing fields..." },
  "culture": { "...existing fields..." },
  "communication_style": {
    "convincing": "elm_central",
    "detail_level": "monitoring",
    "tone": "supportive",
    "source": "peer"
  }
}
```

- Keep the keys exactly as: `convincing`, `detail_level`, `tone`, `source` (these are the 4 pathway dimensions Yifan's side will map to knowledge-graph nodes).
- If the JSON is currently only used internally to build the Synthesia prompt, also expose/log the full JSON (including `communication_style`) so it can be copied out.

## Constraints
- **Exactly 4 questions, 2 options each** — do not expand this into a long survey.
- Do not break the existing avatar-prompt generation; the new section is additive.
- Match the existing visual style of the tool (same component styling, spacing, and single-select pattern already used for the cultural questions).
- The `pathway` values are internal — never display them to the user.
- Make all 4 questions required before the user can generate the prompt, OR provide a sensible default if left blank (your choice — flag which you implemented).
