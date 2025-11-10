import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
import { Plus, Edit } from "lucide-react";

export function EventsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventFormData, setEventFormData] = useState({
    name: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    transportPriceOneWay: "",
    transportPriceRoundTrip: "",
    transportPriceReturn: "",
    availableSeats: "",
    eventImageUrl: "",
  });
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: async () => {
      const response = await fetch('/api/admin/events');
      if (!response.ok) throw new Error('Falha ao buscar eventos');
      return response.json();
    },
    refetchInterval: 30000,
    retry: 3,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCreateEdit = async () => {
    try {
      let imageUrl = eventFormData.eventImageUrl || "";

      if (eventImageFile) {
        const formData = new FormData();
        formData.append('eventImage', eventImageFile);

        const uploadResponse = await fetch('/api/admin/events/upload-image', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Erro ao fazer upload da imagem');
        }
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      if (!eventFormData.name || !eventFormData.description || !eventFormData.eventDate || 
          !eventFormData.eventTime || !eventFormData.location || !eventFormData.transportPriceOneWay ||
          !eventFormData.transportPriceRoundTrip || !eventFormData.transportPriceReturn || 
          !eventFormData.availableSeats) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      const method = selectedEvent ? 'PUT' : 'POST';
      const url = selectedEvent 
        ? `/api/admin/events/${selectedEvent.id}` 
        : '/api/admin/events';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eventFormData.name,
          description: eventFormData.description,
          eventDate: eventFormData.eventDate,
          eventTime: eventFormData.eventTime,
          location: eventFormData.location,
          transportPriceOneWay: eventFormData.transportPriceOneWay,
          transportPriceRoundTrip: eventFormData.transportPriceRoundTrip,
          transportPriceReturn: eventFormData.transportPriceReturn,
          availableSeats: eventFormData.availableSeats,
          eventImageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar evento');
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      setShowEventDialog(false);
      setEventImageFile(null);
      setImagePreview("");
      setSelectedEvent(null);
      setEventFormData({
        name: "",
        description: "",
        eventDate: "",
        eventTime: "",
        location: "",
        transportPriceOneWay: "",
        transportPriceRoundTrip: "",
        transportPriceReturn: "",
        availableSeats: "",
        eventImageUrl: "",
      });
      toast({
        title: selectedEvent ? "Evento atualizado" : "Evento criado",
        description: "As alterações foram salvas com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o evento",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Eventos</h2>
          <p className="text-muted-foreground">Gerenciar eventos e transporte</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEvent(null);
            setEventFormData({
              name: "",
              description: "",
              eventDate: "",
              eventTime: "",
              location: "",
              transportPriceOneWay: "",
              transportPriceRoundTrip: "",
              transportPriceReturn: "",
              availableSeats: "",
              eventImageUrl: "",
            });
            setShowEventDialog(true);
          }}
          data-testid="button-create-event"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Evento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event: any) => (
                  <TableRow key={event.id} data-testid={`row-event-${event.id}`}>
                    <TableCell data-testid={`text-event-name-${event.id}`}>{event.name}</TableCell>
                    <TableCell>{formatDate(event.eventDate)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.availableSeats}</TableCell>
                    <TableCell>
                      <Badge variant={event.isActive ? "success" : "destructive"}>
                        {event.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setEventFormData({
                            name: event.name,
                            description: event.description,
                            eventDate: event.eventDate.split('T')[0],
                            eventTime: event.eventTime,
                            location: event.location,
                            transportPriceOneWay: event.transportPriceOneWay,
                            transportPriceRoundTrip: event.transportPriceRoundTrip,
                            transportPriceReturn: event.transportPriceReturn,
                            availableSeats: event.availableSeats,
                            eventImageUrl: event.eventImageUrl || "",
                          });
                          setShowEventDialog(true);
                        }}
                        data-testid={`button-edit-event-${event.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Editar Evento" : "Criar Evento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventName">Nome do Evento *</Label>
              <Input
                id="eventName"
                value={eventFormData.name}
                onChange={(e) => setEventFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Conferência Tecnológica UAN 2025"
                data-testid="input-event-name"
              />
            </div>

            <div>
              <Label htmlFor="eventDescription">Descrição *</Label>
              <Textarea
                id="eventDescription"
                value={eventFormData.description}
                onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o evento"
                rows={3}
                data-testid="input-event-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Data do Evento *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventFormData.eventDate}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  data-testid="input-event-date"
                />
              </div>
              <div>
                <Label htmlFor="eventTime">Horário *</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventFormData.eventTime}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                  data-testid="input-event-time"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eventLocation">Local *</Label>
              <Input
                id="eventLocation"
                value={eventFormData.location}
                onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Universidade Agostinho Neto"
                data-testid="input-event-location"
              />
            </div>

            <div>
              <Label htmlFor="eventImage">Imagem do Evento</Label>
              <Input
                id="eventImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setEventImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                data-testid="input-event-image"
              />
              {(imagePreview || eventFormData.eventImageUrl) && (
                <div className="mt-2">
                  <img 
                    src={imagePreview || eventFormData.eventImageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priceOneWay">Preço Só Ida (AKZ) *</Label>
                <Input
                  id="priceOneWay"
                  type="number"
                  value={eventFormData.transportPriceOneWay}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, transportPriceOneWay: e.target.value }))}
                  data-testid="input-price-one-way"
                />
              </div>
              <div>
                <Label htmlFor="priceReturn">Preço Só Volta (AKZ) *</Label>
                <Input
                  id="priceReturn"
                  type="number"
                  value={eventFormData.transportPriceReturn}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, transportPriceReturn: e.target.value }))}
                  data-testid="input-price-return"
                />
              </div>
              <div>
                <Label htmlFor="priceRoundTrip">Preço Ida e Volta (AKZ) *</Label>
                <Input
                  id="priceRoundTrip"
                  type="number"
                  value={eventFormData.transportPriceRoundTrip}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, transportPriceRoundTrip: e.target.value }))}
                  data-testid="input-price-round-trip"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="availableSeats">Vagas Disponíveis *</Label>
              <Input
                id="availableSeats"
                type="number"
                value={eventFormData.availableSeats}
                onChange={(e) => setEventFormData(prev => ({ ...prev, availableSeats: e.target.value }))}
                data-testid="input-available-seats"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)} data-testid="button-cancel-event">
              Cancelar
            </Button>
            <Button
              onClick={handleCreateEdit}
              data-testid="button-save-event"
            >
              {selectedEvent ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
