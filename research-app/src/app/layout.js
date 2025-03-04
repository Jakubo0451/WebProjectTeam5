import { Inter, Kaisei_Opti } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-Inter",
  subsets: ["latin"],
});

const kaiseiOpti = Kaisei_Opti({
  variable: "--font-KaiseiOpti",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata = {
  title: "Untitled Research App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${kaiseiOpti.variable}`}>
        {children}
      </body>
    </html>
  );
}