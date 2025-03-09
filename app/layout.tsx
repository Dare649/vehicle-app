'use client';
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import LoadingOverlay from "@/components/loading/page";
import MainLayout from "@/components/mainLayout/page";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();

  // List of pages that should NOT be wrapped with MainLayout
  const excludedPaths = ["/", "/auth/sign-up", "/error"];

  return (
    <html lang="en">
      <body className="font-primary">
        <Provider store={store}>
          <LoadingOverlay />
          <ToastContainer position="top-center" autoClose={3000} />
          {excludedPaths.includes(pathname) ? children : <MainLayout>{children}</MainLayout>}
        </Provider>
      </body>
    </html>
  );
}