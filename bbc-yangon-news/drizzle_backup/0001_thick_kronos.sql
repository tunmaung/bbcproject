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
