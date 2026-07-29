export type RoleOption = 'barrier' | 'facilitator' | 'motivator';

export interface KGNodeOption {
  value: string;
  label: string;
  hint?: string; // optional clarifying note shown beneath the option
}

export interface KGFactorClass {
  class: string;
  relation: string;
  prompt: string;
  allowRoles: RoleOption[];
  defaultRole: RoleOption;
  options: KGNodeOption[];
}

export const KG_FACTOR_CLASSES: KGFactorClass[] = [
  {
    class: 'SocialFactor',
    relation: 'shapes',
    prompt: 'Thinking about your community and the people around you, which of these are true for you?',
    allowRoles: ['barrier', 'facilitator', 'motivator'],
    defaultRole: 'facilitator',
    options: [
      { value: 'cancer stigma / taboo', label: "Cancer is something people around me don't talk about" },
      { value: 'community screening norms', label: "Women in my community do (or don't) get screened" },
      { value: 'family & social support', label: 'My family or friends support me in taking care of my health' },
      { value: 'spousal consent', label: "My partner's view matters in this decision" },
      { value: 'faith community', label: 'My faith community is part of how I make health decisions', hint: 'Optional — only if faith or religion plays a role in your life' },
    ],
  },
  {
    class: 'HealthBelief',
    relation: 'holds',
    prompt: 'Which of these come close to how you see cancer, screening, or doctors?',
    allowRoles: ['barrier', 'motivator'],
    defaultRole: 'barrier',
    options: [
      { value: 'fatalism', label: "If it's meant to happen, there's not much I can do" },
      { value: 'low perceived risk', label: "I don't think I'm really at risk" },
      { value: 'medical mistrust', label: "I don't fully trust the medical system" },
      { value: 'modesty / privacy', label: 'The exam feels too exposing or private' },
      { value: 'supernatural / religious belief', label: 'My faith shapes how I think about illness and healing', hint: 'Optional — only if spiritual or religious belief applies to you' },
      { value: 'misconception: mammography causes harm', label: "I've heard mammograms can be harmful" },
      { value: 'misconception: surgery spreads cancer', label: "I've heard that surgery can spread cancer" },
    ],
  },
  {
    class: 'Emotion',
    relation: 'experiences',
    prompt: 'When you think about screening, do you feel afraid or anxious about any of these?',
    allowRoles: ['barrier'],
    defaultRole: 'barrier',
    options: [
      { value: 'fear / anxiety → pain', label: 'The pain or discomfort of the exam' },
      { value: 'fear / anxiety → diagnosis', label: 'What they might find' },
      { value: 'fear / anxiety → body-loss', label: 'Losing part of my body' },
    ],
  },
  {
    class: 'Concern',
    relation: 'worries',
    prompt: 'Do you worry about any of these?',
    allowRoles: ['barrier'],
    defaultRole: 'barrier',
    options: [
      { value: 'stigma-if-diagnosed', label: 'How people would treat me if I were diagnosed' },
      { value: 'marriageability', label: 'How it could affect my relationship or marriage prospects' },
      { value: 'body-image / femininity', label: 'How it could affect how I feel as a woman' },
    ],
  },
  {
    class: 'KnowledgeState',
    relation: 'knows',
    prompt: 'How would you describe what you currently know about breast cancer screening?',
    allowRoles: ['barrier'],
    defaultRole: 'barrier',
    options: [
      { value: 'low breast-cancer & screening awareness', label: "I don't know much about it yet" },
    ],
  },
  {
    class: 'AccessFactor',
    relation: 'fuels',
    prompt: 'Are any of these getting in the way of being screened?',
    allowRoles: ['barrier'],
    defaultRole: 'barrier',
    options: [
      { value: 'cost / insurance', label: 'Cost or insurance' },
      { value: 'transport / distance', label: 'Getting there / distance' },
      { value: 'time / scheduling / caregiving', label: 'Time, scheduling, or caregiving duties' },
      { value: 'limited English', label: 'Language' },
      { value: 'service availability', label: 'No clinic or appointment available nearby' },
    ],
  },
  {
    class: 'ProviderFactor',
    relation: 'fuels',
    prompt: 'Thinking about doctors and clinics, have you experienced any of these?',
    allowRoles: ['barrier', 'facilitator'],
    defaultRole: 'barrier',
    options: [
      { value: 'provider recommendation', label: "A provider recommended (or didn't recommend) screening" },
      { value: 'provider communication', label: 'How well a provider communicated with me' },
      { value: 'racism / discrimination', label: 'Being treated unfairly because of my race' },
    ],
  },
];

export const CLINICAL_SPINE = {
  disease: 'breast cancer',
  procedure: 'mammogram',
  eligibilityCriterion: 'age 40/50–74',
};

export const ROLE_LABELS: Record<RoleOption, string> = {
  barrier: 'holds me back',
  facilitator: 'helps me',
  motivator: 'pushes me to go',
};
