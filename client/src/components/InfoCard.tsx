import React, { useEffect, useState } from "react";
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Grid,
    Typography,
    Card,
    CardContent,
    Link,
} from "@material-ui/core";
import {
    FileDocumentOutline as FileDocumentIcon,
    CreditCardOutline as CreditIcon,
    Calendar as CalendarIcon,
    OpenInNew as OpenInNewIcon,
} from "mdi-material-ui";
import { InfoCardProps } from "../interfaces/props.interface";
import pensumPages from "../pensum-pages";

export const InfoCard = ({
    date,
    pensumCode,
    creditsCount,
    totalCredits,
    subjectsCount,
    totalSubjects,
}: InfoCardProps) => {
    const [originalPensumLink, setOriginalPensumLink] = useState<String>("");

    useEffect(() => {
        setOriginalPensumLink(
            pensumPages.find((p) =>
                pensumCode
                    .toUpperCase()
                    .includes(p.split("/").pop()!.toUpperCase())
            )!
        );
    }, [pensumCode, originalPensumLink]);

    return (
        <Grid
            container
            justify="center"
            alignContent="center"
            alignItems="center"
            className="info-card"
        >
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Informacion
                        </Typography>

                        <List>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <CalendarIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Fecha del Pensum"
                                    secondary={new Date(
                                        date
                                    ).toLocaleDateString("es-MX", {
                                        hour12: true,
                                        weekday: "long",
                                        year: "numeric",
                                        day: "2-digit",
                                        month: "long",
                                    })}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FileDocumentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Materias"
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            <span className="subjects-count">
                                                {subjectsCount}
                                            </span>
                                            (
                                            <span className="subject-credits-percentage">
                                                {Math.round(
                                                    (subjectsCount /
                                                        totalSubjects) *
                                                        100
                                                )}
                                                %
                                            </span>
                                            ) de{" "}
                                            <span className="total-subjects">
                                                {totalSubjects}
                                            </span>
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <CreditIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Creditos"
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            <span className="credits-count">
                                                {creditsCount}
                                            </span>{" "}
                                            (
                                            <span className="subject-credits-percentage">
                                                {Math.round(
                                                    (creditsCount /
                                                        totalCredits) *
                                                        100
                                                )}
                                                %
                                            </span>
                                            ) de{" "}
                                            <span className="total-credits">
                                                {totalCredits}
                                            </span>
                                        </Typography>
                                    }
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <OpenInNewIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Pensum Original"
                                    secondary={
                                        <Link
                                            href={`${originalPensumLink}`}
                                            target="_blank"
                                        >
                                            Link al Pensum
                                        </Link>
                                    }
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
