"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ShopDashboard() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("shop_id", user?.id);

    if (data) setProducts(data);
  }

  async function addProduct(e: any) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("products").insert({
      name,
      price: Number(price),
      stock: Number(stock),
      shop_id: user?.id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setPrice("");
    setStock("");

    fetchProducts();
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Shopkeeper Dashboard 🏪</h1>

      <form onSubmit={addProduct} style={{ marginBottom: "30px" }}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Stock quantity"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <br /><br />

        <button type="submit">Add Product</button>
      </form>

      <h2>Your Products</h2>

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "10px" }}>
          {product.name} — ₹{product.price} — Stock: {product.stock}
        </div>
      ))}
    </div>
  );
}