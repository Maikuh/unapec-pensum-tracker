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
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import { CuatriTableProps } from "../interfaces/props.interface";
import { SelectAllCheckboxStatus } from "../interfaces/checkbox.types";
import getSubjectsThatCanBeSelected from "../helpers/getSubjectsThatCanBeSelected";
import prerequisitesMet from "../helpers/prerequisitesMet";
import { Subject } from "../interfaces/pensums.interface";
import { useSelectedSubjects } from "../contexts/selectedSubjects.context";

export const CuatriTable = ({
    cuatri,
    cuatris,
    pensumCode,
    totalCredits,
    creditsCount,
}: CuatriTableProps) => {
    const [selectedSubjects, selectedSubjectsDispatch] = useSelectedSubjects();
    const [period, setPeriod] = useState(0);
    const [checkboxStatus, setCheckboxStatus] = useState<
        SelectAllCheckboxStatus
    >("unchecked");
    const theme = useTheme();
    const isMobileBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setPeriod(cuatri.period);

        let selectedSubjectsChecked = 0;

        cuatri.subjects.forEach((subject) => {
            const subjectChecked = selectedSubjects[pensumCode].some(
                (selectedSubject: Subject) =>
                    selectedSubject.code === subject.code
            );

            if (subjectChecked) selectedSubjectsChecked++;
        });

        if (
            selectedSubjectsChecked > 0 &&
            selectedSubjectsChecked < cuatri.subjects.length
        )
            setCheckboxStatus("indeterminate");
        else if (selectedSubjectsChecked === cuatri.subjects.length)
            setCheckboxStatus("checked");
        else if (
            getSubjectsThatCanBeSelected(
                cuatri.subjects,
                selectedSubjects[pensumCode],
                creditsCount,
                totalCredits
            ).length === 0
        )
            setCheckboxStatus("disabled");
        else setCheckboxStatus("unchecked");
    }, [
        cuatri.period,
        checkboxStatus,
        cuatri.subjects,
        selectedSubjects,
        pensumCode,
        creditsCount,
        totalCredits,
    ]);

    function selectSubject(subject: Subject) {
        if (
            prerequisitesMet(
                subject,
                selectedSubjects[pensumCode],
                creditsCount,
                totalCredits
            )
        ) {
            selectedSubjectsDispatch({
                type: "select-subject",
                payload: {
                    subject,
                    pensumCode,
                },
            });
        } else
            alert(
                "No tienes los prerequisitos completados para seleccionar esta materia."
            );
    }

    function getSubjectNameFromPrereq(prereq: string) {
        const subject = cuatris
            .map((cuatri: any) => cuatri.subjects)
            .flat()
            .find((subject: any) => subject.code === prereq);

        return subject ? subject.name : "";
    }

    function onSelectAllCheckboxClick() {
        const subjectsThatCanBeSelected = getSubjectsThatCanBeSelected(
            cuatri.subjects,
            selectedSubjects[pensumCode],
            creditsCount,
            totalCredits
        );

        selectedSubjectsDispatch({
            type: "bulk-select",
            payload: {
                newSelectedSubjects: subjectsThatCanBeSelected,
                pensumCode,
                periodSubjectsCount: cuatri.subjects.length,
            },
        });
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
            <Table
                aria-label="simple table"
                size={isMobileBreakpoint ? "small" : "medium"}
            >
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={
                                    checkboxStatus === "indeterminate"
                                }
                                checked={checkboxStatus === "checked"}
                                disabled={checkboxStatus === "disabled"}
                                onChange={onSelectAllCheckboxClick}
                                inputProps={{
                                    "aria-label": "select all subjects",
                                }}
                            />
                        </TableCell>
                        <TableCell>Código</TableCell>
                        <TableCell align="right">Nombre</TableCell>
                        <TableCell align="right">Créditos</TableCell>
                        <TableCell align="right">Pre-requisitos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selectedSubjects[pensumCode] &&
                        cuatri.subjects.map((row) => (
                            <TableRow
                                hover
                                key={row.code}
                                onClick={() => selectSubject(row)}
                                className={
                                    !prerequisitesMet(
                                        row,
                                        selectedSubjects[pensumCode],
                                        creditsCount,
                                        totalCredits
                                    )
                                        ? "disabled-row"
                                        : ""
                                }
                                selected={selectedSubjects[pensumCode].some(
                                    (s: any) => s.code === row.code
                                )}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedSubjects[
                                            pensumCode
                                        ].some((s) => s.code === row.code)}
                                        // onChange={(e) => selectSubject(row)}
                                        disabled={
                                            !prerequisitesMet(
                                                row,
                                                selectedSubjects[pensumCode],
                                                creditsCount,
                                                totalCredits
                                            )
                                        }
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
