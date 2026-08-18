import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { MONGO_URL } from "../libs/config";
import ProductModel from "../schema/Product.model";
import {
  ProductCategory,
  ProductPetType,
  ProductSize,
  ProductStatus,
} from "../libs/enums/product.enum";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");

interface SeedProduct {
  productName: string;
  productDesc: string;
  productCategory: ProductCategory;
  productPetType: ProductPetType;
  productSize: ProductSize;
  productPrice: number;
  productLeftCount: number;
  imageQuery: string;
}

const SEED_PRODUCTS: SeedProduct[] = [
  // ---------- FOOD ----------
  {
    productName: "Grain-Free Chicken Dinner",
    productDesc:
      "Slow-cooked chicken with sweet potato and peas, free from grains and artificial fillers. Suitable for adult dogs with sensitive digestion.",
    productCategory: ProductCategory.FOOD,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.MEDIUM,
    productPrice: 34.99,
    productLeftCount: 45,
    imageQuery: "dog food",
  },
  {
    productName: "Salmon & Rice Adult Formula",
    productDesc:
      "Wild-caught salmon paired with brown rice for a balanced daily meal that supports a healthy coat and steady energy.",
    productCategory: ProductCategory.FOOD,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.LARGE,
    productPrice: 52.5,
    productLeftCount: 30,
    imageQuery: "dog food",
  },
  {
    productName: "Puppy Starter Kibble",
    productDesc:
      "Small, easy-to-chew pieces enriched with DHA to support brain development during the first year.",
    productCategory: ProductCategory.FOOD,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.SMALL,
    productPrice: 22.75,
    productLeftCount: 55,
    imageQuery: "dog food",
  },
  {
    productName: "Tuna Flakes in Gravy",
    productDesc:
      "Tender tuna flakes served in a light gravy. A high-moisture meal that tempts even the fussiest cats.",
    productCategory: ProductCategory.FOOD,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.SMALL,
    productPrice: 18.99,
    productLeftCount: 80,
    imageQuery: "cat food",
  },
  {
    productName: "Indoor Cat Chicken Recipe",
    productDesc:
      "A lower-calorie recipe formulated for indoor cats, with added fibre to help reduce hairballs.",
    productCategory: ProductCategory.FOOD,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.MEDIUM,
    productPrice: 27.4,
    productLeftCount: 60,
    imageQuery: "cat food",
  },
  {
    productName: "Tropical Flake Blend",
    productDesc:
      "A daily flake mix for tropical community tanks, with natural colour enhancers and minimal water clouding.",
    productCategory: ProductCategory.FOOD,
    productPetType: ProductPetType.FISH,
    productSize: ProductSize.SMALL,
    productPrice: 9.99,
    productLeftCount: 120,
    imageQuery: "aquarium fish",
  },

  // ---------- TOY ----------
  {
    productName: "Rope Tug Twist",
    productDesc:
      "Braided cotton rope built for tug-of-war sessions. The woven fibres also help clean teeth while your dog plays.",
    productCategory: ProductCategory.TOY,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.MEDIUM,
    productPrice: 12.5,
    productLeftCount: 70,
    imageQuery: "dog toy",
  },
  {
    productName: "Squeaky Plush Duck",
    productDesc:
      "A soft plush companion with a hidden squeaker, sized for small breeds and gentle chewers.",
    productCategory: ProductCategory.TOY,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.SMALL,
    productPrice: 8.99,
    productLeftCount: 90,
    imageQuery: "dog toy",
  },
  {
    productName: "Treat Dispensing Ball",
    productDesc:
      "A durable rubber ball that releases kibble as it rolls, turning mealtime into a slower, more engaging game.",
    productCategory: ProductCategory.TOY,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.MEDIUM,
    productPrice: 15.99,
    productLeftCount: 65,
    imageQuery: "dog toy",
  },
  {
    productName: "Feather Wand Teaser",
    productDesc:
      "A flexible wand with replaceable feather tips that mimics prey movement and encourages active play.",
    productCategory: ProductCategory.TOY,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.SMALL,
    productPrice: 7.25,
    productLeftCount: 110,
    imageQuery: "cat toy",
  },
  {
    productName: "Catnip Mouse Trio",
    productDesc:
      "Three felt mice filled with dried catnip, light enough to be batted across the floor for hours.",
    productCategory: ProductCategory.TOY,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.SMALL,
    productPrice: 10.99,
    productLeftCount: 85,
    imageQuery: "cat toy",
  },
  {
    productName: "Interactive Puzzle Board",
    productDesc:
      "Sliding compartments hide treats behind simple mechanisms, offering mental stimulation for both cats and dogs.",
    productCategory: ProductCategory.TOY,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.LARGE,
    productPrice: 29.99,
    productLeftCount: 25,
    imageQuery: "pet toy",
  },

  // ---------- ACCESSORY ----------
  {
    productName: "Reflective Nylon Collar",
    productDesc:
      "An adjustable nylon collar with reflective stitching for safer walks after dark, plus a quick-release buckle.",
    productCategory: ProductCategory.ACCESSORY,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.MEDIUM,
    productPrice: 14.99,
    productLeftCount: 75,
    imageQuery: "dog collar",
  },
  {
    productName: "Padded Leather Leash",
    productDesc:
      "Full-grain leather with a padded handle that stays comfortable during longer walks with a strong puller.",
    productCategory: ProductCategory.ACCESSORY,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.LARGE,
    productPrice: 26.5,
    productLeftCount: 40,
    imageQuery: "dog leash",
  },
  {
    productName: "Breakaway Bell Collar",
    productDesc:
      "A lightweight collar with a safety clasp that releases under pressure, and a small bell to warn local wildlife.",
    productCategory: ProductCategory.ACCESSORY,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.SMALL,
    productPrice: 9.5,
    productLeftCount: 95,
    imageQuery: "cat collar",
  },
  {
    productName: "Memory Foam Pet Bed",
    productDesc:
      "A supportive memory foam base with a removable, machine-washable cover. Recommended for older joints.",
    productCategory: ProductCategory.ACCESSORY,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.LARGE,
    productPrice: 68.0,
    productLeftCount: 20,
    imageQuery: "pet bed",
  },
  {
    productName: "Ceramic Slow-Feed Bowl",
    productDesc:
      "Raised ridges inside a weighted ceramic bowl slow down fast eaters and help reduce bloating.",
    productCategory: ProductCategory.ACCESSORY,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.MEDIUM,
    productPrice: 21.99,
    productLeftCount: 50,
    imageQuery: "pet bowl",
  },
  {
    productName: "Travel Carrier Backpack",
    productDesc:
      "A ventilated carrier with padded straps and a rigid frame, suitable for pets up to eight kilograms.",
    productCategory: ProductCategory.ACCESSORY,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.LARGE,
    productPrice: 79.99,
    productLeftCount: 15,
    imageQuery: "pet carrier",
  },

  // ---------- SUPPLEMENT ----------
  {
    productName: "Omega-3 Skin & Coat Oil",
    productDesc:
      "Cold-pressed fish oil that supports a glossy coat and calmer skin. Pour over food once daily.",
    productCategory: ProductCategory.SUPPLEMENT,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.SMALL,
    productPrice: 24.99,
    productLeftCount: 60,
    imageQuery: "supplement bottle",
  },
  {
    productName: "Probiotic Digestive Powder",
    productDesc:
      "A blend of live cultures and prebiotic fibre that helps settle digestion after diet changes or travel.",
    productCategory: ProductCategory.SUPPLEMENT,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.SMALL,
    productPrice: 27.99,
    productLeftCount: 50,
    imageQuery: "supplement bottle",
  },
  {
    productName: "Multivitamin Daily Tablets",
    productDesc:
      "A broad vitamin and mineral tablet designed to fill small gaps in a home-prepared diet.",
    productCategory: ProductCategory.SUPPLEMENT,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.SMALL,
    productPrice: 19.99,
    productLeftCount: 70,
    imageQuery: "supplement bottle",
  },
  {
    productName: "Calming Hemp Drops",
    productDesc:
      "Hemp-derived drops with chamomile, intended for nervous pets during storms, travel, or vet visits.",
    productCategory: ProductCategory.SUPPLEMENT,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.SMALL,
    productPrice: 29.99,
    productLeftCount: 40,
    imageQuery: "supplement bottle",
  },
  {
    productName: "Joint Support Chews",
    productDesc:
      "Soft chews with glucosamine and chondroitin, formulated for large breeds and ageing joints.",
    productCategory: ProductCategory.SUPPLEMENT,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.MEDIUM,
    productPrice: 32.5,
    productLeftCount: 45,
    imageQuery: "dog treats",
  },
  {
    productName: "Hairball Control Paste",
    productDesc:
      "A malt-flavoured paste that helps hair pass naturally through the digestive tract. Most cats take it straight from the tube.",
    productCategory: ProductCategory.SUPPLEMENT,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.SMALL,
    productPrice: 16.5,
    productLeftCount: 65,
    imageQuery: "cat grooming",
  },

  // ---------- HYGIENE ----------
  {
    productName: "Oatmeal Soothing Shampoo",
    productDesc:
      "A gentle, soap-free shampoo with colloidal oatmeal that calms itchy skin without stripping natural oils.",
    productCategory: ProductCategory.HYGIENE,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.MEDIUM,
    productPrice: 17.99,
    productLeftCount: 80,
    imageQuery: "dog bath",
  },
  {
    productName: "Waterless Foam Cleanser",
    productDesc:
      "A rinse-free foam for quick clean-ups between baths. Works well for cats who dislike water.",
    productCategory: ProductCategory.HYGIENE,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.SMALL,
    productPrice: 15.5,
    productLeftCount: 70,
    imageQuery: "cat grooming",
  },
  {
    productName: "Clumping Odor-Lock Litter",
    productDesc:
      "Fine-grain clay litter that forms firm clumps and traps ammonia odour for easier daily scooping.",
    productCategory: ProductCategory.HYGIENE,
    productPetType: ProductPetType.CAT,
    productSize: ProductSize.LARGE,
    productPrice: 23.99,
    productLeftCount: 55,
    imageQuery: "cat litter",
  },
  {
    productName: "Deshedding Grooming Brush",
    productDesc:
      "A stainless-steel edge that reaches the undercoat and removes loose hair before it reaches your furniture.",
    productCategory: ProductCategory.HYGIENE,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.MEDIUM,
    productPrice: 19.75,
    productLeftCount: 85,
    imageQuery: "pet grooming brush",
  },
  {
    productName: "Dental Care Toothpaste Kit",
    productDesc:
      "Poultry-flavoured enzymatic toothpaste with two brush heads, for building a regular dental routine.",
    productCategory: ProductCategory.HYGIENE,
    productPetType: ProductPetType.DOG,
    productSize: ProductSize.SMALL,
    productPrice: 13.99,
    productLeftCount: 90,
    imageQuery: "dog teeth",
  },
  {
    productName: "Ear Cleaning Solution",
    productDesc:
      "A mild solution that loosens wax and debris. Apply weekly, or after swimming, to help prevent infections.",
    productCategory: ProductCategory.HYGIENE,
    productPetType: ProductPetType.ALL,
    productSize: ProductSize.SMALL,
    productPrice: 12.99,
    productLeftCount: 75,
    imageQuery: "pet care",
  },
];

/** Ask Unsplash for `count` photos matching `query`, return their image URLs. */
async function fetchPhotoUrls(query: string, count: number): Promise<string[]> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query,
  )}&per_page=${Math.max(count, 1)}&orientation=squarish&content_filter=high`;

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });

  if (!response.ok) {
    throw new Error(
      `Unsplash request failed for "${query}": ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    results: { urls: { regular: string } }[];
  };

  return data.results.map((photo) => photo.urls.regular);
}

/** Download an image and store it in uploads/products, return the public path. */
async function downloadImage(url: string, filename: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/products/${filename}`;
}

async function main(): Promise<void> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("Missing required environment variable: UNSPLASH_ACCESS_KEY");
    process.exit(1);
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected");

  // Skip products that already exist, so the script can be re-run safely.
  const existing = await ProductModel.find(
    { productName: { $in: SEED_PRODUCTS.map((p) => p.productName) } },
    { productName: 1 },
  ).lean();
  const existingNames = new Set(existing.map((p) => p.productName));

  const pending = SEED_PRODUCTS.filter(
    (p) => !existingNames.has(p.productName),
  );

  if (pending.length === 0) {
    console.log("Nothing to seed — all products already exist.");
    await mongoose.disconnect();
    return;
  }

  // Group by search query so we make one API call per query, not per product.
  const byQuery = new Map<string, SeedProduct[]>();
  pending.forEach((product) => {
    const group = byQuery.get(product.imageQuery) ?? [];
    group.push(product);
    byQuery.set(product.imageQuery, group);
  });

  let created = 0;
  let index = 0;

  for (const [query, group] of byQuery) {
    let photoUrls: string[] = [];

    try {
      photoUrls = await fetchPhotoUrls(query, group.length);
    } catch (err) {
      console.error(`Skipping query "${query}":`, err);
      continue;
    }

    for (let i = 0; i < group.length; i++) {
      const product = group[i];

      if (photoUrls.length === 0) {
        console.warn(
          `No photos found for "${query}" — skipping ${product.productName}`,
        );
        continue;
      }

      // Cycle through results if Unsplash returned fewer photos than needed.
      const photoUrl = photoUrls[i % photoUrls.length];

      try {
        const filename = `seed-${Date.now()}-${index++}.jpg`;
        const imagePath = await downloadImage(photoUrl, filename);

        await ProductModel.create({
          productName: product.productName,
          productDesc: product.productDesc,
          productCategory: product.productCategory,
          productPetType: product.productPetType,
          productSize: product.productSize,
          productPrice: product.productPrice,
          productLeftCount: product.productLeftCount,
          productImages: [imagePath],
          productStatus: ProductStatus.PROCESS,
        });

        created++;
        console.log(`Created: ${product.productName}`);
      } catch (err) {
        console.error(`Failed: ${product.productName}`, err);
      }
    }
  }

  console.log(`\nDone. ${created} of ${pending.length} products created.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
