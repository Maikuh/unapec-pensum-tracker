import { Pensum, Subject, Cuatri } from "./pensums.interface";
import { SelectedSubjects } from "./selectedSubjects.interface";
import { SelectAllCheckboxStatus } from "./checkbox.types";
export interface NavbarProps {
    pensums: Pensum[];
}

export interface SearchBoxProps {
    pensums: Pensum[];
}

export interface CuatriTableProps {
    cuatri: Cuatri;
    cuatris: Cuatri[];
    pensumCode: string;
    creditsCount: number;
    totalCredits: number;
}

export interface InfoCardProps {
    pensumCode: string;
    subjectsCount: number;
    totalSubjects: number;
    creditsCount: number;
    totalCredits: number;
    date: string;
}
