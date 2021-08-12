import React from "react";
import { Grid } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import "../style/style.css";

import monkeyImg from "../assets/images/monkey.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      position: "relative",
      backgroundColor: "white",
      borderRadius: 20,
      marginTop: 10,
      [theme.breakpoints.down("xs")]: {
        paddingBottom: 20,
      },
      margin: "auto",
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    contentCircle: {
      border: "1px solid black",
      borderRadius: 20,
      paddingLeft: 20,
      paddingRight: 20,
      display: "inline-block",
      justifyContent: "center",
      margin: "5px 5px",
    },
    button: {
      position: "absolute",
      bottom: 10,
      right: 20,
      backgroundColor: "#005DF2",
      [theme.breakpoints.down("xs")]: {
        position: "initial",
      },
    },
    setBtn: {},
    active: {
      borderColor: "blue",
    },
    stepper: {
      "& .MuiStepIcon-root": {
        color: "#C4C4C4",
      },
      "& .MuiStepIcon-root.MuiStepIcon-completed": {
        color: "#0062FF",
      },
    },
  })
);

function getSteps() {
  return ["", "", ""];
}

function getStepExplanation(step: number) {
  switch (step) {
    case 0:
      return "What are you looking for?";
    case 1:
      return "How do you feel about the market?";
    case 2:
      return "What is your investment timeframe?";
    default:
      return "";
  }
}

export type AssistantProps = {
  data: string;
  showAssistant: any;
};
const Assistant: React.FC<AssistantProps> = ({ data, showAssistant }) => {
  function closeHandler() {
    showAssistant(false);
  }

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(-1);
  const [checkedStatus, setCheckedStatus] = React.useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  // const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
  //   {}
  // );

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(-1);
  };

  const handleCheck = (index: number) => {
    const [...status] = checkedStatus;
    status[index] = !status[index];
    setCheckedStatus(status);
  };

  const checkStepStatus = () => {
    if (activeStep === 0) return checkedStatus[0] || checkedStatus[1];
    if (activeStep === 1) return checkedStatus[2] || checkedStatus[3] || checkedStatus[4];
    if (activeStep === 2) return checkedStatus[5] || checkedStatus[6] || checkedStatus[7] || checkedStatus[8];
    return true;
  };

  const circleClass = (index: number) =>
    `${classes.contentCircle} ${checkedStatus[index] === true ? classes.active : ""}`;

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div style={{ marginTop: "20px" }}>
            <p className={circleClass(0)} onClick={() => handleCheck(0)}>
              Receive a yield and give up market opportunity.
            </p>
            <p className={circleClass(1)} onClick={() => handleCheck(1)}>
              Pay a yield for a trading opportunity.
            </p>
          </div>
        );
      case 1:
        return (
          <div style={{ marginTop: "20px" }}>
            <p className={circleClass(2)} onClick={() => handleCheck(2)}>
              Bull (Market UP)
            </p>
            <br />
            <p className={circleClass(3)} onClick={() => handleCheck(3)}>
              Bear (Market Down)
            </p>
            <br />
            <p className={circleClass(4)} onClick={() => handleCheck(4)}>
              Sideways (Stable)
            </p>
          </div>
        );
      case 2:
        return (
          <div style={{ marginTop: "20px" }}>
            <p className={circleClass(5)} onClick={() => handleCheck(5)}>
              Super short term (under 7 days)
            </p>
            <p className={circleClass(6)} onClick={() => handleCheck(6)}>
              Short term (under 1 months)
            </p>
            <p className={circleClass(7)} onClick={() => handleCheck(7)}>
              Long term (under 3 months)
            </p>
            <p className={circleClass(8)} onClick={() => handleCheck(8)}>
              Retirement (over 3 months)
            </p>
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <div className={classes.root}>
      <CloseIcon className="close-icon" onClick={closeHandler}></CloseIcon>
      <Grid container>
        <Grid xs={12} md={2} sm={2} item={true} className="img-section">
          <img src={monkeyImg} alt=""></img>
        </Grid>
        {activeStep === steps.length ? (
          <>
            <Grid xs={12} md={8} sm={8} item={true}>
              <div style={{ textAlign: "left", marginLeft: "20px" }}>
                <p className="assistant-title">
                  <b>Your Exotic Assistant is active.</b>
                </p>
                <p>
                  The results shown hereafter are filtered based on your previous answer, you can cancel to desactivate
                  it and start over if you want to.
                </p>
              </div>
            </Grid>
            <Grid xs={12} md={2} sm={2} item={true}>
              <Button onClick={handleReset} variant="contained" color="primary" className={classes.button}>
                Cancel Assistant
              </Button>
            </Grid>
          </>
        ) : activeStep < 0 ? (
          <>
            <Grid xs={12} md={8} sm={8} item={true}>
              <div style={{ textAlign: "left", marginLeft: "20px" }}>
                <p className="assistant-title">
                  <b>Exotic Assistant</b>
                </p>
                <p>Need help choosing a product?</p>
                <p>Setup our Exotic Assistant by answering a couple questions.</p>
              </div>
            </Grid>
            <Grid xs={12} md={2} sm={2} item={true}>
              <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                Setup Assistant
                <ArrowForwardIcon />
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid xs={12} sm={3} item={true}>
              <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div>
                <div>
                  <Typography className={classes.instructions}>{getStepExplanation(activeStep)}</Typography>
                  <div>
                    <Button
                      // disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      <ArrowBackIosIcon />
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={4} item={true}>
              <div style={{ textAlign: "left" }}>{getStepContent(activeStep)}</div>
            </Grid>
            <Grid xs={12} sm={3} item={true}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                disabled={!checkStepStatus()}
              >
                {activeStep === steps.length - 1 ? "Complete" : "Continue"}
                <ArrowForwardIcon />
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default Assistant;
