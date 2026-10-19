import resume from "@content/resume.json";

const SKILL_POOL = [
  ...resume.skills.languages,
  ...resume.skills.frontend.slice(0, 4),
  ...resume.skills.backend.slice(0, 3),
  ...resume.skills.cloud.slice(0, 3),
  "Distributed Systems",
  "ETL Pipelines",
];

const TITLE_TEMPLATES = [
  (s: string) => `Gained proficiency in ${s}`,
  (s: string) => `${s} insight absorbed`,
  (s: string) => `Realm knowledge: ${s}`,
  (s: string) => `Your grasp of ${s} deepens`,
  (s: string) => `Study complete — ${s}`,
];

const BODY_TEMPLATES = [
  "The orchard’s wisdom settles into muscle memory.",
  "Another skill leaf added to your realm file.",
  "You taste theory; practice follows.",
  "The island remembers what you learned.",
  "Knowledge fruit — digested and filed.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function rollProficiencyToast(): { title: string; body: string; skill: string } {
  const skill = pick(SKILL_POOL);
  const title = pick(TITLE_TEMPLATES)(skill);
  const body = pick(BODY_TEMPLATES);
  return { title, body, skill };
}
