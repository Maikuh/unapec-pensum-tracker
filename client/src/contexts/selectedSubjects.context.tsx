import React from "react";
import { SelectedSubjects } from "../interfaces/selectedSubjects.interface";
import { getAllPrerequisiteSubjects } from "../helpers/getAllPrerequisiteSubjects";
import pensumsJson from "../pensums.json";
import { Subject } from "../interfaces/pensums.interface";

type SelectedSubjectsAction = {
    type: "select-subject" | "bulk-select";
    payload: {
        pensumCode: string;
        subject: Subject;
        newSelectedSubjects: Subject[];
        periodSubjectsCount: number;
        checkboxStatus: "unchecked" | "indeterminate" | "checked";
    };
};

type SelectedSubjectsDispatch = (action: SelectedSubjectsAction) => void;

const SelectedSubjectsStateContext = React.createContext<
    SelectedSubjects | undefined
>(undefined);

const SelectedSubjectsDispatchContext = React.createContext<
    SelectedSubjectsDispatch | undefined
>(undefined);

function selectedSubjectsReducer(
    state: SelectedSubjects,
    action: SelectedSubjectsAction
) {
    const {
        pensumCode,
        subject,
        newSelectedSubjects,
        periodSubjectsCount,
        checkboxStatus,
    } = action.payload;

    switch (action.type) {
        case "select-subject": {
            // Temporary variable to hold changes
            let temp: Subject[];
            const subjects = state[pensumCode];
            let subjectsToRemove: string[] = [];

            // If subject has already been selected, remove it
            if (
                subjects.some(
                    (selectedSubject: Subject) =>
                        selectedSubject.code === subject.code
                )
            ) {
                // Add the subject to the removal list
                subjectsToRemove.push(subject.code);

                for (const subjectToRemove of subjectsToRemove) {
                    subjectsToRemove = getAllPrerequisiteSubjects(
                        subjects,
                        subjectToRemove,
                        subjectsToRemove
                    );
                }

                subjectsToRemove = [...new Set(subjectsToRemove)];

                temp = subjects.filter(
                    (ss: Subject) => !subjectsToRemove.includes(ss.code)
                );
            } // Select it
            else {
                temp = subjects.concat(subject);
            }

            return {
                ...state,
                [pensumCode]: temp,
            };
        }
        case "bulk-select": {
            const notInSelectedSubjects: Subject[] = [];
            const subjects = state[pensumCode];
            let temp: Subject[] = [];

            if (checkboxStatus === "unchecked") {
                temp = subjects.concat(...newSelectedSubjects);
            } else if (checkboxStatus === "indeterminate") {
                if (newSelectedSubjects.length < periodSubjectsCount) {
                    let subjectsToRemove = newSelectedSubjects.map(
                        (newSelectedSubject) => newSelectedSubject.code
                    );

                    for (const subjectToRemove of subjectsToRemove) {
                        subjectsToRemove = getAllPrerequisiteSubjects(
                            subjects,
                            subjectToRemove,
                            subjectsToRemove
                        );
                    }

                    subjectsToRemove = [...new Set(subjectsToRemove)];

                    temp = subjects.filter(
                        (subject: Subject) =>
                            !subjectsToRemove.includes(subject.code)
                    );
                } else {
                    newSelectedSubjects.forEach((newSelectedSubject) => {
                        const isInSelectedSubjects = subjects.some(
                            (subject: Subject) =>
                                subject.code === newSelectedSubject.code
                        );

                        if (!isInSelectedSubjects)
                            notInSelectedSubjects.push(newSelectedSubject);
                    });

                    temp = subjects.concat(...notInSelectedSubjects);
                }
            } else if (checkboxStatus === "checked") {
                let subjectsToRemove = newSelectedSubjects.map(
                    (nss) => nss.code
                );

                for (const subjectToRemove of subjectsToRemove) {
                    subjectsToRemove = getAllPrerequisiteSubjects(
                        subjects,
                        subjectToRemove,
                        subjectsToRemove
                    );
                }

                subjectsToRemove = [...new Set(subjectsToRemove)];

                temp = subjects.filter(
                    (subject: Subject) =>
                        !subjectsToRemove.includes(subject.code)
                );
            }
            
            return {
                ...state,
                [pensumCode]: temp,
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

const savedSelectedSubjects = localStorage.getItem("selectedSubjects");
const defaultSelectedSubjects: SelectedSubjects = savedSelectedSubjects
    ? JSON.parse(savedSelectedSubjects)
    : {};

if (Object.keys(defaultSelectedSubjects).length === 0) {
    for (const pensum of pensumsJson) {
        defaultSelectedSubjects[pensum.pensumCode] = [];
    }
}

function SelectedSubjectsProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(
        selectedSubjectsReducer,
        defaultSelectedSubjects
    );

    return (
        <SelectedSubjectsStateContext.Provider value={state}>
            <SelectedSubjectsDispatchContext.Provider value={dispatch}>
                {children}
            </SelectedSubjectsDispatchContext.Provider>
        </SelectedSubjectsStateContext.Provider>
    );
}

function useSelectedSubjectsState() {
    const context = React.useContext(SelectedSubjectsStateContext);
    if (context === undefined) {
        throw new Error(
            "useSelectedSubjectsState must be used within a SelectedSubjectsProvider"
        );
    }
    return context;
}

function useSelectedSubjectsDispatch() {
    const context = React.useContext(SelectedSubjectsDispatchContext);
    if (context === undefined) {
        throw new Error(
            "useSelectedSubjectsDispatch must be used within a SelectedSubjectsProvider"
        );
    }
    return context;
}

function useSelectedSubjects(): [SelectedSubjects, SelectedSubjectsDispatch] {
    return [useSelectedSubjectsState(), useSelectedSubjectsDispatch()];
}

export { SelectedSubjectsProvider, useSelectedSubjects };
