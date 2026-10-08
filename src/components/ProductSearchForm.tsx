"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { defaultQuery, SearchQuerySchema } from "@/lib/product-explorer";
import type {
  SearchQuery,
  SearchQueryInput,
} from "@/lib/product-explorer";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

const LIMIT_OPTIONS = Array.from({ length: 21 }, (_, index) => 10 + index);

export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQueryInput, unknown, SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <div className="panel-card">
      <h2 className="panel-title">ค้นหาสินค้า</h2>
      <form onSubmit={handleSubmit(onSearch)} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="q">ชื่อหรือคำค้นหา</label>
            <input
              id="q"
              type="search"
              {...register("q")}
              placeholder="เช่น phone, laptop..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="limit">จำนวนรายการ</label>
            <select
              id="limit"
              {...register("limit", { valueAsNumber: true })}
              aria-invalid={Boolean(errors.limit)}
            >
              {LIMIT_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span className="error-text">{errors.limit?.message}</span>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
          </button>
        </div>
      </form>
    </div>
  );
}
