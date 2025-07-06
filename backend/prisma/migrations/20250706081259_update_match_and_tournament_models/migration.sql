/*
  Warnings:

  - Added the required column `tournamentId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tournamentId" INTEGER NOT NULL,
    "participant1Id" INTEGER,
    "participant2Id" INTEGER,
    "round" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "Participant" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "Participant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("createdAt", "id", "isDeleted", "participant1Id", "participant2Id", "round", "scheduledAt", "status", "updatedAt") SELECT "createdAt", "id", "isDeleted", "participant1Id", "participant2Id", "round", "scheduledAt", "status", "updatedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
