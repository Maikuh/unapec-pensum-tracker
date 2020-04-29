import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

export const SearchBox = (props: any) => {
    useEffect(() => {
        // console.log("Aye bruh!", props.pensums);
    }, [props]);

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
                        value={props.selectedCarreer}
                        style={{ width: 600 }}
                        onChange={(e: any, value: any) =>
                            props.selectCarreer(value)
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
                            props.selectCarreer(value)
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
