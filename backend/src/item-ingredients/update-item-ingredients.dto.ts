export class UpdateItemIngredientsDto {
  ingredients: Array<{
    inventoryId: number;
    servingsUsed: number;
    isTopping?: boolean;
  }>;
}
