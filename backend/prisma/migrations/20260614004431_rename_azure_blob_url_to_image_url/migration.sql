-- DropForeignKey
ALTER TABLE "service_intervals" DROP CONSTRAINT "service_intervals_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "service_logs" DROP CONSTRAINT "service_logs_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "vehicle_assignments" DROP COLUMN "dashboard_azure_blob_url",
ADD COLUMN     "dashboard_image_url" TEXT;

-- AlterTable
ALTER TABLE "vehicle_status_images" RENAME COLUMN "azure_blob_url" TO "image_url";

-- AlterTable
ALTER TABLE "vehicle_incident_images" RENAME COLUMN "azure_blob_url" TO "image_url";

-- DropTable
DROP TABLE "service_intervals";

-- DropTable
DROP TABLE "service_logs";