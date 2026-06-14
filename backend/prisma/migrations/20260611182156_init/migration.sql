-- CreateTable
CREATE TABLE "service_intervals" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER,
    "element_name" VARCHAR(50) NOT NULL,
    "interval_km" INTEGER,
    "interval_months" INTEGER,
    "last_service_mileage" INTEGER NOT NULL DEFAULT 0,
    "last_service_date" DATE NOT NULL,

    CONSTRAINT "service_intervals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_logs" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER,
    "element_name" VARCHAR(50) NOT NULL,
    "service_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "service_mileage" INTEGER NOT NULL,
    "description" TEXT,
    "cost" DECIMAL(10,2),

    CONSTRAINT "service_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(15),
    "role" VARCHAR(20) DEFAULT 'driver',
    "is_active" BOOLEAN DEFAULT true,
    "is_employed" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_assignments" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER,
    "driver_id" INTEGER,
    "start_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(6),
    "start_mileage" INTEGER NOT NULL,
    "end_mileage" INTEGER,
    "start_fuel_level" INTEGER NOT NULL,
    "end_fuel_level" INTEGER,
    "dashboard_azure_blob_url" TEXT,
    "status" VARCHAR(25) DEFAULT 'active',

    CONSTRAINT "vehicle_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_status_images" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER,
    "side" VARCHAR(20) NOT NULL,
    "azure_blob_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_status_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "license_plate" VARCHAR(15) NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "year_of_manufacture" INTEGER NOT NULL,
    "current_mileage" INTEGER NOT NULL DEFAULT 0,
    "current_fuel_level" INTEGER NOT NULL DEFAULT 100,
    "status" VARCHAR(20) DEFAULT 'available',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_incidents" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "assignment_id" INTEGER,
    "ai_description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_incident_images" (
    "id" SERIAL NOT NULL,
    "incident_id" INTEGER NOT NULL,
    "side" TEXT NOT NULL,
    "azure_blob_url" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,

    CONSTRAINT "vehicle_incident_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_intervals_vehicle_id_element_name_key" ON "service_intervals"("vehicle_id", "element_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_status_images_vehicle_id_side_key" ON "vehicle_status_images"("vehicle_id", "side");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_license_plate_key" ON "vehicles"("license_plate");

-- AddForeignKey
ALTER TABLE "service_intervals" ADD CONSTRAINT "service_intervals_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "service_logs" ADD CONSTRAINT "service_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_status_images" ADD CONSTRAINT "vehicle_status_images_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_incidents" ADD CONSTRAINT "vehicle_incidents_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_incidents" ADD CONSTRAINT "vehicle_incidents_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "vehicle_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_incident_images" ADD CONSTRAINT "vehicle_incident_images_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "vehicle_incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
