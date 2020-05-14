import React, { useEffect } from "react";
import { Grid, TextField, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { SearchBoxProps } from "../interfaces/props.interface";

export const SearchBox = ({
    pensums,
    selectedCarreer,
    selectCarreer,
}: SearchBoxProps) => {
    useEffect(() => {
        if (!selectedCarreer) {
            const lastSelectedCarreer = localStorage.getItem(
                "lastSelectedCarreer"
            );

            if (lastSelectedCarreer)
                onCarreerSelect(JSON.parse(lastSelectedCarreer));
        }
    });

    function onCarreerSelect(carreer: any) {
        localStorage.setItem("lastSelectedCarreer", JSON.stringify(carreer));
        selectCarreer(carreer ? carreer.pensumCode : null);
    }

    const useStyles = makeStyles((theme) => ({
        searchBoxContainer: {
            justifyContent: "center",
            marginTop: "auto",
            marginBottom: "auto",
            maxWidth: "50%",
            minWidth: "600px",
            [theme.breakpoints.down("sm")]: {
                justifyContent: "end",
                marginLeft: "auto",
                minWidth: "512px",
            },
            [theme.breakpoints.down("xs")]: {
                minWidth: "320px",
            },
        },
        searchBox: {},
    }));

    const classes = useStyles();

    return (
        <Grid
            className={classes.searchBoxContainer}
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid item style={{ width: "100%" }}>
                {selectedCarreer &&
                selectedCarreer.pensumCode &&
                selectedCarreer.pensumCode.length > 0 ? (
                    <Autocomplete
                        id="carreer-search-box"
                        autoComplete
                        autoHighlight
                        selectOnFocus
                        options={pensums}
                        getOptionLabel={(c: any) =>
                            `${c.pensumCode} - ${c.carreerName}`
                        }
                        value={pensums.find(
                            (p: any) =>
                                p.pensumCode === selectedCarreer.pensumCode
                        )}
                        className={classes.searchBox}
                        onChange={(e: any, value: any) =>
                            onCarreerSelect(value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Elegir Carrera"
                                variant="outlined"
                                autoFocus
                            />
                        )}
                    />
                ) : (
                    <Autocomplete
                        id="carreer-search-box"
                        autoComplete
                        autoHighlight
                        selectOnFocus
                        options={pensums}
                        getOptionLabel={(c: any) =>
                            `${c.pensumCode} - ${c.carreerName}`
                        }
                        className={classes.searchBox}
                        onChange={(e: any, value: any) =>
                            onCarreerSelect(value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Elegir Carrera"
                                variant="outlined"
                                autoFocus
                            />
                        )}
                    />
                )}
            </Grid>
        </Grid>
    );
};
