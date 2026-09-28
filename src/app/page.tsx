import Link from "next/link";
import { auth } from "@/auth";
import { getProducts } from "@/lib/products";
import { AuthButtons } from "./auth-buttons";

export default async function HomePage() {
  const session = await auth();
  const products = getProducts();
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className="min-h-screen w-full bg-[#0d0f17] text-slate-100 selection:bg-violet-500 selection:text-white">
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-8 font-sans antialiased">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
              Drop 2026 Collection
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-200 bg-clip-text text-transparent">
              สินค้าคัดสรร
            </h1>
            <p className="text-sm text-slate-400 mt-1">คัดไอเทมเด็ด จัดโต๊ะคอม อุปกรณ์ทำงาน & ไลฟ์สไตล์</p>
          </div>

          <div className="w-full sm:w-auto">
            <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              data-testid="product"
              className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 shadow-lg hover:border-violet-500/60 hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-mono">
                  <span>#{product.id}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300">In Stock</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase text-slate-500 tracking-wider">ราคา</span>
                  <p className="text-2xl font-black text-violet-400 tracking-tight">
                    ฿{product.price.toLocaleString("th-TH")}
                  </p>
                </div>

                {isLoggedIn && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all duration-200"
                    >
                      แก้ไข
                    </Link>
                    <Link
                      href={`/products/${product.id}/delete`}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/60 hover:bg-rose-600 hover:text-white transition-all duration-200"
                    >
                      ลบ
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-24 rounded-3xl border border-dashed border-slate-800 bg-slate-900/20">
            <p className="text-slate-400 text-base font-medium">ยังไม่มีสินค้าในขณะนี้ 📦</p>
          </div>
        )}
      </main>
    </div>
  );
}