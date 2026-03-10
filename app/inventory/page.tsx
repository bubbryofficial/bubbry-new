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
.top-bar { background: #1A6BFF; padding: 16px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; flex-shrink: 0; }
.page-title { font-size: 18px; font-weight: 800; color: white; }

.content { padding: 16px; max-width: 480px; margin: 0 auto; }

.inv-card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.inv-img { width: 100%; height: 140px; object-fit: cover; background: #EBF1FF; display: flex; align-items: center; justify-content: center; font-size: 48px; }
.inv-body { padding: 14px 16px; }
.inv-name { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.inv-stats { display: flex; gap: 12px; margin-bottom: 14px; }
.inv-stat { padding: 6px 12px; border-radius: 10px; }
.inv-stat-price { background: #EBF1FF; color: #1A6BFF; }
.inv-stat-stock { background: #E6FAF4; color: #00875A; }
.inv-stat-low { background: #FFF8E6; color: #946200; }
.inv-stat-val { font-size: 15px; font-weight: 900; }
.inv-stat-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; opacity: 0.7; }

.update-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.update-field label { display: block; font-size: 10px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.update-field input { width: 100%; padding: 10px 12px; border: 2px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 600; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.update-field input:focus { border-color: #1A6BFF; background: white; box-shadow: 0 0 0 3px rgba(26,107,255,0.1); }

.del-btn { width: 100%; padding: 11px; background: #FFF0F0; color: #F03D3D; border: 1.5px solid #FFD6D6; border-radius: 12px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.del-btn:hover { background: #FFEAEA; }

.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 8px; }
.empty-sub { font-size: 14px; color: #8A96B5; margin-bottom: 24px; }
.add-link { display: inline-block; padding: 14px 28px; background: #1A6BFF; color: white; border-radius: 14px; font-size: 15px; font-weight: 800; text-decoration: none; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInventory(); }, []);

  async function fetchInventory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("shop_products")
      .select(`id, price, stock, master_products(name, image_url)`)
      .eq("shop_id", user.id);
    if (error) console.log(error);
    setProducts(data || []);
    setLoading(false);
  }

  async function updateStock(id: number, val: string) {
    const n = Number(val);
    if (!val || isNaN(n)) return;
    await supabase.from("shop_products").update({ stock: n }).eq("id", id);
    fetchInventory();
  }

  async function updatePrice(id: number, val: string) {
    const n = Number(val);
    if (!val || isNaN(n)) return;
    await supabase.from("shop_products").update({ price: n }).eq("id", id);
    fetchInventory();
  }

  async function deleteProduct(id: number) {
    if (!confirm("Remove this product from your shop?")) return;
    await supabase.from("shop_products").delete().eq("id", id);
    fetchInventory();
  }

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <a href="/shop-dashboard" className="back-btn">←</a>
        <div className="page-title">Inventory 📦</div>
      </div>

      <div className="content">
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#8A96B5", fontWeight: 600 }}>Loading inventory...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">No products yet</div>
            <div className="empty-sub">Add products from the catalog to get started</div>
            <a href="/add-product" className="add-link">Add Products</a>
          </div>
        ) : (
          products.map((item) => (
            <div key={item.id} className="inv-card">
              {item.master_products?.image_url ? (
                <img src={item.master_products.image_url} alt={item.master_products?.name} className="inv-img" style={{ display: "block" }} />
              ) : (
                <div className="inv-img">🛍️</div>
              )}
              <div className="inv-body">
                <div className="inv-name">{item.master_products?.name ?? "Unnamed"}</div>
                <div className="inv-stats">
                  <div className={`inv-stat inv-stat-price`}>
                    <div className="inv-stat-val">₹{item.price}</div>
                    <div className="inv-stat-lbl">Price</div>
                  </div>
                  <div className={`inv-stat ${(item.stock ?? 0) < 5 ? "inv-stat-low" : "inv-stat-stock"}`}>
                    <div className="inv-stat-val">{item.stock ?? 0}</div>
                    <div className="inv-stat-lbl">{(item.stock ?? 0) < 5 ? "Low Stock!" : "In Stock"}</div>
                  </div>
                </div>

                <div className="update-row">
                  <div className="update-field">
                    <label>New Price (₹)</label>
                    <input
                      type="number"
                      placeholder={`${item.price}`}
                      min="0"
                      onBlur={(e) => updatePrice(item.id, e.target.value)}
                    />
                  </div>
                  <div className="update-field">
                    <label>New Stock</label>
                    <input
                      type="number"
                      placeholder={`${item.stock}`}
                      min="0"
                      onBlur={(e) => updateStock(item.id, e.target.value)}
                    />
                  </div>
                </div>

                <button className="del-btn" onClick={() => deleteProduct(item.id)}>
                  🗑️ Remove from Shop
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item"><div className="nav-icon">➕</div>Add</a>
        <a href="/inventory" className="nav-item active"><div className="nav-icon">📦</div>Inventory</a>
        <a href="/shop-orders" className="nav-item"><div className="nav-icon">📋</div>Orders</a>
      </nav>
    </div>
  );
}
