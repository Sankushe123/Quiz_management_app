import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import axios from "axios";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quiz Platform",
  description: "Create and take quizzes easily",
};

export default function RootLayout({ children }) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log('axios.defaults.baseURL', axios.defaults.baseURL);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
