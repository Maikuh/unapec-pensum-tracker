import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { InfoCard } from "./InfoCard";
import { CuatriTable } from "./CuatriTable";

export const MainContent = ({
    selectedCarreer,
    selectedSubjects,
    onSubjectSelected,
}: any) => {
    return (
        <React.Fragment>
            {selectedCarreer &&
            selectedCarreer.cuatris &&
            selectedCarreer.cuatris.length > 0 ? (
                <InfoCard
                    subjectsCount={
                        selectedSubjects[selectedCarreer.pensumCode].length
                    }
                    totalSubjects={selectedCarreer.cuatris.reduce(
                        (acc: number, item: any) => acc + item.subjects.length,
                        0
                    )}
                    creditsCount={selectedSubjects[
                        selectedCarreer.pensumCode
                    ].reduce((acc: number, item: any) => acc + item.credits, 0)}
                    totalCredits={selectedCarreer.cuatris.reduce(
                        (acc: number, cuatri: any) =>
                            acc +
                            cuatri.subjects.reduce(
                                (acc2: any, sub: any) => acc2 + sub.credits,
                                0
                            ),
                        0
                    )}
                />
            ) : (
                <Typography variant="h1" className="main-title">
                    Selecciona una carrera del dropdown arriba
                </Typography>
            )}

            <Grid container spacing={2} style={{ flexGrow: 1 }}>
                {selectedCarreer &&
                    selectedCarreer.cuatris &&
                    selectedCarreer.cuatris.length > 0 &&
                    selectedCarreer.cuatris.map((c: any, i: number) => (
                        <Grid item xs={6} key={c.period}>
                            <CuatriTable
                                cuatri={c}
                                cuatris={selectedCarreer.cuatris}
                                pensumCode={selectedCarreer.pensumCode}
                                selectedSubjects={selectedSubjects}
                                subjectSelected={onSubjectSelected}
                                creditsCount={selectedSubjects[
                                    selectedCarreer.pensumCode
                                ].reduce(
                                    (acc: number, item: any) =>
                                        acc + item.credits,
                                    0
                                )}
                                totalCredits={selectedCarreer.cuatris.reduce(
                                    (acc: number, cuatri: any) =>
                                        acc +
                                        cuatri.subjects.reduce(
                                            (acc2: any, sub: any) =>
                                                acc2 + sub.credits,
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
