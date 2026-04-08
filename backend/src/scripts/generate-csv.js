const fs = require('fs');
const path = require('path');

// ------------------------------
// CONFIGURATION
// ------------------------------
const START_ORDER_ID = 88123;
const START_ORDER_ITEM_ID = 175512;
const TARGET_REVENUE = 300000; 
const TOTAL_DAYS = 60; 

// Menu items (id, name, category, base_price)
const MENU_ITEMS = [
  { id: 1, name: "Classic Milk Tea", category: "Milk Tea", price: 5.50 },
  { id: 2, name: "Taro Milk Tea", category: "Milk Tea", price: 6.00 },
  { id: 3, name: "Brown Sugar Milk Tea", category: "Milk Tea", price: 6.50 },
  { id: 4, name: "Jasmine Milk Tea", category: "Milk Tea", price: 5.75 },
  { id: 5, name: "Mango Green Tea", category: "Fruit Tea", price: 5.50 },
  { id: 6, name: "Passion Fruit Tea", category: "Fruit Tea", price: 5.50 },
  { id: 7, name: "Lychee Tea", category: "Fruit Tea", price: 5.75 },
  { id: 8, name: "Peach Oolong Tea", category: "Fruit Tea", price: 5.75 },
  { id: 9, name: "Mango Smoothie", category: "Smoothies", price: 6.50 },
  { id: 10, name: "Strawberry Smoothie", category: "Smoothies", price: 6.50 },
  { id: 11, name: "Matcha Smoothie", category: "Smoothies", price: 7.00 },
  { id: 12, name: "Popcorn Chicken", category: "Snacks", price: 4.50 },
  { id: 13, name: "Egg Puffs", category: "Snacks", price: 3.50 },
  { id: 14, name: "Mochi Donuts", category: "Snacks", price: 4.00 },
  { id: 15, name: "Chocolate Milk Tea", category: "Milk Tea", price: 5.50 },
  { id: 16, name: "Red Bean Milk Tea", category: "Milk Tea", price: 5.50 },
  { id: 17, name: "Wintermelon Tea", category: "Fruit Tea", price: 5.75 },
  { id: 18, name: "Banana & Blueberry Smoothie", category: "Smoothies", price: 6.50 },
  { id: 19, name: "Taro Slush", category: "Slush", price: 6.75 },
  { id: 20, name: "Watermelon Slush", category: "Slush", price: 6.50 },
  { id: 21, name: "Mango Slush", category: "Slush", price: 6.50 },
  { id: 22, name: "Brown Sugar Boba Latte", category: "Latte", price: 6.50 },
  { id: 23, name: "Matcha Latte", category: "Latte", price: 5.50 },
  { id: 24, name: "Vietnamese Latte", category: "Latte", price: 4.50 }
];

// Random name generator
const FIRST_NAMES = ["Emily", "Jacob", "Sophia", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Isabella", "Mason", "Mia", "Lucas", "Charlotte", "James", "Amelia"];
const LAST_NAMES = ["Nguyen", "Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"];

function randomName() {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}

function randomPhone() {
  const area = 200 + Math.floor(Math.random() * 700);
  const mid = 200 + Math.floor(Math.random() * 700);
  const end = 1000 + Math.floor(Math.random() * 9000);
  return `${area}-${mid}-${end}`;
}

// Random helpers
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Sizes
const SIZES = [
  { name: "Small", adj: -0.50 },
  { name: "Regular", adj: 0.00 },
  { name: "Large", adj: 0.50 }
];

// Sugar / Ice
const SUGAR = ["0%", "25%", "50%", "75%", "100%"];
const ICE = ["No Ice", "Less Ice", "Regular", "Extra Ice"];

// Toppings
const TOPPINGS = ["Boba", "Popping Boba", "Aloe Vera", "Red Bean", "Grass Jelly", "Lychee Jelly"];

// ------------------------------
// GENERATION
// ------------------------------
let orderId = START_ORDER_ID;
let orderItemId = START_ORDER_ITEM_ID;

let ordersCSV = "id,status,order_type,total,created_at,completed_at,payment_type,customer_name,customer_phone\n";
let itemsCSV = "id,quantity,size,sugar_level,ice_level,toppings,item_price,order_id,menu_item_id\n";

let totalRevenue = 0;

// Four specific spike dates
const PEAK_DATES = new Set([
  "2026-02-14",
  "2026-03-17",
  "2026-04-01",
  "2026-04-05"
]);

// Start AFTER your existing data
const startDate = new Date("2026-02-08");

for (let day = 0; day < TOTAL_DAYS; day++) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + day);

  const dateStr = date.toISOString().split("T")[0];

  let ordersToday;

  if (PEAK_DATES.has(dateStr)) {
    ordersToday = randInt(1000, 1200); // huge spike days
  } else {
    ordersToday = randInt(120, 220);
  }

  for (let i = 0; i < ordersToday; i++) {
    if (totalRevenue >= TARGET_REVENUE) break;

    const created = new Date(date);
    created.setHours(randInt(10, 20), randInt(0, 59), randInt(0, 59));

    const completed = new Date(created);
    completed.setMinutes(completed.getMinutes() + randInt(5, 15));

    const orderType = rand(["dine_in", "carry_out"]);
    const payment = rand(["credit_card", "cash"]);
    const customerName = randomName();
    const customerPhone = randomPhone();

    let orderTotal = 0;
    const itemCount = randInt(1, 3);

    for (let j = 0; j < itemCount; j++) {
      const menu = rand(MENU_ITEMS);
      const size = rand(SIZES);
      const sugar = rand(SUGAR);
      const ice = rand(ICE);

      const toppingCount = randInt(0, 2);
      const toppingSet = new Set();
      while (toppingSet.size < toppingCount) {
        toppingSet.add(rand(TOPPINGS));
      }
      const toppingList = [...toppingSet];

      const itemPrice = menu.price + size.adj + toppingList.length * 0.50;
      orderTotal += itemPrice;

      const toppingsCSV = JSON.stringify(toppingList).replace(/"/g, '""');
      itemsCSV += `${orderItemId},1,${size.name},${sugar},${ice},"${toppingsCSV}",${itemPrice.toFixed(2)},${orderId},${menu.id}\n`;
      orderItemId++;
    }

    totalRevenue += orderTotal;

    ordersCSV += `${orderId},completed,${orderType},${orderTotal.toFixed(2)},${created.toISOString()},${completed.toISOString()},${payment},${customerName},${customerPhone}\n`;
    orderId++;
  }

  if (totalRevenue >= TARGET_REVENUE) break;
}

// ------------------------------
// WRITE FILES
// ------------------------------
fs.writeFileSync(path.join(__dirname, "orders_2.csv"), ordersCSV);
fs.writeFileSync(path.join(__dirname, "order_items_2.csv"), itemsCSV);

console.log("CSV generation complete!");
console.log("Total Revenue:", totalRevenue.toFixed(2));
console.log("Orders Generated:", orderId - START_ORDER_ID);
console.log("Order Items Generated:", orderItemId - START_ORDER_ITEM_ID);
