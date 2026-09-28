import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <main className="min-h-screen bg-[#0d0f17] text-slate-100 flex items-center justify-center p-4 selection:bg-violet-500 selection:text-white">
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6">
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Editor Mode</span>
          <h1 className="text-2xl font-black text-white mt-1">แก้ไขสินค้า</h1>
        </div>

        <form action={updateAction} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              ชื่อสินค้า
            </label>
            <input
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              ราคา (บาท)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product.price}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              รายละเอียด
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product.description}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-violet-600/20 active:scale-[0.98]"
            >
              บันทึกการแก้ไข
            </button>
            <Link
              href="/"
              className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors text-center"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}