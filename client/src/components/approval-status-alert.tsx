import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Student } from "@shared/schema";

interface ApprovalStatusAlertProps {
  student: Student | undefined | null;
}

export default function ApprovalStatusAlert({ student }: ApprovalStatusAlertProps) {
  if (!student) return null;

  const { approvalStatus, rejectionReason } = student;

  if (approvalStatus === "approved") {
    return null;
  }

  if (approvalStatus === "pending") {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950" data-testid="alert-pending-approval">
        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-300 font-semibold">
          Conta Pendente de Aprovação
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-400">
          Sua conta está aguardando aprovação do administrador. Algumas funcionalidades estarão limitadas até que sua conta seja aprovada.
        </AlertDescription>
      </Alert>
    );
  }

  if (approvalStatus === "rejected") {
    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950" data-testid="alert-rejected">
        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-800 dark:text-red-300 font-semibold">
          Conta Rejeitada
        </AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-400">
          {rejectionReason || "Sua conta foi rejeitada. Entre em contato com o administrador para mais informações."}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
