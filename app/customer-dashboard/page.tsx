"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CustomerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      stock,
      shop_id,
      profiles (
        name
      )
    `);

    if (data) setProducts(data);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1>Customer Dashboard 🛒</h1>

      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

{filteredProducts.map((product) => (
  <div key={product.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
    <strong>{product.name}</strong>
    <div>Shop: {product.profiles?.name}</div>
    <div>Price: ₹{product.price}</div>
    <div>Stock: {product.stock}</div>
  </div>
))}
    </div>
  );
}