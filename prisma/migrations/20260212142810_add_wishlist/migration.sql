-- CreateTable
CREATE TABLE "wishlists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "wishlist_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "mrp" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "color_name" TEXT,
    "color_hex" TEXT,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_user_id_key" ON "wishlists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_wishlist_id_product_id_variant_id_key" ON "wishlist_items"("wishlist_id", "product_id", "variant_id");

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
