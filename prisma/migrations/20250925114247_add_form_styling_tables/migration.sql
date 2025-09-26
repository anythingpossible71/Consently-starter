-- CreateTable
CREATE TABLE "FormStylingVariable" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "form_id" TEXT NOT NULL,
    "variable_name" TEXT NOT NULL,
    "variable_value" TEXT NOT NULL,
    CONSTRAINT "FormStylingVariable_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormStylingDefault" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "variable_name" TEXT NOT NULL,
    "default_value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "data_type" TEXT NOT NULL,
    "display_name" TEXT,
    "is_user_editable" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE INDEX "FormStylingVariable_form_id_idx" ON "FormStylingVariable"("form_id");

-- CreateIndex
CREATE INDEX "FormStylingVariable_variable_name_idx" ON "FormStylingVariable"("variable_name");

-- CreateIndex
CREATE INDEX "FormStylingVariable_deleted_at_idx" ON "FormStylingVariable"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "FormStylingVariable_form_id_variable_name_key" ON "FormStylingVariable"("form_id", "variable_name");

-- CreateIndex
CREATE UNIQUE INDEX "FormStylingDefault_variable_name_key" ON "FormStylingDefault"("variable_name");

-- CreateIndex
CREATE INDEX "FormStylingDefault_variable_name_idx" ON "FormStylingDefault"("variable_name");

-- CreateIndex
CREATE INDEX "FormStylingDefault_category_idx" ON "FormStylingDefault"("category");

-- CreateIndex
CREATE INDEX "FormStylingDefault_data_type_idx" ON "FormStylingDefault"("data_type");

-- CreateIndex
CREATE INDEX "FormStylingDefault_deleted_at_idx" ON "FormStylingDefault"("deleted_at");
