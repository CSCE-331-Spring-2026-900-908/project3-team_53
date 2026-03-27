export class CreateOrderItemDto {
  menuItemId: number;
  quantity: number;
  size: string;
  sugar_level: string;
  ice_level: string;
  toppings: string[];
  item_price: number;
}

export class CreateOrderDto {
  order_type: string;
  total: number;
  items: CreateOrderItemDto[];
}
