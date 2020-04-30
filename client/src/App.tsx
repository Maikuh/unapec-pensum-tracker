import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    createMuiTheme,
    ThemeProvider,
    Slide,
    useScrollTrigger,
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    makeStyles,
} from "@material-ui/core";
import "./App.css";
import { SearchBox } from "./components/SearchBox";
import pensums from "./pensums.json";
import { CuatriTable } from "./components/CuatriTable";
import { InfoCard } from "./components/InfoCard";

const savedSelectedSubjects = localStorage.getItem("selectedSubjects");
const defaultSelectedSubjects: any = savedSelectedSubjects
    ? JSON.parse(savedSelectedSubjects)
    : {};

console.log("defaultSelectedSubjects", defaultSelectedSubjects);

if (Object.keys(defaultSelectedSubjects).length === 0) {
    for (const pensum of pensums) {
        defaultSelectedSubjects[pensum.pensumCode] = [];
    }
}

function App() {
    const [selectedCarreer, setSelectedCarreer]: any[] = useState({});
    // const [selectedSubjects, setSelectedSubjects]: any = useState({});
    const [selectedSubjects, setSelectedSubjects]: any = useState(
        defaultSelectedSubjects
    );

    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
        },
    });

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        toolbar: {
            minHeight: 128,
            alignItems: "flex-start",
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        title: {
            flexGrow: 1,
            alignSelf: "center",
        },
    }));

    const classes = useStyles();

    function onCarreerSelect(carreer: any) {
        setSelectedCarreer(carreer);
    }

    function onSubjectSelected(subject: any) {
        const temp = selectedSubjects[selectedCarreer.pensumCode].some(
            (ss: any) => ss.code === subject.code
        )
            ? selectedSubjects[selectedCarreer.pensumCode].filter(
                  (s: any) => s.code !== subject.code
              )
            : selectedSubjects[selectedCarreer.pensumCode].concat(subject);

        setSelectedSubjects({
            ...selectedSubjects,
            [selectedCarreer.pensumCode]: temp,
        });
    }

    function HideOnScroll(props: any) {
        const { children, window } = props;
        const trigger = useScrollTrigger({
            target: window ? window() : undefined,
        });

        return (
            <Slide appear={false} direction="down" in={!trigger}>
                {children}
            </Slide>
        );
    }

    useEffect(() => {
        // if (Object.keys(selectedSubjects).length === 0)
        //     setSelectedSubjects(defaultSelectedSubjects);
        localStorage.setItem(
            "selectedSubjects",
            JSON.stringify(selectedSubjects)
        );
        console.log("selectedSubjects", selectedSubjects);
    }, [selectedCarreer, selectedSubjects]);

    return (
        <React.Fragment>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <HideOnScroll>
                    <AppBar color="default">
                        <Toolbar className={classes.toolbar}>
                            <Typography className={classes.title} variant="h5">
                                UNAPEC Pensum Tracker
                            </Typography>

                            <SearchBox
                                pensums={pensums}
                                selectedCarreer={selectedCarreer}
                                selectCarreer={onCarreerSelect}
                            />
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Toolbar />
                <Container fixed className="App">
                    {selectedCarreer &&
                        selectedCarreer.cuatris &&
                        selectedCarreer.cuatris.length > 0 && (
                            <InfoCard
                                subjectsCount={
                                    selectedSubjects[selectedCarreer.pensumCode]
                                        .length
                                }
                                totalSubjects={selectedCarreer.cuatris.reduce(
                                    (acc: number, item: any) =>
                                        acc + item.subjects.length,
                                    0
                                )}
                                creditsCount={selectedSubjects[
                                    selectedCarreer.pensumCode
                                ].reduce(
                                    (acc: number, item: any) =>
                                        acc + item.credits,
                                    0
                                )}
                                totalCredits={selectedCarreer.cuatris.reduce(
                                    (acc: number, cuatri: any) =>
                                        acc +
                                        cuatri.subjects.reduce(
                                            (acc2: any, sub: any) =>
                                                acc2 + sub.credits,
                                            0
                                        ),
                                    0
                                )}
                            />
                        )}

                    <Grid container spacing={2} style={{ flexGrow: 1 }}>
                        {selectedCarreer &&
                            selectedCarreer.cuatris &&
                            selectedCarreer.cuatris.length > 0 &&
                            selectedCarreer.cuatris.map((c: any, i: number) => (
                                <Grid item xs={6} key={c.period}>
                                    <CuatriTable
                                        cuatri={c}
                                        cuatris={selectedCarreer.cuatris}
                                        pensumCode={selectedCarreer.pensumCode}
                                        selectedSubjects={selectedSubjects}
                                        subjectSelected={onSubjectSelected}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </Container>
            </ThemeProvider>
        </React.Fragment>
    );
}

export default App;
