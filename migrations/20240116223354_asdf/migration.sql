/*
  Warnings:

  - Added the required column `totalSleepTime` to the `SleepLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SleepLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "totalSleepTime" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SleepLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SleepLog" ("endDate", "endTime", "id", "startDate", "startTime", "userId") SELECT "endDate", "endTime", "id", "startDate", "startTime", "userId" FROM "SleepLog";
DROP TABLE "SleepLog";
ALTER TABLE "new_SleepLog" RENAME TO "SleepLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
