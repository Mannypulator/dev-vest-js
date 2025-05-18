import { Inter } from "next/font/google";
import "../assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { ModalProvider } from "@/components/ModelContext";
import { Modals } from "@/components/Modals";
import Header from "@/components/Header";
import HeaderOutline from "@/components/HeaderOutline";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Drive Vest",
  description: "A modern property management platform",
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
            <Toaster />
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
