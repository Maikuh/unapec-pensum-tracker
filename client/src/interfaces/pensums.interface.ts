export interface Subject {
    code: string;
    name: string;
    credits: number;
    prerequisites: string[];
}

export interface Cuatri {
    period: number;
    subjects: Subject[];
}

export interface Pensum {
    carreerName: string;
    totalCredits: number;
    pensumCode: string;
    cuatris: Cuatri[];
}
