/*
  Warnings:

  - You are about to drop the column `fields` on the `Form` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "form_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    CONSTRAINT "FormField_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "share_url" TEXT,
    "response_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Form_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("config", "created_at", "deleted_at", "description", "id", "response_count", "share_url", "status", "title", "updated_at", "user_id") SELECT "config", "created_at", "deleted_at", "description", "id", "response_count", "share_url", "status", "title", "updated_at", "user_id" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE INDEX "Form_user_id_idx" ON "Form"("user_id");
CREATE INDEX "Form_status_idx" ON "Form"("status");
CREATE INDEX "Form_created_at_idx" ON "Form"("created_at");
CREATE INDEX "Form_deleted_at_idx" ON "Form"("deleted_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "FormField_form_id_idx" ON "FormField"("form_id");

-- CreateIndex
CREATE INDEX "FormField_form_id_index_idx" ON "FormField"("form_id", "index");

-- CreateIndex
CREATE INDEX "FormField_deleted_at_idx" ON "FormField"("deleted_at");

-- CreateIndex
CREATE INDEX "FormFieldTranslation_field_id_idx" ON "FormFieldTranslation"("field_id");

-- CreateIndex
CREATE INDEX "FormFieldTranslation_language_code_idx" ON "FormFieldTranslation"("language_code");

-- CreateIndex
CREATE INDEX "FormFieldTranslation_deleted_at_idx" ON "FormFieldTranslation"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "FormFieldTranslation_field_id_language_code_property_key_key" ON "FormFieldTranslation"("field_id", "language_code", "property_key");
