import React, { useState, useEffect } from "react";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import "./App.css";
import pensumsJson from "./pensums.json";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { MainContent } from "./components/MainContent";
import { SelectedSubjects } from "./interfaces/selectedSubjects.interface";
import { Pensum, Subject } from "./interfaces/pensums.interface";

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
    const [selectedCarreer, setSelectedCarreer] = useState<Pensum | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>(
        defaultSelectedSubjects
    );

    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
        },
    });

    function onCarreerSelect(pensumCode: string) {
        const carreer = pensums.find((p) => p.pensumCode === pensumCode);
        setSelectedCarreer(carreer!);
    }

    function onSubjectSelected(
        subject: Subject,
        subjectsToRemove: string[] = []
    ) {
        if (!selectedCarreer) return;

        // Temporary variable to hold changes
        let temp: Subject[];
        const subjects = selectedSubjects[selectedCarreer.pensumCode];

        // If subject has already been selected, remove it
        if (subjects.some((ss) => ss.code === subject.code)) {
            // Add the subject to the removal list
            subjectsToRemove.push(subject.code);

            // Check if any of the other subjects has this subject as prerequisite
            const subjectWithPrereq = subjects.find((ss) =>
                ss.prerequisites.includes(subject.code)
            );

            if (subjectWithPrereq) {
                // if true, then recursively execute function to find other subjects in the chain
                onSubjectSelected(subjectWithPrereq, subjectsToRemove);
            } else {
                // if false, then no more subjects in the chain left, start removing
                temp = subjects.filter(
                    (ss) => !subjectsToRemove.includes(ss.code)
                );

                setSelectedSubjects({
                    ...selectedSubjects,
                    [selectedCarreer.pensumCode]: temp,
                });
            }
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
    }, [selectedCarreer, selectedSubjects]);

    return (
        <React.Fragment>
            <ThemeProvider theme={darkTheme}>
                <Navbar
                    pensums={pensums}
                    selectedCarreer={selectedCarreer}
                    selectedSubjects={selectedSubjects}
                    onCarreerSelect={onCarreerSelect}
                    setSelectedSubjects={setSelectedSubjects}
                />

                <Container fixed className="App">
                    <MainContent
                        selectedCarreer={selectedCarreer}
                        selectedSubjects={selectedSubjects}
                        onSubjectSelected={onSubjectSelected}
                    />

                    <Footer />
                </Container>
            </ThemeProvider>
        </React.Fragment>
    );
}

export default App;
