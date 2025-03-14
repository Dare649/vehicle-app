'use client';
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import LoadingOverlay from "@/components/loading/page";
import MainLayout from "@/components/mainLayout/page";
import { usePathname } from "next/navigation";
import { PersistGate } from "redux-persist/integration/react";



export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();

  // List of pages that should NOT be wrapped with MainLayout
  const excludedPaths = ["/", "/auth/sign-up", "/auth/verify-otp", "/error"];

  return (
    <html lang="en">
      <body className="font-primary">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LoadingOverlay />
            <ToastContainer position="top-center" autoClose={3000} />
            {excludedPaths.includes(pathname) ? children : <MainLayout>{children}</MainLayout>}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}