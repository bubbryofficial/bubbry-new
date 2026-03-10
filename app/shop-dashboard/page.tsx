"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import BarcodeScanner from "@/components/BarcodeScanner";

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
  background: #1A6BFF; padding: 16px 20px 20px; position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px rgba(26,107,255,0.25);
}
.top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.brand { font-size: 20px; font-weight: 900; color: white; letter-spacing: -0.5px; }
.orders-link { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.28); color: white; padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
.orders-link:hover { background: rgba(255,255,255,0.28); }

.stats-row { display: flex; gap: 10px; }
.stat-chip { flex: 1; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 10px 12px; }
.stat-val { font-size: 20px; font-weight: 900; color: white; line-height: 1; }
.stat-lbl { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.4px; }

.tab-bar { background: white; display: flex; border-bottom: 2px solid #E4EAFF; }
.tab { flex: 1; padding: 14px 12px; font-size: 13px; font-weight: 700; color: #B0BACC; background: none; border: none; border-bottom: 3px solid transparent; margin-bottom: -2px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.tab.active { color: #1A6BFF; border-bottom-color: #1A6BFF; }

.content { padding: 16px; max-width: 480px; margin: 0 auto; }

.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; overflow: hidden; margin-bottom: 14px; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.card-hdr { padding: 14px 16px; border-bottom: 1px solid #F4F6FB; display: flex; align-items: center; gap: 10px; }
.card-hdr-icon { width: 34px; height: 34px; border-radius: 10px; background: #EBF1FF; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.card-hdr-title { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.card-hdr-sub { font-size: 11px; color: #8A96B5; font-weight: 500; }
.card-body { padding: 16px; }

.scanner-zone { background: linear-gradient(135deg, #EBF1FF, #DDEAFF); border: 2px dashed #1A6BFF; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 18px; }
.scan-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; color: white; }
.scan-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.scan-hint { font-size: 12px; color: #1A6BFF; font-weight: 600; margin-top: 10px; }
.scanned-badge { display: flex; align-items: center; gap: 8px; background: #E6FAF4; border: 1.5px solid #00B37E; border-radius: 10px; padding: 10px 14px; margin-top: 12px; }
.scanned-text { font-size: 13px; font-weight: 700; color: #00875A; }
.scanned-code { font-size: 11px; color: #00B37E; font-weight: 600; font-family: monospace; }

.toast { display: flex; align-items: center; gap: 8px; background: #E6FAF4; border-left: 4px solid #00B37E; border-radius: 10px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; font-weight: 700; color: #00875A; }

.field { margin-bottom: 14px; }
.field-label { display: block; font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
.field-input { width: 100%; padding: 13px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.field-input:focus { border-color: #1A6BFF; background: white; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.field-input.has-val { border-color: #1A6BFF; }
.fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.prefix-wrap { position: relative; }
.prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; font-weight: 800; color: #8A96B5; pointer-events: none; }
.field-input.prefixed { padding-left: 28px; }

.submit-btn { width: 100%; padding: 15px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; }
.submit-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.submit-btn.success { background: #00B37E; }

.search-bar { display: flex; align-items: center; gap: 10px; background: white; border: 2px solid #E4EAFF; border-radius: 12px; padding: 11px 14px; margin-bottom: 14px; }
.search-bar input { border: none; outline: none; font-size: 14px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
.search-bar input::placeholder { color: #B0BACC; }

.prod-card { background: white; border-radius: 14px; border: 1.5px solid #E4EAFF; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 6px rgba(26,107,255,0.05); transition: all 0.2s; }
.prod-card:hover { border-color: #1A6BFF; transform: translateY(-1px); }
.prod-icon { width: 46px; height: 46px; border-radius: 10px; background: linear-gradient(135deg, #EBF1FF, #DDEAFF); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.prod-info { flex: 1; }
.prod-name { font-size: 14px; font-weight: 700; color: #0D1B3E; margin-bottom: 3px; }
.prod-meta { display: flex; gap: 8px; align-items: center; }
.prod-price { font-size: 15px; font-weight: 900; color: #1A6BFF; }
.stock-badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.stock-ok { background: #E6FAF4; color: #00875A; }
.stock-low { background: #FFF8E6; color: #946200; }

.empty-state { text-align: center; padding: 50px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 10px; }
.empty-title { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.empty-sub { font-size: 13px; color: #8A96B5; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; letter-spacing: 0.3px; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }

.scanner-wrap { margin-top: 14px; border-radius: 12px; overflow: hidden; }
.del-btn { width: 100%; padding: 9px; background: #FFF0F0; color: #F03D3D; border: 1.5px solid #FFD6D6; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; margin-top: 8px; }
.del-btn:hover { background: #FFEAEA; border-color: #F03D3D; }

.autocomplete-wrap { position: relative; }
.suggestions-dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: white; border: 2px solid #1A6BFF; border-radius: 12px;
  box-shadow: 0 8px 30px rgba(26,107,255,0.15); z-index: 200;
  overflow: hidden; max-height: 240px; overflow-y: auto;
}
.suggestion-item {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px; cursor: pointer; transition: background 0.15s;
  border-bottom: 1px solid #F4F6FB;
}
.suggestion-item:last-child { border-bottom: none; }
.suggestion-item:hover { background: #EBF1FF; }
.suggestion-item:active { background: #DDEAFF; }
.suggestion-icon { font-size: 18px; flex-shrink: 0; }
.suggestion-name { font-size: 13px; font-weight: 700; color: #0D1B3E; line-height: 1.3; }
.suggestion-meta { font-size: 11px; color: #8A96B5; font-weight: 500; margin-top: 1px; }
.suggestion-loading { padding: 14px; text-align: center; font-size: 13px; color: #8A96B5; font-weight: 600; }
`;

export default function ShopDashboard() {
  const [name, setName] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "searching" | "found" | "notfound">("idle");
  const [activeTab, setActiveTab] = useState<"add" | "inventory">("add");
  const [loading, setLoading] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
  const suggestionDebounce = useRef<any>(null);

  useEffect(() => {
    saveShopLocation();
    fetchProducts();
  }, []);

  async function searchByBarcode(barcode: string) {
    setScanStatus("searching");

    // 1. Try Supabase master_products first
    const { data } = await supabase
      .from("master_products")
      .select("*")
      .eq("barcode", barcode)
      .single();

    if (data?.name) {
      setName(data.name);
      setSize(data.size ?? "");
      setSelectedProductId(data.id ?? null);
      setScanSuccess(true);
      setScanStatus("found");
      setTimeout(() => setScanSuccess(false), 4000);
      return;
    }

    // 2. Fallback: Open Food Facts public API
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const json = await res.json();
      const productName =
        json?.product?.product_name_en ||
        json?.product?.product_name ||
        json?.product?.abbreviated_product_name ||
        "";

      if (productName) {
        setName(productName);
        setScanSuccess(true);
        setScanStatus("found");
        setTimeout(() => setScanSuccess(false), 4000);
        return;
      }
    } catch (e) {
      console.log("Open Food Facts error:", e);
    }

    // 3. Nothing found — let user type manually
    setScanStatus("notfound");
    setTimeout(() => setScanStatus("idle"), 5000);
  }

  async function fetchSuggestions(query: string) {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSuggestionsLoading(true);
    setShowSuggestions(true);
    const { data } = await supabase
      .from("master_products")
      .select("id, name, brand, subcategory, size")
      .ilike("name", `%${query}%`)
      .limit(6);
    setSuggestions(data || []);
    setSuggestionsLoading(false);
  }

  function handleNameChange(val: string) {
    setName(val);
    clearTimeout(suggestionDebounce.current);
    suggestionDebounce.current = setTimeout(() => fetchSuggestions(val), 250);
  }

  function selectSuggestion(item: any) {
    setName(item.name ?? "");
    setSize(item.size ?? "");
    setSelectedProductId(item.id ?? null);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  async function saveShopLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("profiles").update({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }).eq("id", user.id);
    });
  }

  async function fetchProducts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch shop_products with name/size stored directly + image from master_products
    const { data: spData, error: spError } = await supabase
      .from("shop_products")
      .select("id, price, stock, product_id, name, size")
      .eq("shop_id", user.id);

    if (spError) { console.log("shop_products error:", spError); return; }
    if (!spData || spData.length === 0) { setProducts([]); return; }

    // Fetch images from master_products
    const productIds = spData.map((r: any) => r.product_id).filter(Boolean);
    const { data: mpData } = await supabase
      .from("master_products")
      .select("id, image_url")
      .in("id", productIds);

    const mpMap: any = {};
    (mpData || []).forEach((mp: any) => { mpMap[mp.id] = mp; });

    const flat = spData.map((row: any) => ({
      id: row.id,
      product_id: row.product_id,
      name: row.name ?? "Unnamed",
      size: row.size ?? "",
      image_url: mpMap[row.product_id]?.image_url ?? "",
      price: row.price,
      stock: row.stock,
    }));

    setProducts(flat);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Remove this product from your inventory?")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("shop_products")
      .delete()
      .eq("id", id)
      .eq("shop_id", user.id);
    if (error) {
      alert("Failed to remove: " + error.message);
      console.log(error);
      return;
    }
    fetchProducts();
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login"); setLoading(false); return; }

    // Use selectedProductId if available (from autocomplete/barcode), else look up by name
    let productId = selectedProductId;
    let productName = name.trim();
    let productSize = size.trim();

    if (!productId) {
      const { data: masterData } = await supabase
        .from("master_products")
        .select("id, name, size")
        .ilike("name", name.trim())
        .limit(1)
        .single();
      if (!masterData) {
        alert("Product not found in catalog. Please select from autocomplete suggestions.");
        setLoading(false);
        return;
      }
      productId = masterData.id;
      productName = masterData.name ?? productName;
      productSize = masterData.size ?? productSize;
    }

    const { error } = await supabase.from("shop_products").upsert({
      shop_id: user.id,
      product_id: productId,
      price: Number(price),
      stock: Number(stock),
      name: productName,
      size: productSize,
    });

    if (error) { alert(error.message); setLoading(false); return; }
    setName(""); setPrice(""); setStock(""); setSize(""); setScannedBarcode(""); setSelectedProductId(null);
    setLoading(false); setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
    fetchProducts();
  }

  const filtered = products.filter((p) => (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()));
  const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) < 5).length;

  return (
    <div className="page">
      <style>{CSS}</style>

      {/* Header */}
      <div className="top-bar">
        <div className="top-row">
          <div className="brand">🫧 My Store</div>
          <a href="/shop-orders" className="orders-link">📋 Orders</a>
        </div>
        <div className="stats-row">
          <div className="stat-chip">
            <div className="stat-val">{products.length}</div>
            <div className="stat-lbl">Products</div>
          </div>
          <div className="stat-chip">
            <div className="stat-val">{totalStock}</div>
            <div className="stat-lbl">Total Stock</div>
          </div>
          <div className="stat-chip">
            <div className="stat-val" style={{ color: lowStock > 0 ? "#FFB800" : "white" }}>{lowStock}</div>
            <div className="stat-lbl">Low Stock</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>➕ Add Product</button>
        <button className={`tab ${activeTab === "inventory" ? "active" : ""}`} onClick={() => setActiveTab("inventory")}>📦 Inventory ({products.length})</button>
      </div>

      <div className="content">
        {activeTab === "add" && (
          <div className="card">
            <div className="card-hdr">
              <div className="card-hdr-icon">➕</div>
              <div>
                <div className="card-hdr-title">Add New Product</div>
                <div className="card-hdr-sub">Scan barcode or fill manually</div>
              </div>
            </div>
            <div className="card-body">

              {/* Scanner */}
              <div className="scanner-zone">
                <button
                  type="button"
                  className="scan-btn"
                  style={{ background: scannerOpen ? "#F03D3D" : "#1A6BFF" }}
                  onClick={() => setScannerOpen((p) => !p)}
                >
                  {scannerOpen ? "⏹ Stop Scanner" : "📷 Scan Barcode"}
                </button>
                {!scannerOpen && <div className="scan-hint">Point camera at barcode to auto-fill product name</div>}
                {scannerOpen && (
                  <div className="scanner-wrap">
                    <BarcodeScanner onScan={(code: string) => {
                      setScannedBarcode(code);
                      searchByBarcode(code);
                      setScannerOpen(false);
                    }} />
                  </div>
                )}
                {scannedBarcode && !scannerOpen && (
                  <div className="scanned-badge">
                    <span>✅</span>
                    <div>
                      <div className="scanned-text">Barcode scanned!</div>
                      <div className="scanned-code">{scannedBarcode}</div>
                    </div>
                  </div>
                )}
              </div>

              {scanStatus === "searching" && (
                <div className="toast" style={{background:"#EBF1FF", borderColor:"#1A6BFF", color:"#1A6BFF"}}>
                  🔍 Looking up product...
                </div>
              )}
              {scanStatus === "found" && (
                <div className="toast">🎉 Product name filled automatically!</div>
              )}
              {scanStatus === "notfound" && (
                <div className="toast" style={{background:"#FFF8E6", borderColor:"#FFB800", color:"#946200"}}>
                  ⚠️ Product not found — please type the name manually
                </div>
              )}

              <form onSubmit={addProduct}>
                <div className="field">
                  <label className="field-label">Product Name</label>
                  <input className={`field-input${name ? " has-val" : ""}`} placeholder="e.g. Amul Butter 500g" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="field">
                    <label className="field-label">Size / Unit</label>
                    <input
                      className={`field-input${size ? " has-val" : ""}`}
                      placeholder="e.g. 500g, 1L, 200ml"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </div>
                <div className="fields-row">
                  <div className="field">
                    <label className="field-label">Price</label>
                    <div className="prefix-wrap">
                      <span className="prefix">₹</span>
                      <input className={`field-input prefixed${price ? " has-val" : ""}`} placeholder="0.00" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Stock Qty</label>
                    <input className={`field-input${stock ? " has-val" : ""}`} placeholder="0" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className={`submit-btn${addSuccess ? " success" : ""}`} disabled={loading}>
                  {loading ? "Adding..." : addSuccess ? "✓ Added!" : "Add to Inventory"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <>
            <div className="search-bar">
              <span>🔍</span>
              <input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{searchQuery ? "🔍" : "📦"}</div>
                <div className="empty-title">{searchQuery ? "No products found" : "No products yet"}</div>
                <div className="empty-sub">{searchQuery ? "Try a different search" : "Add your first product above"}</div>
              </div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="prod-card" style={{flexDirection:"column", alignItems:"stretch", gap:0}}>
                  <div style={{display:"flex", alignItems:"center", gap:12}}>
                    <div className="prod-icon">{(p.stock ?? 0) < 5 ? "⚠️" : "🛍️"}</div>
                    <div className="prod-info">
                      <div className="prod-name">{p.name ?? "Unnamed"}</div>
                      {p.size && <div style={{fontSize:"11px", color:"#8A96B5", fontWeight:600, marginBottom:3}}>{p.size}</div>}
                      <div className="prod-meta">
                        <span className="prod-price">₹{p.price}</span>
                        <span className={`stock-badge ${(p.stock ?? 0) < 5 ? "stock-low" : "stock-ok"}`}>
                          {p.stock ?? 0} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="del-btn" onClick={() => deleteProduct(p.id)}>
                    🗑️ Remove from Inventory
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item active"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item"><div className="nav-icon">➕</div>Add</a>
        <a href="/inventory" className="nav-item"><div className="nav-icon">📦</div>Inventory</a>
        <a href="/shop-orders" className="nav-item"><div className="nav-icon">📋</div>Orders</a>
      </nav>
    </div>
  );
}
