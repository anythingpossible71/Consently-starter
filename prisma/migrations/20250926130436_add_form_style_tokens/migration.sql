-- CreateTable
CREATE TABLE "FormStyleTokenDefault" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "token_name" TEXT NOT NULL,
    "default_value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "data_type" TEXT NOT NULL,
    "display_name" TEXT,
    "is_user_editable" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "FormStyleToken" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "form_id" TEXT NOT NULL,
    "token_name" TEXT NOT NULL,
    "token_value" TEXT NOT NULL,
    CONSTRAINT "FormStyleToken_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FormStyleToken_token_name_fkey" FOREIGN KEY ("token_name") REFERENCES "FormStyleTokenDefault" ("token_name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FormStyleTokenDefault_token_name_key" ON "FormStyleTokenDefault"("token_name");

-- CreateIndex
CREATE INDEX "FormStyleTokenDefault_token_name_idx" ON "FormStyleTokenDefault"("token_name");

-- CreateIndex
CREATE INDEX "FormStyleTokenDefault_category_idx" ON "FormStyleTokenDefault"("category");

-- CreateIndex
CREATE INDEX "FormStyleTokenDefault_data_type_idx" ON "FormStyleTokenDefault"("data_type");

-- CreateIndex
CREATE INDEX "FormStyleTokenDefault_deleted_at_idx" ON "FormStyleTokenDefault"("deleted_at");

-- CreateIndex
CREATE INDEX "FormStyleToken_form_id_idx" ON "FormStyleToken"("form_id");

-- CreateIndex
CREATE INDEX "FormStyleToken_token_name_idx" ON "FormStyleToken"("token_name");

-- CreateIndex
CREATE INDEX "FormStyleToken_deleted_at_idx" ON "FormStyleToken"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "FormStyleToken_form_id_token_name_key" ON "FormStyleToken"("form_id", "token_name");
