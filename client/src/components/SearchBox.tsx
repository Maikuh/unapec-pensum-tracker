import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
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

    return (
        <Grid
            className="search-box"
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid item>
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
                        style={{ width: 600 }}
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
                        style={{ width: 600 }}
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
