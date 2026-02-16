import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import StatsBar from "@/components/StatsBar";
import OrderTable from "@/components/OrderTable";
import OrderForm from "@/components/OrderForm";
import { Order, STATUS_LABELS } from "@/lib/types";
import { loadOrders, saveOrders } from "@/lib/storage";

type View = "list" | "form";

const Index = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [view, setView] = useState<View>("list");
  const [editingOrder, setEditingOrder] = useState<Order | undefined>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const persist = (updated: Order[]) => {
    setOrders(updated);
    saveOrders(updated);
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.toolName.toLowerCase().includes(q) ||
          o.clientName.toLowerCase().includes(q) ||
          o.clientPhone.toLowerCase().includes(q) ||
          o.region.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, search, statusFilter]);

  const handleNew = () => {
    setEditingOrder(undefined);
    setView("form");
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setView("form");
  };

  const handleSave = (order: Order) => {
    const exists = orders.find((o) => o.id === order.id);
    const updated = exists
      ? orders.map((o) => (o.id === order.id ? order : o))
      : [order, ...orders];
    persist(updated);
    setView("list");
    toast({
      title: exists ? "Заказ обновлён" : "Заказ создан",
      description: `${order.toolName} — ${order.clientName}`,
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    persist(orders.filter((o) => o.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Заказ удалён" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Wrench" size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">СервисПро</h1>
              <p className="text-xs text-muted-foreground">Учёт ремонтов</p>
            </div>
          </div>
          {view === "list" ? (
            <Button onClick={handleNew} size="sm">
              <Icon name="Plus" size={16} />
              Новый заказ
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setView("list")}>
              <Icon name="ArrowLeft" size={16} />
              К списку
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {view === "list" ? (
          <>
            <StatsBar orders={orders} activeFilter={statusFilter} onFilterChange={setStatusFilter} />

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Поиск по инструменту, клиенту, телефону..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <OrderTable
              orders={filteredOrders}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          </>
        ) : (
          <OrderForm order={editingOrder} onSave={handleSave} onCancel={() => setView("list")} />
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заказ?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Заказ будет удалён навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;