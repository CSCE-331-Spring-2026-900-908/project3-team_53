const fs = require('fs');
const path = require('path');

// =============================================================================
// MENU ITEMS (24 items matching generate-csv.js)
// =============================================================================
const MENU_ITEMS = [
  { id: 1, name: "Classic Milk Tea", category: "Milk Tea", price: 5.50, available: true },
  { id: 2, name: "Taro Milk Tea", category: "Milk Tea", price: 6.00, available: true },
  { id: 3, name: "Brown Sugar Milk Tea", category: "Milk Tea", price: 6.50, available: true },
  { id: 4, name: "Jasmine Milk Tea", category: "Milk Tea", price: 5.75, available: true },
  { id: 5, name: "Mango Green Tea", category: "Fruit Tea", price: 5.50, available: true },
  { id: 6, name: "Passion Fruit Tea", category: "Fruit Tea", price: 5.50, available: true },
  { id: 7, name: "Lychee Tea", category: "Fruit Tea", price: 5.75, available: true },
  { id: 8, name: "Peach Oolong Tea", category: "Fruit Tea", price: 5.75, available: true },
  { id: 9, name: "Mango Smoothie", category: "Smoothies", price: 6.50, available: true },
  { id: 10, name: "Strawberry Smoothie", category: "Smoothies", price: 6.50, available: true },
  { id: 11, name: "Matcha Smoothie", category: "Smoothies", price: 7.00, available: true },
  { id: 12, name: "Popcorn Chicken", category: "Snacks", price: 4.50, available: true },
  { id: 13, name: "Egg Puffs", category: "Snacks", price: 3.50, available: true },
  { id: 14, name: "Mochi Donuts", category: "Snacks", price: 4.00, available: true },
  { id: 15, name: "Chocolate Milk Tea", category: "Milk Tea", price: 5.50, available: true },
  { id: 16, name: "Red Bean Milk Tea", category: "Milk Tea", price: 5.50, available: true },
  { id: 17, name: "Wintermelon Tea", category: "Fruit Tea", price: 5.75, available: true },
  { id: 18, name: "Banana & Blueberry Smoothie", category: "Smoothies", price: 6.50, available: true },
  { id: 19, name: "Taro Slush", category: "Slush", price: 6.75, available: true },
  { id: 20, name: "Watermelon Slush", category: "Slush", price: 6.50, available: true },
  { id: 21, name: "Mango Slush", category: "Slush", price: 6.50, available: true },
  { id: 22, name: "Brown Sugar Boba Latte", category: "Latte", price: 6.50, available: true },
  { id: 23, name: "Matcha Latte", category: "Latte", price: 5.50, available: true },
  { id: 24, name: "Vietnamese Latte", category: "Latte", price: 4.50, available: true },
];

// =============================================================================
// TOPPING ITEMS (6 toppings)
// =============================================================================
const TOPPING_ITEMS = [
  { id: 1, name: "Boba", category: "Classic", price: 0.50, available: true },
  { id: 2, name: "Popping Boba", category: "Classic", price: 0.50, available: true },
  { id: 3, name: "Aloe Vera", category: "Jelly", price: 0.50, available: true },
  { id: 4, name: "Red Bean", category: "Classic", price: 0.50, available: true },
  { id: 5, name: "Grass Jelly", category: "Jelly", price: 0.50, available: true },
  { id: 6, name: "Lychee Jelly", category: "Jelly", price: 0.50, available: true },
];

// =============================================================================
// INVENTORY (ingredients & supplies)
// =============================================================================
const INVENTORY = [
  // Tea bases
  { id: 1,  name: "Black Tea Leaves",      quantity: 200, supplier: "TeaSource Co.",       maxStock: 500, quantityPerServing: 2.00, status: "In Stock" },
  { id: 2,  name: "Green Tea Leaves",       quantity: 180, supplier: "TeaSource Co.",       maxStock: 500, quantityPerServing: 2.00, status: "In Stock" },
  { id: 3,  name: "Oolong Tea Leaves",      quantity: 150, supplier: "TeaSource Co.",       maxStock: 400, quantityPerServing: 2.00, status: "In Stock" },
  { id: 4,  name: "Jasmine Tea Leaves",     quantity: 120, supplier: "TeaSource Co.",       maxStock: 400, quantityPerServing: 2.00, status: "In Stock" },
  // Milk
  { id: 5,  name: "Whole Milk",             quantity: 300, supplier: "DairyFresh Inc.",     maxStock: 600, quantityPerServing: 3.00, status: "In Stock" },
  { id: 6,  name: "Condensed Milk",         quantity: 100, supplier: "DairyFresh Inc.",     maxStock: 300, quantityPerServing: 2.00, status: "In Stock" },
  // Sweeteners
  { id: 7,  name: "Brown Sugar Syrup",      quantity: 150, supplier: "SweetSupply LLC",     maxStock: 400, quantityPerServing: 1.50, status: "In Stock" },
  { id: 8,  name: "Simple Syrup",           quantity: 250, supplier: "SweetSupply LLC",     maxStock: 500, quantityPerServing: 1.00, status: "In Stock" },
  // Powders
  { id: 9,  name: "Taro Powder",            quantity: 100, supplier: "BobaPowders Ltd.",    maxStock: 300, quantityPerServing: 3.00, status: "In Stock" },
  { id: 10, name: "Matcha Powder",          quantity: 80,  supplier: "BobaPowders Ltd.",    maxStock: 250, quantityPerServing: 2.50, status: "In Stock" },
  { id: 11, name: "Chocolate Powder",       quantity: 90,  supplier: "BobaPowders Ltd.",    maxStock: 250, quantityPerServing: 2.50, status: "In Stock" },
  // Fruit purees & syrups
  { id: 12, name: "Mango Puree",            quantity: 120, supplier: "FruitCraft Co.",      maxStock: 350, quantityPerServing: 3.00, status: "In Stock" },
  { id: 13, name: "Passion Fruit Puree",    quantity: 100, supplier: "FruitCraft Co.",      maxStock: 300, quantityPerServing: 3.00, status: "In Stock" },
  { id: 14, name: "Lychee Syrup",           quantity: 90,  supplier: "FruitCraft Co.",      maxStock: 300, quantityPerServing: 2.00, status: "In Stock" },
  { id: 15, name: "Peach Syrup",            quantity: 85,  supplier: "FruitCraft Co.",      maxStock: 300, quantityPerServing: 2.00, status: "In Stock" },
  { id: 16, name: "Strawberry Puree",       quantity: 110, supplier: "FruitCraft Co.",      maxStock: 350, quantityPerServing: 3.00, status: "In Stock" },
  { id: 17, name: "Watermelon Puree",       quantity: 95,  supplier: "FruitCraft Co.",      maxStock: 300, quantityPerServing: 3.00, status: "In Stock" },
  { id: 18, name: "Banana Puree",           quantity: 80,  supplier: "FruitCraft Co.",      maxStock: 250, quantityPerServing: 2.50, status: "In Stock" },
  { id: 19, name: "Blueberry Puree",        quantity: 75,  supplier: "FruitCraft Co.",      maxStock: 250, quantityPerServing: 2.50, status: "In Stock" },
  { id: 20, name: "Wintermelon Syrup",      quantity: 70,  supplier: "FruitCraft Co.",      maxStock: 250, quantityPerServing: 2.00, status: "In Stock" },
  { id: 21, name: "Red Bean Paste",         quantity: 60,  supplier: "FruitCraft Co.",      maxStock: 200, quantityPerServing: 2.00, status: "In Stock" },
  // Toppings
  { id: 22, name: "Tapioca Pearls",         quantity: 250, supplier: "BobaToppings Inc.",   maxStock: 600, quantityPerServing: 2.00, status: "In Stock" },
  { id: 23, name: "Popping Boba",           quantity: 150, supplier: "BobaToppings Inc.",   maxStock: 400, quantityPerServing: 1.50, status: "In Stock" },
  { id: 24, name: "Aloe Vera Cubes",        quantity: 100, supplier: "BobaToppings Inc.",   maxStock: 300, quantityPerServing: 1.50, status: "In Stock" },
  { id: 25, name: "Cooked Red Bean",        quantity: 80,  supplier: "BobaToppings Inc.",   maxStock: 250, quantityPerServing: 1.50, status: "In Stock" },
  { id: 26, name: "Grass Jelly",            quantity: 90,  supplier: "BobaToppings Inc.",   maxStock: 300, quantityPerServing: 1.50, status: "In Stock" },
  { id: 27, name: "Lychee Jelly",           quantity: 85,  supplier: "BobaToppings Inc.",   maxStock: 300, quantityPerServing: 1.50, status: "In Stock" },
  // Snack ingredients
  { id: 28, name: "Chicken Bites",          quantity: 200, supplier: "SnackSource Ltd.",    maxStock: 500, quantityPerServing: 4.00, status: "In Stock" },
  { id: 29, name: "Egg Puff Batter",        quantity: 150, supplier: "SnackSource Ltd.",    maxStock: 400, quantityPerServing: 3.00, status: "In Stock" },
  { id: 30, name: "Mochi Donut Mix",        quantity: 130, supplier: "SnackSource Ltd.",    maxStock: 350, quantityPerServing: 3.00, status: "In Stock" },
  { id: 31, name: "Frying Oil",             quantity: 180, supplier: "SnackSource Ltd.",    maxStock: 400, quantityPerServing: 1.00, status: "In Stock" },
  // Supplies
  { id: 32, name: "Cups (16oz)",            quantity: 500, supplier: "PackagePro Co.",      maxStock: 2000, quantityPerServing: 1.00, status: "In Stock" },
  { id: 33, name: "Lids",                   quantity: 500, supplier: "PackagePro Co.",      maxStock: 2000, quantityPerServing: 1.00, status: "In Stock" },
  { id: 34, name: "Straws",                 quantity: 500, supplier: "PackagePro Co.",      maxStock: 2000, quantityPerServing: 1.00, status: "In Stock" },
  { id: 35, name: "Ice",                    quantity: 400, supplier: "ColdChain Supplies",  maxStock: 1000, quantityPerServing: 2.00, status: "In Stock" },
  { id: 36, name: "Snack Containers",       quantity: 300, supplier: "PackagePro Co.",      maxStock: 1500, quantityPerServing: 1.00, status: "In Stock" },
];

// =============================================================================
// ITEM INGREDIENTS (menu_item_id -> inventory_id mappings)
// =============================================================================
// Each drink gets its base ingredients + cups/lids/straws
// Each snack gets its ingredients + snack container
const ITEM_INGREDIENTS = [];
let ingredientId = 1;

function addIngredient(menuItemId, inventoryId, servingsUsed, isTopping = false) {
  ITEM_INGREDIENTS.push({ id: ingredientId++, menuItemId, inventoryId, servingsUsed, isTopping });
}

// Helper: add common drink supplies (cup, lid, straw)
function addDrinkSupplies(menuItemId) {
  addIngredient(menuItemId, 32, 1.00); // Cup
  addIngredient(menuItemId, 33, 1.00); // Lid
  addIngredient(menuItemId, 34, 1.00); // Straw
}

// Helper: add common snack supplies
function addSnackSupplies(menuItemId) {
  addIngredient(menuItemId, 36, 1.00); // Snack Container
}

// 1. Classic Milk Tea - Black Tea, Whole Milk, Simple Syrup
addIngredient(1, 1, 2.00); // Black Tea
addIngredient(1, 5, 3.00); // Whole Milk
addIngredient(1, 8, 1.00); // Simple Syrup
addDrinkSupplies(1);

// 2. Taro Milk Tea - Black Tea, Whole Milk, Taro Powder
addIngredient(2, 1, 2.00);
addIngredient(2, 5, 3.00);
addIngredient(2, 9, 3.00); // Taro Powder
addDrinkSupplies(2);

// 3. Brown Sugar Milk Tea - Black Tea, Whole Milk, Brown Sugar Syrup
addIngredient(3, 1, 2.00);
addIngredient(3, 5, 3.00);
addIngredient(3, 7, 1.50); // Brown Sugar Syrup
addDrinkSupplies(3);

// 4. Jasmine Milk Tea - Jasmine Tea, Whole Milk, Simple Syrup
addIngredient(4, 4, 2.00); // Jasmine Tea
addIngredient(4, 5, 3.00);
addIngredient(4, 8, 1.00);
addDrinkSupplies(4);

// 5. Mango Green Tea - Green Tea, Mango Puree, Simple Syrup
addIngredient(5, 2, 2.00); // Green Tea
addIngredient(5, 12, 3.00); // Mango Puree
addIngredient(5, 8, 1.00);
addDrinkSupplies(5);

// 6. Passion Fruit Tea - Green Tea, Passion Fruit Puree, Simple Syrup
addIngredient(6, 2, 2.00);
addIngredient(6, 13, 3.00); // Passion Fruit Puree
addIngredient(6, 8, 1.00);
addDrinkSupplies(6);

// 7. Lychee Tea - Green Tea, Lychee Syrup, Simple Syrup
addIngredient(7, 2, 2.00);
addIngredient(7, 14, 2.00); // Lychee Syrup
addIngredient(7, 8, 1.00);
addDrinkSupplies(7);

// 8. Peach Oolong Tea - Oolong Tea, Peach Syrup, Simple Syrup
addIngredient(8, 3, 2.00); // Oolong Tea
addIngredient(8, 15, 2.00); // Peach Syrup
addIngredient(8, 8, 1.00);
addDrinkSupplies(8);

// 9. Mango Smoothie - Mango Puree, Whole Milk, Ice
addIngredient(9, 12, 3.00);
addIngredient(9, 5, 2.00);
addIngredient(9, 35, 3.00); // Ice
addDrinkSupplies(9);

// 10. Strawberry Smoothie - Strawberry Puree, Whole Milk, Ice
addIngredient(10, 16, 3.00); // Strawberry Puree
addIngredient(10, 5, 2.00);
addIngredient(10, 35, 3.00);
addDrinkSupplies(10);

// 11. Matcha Smoothie - Matcha Powder, Whole Milk, Ice
addIngredient(11, 10, 2.50); // Matcha Powder
addIngredient(11, 5, 2.00);
addIngredient(11, 35, 3.00);
addDrinkSupplies(11);

// 12. Popcorn Chicken - Chicken Bites, Frying Oil
addIngredient(12, 28, 4.00); // Chicken Bites
addIngredient(12, 31, 1.00); // Frying Oil
addSnackSupplies(12);

// 13. Egg Puffs - Egg Puff Batter, Frying Oil
addIngredient(13, 29, 3.00); // Egg Puff Batter
addIngredient(13, 31, 1.00);
addSnackSupplies(13);

// 14. Mochi Donuts - Mochi Donut Mix, Frying Oil
addIngredient(14, 30, 3.00); // Mochi Donut Mix
addIngredient(14, 31, 1.00);
addSnackSupplies(14);

// 15. Chocolate Milk Tea - Black Tea, Whole Milk, Chocolate Powder
addIngredient(15, 1, 2.00);
addIngredient(15, 5, 3.00);
addIngredient(15, 11, 2.50); // Chocolate Powder
addDrinkSupplies(15);

// 16. Red Bean Milk Tea - Black Tea, Whole Milk, Red Bean Paste
addIngredient(16, 1, 2.00);
addIngredient(16, 5, 3.00);
addIngredient(16, 21, 2.00); // Red Bean Paste
addDrinkSupplies(16);

// 17. Wintermelon Tea - Green Tea, Wintermelon Syrup, Simple Syrup
addIngredient(17, 2, 2.00);
addIngredient(17, 20, 2.00); // Wintermelon Syrup
addIngredient(17, 8, 1.00);
addDrinkSupplies(17);

// 18. Banana & Blueberry Smoothie - Banana, Blueberry, Whole Milk, Ice
addIngredient(18, 18, 2.50); // Banana Puree
addIngredient(18, 19, 2.50); // Blueberry Puree
addIngredient(18, 5, 2.00);
addIngredient(18, 35, 3.00);
addDrinkSupplies(18);

// 19. Taro Slush - Taro Powder, Whole Milk, Ice
addIngredient(19, 9, 3.00);
addIngredient(19, 5, 2.00);
addIngredient(19, 35, 4.00); // Extra ice for slush
addDrinkSupplies(19);

// 20. Watermelon Slush - Watermelon Puree, Simple Syrup, Ice
addIngredient(20, 17, 3.00); // Watermelon Puree
addIngredient(20, 8, 1.00);
addIngredient(20, 35, 4.00);
addDrinkSupplies(20);

// 21. Mango Slush - Mango Puree, Simple Syrup, Ice
addIngredient(21, 12, 3.00);
addIngredient(21, 8, 1.00);
addIngredient(21, 35, 4.00);
addDrinkSupplies(21);

// 22. Brown Sugar Boba Latte - Black Tea, Whole Milk, Brown Sugar Syrup, Tapioca Pearls
addIngredient(22, 1, 2.00);
addIngredient(22, 5, 3.00);
addIngredient(22, 7, 1.50);
addIngredient(22, 22, 2.00, true); // Tapioca Pearls (topping)
addDrinkSupplies(22);

// 23. Matcha Latte - Matcha Powder, Whole Milk, Simple Syrup
addIngredient(23, 10, 2.50);
addIngredient(23, 5, 3.00);
addIngredient(23, 8, 1.00);
addDrinkSupplies(23);

// 24. Vietnamese Latte - Black Tea, Condensed Milk, Simple Syrup
addIngredient(24, 1, 2.00);
addIngredient(24, 6, 2.00); // Condensed Milk
addIngredient(24, 8, 1.00);
addDrinkSupplies(24);

// Also add topping ingredients (these map toppings to their inventory items)
// Topping menu items aren't in menu_items, but we track them in item_ingredients
// for when toppings are added to orders - the inventory should be decremented.
// We'll add these as separate entries with isTopping=true for each drink that can have toppings.
// Actually, toppings are tracked separately via topping_items, so we just need the
// inventory for topping items. Let's add topping -> inventory mappings for all drinks.

// =============================================================================
// EMPLOYEES
// =============================================================================
const EMPLOYEES = [
  { id: 1,  name: "Sarah Chen",         role: "Manager",  shift: "Morning",   isWorking: true,  wage: 22.00 },
  { id: 2,  name: "Marcus Johnson",     role: "Manager",  shift: "Evening",   isWorking: false, wage: 22.00 },
  { id: 3,  name: "Lily Tran",          role: "Cashier",  shift: "Morning",   isWorking: true,  wage: 14.50 },
  { id: 4,  name: "David Park",         role: "Cashier",  shift: "Afternoon", isWorking: true,  wage: 14.50 },
  { id: 5,  name: "Jessica Martinez",   role: "Cashier",  shift: "Evening",   isWorking: false, wage: 14.50 },
  { id: 6,  name: "Kevin Nguyen",       role: "Barista",  shift: "Morning",   isWorking: true,  wage: 16.00 },
  { id: 7,  name: "Emma Wilson",        role: "Barista",  shift: "Morning",   isWorking: true,  wage: 16.00 },
  { id: 8,  name: "Ryan Lee",           role: "Barista",  shift: "Afternoon", isWorking: true,  wage: 16.00 },
  { id: 9,  name: "Olivia Davis",       role: "Barista",  shift: "Afternoon", isWorking: false, wage: 16.00 },
  { id: 10, name: "Brandon Kim",        role: "Barista",  shift: "Evening",   isWorking: false, wage: 16.00 },
  { id: 11, name: "Sophia Anderson",    role: "Barista",  shift: "Evening",   isWorking: false, wage: 16.00 },
  { id: 12, name: "Jason Thomas",       role: "Cook",     shift: "Morning",   isWorking: true,  wage: 15.00 },
  { id: 13, name: "Mia Garcia",         role: "Cook",     shift: "Afternoon", isWorking: true,  wage: 15.00 },
  { id: 14, name: "Daniel Brown",       role: "Cook",     shift: "Evening",   isWorking: false, wage: 15.00 },
  { id: 15, name: "Chloe Taylor",       role: "Employee", shift: "Morning",   isWorking: true,  wage: 13.00 },
  { id: 16, name: "Ethan Moore",        role: "Employee", shift: "Afternoon", isWorking: false, wage: 13.00 },
];

// =============================================================================
// GENERATE CSVs
// =============================================================================

// --- menu_items.csv ---
let menuItemsCSV = "id,name,category,price,image,available\n";
for (const item of MENU_ITEMS) {
  menuItemsCSV += `${item.id},${item.name},${item.category},${item.price.toFixed(2)},,${item.available}\n`;
}

// --- topping_items.csv ---
let toppingItemsCSV = "id,name,category,price,image,available\n";
for (const item of TOPPING_ITEMS) {
  toppingItemsCSV += `${item.id},${item.name},${item.category},${item.price.toFixed(2)},,${item.available}\n`;
}

// --- inventory.csv ---
let inventoryCSV = "id,name,quantity,supplier,maxStock,quantityPerServing,status\n";
for (const item of INVENTORY) {
  inventoryCSV += `${item.id},${item.name},${item.quantity},${item.supplier},${item.maxStock},${item.quantityPerServing.toFixed(2)},${item.status}\n`;
}

// --- item_ingredients.csv ---
let itemIngredientsCSV = "id,menu_item_id,inventory_id,servingsUsed,isTopping\n";
for (const item of ITEM_INGREDIENTS) {
  itemIngredientsCSV += `${item.id},${item.menuItemId},${item.inventoryId},${item.servingsUsed.toFixed(2)},${item.isTopping}\n`;
}

// --- employees.csv ---
let employeesCSV = "id,name,role,shift,isWorking,wage\n";
for (const emp of EMPLOYEES) {
  employeesCSV += `${emp.id},${emp.name},${emp.role},${emp.shift},${emp.isWorking},${emp.wage.toFixed(2)}\n`;
}

// =============================================================================
// WRITE FILES
// =============================================================================
const dir = __dirname;

fs.writeFileSync(path.join(dir, "menu_items.csv"), menuItemsCSV);
fs.writeFileSync(path.join(dir, "topping_items.csv"), toppingItemsCSV);
fs.writeFileSync(path.join(dir, "inventory.csv"), inventoryCSV);
fs.writeFileSync(path.join(dir, "item_ingredients.csv"), itemIngredientsCSV);
fs.writeFileSync(path.join(dir, "employees.csv"), employeesCSV);

console.log("Seed data CSV generation complete!");
console.log(`  menu_items.csv:       ${MENU_ITEMS.length} rows`);
console.log(`  topping_items.csv:    ${TOPPING_ITEMS.length} rows`);
console.log(`  inventory.csv:        ${INVENTORY.length} rows`);
console.log(`  item_ingredients.csv: ${ITEM_INGREDIENTS.length} rows`);
console.log(`  employees.csv:        ${EMPLOYEES.length} rows`);
