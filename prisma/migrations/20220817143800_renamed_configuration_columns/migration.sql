/*
  Warnings:

  - You are about to drop the column `column_name` on the `ConfigurationColumn` table. All the data in the column will be lost.
  - You are about to drop the column `dest_format_str` on the `ConfigurationColumn` table. All the data in the column will be lost.
  - You are about to drop the column `is_last_modified` on the `ConfigurationColumn` table. All the data in the column will be lost.
  - You are about to drop the column `is_primary_key` on the `ConfigurationColumn` table. All the data in the column will be lost.
  - You are about to drop the column `name_in_destination` on the `ConfigurationColumn` table. All the data in the column will be lost.
  - You are about to drop the column `name_in_source` on the `ConfigurationColumn` table. All the data in the column will be lost.
  - Added the required column `destinationFormatString` to the `ConfigurationColumn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isLastModified` to the `ConfigurationColumn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPrimaryKey` to the `ConfigurationColumn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameInDestination` to the `ConfigurationColumn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameInSource` to the `ConfigurationColumn` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConfigurationColumn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nameInSource" TEXT NOT NULL,
    "nameInDestination" TEXT NOT NULL,
    "destinationFormatString" TEXT NOT NULL,
    "transformer" TEXT NOT NULL,
    "isPrimaryKey" BOOLEAN NOT NULL,
    "isLastModified" BOOLEAN NOT NULL,
    "configurationId" INTEGER NOT NULL,
    CONSTRAINT "ConfigurationColumn_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ConfigurationColumn" ("configurationId", "createdAt", "id", "transformer", "updatedAt") SELECT "configurationId", "createdAt", "id", "transformer", "updatedAt" FROM "ConfigurationColumn";
DROP TABLE "ConfigurationColumn";
ALTER TABLE "new_ConfigurationColumn" RENAME TO "ConfigurationColumn";
CREATE UNIQUE INDEX "ConfigurationColumn_configurationId_nameInDestination_key" ON "ConfigurationColumn"("configurationId", "nameInDestination");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
