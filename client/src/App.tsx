import React, { useState, useEffect } from "react";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import "./App.css";
import pensums from "./pensums.json";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { MainContent } from "./components/MainContent";

const savedSelectedSubjects = localStorage.getItem("selectedSubjects");
const defaultSelectedSubjects: any = savedSelectedSubjects
    ? JSON.parse(savedSelectedSubjects)
    : {};

if (Object.keys(defaultSelectedSubjects).length === 0) {
    for (const pensum of pensums) {
        defaultSelectedSubjects[pensum.pensumCode] = [];
    }
}

function App() {
    const [selectedCarreer, setSelectedCarreer]: any[] = useState({});
    const [selectedSubjects, setSelectedSubjects]: any = useState(
        defaultSelectedSubjects
    );

    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
        },
    });

    function onCarreerSelect(pensumCode: string) {
        setSelectedCarreer(pensums.find((p) => p.pensumCode === pensumCode));
    }

    function onSubjectSelected(subject: any, subjectsToRemove: any[] = []) {
        // Temporary variable to hold changes
        let temp = {};

        // If subject has already been selected, remove it
        if (
            selectedSubjects[selectedCarreer.pensumCode].some(
                (ss: any) => ss.code === subject.code
            )
        ) {
            // Add the subject to the removal list
            subjectsToRemove.push(subject.code);

            // Check if any of the other subjects has this subject as prerequisite
            const subjectWithPrereq = selectedSubjects[
                selectedCarreer.pensumCode
            ].find((ss: any) => ss.prerequisites.includes(subject.code));

            if (subjectWithPrereq) {
                // if true, then recursively execute function to find other subjects in the chain
                onSubjectSelected(subjectWithPrereq, subjectsToRemove);
            } else {
                // if false, then no more subjects in the chain left, start removing
                temp = selectedSubjects[selectedCarreer.pensumCode].filter(
                    (ss: any) => !subjectsToRemove.includes(ss.code)
                );

                setSelectedSubjects({
                    ...selectedSubjects,
                    [selectedCarreer.pensumCode]: temp,
                });
            }
        } // Select it
        else {
            temp = selectedSubjects[selectedCarreer.pensumCode].concat(subject);
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
