export interface SeedShade {
  shadeName: string;
  shadeHex: string;
  sku: string;
  stock: number;
  image?: string;
  isAvailable?: boolean;
}

export interface SeedProduct {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: "Tinted Lip Oils" | "Plumping Glosses" | "Velvet Mattes" | "Cheek & Lip Balms" | "Glow Highlighters" | "Beauty Sets";
  rating: number;
  reviewCount: number;
  images: string[];
  isBestseller: boolean;
  isNewArrival: boolean;
  formulaBenefits: string[];
  ingredients: string;
  howToUse: string;
  shades: SeedShade[];
  totalStock: number;
  status: "active" | "draft" | "archived";
}

export interface SeedOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    orderNotes?: string;
  };
  items: {
    productId: string;
    productName: string;
    slug: string;
    shadeName: string;
    shadeHex: string;
    sku: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "COD" | "BANK_TRANSFER";
  paymentStatus: "PENDING_PAYMENT" | "SLIP_REVIEW" | "VERIFIED" | "FAILED";
  fulfillmentStatus: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  bankSlip?: {
    receiptUrl?: string;
    receiptBase64?: string;
    referenceNumber?: string;
    uploadedAt?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  trackingNumber?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_PRODUCTS: SeedProduct[] = [
  {
    _id: "prod_01",
    name: "Velvet Glaze Tinted Lip Oil",
    slug: "velvet-glaze-tinted-lip-oil",
    tagline: "High-shine peptide lip oil that cushions lips with glossy hydration",
    description:
      "An ultra-nourishing, non-sticky tinted lip oil packed with tri-peptides, jojoba seed oil, and cloudberry extract. Delivers a juicy, glass-like sheen with a flattering flush of color that lasts all day.",
    price: 22.0,
    compareAtPrice: 28.0,
    category: "Tinted Lip Oils",
    rating: 4.9,
    reviewCount: 1420,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    ],
    isBestseller: true,
    isNewArrival: false,
    formulaBenefits: [
      "12-Hour Cushioning Hydration",
      "Infused with Plumping Tri-Peptides",
      "100% Vegan & Cruelty-Free",
      "Non-Sticky Glassy Glaze Finish",
    ],
    ingredients:
      "Hydrogenated Polyisobutene, Simmondsia Chinensis (Jojoba) Seed Oil, Rubus Chamaemorus (Cloudberry) Seed Oil, Palmitoyl Tripeptide-1, Tocopheryl Acetate (Vitamin E), Ethylhexyl Palmitate, Fragrance/Parfum, CI 77891, CI 77491, CI 15850.",
    howToUse:
      "Glide the custom plush doe-foot applicator over bare lips for a sheer dewy tint, or layer over your favorite Girly Beauty lip liner for an intensely juicy, voluminous pout.",
    shades: [
      { shadeName: "01 Rose Whisper", shadeHex: "#d4788c", sku: "VG-ROSE-01", stock: 84, isAvailable: true },
      { shadeName: "02 Berry Velvet", shadeHex: "#954558", sku: "VG-BERR-02", stock: 45, isAvailable: true },
      { shadeName: "03 Peach Glaze", shadeHex: "#e8927c", sku: "VG-PCH-03", stock: 120, isAvailable: true },
      { shadeName: "04 Honey Fig", shadeHex: "#b86b59", sku: "VG-FIG-04", stock: 18, isAvailable: true },
      { shadeName: "05 Cherry Luxe", shadeHex: "#772033", sku: "VG-CHRY-05", stock: 4, isAvailable: true },
      { shadeName: "06 Crystal Sheer", shadeHex: "#fcefed", sku: "VG-CRYS-06", stock: 62, isAvailable: true },
    ],
    totalStock: 333,
    status: "active",
  },
  {
    _id: "prod_02",
    name: "Cloud Melt Whipped Lip & Cheek Soufflé",
    slug: "cloud-melt-whipped-souffle",
    tagline: "Airy matte cream that blurs and melts seamlessly into skin",
    description:
      "A weightless, whipped mousse pigment designed for both lips and cheeks. Blends effortlessly with fingertips to impart a soft-focus velvet blush that never cakes or settles into fine lines.",
    price: 24.0,
    compareAtPrice: 30.0,
    category: "Cheek & Lip Balms",
    rating: 4.8,
    reviewCount: 890,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    ],
    isBestseller: true,
    isNewArrival: false,
    formulaBenefits: [
      "Soft-Focus Blurring Technology",
      "Dual-Use for Cheeks & Lips",
      "Buildable Featherlight Pigment",
      "Nourishing Shea & Rosehip Butter",
    ],
    ingredients:
      "Dimethicone, Dimethicone Crosspolymer, Butyrospermum Parkii (Shea) Butter, Rosa Canina Fruit Oil, Squalane, Silica, Caprylyl Glycol, CI 77891, CI 77492, CI 45410.",
    howToUse:
      "Dot 1-2 droplets onto apples of cheeks and tap gently outward. Dab a touch onto the center of lips and diffuse with finger for an ethereal blurred gradient.",
    shades: [
      { shadeName: "Petal Petal", shadeHex: "#e39da8", sku: "CM-PETAL-01", stock: 95, isAvailable: true },
      { shadeName: "Sun-Kissed Mauve", shadeHex: "#b5697a", sku: "CM-MAUVE-02", stock: 32, isAvailable: true },
      { shadeName: "Apricot Mousse", shadeHex: "#f0a282", sku: "CM-APRI-03", stock: 70, isAvailable: true },
      { shadeName: "Vintage Crimson", shadeHex: "#8f3044", sku: "CM-CRIM-04", stock: 12, isAvailable: true },
    ],
    totalStock: 209,
    status: "active",
  },
  {
    _id: "prod_03",
    name: "Silk Glow Liquid Illuminator Drops",
    slug: "silk-glow-liquid-illuminator",
    tagline: "Dewy champagne strobe drops that give lit-from-within radiance",
    description:
      "A weightless liquid serum highlighter charged with ultra-fine light-reflecting micro-pearls and hyaluronic acid. Imparts an ethereal glass-skin glow without glitter or greasiness.",
    price: 26.0,
    compareAtPrice: 32.0,
    category: "Glow Highlighters",
    rating: 5.0,
    reviewCount: 654,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    ],
    isBestseller: false,
    isNewArrival: true,
    formulaBenefits: [
      "Micro-Reflective Glass Pearl Finish",
      "Triple Molecular Hyaluronic Infusion",
      "Can Mix with Primer, Foundation, or Moisturizer",
      "Non-Comedogenic & Clean",
    ],
    ingredients:
      "Aqua/Water/Eau, Isododecane, Mica, Sodium Hyaluronate, Squalane, Glycerin, Phenoxyethanol, Synthetic Fluorphlogopite, Tin Oxide, Titanium Dioxide.",
    howToUse:
      "Apply 2-3 drops to high points of the face (cheekbones, brow bone, cupid's bow), or mix into foundation for an all-over luminescent filter.",
    shades: [
      { shadeName: "Champagne Glow", shadeHex: "#edd0be", sku: "SG-CHAMP-01", stock: 110, isAvailable: true },
      { shadeName: "Rose Gold Mirage", shadeHex: "#d89c9e", sku: "SG-ROSE-02", stock: 85, isAvailable: true },
      { shadeName: "Bronze Sunset", shadeHex: "#ad775e", sku: "SG-BRNZ-03", stock: 40, isAvailable: true },
    ],
    totalStock: 235,
    status: "active",
  },
  {
    _id: "prod_04",
    name: "Hydra-Plump Peptide Lip Glaze",
    slug: "hydra-plump-peptide-lip-glaze",
    tagline: "Cooling menthol & botanical peptide glaze for extreme volume",
    description:
      "Infused with spearmint oil, hyaluronic spheres, and ginger root extract, this high-gloss plumper gently tingles and visibly volumizes lips with instant hydration and mirror-like shine.",
    price: 20.0,
    compareAtPrice: 26.0,
    category: "Plumping Glosses",
    rating: 4.7,
    reviewCount: 520,
    images: [
      "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    ],
    isBestseller: true,
    isNewArrival: false,
    formulaBenefits: [
      "Instant & Long-Term Visible Plump",
      "Refreshingly Cool Menthol Sensation",
      "High-Gloss Reflective Sheen",
      "Maxi-Lip™ Peptide Complex",
    ],
    ingredients:
      "Polybutene, Octyldodecanol, Menthyl Lactate, Zingiber Officinale (Ginger) Root Oil, Palmitoyl Tripeptide-38, Portulaca Pilosa Extract, CI 77891, CI 15850.",
    howToUse:
      "Apply directly to clean lips. Feel the mild cooling tingle activate within 60 seconds as lips expand with juicy luster.",
    shades: [
      { shadeName: "Bubblegum Pop", shadeHex: "#f78da7", sku: "HP-BUBB-01", stock: 78, isAvailable: true },
      { shadeName: "Iced Caramel", shadeHex: "#ba7b65", sku: "HP-CARM-02", stock: 64, isAvailable: true },
      { shadeName: "Ruby Drip", shadeHex: "#a6273c", sku: "HP-RUBY-03", stock: 15, isAvailable: true },
    ],
    totalStock: 157,
    status: "active",
  },
  {
    _id: "prod_05",
    name: "Velvet Matte Butter Lipstick",
    slug: "velvet-matte-butter-lipstick",
    tagline: "Comfort-matte pigment that hugs lips in ultra-smooth luxury",
    description:
      "A buttery-soft matte lipstick bullet formulated with murumuru seed butter and vitamin C. Offers intense one-swipe pigment with an air-whipped, velvet suede finish that feels weightless.",
    price: 25.0,
    compareAtPrice: 32.0,
    category: "Velvet Mattes",
    rating: 4.9,
    reviewCount: 710,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    ],
    isBestseller: false,
    isNewArrival: true,
    formulaBenefits: [
      "10-Hour Non-Drying Comfort Wear",
      "Richly Pigmented Suede Finish",
      "Murumuru & Mango Seed Butter Base",
      "Sleek Magnetic Soft-Touch Case",
    ],
    ingredients:
      "Caprylic/Capric Triglyceride, Cera Microcristallina, Astrocaryum Murumuru Seed Butter, Mangifera Indica (Mango) Seed Butter, Ascorbyl Palmitate, CI 77491, CI 77891, CI 15850.",
    howToUse:
      "Begin at the center of the upper lip, moving outward along the contour of your lips. Fill in the bottom lip and blot lightly.",
    shades: [
      { shadeName: "French Mauve", shadeHex: "#a3586b", sku: "VM-FRMA-01", stock: 90, isAvailable: true },
      { shadeName: "Soft Chai", shadeHex: "#af6c5c", sku: "VM-CHAI-02", stock: 80, isAvailable: true },
      { shadeName: "Bordeaux Noir", shadeHex: "#681e2b", sku: "VM-BORD-03", stock: 52, isAvailable: true },
      { shadeName: "Nude Dahlia", shadeHex: "#cfa198", sku: "VM-DAHL-04", stock: 3, isAvailable: true },
    ],
    totalStock: 225,
    status: "active",
  },
  {
    _id: "prod_06",
    name: "The Soft-Glam Vault (4-Piece Holiday Set)",
    slug: "the-soft-glam-vault-set",
    tagline: "Exclusive bundle with our award-winning lip & cheek bestsellers",
    description:
      "The ultimate Girly Beauty collection in a luxury keepsake velvet box. Includes Velvet Glaze in '01 Rose Whisper', Cloud Melt Soufflé in 'Petal Petal', Silk Glow Drops in 'Champagne Glow', and a bespoke crystal lip contour brush.",
    price: 68.0,
    compareAtPrice: 94.0,
    category: "Beauty Sets",
    rating: 5.0,
    reviewCount: 340,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80",
    ],
    isBestseller: true,
    isNewArrival: false,
    formulaBenefits: [
      "Complete 4-Piece Glam Routine",
      "Saves $26 vs Purchasing Separately",
      "Includes Limited Keepsake Box",
      "Perfect Gift for Glow Lovers",
    ],
    ingredients:
      "Contains full ingredient panels of Velvet Glaze Lip Oil, Cloud Melt Soufflé, and Silk Glow Highlighter.",
    howToUse:
      "Follow the 3-step Girly Routine: Strobe with Silk Glow Drops, drape cheeks with Cloud Melt Soufflé, and glaze lips with Velvet Glaze.",
    shades: [
      { shadeName: "Universal Soft-Glam Set", shadeHex: "#d4788c", sku: "SET-VAULT-01", stock: 34, isAvailable: true },
    ],
    totalStock: 34,
    status: "active",
  },
];

export const INITIAL_ORDERS: SeedOrder[] = [
  {
    _id: "ord_01",
    orderNumber: "GB-9821",
    customer: {
      name: "Sophia Montgomery",
      email: "sophia.m@example.com",
      phone: "+1 (555) 234-8901",
      address: "742 Evergreen Terrace, Apt 4B",
      city: "Beverly Hills",
      postalCode: "90210",
      country: "United States",
      orderNotes: "Please leave at front doorstep with concierge.",
    },
    items: [
      {
        productId: "prod_01",
        productName: "Velvet Glaze Tinted Lip Oil",
        slug: "velvet-glaze-tinted-lip-oil",
        shadeName: "02 Berry Velvet",
        shadeHex: "#954558",
        sku: "VG-BERR-02",
        price: 22.0,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80",
      },
      {
        productId: "prod_03",
        productName: "Silk Glow Liquid Illuminator Drops",
        slug: "silk-glow-liquid-illuminator",
        shadeName: "Champagne Glow",
        shadeHex: "#edd0be",
        sku: "SG-CHAMP-01",
        price: 26.0,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80",
      },
    ],
    subtotal: 70.0,
    shippingFee: 0.0,
    discount: 5.0,
    totalAmount: 65.0,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "SLIP_REVIEW",
    fulfillmentStatus: "PROCESSING",
    bankSlip: {
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
      referenceNumber: "TXN-CHASE-89410924",
      uploadedAt: "2026-08-27T08:15:00Z",
    },
    adminNotes: "Slip uploaded, matches Chase Bank reference.",
    createdAt: "2026-08-27T08:10:00Z",
    updatedAt: "2026-08-27T08:15:00Z",
  },
  {
    _id: "ord_02",
    orderNumber: "GB-9820",
    customer: {
      name: "Emma Laurent",
      email: "emma.laurent@example.com",
      phone: "+1 (555) 890-1234",
      address: "128 Mercer St, Soho",
      city: "New York",
      postalCode: "10012",
      country: "United States",
    },
    items: [
      {
        productId: "prod_06",
        productName: "The Soft-Glam Vault (4-Piece Holiday Set)",
        slug: "the-soft-glam-vault-set",
        shadeName: "Universal Soft-Glam Set",
        shadeHex: "#d4788c",
        sku: "SET-VAULT-01",
        price: 68.0,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop&q=80",
      },
    ],
    subtotal: 68.0,
    shippingFee: 0.0,
    discount: 0.0,
    totalAmount: 68.0,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "SLIP_REVIEW",
    fulfillmentStatus: "PROCESSING",
    bankSlip: {
      receiptUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80",
      referenceNumber: "BOA-REF-3489218",
      uploadedAt: "2026-08-27T07:42:00Z",
    },
    adminNotes: "Check transfer slip amount $68.00 against Bank of America.",
    createdAt: "2026-08-27T07:35:00Z",
    updatedAt: "2026-08-27T07:42:00Z",
  },
  {
    _id: "ord_03",
    orderNumber: "GB-9819",
    customer: {
      name: "Chloe Rodriguez",
      email: "chloe.rod@example.com",
      phone: "+1 (555) 456-7890",
      address: "45 Ocean Drive",
      city: "Miami",
      postalCode: "33139",
      country: "United States",
    },
    items: [
      {
        productId: "prod_01",
        productName: "Velvet Glaze Tinted Lip Oil",
        slug: "velvet-glaze-tinted-lip-oil",
        shadeName: "01 Rose Whisper",
        shadeHex: "#d4788c",
        sku: "VG-ROSE-01",
        price: 22.0,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80",
      },
      {
        productId: "prod_02",
        productName: "Cloud Melt Whipped Lip & Cheek Soufflé",
        slug: "cloud-melt-whipped-souffle",
        shadeName: "Petal Petal",
        shadeHex: "#e39da8",
        sku: "CM-PETAL-01",
        price: 24.0,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80",
      },
    ],
    subtotal: 46.0,
    shippingFee: 0.0,
    discount: 0.0,
    totalAmount: 46.0,
    paymentMethod: "COD",
    paymentStatus: "PENDING_PAYMENT",
    fulfillmentStatus: "PROCESSING",
    createdAt: "2026-08-26T18:20:00Z",
    updatedAt: "2026-08-26T18:20:00Z",
  },
  {
    _id: "ord_04",
    orderNumber: "GB-9818",
    customer: {
      name: "Amara Jenkins",
      email: "amara.j@example.com",
      phone: "+1 (555) 345-6789",
      address: "812 Sunset Blvd",
      city: "Los Angeles",
      postalCode: "90028",
      country: "United States",
    },
    items: [
      {
        productId: "prod_05",
        productName: "Velvet Matte Butter Lipstick",
        slug: "velvet-matte-butter-lipstick",
        shadeName: "French Mauve",
        shadeHex: "#a3586b",
        sku: "VM-FRMA-01",
        price: 25.0,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80",
      },
    ],
    subtotal: 50.0,
    shippingFee: 0.0,
    discount: 0.0,
    totalAmount: 50.0,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "VERIFIED",
    fulfillmentStatus: "SHIPPED",
    bankSlip: {
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
      referenceNumber: "WF-REF-9182312",
      uploadedAt: "2026-08-25T14:10:00Z",
      verifiedAt: "2026-08-25T15:00:00Z",
    },
    trackingNumber: "USPS-940011189922319082",
    createdAt: "2026-08-25T14:00:00Z",
    updatedAt: "2026-08-25T15:30:00Z",
  },
];
