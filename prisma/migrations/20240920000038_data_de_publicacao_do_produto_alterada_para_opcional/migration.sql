-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "image" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idUserCreated" INTEGER NOT NULL,
    "idUserEdited" INTEGER NOT NULL,
    CONSTRAINT "products_idUserCreated_fkey" FOREIGN KEY ("idUserCreated") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_idUserEdited_fkey" FOREIGN KEY ("idUserEdited") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("createdAt", "id", "idUserCreated", "idUserEdited", "image", "name", "price", "publishedAt", "updatedAt") SELECT "createdAt", "id", "idUserCreated", "idUserEdited", "image", "name", "price", "publishedAt", "updatedAt" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
