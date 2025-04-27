export type AdminRole = "Super Admin" | "Moderator" | "User";

export interface AdminUser {
  walletAddress: string;
  role: AdminRole;
  dateAdded?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { walletAddress: string; role: AdminRole }) => void;
  currentWalletAddress?: string;
}

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
} 