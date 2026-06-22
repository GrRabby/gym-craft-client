import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Oswald, Bebas_Neue, Inter } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const oswald = Oswald({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-oswald",
    display: "swap",
});

const bebas = Bebas_Neue({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-bebas",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});
export const metadata = {
  title: "Gym Craft",
  description: "Craft your strenth",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavigationBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
