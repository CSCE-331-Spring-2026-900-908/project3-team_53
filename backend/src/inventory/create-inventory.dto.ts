export class CreateInventoryDto {
  name: string;
  supplier?: string;
  quantity: number;
  maxStock: number;
}
