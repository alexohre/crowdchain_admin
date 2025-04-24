// BasicModal.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Link from "next/link";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#1e1e1e",

  boxShadow: 24,
  borderRadius: "20px",
  p: 4,

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
};

type BasicModalProps = {
  open: boolean;
  handleClose: () => void;
};

export default function BasicModal({ open, handleClose }: BasicModalProps) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="text-white"
        >
          Connect Your Wallet
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
          className="text-white cursor-pointer"
        >
          <Link href="/dashboard">
            <button className="bg-blue-700 py-2 rounded-md px-10">
              Argent X
            </button>
          </Link>
        </Typography>

        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
          className="text-white"
        >
          <Link href="/dashboard">
            <button className="bg-red-600 py-2 rounded-md px-10">Brovos</button>
          </Link>
        </Typography>
      </Box>
    </Modal>
  );
}
