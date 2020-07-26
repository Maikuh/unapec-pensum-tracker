import React, { useEffect } from "react";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import "./App.css";
import pensumsJson from "./pensums.json";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { MainContent } from "./components/MainContent";
import { SelectedSubjects } from "./interfaces/selectedSubjects.interface";
import { Pensum } from "./interfaces/pensums.interface";
import BackToTop from "./components/BackToTop";
import {
    SelectedCareerProvider,
} from "./contexts/selectedCareer.context";
import {
    useSelectedSubjects,
    SelectedSubjectsProvider,
} from "./contexts/selectedSubjects.context";

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
    const [selectedSubjects] = useSelectedSubjects();

    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
        },
    });

    useEffect(() => {
        localStorage.setItem(
            "selectedSubjects",
            JSON.stringify(selectedSubjects)
        );
    });

    return (
        <React.Fragment>
            <ThemeProvider theme={darkTheme}>
                <SelectedCareerProvider>
                    <SelectedSubjectsProvider>
                        <Navbar pensums={pensums} />

                        <Container fixed className="App">
                            <MainContent />

                            <Footer />
                        </Container>
                    </SelectedSubjectsProvider>
                </SelectedCareerProvider>

                <BackToTop />
            </ThemeProvider>
        </React.Fragment>
    );
}

export default App;
