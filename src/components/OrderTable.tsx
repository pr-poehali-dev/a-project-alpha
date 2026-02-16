import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Icon from "@/components/ui/icon";
import { Order, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";

interface Props {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function calcTotal(order: Order) {
  const partsTotal = order.parts.reduce((s, p) => s + p.price * p.quantity, 0);
  return order.repairPrice + partsTotal;
}

const OrderTable = ({ orders, onEdit, onDelete }: Props) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Icon name="Wrench" size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">Заказов пока нет</h3>
        <p className="text-muted-foreground">Нажмите «Новый заказ», чтобы добавить первый</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card animate-fade-in overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Дата</TableHead>
            <TableHead>Инструмент</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead className="hidden md:table-cell">Регион</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onEdit(order)}
            >
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="font-medium">{order.toolName}</TableCell>
              <TableCell>
                <div>{order.clientName}</div>
                {order.clientPhone && (
                  <div className="text-xs text-muted-foreground">{order.clientPhone}</div>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {order.region || "—"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={STATUS_COLORS[order.status]}>
                  {STATUS_LABELS[order.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {calcTotal(order).toLocaleString("ru-RU")} ₽
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit(order)}
                  >
                    <Icon name="Pencil" size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(order.id)}
                  >
                    <Icon name="Trash2" size={15} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
