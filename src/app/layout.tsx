import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

// 🔧 FONT CONFIGURATION
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ngân Hà Barbershop & Spa | Premium Spa in District 1, HCMC",
  description:
    "Experience premium spa, barbershop, and wellness services at Ngan Ha. Located at 11 Ngo Duc Ke & 6B Thi Sach, District 1, Ho Chi Minh City. Book online now!",
  keywords: [
    "spa district 1",
    "barbershop HCMC",
    "Ngan Ha Spa",
    "massage Saigon",
    "ear cleaning spa",
    "đặt lịch spa",
    "spa Quận 1",
  ],
  openGraph: {
    title: "Ngân Hà Barbershop & Spa",
    description: "Premium Spa & Barbershop in District 1, HCMC",
    type: "website",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
