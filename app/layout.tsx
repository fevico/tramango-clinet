import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux/provider";

export const metadata: Metadata = {
  title: "Wanderlust | Luxury Travel Packages & Booking",
  description: "Explore world-class travel packages and book your next unforgettable journey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
