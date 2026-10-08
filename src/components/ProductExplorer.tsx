"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";
import { CATEGORIES, defaultQuery, fetchProducts } from "@/lib/product-explorer";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/product-explorer";

type LoadState = "loading" | "error" | "ready";

type ProductExplorerProps = {
  isLoggedIn: boolean;
};

export default function ProductExplorer({ isLoggedIn }: ProductExplorerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof CATEGORIES)[number] | ""
  >("");

  const showResult = useCallback((list: ProductList) => {
    setProducts(list.products);
    setStatus("ready");
  }, []);

  const showError = useCallback((error: unknown) => {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ",
    );
    setStatus("error");
  }, []);

  const loadProducts = useCallback(
    async (query: SearchQuery) => {
      setStatus("loading");
      setErrorMessage("");

      try {
        showResult(await fetchProducts(query));
      } catch (error) {
        showError(error);
      }
    },
    [showError, showResult],
  );

  useEffect(() => {
    let isActive = true;

    void fetchProducts(defaultQuery)
      .then((list) => {
        if (isActive) showResult(list);
      })
      .catch((error: unknown) => {
        if (isActive) showError(error);
      });

    return () => {
      isActive = false;
    };
  }, [showError, showResult]);

  function saveProduct(draft: ProductDraft) {
    if (editingProduct) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? { ...draft, id: product.id }
            : product,
        ),
      );
      setEditingProduct(null);
    } else {
      setProducts((previous) => [{ ...draft, id: Date.now() }, ...previous]);
    }
  }

  function deleteProduct(id: number) {
    setProducts((previous) => previous.filter((product) => product.id !== id));
  }

  return (
    <>
      <div
        className={`controls-container${isLoggedIn ? "" : " controls-container-guest"}`}
      >
        <ProductSearchForm onSearch={loadProducts} />
        {isLoggedIn && (
          <ProductForm
            editing={editingProduct}
            onSave={saveProduct}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </div>

      <section aria-live="polite">
        {status === "loading" && (
          <div className="status-msg status-loading">กำลังโหลดข้อมูลสินค้า...</div>
        )}
        {status === "error" && (
          <div className="status-msg status-error" role="alert">
            {errorMessage}
          </div>
        )}
        {status === "ready" && products.length === 0 && (
          <div className="status-msg status-empty">ไม่พบสินค้าที่ตรงกับเงื่อนไข</div>
        )}

        {status === "ready" && products.length > 0 && (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>รูปภาพ</th>
                  <th>ชื่อสินค้า</th>
                  <th style={{ width: "90px" }}>ราคา ($)</th>
                  <th style={{ width: "90px" }}>คงเหลือ</th>
                  <th style={{ width: "160px" }}>
                    <div className="category-filter">
                      <span>หมวดหมู่</span>
                      <select
                        value={selectedCategory}
                        onChange={(event) => {
                          const category = event.target.value as
                            | (typeof CATEGORIES)[number]
                            | "";
                          setSelectedCategory(category);
                          void loadProducts({
                            ...defaultQuery,
                            category: category || undefined,
                          });
                        }}
                        aria-label="กรองตามหมวดหมู่"
                      >
                        <option value="">ทั้งหมด</option>
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                  {isLoggedIn && (
                    <th style={{ width: "120px", textAlign: "center" }}>
                      จัดการ
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Image
                        className="thumb-img"
                        src={product.thumbnail}
                        alt={product.title}
                        width={52}
                        height={52}
                        unoptimized
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://dummyjson.com/image/80?text=No+Image";
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.title}</td>
                    <td>{product.price.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className="badge">{product.category}</span>
                    </td>
                    {isLoggedIn && (
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-edit-outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            แก้ไข
                          </button>
                          <button
                            type="button"
                            className="btn-danger-outline"
                            onClick={() => deleteProduct(product.id)}
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
