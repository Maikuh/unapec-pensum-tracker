import React, { useEffect, useState } from "react";
import { Grid, TextField, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { SearchBoxProps } from "../interfaces/props.interface";
import { useSelectedCareer } from "../contexts/selectedCareer.context";

export const SearchBox = ({ pensums }: SearchBoxProps) => {
    const [selectedCareer, selectedCareerDispatch] = useSelectedCareer();
    const [searchBoxOptions] = useState(
        pensums.map((pensum) => {
            const { cuatris, totalCredits, date, ...rest } = pensum;
            return rest;
        })
    );
    const [searchBoxValue, setSearchBoxValue] = useState<{
        pensumCode: string;
        carreerName: string;
    } | null>(null);

    useEffect(() => {
        if (!selectedCareer || !selectedCareer.pensumCode) {
            const lastSelectedCareer = localStorage.getItem(
                "lastSelectedCareer"
            );

            if (lastSelectedCareer)
                onCareerSelect(JSON.parse(lastSelectedCareer));
        } else {
            const { cuatris, totalCredits, date, ...rest } = selectedCareer;
            setSearchBoxValue(rest);
        }
    }, []);

    function onCareerSelect(career: any) {
        if (career) {
            localStorage.setItem("lastSelectedCareer", JSON.stringify(career));
        } else {
            localStorage.removeItem("lastSelectedCareer");
        }

        const pensum = career
            ? pensums.find((p) => p.pensumCode === career.pensumCode)
            : null;
        selectedCareerDispatch({ type: "select-career", payload: pensum! });

        if (pensum) {
            const { cuatris, totalCredits, date, ...rest } = pensum;
            setSearchBoxValue(rest);
        } else setSearchBoxValue(null);
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
                <Autocomplete
                    id="carreer-search-box"
                    autoComplete
                    autoHighlight
                    selectOnFocus
                    options={searchBoxOptions}
                    getOptionLabel={(c: any) =>
                        `${c.pensumCode} - ${c.carreerName}`
                    }
                    value={searchBoxValue}
                    className={classes.searchBox}
                    onChange={(e: any, value: any) => onCareerSelect(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Elegir Carrera"
                            variant="outlined"
                            autoFocus
                        />
                    )}
                    getOptionSelected={(option, value) => {
                        if (
                            option.pensumCode === value.pensumCode &&
                            option.carreerName === value.carreerName
                        )
                            return true;
                        else return false;
                    }}
                />
            </Grid>
        </Grid>
    );
};
