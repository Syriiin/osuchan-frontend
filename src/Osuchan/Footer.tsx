import React from "react";
import { makeStyles, Theme, createStyles, Container, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({
    footer: {
        paddingTop: theme.spacing(3),
        marginTop: "auto"
    }
}));

function Footer() {
    const classes = useStyles();
    
    return (
        <footer className={classes.footer}>
            <Container>
                <Typography align="center" variant="subtitle1" color="textSecondary">&copy; osu!chan 2019 | Team osu!chan</Typography>
                {/* <Typography align="center" variant="subtitle2" color="textSecondary">Terms of Use | Privacy policy</Typography> */}
            </Container>
        </footer>
    );
}

export default Footer;