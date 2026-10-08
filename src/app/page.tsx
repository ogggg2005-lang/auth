import { auth } from "@/auth";
import { AuthButtons } from "@/app/auth-buttons";
import ProductExplorer from "@/components/ProductExplorer";
import ThemeToggle from "@/components/ThemeToggle";

export default async function HomePage() {
  const session = await auth();

  const isLoggedIn = Boolean(session?.user);

  return (
    <main>
      <header className="explorer-header">
        <h1 className="page-title">รายการสินค้า</h1>
        <div className="theme-toggle-position">
          <ThemeToggle />
        </div>
        <div className="explorer-auth">
          <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
        </div>
      </header>
      <ProductExplorer isLoggedIn={isLoggedIn} />
    </main>
  );
}
