import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import MusicPlayer from "@components/player/musicPlayer";

export default function MainLayout({ children }) {
  return (
    <>
      <section className="relative min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
        <Header />
        <main className="grow">{children}</main>
        <MusicPlayer />
        <Footer />
      </section>
    </>
  );
}
