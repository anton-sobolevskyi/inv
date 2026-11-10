CREATE TABLE `guarantees` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`start` datetime(3),
	`end` datetime(3)
);
--> statement-breakpoint
CREATE TABLE `order_products` (
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	CONSTRAINT PRIMARY KEY(`order_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`title` varchar(255) NOT NULL,
	`description` varchar(1000),
	`address` varchar(500),
	`latitude` double,
	`longitude` double,
	`date` datetime(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`product_id` int NOT NULL,
	`value` decimal(12,2) NOT NULL,
	`symbol` enum('USD','UAH') NOT NULL,
	`is_default` boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`serial_number` varchar(50) NOT NULL,
	`is_new` boolean NOT NULL,
	`photo` varchar(255),
	`title` varchar(255) NOT NULL,
	`specification` varchar(1000),
	`type` enum('monitors') NOT NULL,
	`date` datetime(3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `guarantees` ADD CONSTRAINT `guarantees_order_id_orders_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `guarantees` ADD CONSTRAINT `guarantees_product_id_products_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_order_id_orders_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_product_id_products_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `prices` ADD CONSTRAINT `prices_product_id_products_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;