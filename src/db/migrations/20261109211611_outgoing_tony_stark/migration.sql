CREATE TABLE `guarantees` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`start` datetime(3),
	`end` datetime(3)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`title` varchar(255) NOT NULL,
	`description` varchar(1000),
	`date` datetime(3) NOT NULL,
	`location_name` varchar(255),
	`latitude` double,
	`longitude` double
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`serial_number` varchar(50) NOT NULL,
	`is_new` boolean NOT NULL,
	`photo` varchar(255),
	`title` varchar(255) NOT NULL,
	`specification` varchar(1000),
	`type_id` int NOT NULL,
	`order_id` int NOT NULL,
	`guarantee_id` int NOT NULL,
	`type` enum('monitors') NOT NULL,
	`date` datetime(3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_order_id_orders_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_guarantee_id_guarantees_id_fkey` FOREIGN KEY (`guarantee_id`) REFERENCES `guarantees`(`id`) ON DELETE RESTRICT;