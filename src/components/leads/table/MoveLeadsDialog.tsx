
import React from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EstagioPipeline } from '@/types/lead';

interface MoveLeadsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count: number;
  estagios: EstagioPipeline[];
  targetEstagio: string;
  onEstagioChange: (value: string) => void;
}

const MoveLeadsDialog: React.FC<MoveLeadsDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
  estagios,
  targetEstagio,
  onEstagioChange
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface border-vendah-purple/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Mover leads</AlertDialogTitle>
          <AlertDialogDescription>
            Selecione o estágio para onde deseja mover {count} 
            {count === 1 ? ' lead' : ' leads'}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <Select
          value={targetEstagio}
          onValueChange={onEstagioChange}
        >
          <SelectTrigger className="bg-[#202027] border-vendah-purple/40">
            <SelectValue placeholder="Selecione um estágio" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-vendah-purple/30">
            {estagios.map((estagio) => (
              <SelectItem key={estagio.id} value={estagio.id}>
                {estagio.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={!targetEstagio}
            className="bg-vendah-purple hover:bg-vendah-purple/90"
          >
            Mover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MoveLeadsDialog;
