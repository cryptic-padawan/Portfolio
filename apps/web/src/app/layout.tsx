import type { Metadata } from "next";
import { Cinzel, DM_Sans } from "next/font/google";
import "./globals.css";
import { AudioConsentGate } from "@/components/ui/AudioConsentGate";
import { AmbientAudio } from "@/components/audio/AmbientAudio";
import { DeviceTierProvider } from "@/components/providers/DeviceTierProvider";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sahil Verma · Archipelago of Arcanum",
  description:
    "Fantasy portfolio hub — resume, contact, and mini-games on the Archipelago of Arcanum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased">
        <DeviceTierProvider>
          <AudioConsentGate />
          <AmbientAudio />
          {children}
        </DeviceTierProvider>
      </body>
    </html>
  );
}
