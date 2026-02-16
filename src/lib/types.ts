export interface Part {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  toolName: string;
  clientName: string;
  clientPhone: string;
  region: string;
  status: "received" | "in_progress" | "done" | "returned";
  comment: string;
  parts: Part[];
  repairPrice: number;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<Order["status"], string> = {
  received: "Принят",
  in_progress: "В работе",
  done: "Готов",
  returned: "Выдан",
};

export const STATUS_COLORS: Record<Order["status"], string> = {
  received: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
  returned: "bg-gray-100 text-gray-500",
};

export const REGIONS = [
  "Москва",
  "Московская область",
  "Санкт-Петербург",
  "Краснодарский край",
  "Ростовская область",
  "Свердловская область",
  "Новосибирская область",
  "Татарстан",
  "Другой",
];

export default Order;
