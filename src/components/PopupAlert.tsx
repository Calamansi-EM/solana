import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { useEffect } from "react";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 450,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

interface PopupAlertInterface {
  message: string;
  b_show: boolean;
  close: any; // set the Popupshow in detail false
}

const PopupAlert: React.FC<PopupAlertInterface> = ({ message, b_show, close }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(b_show);
  }, [b_show]);

  const handleClose = () => {
    setOpen(false);
    close(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2>Alert</h2>
          <p>{message}</p>
        </div>
      </Modal>
    </div>
  );
};

export default PopupAlert;
