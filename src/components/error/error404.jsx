import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function Error404() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-screen h-[80vh] gap-20">
      <div className="py-12">
        <div className="gap-4 flex">
          <div className="flex flex-col items-center justify-center py-32">
            <h1 className="font-bold text-9xl text-white">404</h1>
            <p className="mb-2 text-3xl font-bold text-center text-white ">
              <span className="text-pink-500">Oops!</span> Page not found
            </p>
            <p className="mb-8 text-center text-white md:text-lg">
              The page you&apos;re looking for doesn&apos;t exist. <br />
            </p>
            <div className="flex gap-4">
              {/* <button
                className="px-10 py-2 text-sm font-semibold text-white bg-pink-600 rounded-xl"
                onClick={() => {
                  router.back();
                }}
              >
                Go back
              </button> */}
              <Link
                href="/"
                className="px-10 py-2 text-sm font-semibold text-white bg-pink-600 rounded-xl"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error404;
