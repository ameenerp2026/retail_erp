-- CreateTable
CREATE TABLE "organization"."gst_states" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "state_name" VARCHAR(100) NOT NULL,
    "igst_applicable" BOOLEAN NOT NULL DEFAULT false,
    "cgst_sgst_applicable" BOOLEAN NOT NULL DEFAULT true,
    "has_sez" BOOLEAN NOT NULL DEFAULT false,
    "status" "organization"."LocationStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gst_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gst_states_code_key" ON "organization"."gst_states"("code");

-- CreateIndex
CREATE UNIQUE INDEX "gst_states_state_name_key" ON "organization"."gst_states"("state_name");

-- AddForeignKey
ALTER TABLE "organization"."gst_states" ADD CONSTRAINT "gst_states_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."gst_states" ADD CONSTRAINT "gst_states_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
