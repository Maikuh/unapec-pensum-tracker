import React from "react";
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
} from "@material-ui/core";
import {
    FileDocumentOutline as FileDocumentIcon,
    CreditCardOutline as CreditIcon,
    Calendar as CalendarIcon,
} from "mdi-material-ui";
import { InfoCardProps } from "../interfaces/props.interface";

export const InfoCard = ({
    date,
    creditsCount,
    totalCredits,
    subjectsCount,
    totalSubjects,
}: InfoCardProps) => {
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
                                    secondary={`${subjectsCount} / ${totalSubjects}`}
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
                                    secondary={`${creditsCount} / ${totalCredits}`}
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
