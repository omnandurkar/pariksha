-- AlterTable
ALTER TABLE "ExamAssignment" ADD COLUMN "allowedAttempts" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "publishResults" BOOLEAN NOT NULL DEFAULT false,
    "issueCertificate" BOOLEAN NOT NULL DEFAULT false,
    "passingPercentage" INTEGER NOT NULL DEFAULT 40,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Exam" ("createdAt", "description", "duration", "endTime", "id", "isActive", "issueCertificate", "passingPercentage", "publishResults", "startTime", "title", "updatedAt") SELECT "createdAt", "description", "duration", "endTime", "id", "isActive", "issueCertificate", "passingPercentage", "publishResults", "startTime", "title", "updatedAt" FROM "Exam";
DROP TABLE "Exam";
ALTER TABLE "new_Exam" RENAME TO "Exam";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
