/*
  Warnings:

  - You are about to drop the column `dashboard_azure_blob_url` on the `vehicle_assignments` table. All the data in the column will be lost.
  - You are about to drop the `service_intervals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "service_intervals" DROP CONSTRAINT "service_intervals_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "service_logs" DROP CONSTRAINT "service_logs_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "vehicle_assignments" DROP COLUMN "dashboard_azure_blob_url",
ADD COLUMN     "dashboard_image_url" TEXT;

-- DropTable
DROP TABLE "service_intervals";

-- DropTable
DROP TABLE "service_logs";
