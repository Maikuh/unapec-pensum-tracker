import React, { createRef, ChangeEvent, useState } from "react";
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
    Hidden,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    Link,
} from "@material-ui/core";
import {
    Github as GithubIcon,
    Gitlab as GitlabIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Menu as MenuIcon,
} from "mdi-material-ui";
import { SearchBox } from "./SearchBox";
import { NavbarProps } from "../interfaces/props.interface";
import { useSelectedSubjects } from "../contexts/selectedSubjects.context";

export const Navbar = ({ pensums }: NavbarProps) => {
    const [selectedSubjects, selectedSubjectsDispatch] = useSelectedSubjects();
    const fileInputRef = createRef<HTMLInputElement>();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();

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
                selectedSubjectsDispatch({
                    type: "import-from-file",
                    payload: {
                        importedSelectedSubjects: JSON.parse(fileContents),
                    },
                });
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

    const drawerWidth = 240;

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        drawer: {
            [theme.breakpoints.up("sm")]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        drawerPaper: {
            width: drawerWidth,
        },
        menuButton: {
            marginRight: theme.spacing(2),
            // [theme.breakpoints.up("md")]: {
            //     display: "none",
            // },
        },
        toolbar: {
            minHeight: 128,
            alignItems: "center",
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        title: {
            flexGrow: 1,
            alignSelf: "center",
            [theme.breakpoints.down("sm")]: {
                display: "none",
            },
        },
        drawerContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
        },
        drawerList: {
            flexGrow: 1,
        },
        drawerFooter: {
            alignSelf: "center",
            padding: "1em",
            textAlign: "center",
        },
        mobileTitle: {
            alignSelf: "center",
            padding: "1em",
        },
        sectionRight: {
            flexGrow: 1,
            alignSelf: "center",
            textAlign: "right",
            [theme.breakpoints.down("sm")]: {
                display: "none",
            },
        },
    }));

    const classes = useStyles();

    const drawer = (
        <div className={classes.drawerContainer}>
            <Typography className={classes.mobileTitle} variant="h5">
                UNAPEC Pensum Tracker
            </Typography>
            <Divider />
            <List className={classes.drawerList}>
                {[
                    "GitHub Repo",
                    "GitLab Repo",
                    "Exportar datos",
                    "Importar datos",
                ].map((text, index) => {
                    let link, icon;

                    switch (index) {
                        case 0:
                            link =
                                "https://github.com/maikuh/unapec-pensum-tracker";
                            icon = <GithubIcon />;
                            break;
                        case 1:
                            link =
                                "https://gitlab.com/maikuh/unapec-pensum-tracker";
                            icon = <GitlabIcon />;
                            break;
                        case 2:
                            icon = <DownloadIcon />;
                            break;
                        case 3:
                            icon = <UploadIcon />;
                            break;
                        default:
                            break;
                    }

                    return (
                        <ListItem
                            button
                            component="a"
                            key={text}
                            onClick={() =>
                                index === 2
                                    ? exportToJsonFile()
                                    : index === 3
                                    ? clickImportFromJsonInput()
                                    : null
                            }
                            href={link}
                            target="_blank"
                        >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    );
                })}
            </List>

            <div className={classes.drawerFooter}>
                <Typography variant="body1">by Miguel Araujo</Typography>
                <Typography variant="body2">
                    <Link href="https://github.com/maikuh" target="_blank">
                        GitHub
                    </Link>{" "}
                    /{" "}
                    <Link href="https://gitlab.com/maikuh" target="_blank">
                        GitLab
                    </Link>
                </Typography>
            </div>
        </div>
    );

    const container =
        window !== undefined ? () => window.document.body : undefined;

    return (
        <React.Fragment>
            <CssBaseline />

            <HideOnScroll>
                <AppBar color="default">
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setDrawerOpen(!drawerOpen)}
                            className={classes.menuButton}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>

                        <Typography className={classes.title} variant="h5">
                            UNAPEC Pensum Tracker
                        </Typography>

                        <SearchBox pensums={pensums} />

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

            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === "rtl" ? "right" : "left"}
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(!drawerOpen)}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="temporary"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(!drawerOpen)}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>

            <Toolbar id="back-to-top-anchor" />
        </React.Fragment>
    );
};
