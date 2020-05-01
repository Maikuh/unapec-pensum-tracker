import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

export const SearchBox = (props: any) => {
    useEffect(() => {
        if (!props.selectedCarreer.pensumCode) {
            const lastSelectedCarreer = localStorage.getItem(
                "lastSelectedCarreer"
            );

            if (lastSelectedCarreer)
                onCarreerSelect(JSON.parse(lastSelectedCarreer));
        }
    });

    function onCarreerSelect(carreer: any) {
        localStorage.setItem("lastSelectedCarreer", JSON.stringify(carreer));
        props.selectCarreer(carreer.pensumCode);
    }

    return (
        <Grid
            className="search-box"
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid item>
                {props.selectedCarreer &&
                props.selectedCarreer.pensumCode &&
                props.selectedCarreer.pensumCode.length > 0 ? (
                    <Autocomplete
                        id="carreer-search-box"
                        autoComplete
                        autoHighlight
                        options={props.pensums}
                        getOptionLabel={(c: any) =>
                            `${c.pensumCode} - ${c.carreerName}`
                        }
                        value={props.pensums.find(
                            (p: any) =>
                                p.pensumCode ===
                                props.selectedCarreer.pensumCode
                        )}
                        style={{ width: 600 }}
                        onChange={(e: any, value: any) =>
                            onCarreerSelect(value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Elegir Carrera"
                                variant="outlined"
                            />
                        )}
                    />
                ) : (
                    <Autocomplete
                        id="carreer-search-box"
                        autoComplete
                        autoHighlight
                        options={props.pensums}
                        getOptionLabel={(c: any) =>
                            `${c.pensumCode} - ${c.carreerName}`
                        }
                        style={{ width: 600 }}
                        onChange={(e: any, value: any) =>
                            onCarreerSelect(value)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Elegir Carrera"
                                variant="outlined"
                            />
                        )}
                    />
                )}
            </Grid>
        </Grid>
    );
};
