import { ActionBar } from "@/components/cart/ActionBar";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MenuSection } from "@/components/menu/MenuSection";
import { Buffet } from "@/components/sections/Buffet";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Visit } from "@/components/sections/Visit";
import { cliente } from "@/config/cliente";
import { getMenu } from "@/lib/menu/cached";

export default async function Home() {
  const menu = await getMenu();
  return (
    <CartProvider menu={menu} slug={cliente.slug}>
      <Header actions={<CartButton />} />
      <main id="top">
        <Hero />
        <Visit />
        <MenuSection menu={menu} />
        <Buffet />
        <Statement />
      </main>
      <Footer />
      <ActionBar />
      <CartDrawer />
    </CartProvider>
  );
}
