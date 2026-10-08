"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/product-explorer";
import type {
  Product,
  ProductDraft,
} from "@/lib/product-explorer";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      price: undefined,
      stock: undefined,
      thumbnail: "https://dummyjson.com/image/150",
      category: undefined,
    },
  });

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        thumbnail: editing.thumbnail,
        category: editing.category,
      });
    } else {
      reset({
        title: "",
        price: undefined,
        stock: undefined,
        thumbnail: "https://dummyjson.com/image/150",
        category: undefined,
      });
    }
  }, [editing, reset]);

  function submitProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  const isFormComplete = isDirty && isValid;

  return (
    <div className="panel-card">
      <h2 className="panel-title">
        {editing ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
      </h2>
      <form onSubmit={handleSubmit(submitProduct)} noValidate>
        <div className="product-form-grid">
          <div className="form-group">
            <label htmlFor="title">ชื่อสินค้า</label>
            <input
              id="title"
              {...register("title")}
              placeholder="ระบุชื่อสินค้า"
              aria-invalid={Boolean(errors.title)}
            />
            <span className="error-text">{errors.title?.message}</span>
          </div>

          <div className="form-group">
            <label htmlFor="category">หมวดหมู่</label>
            <select
              id="category"
              {...register("category")}
              aria-invalid={Boolean(errors.category)}
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <span className="error-text">{errors.category?.message}</span>
          </div>

          <div className="form-group">
            <label htmlFor="price">ราคา ($)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              aria-invalid={Boolean(errors.price)}
            />
            <span className="error-text">{errors.price?.message}</span>
          </div>

          <div className="form-group">
            <label htmlFor="stock">จำนวนคงเหลือ</label>
            <input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              aria-invalid={Boolean(errors.stock)}
            />
            <span className="error-text">{errors.stock?.message}</span>
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">URL รูปภาพ</label>
            <input
              id="thumbnail"
              type="url"
              {...register("thumbnail")}
              aria-invalid={Boolean(errors.thumbnail)}
            />
            <span className="error-text">{errors.thumbnail?.message}</span>
          </div>

          <div className="form-group form-actions">
            <div className="btn-group">
              <button
                type="submit"
                disabled={!isFormComplete}
                className={isFormComplete ? "btn-save" : "btn-disabled"}
              >
                {editing ? "บันทึก" : "เพิ่มสินค้า"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onCancel}
                >
                  ยกเลิก
                </button>
              )}
            </div>
            <span className="error-text" />
          </div>
        </div>
      </form>
    </div>
  );
}
