import {
  ViewerAttributes,
  defaultViewerAttributes,
} from './data/viewerAttributes';

export interface Profile {
  // Step 2 — Personality
  guide_persona: string;
  guide_vibe: string;
  // Step 3 — Look
  look_age: string;
  look_gender: string;
  look_skin: string;
  look_hair: string;
  look_attire: string;
  look_cultural_touches: string;
  // Step 4 — Scene
  scene: string;
  art_style: string;
  // Step 5 — Health context
  screening_type: string;
  barriers: string[];
  language: string;
  values: string[];
  // SurveyJS adaptive answers
  survey_data: Record<string, unknown>;
  // Step 6 — About you (viewer attributes for the instance graph)
  viewer_attributes: ViewerAttributes;
}

export const defaultProfile = (): Profile => ({
  guide_persona: '',
  guide_vibe: '',
  look_age: '',
  look_gender: '',
  look_skin: '',
  look_hair: '',
  look_attire: '',
  look_cultural_touches: '',
  scene: '',
  art_style: '',
  screening_type: '',
  barriers: [],
  language: 'English',
  values: [],
  survey_data: {},
  viewer_attributes: defaultViewerAttributes(),
});

export const PERSONAS = [
  { id: 'trusted_auntie', label: 'A trusted auntie', emoji: '👩‍🦱', desc: 'Someone who knows you and tells it straight with love' },
  { id: 'peer', label: 'A peer my own age', emoji: '🧑', desc: "Relatable, been through it, gets where you're coming from" },
  { id: 'calm_professional', label: 'A calm professional', emoji: '👩‍⚕️', desc: 'Knowledgeable, clear, inspires confidence' },
  { id: 'no_nonsense', label: 'No-nonsense straight-talker', emoji: '🎯', desc: 'Gets to the point, no fluff, you can trust what they say' },
];

export const VIBES = [
  { id: 'warm_nurturing', label: 'Warm & nurturing', emoji: '🤗', color: 'from-rose-100 to-pink-50' },
  { id: 'upbeat_encouraging', label: 'Upbeat & encouraging', emoji: '⚡', color: 'from-yellow-100 to-amber-50' },
  { id: 'calm_steady', label: 'Calm & steady', emoji: '🌿', color: 'from-teal-100 to-emerald-50' },
  { id: 'direct_honest', label: 'Direct & honest', emoji: '💎', color: 'from-blue-100 to-sky-50' },
];

export const LOOK_AGES = [
  { id: 'younger', label: 'Younger', sub: 'Late 20s–30s', emoji: '🌱' },
  { id: 'around_my_age', label: 'Around my age', sub: '40s–50s', emoji: '🌻' },
  { id: 'older_elder', label: 'Older / Elder', sub: '60s+', emoji: '🌳' },
];

export const LOOK_GENDERS = [
  { id: 'woman', label: 'Woman', emoji: '👩' },
  { id: 'man', label: 'Man', emoji: '👨' },
  { id: 'either', label: 'Either is fine', emoji: '🧑' },
];

export const SKIN_TONES = [
  { id: 'light', label: 'Light', hex: '#FDDCB5', promptLabel: 'fair' },
  { id: 'light_medium', label: 'Light tan', hex: '#F5C58A', promptLabel: 'light tan' },
  { id: 'medium', label: 'Medium', hex: '#E8A97D', promptLabel: 'medium' },
  { id: 'tan', label: 'Tan', hex: '#C48B42', promptLabel: 'warm tan' },
  { id: 'brown', label: 'Brown', hex: '#8B5E3C', promptLabel: 'warm brown' },
  { id: 'deep', label: 'Deep', hex: '#4A2315', promptLabel: 'deep brown' },
];

export const HAIR_STYLES = [
  { id: 'short', label: 'Short', emoji: '💇' },
  { id: 'long', label: 'Long', emoji: '🌊' },
  { id: 'braids_locs', label: 'Braids / Locs', emoji: '🔗' },
  { id: 'covered', label: 'Covered', emoji: '🧕' },
  { id: 'curly', label: 'Curly', emoji: '🌀' },
  { id: 'straight', label: 'Straight', emoji: '➡️' },
];

export const ATTIRE_STYLES = [
  { id: 'casual', label: 'Everyday casual', emoji: '👕', color: '#6ab0de' },
  { id: 'professional', label: 'Professional', emoji: '👔', color: '#2c3e50' },
  { id: 'medical_scrubs', label: 'Medical / scrubs', emoji: '🩺', color: '#1abc9c' },
  { id: 'traditional', label: 'Traditional / cultural', emoji: '🌺', color: '#e67e22' },
  { id: 'modern', label: 'Modern', emoji: '✨', color: '#7f8c8d' },
];

export const SCENES = [
  { id: 'cozy_home', label: 'Cozy home / kitchen', emoji: '🏡', desc: 'Warm and familiar' },
  { id: 'clinic', label: 'Medical clinic', emoji: '🏥', desc: 'Professional setting' },
  { id: 'community_center', label: 'Community center', emoji: '🤝', desc: 'Familiar gathering place' },
  { id: 'garden', label: 'Garden / outdoors', emoji: '🌿', desc: 'Open, calming' },
  { id: 'studio', label: 'Simple studio', emoji: '⬜', desc: 'Clean, distraction-free' },
];

export const ART_STYLES = [
  { id: 'warm_illustration', label: 'Warm illustration', emoji: '🎨', desc: 'Friendly hand-drawn feel' },
  { id: 'soft_3d', label: 'Soft 3D render', emoji: '🔮', desc: 'Modern, polished' },
  { id: 'photorealistic', label: 'Photorealistic', emoji: '📷', desc: 'Like a real person' },
  { id: 'watercolor', label: 'Watercolor', emoji: '🌊', desc: 'Gentle, painterly' },
];

export const SCREENINGS = [
  { id: 'breast', label: 'Breast Cancer', icon: '🎗️', desc: 'Mammogram & self-exam', color: 'from-pink-100 to-rose-50', accent: '#e8738a' },
  { id: 'colorectal', label: 'Colorectal Cancer', icon: '🔵', desc: 'Colonoscopy & stool test', color: 'from-blue-100 to-cyan-50', accent: '#3b9bd4' },
  { id: 'cervical', label: 'Cervical Cancer', icon: '🌺', desc: 'Pap smear & HPV test', color: 'from-purple-100 to-violet-50', accent: '#9b73d4' },
  { id: 'prostate', label: 'Prostate Cancer', icon: '🔷', desc: 'PSA test & options', color: 'from-teal-100 to-emerald-50', accent: '#2a9d8f' },
];

export const BARRIERS = [
  { id: 'pain', label: "I'm worried it will be painful", emoji: '😬' },
  { id: 'trust', label: "I don't fully trust doctors / the system", emoji: '🤔' },
  { id: 'necessity', label: "No family history — not sure I need it", emoji: '🤷' },
  { id: 'embarrassment', label: "I feel embarrassed about the exam", emoji: '😳' },
  { id: 'access', label: "I'm too busy or can't afford it", emoji: '💸' },
];

export const LANGUAGES = ['English', 'Spanish', 'Vietnamese', 'Korean', 'Uzbek'];

export const VALUES = [
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'faith', label: 'Faith', emoji: '🙏' },
  { id: 'community', label: 'Community', emoji: '🤝' },
  { id: 'independence', label: 'Independence', emoji: '⚡' },
  { id: 'tradition', label: 'Tradition', emoji: '🏡' },
];

// SurveyJS question sets by screening type
export const SURVEY_JSON: Record<string, object> = {
  breast: {
    pages: [{
      name: 'page',
      elements: [
        {
          type: 'radiogroup',
          name: 'last_screening',
          title: 'When did you last have a mammogram?',
          choices: ['Within the last year', '1–2 years ago', '3 or more years ago', "I've never had one", "I'm not sure"],
        },
        {
          type: 'radiogroup',
          name: 'awareness',
          title: 'How much do you know about breast cancer screening?',
          choices: ['A lot — I know what to expect', 'A little — I have some questions', 'Not much — this is new to me'],
        },
        {
          type: 'radiogroup',
          name: 'family_history',
          title: 'Has a close family member been diagnosed with breast cancer?',
          choices: ['Yes', 'No', "I'm not sure"],
        },
      ],
    }],
    showProgressBar: 'off',
    showNavigationButtons: 'bottom',
    completeText: 'Save answers',
  },
  colorectal: {
    pages: [{
      name: 'page',
      elements: [
        {
          type: 'radiogroup',
          name: 'last_screening',
          title: 'When did you last have a colorectal screening?',
          choices: ['Within the last year', '1–3 years ago', '4 or more years ago', "I've never had one", "I'm not sure"],
        },
        {
          type: 'radiogroup',
          name: 'awareness',
          title: 'How comfortable are you with colonoscopy or stool tests?',
          choices: ["Very — I know what's involved", 'Somewhat — I have questions', 'Not at all — I want to learn more'],
        },
        {
          type: 'radiogroup',
          name: 'prep_concern',
          title: 'What concerns you most about colorectal screening?',
          choices: ['The preparation process', 'The procedure itself', "I'm worried about what they might find", "I haven't thought about it much"],
        },
      ],
    }],
    showProgressBar: 'off',
    showNavigationButtons: 'bottom',
    completeText: 'Save answers',
  },
  default: {
    pages: [{
      name: 'page',
      elements: [
        {
          type: 'radiogroup',
          name: 'last_screening',
          title: 'When did you last have this screening?',
          choices: ['Within the last year', '1–3 years ago', '4 or more years ago', "I've never had one", "I'm not sure"],
        },
        {
          type: 'radiogroup',
          name: 'awareness',
          title: 'How much do you know about this screening type?',
          choices: ['A lot — I know what to expect', 'A little — I have some questions', 'Not much — this is new to me'],
        },
      ],
    }],
    showProgressBar: 'off',
    showNavigationButtons: 'bottom',
    completeText: 'Save answers',
  },
};

export const getSurveyJson = (screening: string): object =>
  SURVEY_JSON[screening] ?? SURVEY_JSON['default'];

// Assemble Nano Banana / Gemini image prompt from profile choices
export function assembleImagePrompt(profile: Profile): string {
  if (!profile.look_skin && !profile.look_hair && !profile.look_attire) return '';

  const ageMap: Record<string, string> = {
    younger: 'young adult',
    around_my_age: 'middle-aged',
    older_elder: 'elder',
  };
  const genderMap: Record<string, string> = {
    woman: 'woman',
    man: 'man',
    either: 'person',
  };
  const hairMap: Record<string, string> = {
    short: 'short',
    long: 'long flowing',
    braids_locs: 'braided',
    covered: 'covered with a head covering',
    curly: 'curly',
    straight: 'straight',
  };
  const attireMap: Record<string, string> = {
    casual: 'everyday casual clothing',
    professional: 'professional business attire',
    medical_scrubs: 'medical scrubs',
    traditional: 'traditional cultural dress',
    modern: 'modern stylish clothing',
  };
  const sceneMap: Record<string, string> = {
    cozy_home: 'cozy home kitchen',
    clinic: 'medical clinic',
    community_center: 'community center',
    garden: 'garden outdoors',
    studio: 'simple clean studio',
  };
  const artStyleMap: Record<string, string> = {
    warm_illustration: 'Warm digital illustration',
    soft_3d: 'Soft 3D rendered',
    photorealistic: 'Photorealistic',
    watercolor: 'Watercolor painting',
  };
  const vibeMap: Record<string, string> = {
    warm_nurturing: 'warm and nurturing',
    upbeat_encouraging: 'upbeat and encouraging',
    calm_steady: 'calm and steady',
    direct_honest: 'direct and confident',
  };

  const age = ageMap[profile.look_age] ?? profile.look_age;
  const gender = genderMap[profile.look_gender] ?? profile.look_gender;
  const skin = SKIN_TONES.find((s) => s.id === profile.look_skin)?.promptLabel ?? profile.look_skin;
  const hair = hairMap[profile.look_hair] ?? profile.look_hair;
  const attire = attireMap[profile.look_attire] ?? profile.look_attire;
  const scene = sceneMap[profile.scene] ?? profile.scene;
  const artStyle = artStyleMap[profile.art_style] ?? profile.art_style;
  const vibe = vibeMap[profile.guide_vibe] ?? profile.guide_vibe;
  const culturalNote = profile.look_cultural_touches ? `, with ${profile.look_cultural_touches}` : '';

  const parts: string[] = [];
  if (age || gender) parts.push(`Portrait of a${age ? ' ' + age : ''}${gender ? ' ' + gender : ''} health guide${skin ? ' with ' + skin + ' skin' : ''}${hair ? ' and ' + hair + ' hair' : ''},`);
  if (attire) parts.push(`wearing ${attire}${culturalNote},${scene ? ' in a ' + scene + ' setting.' : ''}`);
  if (vibe) parts.push(`Personality: ${vibe}, approachable and reassuring, gentle warm expression, making eye contact.`);
  if (artStyle) parts.push(`${artStyle} style, soft natural lighting, clean simple background, 1:1 aspect ratio, head-and-shoulders framing.`);

  return parts.join('\n');
}
