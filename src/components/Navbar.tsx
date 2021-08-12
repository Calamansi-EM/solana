import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  menu: {
    color: "#fff",
    marginRight: "15px",
    "&:hover": {
      color: "#42f59b",
    },
  },
}));

function Navbar() {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.menu}>My Positions</Typography>
        <Typography className={classes.menu}>Invest</Typography>
        <Typography className={classes.menu}>Pool</Typography>
        <Typography className={classes.menu}>Retrieve token</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
