-- CreateTable
CREATE TABLE "Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "eventAction" TEXT NOT NULL,
    "eventSource" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "meta" TEXT NOT NULL
);
