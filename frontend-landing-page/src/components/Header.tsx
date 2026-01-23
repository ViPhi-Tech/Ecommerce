'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">TechStore</h1>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link href="/produtos" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Produtos
            </Link>
            <Link href="/categorias" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Categorias
            </Link>
            <Link href="/sobre" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Sobre
            </Link>
            <Link href="/contato" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Contato
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-700 hover:text-primary-600">
              <Search className="h-5 w-5" />
            </button>

            {/* User */}
            <button className="p-2 text-gray-700 hover:text-primary-600">
              <User className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button className="p-2 text-gray-700 hover:text-primary-600 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-700 hover:text-primary-600">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}