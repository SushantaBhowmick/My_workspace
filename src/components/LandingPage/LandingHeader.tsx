"use client"
import { Button } from "@/components/ui/button";
import { Home, Info, Phone, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full shadow-sm bg-white border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-2">
          <Home className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-lg">MyApp</span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
            Contact
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
            <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="flex items-center">
              <LogIn className="w-4 h-4 mr-1" /> Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
