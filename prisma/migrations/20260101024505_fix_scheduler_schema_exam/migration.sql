/*
  Warnings:

  - You are about to drop the column `endTime` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `resultDate` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Option` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "resultDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "publishResults" BOOLEAN NOT NULL DEFAULT false,
    "issueCertificate" BOOLEAN NOT NULL DEFAULT false,
    "passingPercentage" INTEGER NOT NULL DEFAULT 40,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Exam" ("createdAt", "description", "duration", "id", "isActive", "issueCertificate", "maxAttempts", "passingPercentage", "publishResults", "title", "updatedAt") SELECT "createdAt", "description", "duration", "id", "isActive", "issueCertificate", "maxAttempts", "passingPercentage", "publishResults", "title", "updatedAt" FROM "Exam";
DROP TABLE "Exam";
ALTER TABLE "new_Exam" RENAME TO "Exam";
CREATE TABLE "new_Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT NOT NULL,
    CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("id", "isCorrect", "questionId", "text") SELECT "id", "isCorrect", "questionId", "text" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
