-- AlterTable
ALTER TABLE "vehicle_assignments" DROP COLUMN "dashboard_azure_blob_url",
ADD COLUMN "dashboard_image_url" TEXT;