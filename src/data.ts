import {
  ViewerAttributes,
  defaultViewerAttributes,
} from './data/viewerAttributes';

// The wizard collects two things: what the video should be about (the screening
// topic and what the viewer is worried about), and who the viewer is (the 14
// viewer attributes of the personalization instance graph). The guide's own
// appearance is not asked — the backend derives it from the viewer attributes.
export interface Profile {
  // Step 2 — What the video is about
  screening_type: string;
  barriers: string[];
  language: string;
  values: string[];
  // Step 3 — About you (viewer attributes for the instance graph)
  viewer_attributes: ViewerAttributes;
}

export const defaultProfile = (): Profile => ({
  screening_type: '',
  barriers: [],
  language: 'English',
  values: [],
  viewer_attributes: defaultViewerAttributes(),
});

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

// Languages spoken across the African American / Black diaspora communities
// this app serves (African American, African immigrant, Afro-Caribbean, Afro-Latina).
export const LANGUAGES = [
  'English',
  'Haitian Creole',
  'French',
  'Spanish',
  'Amharic',
  'Somali',
  'Swahili',
  'Yoruba',
  'Arabic',
];

export const VALUES = [
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'faith', label: 'Faith', emoji: '🙏' },
  { id: 'community', label: 'Community', emoji: '🤝' },
  { id: 'independence', label: 'Independence', emoji: '⚡' },
  { id: 'tradition', label: 'Tradition', emoji: '🏡' },
];
