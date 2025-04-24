// BasicModal.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Link from "next/link";

const style = {
  position: "absolute",
  top: "10%",
  left: "85%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#1e1e1e",

  boxShadow: 24,
  borderRadius: "20px",
  p: 2,

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 1,
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
          id="modal-modal-description"
          sx={{ mt: 0 }}
          className="text-white cursor-pointer"
        >
          <Link href="/#">
            <button className="bg-blue-700 py-2 rounded-md px-10">
              Disconnet
            </button>
          </Link>
        </Typography>
      </Box>
    </Modal>
  );
}
