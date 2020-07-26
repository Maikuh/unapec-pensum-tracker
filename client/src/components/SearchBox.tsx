import React, { useEffect, useState } from "react";
import { Grid, TextField, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { SearchBoxProps } from "../interfaces/props.interface";
import { useSelectedCareer } from "../contexts/selectedCareer.context";

export const SearchBox = ({ pensums }: SearchBoxProps) => {
    const [selectedCareer, selectedCareerDispatch] = useSelectedCareer();
    const [searchBoxOptions] = useState(
        pensums.map((p) => {
            const { cuatris, totalCredits, ...rest } = p;
            return rest;
        })
    );

    useEffect(() => {
        if (!selectedCareer) {
            const lastSelectedCareer = localStorage.getItem(
                "lastSelectedCareer"
            );

            if (lastSelectedCareer)
                onCareerSelect(JSON.parse(lastSelectedCareer));
        }
    });

    function onCareerSelect(carreer: any) {
        localStorage.setItem("lastSelectedCareer", JSON.stringify(carreer));
        const pensum = carreer
            ? pensums.find((p) => p.pensumCode === carreer.pensumCode)
            : null;
        selectedCareerDispatch({ type: "select-career", payload: pensum! });
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
                {selectedCareer &&
                selectedCareer.pensumCode &&
                selectedCareer.pensumCode.length > 0 ? (
                    <Autocomplete
                        id="carreer-search-box"
                        autoComplete
                        autoHighlight
                        selectOnFocus
                        options={searchBoxOptions}
                        getOptionLabel={(c: any) =>
                            `${c.pensumCode} - ${c.carreerName}`
                        }
                        value={selectedCareer}
                        className={classes.searchBox}
                        onChange={(e: any, value: any) =>
                            onCareerSelect(value)
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
                        options={searchBoxOptions}
                        getOptionLabel={(c: any) =>
                            `${c.pensumCode} - ${c.carreerName}`
                        }
                        className={classes.searchBox}
                        onChange={(e: any, value: any) =>
                            onCareerSelect(value)
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
