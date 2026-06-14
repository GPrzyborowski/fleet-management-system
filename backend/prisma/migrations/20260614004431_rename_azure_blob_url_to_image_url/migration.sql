-- AlterTable
ALTER TABLE "vehicle_assignments" DROP COLUMN "dashboard_azure_blob_url",
ADD COLUMN     "dashboard_image_url" TEXT;

-- AlterTable
ALTER TABLE "vehicle_status_images" RENAME COLUMN "azure_blob_url" TO "image_url";

-- AlterTable
ALTER TABLE "vehicle_incident_images" RENAME COLUMN "azure_blob_url" TO "image_url";