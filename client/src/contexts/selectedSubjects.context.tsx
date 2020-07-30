import React, { useEffect } from "react";
import { SelectedSubjects } from "../interfaces/selectedSubjects.interface";
import { getAllPrerequisiteSubjects } from "../helpers/getAllPrerequisiteSubjects";
import pensumsJson from "../pensums.json";
import { Subject } from "../interfaces/pensums.interface";
import { useImportExport } from "./importExportContext";
import getSelectedSubjectsInLocalStorage from "../helpers/getSelectedSubjectsInLocalStorage";

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
              type: Key;
          }
        : {
              type: Key;
              payload: M[Key];
          };
};

type SelectedSubjectsPayload = {
    "select-subject": {
        pensumCode: string;
        subject: Subject;
    };
    "bulk-select": {
        pensumCode: string;
        newSelectedSubjects: Subject[];
        periodSubjectsCount: number;
        checkboxStatus: "unchecked" | "indeterminate" | "checked" | "disabled";
    };
    "import-from-file": {
        importedSelectedSubjects: SelectedSubjects;
    };
};

type SelectedSubjectsAction = ActionMap<
    SelectedSubjectsPayload
>[keyof ActionMap<SelectedSubjectsPayload>];

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
): SelectedSubjects {
    switch (action.type) {
        case "import-from-file": {
            const { importedSelectedSubjects } = action.payload;
            
            // Remove the item in localStorage, else there will be a loop since ImportExport's
            // initial state is 0 and for some reason, parsing "null" as a number === 0
            // Could also be fixed by also making the initial state a random number
            localStorage.removeItem("importRandomNumber");
            return importedSelectedSubjects!;
        }
        case "select-subject": {
            const { pensumCode, subject } = action.payload;

            if (!pensumCode || !subject) {
                console.error("Missing variables");
                return state;
            }

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
            const {
                pensumCode,
                newSelectedSubjects,
                periodSubjectsCount,
                checkboxStatus
            } = action.payload;

            if (!pensumCode || !newSelectedSubjects || !periodSubjectsCount) {
                console.error("Missing variables");
                return state;
            }

            const notInSelectedSubjects: Subject[] = [];
            const subjects = state[pensumCode];
            let temp: Subject[] = [];

            if (checkboxStatus === "unchecked") {
                temp = subjects.concat(...newSelectedSubjects);
            } else if (checkboxStatus === "indeterminate") {
                if (newSelectedSubjects.length < periodSubjectsCount) {
                    let subjectsToRemove = newSelectedSubjects.map(
                        (newSelectedSubject: Subject) => newSelectedSubject.code
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
                    newSelectedSubjects.forEach(
                        (newSelectedSubject: Subject) => {
                            const isInSelectedSubjects = subjects.some(
                                (subject: Subject) =>
                                    subject.code === newSelectedSubject.code
                            );

                            if (!isInSelectedSubjects)
                                notInSelectedSubjects.push(newSelectedSubject);
                        }
                    );

                    temp = subjects.concat(...notInSelectedSubjects);
                }
            } else if (checkboxStatus === "checked") {
                let subjectsToRemove = newSelectedSubjects.map(
                    (nss: Subject) => nss.code
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
            throw new Error(`Unhandled action type: ${action!.type}`);
        }
    }
}

function SelectedSubjectsProvider({ children }: { children: React.ReactNode }) {
    const defaultSelectedSubjects = getSelectedSubjectsInLocalStorage(
        pensumsJson
    );

    let [state, dispatch] = React.useReducer(
        selectedSubjectsReducer,
        defaultSelectedSubjects
    );

    const [importExportState] = useImportExport();

    useEffect(() => {
        const strImportRandomNumber = localStorage.getItem(
            "importRandomNumber"
        );

        // This will run everytime the component is re-rendered, specifically as an effect
        // of the ImportExport Context
        if (
            strImportRandomNumber &&
            importExportState === Number(strImportRandomNumber)
        ) {
            dispatch({
                type: "import-from-file",
                payload: { importedSelectedSubjects: defaultSelectedSubjects },
            });
        }

        // This will save the state to localStorage each time there's a change in it
        localStorage.setItem("selectedSubjects", JSON.stringify(state));
    });

    return (
        <>
            <SelectedSubjectsStateContext.Provider value={state}>
                <SelectedSubjectsDispatchContext.Provider value={dispatch}>
                    {children}
                </SelectedSubjectsDispatchContext.Provider>
            </SelectedSubjectsStateContext.Provider>
        </>
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
