CREATE TABLE `visitor_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ipAddress` varchar(45),
	`latitude` varchar(30) NOT NULL,
	`longitude` varchar(30) NOT NULL,
	`accuracy` int,
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitor_logs_id` PRIMARY KEY(`id`)
);
