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

function App() {
    const [selectedCarreer, setSelectedCarreer]: any[] = useState({});
    const [selectedSubjects, setSelectedSubjects]: [any[], any] = useState([]);

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
        setSelectedSubjects(
            selectedSubjects.some((ss) => ss.code === subject.code)
                ? selectedSubjects.filter((s) => s.code !== subject.code)
                : selectedSubjects.concat(subject)
        );
    }

    function HideOnScroll(props: any) {
        const { children, window } = props;
        // Note that you normally won't need to set the window ref as useScrollTrigger
        // will default to window.
        // This is only being set here because the demo is in an iframe.
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
        console.log(`SELECTED CARREER`, selectedCarreer);
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
                                selectedValue={selectedCarreer}
                                selectCarreer={onCarreerSelect}
                            />
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Toolbar />
                <Container fixed className="App">
                    {/* <SearchBox
                        pensums={pensums}
                        selectCarreer={onCarreerSelect}
                    /> */}

                    <Grid container spacing={2} style={{ flexGrow: 1 }}>
                        {selectedCarreer &&
                            selectedCarreer.cuatris &&
                            selectedCarreer.cuatris.length > 0 &&
                            selectedCarreer.cuatris.map((c: any, i: number) => (
                                <Grid item xs={6} key={c.period}>
                                    <CuatriTable
                                        cuatri={c}
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
