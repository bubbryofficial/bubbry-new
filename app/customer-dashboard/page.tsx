"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CAT_ICONS: Record<string, string> = {
  "Dairy, Bread & Eggs":"🥛","Fruits & Vegetables":"🥦","Snacks & Munchies":"🍿",
  "Breakfast & Instant Food":"🥣","Sweet Tooth":"🍫","Bakery & Biscuits":"🍪",
  "Tea, Coffee & Milk Drinks":"☕","Atta, Rice & Dal":"🌾","Masala, Oil & More":"🫙",
  "Sauces & Spreads":"🥫","Cold Drinks & Juices":"🥤","Chicken, Meat & Fish":"🍗",
  "Baby Care":"🍼","Pharma & Wellness":"💊","Cleaning Essentials":"🧹",
  "Home & Office":"🏠","Personal Care":"🪥","Pet Care":"🐾",
  "Paan Corner":"🌿","Organic & Healthy Living":"🥗","Other":"🛍️",
};

const MINI_BANNERS = [
  { bg:"linear-gradient(135deg,#00875A,#00C27A)", emoji:"🥦", tag:"Fresh Today", title:"Farm Fresh Veggies", sub:"Straight from local farms", cat:"Fruits & Vegetables" },
  { bg:"linear-gradient(135deg,#B45309,#F59E0B)", emoji:"🍫", tag:"Sweet deals", title:"Chocolates & Snacks", sub:"Best brands, best prices", cat:"Sweet Tooth" },
  { bg:"linear-gradient(135deg,#1255CC,#1A6BFF)", emoji:"💊", tag:"Health first", title:"Pharma & Wellness", sub:"Medicines at your door", cat:"Pharma & Wellness" },
  { bg:"linear-gradient(135deg,#7C3AED,#A855F7)", emoji:"🧴", tag:"Self care", title:"Personal Care", sub:"Top brands delivered fast", cat:"Personal Care" },
  { bg:"linear-gradient(135deg,#DC2626,#F97316)", emoji:"🍗", tag:"Non veg", title:"Meat & Fish Fresh", sub:"Cleaned & packed daily", cat:"Chicken, Meat & Fish" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; }

/* HEADER */
.top-bar { background: #1A6BFF; padding: 12px 16px 14px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.3); }
.top-bar-row1 { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.brand { font-size: 22px; font-weight: 900; color: white; letter-spacing: -1px; }
.cart-fab { display: flex; align-items: center; gap: 6px; background: white; color: #1A6BFF; padding: 8px 14px; border-radius: 12px; font-size: 13px; font-weight: 800; text-decoration: none; position: relative; }
.cart-badge { background: #FF6B2B; color: white; font-size: 10px; font-weight: 800; width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.search-bar { display: flex; align-items: center; gap: 10px; background: white; border-radius: 12px; padding: 10px 14px; }
.search-bar input { border: none; outline: none; font-size: 14px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
.search-bar input::placeholder { color: #B0BACC; }

/* SORT BAR */
.sort-bar { display: flex; gap: 8px; padding: 8px 14px; overflow-x: auto; background: white; border-bottom: 1.5px solid #E4EAFF; }
.sort-bar::-webkit-scrollbar { display: none; }
.sort-chip { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 20px; border: 1.5px solid #E4EAFF; background: white; font-size: 12px; font-weight: 700; color: #4A5880; cursor: pointer; white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; flex-shrink: 0; }
.sort-chip.active { background: #1A6BFF; color: white; border-color: #1A6BFF; }

/* MAIN LAYOUT: sidebar + content */
.main-layout { display: flex; height: calc(100vh - 130px); overflow: hidden; }

/* LEFT SIDEBAR */
.sidebar { width: 82px; flex-shrink: 0; background: white; border-right: 1.5px solid #E4EAFF; overflow-y: auto; overflow-x: hidden; }
.sidebar::-webkit-scrollbar { display: none; }
.sidebar-item { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 4px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.15s; position: relative; }
.sidebar-item.active { border-left-color: #1A6BFF; background: #EBF1FF; }
.sidebar-item.active::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid #F4F6FB; }
.sidebar-img { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 22px; background: #F4F6FB; }
.sidebar-item.active .sidebar-img { background: #DDEAFF; }
.sidebar-img img { width: 100%; height: 100%; object-fit: contain; }
.sidebar-label { font-size: 9.5px; font-weight: 700; color: #8A96B5; text-align: center; line-height: 1.2; max-width: 72px; white-space: pre-line; }
.sidebar-item.active .sidebar-label { color: #1A6BFF; }
.sidebar-dot { width: 5px; height: 5px; background: #1A6BFF; border-radius: 50%; position: absolute; right: 6px; top: 10px; display: none; }
.sidebar-item.active .sidebar-dot { display: block; }

/* RIGHT CONTENT */
.content-area { flex: 1; overflow-y: auto; overflow-x: hidden; background: #F4F6FB; }
.content-area::-webkit-scrollbar { display: none; }

/* HERO */
.hero { margin: 12px 14px; border-radius: 18px; background: linear-gradient(120deg, #0B1F5C 0%, #1A6BFF 60%, #4D8FFF 100%); padding: 22px 20px; display: flex; align-items: center; justify-content: space-between; min-height: 130px; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; right: -30px; top: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.05); border-radius: 50%; }
.hero-text { flex: 1; z-index: 1; }
.hero-tag { display: inline-block; background: rgba(255,255,255,0.18); color: white; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; margin-bottom: 7px; letter-spacing: 0.8px; text-transform: uppercase; }
.hero-title { font-size: 20px; font-weight: 900; color: white; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 5px; }
.hero-sub { font-size: 11px; color: rgba(255,255,255,0.72); font-weight: 500; margin-bottom: 14px; line-height: 1.5; }
.hero-btn { display: inline-block; background: white; color: #1A6BFF; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 800; border: none; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
.hero-icon { font-size: 64px; z-index: 1; flex-shrink: 0; margin-left: 10px; }

/* MINI BANNERS */
.mini-section { padding: 4px 14px 0; }
.mini-section-title { font-size: 15px; font-weight: 800; color: #0D1B3E; margin-bottom: 10px; }
.mini-banners { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 2px; }
.mini-banners::-webkit-scrollbar { display: none; }
.mini-banner { flex-shrink: 0; width: 145px; border-radius: 14px; padding: 13px 11px; display: flex; flex-direction: column; min-height: 105px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.15s; }
.mini-banner:active { transform: scale(0.97); }
.mini-banner-emoji { position: absolute; right: 6px; bottom: 6px; font-size: 36px; opacity: 0.85; }
.mini-banner-tag { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 4px; }
.mini-banner-title { font-size: 12px; font-weight: 900; color: white; line-height: 1.25; margin-bottom: 3px; }
.mini-banner-sub { font-size: 9px; color: rgba(255,255,255,0.65); line-height: 1.3; margin-bottom: 8px; flex: 1; }
.mini-banner-btn { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); color: white; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 7px; width: fit-content; }

/* CATEGORY SECTION HEADER */
.cat-section-hdr { padding: 16px 14px 10px; display: flex; align-items: center; justify-content: space-between; }
.cat-section-title { font-size: 16px; font-weight: 800; color: #0D1B3E; display: flex; align-items: center; gap: 7px; }
.cat-section-count { font-size: 11px; color: #8A96B5; font-weight: 600; background: white; border: 1.5px solid #E4EAFF; padding: 3px 9px; border-radius: 20px; }

/* PRODUCTS GRID inside category */
.cat-products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 14px 20px; }

/* PRODUCT CARD */
.product-card { background: white; border-radius: 14px; overflow: hidden; border: 1.5px solid #E4EAFF; box-shadow: 0 2px 8px rgba(26,107,255,0.06); transition: all 0.2s; }
.product-img-wrap { height: 130px; background: linear-gradient(135deg, #EBF1FF, #DDEAFF); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.product-img { width: 100%; height: 100%; object-fit: cover; }
.product-img-placeholder { font-size: 48px; }
.low-stock-badge { position: absolute; top: 7px; left: 7px; background: #FF6B2B; color: white; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 6px; }
.out-of-stock-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.78); display: flex; align-items: center; justify-content: center; }
.out-of-stock-badge { background: white; border: 1.5px solid #E4EAFF; color: #8A96B5; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 8px; }
.product-info { padding: 10px 10px 12px; }
.product-name { font-size: 13px; font-weight: 700; color: #0D1B3E; line-height: 1.3; margin-bottom: 2px; }
.product-size-tag { font-size: 11px; color: #B0BACC; font-weight: 600; margin-bottom: 3px; }
.product-shop-tag { font-size: 10px; color: #8A96B5; font-weight: 600; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-footer { display: flex; align-items: center; justify-content: space-between; }
.product-price { font-size: 15px; font-weight: 900; color: #0D1B3E; }
.add-btn { width: 32px; height: 32px; background: #1A6BFF; border: none; border-radius: 8px; color: white; font-size: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 300; line-height: 1; transition: all 0.15s; }
.add-btn:hover { background: #1255CC; transform: scale(1.08); }
.add-btn:disabled { background: #E4EAFF; color: #B0BACC; cursor: not-allowed; transform: none; }
.qty-ctrl { display: flex; align-items: center; background: #EBF1FF; border-radius: 8px; overflow: hidden; }
.qty-btn { width: 28px; height: 32px; background: #1A6BFF; border: none; color: white; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { background: #1255CC; }
.qty-num { width: 26px; text-align: center; font-size: 13px; font-weight: 800; color: #0D1B3E; }

/* SEARCH RESULTS GRID */
.search-results { padding: 12px 14px; }
.search-label { font-size: 13px; color: #8A96B5; font-weight: 700; margin-bottom: 12px; }
.search-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* FILTER SHEET */
.filter-sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; }
.filter-sheet { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-radius: 22px 22px 0 0; padding: 20px; z-index: 201; max-height: 85vh; overflow-y: auto; }
.sheet-handle { width: 36px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 0 auto 20px; }
.sheet-title { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 16px; }
.sheet-section { margin-bottom: 20px; }
.sheet-label { font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px; }
.sheet-options { display: flex; flex-wrap: wrap; gap: 8px; }
.sheet-opt { padding: 8px 14px; border-radius: 20px; border: 1.5px solid #E4EAFF; background: white; font-size: 13px; font-weight: 700; color: #4A5880; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
.sheet-opt.active { background: #EBF1FF; color: #1A6BFF; border-color: #1A6BFF; }
.price-range { display: flex; align-items: center; gap: 10px; }
.price-input { flex: 1; padding: 10px 12px; border: 2px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 600; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
.price-input:focus { border-color: #1A6BFF; background: white; }
.sheet-actions { display: flex; gap: 10px; margin-top: 4px; }
.btn-clear { flex: 1; padding: 13px; background: #F4F6FB; color: #4A5880; border: none; border-radius: 12px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
.btn-apply { flex: 2; padding: 13px; background: #1A6BFF; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }

/* CART FLOAT */
.cart-float { position: fixed; bottom: 78px; left: 16px; right: 16px; background: #0D1B3E; color: white; border-radius: 14px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 8px 30px rgba(13,27,62,0.4); z-index: 50; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: transform 0.2s; }
.cart-float:hover { transform: translateY(-2px); }
.cart-float-left { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 500; }
.cart-float-left strong { color: white; font-size: 14px; display: block; font-weight: 800; }
.cart-float-right { font-size: 14px; font-weight: 800; color: #60A5FF; }

/* BOTTOM NAV */
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 20px; line-height: 1; }

/* SKELETON */
.skeleton { background: linear-gradient(90deg,#f0f4ff 25%,#e4eaff 50%,#f0f4ff 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.empty-state { text-align: center; padding: 60px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 14px; color: #8A96B5; }

/* HOME TAB in sidebar */
.sidebar-home { background: #1A6BFF; }
.sidebar-home .sidebar-label { color: white; }
`;

function distance(la1:number,lo1:number,la2:number,lo2:number){
  const R=6371,dLa=(la2-la1)*Math.PI/180,dLo=(lo2-lo1)*Math.PI/180;
  const a=Math.sin(dLa/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

export default function CustomerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  const [activeTab, setActiveTab] = useState("home"); // "home" or category name
  const [showFilter, setShowFilter] = useState(false);
  const [fMinPrice, setFMinPrice] = useState("");
  const [fMaxPrice, setFMaxPrice] = useState("");
  const [fShop, setFShop] = useState("");
  const [fBrand, setFBrand] = useState("");
  const [fInStock, setFInStock] = useState(true);
  const [fOrderType, setFOrderType] = useState(""); // "" | "pickup" | "delivery"
  const [applied, setApplied] = useState({ minPrice:"", maxPrice:"", shop:"", brand:"", inStock:true, orderType:"" });
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const saved = localStorage.getItem("bubbry_cart");
    if (saved) setCart(JSON.parse(saved));
    fetchCategories();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchProducts(pos.coords.latitude, pos.coords.longitude),
        () => fetchProducts()
      );
    } else fetchProducts();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("id, name, image_url").order("sort_order", { ascending: true });
    if (data && data.length > 0) setCategories(data);
  }

  async function fetchProducts(lat?: number, lng?: number) {
    setLoading(true);
    const { data: mpData } = await supabase.from("master_products").select("id, name, size, image_url, category, subcategory, brand");
    if (!mpData) { setProducts([]); setLoading(false); return; }

    const { data: spData } = await supabase.from("shop_products").select("id, price, stock, product_id, shop_id, name, size").gt("stock", 0);
    const shopIds = [...new Set((spData||[]).map((r:any) => r.shop_id).filter(Boolean))];

    // Only fetch LIVE shops
    const { data: shopData } = shopIds.length > 0
      ? await supabase.from("profiles").select("id, name, latitude, longitude, is_live, offers_delivery, offers_pickup").in("id", shopIds).eq("is_live", true)
      : { data: [] };
    const shopMap: any = {};
    (shopData||[]).forEach((s:any) => { shopMap[s.id] = s; });

    const spByProduct: Record<string, any[]> = {};
    (spData||[]).forEach((sp:any) => {
      // Only include stock from live shops
      if (!shopMap[sp.shop_id]) return;
      if (!spByProduct[sp.product_id]) spByProduct[sp.product_id] = [];
      spByProduct[sp.product_id].push(sp);
    });

    const items: any[] = mpData.map((mp:any) => {
      const shopOptions = spByProduct[mp.id] || [];
      let bestSp: any = null, bestDist = Infinity;
      shopOptions.forEach((sp:any) => {
        const shop = shopMap[sp.shop_id];
        const dist = (lat && lng && shop?.latitude && shop?.longitude)
          ? distance(lat, lng, shop.latitude, shop.longitude) : 0;
        if (!bestSp || dist < bestDist) { bestSp = { ...sp, dist, shop }; bestDist = dist; }
      });
      return {
        id: bestSp ? bestSp.id : mp.id,
        product_id: mp.id,
        name: bestSp?.name || mp.name || "Unnamed",
        size: bestSp?.size || mp.size || "",
        price: bestSp?.price ?? 0,
        stock: bestSp?.stock ?? 0,
        image_url: mp.image_url ?? "",
        category: mp.category || mp.subcategory || "Other",
        brand: mp.brand ?? "",
        shop_id: bestSp?.shop_id ?? "",
        shop_name: bestSp?.shop?.name ?? "",
        distance: bestSp?.dist ?? 0,
        inStock: !!bestSp,
        offersDelivery: bestSp?.shop?.offers_delivery ?? false,
        offersPickup: bestSp?.shop?.offers_pickup ?? true,
      };
    });

    items.sort((a, b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      return a.distance - b.distance;
    });
    setProducts(items);
    setLoading(false);
  }

  function getQty(id:string) { return cart.find((i) => i.id === id)?.quantity ?? 0; }

  function updateCart(product:any, delta:number) {
    if (!product.inStock) return;
    let updated: any[];
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      const nq = (existing.quantity ?? 1) + delta;
      updated = nq <= 0 ? cart.filter((i) => i.id !== product.id) : cart.map((i) => i.id === product.id ? {...i, quantity:nq} : i);
    } else {
      updated = [...cart, {...product, quantity:1}];
    }
    setCart(updated);
    localStorage.setItem("bubbry_cart", JSON.stringify(updated));
  }

  // Derived data
  const shops = [...new Set(products.map((p) => p.shop_name).filter(Boolean))];
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const activeFilterCount = [applied.shop, applied.brand, applied.minPrice||applied.maxPrice, applied.inStock?"y":"", applied.orderType].filter(Boolean).length;

  // Filter products
  function applyFilters(list: any[]) {
    return list.filter((p) => {
      if (applied.shop && p.shop_name !== applied.shop) return false;
      if (applied.brand && p.brand !== applied.brand) return false;
      if (applied.minPrice && p.inStock && p.price < Number(applied.minPrice)) return false;
      if (applied.maxPrice && p.inStock && p.price > Number(applied.maxPrice)) return false;
      if (applied.inStock && !p.inStock) return false;
      if (applied.orderType === "delivery" && !p.offersDelivery) return false;
      if (applied.orderType === "pickup" && !p.offersPickup) return false;
      return true;
    }).sort((a,b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "popularity") return (b.stock ?? 0) - (a.stock ?? 0);
      return a.distance - b.distance;
    });
  }

  // Products for search
  const searchResults = search.trim()
    ? applyFilters(products.filter((p) =>
        (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.brand ?? "").toLowerCase().includes(search.toLowerCase())
      ))
    : [];

  // Products grouped by category (for home view)
  const catOrder = categories.length > 0
    ? categories.map((c:any) => c.name)
    : [...new Set(products.map((p) => p.category).filter(Boolean))];

  const grouped: Record<string, any[]> = {};
  applyFilters(products).forEach((p) => {
    const c = p.category || "Other";
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push(p);
  });

  // Products for active category tab
  const tabProducts = activeTab === "home" ? [] : applyFilters(products.filter((p) => p.category === activeTab));

  const cartTotal = cart.reduce((s,i) => s + i.price * (i.quantity ?? 1), 0);
  const cartCount = cart.reduce((s,i) => s + (i.quantity ?? 1), 0);

  function switchTab(tabName: string) {
    setActiveTab(tabName);
    setSearch("");
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ProductCard({ p }: { p:any }) {
    const qty = getQty(p.id);
    return (
      <div className="product-card" style={{opacity: p.inStock ? 1 : 0.72}}>
        <div className="product-img-wrap">
          {p.image_url
            ? <img src={p.image_url} alt={p.name} className="product-img" />
            : <div className="product-img-placeholder">🛍️</div>}
          {p.inStock && p.stock > 0 && p.stock < 5 && <div className="low-stock-badge">Low Stock</div>}
          {!p.inStock && (
            <div className="out-of-stock-overlay">
              <div className="out-of-stock-badge">Out of Stock</div>
            </div>
          )}
        </div>
        <div className="product-info">
          <div className="product-name">{p.name}</div>
          {p.size && <div className="product-size-tag">{p.size}</div>}
          {p.inStock
            ? <div className="product-shop-tag">🏪 {p.shop_name}</div>
            : <div className="product-shop-tag" style={{color:"#FF6B2B"}}>Not available nearby</div>}
          <div className="product-footer">
            <div className="product-price" style={{color: p.inStock ? "#0D1B3E" : "#B0BACC"}}>
              {p.inStock ? `₹${p.price}` : "—"}
            </div>
            {p.inStock ? (
              qty === 0
                ? <button className="add-btn" onClick={() => updateCart(p, 1)}>+</button>
                : <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => updateCart(p, -1)}>−</button>
                    <div className="qty-num">{qty}</div>
                    <button className="qty-btn" onClick={() => updateCart(p, 1)}>+</button>
                  </div>
            ) : (
              <button className="add-btn" disabled>+</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Build sidebar items
  const sidebarItems = [
    { key: "home", label: "Home", img: "", icon: "🏠" },
    ...catOrder.filter((n) => grouped[n] && grouped[n].length > 0).map((name:string) => {
      const catData = categories.find((c:any) => c.name === name);
      return { key: name, label: name, img: catData?.image_url || "", icon: CAT_ICONS[name] ?? "🛍️" };
    })
  ];

  return (
    <div className="page">
      <style>{CSS}</style>

      {/* Header */}
      <div className="top-bar">
        <div className="top-bar-row1">
          <div className="brand">🫧 Bubbry</div>
          <a href="/cart" className="cart-fab">
            🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </a>
        </div>
        <div className="search-bar">
          <span style={{fontSize:16}}>🔍</span>
          <input
            placeholder="Search products, brands..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (e.target.value) setActiveTab("home"); }}
          />
          {search && <span style={{cursor:"pointer",color:"#B0BACC",fontSize:16,flexShrink:0}} onClick={() => setSearch("")}>✕</span>}
        </div>
      </div>

      {/* Sort bar */}
      <div className="sort-bar">
        <button className={`sort-chip ${sortBy==="distance"?"active":""}`} onClick={() => setSortBy("distance")}>📍 Nearest</button>
        <button className={`sort-chip ${sortBy==="price_asc"?"active":""}`} onClick={() => setSortBy("price_asc")}>₹ Low–High</button>
        <button className={`sort-chip ${sortBy==="price_desc"?"active":""}`} onClick={() => setSortBy("price_desc")}>₹ High–Low</button>
        <button className={`sort-chip ${sortBy==="popularity"?"active":""}`} onClick={() => setSortBy("popularity")}>🔥 Popular</button>
        <button className={`sort-chip ${applied.orderType==="delivery"?"active":""}`} onClick={() => {
          const next = applied.orderType === "delivery" ? "" : "delivery";
          setFOrderType(next);
          setApplied((p) => ({...p, orderType: next}));
        }}>🛵 Delivery</button>
        <button className={`sort-chip ${applied.orderType==="pickup"?"active":""}`} onClick={() => {
          const next = applied.orderType === "pickup" ? "" : "pickup";
          setFOrderType(next);
          setApplied((p) => ({...p, orderType: next}));
        }}>🏪 Pickup</button>
        <button className={`sort-chip ${activeFilterCount>0?"active":""}`} onClick={() => setShowFilter(true)}>
          🎛 Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
      </div>

      {/* Main layout */}
      <div className="main-layout" style={{paddingBottom: cartCount > 0 ? 0 : 0}}>

        {/* LEFT SIDEBAR */}
        <div className="sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
              onClick={() => switchTab(item.key)}
            >
              <div className="sidebar-img">
                {item.img
                  ? <img src={item.img} alt={item.label} onError={(e:any) => { e.target.style.display="none"; e.target.parentNode.innerHTML = `<span style='font-size:22px'>${item.icon}</span>`; }} />
                  : <span style={{fontSize:22}}>{item.icon}</span>}
              </div>
              <div className="sidebar-label">{item.key === "home" ? "Home" : item.label.replace(" & ", "\n& ").split(" ").slice(0,3).join(" ")}</div>
            </div>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="content-area" ref={contentRef} style={{paddingBottom: cartCount > 0 ? 140 : 80}}>

          {loading ? (
            <div style={{padding:14}}>
              <div className="skeleton" style={{height:130,borderRadius:18,marginBottom:14}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:200,borderRadius:14}}/>)}
              </div>
            </div>
          ) : search.trim() ? (
            /* SEARCH RESULTS */
            <div className="search-results">
              <div className="search-label">{searchResults.length} result{searchResults.length!==1?"s":""} for "{search}"</div>
              {searchResults.length === 0
                ? <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">No results</div><div className="empty-sub">Try a different search term</div></div>
                : <div className="search-grid">{searchResults.map((p) => <ProductCard key={p.product_id} p={p} />)}</div>}
            </div>
          ) : activeTab === "home" ? (
            /* HOME TAB */
            <>
              {/* Hero */}
              <div className="hero">
                <div className="hero-text">
                  <div className="hero-tag">⚡ Quick delivery</div>
                  <div className="hero-title">Daily essentials, delivered fast</div>
                  <div className="hero-sub">Get groceries from shops near you</div>
                  <button className="hero-btn" onClick={() => switchTab(catOrder[0] || "home")}>Shop Now →</button>
                </div>
                <div className="hero-icon">🛒</div>
              </div>

              {/* Mini banners */}
              <div className="mini-section">
                <div className="mini-section-title">Shop by Need</div>
                <div className="mini-banners">
                  {MINI_BANNERS.map((b,i) => (
                    <div key={i} className="mini-banner" style={{background:b.bg}} onClick={() => switchTab(b.cat)}>
                      <div>
                        <div className="mini-banner-tag">{b.tag}</div>
                        <div className="mini-banner-title">{b.title}</div>
                        <div className="mini-banner-sub">{b.sub}</div>
                        <div className="mini-banner-btn">Order Now</div>
                      </div>
                      <div className="mini-banner-emoji">{b.emoji}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Each category section with 2-col grid */}
              {catOrder.filter((cat:string) => grouped[cat]?.length > 0).map((cat:string) => {
                const items = grouped[cat] || [];
                const inStockCount = items.filter((p:any) => p.inStock).length;
                return (
                  <div key={cat} id={`cat-${cat}`}>
                    <div className="cat-section-hdr">
                      <div className="cat-section-title">
                        <span>{CAT_ICONS[cat] ?? "🛍️"}</span>
                        <span>{cat}</span>
                      </div>
                      <div className="cat-section-count">{inStockCount} in stock</div>
                    </div>
                    <div className="cat-products-grid">
                      {items.map((p:any) => <ProductCard key={p.product_id} p={p} />)}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            /* CATEGORY TAB */
            <>
              <div className="cat-section-hdr">
                <div className="cat-section-title">
                  <span>{CAT_ICONS[activeTab] ?? "🛍️"}</span>
                  <span>{activeTab}</span>
                </div>
                <div className="cat-section-count">
                  {tabProducts.filter((p:any) => p.inStock).length} in stock · {tabProducts.length} total
                </div>
              </div>
              {tabProducts.length === 0
                ? <div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">No products here yet</div><div className="empty-sub">Shops haven't added products in this category</div></div>
                : <div className="cat-products-grid">{tabProducts.map((p:any) => <ProductCard key={p.product_id} p={p} />)}</div>}
            </>
          )}
        </div>
      </div>

      {/* Filter sheet */}
      {showFilter && (
        <>
          <div className="filter-sheet-overlay" onClick={() => setShowFilter(false)} />
          <div className="filter-sheet">
            <div className="sheet-handle" />
            <div className="sheet-title">Filter Products</div>
            {shops.length > 1 && (
              <div className="sheet-section">
                <div className="sheet-label">Shop</div>
                <div className="sheet-options">
                  <div className={`sheet-opt ${fShop===""?"active":""}`} onClick={() => setFShop("")}>All Shops</div>
                  {shops.map((s) => <div key={s} className={`sheet-opt ${fShop===s?"active":""}`} onClick={() => setFShop(s)}>{s}</div>)}
                </div>
              </div>
            )}
            {brands.length > 0 && (
              <div className="sheet-section">
                <div className="sheet-label">Brand</div>
                <div className="sheet-options">
                  <div className={`sheet-opt ${fBrand===""?"active":""}`} onClick={() => setFBrand("")}>All Brands</div>
                  {brands.map((b) => <div key={b} className={`sheet-opt ${fBrand===b?"active":""}`} onClick={() => setFBrand(b)}>{b}</div>)}
                </div>
              </div>
            )}
            <div className="sheet-section">
              <div className="sheet-label">Price Range (₹)</div>
              <div className="price-range">
                <input className="price-input" placeholder="Min" type="number" value={fMinPrice} onChange={(e) => setFMinPrice(e.target.value)} />
                <span style={{color:"#B0BACC",fontWeight:700}}>–</span>
                <input className="price-input" placeholder="Max" type="number" value={fMaxPrice} onChange={(e) => setFMaxPrice(e.target.value)} />
              </div>
            </div>
            <div className="sheet-section">
              <div className="sheet-label">Availability</div>
              <div className="sheet-options">
                <div className={`sheet-opt ${fInStock?"active":""}`} onClick={() => setFInStock(true)}>✅ In Stock Only</div>
                <div className={`sheet-opt ${!fInStock?"active":""}`} onClick={() => setFInStock(false)}>All Products</div>
              </div>
            </div>
            <div className="sheet-actions">
              <button className="btn-clear" onClick={() => {
                setFShop(""); setFBrand(""); setFMinPrice(""); setFMaxPrice(""); setFInStock(false);
                setApplied({ minPrice:"", maxPrice:"", shop:"", brand:"", inStock:false });
                setShowFilter(false);
              }}>Clear All</button>
              <button className="btn-apply" onClick={() => {
                setApplied({ shop:fShop, brand:fBrand, minPrice:fMinPrice, maxPrice:fMaxPrice, inStock:fInStock, orderType:fOrderType });
                setShowFilter(false);
              {/* Order type filter */}
              <div style={{marginBottom:18}}>
                <div className="sheet-section-label">Order Type</div>
                <div className="sheet-opts-row">
                  <div className={`sheet-opt ${fOrderType===""?"active":""}`} onClick={() => setFOrderType("")}>All</div>
                  <div className={`sheet-opt ${fOrderType==="delivery"?"active":""}`} onClick={() => setFOrderType("delivery")}>🛵 Delivery</div>
                  <div className={`sheet-opt ${fOrderType==="pickup"?"active":""}`} onClick={() => setFOrderType("pickup")}>🏪 Pickup</div>
                </div>
              </div>
              }}>Apply Filters</button>
            </div>
          </div>
        </>
      )}

      {/* Floating cart */}
      {cartCount > 0 && (
        <a href="/cart" className="cart-float">
          <div className="cart-float-left">
            {cartCount} item{cartCount!==1?"s":""} in cart
            <strong>₹{cartTotal.toFixed(0)}</strong>
          </div>
          <div className="cart-float-right">View Cart →</div>
        </a>
      )}

      <nav className="bottom-nav">
        <a href="/customer-dashboard" className="nav-item active"><div className="nav-icon">🏠</div>Home</a>
        <a href="/cart" className="nav-item"><div className="nav-icon">🛒</div>Cart</a>
        <a href="/my-orders" className="nav-item"><div className="nav-icon">📦</div>Orders</a>
      </nav>
    </div>
  );
}
