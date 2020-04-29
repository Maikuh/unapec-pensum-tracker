import React, { useEffect, useState } from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Toolbar,
    Checkbox,
} from "@material-ui/core";

export const CuatriTable = (props: any) => {
    const [period, setPeriod] = useState(0);
    const [selected, setSelected]: any = useState([]);

    useEffect(() => {
        setPeriod(props.cuatri.period);
        setSelected(props.selectedSubjects);
    }, [props.cuatri, props.selectedSubjects, period, selected]);

    function selectSubject(row: any) {
        console.log("Is Prereq met?", prereqMet(row));
        if (prereqMet(row)) props.subjectSelected(row);
        else
            alert(
                "No tienes los prerequisitos completados para seleccionar esta materia."
            );
    }

    function prereqMet(row: any) {
        let isMet: boolean = !row.prerequisites
            ? true
            : row.prerequisites.length > 0 &&
              row.prerequisites
                  .split(",")
                  .some((p: any) =>
                      selected[props.pensumCode]
                          .map((s: any) => s.code)
                          .includes(p)
                  );

        return isMet;
    }

    return (
        <TableContainer component={Paper}>
            <Toolbar>
                <Typography
                    style={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Cuatrimestre {period}
                </Typography>
            </Toolbar>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {/* <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={
                                    selected.length > 0 &&
                                    selected.length < props.cuatri.subjects
                                }
                                checked={
                                    props.cuatri.subjects > 0 &&
                                    selected.length === props.cuatri.subjects
                                }
                                // onChange={onSelectAllClick}
                                inputProps={{
                                    "aria-label": "select all subjects",
                                }}
                            />
                        </TableCell> */}
                        <TableCell></TableCell>
                        <TableCell>Código</TableCell>
                        <TableCell align="right">Nombre</TableCell>
                        <TableCell align="right">Créditos</TableCell>
                        <TableCell align="right">Pre-requisitos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selected[props.pensumCode] &&
                        props.cuatri.subjects.map((row: any) => (
                            <TableRow
                                hover
                                key={row.code}
                                onClick={() => selectSubject(row)}
                                className={
                                    !prereqMet(row) ? "disabled-row" : ""
                                }
                                selected={selected[props.pensumCode].some(
                                    (s: any) => s.code === row.code
                                )}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected[
                                            props.pensumCode
                                        ].some((s: any) => s.code === row.code)}
                                        onChange={(e) => selectSubject(row)}
                                        disabled={!prereqMet(row)}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.code}
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">
                                    {row.credits}
                                </TableCell>
                                <TableCell align="right">
                                    {row.prerequisites}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
