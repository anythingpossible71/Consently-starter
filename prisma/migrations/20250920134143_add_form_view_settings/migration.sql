-- CreateTable
CREATE TABLE "FormViewSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "form_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "visible_fields" TEXT NOT NULL,
    "table_sort_field" TEXT,
    "table_sort_order" TEXT,
    CONSTRAINT "FormViewSettings_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormViewSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FormViewSettings_form_id_key" ON "FormViewSettings"("form_id");

-- CreateIndex
CREATE INDEX "FormViewSettings_form_id_idx" ON "FormViewSettings"("form_id");

-- CreateIndex
CREATE INDEX "FormViewSettings_user_id_idx" ON "FormViewSettings"("user_id");

-- CreateIndex
CREATE INDEX "FormViewSettings_deleted_at_idx" ON "FormViewSettings"("deleted_at");
