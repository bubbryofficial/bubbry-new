"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }

.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 80px; }

.top-bar {
  background: #1A6BFF;
  padding: 16px 20px 20px;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px rgba(26,107,255,0.25);
}
.top-bar-row1 { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.brand { font-size: 24px; font-weight: 900; color: white; letter-spacing: -1px; }
.cart-fab {
  display: flex; align-items: center; gap: 6px;
  background: white; color: #1A6BFF; padding: 8px 14px;
  border-radius: 12px; font-size: 13px; font-weight: 800;
  text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.cart-badge {
  background: #FF6B2B; color: white; font-size: 11px; font-weight: 800;
  width: 18px; height: 18px; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; margin-left: 2px;
}
.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: white; border-radius: 12px; padding: 11px 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.search-bar input {
  border: none; outline: none; font-size: 14px; font-weight: 500;
  color: #0D1B3E; background: transparent; width: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.search-bar input::placeholder { color: #B0BACC; }

.location-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9);
  padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
  margin-bottom: 10px;
}

.section-title {
  font-size: 17px; font-weight: 800; color: #0D1B3E;
  padding: 20px 16px 12px; letter-spacing: -0.3px;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 16px;
}

.product-card {
  background: white; border-radius: 16px;
  overflow: hidden; cursor: pointer;
  box-shadow: 0 2px 10px rgba(26,107,255,0.07);
  border: 1.5px solid #E4EAFF;
  transition: all 0.2s;
  position: relative;
}
.product-card:active { transform: scale(0.97); }

.product-img-wrap {
  height: 130px; background: linear-gradient(135deg, #EBF1FF, #DDEAFF);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.product-img { width: 100%; height: 100%; object-fit: cover; }
.product-img-placeholder { font-size: 48px; }

.product-info { padding: 10px 12px 12px; }
.product-name { font-size: 13px; font-weight: 700; color: #0D1B3E; margin-bottom: 2px; line-height: 1.3; }
.product-shop { font-size: 11px; color: #8A96B5; font-weight: 500; margin-bottom: 4px; }
.product-size { font-size: 11px; color: #B0BACC; font-weight: 600; margin-bottom: 6px; }
.product-dist { font-size: 11px; color: #00B37E; font-weight: 600; }
.product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
.product-price { font-size: 15px; font-weight: 900; color: #0D1B3E; }

.add-btn {
  width: 32px; height: 32px; background: #1A6BFF; border: none;
  border-radius: 10px; color: white; font-size: 20px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-weight: 400; line-height: 1;
  transition: all 0.15s;
}
.add-btn:hover { background: #1255CC; transform: scale(1.1); }

.qty-ctrl {
  display: flex; align-items: center; gap: 0;
  background: #EBF1FF; border-radius: 10px; overflow: hidden;
}
.qty-btn {
  width: 28px; height: 32px; background: #1A6BFF; border: none;
  color: white; font-size: 16px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: background 0.15s;
}
.qty-btn:hover { background: #1255CC; }
.qty-num { width: 28px; text-align: center; font-size: 13px; font-weight: 800; color: #0D1B3E; }

.empty-state { text-align: center; padding: 60px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 14px; color: #8A96B5; font-weight: 500; }

.cart-float {
  position: fixed; bottom: 86px; left: 16px; right: 16px;
  background: #0D1B3E; color: white; border-radius: 16px;
  padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; box-shadow: 0 8px 30px rgba(13,27,62,0.4); z-index: 50;
  text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: transform 0.2s;
}
.cart-float:hover { transform: translateY(-2px); }
.cart-float-left { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }
.cart-float-left strong { color: white; font-size: 15px; display: block; font-weight: 800; }
.cart-float-right { font-size: 15px; font-weight: 800; color: #1A6BFF; }

.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; height: 70px;
  background: white; border-top: 1.5px solid #E4EAFF;
  display: flex; align-items: center;
  box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100;
}
.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC;
  font-size: 10px; font-weight: 700; letter-spacing: 0.3px; transition: color 0.15s;
}
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }

.skeleton { background: linear-gradient(90deg, #f0f4ff 25%, #e4eaff 50%, #f0f4ff 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

export default function CustomerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("bubbry_cart");
    if (saved) setCart(JSON.parse(saved));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchProducts(pos.coords.latitude, pos.coords.longitude),
        () => fetchProducts()
      );
    } else {
      fetchProducts();
    }
  }, []);

  function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function fetchProducts(userLat?: number, userLng?: number) {
    setLoading(true);

    // Step 1: fetch all shop_products with stock > 0
    const { data: spData, error: spError } = await supabase
      .from("shop_products")
      .select("id, price, stock, product_id, shop_id, name, size")
      .gt("stock", 0);

    console.log("shop_products data:", spData, "error:", spError);
    if (spError) { console.log("shop_products error:", spError); setLoading(false); return; }
    if (!spData || spData.length === 0) {
      console.log("No products found in shop_products with stock > 0");
      setProducts([]); setLoading(false); return;
    }

    // Step 2: fetch images from master_products
    const productIds = [...new Set(spData.map((r: any) => r.product_id).filter(Boolean))];
    const { data: mpData } = productIds.length > 0
      ? await supabase.from("master_products").select("id, image_url").in("id", productIds)
      : { data: [] };
    const mpMap: any = {};
    (mpData || []).forEach((mp: any) => { mpMap[mp.id] = mp; });

    // Step 3: fetch shop profiles
    const shopIds = [...new Set(spData.map((r: any) => r.shop_id).filter(Boolean))];
    const { data: shopData } = shopIds.length > 0
      ? await supabase.from("profiles").select("id, name, latitude, longitude").in("id", shopIds)
      : { data: [] };
    const shopMap: any = {};
    (shopData || []).forEach((s: any) => { shopMap[s.id] = s; });

    // Step 4: assemble items
    const items: any[] = [];
    spData.forEach((row: any) => {
      const shop = shopMap[row.shop_id];
      if (!shop) return;
      const dist = (userLat && userLng && shop.latitude && shop.longitude)
        ? distance(userLat, userLng, shop.latitude, shop.longitude) : 0;
      items.push({
        id: row.id,
        product_id: row.product_id,
        name: row.name ?? "Unnamed",
        size: row.size ?? "",
        price: row.price,
        image_url: mpMap[row.product_id]?.image_url ?? "",
        shop_id: row.shop_id,
        shop_name: shop.name ?? "Shop",
        distance: dist,
      });
    });

    items.sort((a, b) => a.distance - b.distance);
    setProducts(items);
    setLoading(false);
  }

  function getQty(id: string) {
    return cart.find((i) => i.id === id)?.quantity ?? 0;
  }

  function updateCart(product: any, delta: number) {
    let updated: any[];
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      const newQty = (existing.quantity ?? 1) + delta;
      if (newQty <= 0) {
        updated = cart.filter((i) => i.id !== product.id);
      } else {
        updated = cart.map((i) => i.id === product.id ? { ...i, quantity: newQty } : i);
      }
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updated);
    localStorage.setItem("bubbry_cart", JSON.stringify(updated));
  }

  const filtered = products.filter((p) => (p.name ?? "").toLowerCase().includes(search.toLowerCase()));
  const cartTotal = cart.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);
  const cartCount = cart.reduce((s, i) => s + (i.quantity ?? 1), 0);

  return (
    <div className="page">
      <style>{CSS}</style>

      {/* Header */}
      <div className="top-bar">
        <div className="top-bar-row1">
          <div className="brand">🫧 Bubbry</div>
          <a href="/cart" className="cart-fab">
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </a>
        </div>
        <div className="location-chip">📍 Nearby shops</div>
        <div className="search-bar">
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            placeholder="Search products, shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="products-grid" style={{ marginTop: 20 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid #E4EAFF" }}>
              <div className="skeleton" style={{ height: 130 }} />
              <div style={{ padding: 12 }}>
                <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{search ? "🔍" : "📦"}</div>
          <div className="empty-title">{search ? "No results found" : "No products nearby"}</div>
          <div className="empty-sub">{search ? "Try a different search" : "Shops will appear here when they add products"}</div>
        </div>
      ) : (
        <>
          <div className="section-title">
            {search ? `Results for "${search}"` : "Products near you"} ({filtered.length})
          </div>
          <div className="products-grid">
            {filtered.map((product) => {
              const qty = getQty(product.id);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-img-wrap">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="product-img" />
                    ) : (
                      <div className="product-img-placeholder">🛍️</div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    {product.size && <div className="product-size">{product.size}</div>}
                    <div className="product-shop">🏪 {product.shop_name}</div>
                    {product.distance > 0 && (
                      <div className="product-dist">📍 {product.distance.toFixed(1)} km</div>
                    )}
                    <div className="product-footer">
                      <div className="product-price">₹{product.price}</div>
                      {qty === 0 ? (
                        <button className="add-btn" onClick={() => updateCart(product, 1)}>+</button>
                      ) : (
                        <div className="qty-ctrl">
                          <button className="qty-btn" onClick={() => updateCart(product, -1)}>−</button>
                          <div className="qty-num">{qty}</div>
                          <button className="qty-btn" onClick={() => updateCart(product, 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Floating cart bar */}
      {cart.length > 0 && (
        <a href="/cart" className="cart-float">
          <div className="cart-float-left">
            {cartCount} item{cartCount > 1 ? "s" : ""} in cart
            <strong>₹{cartTotal.toFixed(0)}</strong>
          </div>
          <div className="cart-float-right">View Cart →</div>
        </a>
      )}

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <a href="/customer-dashboard" className="nav-item active">
          <div className="nav-icon">🏠</div>Home
        </a>
        <a href="/cart" className="nav-item">
          <div className="nav-icon">🛒</div>Cart
        </a>
        <a href="/my-orders" className="nav-item">
          <div className="nav-icon">📦</div>Orders
        </a>
      </nav>
    </div>
  );
}
