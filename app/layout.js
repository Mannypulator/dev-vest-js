import { Inter } from "next/font/google";
import "../assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalProvider } from "@/components/ModelContext";
import { Modals } from "@/components/Modals";
import Header from "@/components/Header";
import HeaderOutline from "@/components/HeaderOutline";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "PropertyPulse",
  description: "A modern property management platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ModalProvider>
            <Header />
            <HeaderOutline />
            {children}
            <Modals />
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
