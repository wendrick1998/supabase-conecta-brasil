
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronRight, 
  Edit, 
  Trash2, 
  Plus, 
  ArrowRight,
  MessageSquare, 
  Phone,
  Building2,
  Mail,
  Calendar
} from 'lucide-react';
import { 
  getLead, 
  getLeadNotes, 
  getLeadInteractions, 
  getLeadTasks, 
  deleteLead,
  advanceLeadStage,
  addLeadNote,
  addLeadInteraction,
  addLeadTask
} from '@/services/leadService';
import { Lead, Nota, Interacao, Tarefa } from '@/types/lead';
import LeadTag from '@/components/LeadTag';
import TimelineItem from '@/components/TimelineItem';
import TaskItem from '@/components/TaskItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Nota[]>([]);
  const [interactions, setInteractions] = useState<Interacao[]>([]);
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [newNote, setNewNote] = useState('');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  
  const [newInteractionType, setNewInteractionType] = useState<'mensagem' | 'chamada'>('mensagem');
  const [newInteractionContent, setNewInteractionContent] = useState('');
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  
  const [newTask, setNewTask] = useState({
    titulo: '',
    descricao: '',
    data_vencimento: ''
  });
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    const [leadData, notesData, interactionsData, tasksData] = await Promise.all([
      getLead(id),
      getLeadNotes(id),
      getLeadInteractions(id),
      getLeadTasks(id)
    ]);
    
    setLead(leadData);
    setNotes(notesData);
    setInteractions(interactionsData);
    setTasks(tasksData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (await deleteLead(id)) {
      navigate('/leads');
    }
    setIsDeleteDialogOpen(false);
  };

  const handleAdvanceStage = async () => {
    if (!id) return;
    
    await advanceLeadStage(id);
    fetchData();
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;
    
    await addLeadNote({
      lead_id: id,
      conteudo: newNote.trim()
    });
    
    setNewNote('');
    setIsNoteDialogOpen(false);
    fetchData();
  };

  const handleAddInteraction = async () => {
    if (!id || !newInteractionContent.trim()) return;
    
    await addLeadInteraction({
      lead_id: id,
      tipo: newInteractionType,
      conteudo: newInteractionContent.trim()
    });
    
    setNewInteractionContent('');
    setIsInteractionDialogOpen(false);
    fetchData();
  };

  const handleAddTask = async () => {
    if (!id || !newTask.titulo.trim()) return;
    
    await addLeadTask({
      lead_id: id,
      titulo: newTask.titulo.trim(),
      descricao: newTask.descricao.trim() || null,
      data_vencimento: newTask.data_vencimento || null,
      completa: false
    });
    
    setNewTask({
      titulo: '',
      descricao: '',
      data_vencimento: ''
    });
    setIsTaskDialogOpen(false);
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/leads" className="hover:text-foreground">Leads</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Skeleton className="h-4 w-40" />
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <Skeleton className="h-10 w-48" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-24 inline-block" />
            <Skeleton className="h-10 w-24 inline-block" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-64" />
          </div>
          <div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Lead não encontrado</h2>
          <p className="text-muted-foreground mt-2">O lead solicitado não existe ou foi removido.</p>
          <Button className="mt-4" onClick={() => navigate('/leads')}>
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  // Combinar notas e interações para timeline
  const timelineItems = [...notes.map(note => ({ ...note, type: 'nota' as const })), 
                         ...interactions.map(interaction => ({ ...interaction, type: 'interacao' as const }))]
                         .sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());

  return (
    <>
      <Helmet>
        <title>{lead.nome} | Detalhes do Lead</title>
      </Helmet>
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/leads" className="hover:text-foreground">Leads</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>{lead.nome}</span>
        </div>
        
        {/* Título e ações */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{lead.nome}</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/leads/${id}/editar`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do lead */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Informações do Lead</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                  
                  {lead.telefone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{lead.telefone}</span>
                    </div>
                  )}
                  
                  {lead.empresa && (
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{lead.empresa}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Criado em {formatDate(lead.criado_em)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-4">
                  {lead.canal && (
                    <Badge variant="outline" className="mr-2">
                      Canal: {lead.canal.nome}
                    </Badge>
                  )}
                  
                  {lead.estagio && (
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      Estágio: {lead.estagio.nome}
                    </Badge>
                  )}
                </div>
                
                {lead.tags && lead.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map(tag => (
                        <LeadTag key={tag.id} tag={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {lead.estagio && (
                <div className="border-t p-4 flex justify-end">
                  <Button onClick={handleAdvanceStage}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Avançar para próximo estágio
                  </Button>
                </div>
              )}
            </div>
            
            {/* Timeline e interações */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <Tabs defaultValue="timeline">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56" align="end">
                          <div className="grid gap-2">
                            <Button 
                              variant="ghost" 
                              className="justify-start"
                              onClick={() => setIsNoteDialogOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Nota
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start"
                              onClick={() => setIsInteractionDialogOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Interação
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start"
                              onClick={() => setIsTaskDialogOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Tarefa
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <TabsContent value="timeline">
                    {timelineItems.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        Nenhuma nota ou interação registrada ainda.
                      </div>
                    ) : (
                      <div className="py-4 space-y-1">
                        {timelineItems.map((item) => (
                          <TimelineItem 
                            key={item.id} 
                            item={item.type === 'nota' ? item : item}
                            type={item.type}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="tarefas">
                    {tasks.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        Nenhuma tarefa registrada ainda.
                      </div>
                    ) : (
                      <div className="py-4 space-y-3">
                        {tasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onTaskUpdate={fetchData}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Ações rápidas */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="bg-muted px-6 py-4">
                <h3 className="font-medium">Ações Rápidas</h3>
              </div>
              <div className="p-6 space-y-4">
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsInteractionDialogOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Registrar Mensagem
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setNewInteractionType('chamada');
                    setIsInteractionDialogOpen(true);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Registrar Chamada
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsNoteDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nota
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsTaskDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              </div>
            </div>
            
            {/* Próximas tarefas */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="bg-muted px-6 py-4 flex justify-between items-center">
                <h3 className="font-medium">Próximas Tarefas</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsTaskDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 space-y-2">
                {tasks.filter(t => !t.completa).slice(0, 3).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskUpdate={fetchData}
                  />
                ))}
                {tasks.filter(t => !t.completa).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Nenhuma tarefa pendente.
                  </div>
                )}
                {tasks.filter(t => !t.completa).length > 3 && (
                  <div className="pt-2 text-center">
                    <Button 
                      variant="link" 
                      className="text-sm"
                      onClick={() => document.querySelector('[data-value="tarefas"]')?.click()}
                    >
                      Ver todas as tarefas
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo para adicionar nota */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
            <DialogDescription>
              Adicione uma nota para este lead.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Conteúdo da nota</Label>
              <Textarea
                id="note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Digite sua nota aqui..."
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddNote} disabled={!newNote.trim()}>Salvar Nota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para adicionar interação */}
      <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newInteractionType === 'mensagem' ? 'Registrar Mensagem' : 'Registrar Chamada'}
            </DialogTitle>
            <DialogDescription>
              {newInteractionType === 'mensagem' 
                ? 'Registre uma mensagem trocada com este lead.' 
                : 'Registre detalhes de uma chamada realizada com este lead.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={newInteractionType === 'mensagem' ? 'default' : 'outline'}
                onClick={() => setNewInteractionType('mensagem')}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              <Button
                type="button"
                variant={newInteractionType === 'chamada' ? 'default' : 'outline'}
                onClick={() => setNewInteractionType('chamada')}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                Chamada
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interactionContent">
                {newInteractionType === 'mensagem' ? 'Conteúdo da mensagem' : 'Detalhes da chamada'}
              </Label>
              <Textarea
                id="interactionContent"
                value={newInteractionContent}
                onChange={(e) => setNewInteractionContent(e.target.value)}
                placeholder={newInteractionType === 'mensagem' 
                  ? 'Digite o conteúdo da mensagem...' 
                  : 'Digite os detalhes da chamada...'}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInteractionDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleAddInteraction}
              disabled={!newInteractionContent.trim()}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para adicionar tarefa */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Tarefa</DialogTitle>
            <DialogDescription>
              Adicione uma nova tarefa relacionada a este lead.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Título da tarefa *</Label>
              <Input
                id="taskTitle"
                value={newTask.titulo}
                onChange={(e) => setNewTask({...newTask, titulo: e.target.value})}
                placeholder="Ex: Ligar para o cliente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Descrição (opcional)</Label>
              <Textarea
                id="taskDescription"
                value={newTask.descricao}
                onChange={(e) => setNewTask({...newTask, descricao: e.target.value})}
                placeholder="Adicione detalhes sobre a tarefa..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskDueDate">Data de vencimento (opcional)</Label>
              <Input
                id="taskDueDate"
                type="datetime-local"
                value={newTask.data_vencimento}
                onChange={(e) => setNewTask({...newTask, data_vencimento: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleAddTask}
              disabled={!newTask.titulo.trim()}
            >
              Salvar Tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadDetailPage;
