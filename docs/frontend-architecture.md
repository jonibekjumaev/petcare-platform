# PetCare — Frontend va Monorepo arxitekturasi

> Bu hujjat — **ADR** (Architecture Decision Record). Unda qanday qaror qabul qilingani,
> qanday muqobillar ko'rib chiqilgani va nima uchun aynan shu tanlangani yozilgan.
> Maqsadi: bir yildan keyin "nega bu shunday qilingan?" degan savolga javob qolishi.
>
> Joylashuvi: `docs/frontend-architecture.md`
> Sana: 2026-08-19

---

## 1. Kontekst

PetCare — Express/TypeScript/MongoDB backend'i tayyor bo'lgan, EJS admin paneli
ishlayotgan loyiha. Endi mijozlar uchun React SPA quriladi.

Loyihaning asosiy maqsadi — **o'rganish**, ya'ni tanlovlar "eng tez" emas, "eng ko'p
o'rgatadigan va amalyotga mos" mezoni bo'yicha qilinadi.

---

## 2. Qabul qilingan qarorlar

### 2.1 Rendering: SPA (CSR), Next.js emas

| | |
|---|---|
| **Qaror** | React + Vite (client-side rendering) |
| **Muqobil** | Next.js (SSR/SSG) |
| **Sabab** | Haqiqiy internet-do'kon uchun SEO tufayli Next.js to'g'riroq bo'lardi. Ammo bu loyihaning maqsadi — React'ning o'zini chuqur o'zlashtirish. Next.js keyingi loyihada (Nestar) o'rganiladi. |
| **Ongli murosa** | Mahsulot sahifalari qidiruv tizimlarida yaxshi indekslanmaydi. Bu — bilib qilingan tanlov, kamchilik emas. |

### 2.2 Repozitoriya: monorepo (npm workspaces)

| | |
|---|---|
| **Qaror** | Bitta repozitoriya, uchta workspace: `backend`, `frontend`, `shared` |
| **Muqobil** | Alohida repozitoriyalar + npm registr yoki OpenAPI codegen |
| **Sabab** | Bitta dasturchi, bitta reliz sikli. Turlar darhol sinxron bo'ladi. Portfolio uchun ikkala qism bir joyda ko'rinadi. |
| **Eslatma** | Repozitoriya chegarasi xavfsizlik chegarasi **emas**. Brauzerga nima tushishini build belgilaydi. Chegara paket darajasida o'rnatiladi (2.7-bandga qarang). |

### 2.3 API shartnomasi: `shared` paketi (DTO + enum)

| | |
|---|---|
| **Qaror** | `@petcare/shared` paketida DTO turlari va enum'lar |
| **Muqobil** | Qo'lda nusxalash (burak'dagi yo'l) / OpenAPI codegen |
| **Sabab** | Qo'lda nusxalash **contract drift**ga olib keladi. Misol: burak-react'da `createdAt: Date` deb yozilgan, lekin JSON orqali u **matn** bo'lib keladi — TypeScript yolg'on gapiradi va `.getFullYear()` runtime'da yiqiladi. |

**Muhim tushuncha — DTO (Data Transfer Object):** baza modeli va tarmoq orqali
uzatiladigan shakl bir xil emas.

| Maydon | Backend (mongoose model) | API javobi (DTO) |
|---|---|---|
| `_id` | `ObjectId` | `string` |
| `createdAt` | `Date` | `string` (ISO) |
| `memberPassword` | mavjud (yashirin) | umuman yo'q |

### 2.4 Holat boshqaruvi: RTK + RTK Query

| | |
|---|---|
| **Qaror** | Server state → **RTK Query**; client state → **Redux Toolkit slice** |
| **Muqobil** | `createAsyncThunk` + axios (burak'dagi yo'l) / TanStack Query + Zustand |
| **Sabab** | RTK Query `@reduxjs/toolkit` ichida keladi — yangi bog'liqlik yo'q. Keshlash, loading/error, invalidation avtomatik. Redux ekotizimi tanish. |

**Holat inventarizatsiyasi:**

*Server state* (serverda yashaydi, biz nusxasini ushlaymiz):
mahsulotlar ro'yxati, mahsulot tafsiloti, profil, buyurtmalar, uy hayvonlari, chat xabarlari.

*Client state* (faqat brauzerda):
autentifikatsiya (token + joriy foydalanuvchi), **savat** (backend'da "savat" tushunchasi yo'q —
`createOrder` bir yo'la `items[]` qabul qiladi, demak savat to'liq frontend'da yashaydi),
UI holatlari (modal, mobil menyu).

### 2.5 UI kutubxonasi: faqat MUI

| | |
|---|---|
| **Qaror** | Bitta dizayn tizimi — MUI (joriy versiya) |
| **Muqobil** | Tailwind + shadcn/ui / sof CSS |
| **Sabab** | Tanish, amalyotda keng ishlatiladi. Burak'dagi xatoni takrorlamaymiz: u yerda `@material-ui/core@4` + `@mui/material@5` + `@mui/joy` + `styled-components` + `emotion` — uchta dizayn tizimi va ikkita CSS-in-JS dvigateli birga o'rnatilgan edi. |

### 2.6 Boshqa tanlovlar

| Qatlam | Tanlov | Nimaning o'rniga |
|---|---|---|
| Build tool | **Vite** | CRA (`react-scripts`) — React jamoasi 2025-yil fevralda rasman yopgan |
| Routing | **React Router 7** | v5 (API butunlay boshqacha) |
| Formalar | **react-hook-form + Zod** | qo'lda `useState` |
| Sana | **date-fns** yoki **dayjs** | `moment` (legacy) |
| HTTP | **RTK Query `fetchBaseQuery`** | `axios` (endi kerak emas) |
| Bildirishnoma | **MUI Snackbar** | `sweetalert` + `sweetalert2` (ikkalasi birga edi) |
| Testlar | **Vitest + Testing Library** | — |
| Realtime | **socket.io-client** | (o'zgarmaydi, chat uchun) |

### 2.7 Intizom qoidalari

1. `shared` paketi **butunlay neytral**: mongoose yo'q, `process.env` yo'q, `fs` yo'q,
   Express yo'q. Faqat turlar, enum'lar, konstantalar, Zod sxemalari.
   *Sabab:* uning kodi brauzerga tushadi.
2. Frontend'dan backend'ga to'g'ridan-to'g'ri import **taqiqlanadi**
   (ESLint `no-restricted-imports` bilan majburlanadi).
3. Har bir maydon nomi bitta joyda e'lon qilinadi — takrorlash yo'q.

---

## 3. Maqsadli papka tuzilishi

```
Petcare/
├── package.json                    # ILDIZ: workspaces ro'yxati
├── .gitignore
├── README.md
├── docs/
│   └── frontend-architecture.md    # shu hujjat
│
├── shared/                         # YANGI paket — API shartnomasi
│   ├── package.json                # "@petcare/shared"
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # barcha eksportlar shu yerdan
│       ├── dto/
│       │   ├── product.dto.ts
│       │   ├── member.dto.ts
│       │   ├── order.dto.ts
│       │   ├── pet.dto.ts
│       │   └── common.dto.ts       # Inquiry, Pagination va h.k.
│       └── enums/
│           ├── product.enum.ts     # ProductCategory, ProductPetType, ProductSize, ProductStatus
│           ├── member.enum.ts      # MemberType, MemberStatus
│           └── order.enum.ts       # OrderStatus
│
├── backend/                        # MAVJUD (nomi o'zgaradi)
│   ├── package.json                # "@petcare/backend" + dep: "@petcare/shared"
│   ├── tsconfig.json
│   ├── public/                     # admin panel CSS/JS/img
│   ├── views/                      # admin panel EJS
│   ├── uploads/                    # (gitignore)
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── router.ts               # JWT API (React uchun)
│       ├── router-admin.ts         # session (EJS admin)
│       ├── controllers/
│       ├── models/                 # service qatlami
│       ├── schema/                 # mongoose modellar
│       ├── middlewares/
│       ├── seed/
│       └── libs/
│           ├── types/              # ichki (mongoose'ga bog'liq) turlar
│           ├── enums/              # → keyinchalik shared'dan re-export
│           ├── mappers/            # YANGI: model → DTO
│           │   ├── product.mapper.ts
│           │   ├── member.mapper.ts
│           │   └── order.mapper.ts
│           └── utils/
│
└── frontend/                       # YANGI: Vite + React + TS
    ├── package.json                # "@petcare/frontend" + dep: "@petcare/shared"
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx                # kirish nuqtasi
        ├── App.tsx
        │
        ├── app/                    # global "sim-tortish"
        │   ├── store.ts            # configureStore
        │   ├── hooks.ts            # useAppDispatch, useAppSelector
        │   ├── router.tsx          # marshrutlar
        │   └── theme.ts            # MUI theme
        │
        ├── api/
        │   └── baseApi.ts          # RTK Query bazasi (baseUrl, auth header)
        │
        ├── features/               # FEATURE-BASED: har biri o'z ichida to'liq
        │   ├── auth/
        │   │   ├── api/authApi.ts          # login, signup endpointlari
        │   │   ├── model/authSlice.ts      # token, joriy foydalanuvchi
        │   │   ├── ui/LoginForm.tsx
        │   │   └── index.ts                # tashqariga nima chiqishi
        │   ├── products/
        │   │   ├── api/productsApi.ts
        │   │   ├── ui/ProductCard.tsx
        │   │   ├── ui/ProductFilters.tsx
        │   │   └── index.ts
        │   ├── cart/
        │   │   ├── model/cartSlice.ts      # localStorage bilan
        │   │   ├── ui/CartDrawer.tsx
        │   │   └── index.ts
        │   ├── orders/
        │   ├── pets/
        │   └── chat/
        │
        ├── pages/                  # marshrutga mos sahifalar (feature'larni yig'adi)
        │   ├── HomePage.tsx
        │   ├── ProductsPage.tsx
        │   ├── ProductDetailPage.tsx
        │   ├── CartPage.tsx
        │   ├── OrdersPage.tsx
        │   ├── ProfilePage.tsx
        │   └── LoginPage.tsx
        │
        ├── common/                 # feature'ga bog'liq bo'lmagan umumiy narsalar
        │   ├── ui/                 # Button, Loader, EmptyState...
        │   ├── layout/             # Header, Footer, Layout
        │   ├── hooks/
        │   └── lib/                # formatPrice, formatDate...
        │
        └── assets/
```

> **Nima uchun `features/` va `pages/` alohida?**
> `features/` — biznes imkoniyat (mahsulotlar, savat, auth), u marshrutdan mustaqil.
> `pages/` — marshrutga bog'langan yig'ma qatlam: bir nechta feature'ni bitta ekranga birlashtiradi.
> Masalan `ProductDetailPage` ham `products`, ham `cart` feature'idan foydalanadi.

---

## 4. Bosqichma-bosqich reja

Har bir bosqichda **faqat bitta yangi noma'lum** bo'lishi uchun tartib shunday tuzilgan.
Agar nimadir buzilsa — sabab aniq bo'ladi.

### Bosqich 0 — Monorepo skeleti

1. Ildizda `package.json` yaratish (`"workspaces": ["backend", "frontend", "shared"]`)
2. `backend/package.json`da nomni `@petcare/backend`ga o'zgartirish
3. `shared/` papkasini va uning `package.json` + `tsconfig.json` fayllarini yaratish
4. Ildizda `npm install` — symlink'lar hosil bo'lishini tekshirish

**Tekshiruv:** `backend/node_modules/@petcare/shared` symlink'i paydo bo'ldimi.

### Bosqich 1 — `shared` paketini to'ldirish

1. Enum'larni backend'dan `shared/src/enums/`ga ko'chirish
2. Backend'da o'sha enum'larni `shared`dan re-export qilish (mavjud importlar buzilmasin)
3. DTO turlarini yozish — `_id: string`, `createdAt: string` bilan
4. `shared/src/index.ts`da hammasini eksport qilish

**Tekshiruv:** backend `npm run build` xatosiz o'tadimi.

### Bosqich 2 — Frontend skeleti

1. `npm create vite@latest frontend -- --template react-ts`
2. `package.json` nomini `@petcare/frontend`ga o'zgartirish, `@petcare/shared`ni qo'shish
3. MUI, Redux Toolkit, React Router, React Hook Form, Zod o'rnatish
4. `app/store.ts`, `app/router.tsx`, `app/theme.ts` — minimal sozlash
5. Vite proxy: `/api` so'rovlarini `localhost:3010`ga yo'naltirish (CORS muammosi bo'lmasin)

**Tekshiruv:** `npm run dev` — bo'sh sahifa ochiladimi, `shared`dan import ishlaydimi.

### Bosqich 3 — Birinchi to'liq "kesim" (vertical slice)

Bitta funksiyani uchdan-uchgacha ishlatamiz: **mahsulotlar ro'yxati**.

1. `api/baseApi.ts` — RTK Query bazasi
2. `features/products/api/productsApi.ts` — `getProducts` endpointi
3. `features/products/ui/ProductCard.tsx`
4. `pages/ProductsPage.tsx` — `useGetProductsQuery` bilan
5. Marshrut qo'shish

**Tekshiruv:** brauzerda haqiqiy mahsulotlar (seed qilinganlari) ko'rinadimi.
Shu nuqtada monorepo + Vite + RTK Query + shared turlar — hammasi ishlayotganiga ishonch hosil bo'ladi.

### Bosqich 4 — Backend'da mapper'lar

1. `libs/mappers/product.mapper.ts` — `toProductDTO`
2. `product.controller.ts`da qo'llash
3. Ishlaganini tekshirib, qolgan modellarga tarqatish (member, order, pet)

**Tekshiruv:** API javobida ortiqcha maydon yo'qligi (ayniqsa `Member` uchun).

### Bosqich 5 — Qolgan funksiyalar

Auth (login/signup, token saqlash, himoyalangan marshrutlar) → mahsulot tafsiloti →
savat (localStorage) → buyurtma berish → buyurtmalar tarixi → profil → uy hayvonlari → chat.

### Bosqich 6 — Sifat qatlami

Formalar validatsiyasi (Zod sxemalarini `shared`ga ko'chirish va backend'da ham ishlatish),
testlar (Vitest), error boundary, loading skeletonlar.

---

## 5. Hal qilinmagan savollar

Bular keyinroq, o'z vaqti kelganda hal qilinadi:

- **JWT tokenni qayerda saqlash** — `localStorage` (oson, lekin XSS'ga ochiq) yoki
  `httpOnly` cookie (xavfsizroq, lekin CSRF haqida alohida o'ylash kerak).
- **Refresh token** kerakmi, yoki token muddati tugaganda oddiy logout yetarlimi.
- **Zod sxemalarini** `shared`ga ko'chirib, backend'da ham runtime validatsiya sifatida
  ishlatish (hozir backend'da runtime validatsiya umuman yo'q).
- **Flash message** — admin panelda qolib ketgan "qarz".

---

## 6. Nima uchun bu narsalar NestJS'da ham bor?

DTO, mapper, qatlamlarga bo'lish — bular NestJS ixtirosi emas, balki umumiy dasturiy
injiniring naqshlari (Martin Fowler, *PoEAA*, 2002). NestJS ularni **konvensiya** qilib,
dekoratorlar bilan avtomatlashtirgan.

Express hech narsani majburlamaydi — arxitekturani o'zing quryapsan. Shuning uchun avval
qo'lda qurib ko'rish qimmatliroq: keyin NestJS'da `@Exclude()` dekoratorini ko'rganingda,
u "framework talab qilgan sirli narsa" emas, "men qo'lda yozgan mapper'ning avtomatlashtirilgan
versiyasi" bo'lib ko'rinadi.
