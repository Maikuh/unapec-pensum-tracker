import type { Subject } from "@/types/pensum";
import { prerequisitesMet } from "./prerequisites-met";

export function getSubjectsThatCanBeSelected(
  newSelectedSubjects: Subject[],
  selectedSubjects: Subject[],
  creditsCount: number,
  totalCredits: number
): Subject[] {
  const subjectsThatCanBeSelected: Subject[] = [];

  for (const subject of newSelectedSubjects) {
    if (prerequisitesMet(subject, selectedSubjects, creditsCount, totalCredits))
      subjectsThatCanBeSelected.push(subject);
  }

  return subjectsThatCanBeSelected;
}
