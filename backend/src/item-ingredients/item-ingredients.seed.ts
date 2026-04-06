export const SINGLE_USE_DRINK_ITEMS = [
  // Drinks: 1–11, 15–17, 18–21, 22–24
  ...[1,2,3,4,5,6,7,8,9,10,11,15,16,17,18,19,20,21,22,23,24].flatMap(id => [
    { menu_item_id: id, inventory_id: 32, servingsUsed: 1, isTopping: false }, // Straw
    { menu_item_id: id, inventory_id: 33, servingsUsed: 1, isTopping: false }, // Cup
    { menu_item_id: id, inventory_id: 34, servingsUsed: 1, isTopping: false }, // Lid
    { menu_item_id: id, inventory_id: 36, servingsUsed: 1, isTopping: false }, // Napkin
  ]),
];

export const SINGLE_USE_FOOD_ITEMS = [
  // Food: 12, 13, 14
  ...[12, 13, 14].flatMap(id => [
    { menu_item_id: id, inventory_id: 35, servingsUsed: 1, isTopping: false }, // Paper Bag
    { menu_item_id: id, inventory_id: 36, servingsUsed: 1, isTopping: false }, // Napkin
  ]),
];

export const SEED_ITEM_INGREDIENTS = [
  // -----------------------------
  // MILK TEAS
  // -----------------------------

  // 1. Classic Milk Tea
  { menu_item_id: 1, inventory_id: 1, servingsUsed: 1, isTopping: false },
  { menu_item_id: 1, inventory_id: 5, servingsUsed: 1, isTopping: false },
  { menu_item_id: 1, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 1, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 1, inventory_id: 23, servingsUsed: 1, isTopping: true },

  // 2. Taro Milk Tea
  { menu_item_id: 2, inventory_id: 20, servingsUsed: 1, isTopping: false },
  { menu_item_id: 2, inventory_id: 5, servingsUsed: 1, isTopping: false },
  { menu_item_id: 2, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 2, inventory_id: 26, servingsUsed: 1, isTopping: false },
  { menu_item_id: 2, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 2, inventory_id: 23, servingsUsed: 1, isTopping: true },

  // 3. Brown Sugar Milk Tea
  { menu_item_id: 3, inventory_id: 1, servingsUsed: 1, isTopping: false },
  { menu_item_id: 3, inventory_id: 5, servingsUsed: 1, isTopping: false },
  { menu_item_id: 3, inventory_id: 10, servingsUsed: 1, isTopping: false },
  { menu_item_id: 3, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 3, inventory_id: 23, servingsUsed: 1, isTopping: true },

  // 4. Jasmine Milk Tea
  { menu_item_id: 4, inventory_id: 4, servingsUsed: 1, isTopping: false },
  { menu_item_id: 4, inventory_id: 5, servingsUsed: 1, isTopping: false },
  { menu_item_id: 4, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 4, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 4, inventory_id: 23, servingsUsed: 1, isTopping: true },

  // 15. Chocolate Milk Tea
  { menu_item_id: 15, inventory_id: 22, servingsUsed: 1, isTopping: false },
  { menu_item_id: 15, inventory_id: 5, servingsUsed: 1, isTopping: false },
  { menu_item_id: 15, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 15, inventory_id: 26, servingsUsed: 1, isTopping: false },
  { menu_item_id: 15, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 15, inventory_id: 23, servingsUsed: 1, isTopping: true },

  // 16. Red Bean Milk Tea
  { menu_item_id: 16, inventory_id: 1, servingsUsed: 1, isTopping: false },
  { menu_item_id: 16, inventory_id: 5, servingsUsed: 1, isTopping: false },
  { menu_item_id: 16, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 16, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 16, inventory_id: 24, servingsUsed: 1, isTopping: true },

  // -----------------------------
  // FRUIT TEAS
  // -----------------------------

  // 5. Mango Green Tea
  { menu_item_id: 5, inventory_id: 2, servingsUsed: 1, isTopping: false },
  { menu_item_id: 5, inventory_id: 15, servingsUsed: 1, isTopping: false },
  { menu_item_id: 5, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 5, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // 6. Passion Fruit Tea
  { menu_item_id: 6, inventory_id: 1, servingsUsed: 1, isTopping: false },
  { menu_item_id: 6, inventory_id: 12, servingsUsed: 1, isTopping: false },
  { menu_item_id: 6, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 6, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // 7. Lychee Tea
  { menu_item_id: 7, inventory_id: 2, servingsUsed: 1, isTopping: false },
  { menu_item_id: 7, inventory_id: 14, servingsUsed: 1, isTopping: false },
  { menu_item_id: 7, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 7, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // 8. Peach Oolong Tea
  { menu_item_id: 8, inventory_id: 3, servingsUsed: 1, isTopping: false },
  { menu_item_id: 8, inventory_id: 13, servingsUsed: 1, isTopping: false },
  { menu_item_id: 8, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 8, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // 17. Wintermelon Tea
  { menu_item_id: 17, inventory_id: 11, servingsUsed: 1, isTopping: false },
  { menu_item_id: 17, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 17, inventory_id: 26, servingsUsed: 1, isTopping: false },
  { menu_item_id: 17, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // -----------------------------
  // SMOOTHIES (Fresh Milk)
  // -----------------------------

  // 9. Mango Smoothie
  { menu_item_id: 9, inventory_id: 15, servingsUsed: 1, isTopping: false },
  { menu_item_id: 9, inventory_id: 6, servingsUsed: 1, isTopping: false },
  { menu_item_id: 9, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 9, inventory_id: 9, servingsUsed: 1, isTopping: false },

  // 10. Strawberry Smoothie
  { menu_item_id: 10, inventory_id: 16, servingsUsed: 1, isTopping: false },
  { menu_item_id: 10, inventory_id: 6, servingsUsed: 1, isTopping: false },
  { menu_item_id: 10, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 10, inventory_id: 9, servingsUsed: 1, isTopping: false },

  // 11. Matcha Smoothie
  { menu_item_id: 11, inventory_id: 21, servingsUsed: 1, isTopping: false },
  { menu_item_id: 11, inventory_id: 6, servingsUsed: 1, isTopping: false },
  { menu_item_id: 11, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 11, inventory_id: 9, servingsUsed: 1, isTopping: false },

  // 18. Banana & Blueberry Smoothie
  { menu_item_id: 18, inventory_id: 18, servingsUsed: 1, isTopping: false },
  { menu_item_id: 18, inventory_id: 19, servingsUsed: 1, isTopping: false },
  { menu_item_id: 18, inventory_id: 6, servingsUsed: 1, isTopping: false },
  { menu_item_id: 18, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 18, inventory_id: 9, servingsUsed: 1, isTopping: false },

  // -----------------------------
  // SLUSHES (Non‑Dairy Creamer)
  // -----------------------------

  // 19. Taro Slush
  { menu_item_id: 19, inventory_id: 20, servingsUsed: 1, isTopping: false },
  { menu_item_id: 19, inventory_id: 8, servingsUsed: 1, isTopping: false },
  { menu_item_id: 19, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 19, inventory_id: 9, servingsUsed: 1, isTopping: false },

  // 20. Watermelon Slush
  { menu_item_id: 20, inventory_id: 17, servingsUsed: 1, isTopping: false },
  { menu_item_id: 20, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 20, inventory_id: 9, servingsUsed: 1, isTopping: false },

  // 21. Mango Slush
  { menu_item_id: 21, inventory_id: 15, servingsUsed: 1, isTopping: false },
  { menu_item_id: 21, inventory_id: 25, servingsUsed: 1, isTopping: false },
  { menu_item_id: 21, inventory_id: 9, servingsUsed: 1, isTopping: false },

  // -----------------------------
  // LATTES (Fresh Milk)
  // -----------------------------

  // 22. Brown Sugar Boba Latte
  { menu_item_id: 22, inventory_id: 6, servingsUsed: 1, isTopping: false },
  { menu_item_id: 22, inventory_id: 10, servingsUsed: 1, isTopping: false },
  { menu_item_id: 22, inventory_id: 23, servingsUsed: 1, isTopping: true },
  { menu_item_id: 22, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // 23. Matcha Latte
  { menu_item_id: 23, inventory_id: 21, servingsUsed: 1, isTopping: false },
  { menu_item_id: 23, inventory_id: 6, servingsUsed: 1, isTopping: false },
  { menu_item_id: 23, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 23, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // 24. Vietnamese Latte
  { menu_item_id: 24, inventory_id: 27, servingsUsed: 1, isTopping: false },
  { menu_item_id: 24, inventory_id: 7, servingsUsed: 1, isTopping: false },
  { menu_item_id: 24, inventory_id: 6, servingsUsed: 1, isTopping: false },
  { menu_item_id: 24, inventory_id: 9, servingsUsed: 1, isTopping: false },
  { menu_item_id: 24, inventory_id: 25, servingsUsed: 1, isTopping: false },

  // -----------------------------
  // SNACKS
  // -----------------------------

  // 12. Popcorn Chicken
  { menu_item_id: 12, inventory_id: 28, servingsUsed: 1, isTopping: false },
  { menu_item_id: 12, inventory_id: 29, servingsUsed: 1, isTopping: false },

  // 13. Egg Puffs
  { menu_item_id: 13, inventory_id: 30, servingsUsed: 1, isTopping: false },

  // 14. Mochi Donuts
  { menu_item_id: 14, inventory_id: 31, servingsUsed: 1, isTopping: false },
  ...SINGLE_USE_DRINK_ITEMS,
  ...SINGLE_USE_FOOD_ITEMS,
];



