import React, { useState } from "react";

const Footer = () => {
  return (
    <>
      <footer className="fixed bottom-0 z-40 h-12 w-full bg-white dark:bg-slate-800">
        <div className="container flex flex-col items-center justify-center px-6 py-3.5 mx-auto space-y-2 sm:space-y-0 sm:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Bug Squashers © Copyright 2023. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
