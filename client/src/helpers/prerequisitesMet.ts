import { Subject } from "../interfaces/pensums.interface";

export default function prerequisitesMet(
    subject: Subject,
    selectedSubjects: Subject[],
    creditsCount: number,
    totalCredits: number
) {
    let isMet: boolean =
        subject.prerequisites.length === 0
            ? true
            : subject.prerequisites.every((p: string) =>
                  p.includes("%")
                      ? Math.round((creditsCount / totalCredits) * 100) >=
                        Number(p.slice(0, 2))
                      : selectedSubjects.map((s: any) => s.code).includes(p)
              );

    return isMet;
}
