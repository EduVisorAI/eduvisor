import type { Metadata } from "next";
import { Amiko } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/contexts/authContext";
import { AIContextProvider } from "./lib/contexts/ai-context";

const amiko = Amiko({
  subsets: ["latin"],
  weight: ["400", "600", "700"]
});

export const metadata: Metadata = {
  title: "EduVisor AI",
  description: "EduVisor AI"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={amiko.className}>
        <AuthProvider>
          <AIContextProvider>{children}</AIContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
