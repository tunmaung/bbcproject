CREATE TABLE `articles` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` enum('Myanmar','World','Politics','Business','Sport','Culture') NOT NULL,
	`coverImageUrl` text NOT NULL,
	`content` text NOT NULL,
	`author` varchar(100) NOT NULL,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isBreaking` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
