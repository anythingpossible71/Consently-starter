-- CreateTable
CREATE TABLE "FormFieldTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "field_id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "property_key" TEXT NOT NULL,
    "translated_value" TEXT NOT NULL,
    CONSTRAINT "FormFieldTranslation_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "FormField" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FormFieldTranslation_field_id_idx" ON "FormFieldTranslation"("field_id");

-- CreateIndex
CREATE INDEX "FormFieldTranslation_language_code_idx" ON "FormFieldTranslation"("language_code");

-- CreateIndex
CREATE INDEX "FormFieldTranslation_deleted_at_idx" ON "FormFieldTranslation"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "FormFieldTranslation_field_id_language_code_property_key_key" ON "FormFieldTranslation"("field_id", "language_code", "property_key");
