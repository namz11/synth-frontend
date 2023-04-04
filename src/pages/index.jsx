// import Head from "next/head";

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Synth</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main>
//         <div className="text-yellow-400">narmit</div>
//       </main>
//     </>
//   );
// }

import { useRouter } from "next/router";

function RedirectPage({ ctx }) {
  const router = useRouter();

  // Make sure we're in the browser
  if (typeof window !== "undefined") {
    // Redirect to home route when on /
    router.push("/home");
  }
}

RedirectPage.getInitialProps = (ctx) => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: "/home" });
    ctx.res.end();
  }
  return {};
};

export default RedirectPage;
