-- =============================================================================
-- Seed script for populating menu_items, topping_items, inventory,
-- item_ingredients, and employees tables.
--
-- Run BEFORE importing orders/order_items CSVs since order_items
-- references menu_items.
--
-- Usage:  psql -d <your_db> -f seed-database.sql
--         (adjust CSV paths as needed)
-- =============================================================================

-- Clear existing data (order matters due to foreign keys)
TRUNCATE item_ingredients CASCADE;
TRUNCATE order_items CASCADE;
TRUNCATE orders CASCADE;
TRUNCATE inventory CASCADE;
TRUNCATE topping_items CASCADE;
TRUNCATE menu_items CASCADE;
TRUNCATE employees CASCADE;

-- ------------------------------------------------
-- 1. MENU ITEMS
-- ------------------------------------------------
INSERT INTO menu_items (id, name, category, price, available) VALUES
(1, 'Classic Milk Tea', 'Milk Tea', 5.50, true),
(2, 'Taro Milk Tea', 'Milk Tea', 6.00, true),
(3, 'Brown Sugar Milk Tea', 'Milk Tea', 6.50, true),
(4, 'Jasmine Milk Tea', 'Milk Tea', 5.75, true),
(5, 'Mango Green Tea', 'Fruit Tea', 5.50, true),
(6, 'Passion Fruit Tea', 'Fruit Tea', 5.50, true),
(7, 'Lychee Tea', 'Fruit Tea', 5.75, true),
(8, 'Peach Oolong Tea', 'Fruit Tea', 5.75, true),
(9, 'Mango Smoothie', 'Smoothies', 6.50, true),
(10, 'Strawberry Smoothie', 'Smoothies', 6.50, true),
(11, 'Matcha Smoothie', 'Smoothies', 7.00, true),
(12, 'Popcorn Chicken', 'Snacks', 4.50, true),
(13, 'Egg Puffs', 'Snacks', 3.50, true),
(14, 'Mochi Donuts', 'Snacks', 4.00, true),
(15, 'Chocolate Milk Tea', 'Milk Tea', 5.50, true),
(16, 'Red Bean Milk Tea', 'Milk Tea', 5.50, true),
(17, 'Wintermelon Tea', 'Fruit Tea', 5.75, true),
(18, 'Banana & Blueberry Smoothie', 'Smoothies', 6.50, true),
(19, 'Taro Slush', 'Slush', 6.75, true),
(20, 'Watermelon Slush', 'Slush', 6.50, true),
(21, 'Mango Slush', 'Slush', 6.50, true),
(22, 'Brown Sugar Boba Latte', 'Latte', 6.50, true),
(23, 'Matcha Latte', 'Latte', 5.50, true),
(24, 'Vietnamese Latte', 'Latte', 4.50, true);

SELECT setval('menu_items_id_seq', 24);

-- ------------------------------------------------
-- 2. TOPPING ITEMS
-- ------------------------------------------------
INSERT INTO topping_items (id, name, category, price, available) VALUES
(1, 'Boba', 'Classic', 0.50, true),
(2, 'Popping Boba', 'Classic', 0.50, true),
(3, 'Aloe Vera', 'Jelly', 0.50, true),
(4, 'Red Bean', 'Classic', 0.50, true),
(5, 'Grass Jelly', 'Jelly', 0.50, true),
(6, 'Lychee Jelly', 'Jelly', 0.50, true);

SELECT setval('topping_items_id_seq', 6);

-- ------------------------------------------------
-- 3. INVENTORY
-- ------------------------------------------------
INSERT INTO inventory (id, name, quantity, supplier, "maxStock", "quantityPerServing", status) VALUES
-- Tea bases
(1,  'Black Tea Leaves',      200, 'TeaSource Co.',       500, 2.00, 'In Stock'),
(2,  'Green Tea Leaves',       180, 'TeaSource Co.',       500, 2.00, 'In Stock'),
(3,  'Oolong Tea Leaves',      150, 'TeaSource Co.',       400, 2.00, 'In Stock'),
(4,  'Jasmine Tea Leaves',     120, 'TeaSource Co.',       400, 2.00, 'In Stock'),
-- Milk
(5,  'Whole Milk',             300, 'DairyFresh Inc.',     600, 3.00, 'In Stock'),
(6,  'Condensed Milk',         100, 'DairyFresh Inc.',     300, 2.00, 'In Stock'),
-- Sweeteners
(7,  'Brown Sugar Syrup',      150, 'SweetSupply LLC',     400, 1.50, 'In Stock'),
(8,  'Simple Syrup',           250, 'SweetSupply LLC',     500, 1.00, 'In Stock'),
-- Powders
(9,  'Taro Powder',            100, 'BobaPowders Ltd.',    300, 3.00, 'In Stock'),
(10, 'Matcha Powder',           80, 'BobaPowders Ltd.',    250, 2.50, 'In Stock'),
(11, 'Chocolate Powder',        90, 'BobaPowders Ltd.',    250, 2.50, 'In Stock'),
-- Fruit purees & syrups
(12, 'Mango Puree',            120, 'FruitCraft Co.',      350, 3.00, 'In Stock'),
(13, 'Passion Fruit Puree',    100, 'FruitCraft Co.',      300, 3.00, 'In Stock'),
(14, 'Lychee Syrup',            90, 'FruitCraft Co.',      300, 2.00, 'In Stock'),
(15, 'Peach Syrup',              85, 'FruitCraft Co.',      300, 2.00, 'In Stock'),
(16, 'Strawberry Puree',       110, 'FruitCraft Co.',      350, 3.00, 'In Stock'),
(17, 'Watermelon Puree',        95, 'FruitCraft Co.',      300, 3.00, 'In Stock'),
(18, 'Banana Puree',             80, 'FruitCraft Co.',      250, 2.50, 'In Stock'),
(19, 'Blueberry Puree',         75, 'FruitCraft Co.',      250, 2.50, 'In Stock'),
(20, 'Wintermelon Syrup',       70, 'FruitCraft Co.',      250, 2.00, 'In Stock'),
(21, 'Red Bean Paste',           60, 'FruitCraft Co.',      200, 2.00, 'In Stock'),
-- Toppings
(22, 'Tapioca Pearls',         250, 'BobaToppings Inc.',   600, 2.00, 'In Stock'),
(23, 'Popping Boba',           150, 'BobaToppings Inc.',   400, 1.50, 'In Stock'),
(24, 'Aloe Vera Cubes',        100, 'BobaToppings Inc.',   300, 1.50, 'In Stock'),
(25, 'Cooked Red Bean',         80, 'BobaToppings Inc.',   250, 1.50, 'In Stock'),
(26, 'Grass Jelly',              90, 'BobaToppings Inc.',   300, 1.50, 'In Stock'),
(27, 'Lychee Jelly',            85, 'BobaToppings Inc.',   300, 1.50, 'In Stock'),
-- Snack ingredients
(28, 'Chicken Bites',          200, 'SnackSource Ltd.',    500, 4.00, 'In Stock'),
(29, 'Egg Puff Batter',        150, 'SnackSource Ltd.',    400, 3.00, 'In Stock'),
(30, 'Mochi Donut Mix',        130, 'SnackSource Ltd.',    350, 3.00, 'In Stock'),
(31, 'Frying Oil',             180, 'SnackSource Ltd.',    400, 1.00, 'In Stock'),
-- Supplies
(32, 'Cups (16oz)',            500, 'PackagePro Co.',     2000, 1.00, 'In Stock'),
(33, 'Lids',                   500, 'PackagePro Co.',     2000, 1.00, 'In Stock'),
(34, 'Straws',                 500, 'PackagePro Co.',     2000, 1.00, 'In Stock'),
(35, 'Ice',                    400, 'ColdChain Supplies', 1000, 2.00, 'In Stock'),
(36, 'Snack Containers',       300, 'PackagePro Co.',     1500, 1.00, 'In Stock');

SELECT setval('inventory_id_seq', 36);

-- ------------------------------------------------
-- 4. ITEM INGREDIENTS
-- ------------------------------------------------
INSERT INTO item_ingredients (id, menu_item_id, inventory_id, "servingsUsed", "isTopping") VALUES
-- 1. Classic Milk Tea
(1, 1, 1, 2.00, false),   -- Black Tea
(2, 1, 5, 3.00, false),   -- Whole Milk
(3, 1, 8, 1.00, false),   -- Simple Syrup
(4, 1, 32, 1.00, false),  -- Cup
(5, 1, 33, 1.00, false),  -- Lid
(6, 1, 34, 1.00, false),  -- Straw
-- 2. Taro Milk Tea
(7, 2, 1, 2.00, false),
(8, 2, 5, 3.00, false),
(9, 2, 9, 3.00, false),   -- Taro Powder
(10, 2, 32, 1.00, false),
(11, 2, 33, 1.00, false),
(12, 2, 34, 1.00, false),
-- 3. Brown Sugar Milk Tea
(13, 3, 1, 2.00, false),
(14, 3, 5, 3.00, false),
(15, 3, 7, 1.50, false),  -- Brown Sugar Syrup
(16, 3, 32, 1.00, false),
(17, 3, 33, 1.00, false),
(18, 3, 34, 1.00, false),
-- 4. Jasmine Milk Tea
(19, 4, 4, 2.00, false),  -- Jasmine Tea
(20, 4, 5, 3.00, false),
(21, 4, 8, 1.00, false),
(22, 4, 32, 1.00, false),
(23, 4, 33, 1.00, false),
(24, 4, 34, 1.00, false),
-- 5. Mango Green Tea
(25, 5, 2, 2.00, false),  -- Green Tea
(26, 5, 12, 3.00, false), -- Mango Puree
(27, 5, 8, 1.00, false),
(28, 5, 32, 1.00, false),
(29, 5, 33, 1.00, false),
(30, 5, 34, 1.00, false),
-- 6. Passion Fruit Tea
(31, 6, 2, 2.00, false),
(32, 6, 13, 3.00, false), -- Passion Fruit Puree
(33, 6, 8, 1.00, false),
(34, 6, 32, 1.00, false),
(35, 6, 33, 1.00, false),
(36, 6, 34, 1.00, false),
-- 7. Lychee Tea
(37, 7, 2, 2.00, false),
(38, 7, 14, 2.00, false), -- Lychee Syrup
(39, 7, 8, 1.00, false),
(40, 7, 32, 1.00, false),
(41, 7, 33, 1.00, false),
(42, 7, 34, 1.00, false),
-- 8. Peach Oolong Tea
(43, 8, 3, 2.00, false),  -- Oolong Tea
(44, 8, 15, 2.00, false), -- Peach Syrup
(45, 8, 8, 1.00, false),
(46, 8, 32, 1.00, false),
(47, 8, 33, 1.00, false),
(48, 8, 34, 1.00, false),
-- 9. Mango Smoothie
(49, 9, 12, 3.00, false),
(50, 9, 5, 2.00, false),
(51, 9, 35, 3.00, false), -- Ice
(52, 9, 32, 1.00, false),
(53, 9, 33, 1.00, false),
(54, 9, 34, 1.00, false),
-- 10. Strawberry Smoothie
(55, 10, 16, 3.00, false), -- Strawberry Puree
(56, 10, 5, 2.00, false),
(57, 10, 35, 3.00, false),
(58, 10, 32, 1.00, false),
(59, 10, 33, 1.00, false),
(60, 10, 34, 1.00, false),
-- 11. Matcha Smoothie
(61, 11, 10, 2.50, false), -- Matcha Powder
(62, 11, 5, 2.00, false),
(63, 11, 35, 3.00, false),
(64, 11, 32, 1.00, false),
(65, 11, 33, 1.00, false),
(66, 11, 34, 1.00, false),
-- 12. Popcorn Chicken
(67, 12, 28, 4.00, false), -- Chicken Bites
(68, 12, 31, 1.00, false), -- Frying Oil
(69, 12, 36, 1.00, false), -- Snack Container
-- 13. Egg Puffs
(70, 13, 29, 3.00, false), -- Egg Puff Batter
(71, 13, 31, 1.00, false),
(72, 13, 36, 1.00, false),
-- 14. Mochi Donuts
(73, 14, 30, 3.00, false), -- Mochi Donut Mix
(74, 14, 31, 1.00, false),
(75, 14, 36, 1.00, false),
-- 15. Chocolate Milk Tea
(76, 15, 1, 2.00, false),
(77, 15, 5, 3.00, false),
(78, 15, 11, 2.50, false), -- Chocolate Powder
(79, 15, 32, 1.00, false),
(80, 15, 33, 1.00, false),
(81, 15, 34, 1.00, false),
-- 16. Red Bean Milk Tea
(82, 16, 1, 2.00, false),
(83, 16, 5, 3.00, false),
(84, 16, 21, 2.00, false), -- Red Bean Paste
(85, 16, 32, 1.00, false),
(86, 16, 33, 1.00, false),
(87, 16, 34, 1.00, false),
-- 17. Wintermelon Tea
(88, 17, 2, 2.00, false),
(89, 17, 20, 2.00, false), -- Wintermelon Syrup
(90, 17, 8, 1.00, false),
(91, 17, 32, 1.00, false),
(92, 17, 33, 1.00, false),
(93, 17, 34, 1.00, false),
-- 18. Banana & Blueberry Smoothie
(94, 18, 18, 2.50, false),  -- Banana Puree
(95, 18, 19, 2.50, false),  -- Blueberry Puree
(96, 18, 5, 2.00, false),
(97, 18, 35, 3.00, false),
(98, 18, 32, 1.00, false),
(99, 18, 33, 1.00, false),
(100, 18, 34, 1.00, false),
-- 19. Taro Slush
(101, 19, 9, 3.00, false),
(102, 19, 5, 2.00, false),
(103, 19, 35, 4.00, false), -- Extra ice for slush
(104, 19, 32, 1.00, false),
(105, 19, 33, 1.00, false),
(106, 19, 34, 1.00, false),
-- 20. Watermelon Slush
(107, 20, 17, 3.00, false),
(108, 20, 8, 1.00, false),
(109, 20, 35, 4.00, false),
(110, 20, 32, 1.00, false),
(111, 20, 33, 1.00, false),
(112, 20, 34, 1.00, false),
-- 21. Mango Slush
(113, 21, 12, 3.00, false),
(114, 21, 8, 1.00, false),
(115, 21, 35, 4.00, false),
(116, 21, 32, 1.00, false),
(117, 21, 33, 1.00, false),
(118, 21, 34, 1.00, false),
-- 22. Brown Sugar Boba Latte
(119, 22, 1, 2.00, false),
(120, 22, 5, 3.00, false),
(121, 22, 7, 1.50, false),
(122, 22, 22, 2.00, true),  -- Tapioca Pearls (topping)
(123, 22, 32, 1.00, false),
(124, 22, 33, 1.00, false),
(125, 22, 34, 1.00, false),
-- 23. Matcha Latte
(126, 23, 10, 2.50, false),
(127, 23, 5, 3.00, false),
(128, 23, 8, 1.00, false),
(129, 23, 32, 1.00, false),
(130, 23, 33, 1.00, false),
(131, 23, 34, 1.00, false),
-- 24. Vietnamese Latte
(132, 24, 1, 2.00, false),
(133, 24, 6, 2.00, false),  -- Condensed Milk
(134, 24, 8, 1.00, false),
(135, 24, 32, 1.00, false),
(136, 24, 33, 1.00, false),
(137, 24, 34, 1.00, false);

SELECT setval('item_ingredients_id_seq', 137);

-- ------------------------------------------------
-- 5. EMPLOYEES
-- ------------------------------------------------
INSERT INTO employees (id, name, role, shift, "isWorking", wage) VALUES
(1,  'Sarah Chen',         'Manager',  'Morning',   true,  22.00),
(2,  'Marcus Johnson',     'Manager',  'Evening',   false, 22.00),
(3,  'Lily Tran',          'Cashier',  'Morning',   true,  14.50),
(4,  'David Park',         'Cashier',  'Afternoon', true,  14.50),
(5,  'Jessica Martinez',   'Cashier',  'Evening',   false, 14.50),
(6,  'Kevin Nguyen',       'Barista',  'Morning',   true,  16.00),
(7,  'Emma Wilson',        'Barista',  'Morning',   true,  16.00),
(8,  'Ryan Lee',           'Barista',  'Afternoon', true,  16.00),
(9,  'Olivia Davis',       'Barista',  'Afternoon', false, 16.00),
(10, 'Brandon Kim',        'Barista',  'Evening',   false, 16.00),
(11, 'Sophia Anderson',    'Barista',  'Evening',   false, 16.00),
(12, 'Jason Thomas',       'Cook',     'Morning',   true,  15.00),
(13, 'Mia Garcia',         'Cook',     'Afternoon', true,  15.00),
(14, 'Daniel Brown',       'Cook',     'Evening',   false, 15.00),
(15, 'Chloe Taylor',       'Employee', 'Morning',   true,  13.00),
(16, 'Ethan Moore',        'Employee', 'Afternoon', false, 13.00);

SELECT setval('employees_id_seq', 16);
