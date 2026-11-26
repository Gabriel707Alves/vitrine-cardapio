import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Buffet } from "@/components/sections/Buffet";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Visit />
        <section className="section" id="cardapio" aria-labelledby="cardapio-h">
          <div className="wrap">
            <h2 id="cardapio-h">Cardápio</h2>
          </div>
        </section>
        <Buffet />
        <Statement />
      </main>
      <Footer />
      <nav className="actionbar" aria-label="Ações rápidas">
        <a className="btn btn--primary" href="#cardapio">
          Pedir marmita
        </a>
      </nav>
    </>
  );
}
