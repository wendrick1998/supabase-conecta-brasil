import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getLead, deleteLead, avancarEstagio } from '@/services/leadService';
import { Lead } from '@/types/lead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LeadTag from '@/components/LeadTag';
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton';

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const leadData = await getLead(id);
      setLead(leadData);
      setIsLoading(false);
    };

    fetchLead();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (id) {
        await deleteLead(id);
        toast({
          title: "Lead deletado!",
          description: "O lead foi removido com sucesso.",
        })
        navigate('/leads');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar lead!",
        description: "Houve um problema ao remover o lead. Tente novamente.",
      })
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdvanceStage = async () => {
    setIsAdvancing(true);
    try {
      if (id) {
        const newEstagioId = await avancarEstagio(id);
        if (newEstagioId && lead) {
          // Atualiza o lead com o novo estágio
          const updatedLead = { ...lead, estagio_id: newEstagioId };
          setLead(updatedLead);

          toast({
            title: "Lead avançado!",
            description: "O lead foi movido para o próximo estágio.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao avançar lead!",
            description: "Não foi possível avançar o lead para o próximo estágio.",
          })
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao avançar lead!",
        description: "Houve um problema ao avançar o lead. Tente novamente.",
      })
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{lead ? `${lead.nome} - Detalhes` : 'Detalhes do Lead'}</title>
      </Helmet>
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/leads" className="hover:text-foreground">Leads</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>{lead ? lead.nome : 'Lead'}</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? (
              <Skeleton className="h-10 w-48" />
            ) : (
              lead ? lead.nome : 'Lead não encontrado'
            )}
          </h1>
          {lead && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(`/leads/${id}/editar`)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/5">
                      <Trash2 className="mr-2 h-4 w-4" /> Deletar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá deletar o lead permanentemente. Tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-2/3" />
          </div>
        ) : lead ? (
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
            <div className="lg:col-span-5">
              {/* Informações do Lead */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Informações do Lead</CardTitle>
                  <CardDescription>Detalhes sobre o lead.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Nome</p>
                    <p className="text-gray-800">{lead.nome}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-gray-800">{lead.email || 'Não informado'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-gray-800">{lead.telefone || 'Não informado'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Empresa</p>
                    <p className="text-gray-800">{lead.empresa || 'Não informado'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Canal de Origem</p>
                    <p className="text-gray-800">{lead.canal?.nome || 'Não informado'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Estágio no Pipeline</p>
                    <div className="flex items-center">
                      <Badge className="mr-2">{lead.estagio?.nome || 'Não informado'}</Badge>
                      {lead.estagio && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAdvanceStage}
                          disabled={isAdvancing || lead.estagio.ordem >= 3}
                        >
                          {isAdvancing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Avançar Estágio
                        </Button>
                      )}
                    </div>
                  </div>
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tags</p>
                      <div className="flex flex-wrap">
                        {lead.tags.map(tag => (
                          <LeadTag key={tag.id} tag={tag} />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Criado em {format(new Date(lead.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  <br />
                  Atualizado em {format(new Date(lead.atualizado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                  <CardDescription>Ações rápidas para este lead.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" /> Concluir Lead
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" /> Editar Lead
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Deletar Lead
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá deletar o lead permanentemente. Tem certeza que deseja continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">O lead solicitado não existe ou foi removido.</p>
            <Link to="/leads" className="text-primary hover:underline mt-4 inline-block">
              Voltar para a lista de leads
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default LeadDetailPage;
