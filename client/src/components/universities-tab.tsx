import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { School, Plus, Trash2 } from "lucide-react";
import type { University } from '@/pages/admin-dashboard-interfaces';
import { createUniversityMutation, deleteUniversityMutation } from '@/pages/admin-dashboard-mutations';

interface UniversitiesTabProps {
  universities?: University[];
  onRefresh: () => void;
}

export function UniversitiesTab({ universities = [], onRefresh }: UniversitiesTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newUniversity, setNewUniversity] = useState({ name: "", code: "", address: "" });

  const handleCreate = async () => {
    try {
      await createUniversityMutation(newUniversity);
      setShowNewDialog(false);
      setNewUniversity({ name: "", code: "", address: "" });
      onRefresh();
      toast({
        title: "Sucesso",
        description: "Universidade criada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar universidade",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUniversityMutation(id);
      onRefresh();
      toast({
        title: "Sucesso",
        description: "Universidade removida com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover universidade",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Universidades</h2>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Universidade
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {universities.map((uni) => (
            <TableRow key={uni.id}>
              <TableCell>{uni.name}</TableCell>
              <TableCell>{uni.code}</TableCell>
              <TableCell>{uni.address || "-"}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(uni.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Universidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label>Nome</label>
              <Input
                value={newUniversity.name}
                onChange={(e) =>
                  setNewUniversity({ ...newUniversity, name: e.target.value })
                }
              />
            </div>
            <div>
              <label>Código</label>
              <Input
                value={newUniversity.code}
                onChange={(e) =>
                  setNewUniversity({ ...newUniversity, code: e.target.value })
                }
              />
            </div>
            <div>
              <label>Endereço</label>
              <Input
                value={newUniversity.address}
                onChange={(e) =>
                  setNewUniversity({ ...newUniversity, address: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}