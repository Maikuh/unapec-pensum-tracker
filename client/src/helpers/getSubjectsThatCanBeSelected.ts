import { Subject } from "../interfaces/pensums.interface";
import prerequisitesMet from "./prerequisitesMet";

export default function (
    subjects: Subject[],
    creditsCount: number,
    totalCredits: number
) {
    const subjectsThatCanBeSelected = [];

    for (const subject of subjects) {
        if (prerequisitesMet(subject, subjects, creditsCount, totalCredits))
            subjectsThatCanBeSelected.push(subject);
    }

    return subjectsThatCanBeSelected;
}
