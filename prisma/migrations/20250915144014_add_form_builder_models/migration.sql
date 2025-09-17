-- CreateTable
CREATE TABLE "FormFieldType" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FormFieldProperty" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "field_type_id" TEXT NOT NULL,
    "property_key" TEXT NOT NULL,
    "property_type" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "default_value" TEXT,
    "validation_rules" TEXT,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "input_type" TEXT NOT NULL,
    "options" TEXT,
    CONSTRAINT "FormFieldProperty_field_type_id_fkey" FOREIGN KEY ("field_type_id") REFERENCES "FormFieldType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormFieldTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "field_type_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "default_config" TEXT NOT NULL,
    CONSTRAINT "FormFieldTemplate_field_type_id_fkey" FOREIGN KEY ("field_type_id") REFERENCES "FormFieldType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormTheme" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "preview_url" TEXT
);

-- CreateTable
CREATE TABLE "FormTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT,
    "config" TEXT NOT NULL,
    "preview_url" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "FormFieldType_type_key" ON "FormFieldType"("type");

-- CreateIndex
CREATE INDEX "FormFieldType_type_idx" ON "FormFieldType"("type");

-- CreateIndex
CREATE INDEX "FormFieldType_category_idx" ON "FormFieldType"("category");

-- CreateIndex
CREATE INDEX "FormFieldType_deleted_at_idx" ON "FormFieldType"("deleted_at");

-- CreateIndex
CREATE INDEX "FormFieldProperty_field_type_id_idx" ON "FormFieldProperty"("field_type_id");

-- CreateIndex
CREATE INDEX "FormFieldProperty_property_key_idx" ON "FormFieldProperty"("property_key");

-- CreateIndex
CREATE INDEX "FormFieldProperty_deleted_at_idx" ON "FormFieldProperty"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "FormFieldProperty_field_type_id_property_key_key" ON "FormFieldProperty"("field_type_id", "property_key");

-- CreateIndex
CREATE INDEX "FormFieldTemplate_field_type_id_idx" ON "FormFieldTemplate"("field_type_id");

-- CreateIndex
CREATE INDEX "FormFieldTemplate_category_idx" ON "FormFieldTemplate"("category");

-- CreateIndex
CREATE INDEX "FormFieldTemplate_deleted_at_idx" ON "FormFieldTemplate"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "FormTheme_name_key" ON "FormTheme"("name");

-- CreateIndex
CREATE INDEX "FormTheme_name_idx" ON "FormTheme"("name");

-- CreateIndex
CREATE INDEX "FormTheme_category_idx" ON "FormTheme"("category");

-- CreateIndex
CREATE INDEX "FormTheme_deleted_at_idx" ON "FormTheme"("deleted_at");

-- CreateIndex
CREATE INDEX "FormTemplate_name_idx" ON "FormTemplate"("name");

-- CreateIndex
CREATE INDEX "FormTemplate_category_idx" ON "FormTemplate"("category");

-- CreateIndex
CREATE INDEX "FormTemplate_usage_count_idx" ON "FormTemplate"("usage_count");

-- CreateIndex
CREATE INDEX "FormTemplate_deleted_at_idx" ON "FormTemplate"("deleted_at");
