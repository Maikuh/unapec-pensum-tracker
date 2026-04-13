import type { Subject } from "@/types/pensum";

export function prerequisitesMet(
  subject: Subject,
  selectedSubjects: Subject[],
  creditsCount: number,
  totalCredits: number
): boolean {
  return subject.prerequisites.length === 0
    ? true
    : subject.prerequisites.every((p: string) =>
        p.includes("%")
          ? Math.round((creditsCount / totalCredits) * 100) >=
            Number(p.slice(0, 2))
          : selectedSubjects.map((s) => s.code).includes(p)
      );
}
