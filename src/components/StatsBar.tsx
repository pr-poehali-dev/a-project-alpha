import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Order } from "@/lib/types";

interface Props {
  orders: Order[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

function calcTotal(order: Order) {
  return order.repairPrice + order.parts.reduce((s, p) => s + p.price * p.quantity, 0);
}

const StatsBar = ({ orders, activeFilter, onFilterChange }: Props) => {
  const total = orders.length;
  const inProgress = orders.filter((o) => o.status === "in_progress").length;
  const ready = orders.filter((o) => o.status === "done").length;
  const revenue = orders.reduce((s, o) => s + calcTotal(o), 0);

  const stats = [
    { label: "Всего заказов", value: total, icon: "ClipboardList", color: "text-primary", filter: "all" },
    { label: "В работе", value: inProgress, icon: "Clock", color: "text-amber-600", filter: "in_progress" },
    { label: "Готово", value: ready, icon: "CircleCheck", color: "text-green-600", filter: "done" },
    { label: "Выручка", value: `${revenue.toLocaleString("ru-RU")} ₽`, icon: "Banknote", color: "text-primary", filter: "" },
  ];

  const handleClick = (filter: string) => {
    if (!filter) return;
    onFilterChange(activeFilter === filter ? "all" : filter);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card
          key={s.label}
          className={`p-4 transition-all ${
            s.filter ? "cursor-pointer hover:shadow-md" : ""
          } ${
            activeFilter === s.filter && s.filter !== "all"
              ? "ring-2 ring-primary shadow-md"
              : activeFilter === "all" && s.filter === "all"
              ? ""
              : ""
          }`}
          onClick={() => handleClick(s.filter)}
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon name={s.icon} size={16} className={s.color} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
          <div className="text-xl font-bold">{s.value}</div>
        </Card>
      ))}
    </div>
  );
};

export default StatsBar;
