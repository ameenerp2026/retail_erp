-- Part A: Create GstUqc (delete this part if the table already exists)
CREATE TABLE "inventory"."GstUqc" (
  "id" SERIAL NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstUqc_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GstUqc_code_key" ON "inventory"."GstUqc"("code");

-- Part B: Add the GST UQC values
INSERT INTO "inventory"."GstUqc" ("code", "description", "updatedAt")
SELECT v.code, v.description, CURRENT_TIMESTAMP
FROM (VALUES
  ('BAG', 'Bags'), ('BAL', 'Bale'), ('BDL', 'Bundles'),
  ('BKL', 'Buckles'), ('BOU', 'Billions of Units'), ('BOX', 'Box'),
  ('BTL', 'Bottles'), ('BUN', 'Bunches'), ('CAN', 'Cans'),
  ('CBM', 'Cubic Meter'), ('CCM', 'Cubic Centimeter'), ('CMS', 'Centimeter'),
  ('CTN', 'Cartons'), ('DOZ', 'Dozen'), ('DRM', 'Drum'),
  ('GGR', 'Great Gross'), ('GMS', 'Grams'), ('GRS', 'Gross'),
  ('GYD', 'Gross Yards'), ('KGS', 'Kilograms'), ('KLR', 'Kilolitre'),
  ('KME', 'Kilometre'), ('LTR', 'Litres'), ('MLT', 'Millilitre'),
  ('MTR', 'Meters'), ('MTS', 'Metric Tons'), ('NOS', 'Numbers'),
  ('OTH', 'Others'), ('PAC', 'Packs'), ('PCS', 'Pieces'),
  ('PRS', 'Pairs'), ('QTL', 'Quintal'), ('ROL', 'Rolls'),
  ('SET', 'Sets'), ('SQF', 'Square Feet'), ('SQM', 'Square Meters'),
  ('SQY', 'Square Yards'), ('TBS', 'Tablets'), ('TGM', 'Ten Gross'),
  ('THD', 'Thousands'), ('TON', 'Tonnes'), ('TUB', 'Tubes'),
  ('UGS', 'US Gallons'), ('UNT', 'Units'), ('YDS', 'Yards')
) AS v(code, description)
ON CONFLICT ("code") DO NOTHING;

-- Part C: Update Uom without losing its data
ALTER TABLE "inventory"."Uom" RENAME COLUMN "code" TO "shortName";
ALTER INDEX "inventory"."Uom_code_key" RENAME TO "Uom_shortName_key";

ALTER TABLE "inventory"."Uom"
  ADD COLUMN "gstUqcId" INTEGER,
  ADD COLUMN "decimalPlaces" INTEGER NOT NULL DEFAULT 0;

UPDATE "inventory"."Uom" AS u
SET "gstUqcId" = g."id"
FROM "inventory"."GstUqc" AS g
WHERE g."code" = CASE u."shortName"
  WHEN 'KG' THEN 'KGS'
  WHEN 'L' THEN 'LTR'
  WHEN 'M' THEN 'MTR'
  WHEN 'G' THEN 'GMS'
  WHEN 'CM' THEN 'CMS'
  WHEN 'GM' THEN 'GMS'
  WHEN 'ML' THEN 'MLT'
  WHEN 'MT' THEN 'MTS'
  WHEN 'PAIR' THEN 'PRS'
  WHEN 'PKT' THEN 'PAC'
  WHEN 'ROLL' THEN 'ROL'
  WHEN 'STR' THEN 'OTH'
  WHEN 'CHECK' THEN 'OTH'
  ELSE u."shortName"
END;

UPDATE "inventory"."Uom"
SET "decimalPlaces" = CASE "shortName"
  WHEN 'KG' THEN 3
  WHEN 'L' THEN 3
  WHEN 'G' THEN 3
  WHEN 'GM' THEN 3
  WHEN 'ML' THEN 3
  WHEN 'MT' THEN 3
  WHEN 'M' THEN 2
  WHEN 'CM' THEN 2
  ELSE 0
END;
ALTER TABLE "inventory"."Uom" ALTER COLUMN "gstUqcId" SET NOT NULL;

CREATE INDEX "Uom_gstUqcId_idx" ON "inventory"."Uom"("gstUqcId");

ALTER TABLE "inventory"."Uom"
  ADD CONSTRAINT "Uom_gstUqcId_fkey"
  FOREIGN KEY ("gstUqcId") REFERENCES "inventory"."GstUqc"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "inventory"."Uom"
  ADD CONSTRAINT "Uom_decimalPlaces_check"
  CHECK ("decimalPlaces" BETWEEN 0 AND 3);