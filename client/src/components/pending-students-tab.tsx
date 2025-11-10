import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { fetchPendingStudents, approveStudentMutation, rejectStudentMutation } from "@/pages/admin-dashboard-mutations";
import type { PendingStudent } from "@/pages/admin-dashboard-interfaces";

export function PendingStudentsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<PendingStudent | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: pendingStudents, isLoading } = useQuery({
    queryKey: ['admin', 'pending-students'],
    queryFn: fetchPendingStudents,
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: approveStudentMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-students'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast({
        title: "Estudante aprovado",
        description: "O estudante foi aprovado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao aprovar estudante",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ studentId, reason }: { studentId: number; reason: string }) =>
      rejectStudentMutation(studentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-students'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      setRejectDialogOpen(false);
      setSelectedStudent(null);
      setRejectionReason("");
      toast({
        title: "Estudante rejeitado",
        description: "O estudante foi rejeitado",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao rejeitar estudante",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (studentId: number) => {
    approveMutation.mutate(studentId);
  };

  const handleRejectClick = (student: PendingStudent) => {
    setSelectedStudent(student);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedStudent || !rejectionReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, forneça um motivo para a rejeição",
        variant: "destructive",
      });
      return;
    }
    rejectMutation.mutate({ studentId: selectedStudent.id, reason: rejectionReason });
  };

  if (isLoading) {
    return <div>Carregando estudantes pendentes...</div>;
  }

  if (!pendingStudents || pendingStudents.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Nenhum estudante pendente de aprovação</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead data-testid="header-name">Nome Completo</TableHead>
            <TableHead data-testid="header-student-number">Número de Estudante</TableHead>
            <TableHead data-testid="header-university">Universidade</TableHead>
            <TableHead data-testid="header-course">Curso</TableHead>
            <TableHead data-testid="header-phone">Telefone</TableHead>
            <TableHead data-testid="header-date">Data de Registro</TableHead>
            <TableHead data-testid="header-actions">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingStudents.map((student: PendingStudent) => (
            <TableRow key={student.id} data-testid={`row-student-${student.id}`}>
              <TableCell className="font-medium">{student.fullName}</TableCell>
              <TableCell>{student.studentNumber}</TableCell>
              <TableCell>{student.university}</TableCell>
              <TableCell>{student.course || "-"}</TableCell>
              <TableCell>{student.phone || "-"}</TableCell>
              <TableCell>{new Date(student.createdAt).toLocaleDateString('pt-AO')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleApprove(student.id)}
                    disabled={approveMutation.isPending}
                    data-testid={`button-approve-${student.id}`}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejectClick(student)}
                    disabled={rejectMutation.isPending}
                    data-testid={`button-reject-${student.id}`}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent data-testid="dialog-reject-student">
          <DialogHeader>
            <DialogTitle>Rejeitar Estudante</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja rejeitar {selectedStudent?.fullName}?
              Por favor, forneça um motivo para a rejeição.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Motivo da rejeição..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              data-testid="textarea-rejection-reason"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setSelectedStudent(null);
                setRejectionReason("");
              }}
              data-testid="button-cancel-reject"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
              data-testid="button-confirm-reject"
            >
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
