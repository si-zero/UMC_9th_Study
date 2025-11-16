/*
  Warnings:

  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(10)`.
  - You are about to alter the column `nickname` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `address` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(30)`.

*/
-- DropIndex
DROP INDEX `user_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(30) NULL,
    MODIFY `name` VARCHAR(10) NULL,
    MODIFY `nickname` VARCHAR(20) NULL,
    MODIFY `role` VARCHAR(20) NULL,
    ALTER COLUMN `point` DROP DEFAULT,
    MODIFY `gender` VARCHAR(10) NULL,
    MODIFY `address` VARCHAR(30) NULL,
    MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `user_phone` (
    `user_id` BIGINT NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `status` VARCHAR(20) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_image` (
    `user_image_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `image_url` VARCHAR(100) NULL,
    `uploaded_at` DATETIME(3) NULL,

    PRIMARY KEY (`user_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `termsOfCondition` (
    `trems_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NULL,
    `content` VARCHAR(50) NULL,
    `optional` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`trems_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_termsOfCondition` (
    `check_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `trems_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_termsOfCondition_user_id_trems_id_key`(`user_id`, `trems_id`),
    PRIMARY KEY (`check_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_phone` ADD CONSTRAINT `user_phone_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_image` ADD CONSTRAINT `user_image_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_termsOfCondition` ADD CONSTRAINT `user_termsOfCondition_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_termsOfCondition` ADD CONSTRAINT `user_termsOfCondition_trems_id_fkey` FOREIGN KEY (`trems_id`) REFERENCES `termsOfCondition`(`trems_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
