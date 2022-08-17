/*
  Warnings:

  - You are about to drop the `ConfigurationColumn` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ConfigurationColumn";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ColumnTransformation" (
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
    CONSTRAINT "ColumnTransformation_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ColumnTransformation_configurationId_nameInDestination_key" ON "ColumnTransformation"("configurationId", "nameInDestination");
