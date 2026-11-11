CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`email` varchar(255) NOT NULL,
	`display_name` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL,
	CONSTRAINT `users_email_uq` UNIQUE INDEX(`email`)
);
--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `type` varchar(50) NOT NULL;--> statement-breakpoint
CREATE INDEX `guarantees_order_idx` ON `guarantees` (`order_id`);--> statement-breakpoint
CREATE INDEX `guarantees_product_idx` ON `guarantees` (`product_id`);--> statement-breakpoint
CREATE INDEX `orders_date_idx` ON `orders` (`date`);--> statement-breakpoint
CREATE INDEX `prices_product_idx` ON `prices` (`product_id`);--> statement-breakpoint
CREATE INDEX `products_type_idx` ON `products` (`type`);--> statement-breakpoint
CREATE INDEX `products_date_idx` ON `products` (`date`);