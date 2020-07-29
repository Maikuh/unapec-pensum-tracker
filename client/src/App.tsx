import React from "react";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import "./App.css";
import pensumsJson from "./pensums.json";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { MainContent } from "./components/MainContent";
import { Pensum } from "./interfaces/pensums.interface";
import BackToTop from "./components/BackToTop";
import { SelectedCareerProvider } from "./contexts/selectedCareer.context";
import { SelectedSubjectsProvider } from "./contexts/selectedSubjects.context";

function App() {
    const pensums: Pensum[] = pensumsJson;

    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
        },
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
