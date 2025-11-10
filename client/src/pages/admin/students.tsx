import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PendingStudentsTab } from "@/components/pending-students-tab";

export default function AdminStudents() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Estudantes</h2>
        <p className="text-muted-foreground">Gerenciar estudantes pendentes de aprovação</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Estudantes Pendentes de Aprovação</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingStudentsTab />
        </CardContent>
      </Card>
    </div>
  );
}
