import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { InfoCard } from "./InfoCard";
import { CuatriTable } from "./CuatriTable";
import { MainContentProps } from "../interfaces/props.interface";

export const MainContent = ({
    selectedCarreer,
    selectedSubjects,
    onSubjectSelected,
    onSubjectSelectedBulk,
}: MainContentProps) => {
    return (
        <React.Fragment>
            {selectedCarreer &&
            selectedCarreer.cuatris &&
            selectedCarreer.cuatris.length > 0 ? (
                <InfoCard
                    date={selectedCarreer.date}
                    pensumCode={selectedCarreer.pensumCode}
                    subjectsCount={
                        selectedSubjects[selectedCarreer.pensumCode].length
                    }
                    totalSubjects={selectedCarreer.cuatris.reduce(
                        (acc, subject) => acc + subject.subjects.length,
                        0
                    )}
                    creditsCount={selectedSubjects[
                        selectedCarreer.pensumCode
                    ].reduce((acc, subject) => acc + subject.credits, 0)}
                    totalCredits={selectedCarreer.cuatris.reduce(
                        (acc, cuatri) =>
                            acc +
                            cuatri.subjects.reduce(
                                (acc2, subject) => acc2 + subject.credits,
                                0
                            ),
                        0
                    )}
                />
            ) : (
                <>
                    <Typography variant="h1" className="main-title">
                        <span role="img" aria-label="arriba">
                            👆
                        </span>
                    </Typography>
                    <Typography variant="h1" className="main-title">
                        Selecciona una carrera del dropdown arriba{" "}
                    </Typography>
                </>
            )}

            <Grid container spacing={2} style={{ flexGrow: 1 }}>
                {selectedCarreer &&
                    selectedCarreer.cuatris &&
                    selectedCarreer.cuatris.length > 0 &&
                    selectedCarreer.cuatris.map((cuatri) => (
                        <Grid item xs={6} key={cuatri.period}>
                            <CuatriTable
                                cuatri={cuatri}
                                cuatris={selectedCarreer.cuatris}
                                pensumCode={selectedCarreer.pensumCode}
                                selectedSubjects={selectedSubjects}
                                subjectSelected={onSubjectSelected}
                                onSubjectSelectedBulk={onSubjectSelectedBulk}
                                creditsCount={selectedSubjects[
                                    selectedCarreer.pensumCode
                                ].reduce((acc, item) => acc + item.credits, 0)}
                                totalCredits={selectedCarreer.cuatris.reduce(
                                    (acc, cuatri) =>
                                        acc +
                                        cuatri.subjects.reduce(
                                            (acc2, subject) =>
                                                acc2 + subject.credits,
                                            0
                                        ),
                                    0
                                )}
                            />
                        </Grid>
                    ))}
            </Grid>
        </React.Fragment>
    );
};
