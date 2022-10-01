import { SelectedSubjects } from "../interfaces/selectedSubjects.interface";
import { Pensum } from "../interfaces/pensums.interface";

export default function getSelectedSubjectsInLocalStorage(pensumsJson?: Pensum[]) {
    const savedSelectedSubjects = localStorage.getItem("selectedSubjects");
    const defaultSelectedSubjects: SelectedSubjects = savedSelectedSubjects
        ? JSON.parse(savedSelectedSubjects)
        : {};

    if (pensumsJson && Object.keys(defaultSelectedSubjects).length === 0) {
        for (const pensum of pensumsJson) {
            defaultSelectedSubjects[pensum.pensumCode] = [];
        }
    }

    return defaultSelectedSubjects;
}
