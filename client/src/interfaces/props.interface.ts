import { Pensum, Subject, Cuatri } from "./pensums.interface";
import { SelectedSubjects } from "./selectedSubjects.interface";
import { SelectAllCheckboxStatus } from "./checkbox.types";

export interface MainContentProps {
    selectedSubjects: SelectedSubjects;
    onSubjectSelected: (subject: Subject, subjectsToRemove?: string[]) => void;
    onSubjectSelectedBulk: (
        newSelectedSubjects: Subject[],
        checkboxStatus: SelectAllCheckboxStatus,
        cuatriSubjectsCount: number
    ) => void;
}

export interface NavbarProps {
    selectedSubjects: SelectedSubjects;
    pensums: Pensum[];
    setSelectedSubjects: (selectedSubjects: SelectedSubjects) => void;
}

export interface SearchBoxProps {
    pensums: Pensum[];
}

export interface CuatriTableProps {
    cuatri: Cuatri;
    cuatris: Cuatri[];
    pensumCode: string;
    selectedSubjects: SelectedSubjects;
    creditsCount: number;
    totalCredits: number;
    subjectSelected: (subject: Subject, subjectsToRemove?: string[]) => void;
    onSubjectSelectedBulk: (
        newSelectedSubjects: Subject[],
        checkboxStatus: SelectAllCheckboxStatus,
        cuatriSubjectsCount: number
    ) => void;
}

export interface InfoCardProps {
    pensumCode: string;
    subjectsCount: number;
    totalSubjects: number;
    creditsCount: number;
    totalCredits: number;
    date: string;
}
