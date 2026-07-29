// Viewer attributes for the personalization instance graph (L1 Viewer node).
// Each question maps a plain-language prompt to a stable snake_case attribute
// key + internal option values used downstream for KG grounding.
// intersectional_configuration is auto-derived, never asked.

export interface ViewerAttributes {
  age: string;
  migration_status: string;
  acculturation_level: string;
  language_proficiency: string;
  socioeconomic_status: string;
  screening_history: string;
  health_status: string;
  risk_history: string[];
  caregiving_responsibilities: string[];
  coping_style: string;
  faith_affiliation: string;
  faith_practice: string;
  population_group: string;
  intersectional_configuration: string; // auto-derived label
}

export const defaultViewerAttributes = (): ViewerAttributes => ({
  age: '',
  migration_status: '',
  acculturation_level: '',
  language_proficiency: '',
  socioeconomic_status: '',
  screening_history: '',
  health_status: '',
  risk_history: [],
  caregiving_responsibilities: [],
  coping_style: '',
  faith_affiliation: '',
  faith_practice: '',
  population_group: '',
  intersectional_configuration: '',
});

export interface AttributeOption {
  value: string; // internal value stored in the profile / instance graph
  label: string; // plain-language wording shown to the participant
  emoji?: string;
}

export interface AttributeQuestion {
  key: keyof Omit<ViewerAttributes, 'intersectional_configuration'>;
  prompt: string;
  sub?: string; // optional smaller helper line under the prompt
  multi: boolean; // multi-select (string[]) vs single-select (string)
  optional?: boolean; // sensitive — show a "you can skip this" hint
  options: AttributeOption[];
}

// Grouped into short sections so the step doesn't feel like a form.
export interface AttributeSection {
  title: string;
  emoji: string;
  questions: AttributeQuestion[];
}

export const ATTRIBUTE_SECTIONS: AttributeSection[] = [
  {
    title: 'A little about you',
    emoji: '🌸',
    questions: [
      {
        key: 'age',
        prompt: 'How old are you?',
        multi: false,
        options: [
          { value: 'under_40', label: 'Under 40' },
          { value: '40_49', label: '40–49' },
          { value: '50_64', label: '50–64' },
          { value: '65_74', label: '65–74' },
          { value: '75_plus', label: '75+' },
        ],
      },
      {
        key: 'population_group',
        prompt: 'Which community do you most identify with?',
        sub: 'This helps your guide speak to your experience.',
        multi: false,
        options: [
          { value: 'african_american', label: 'African American' },
          { value: 'black_african_immigrant', label: 'African immigrant (Nigerian, Ghanaian, Ethiopian, Somali…)' },
          { value: 'afro_caribbean', label: 'Afro-Caribbean (Jamaican, Haitian, Trinidadian…)' },
          { value: 'afro_latina', label: 'Afro-Latina' },
          { value: 'black_multiracial_other', label: 'Multiracial / another Black background' },
          { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ],
      },
      {
        key: 'migration_status',
        prompt: 'Were you born in the US, or did you move here?',
        multi: false,
        options: [
          { value: 'us_born', label: 'Born in the US', emoji: '🏠' },
          { value: 'immigrant_10plus_years', label: 'Moved here 10+ years ago', emoji: '🧳' },
          { value: 'immigrant_recent', label: 'Moved here in the last 10 years', emoji: '✈️' },
        ],
      },
      {
        key: 'acculturation_level',
        prompt: 'Day to day, which feels most like you?',
        multi: false,
        options: [
          { value: 'heritage_oriented', label: "I mostly live by my home culture's ways", emoji: '🌍' },
          { value: 'bicultural', label: 'I move between both cultures', emoji: '🌉' },
          { value: 'us_oriented', label: 'I mostly follow American ways of doing things', emoji: '🇺🇸' },
        ],
      },
      {
        key: 'language_proficiency',
        prompt: 'How comfortable are you with English?',
        multi: false,
        options: [
          { value: 'fluent_english', label: 'Very comfortable — English is easy for me' },
          { value: 'some_english', label: 'I manage, but my own language feels easier' },
          { value: 'limited_english', label: 'English is hard for me' },
        ],
      },
    ],
  },
  {
    title: 'Your health & history',
    emoji: '💗',
    questions: [
      {
        key: 'health_status',
        prompt: 'How would you describe your health overall?',
        multi: false,
        options: [
          { value: 'excellent', label: 'Excellent', emoji: '💪' },
          { value: 'good', label: 'Good', emoji: '🙂' },
          { value: 'fair', label: 'Fair', emoji: '😐' },
          { value: 'poor', label: 'Not so good', emoji: '🤒' },
        ],
      },
      {
        key: 'screening_history',
        prompt: 'Have you had this kind of screening before?',
        multi: false,
        options: [
          { value: 'up_to_date', label: "Yes — I'm up to date" },
          { value: 'overdue', label: "I have, but I'm overdue" },
          { value: 'never_screened', label: "I've never had one" },
          { value: 'not_sure', label: "I'm not sure" },
        ],
      },
      {
        key: 'risk_history',
        prompt: 'Do any of these apply to you?',
        sub: 'Pick all that apply.',
        multi: true,
        options: [
          { value: 'family_history', label: 'A close family member has had cancer' },
          { value: 'personal_history', label: "I've had cancer or an abnormal result before" },
          { value: 'told_higher_risk', label: "A doctor has told me I'm at higher risk" },
          { value: 'no_known_risk', label: 'None of these' },
          { value: 'not_sure', label: "I'm not sure" },
        ],
      },
      {
        key: 'caregiving_responsibilities',
        prompt: 'Are you taking care of anyone right now?',
        sub: 'Pick all that apply — caregiving shapes your time and energy.',
        multi: true,
        options: [
          { value: 'children', label: 'Children', emoji: '🧒' },
          { value: 'aging_parents_elders', label: 'Aging parents or elders', emoji: '👵' },
          { value: 'ill_family_member', label: 'A family member who is ill', emoji: '🤲' },
          { value: 'none', label: 'No one right now', emoji: '🌿' },
        ],
      },
    ],
  },
  {
    title: 'How you cope & what you hold onto',
    emoji: '🕊️',
    questions: [
      {
        key: 'coping_style',
        prompt: 'When it comes to health information, which sounds more like you?',
        multi: false,
        options: [
          { value: 'monitoring', label: 'Tell me everything — details help me feel in control', emoji: '🔍' },
          { value: 'blunting', label: 'Keep it brief — too much detail stresses me out', emoji: '🍃' },
        ],
      },
      {
        key: 'faith_affiliation',
        prompt: 'Do you follow a faith or spiritual tradition?',
        sub: 'Pick the one closest to yours.',
        optional: true,
        multi: false,
        options: [
          { value: 'christian_baptist', label: 'Christian — Baptist' },
          { value: 'christian_ame_methodist', label: 'Christian — AME / Methodist' },
          { value: 'christian_pentecostal', label: 'Christian — Pentecostal / COGIC' },
          { value: 'christian_nondenominational', label: 'Christian — non-denominational' },
          { value: 'christian_catholic', label: 'Christian — Catholic' },
          { value: 'christian_other', label: 'Christian — another tradition' },
          { value: 'jewish', label: 'Jewish' },
          { value: 'muslim', label: 'Muslim' },
          { value: 'buddhist', label: 'Buddhist' },
          { value: 'hindu', label: 'Hindu' },
          { value: 'spiritual_not_religious', label: 'Spiritual, but not religious' },
          { value: 'other_faith', label: 'Another faith or tradition' },
          { value: 'none', label: 'No faith tradition' },
          { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ],
      },
      {
        key: 'faith_practice',
        prompt: 'How big a part does faith play in your daily life?',
        optional: true,
        multi: false,
        options: [
          { value: 'central', label: "It's at the center of my life" },
          { value: 'important', label: 'Important, but one part among many' },
          { value: 'occasional', label: 'Present on occasions — holidays, hard times' },
          { value: 'not_practicing', label: 'Not really part of my daily life' },
        ],
      },
      {
        key: 'socioeconomic_status',
        prompt: 'How are things financially these days?',
        sub: 'Totally okay to skip — this only helps us keep suggestions realistic.',
        optional: true,
        multi: false,
        options: [
          { value: 'struggling', label: 'Money is tight right now' },
          { value: 'getting_by', label: "We're getting by" },
          { value: 'comfortable', label: "We're comfortable" },
          { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ],
      },
    ],
  },
];

// Flat lookup: attribute key -> question (for summaries / label rendering).
export const ATTRIBUTE_QUESTIONS: AttributeQuestion[] = ATTRIBUTE_SECTIONS.flatMap(
  (s) => s.questions,
);

export const optionLabel = (key: AttributeQuestion['key'], value: string): string =>
  ATTRIBUTE_QUESTIONS.find((q) => q.key === key)?.options.find((o) => o.value === value)?.label ??
  value;

// Auto-derive the short intersectional configuration label from the salient
// attributes — mirrors the instance-graph spec ("50–64 · recent immigrant ·
// limited English"). Never asked; recomputed whenever answers change.
export function deriveIntersectionalConfig(attrs: ViewerAttributes): string {
  const parts: string[] = [];

  const ageLabels: Record<string, string> = {
    under_40: 'under 40',
    '40_49': '40–49',
    '50_64': '50–64',
    '65_74': '65–74',
    '75_plus': '75+',
  };
  if (attrs.age) parts.push(ageLabels[attrs.age] ?? attrs.age);

  const popLabels: Record<string, string> = {
    african_american: 'African American',
    black_african_immigrant: 'African immigrant',
    afro_caribbean: 'Afro-Caribbean',
    afro_latina: 'Afro-Latina',
    black_multiracial_other: 'multiracial Black',
  };
  if (attrs.population_group && attrs.population_group !== 'prefer_not_to_say')
    parts.push(popLabels[attrs.population_group] ?? attrs.population_group);

  if (attrs.migration_status === 'immigrant_recent') parts.push('recent immigrant');
  else if (attrs.migration_status === 'immigrant_10plus_years') parts.push('long-settled immigrant');

  if (attrs.language_proficiency === 'limited_english') parts.push('limited English');

  if (attrs.faith_practice === 'central') parts.push('faith-centered');

  const caring = attrs.caregiving_responsibilities.filter((c) => c !== 'none');
  if (caring.length > 0) parts.push('caregiver');

  if (attrs.screening_history === 'never_screened') parts.push('never screened');
  else if (attrs.screening_history === 'overdue') parts.push('overdue for screening');

  if (attrs.coping_style === 'monitoring') parts.push('wants full detail');
  else if (attrs.coping_style === 'blunting') parts.push('prefers essentials');

  return parts.join(' · ');
}
