import React from "react";
import { Alert } from "@mui/material";

export interface ErrorMessageProps {
  message: string;
  severity?: "error" | "warning" | "info" | "success";
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, severity = "error" }) => (
  <Alert severity={severity}>{message}</Alert>
);

export default ErrorMessage;
