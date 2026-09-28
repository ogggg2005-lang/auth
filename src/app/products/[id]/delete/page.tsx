import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({ params }: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main className="min-h-screen bg-[#0d0f17] text-slate-100 flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900/90 border border-rose-950/50 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl">
          ⚠️
        </div>
        
        <h1 className="text-2xl font-black text-white">ยืนยันการลบ</h1>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          ต้องการลบสินค้า <span className="font-bold text-rose-300">“{product.name}”</span> หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        <div className="mt-8 flex flex-col gap-2.5">
          <form action={deleteAction} className="w-full">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-rose-600/20 cursor-pointer"
            >
              ยืนยันการลบ
            </button>
          </form>
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm transition-colors text-center"
          >
            ยกเลิก
          </Link>
        </div>
      </div>
    </main>
  );
}