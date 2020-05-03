import { Subject } from "../interfaces/pensums.interface";
import prerequisitesMet from "./prerequisitesMet";

export default function (
    newSelectedSubjects: Subject[],
    selectedSubjects: Subject[],
    creditsCount: number,
    totalCredits: number
) {
    const subjectsThatCanBeSelected = [];

    for (const subject of newSelectedSubjects) {
        if (
            prerequisitesMet(
                subject,
                selectedSubjects,
                creditsCount,
                totalCredits
            )
        )
            subjectsThatCanBeSelected.push(subject);
    }

    return subjectsThatCanBeSelected;
}
