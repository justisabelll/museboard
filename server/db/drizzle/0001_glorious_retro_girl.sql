DROP INDEX IF EXISTS `user_username_unique`;--> statement-breakpoint
ALTER TABLE `user` ADD `name` text;--> statement-breakpoint
ALTER TABLE `user` ADD `email` text;--> statement-breakpoint
ALTER TABLE `user` ADD `emailVerified` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `image` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `password`;