-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "fields" TEXT NOT NULL,
    "share_url" TEXT,
    "response_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Form_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormResponse" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "form_id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    CONSTRAINT "FormResponse_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Form_user_id_idx" ON "Form"("user_id");

-- CreateIndex
CREATE INDEX "Form_status_idx" ON "Form"("status");

-- CreateIndex
CREATE INDEX "Form_created_at_idx" ON "Form"("created_at");

-- CreateIndex
CREATE INDEX "Form_deleted_at_idx" ON "Form"("deleted_at");

-- CreateIndex
CREATE INDEX "FormResponse_form_id_idx" ON "FormResponse"("form_id");

-- CreateIndex
CREATE INDEX "FormResponse_created_at_idx" ON "FormResponse"("created_at");

-- CreateIndex
CREATE INDEX "FormResponse_deleted_at_idx" ON "FormResponse"("deleted_at");
