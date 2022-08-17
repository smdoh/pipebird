PRAGMA journal_mode = WAL;

-- CreateTable
CREATE TABLE "Tenant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "identifier" TEXT NOT NULL
);

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

-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewId" INTEGER NOT NULL,
    CONSTRAINT "Configuration_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "View" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "View" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tableExpression" TEXT NOT NULL,
    "tenantColumn" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    CONSTRAINT "View_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Source" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REACHABLE',
    "sourceType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Destination" (
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

-- CreateTable
CREATE TABLE "Transfer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "finalizedAt" DATETIME,
    "status" TEXT NOT NULL,
    "destinationId" INTEGER NOT NULL,
    CONSTRAINT "Transfer_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
