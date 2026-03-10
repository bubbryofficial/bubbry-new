"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 90px; }
.top-bar { background: #1A6BFF; padding: 16px 20px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); }
.top-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; flex-shrink: 0; }
.page-title { font-size: 18px; font-weight: 800; color: white; }
.search-bar { display: flex; align-items: center; gap: 10px; background: white; border-radius: 12px; padding: 12px 14px; }
.search-bar input { border: none; outline: none; font-size: 15px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
.search-bar input::placeholder { color: #B0BACC; }

.content { padding: 16px; max-width: 480px; margin: 0 auto; }
.results-label { font-size: 12px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }

.product-row { background: white; border-radius: 14px; border: 1.5px solid #E4EAFF; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(26,107,255,0.05); }
.product-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.product-img { width: 54px; height: 54px; border-radius: 10px; object-fit: cover; flex-shrink: 0; background: #EBF1FF; display: flex; align-items: center; justify-content: center; font-size: 24px; overflow: hidden; }
.product-details { flex: 1; }
.product-name { font-size: 14px; font-weight: 800; color: #0D1B3E; margin-bottom: 3px; line-height: 1.3; }
.product-cat { font-size: 11px; color: #8A96B5; font-weight: 600; padding: 2px 8px; background: #EBF1FF; color: #1A6BFF; border-radius: 20px; display: inline-block; }
.product-size { font-size: 12px; color: #8A96B5; font-weight: 600; margin-top: 3px; }

.input-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: end; }
.mini-field { }
.mini-label { font-size: 10px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.mini-input { width: 100%; padding: 10px 12px; border: 2px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 600; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.mini-input:focus { border-color: #1A6BFF; background: white; }
.add-btn { padding: 10px 16px; background: #1A6BFF; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
.add-btn:hover { background: #1255CC; }
.add-btn.added { background: #00B37E; }

.loading-state { text-align: center; padding: 40px 24px; color: #8A96B5; font-weight: 600; }
.empty-state { text-align: center; padding: 60px 24px; }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-title { font-size: 17px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 13px; color: #8A96B5; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

export default function AddProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceMap, setPriceMap] = useState<Record<string, string>>({});
  const [stockMap, setStockMap] = useState<Record<string, string>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function fetchProducts() {
    setLoading(true);
    let query = supabase.from("master_products").select("*").limit(50);
    if (search.trim()) {
      query = supabase.from("master_products").select("*").ilike("name", `%${search}%`).limit(50);
    }
    const { data, error } = await query;
    if (error) console.log(error);
    setProducts(data || []);
    setLoading(false);
  }

  async function addProduct(product: any) {
    const price = priceMap[product.id];
    const stock = stockMap[product.id];
    if (!price || !stock) { alert("Enter price and stock"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Login first"); return; }
    const { error } = await supabase.from("shop_products").upsert({
      shop_id: user.id,
      product_id: product.id,
      price: Number(price),
      stock: Number(stock),
      name: product.name ?? "",
      size: product.size ?? "",
    });
    if (error) { alert(error.message); return; }
    setAddedMap((p) => ({ ...p, [product.id]: true }));
    setTimeout(() => setAddedMap((p) => ({ ...p, [product.id]: false })), 2500);
    setPriceMap((p) => ({ ...p, [product.id]: "" }));
    setStockMap((p) => ({ ...p, [product.id]: "" }));
  }

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <div className="top-row">
          <a href="/shop-dashboard" className="back-btn">←</a>
          <div className="page-title">Add Products</div>
        </div>
        <div className="search-bar">
          <span style={{ fontSize: 16 }}>🔍</span>
          <input placeholder="Search product catalog..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="loading-state">Searching products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No products found</div>
            <div className="empty-sub">Try a different search term</div>
          </div>
        ) : (
          <>
            <div className="results-label">{products.length} products found</div>
            {products.map((product) => (
              <div key={product.id} className="product-row">
                <div className="product-top">
                  <div className="product-img">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : "🛍️"}
                  </div>
                  <div className="product-details">
                    <div className="product-name">{product.name ?? "Unnamed"}</div>
                    {product.size && <div className="product-size">{product.size}</div>}
                    {product.category && <span className="product-cat">{product.category}</span>}
                  </div>
                </div>
                <div className="input-row">
                  <div className="mini-field">
                    <div className="mini-label">Price (₹)</div>
                    <input
                      className="mini-input"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      value={priceMap[product.id] ?? ""}
                      onChange={(e) => setPriceMap((p) => ({ ...p, [product.id]: e.target.value }))}
                    />
                  </div>
                  <div className="mini-field">
                    <div className="mini-label">Stock</div>
                    <input
                      className="mini-input"
                      placeholder="0"
                      type="number"
                      min="0"
                      value={stockMap[product.id] ?? ""}
                      onChange={(e) => setStockMap((p) => ({ ...p, [product.id]: e.target.value }))}
                    />
                  </div>
                  <button
                    className={`add-btn ${addedMap[product.id] ? "added" : ""}`}
                    onClick={() => addProduct(product)}
                  >
                    {addedMap[product.id] ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item active"><div className="nav-icon">➕</div>Add</a>
        <a href="/inventory" className="nav-item"><div className="nav-icon">📦</div>Inventory</a>
        <a href="/shop-orders" className="nav-item"><div className="nav-icon">📋</div>Orders</a>
      </nav>
    </div>
  );
}
