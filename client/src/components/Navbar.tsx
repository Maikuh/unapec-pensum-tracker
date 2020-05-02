import React, { createRef, ChangeEvent } from "react";
import {
    CssBaseline,
    Toolbar,
    Typography,
    IconButton,
    Tooltip,
    AppBar,
    useScrollTrigger,
    Slide,
    makeStyles,
} from "@material-ui/core";
import {
    Github as GithubIcon,
    Gitlab as GitlabIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
} from "mdi-material-ui";
import { SearchBox } from "./SearchBox";
import { NavbarProps } from "../interfaces/props.interface";

export const Navbar = ({
    pensums,
    selectedCarreer,
    selectedSubjects,
    setSelectedSubjects,
    onCarreerSelect,
}: NavbarProps) => {
    const fileInputRef = createRef<HTMLInputElement>();

    function exportToJsonFile() {
        let dataStr = JSON.stringify(selectedSubjects);
        let dataUri =
            "data:application/json;charset=utf-8," +
            encodeURIComponent(dataStr);

        let exportFileDefaultName = "uptracker.json";

        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();

        setTimeout(() => {
            linkElement.remove();
        }, 5000);
    }

    function clickImportFromJsonInput() {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function importFromJsonFile(e: ChangeEvent<HTMLInputElement>) {
        const uploadedFile =
            e.target &&
            e.target.files &&
            e.target.files.length > 0 &&
            e.target.files[0];

        if (uploadedFile && uploadedFile.type === "application/json") {
            const reader = new FileReader();

            reader.onload = (event: any) => {
                const fileContents = event.target.result;
                localStorage.setItem("selectedSubjects", fileContents);
                setSelectedSubjects(JSON.parse(fileContents));
            };

            reader.readAsText(uploadedFile);
        } else {
            alert("Por favor seleccione un archivo valido");
        }
    }

    function HideOnScroll(params: any) {
        const { children, window } = params;
        const trigger = useScrollTrigger({
            target: window ? window() : undefined,
        });

        return (
            <Slide appear={false} direction="down" in={!trigger}>
                {children}
            </Slide>
        );
    }

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
        sectionRight: {
            alignSelf: "center",
        },
    }));

    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <HideOnScroll>
                <AppBar color="default">
                    <Toolbar className={classes.toolbar}>
                        <Typography className={classes.title} variant="h5">
                            UNAPEC Pensum Tracker
                        </Typography>

                        <SearchBox
                            pensums={pensums.map((p) => {
                                const { cuatris, totalCredits, ...rest } = p;
                                return rest;
                            })}
                            selectedCarreer={selectedCarreer}
                            selectCarreer={onCarreerSelect}
                        />

                        <div className={classes.root}></div>

                        <div className={classes.sectionRight}>
                            <Tooltip title="GitHub Repo">
                                <IconButton
                                    href="https://github.com/maikuh/unapec-pensum-tracker"
                                    target="_blank"
                                >
                                    <GithubIcon style={{ fontSize: 32 }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="GitLab Repo">
                                <IconButton
                                    href="https://gitlab.com/maikuh/unapec-pensum-tracker"
                                    target="_blank"
                                >
                                    <GitlabIcon style={{ fontSize: 32 }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Exportar datos a archivo">
                                <IconButton onClick={() => exportToJsonFile()}>
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Importar datos de archivo">
                                <IconButton
                                    onClick={() => clickImportFromJsonInput()}
                                >
                                    <UploadIcon />
                                </IconButton>
                            </Tooltip>

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(e) => importFromJsonFile(e)}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>

            <Toolbar />
        </React.Fragment>
    );
};
