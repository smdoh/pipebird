/*
  Warnings:

  - You are about to drop the column `columns` on the `Configuration` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ConfigurationColumn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "column_name" TEXT NOT NULL,
    "name_in_source" TEXT NOT NULL,
    "name_in_destination" TEXT NOT NULL,
    "dest_format_str" TEXT NOT NULL,
    "transformer" TEXT NOT NULL,
    "is_primary_key" BOOLEAN NOT NULL,
    "is_last_modified" BOOLEAN NOT NULL,
    "configurationId" INTEGER NOT NULL,
    CONSTRAINT "ConfigurationColumn_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewId" INTEGER NOT NULL,
    CONSTRAINT "Configuration_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "View" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Configuration" ("createdAt", "id", "updatedAt", "viewId") SELECT "createdAt", "id", "updatedAt", "viewId" FROM "Configuration";
DROP TABLE "Configuration";
ALTER TABLE "new_Configuration" RENAME TO "Configuration";
CREATE TABLE "new_Destination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REACHABLE',
    "destinationType" TEXT NOT NULL DEFAULT 'PROVISIONED_S3',
    "connectionString" TEXT,
    "configurationId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    CONSTRAINT "Destination_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Destination_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Destination" ("configurationId", "connectionString", "createdAt", "destinationType", "id", "name", "status", "tenantId", "updatedAt") SELECT "configurationId", "connectionString", "createdAt", "destinationType", "id", "name", "status", "tenantId", "updatedAt" FROM "Destination";
DROP TABLE "Destination";
ALTER TABLE "new_Destination" RENAME TO "Destination";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
