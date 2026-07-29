export type AvatarSpec = {
  skin_tone: "medium_brown" | "warm_dark" | "deep" | "rich_dark";
  age_band: "40_49" | "50_59" | "60_69" | "70_plus";
  hair_or_covering:
    | "natural_afro" | "twist_out" | "locs" | "box_braids"
    | "cornrows" | "silk_press"
    | "hijab_navy" | "hijab_burgundy" | "hijab_cream"
    | "ankara_headwrap" | "senegalese_headwrap";
  demeanor: "warm_smile" | "thoughtful" | "calm_centered";
  setting: "neutral" | "home_window_light" | "outdoor_natural";

  // Personalization extras (optional, set by the user):
  wears_glasses: "none" | "reading_glasses" | "everyday_glasses";
  additional_notes?: string; // free-text, max 200 chars
};
