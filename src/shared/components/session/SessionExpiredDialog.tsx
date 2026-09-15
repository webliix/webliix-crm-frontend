import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SessionExpiredDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="session-expired-title">
      <DialogTitle id="session-expired-title">Session expired</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session has expired. Please login again to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
