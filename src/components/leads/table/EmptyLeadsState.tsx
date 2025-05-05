
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

const EmptyLeadsState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
        Nenhum lead encontrado.
      </TableCell>
    </TableRow>
  );
};

export default EmptyLeadsState;
