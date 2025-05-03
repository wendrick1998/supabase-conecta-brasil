
import React, { useState } from 'react';
import { format, parseISO, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tarefa } from '@/types/lead';
import { updateLeadTask } from '@/services/leadService';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TaskItemProps {
  task: Tarefa;
  onTaskUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.titulo);
  const [editedDescription, setEditedDescription] = useState(task.descricao || '');
  const [editedDueDate, setEditedDueDate] = useState(task.data_vencimento || '');

  const isOverdue = task.data_vencimento && isPast(new Date(task.data_vencimento)) && !task.completa;

  const handleToggleComplete = async () => {
    await updateLeadTask(task.id, { completa: !task.completa });
    onTaskUpdate();
  };

  const handleTaskSave = async () => {
    await updateLeadTask(task.id, {
      titulo: editedTitle,
      descricao: editedDescription || null,
      data_vencimento: editedDueDate || null
    });
    setIsDialogOpen(false);
    onTaskUpdate();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return format(parseISO(dateStr), "d 'de' MMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <>
      <div className={cn(
        "flex items-start p-3 border rounded-md group",
        task.completa ? "bg-muted/50" : (isOverdue ? "border-red-200 bg-red-50" : "bg-background")
      )}>
        <Checkbox
          className="mt-1"
          checked={task.completa}
          onCheckedChange={handleToggleComplete}
        />
        <div className="ml-3 flex-1">
          <div className="flex items-start justify-between">
            <h4 className={cn(
              "font-medium text-sm",
              task.completa && "line-through text-muted-foreground"
            )}>
              {task.titulo}
            </h4>
            <div className="hidden group-hover:flex ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
              >
                Editar
              </Button>
            </div>
          </div>
          
          {task.descricao && (
            <p className={cn(
              "text-sm mt-1",
              task.completa && "line-through text-muted-foreground"
            )}>
              {task.descricao}
            </p>
          )}
          
          {task.data_vencimento && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              {task.completa ? (
                <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
              ) : isOverdue ? (
                <Clock className="h-3 w-3 mr-1 text-red-500" />
              ) : (
                <Calendar className="h-3 w-3 mr-1" />
              )}
              <span className={cn(
                isOverdue && !task.completa && "text-red-500 font-medium"
              )}>
                {formatDate(task.data_vencimento)}
              </span>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Atualize os detalhes da tarefa abaixo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Título</Label>
              <Input
                id="taskTitle"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Título da tarefa"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Descrição</Label>
              <Textarea
                id="taskDescription"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Adicione uma descrição (opcional)"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskDueDate">Data de vencimento</Label>
              <Input
                id="taskDueDate"
                type="datetime-local"
                value={editedDueDate ? editedDueDate.slice(0, 16) : ''}
                onChange={(e) => setEditedDueDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleTaskSave}>Salvar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskItem;
