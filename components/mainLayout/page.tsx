"use client";

import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import TopNav from "../topbar/page";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  // Prevent rendering until token check is done to avoid flickering
  if (!token) return null;

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
