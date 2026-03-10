"use client";

import { useState, useEffect } from "react";
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

.filter-tabs { background: white; display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1.5px solid #E4EAFF; overflow-x: auto; }
.filter-chip { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1.5px solid #E4EAFF; background: white; color: #8A96B5; cursor: pointer; white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
.filter-chip.active { background: #1A6BFF; color: white; border-color: #1A6BFF; }

.content { padding: 14px; max-width: 480px; margin: 0 auto; }

.order-card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.order-hdr { padding: 12px 16px; border-bottom: 1px solid #F4F6FB; display: flex; align-items: center; justify-content: space-between; }
.order-id { font-size: 12px; color: #8A96B5; font-weight: 700; font-family: monospace; }
.order-time { font-size: 11px; color: #B0BACC; }
.order-body { padding: 14px 16px; }
.order-product { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.order-detail { font-size: 13px; color: #4A5880; font-weight: 500; margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
.order-price { font-size: 15px; font-weight: 900; color: #1A6BFF; margin: 8px 0 12px; }
.addr-box { background: #F4F6FB; border-radius: 10px; padding: 10px 12px; font-size: 13px; color: #4A5880; font-weight: 500; margin-bottom: 12px; }

.type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.type-pickup { background: #EBF1FF; color: #1A6BFF; }
.type-delivery { background: #FFF8E6; color: #946200; }

.status-pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.s-pending { background: #FFF8E6; color: #946200; }
.s-ready { background: #E6FAF4; color: #00875A; }
.s-completed { background: #F0F2F8; color: #4A5880; }

.action-row { display: flex; gap: 8px; }
.action-btn { flex: 1; padding: 11px; border: none; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.btn-ready { background: #1A6BFF; color: white; }
.btn-ready:hover { background: #1255CC; }
.btn-done { background: #E6FAF4; color: #00875A; }
.btn-done:hover { background: #C3F0DC; }
.btn-disabled { background: #F4F6FB; color: #B0BACC; cursor: default; }

.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 14px; color: #8A96B5; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

const FILTERS = ["all", "pending", "ready", "completed"];

export default function ShopOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("id, quantity, order_type, delivery_address, status, created_at, product_id, shop_id")
      .eq("shop_id", user.id)
      .order("created_at", { ascending: false });

    if (error) { console.log(error); setLoading(false); return; }
    if (!ordersData || ordersData.length === 0) { setOrders([]); setLoading(false); return; }

    // Fetch product names/prices from shop_products
    const productIds = [...new Set(ordersData.map((o: any) => o.product_id).filter(Boolean))];
    const { data: spData } = productIds.length > 0
      ? await supabase.from("shop_products").select("product_id, shop_id, name, price").in("product_id", productIds)
      : { data: [] };

    const spMap: any = {};
    (spData || []).forEach((sp: any) => { spMap[sp.product_id + "_" + sp.shop_id] = sp; });

    const enriched = ordersData.map((order: any) => {
      const sp = spMap[order.product_id + "_" + order.shop_id] || {};
      return { ...order, product_name: sp.name ?? "Product", product_price: sp.price ?? 0 };
    });

    setOrders(enriched);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);

    // Deduct stock when order is marked as completed
    if (status === "completed") {
      const order = orders.find((o) => o.id === id);
      if (order) {
        const { data: sp } = await supabase
          .from("shop_products")
          .select("id, stock")
          .eq("product_id", order.product_id)
          .eq("shop_id", order.shop_id)
          .single();
        if (sp) {
          const newStock = Math.max(0, (sp.stock ?? 0) - (order.quantity ?? 1));
          await supabase.from("shop_products").update({ stock: newStock }).eq("id", sp.id);
        }
      }
    }

    fetchOrders();
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <a href="/shop-dashboard" className="back-btn">←</a>
        <div className="page-title">Orders 📋</div>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? `All (${orders.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="content">
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#8A96B5", fontWeight: 600 }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No {filter !== "all" ? filter : ""} orders</div>
            <div className="empty-sub">Orders from customers will appear here</div>
          </div>
        ) : (
          filtered.map((order) => {
            const status = order.status ?? "pending";
            return (
              <div key={order.id} className="order-card">
                <div className="order-hdr">
                  <div className="order-id">#{order.id.slice(0, 8).toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className={`type-badge ${order.order_type === "delivery" ? "type-delivery" : "type-pickup"}`}>
                      {order.order_type === "delivery" ? "🛵" : "🏃"} {order.order_type}
                    </span>
                    <span className="order-time">{timeAgo(order.created_at)}</span>
                  </div>
                </div>
                <div className="order-body">
                  <div className="order-product">{order.product_name ?? "Product"}</div>
                  <div className="order-detail">
                    <span>Qty: {order.quantity}</span>
                    <span>·</span>
                    <span className={`status-pill ${status === "pending" ? "s-pending" : status === "ready" ? "s-ready" : "s-completed"}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="order-price">₹{(order.product_price ?? 0) * order.quantity}</div>

                  {order.order_type === "delivery" && order.delivery_address && (
                    <div className="addr-box">📍 {order.delivery_address}</div>
                  )}

                  <div className="action-row">
                    {status === "pending" && (
                      <>
                        <button className="action-btn btn-ready" onClick={() => updateStatus(order.id, "ready")}>
                          Mark Ready ⭐
                        </button>
                        <button className="action-btn btn-done" onClick={() => updateStatus(order.id, "completed")}>
                          Complete ✓
                        </button>
                      </>
                    )}
                    {status === "ready" && (
                      <button className="action-btn btn-done" onClick={() => updateStatus(order.id, "completed")}>
                        Mark Completed ✓
                      </button>
                    )}
                    {status === "completed" && (
                      <button className="action-btn btn-disabled" disabled>Order Completed</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item"><div className="nav-icon">➕</div>Add</a>
        <a href="/inventory" className="nav-item"><div className="nav-icon">📦</div>Inventory</a>
        <a href="/shop-orders" className="nav-item active"><div className="nav-icon">📋</div>Orders</a>
      </nav>
    </div>
  );
}
