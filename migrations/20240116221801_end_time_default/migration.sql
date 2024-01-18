-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SleepLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SleepLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SleepLog" ("endTime", "id", "startTime", "userId") SELECT "endTime", "id", "startTime", "userId" FROM "SleepLog";
DROP TABLE "SleepLog";
ALTER TABLE "new_SleepLog" RENAME TO "SleepLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
