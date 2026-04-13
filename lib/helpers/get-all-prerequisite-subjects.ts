import type { Subject } from "@/types/pensum";

export function getAllPrerequisiteSubjects(
  subjects: Subject[],
  lastFoundSubject: string,
  lastSubjectsToRemove: string[]
): string[] {
  const subjectsWithPrereq = subjects
    .filter((subject) => subject.prerequisites.includes(lastFoundSubject))
    .map((subject) => subject.code);

  if (subjectsWithPrereq.length > 0)
    lastSubjectsToRemove.push(...subjectsWithPrereq);

  return lastSubjectsToRemove;
}
