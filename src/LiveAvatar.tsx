
import { Profile, SKIN_TONES, ATTIRE_STYLES } from './data';

interface LiveAvatarProps {
  profile: Profile;
  size?: 'sm' | 'md' | 'lg';
}

const HAIR_COLOR = '#3D1C02';
const COVERED_COLOR = '#1a4f72';
const HIGHLIGHT = 'rgba(255,255,255,0.3)';

function HairShape({ style, hairColor }: { style: string; hairColor: string }) {
  switch (style) {
    case 'short':
      return (
        <path
          d="M 22,52 Q 20,18 50,18 Q 80,18 78,52 Q 68,30 50,28 Q 32,30 22,52"
          fill={hairColor}
        />
      );
    case 'long':
      return (
        <>
          <path d="M 22,52 Q 20,18 50,18 Q 80,18 78,52 Q 68,30 50,28 Q 32,30 22,52" fill={hairColor} />
          <path d="M 20,50 L 13,108 Q 20,112 26,106 L 24,52 Z" fill={hairColor} />
          <path d="M 80,50 L 87,108 Q 80,112 74,106 L 76,52 Z" fill={hairColor} />
        </>
      );
    case 'braids_locs':
      return (
        <>
          <path d="M 22,52 Q 20,18 50,18 Q 80,18 78,52 Q 68,30 50,28 Q 32,30 22,52" fill={hairColor} />
          <path d="M 20,50 L 13,108 Q 20,112 26,106 L 24,52 Z" fill={hairColor} />
          <path d="M 80,50 L 87,108 Q 80,112 74,106 L 76,52 Z" fill={hairColor} />
          {/* braid strand lines */}
          <line x1="18" y1="58" x2="16" y2="90" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="60" x2="20" y2="96" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78" y1="58" x2="80" y2="90" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="60" x2="84" y2="96" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
    case 'covered':
      return (
        // Hijab-style — wraps around head and flows down
        <path
          d="M 50,16 Q 20,16 18,52 L 12,100 Q 50,114 88,100 L 82,52 Q 80,16 50,16 Z"
          fill={COVERED_COLOR}
          opacity="0.85"
        />
      );
    case 'curly':
      return (
        // Large rounded blob suggesting afro/curly volume — drawn BEFORE face
        <ellipse cx="50" cy="38" rx="36" ry="30" fill={hairColor} />
      );
    case 'straight':
      return (
        <>
          <path d="M 22,52 Q 20,18 50,18 Q 80,18 78,52 Q 68,28 50,26 Q 32,28 22,52" fill={hairColor} />
          <rect x="13" y="48" width="10" height="60" rx="5" fill={hairColor} />
          <rect x="77" y="48" width="10" height="60" rx="5" fill={hairColor} />
        </>
      );
    default:
      return null;
  }
}

export default function LiveAvatar({ profile, size = 'md' }: LiveAvatarProps) {
  const skinTone = SKIN_TONES.find((s) => s.id === profile.look_skin);
  const skinColor = skinTone?.hex ?? '#E8C49A';
  const attire = ATTIRE_STYLES.find((a) => a.id === profile.look_attire);
  const attireColor = attire?.color ?? '#c8d6e5';
  const hairStyle = profile.look_hair;

  const sizeMap = { sm: 48, md: 80, lg: 130 };
  const px = sizeMap[size];
  const hasContent = !!(profile.look_skin || profile.look_hair);

  if (!hasContent) {
    return (
      <div
        style={{ width: px, height: px }}
        className="rounded-full bg-sand-100 border-2 border-dashed border-sand-300 flex items-center justify-center"
      >
        <span className="text-sand-400" style={{ fontSize: px * 0.3 }}>?</span>
      </div>
    );
  }

  return (
    <div style={{ width: px, height: px }} className="relative flex-shrink-0">
      <svg viewBox="0 0 100 120" width={px} height={px} xmlns="http://www.w3.org/2000/svg">
        {/* Drop shadow circle */}
        <ellipse cx="50" cy="116" rx="28" ry="5" fill="rgba(0,0,0,0.08)" />

        {/* Clothing / shoulders */}
        <path d="M 10,120 L 28,88 Q 50,96 72,88 L 90,120 Z" fill={attireColor} />
        <path d="M 28,88 Q 50,100 72,88 Q 62,84 50,82 Q 38,84 28,88 Z" fill={skinColor} />

        {/* Hair (back layer — drawn before face for curly/afro) */}
        {(hairStyle === 'curly') && <HairShape style={hairStyle} hairColor={HAIR_COLOR} />}

        {/* Neck */}
        <rect x="42" y="80" width="16" height="14" rx="4" fill={skinColor} />

        {/* Face */}
        <ellipse cx="50" cy="52" rx="28" ry="32" fill={skinColor} />

        {/* Hair (front layer — for all styles except curly which is behind) */}
        {hairStyle !== 'curly' && hairStyle && (
          <HairShape style={hairStyle} hairColor={HAIR_COLOR} />
        )}

        {/* Covered skin overlay (face opening) */}
        {hairStyle === 'covered' && (
          <ellipse cx="50" cy="54" rx="22" ry="26" fill={skinColor} />
        )}

        {/* Face highlight */}
        <ellipse cx="42" cy="42" rx="8" ry="10" fill={HIGHLIGHT} />

        {/* Eyebrows */}
        <path d="M 38,42 Q 43,39 47,42" fill="none" stroke={HAIR_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 53,42 Q 57,39 62,42" fill="none" stroke={HAIR_COLOR} strokeWidth="1.5" strokeLinecap="round" />

        {/* Eyes */}
        <ellipse cx="43" cy="48" rx="3.5" ry="4" fill="#2d1a0e" />
        <ellipse cx="57" cy="48" rx="3.5" ry="4" fill="#2d1a0e" />
        <circle cx="44" cy="47" r="1.2" fill="white" opacity="0.7" />
        <circle cx="58" cy="47" r="1.2" fill="white" opacity="0.7" />

        {/* Nose */}
        <path d="M 49,54 Q 47,60 50,62 Q 53,60 51,54" fill="none" stroke={skinColor === '#FDDCB5' ? '#d4a46a' : 'rgba(0,0,0,0.15)'} strokeWidth="1.2" strokeLinecap="round" />

        {/* Smile */}
        <path d="M 42,67 Q 50,74 58,67" fill="none" stroke={skinColor === '#FDDCB5' ? '#c4834a' : 'rgba(0,0,0,0.25)'} strokeWidth="2" strokeLinecap="round" />

        {/* Clothing neckline detail */}
        <path d="M 34,90 Q 50,98 66,90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
