-- CreateTable
CREATE TABLE `user` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(50) NULL,
    `nickname` VARCHAR(50) NULL,
    `role` VARCHAR(10) NULL DEFAULT 'USER',
    `point` INTEGER NULL DEFAULT 0,
    `gender` VARCHAR(3) NULL,
    `date` DATE NULL,
    `address` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
