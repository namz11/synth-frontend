import React, { useState } from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-white dark:bg-slate-800">
        <div className="container flex flex-col items-center justify-center p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Bug Squashers © Copyright 2023. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
