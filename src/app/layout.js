import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { AuthProvider } from '@/context/authcontext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Course Enrollment",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
