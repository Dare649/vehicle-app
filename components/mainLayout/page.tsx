"use client";

import React, { ReactNode } from "react";
import TopNav from "../topbar/page";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <main className="p-5 relative bg-[url(/pattern.svg)] bg-cover bg-center custom-scroll lg:mt-28 sm:10">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
