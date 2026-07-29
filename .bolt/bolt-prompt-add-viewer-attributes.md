# Bolt Prompt — Add "About you" viewer-attribute questions to the guide wizard

## Context
This is the guide-wizard app (`vite-react-typescript-starter`: React 18 + Vite +
TypeScript + Tailwind). The **"Create your guide"** wizard currently runs:
`Welcome → Personality → Look → Scene → Concern → Summary → Result`.

I need one new step, **"About you"**, inserted **between Concern and Summary**,
that collects the viewer attributes for the personalization instance graph.
Do **not** remove or change any existing steps, questions, or generation logic.

## The 14 attributes

Store answers under `profile.viewer_attributes` with these exact snake_case
keys and internal option values (labels are what the participant sees):

1. **age** — "How old are you?" → `under_40 / 40_49 / 50_64 / 65_74 / 75_plus`
2. **population_group** — "Which community do you most identify with?" —
   scoped to the African American / Black diaspora this app serves →
   `african_american` ("African American") /
   `black_african_immigrant` ("African immigrant (Nigerian, Ghanaian, Ethiopian, Somali…)") /
   `afro_caribbean` ("Afro-Caribbean (Jamaican, Haitian, Trinidadian…)") /
   `afro_latina` ("Afro-Latina") /
   `black_multiracial_other` ("Multiracial / another Black background") /
   `prefer_not_to_say`

   Relatedly, the existing Concern-step "Which language feels most like home?"
   chips are diaspora languages: English, Haitian Creole, French, Spanish,
   Amharic, Somali, Swahili, Yoruba, Arabic.
3. **migration_status** — "Were you born in the US, or did you move here?" →
   `us_born / immigrant_10plus_years / immigrant_recent`
4. **acculturation_level** — "Day to day, which feels most like you?" →
   `heritage_oriented` ("I mostly live by my home culture's ways") /
   `bicultural` ("I move between both cultures") /
   `us_oriented` ("I mostly follow American ways of doing things")
5. **language_proficiency** — "How comfortable are you with English?" →
   `fluent_english / some_english / limited_english`
6. **health_status** — "How would you describe your health overall?" →
   `excellent / good / fair / poor`
7. **screening_history** — "Have you had this kind of screening before?" →
   `up_to_date / overdue / never_screened / not_sure`
8. **risk_history** — multi-select "Do any of these apply to you?" →
   `family_history / personal_history / told_higher_risk / no_known_risk / not_sure`
   (`no_known_risk` and `not_sure` are exclusive — selecting one clears the rest)
9. **caregiving_responsibilities** — multi-select "Are you taking care of anyone right now?" →
   `children / aging_parents_elders / ill_family_member / none` (`none` exclusive)
10. **coping_style** — "When it comes to health information, which sounds more like you?" →
    `monitoring` ("Tell me everything — details help me feel in control") /
    `blunting` ("Keep it brief — too much detail stresses me out")
11. **faith_affiliation** — optional — "Do you follow a faith or spiritual tradition?"
    ("Pick the one closest to yours.") →
    `christian_baptist / christian_ame_methodist / christian_pentecostal ("Christian — Pentecostal / COGIC") /
    christian_nondenominational / christian_catholic / christian_other /
    jewish / muslim / buddhist / hindu / spiritual_not_religious /
    other_faith / none / prefer_not_to_say`
12. **faith_practice** — optional, shown **only** when faith_affiliation is set
    and not `none`/`prefer_not_to_say` — "How big a part does faith play in your
    daily life?" → `central / important / occasional / not_practicing`
13. **socioeconomic_status** — optional + skippable — "How are things financially
    these days?" → `struggling / getting_by / comfortable / prefer_not_to_say`
14. **intersectional_configuration** — **auto-derived, never asked.** A short
    " · "-joined label rebuilt on every change from the salient answers, e.g.
    `"50–64 · Uzbek/Central Asian · recent immigrant · limited English ·
    faith-centered · caregiver · overdue for screening · wants full detail"`.
    Show it read-only at the bottom of the step ("How your guide will see you at
    a glance — built automatically from your answers").

## UI requirements
- Group into three card sections: 🌸 "A little about you" (1–5),
  💗 "Your health & history" (6–9), 🕊️ "How you cope & what you hold onto" (10–13).
- Options are pill chips (reuse the existing `chip` / `chip-selected` /
  `chip-unselected` classes). Single-select toggles off when re-clicked.
- **Everything is optional** — Continue is always enabled; header says
  "Everything is optional — skip anything you like."
- Mark sensitive questions with a small "(optional)" hint; SES gets the extra
  line "Totally okay to skip — this only helps us keep suggestions realistic."
- Match existing wizard styling (Georgia serif headings, sand/coral palette,
  `animate-slide-up`, Back/Continue buttons) and add the step to the progress bar.

## Data requirements
- Extend the `Profile` interface in `src/data.ts` with
  `viewer_attributes: ViewerAttributes` (typed, with a default factory).
- Question definitions live in one file, `src/data/viewerAttributes.ts`, so the
  form and the exported values never drift.
- The Summary step shows an "About you" row with the derived
  `intersectional_configuration`, and the profile JSON export (and the
  `/api/intake` POST) automatically include the whole `viewer_attributes` block.

## Acceptance criteria
1. New step appears after Concern, is fully skippable, and stores answers under
   the exact keys/values above.
2. `intersectional_configuration` updates live as answers change and is
   displayed read-only — never asked.
3. `faith_practice` only appears once a real affiliation is chosen.
4. Exclusive options ("none of these", "no one right now", "not sure") clear
   conflicting selections.
5. Existing steps, prompts, and exports keep working unchanged.
