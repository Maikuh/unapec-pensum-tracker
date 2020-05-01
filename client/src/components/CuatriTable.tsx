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
    Tooltip,
    withStyles,
    Theme,
} from "@material-ui/core";

export const CuatriTable = (props: any) => {
    const [period, setPeriod] = useState(0);
    const [selected, setSelected]: any = useState([]);

    useEffect(() => {
        setPeriod(props.cuatri.period);
        setSelected(props.selectedSubjects);
    }, [props.cuatri, props.selectedSubjects, period, selected]);

    function selectSubject(row: any) {
        if (prereqMet(row)) props.subjectSelected(row);
        else
            alert(
                "No tienes los prerequisitos completados para seleccionar esta materia."
            );
    }

    function prereqMet(row: any) {
        let isMet: boolean =
            row.prerequisites.length === 0
                ? true
                : row.prerequisites.every((p: string) =>
                      p.includes("%")
                          ? (props.creditsCount / props.totalCredits) * 100 >=
                            Number(p.slice(0, 2))
                          : selected[props.pensumCode]
                                .map((s: any) => s.code)
                                .includes(p)
                  );

        return isMet;
    }

    function getSubjectNameFromPrereq(prereq: string) {
        const subject = props.cuatris
            .map((cuatri: any) => cuatri.subjects)
            .flat()
            .find((subject: any) => subject.code === prereq);

        return subject ? subject.name : "";
    }

    const HtmlTooltip = withStyles((theme: Theme) => ({
        tooltip: {
            backgroundColor: "rgba(245, 0, 87, 0.76)",
            color: "#fafafa",
            border: "1px solid rgba(245, 0, 87, 0.76)",
        },
    }))(Tooltip);

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
                                    {row.prerequisites.map((pr: any) =>
                                        pr.includes("%") ? (
                                            <p key={row.code + pr}>{pr}</p>
                                        ) : (
                                            <HtmlTooltip
                                                className="prerequisite-tooltip"
                                                key={row.code + pr}
                                                title={
                                                    <Typography
                                                        variant="h6"
                                                        className="prerequisite-tooltip-content"
                                                    >
                                                        {getSubjectNameFromPrereq(
                                                            pr
                                                        )}
                                                    </Typography>
                                                }
                                            >
                                                <p>{pr}</p>
                                            </HtmlTooltip>
                                        )
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
