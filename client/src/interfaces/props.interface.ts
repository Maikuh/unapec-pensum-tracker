import { Pensum, Subject, Cuatri } from "./pensums.interface";
import { SelectedSubjects } from "./selectedSubjects.interface";

export interface MainContentProps {
    selectedCarreer: Pensum | null;
    selectedSubjects: SelectedSubjects;
    onSubjectSelected: (subject: Subject, subjectsToRemove?: string[]) => void;
}

export interface NavbarProps {
    selectedCarreer: Pensum | null;
    selectedSubjects: SelectedSubjects;
    pensums: Pensum[];
    setSelectedSubjects: (selectedSubjects: SelectedSubjects) => void;
    onCarreerSelect: (pensumCode: string) => void;
}

export interface SearchBoxProps {
    pensums: Partial<Pensum>[];
    selectedCarreer: Pensum | null;
    selectCarreer: (pensumCode: string) => void;
}

export interface CuatriTableProps {
    cuatri: Cuatri;
    cuatris: Cuatri[];
    pensumCode: string;
    selectedSubjects: SelectedSubjects;
    creditsCount: number;
    totalCredits: number;
    subjectSelected: (subject: Subject, subjectsToRemove?: string[]) => void;
}

export interface InfoCardProps {
    subjectsCount: number;
    totalSubjects: number;
    creditsCount: number;
    totalCredits: number;
}
