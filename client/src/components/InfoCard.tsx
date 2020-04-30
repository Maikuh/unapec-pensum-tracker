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
} from "mdi-material-ui";

export const InfoCard = (props: any) => {
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
                                        <FileDocumentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Materias"
                                    secondary={`${props.subjectsCount} / ${props.totalSubjects}`}
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
                                    secondary={`${props.creditsCount} / ${props.totalCredits}`}
                                />
                            </ListItem>

                            {/* <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Icon>beach_access</Icon>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Vacation"
                                    secondary="July 20, 2014"
                                />
                            </ListItem> */}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
