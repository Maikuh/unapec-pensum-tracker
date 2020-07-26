import React, { useState, useEffect } from "react";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import "./App.css";
import pensumsJson from "./pensums.json";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { MainContent } from "./components/MainContent";
import { SelectedSubjects } from "./interfaces/selectedSubjects.interface";
import { Pensum, Subject } from "./interfaces/pensums.interface";
import { SelectAllCheckboxStatus } from "./interfaces/checkbox.types";
import { getAllPrerequisiteSubjects } from "./helpers/getAllPrerequisiteSubjects";
import BackToTop from "./components/BackToTop";
import { useSelectedCareer, SelectedCareerProvider } from "./contexts/selectedCareer.context";

const savedSelectedSubjects = localStorage.getItem("selectedSubjects");
const defaultSelectedSubjects: SelectedSubjects = savedSelectedSubjects
    ? JSON.parse(savedSelectedSubjects)
    : {};

if (Object.keys(defaultSelectedSubjects).length === 0) {
    for (const pensum of pensumsJson) {
        defaultSelectedSubjects[pensum.pensumCode] = [];
    }
}

function App() {
    const pensums: Pensum[] = pensumsJson;
    const [selectedCarreer] = useSelectedCareer();
    const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>(
        defaultSelectedSubjects
    );

    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
        },
    });

    function handleBulkSelect(
        newSelectedSubjects: Subject[],
        checkboxStatus: SelectAllCheckboxStatus,
        cuatriSubjectsCount: number
    ) {
        if (!selectedCarreer.pensumCode) return;

        const notInSelectedSubjects: Subject[] = [];
        const subjects = selectedSubjects[selectedCarreer.pensumCode];
        let temp: Subject[] = [];

        if (checkboxStatus === "unchecked") {
            temp = subjects.concat(...newSelectedSubjects);
        } else if (checkboxStatus === "indeterminate") {
            if (newSelectedSubjects.length < cuatriSubjectsCount) {
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
            let subjectsToRemove = newSelectedSubjects.map((nss) => nss.code);

            for (const subjectToRemove of subjectsToRemove) {
                subjectsToRemove = getAllPrerequisiteSubjects(
                    subjects,
                    subjectToRemove,
                    subjectsToRemove
                );
            }

            subjectsToRemove = [...new Set(subjectsToRemove)];

            temp = subjects.filter(
                (subject: Subject) => !subjectsToRemove.includes(subject.code)
            );
        }

        setSelectedSubjects({
            ...selectedSubjects,
            [selectedCarreer.pensumCode]: temp,
        });
    }

    function onSubjectSelected(
        subject: Subject,
        subjectsToRemove: string[] = []
    ) {
        if (!selectedCarreer.pensumCode) return;

        // Temporary variable to hold changes
        let temp: Subject[];
        const subjects = selectedSubjects[selectedCarreer.pensumCode];

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

            setSelectedSubjects({
                ...selectedSubjects,
                [selectedCarreer.pensumCode]: temp,
            });
        } // Select it
        else {
            temp = subjects.concat(subject);

            setSelectedSubjects({
                ...selectedSubjects,
                [selectedCarreer.pensumCode]: temp,
            });
        }
    }

    useEffect(() => {
        localStorage.setItem(
            "selectedSubjects",
            JSON.stringify(selectedSubjects)
        );
    }, [selectedSubjects]);

    return (
        <React.Fragment>
            <ThemeProvider theme={darkTheme}>
                <SelectedCareerProvider>
                    <Navbar
                        pensums={pensums}
                        selectedSubjects={selectedSubjects}
                        setSelectedSubjects={setSelectedSubjects}
                    />
                </SelectedCareerProvider>

                <Container fixed className="App">
                    <MainContent
                        selectedSubjects={selectedSubjects}
                        onSubjectSelected={onSubjectSelected}
                        onSubjectSelectedBulk={handleBulkSelect}
                    />

                    <Footer />
                </Container>

                <BackToTop />
            </ThemeProvider>
        </React.Fragment>
    );
}

export default App;
