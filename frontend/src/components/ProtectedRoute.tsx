import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const member = useSelector((state: RootState) => state.auth.member);

  if (!member) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
