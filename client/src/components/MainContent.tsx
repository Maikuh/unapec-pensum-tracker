import React, { useEffect } from "react";
import { Grid, Typography, useTheme, useMediaQuery } from "@material-ui/core";
import { InfoCard } from "./InfoCard";
import { CuatriTable } from "./CuatriTable";
import { useSelectedCareer } from "../contexts/selectedCareer.context";
import { useSelectedSubjects } from "../contexts/selectedSubjects.context";

export const MainContent = (props: any) => {
    const [selectedSubjects] = useSelectedSubjects();
    const theme = useTheme();
    const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [selectedCareer] = useSelectedCareer();

    return (
        <React.Fragment>
            {selectedCareer &&
            selectedCareer.cuatris &&
            selectedCareer.cuatris.length > 0 ? (
                <InfoCard
                    date={selectedCareer.date}
                    pensumCode={selectedCareer.pensumCode}
                    subjectsCount={
                        selectedSubjects[selectedCareer.pensumCode].length
                    }
                    totalSubjects={selectedCareer.cuatris.reduce(
                        (acc, subject) => acc + subject.subjects.length,
                        0
                    )}
                    creditsCount={selectedSubjects[
                        selectedCareer.pensumCode
                    ].reduce((acc, subject) => acc + subject.credits, 0)}
                    totalCredits={selectedCareer.cuatris.reduce(
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
                    <Typography
                        variant={isMobileScreen ? "h2" : "h1"}
                        className="main-title"
                    >
                        Selecciona una carrera del dropdown arriba{" "}
                    </Typography>
                </>
            )}

            <Grid container spacing={2} style={{ flexGrow: 1 }}>
                {selectedCareer &&
                    selectedCareer.cuatris &&
                    selectedCareer.cuatris.length > 0 &&
                    selectedCareer.cuatris.map((cuatri) => (
                        <Grid item xs={12} md={6} key={cuatri.period}>
                            <CuatriTable
                                cuatri={cuatri}
                                cuatris={selectedCareer.cuatris}
                                pensumCode={selectedCareer.pensumCode}
                                creditsCount={selectedSubjects[
                                    selectedCareer.pensumCode
                                ].reduce((acc, item) => acc + item.credits, 0)}
                                totalCredits={selectedCareer.cuatris.reduce(
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
