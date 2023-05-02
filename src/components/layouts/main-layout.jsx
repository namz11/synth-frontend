import Footer from "@components/footer/footer";
import Header from "@components/header/header";

export default function MainLayout({ children }) {
  return (
    <>
      <section className="relative min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </section>
    </>
  );
}
