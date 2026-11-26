import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" />
      <Footer />
      <nav className="actionbar" aria-label="Ações rápidas">
        <a className="btn btn--primary" href="#cardapio">
          Pedir marmita
        </a>
      </nav>
    </>
  );
}
