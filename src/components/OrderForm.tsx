import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Order, Part, REGIONS, STATUS_LABELS } from "@/lib/types";
import { generateId } from "@/lib/storage";

interface Props {
  order?: Order;
  onSave: (order: Order) => void;
  onCancel: () => void;
}

const emptyPart = (): Part => ({
  id: generateId(),
  name: "",
  price: 0,
  quantity: 1,
});

const OrderForm = ({ order, onSave, onCancel }: Props) => {
  const isEdit = !!order;

  const [toolName, setToolName] = useState(order?.toolName ?? "");
  const [clientName, setClientName] = useState(order?.clientName ?? "");
  const [clientPhone, setClientPhone] = useState(order?.clientPhone ?? "");
  const [region, setRegion] = useState(order?.region ?? "");
  const [status, setStatus] = useState<Order["status"]>(order?.status ?? "received");
  const [comment, setComment] = useState(order?.comment ?? "");
  const [repairPrice, setRepairPrice] = useState(order?.repairPrice ?? 0);
  const [parts, setParts] = useState<Part[]>(order?.parts ?? []);

  const addPart = () => setParts([...parts, emptyPart()]);

  const updatePart = (id: string, field: keyof Part, value: string | number) => {
    setParts(parts.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removePart = (id: string) => setParts(parts.filter((p) => p.id !== id));

  const partsTotal = parts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const total = repairPrice + partsTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    onSave({
      id: order?.id ?? generateId(),
      toolName,
      clientName,
      clientPhone,
      region,
      status,
      comment,
      parts,
      repairPrice,
      createdAt: order?.createdAt ?? now,
      updatedAt: now,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon name="Wrench" size={20} />
            Инструмент и клиент
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toolName">Инструмент *</Label>
              <Input
                id="toolName"
                placeholder="Например: Bosch GBH 2-26"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Order["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Клиент *</Label>
              <Input
                id="clientName"
                placeholder="ФИО клиента"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Телефон</Label>
              <Input
                id="clientPhone"
                placeholder="+7 (999) 123-45-67"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Регион</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon name="Package" size={20} />
            Запчасти
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {parts.map((part) => (
            <div key={part.id} className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Название</Label>
                <Input
                  placeholder="Запчасть"
                  value={part.name}
                  onChange={(e) => updatePart(part.id, "name", e.target.value)}
                />
              </div>
              <div className="w-24 space-y-1">
                <Label className="text-xs text-muted-foreground">Кол-во</Label>
                <Input
                  type="number"
                  min={1}
                  value={part.quantity}
                  onChange={(e) => updatePart(part.id, "quantity", +e.target.value)}
                />
              </div>
              <div className="w-32 space-y-1">
                <Label className="text-xs text-muted-foreground">Цена, ₽</Label>
                <Input
                  type="number"
                  min={0}
                  value={part.price}
                  onChange={(e) => updatePart(part.id, "price", +e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removePart(part.id)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addPart}>
            <Icon name="Plus" size={16} />
            Добавить запчасть
          </Button>
          {parts.length > 0 && (
            <div className="text-sm text-muted-foreground pt-2 border-t">
              Итого запчасти: <span className="font-medium text-foreground">{partsTotal.toLocaleString("ru-RU")} ₽</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon name="Calculator" size={20} />
            Работа и комментарии
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repairPrice">Стоимость работы, ₽</Label>
            <Input
              id="repairPrice"
              type="number"
              min={0}
              value={repairPrice}
              onChange={(e) => setRepairPrice(+e.target.value)}
              className="max-w-[200px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарии</Label>
            <Textarea
              id="comment"
              placeholder="Описание неисправности, выполненных работ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="text-sm text-muted-foreground">Итого к оплате</div>
            <div className="text-2xl font-bold">{total.toLocaleString("ru-RU")} ₽</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">
          <Icon name="Check" size={16} />
          {isEdit ? "Сохранить" : "Создать заказ"}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
