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

.top-bar { background: #1A6BFF; padding: 16px 20px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); }
.top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.brand { font-size: 20px; font-weight: 900; color: white; letter-spacing: -0.5px; }
.orders-link { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.28); color: white; padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; }
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

.scanner-zone { background: linear-gradient(135deg, #EBF1FF, #DDEAFF); border: 2px dashed #1A6BFF; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 16px; }
.scan-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; color: white; }
.scan-hint { font-size: 12px; color: #1A6BFF; font-weight: 600; margin-top: 10px; }
.scanned-badge { display: flex; align-items: center; gap: 8px; background: #E6FAF4; border: 1.5px solid #00B37E; border-radius: 10px; padding: 10px 14px; margin-top: 12px; }
.scanned-text { font-size: 13px; font-weight: 700; color: #00875A; }
.scanned-code { font-size: 11px; color: #00B37E; font-weight: 600; font-family: monospace; }
.scanner-wrap { margin-top: 14px; border-radius: 12px; overflow: hidden; }

.toast { display: flex; align-items: center; gap: 8px; border-left: 4px solid; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px; font-weight: 700; }
.toast-info { background: #EBF1FF; border-color: #1A6BFF; color: #1A6BFF; }
.toast-success { background: #E6FAF4; border-color: #00B37E; color: #00875A; }
.toast-warn { background: #FFF8E6; border-color: #FFB800; color: #946200; }

.field { margin-bottom: 14px; }
.field-label { display: block; font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
.field-input { width: 100%; padding: 13px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.field-input:focus { border-color: #1A6BFF; background: white; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.field-input.has-val { border-color: #1A6BFF; }
.fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.prefix-wrap { position: relative; }
.prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; font-weight: 800; color: #8A96B5; pointer-events: none; }
.field-input.prefixed { padding-left: 28px; }

/* IMAGE UPLOAD */
.img-upload-zone { border: 2px dashed #E4EAFF; border-radius: 14px; overflow: hidden; margin-bottom: 14px; transition: border-color 0.2s; cursor: pointer; }
.img-upload-zone:hover { border-color: #1A6BFF; }
.img-upload-zone.has-img { border-color: #00B37E; border-style: solid; }
.img-upload-zone.locked { cursor: default; opacity: 0.9; }
.img-preview { width: 100%; height: 160px; object-fit: contain; background: linear-gradient(135deg, #EBF1FF, #DDEAFF); display: block; }
.img-upload-placeholder { height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #F4F6FB; }
.img-upload-icon { font-size: 32px; }
.img-upload-text { font-size: 13px; font-weight: 700; color: #8A96B5; }
.img-upload-sub { font-size: 11px; color: #B0BACC; font-weight: 500; }
.img-exists-badge { display: flex; align-items: center; gap: 6px; background: #E6FAF4; padding: 6px 12px; font-size: 12px; font-weight: 700; color: #00875A; }

.submit-btn { width: 100%; padding: 15px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; }
.submit-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.submit-btn.success { background: #00B37E; }

.search-bar { display: flex; align-items: center; gap: 10px; background: white; border: 2px solid #E4EAFF; border-radius: 12px; padding: 11px 14px; margin-bottom: 14px; }
.search-bar input { border: none; outline: none; font-size: 14px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }

.prod-card { background: white; border-radius: 14px; border: 1.5px solid #E4EAFF; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 6px rgba(26,107,255,0.05); }
.prod-icon { width: 46px; height: 46px; border-radius: 10px; background: linear-gradient(135deg,#EBF1FF,#DDEAFF); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; overflow: hidden; }
.prod-icon img { width: 100%; height: 100%; object-fit: cover; }
.prod-info { flex: 1; }
.prod-name { font-size: 14px; font-weight: 700; color: #0D1B3E; margin-bottom: 3px; }
.prod-meta { display: flex; gap: 8px; align-items: center; }
.prod-price { font-size: 15px; font-weight: 900; color: #1A6BFF; }
.stock-badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.stock-ok { background: #E6FAF4; color: #00875A; }
.stock-low { background: #FFF8E6; color: #946200; }
.del-btn { padding: 7px 12px; background: #FFF0F0; color: #F03D3D; border: 1.5px solid #FFD6D6; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; flex-shrink: 0; }

.empty-state { text-align: center; padding: 50px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 10px; }
.empty-title { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.empty-sub { font-size: 13px; color: #8A96B5; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }

.autocomplete-wrap { position: relative; }
.suggestions-dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 2px solid #1A6BFF; border-radius: 12px; box-shadow: 0 8px 30px rgba(26,107,255,0.15); z-index: 200; overflow: hidden; max-height: 240px; overflow-y: auto; }
.suggestion-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #F4F6FB; }
.suggestion-item:last-child { border-bottom: none; }
.suggestion-item:hover { background: #EBF1FF; }
.suggestion-name { font-size: 13px; font-weight: 700; color: #0D1B3E; line-height: 1.3; }
.suggestion-meta { font-size: 11px; color: #8A96B5; font-weight: 500; margin-top: 1px; }

.manual-barcode-row { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
.manual-barcode-row .field-input { margin: 0; }
.barcode-tag { display: inline-flex; align-items: center; gap: 6px; background: #EBF1FF; border: 1.5px solid #1A6BFF; border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #1A6BFF; font-family: monospace; }
`;

export default function ShopDashboard() {
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle"|"searching"|"found"|"notfound">("idle");
  const [activeTab, setActiveTab] = useState<"add"|"inventory">("add");
  const [loading, setLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string|null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [imgFile, setImgFile] = useState<File|null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");
  const [existingImgUrl, setExistingImgUrl] = useState<string>("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const suggestionDebounce = useRef<any>(null);

  useEffect(() => {
    saveShopLocation();
    fetchProducts();
  }, []);

  // When a product is selected, check if it already has an image
  useEffect(() => {
    if (selectedProductId) {
      checkExistingImage(selectedProductId);
    } else {
      setExistingImgUrl("");
      setImgFile(null);
      setImgPreview("");
    }
  }, [selectedProductId]);

  async function checkExistingImage(productId: string) {
    const { data } = await supabase
      .from("master_products")
      .select("image_url")
      .eq("id", productId)
      .single();
    if (data?.image_url) {
      setExistingImgUrl(data.image_url);
      setImgPreview(data.image_url);
    } else {
      setExistingImgUrl("");
      setImgPreview("");
    }
  }

  async function searchByBarcode(barcode: string) {
    setScanStatus("searching");
    const { data } = await supabase
      .from("master_products")
      .select("*")
      .eq("barcode", barcode)
      .single();

    if (data?.name) {
      setName(data.name);
      setSize(data.size ?? "");
      setSelectedProductId(data.id);
      setScanStatus("found");
      setTimeout(() => setScanStatus("idle"), 4000);
      return;
    }

    // Fallback: Open Food Facts
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const json = await res.json();
      const productName = json?.product?.product_name_en || json?.product?.product_name || "";
      const productQuantity = json?.product?.quantity || "";
      if (productName) {
        setName(productName);
        if (productQuantity) setSize(productQuantity);
        setSelectedProductId(null);
        setScanStatus("found");
        setTimeout(() => setScanStatus("idle"), 4000);
        return;
      }
    } catch (e) {}

    setScanStatus("notfound");
    setTimeout(() => setScanStatus("idle"), 5000);
  }

  async function fetchSuggestions(query: string) {
    if (query.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    setShowSuggestions(true);
    const { data } = await supabase
      .from("master_products")
      .select("id, name, brand, size, image_url")
      .ilike("name", `%${query}%`)
      .limit(6);
    setSuggestions(data || []);
  }

  function handleNameChange(val: string) {
    setName(val);
    setSelectedProductId(null);
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

  function handleImgSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File, productId: string): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${productId}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
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
    const { data: spData } = await supabase
      .from("shop_products")
      .select("id, price, stock, product_id, name, size")
      .eq("shop_id", user.id);
    if (!spData || spData.length === 0) { setProducts([]); return; }
    const productIds = spData.map((r: any) => r.product_id).filter(Boolean);
    const { data: mpData } = await supabase
      .from("master_products")
      .select("id, image_url")
      .in("id", productIds);
    const mpMap: any = {};
    (mpData || []).forEach((mp: any) => { mpMap[mp.id] = mp; });
    setProducts(spData.map((r: any) => ({
      ...r,
      image_url: mpMap[r.product_id]?.image_url ?? "",
    })));
  }

  async function deleteProduct(id: string) {
    if (!confirm("Remove this product from your inventory?")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("shop_products").delete().eq("id", id).eq("shop_id", user.id);
    fetchProducts();
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login"); setLoading(false); return; }

    let productId = selectedProductId;
    let productName = name.trim();
    let productSize = size.trim();
    const barcodeToSave = scannedBarcode || manualBarcode.trim() || null;

    if (!productId) {
      // Try match by name
      const { data: masterData } = await supabase
        .from("master_products")
        .select("id, name, size")
        .ilike("name", "%" + productName + "%")
        .limit(1)
        .maybeSingle();

      if (masterData) {
        productId = masterData.id;
        productName = masterData.name ?? productName;
        productSize = masterData.size ?? productSize;
      } else {
        // Insert new into master_products
        const { data: newMaster, error: insertError } = await supabase
          .from("master_products")
          .insert({ name: productName, size: productSize, barcode: barcodeToSave })
          .select("id")
          .single();
        if (insertError || !newMaster) {
          alert("Could not save product to catalog: " + (insertError?.message ?? "unknown error"));
          setLoading(false);
          return;
        }
        productId = newMaster.id;
      }
    } else if (barcodeToSave) {
      // Update barcode on existing product if not set
      await supabase
        .from("master_products")
        .update({ barcode: barcodeToSave })
        .eq("id", productId)
        .is("barcode", null);
    }

    // Upload image if new file selected and no existing image
    if (imgFile && productId && !existingImgUrl) {
      try {
        setUploadingImg(true);
        const publicUrl = await uploadImage(imgFile, productId);
        await supabase.from("master_products").update({ image_url: publicUrl }).eq("id", productId);
        setUploadingImg(false);
      } catch (err: any) {
        setUploadingImg(false);
        console.error("Image upload failed:", err.message);
      }
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

    setName(""); setPrice(""); setStock(""); setSize("");
    setScannedBarcode(""); setManualBarcode(""); setSelectedProductId(null);
    setImgFile(null); setImgPreview(""); setExistingImgUrl("");
    setLoading(false); setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
    fetchProducts();
  }

  const filtered = products.filter((p) => (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()));
  const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) < 5).length;
  const activeBarcode = scannedBarcode || manualBarcode.trim();

  return (
    <div className="page">
      <style>{CSS}</style>

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

              {/* Barcode Scanner */}
              <div className="scanner-zone">
                <button
                  type="button"
                  className="scan-btn"
                  style={{ background: scannerOpen ? "#F03D3D" : "#1A6BFF" }}
                  onClick={() => setScannerOpen((p) => !p)}
                >
                  {scannerOpen ? "⏹ Stop Scanner" : "📷 Scan Barcode"}
                </button>
                {!scannerOpen && <div className="scan-hint">Point camera at barcode to auto-fill</div>}
                {scannerOpen && (
                  <div className="scanner-wrap">
                    <BarcodeScanner onScan={(code: string) => {
                      setScannedBarcode(code);
                      setManualBarcode("");
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

              {/* Manual Barcode Entry */}
              {!scannedBarcode && (
                <div className="field">
                  <label className="field-label">📦 Barcode (if can't scan)</label>
                  <input
                    className={`field-input${manualBarcode ? " has-val" : ""}`}
                    placeholder="Type barcode number manually..."
                    value={manualBarcode}
                    onChange={(e) => {
                      setManualBarcode(e.target.value);
                      if (e.target.value.length >= 8) {
                        searchByBarcode(e.target.value);
                      }
                    }}
                  />
                </div>
              )}
              {scannedBarcode && (
                <div style={{marginBottom:14}}>
                  <button
                    type="button"
                    style={{fontSize:11,color:"#8A96B5",fontWeight:700,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit"}}
                    onClick={() => { setScannedBarcode(""); setName(""); setSize(""); setSelectedProductId(null); }}
                  >✕ Clear scan & start over</button>
                </div>
              )}

              {/* Status toasts */}
              {scanStatus === "searching" && <div className="toast toast-info">🔍 Looking up product...</div>}
              {scanStatus === "found" && <div className="toast toast-success">🎉 Product found automatically!</div>}
              {scanStatus === "notfound" && <div className="toast toast-warn">⚠️ Not found — please type the name below</div>}

              <form onSubmit={addProduct}>

                {/* Active barcode indicator */}
                {activeBarcode && (
                  <div style={{marginBottom:12}}>
                    <span className="barcode-tag">📦 {activeBarcode}</span>
                  </div>
                )}

                {/* Product Name with autocomplete */}
                <div className="field autocomplete-wrap">
                  <label className="field-label">Product Name</label>
                  <input
                    className={`field-input${name ? " has-val" : ""}`}
                    placeholder="e.g. Amul Butter"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    required
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {suggestions.map((s) => (
                        <div key={s.id} className="suggestion-item" onMouseDown={() => selectSuggestion(s)}>
                          <div>
                            <div className="suggestion-name">{s.name}</div>
                            <div className="suggestion-meta">{[s.brand, s.size].filter(Boolean).join(" · ")}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size */}
                <div className="field">
                  <label className="field-label">Size / Unit</label>
                  <input
                    className={`field-input${size ? " has-val" : ""}`}
                    placeholder="e.g. 500g, 1L, 200ml"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                </div>

                {/* Product Image Upload */}
                <div className="field">
                  <label className="field-label">Product Photo</label>
                  <div
                    className={`img-upload-zone ${imgPreview ? "has-img" : ""} ${existingImgUrl ? "locked" : ""}`}
                    onClick={() => { if (!existingImgUrl) imgInputRef.current?.click(); }}
                  >
                    {imgPreview ? (
                      <>
                        <img src={imgPreview} alt="Product" className="img-preview" />
                        {existingImgUrl && (
                          <div className="img-exists-badge">
                            ✅ Photo already saved — visible to all shopkeepers
                          </div>
                        )}
                        {!existingImgUrl && imgFile && (
                          <div className="img-exists-badge" style={{background:"#EBF1FF", color:"#1A6BFF"}}>
                            📷 New photo selected — tap to change
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="img-upload-placeholder">
                        <div className="img-upload-icon">📷</div>
                        <div className="img-upload-text">Tap to add product photo</div>
                        <div className="img-upload-sub">Will be saved for all shopkeepers</div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={handleImgSelect}
                  />
                </div>

                {/* Price + Stock */}
                <div className="fields-row">
                  <div className="field">
                    <label className="field-label">Price (₹)</label>
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

                <button type="submit" className={`submit-btn${addSuccess ? " success" : ""}`} disabled={loading || uploadingImg}>
                  {uploadingImg ? "📷 Uploading photo..." : loading ? "Adding..." : addSuccess ? "✓ Added!" : "Add to Inventory"}
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
                <div key={p.id} className="prod-card">
                  <div className="prod-icon">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} />
                      : (p.stock ?? 0) < 5 ? "⚠️" : "🛍️"}
                  </div>
                  <div className="prod-info">
                    <div className="prod-name">{p.name ?? "Unnamed"}</div>
                    {p.size && <div style={{fontSize:"11px",color:"#8A96B5",fontWeight:600,marginBottom:3}}>{p.size}</div>}
                    <div className="prod-meta">
                      <span className="prod-price">₹{p.price}</span>
                      <span className={`stock-badge ${(p.stock ?? 0) < 5 ? "stock-low" : "stock-ok"}`}>{p.stock ?? 0} in stock</span>
                    </div>
                  </div>
                  <button className="del-btn" onClick={() => deleteProduct(p.id)}>🗑️</button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item active"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item"><div className="nav-icon">➕</div>Add</a>
        <a href="/shop-orders" className="nav-item"><div className="nav-icon">📋</div>Orders</a>
      </nav>
    </div>
  );
}
