import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">TechStore</h3>
            <p className="text-gray-300 mb-4">
              Sua loja de tecnologia completa com os melhores produtos e preços do mercado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-gray-300 hover:text-primary-400">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-300 hover:text-primary-400">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-primary-400">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Atendimento</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-primary-400">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-primary-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="text-gray-300 hover:text-primary-400">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-gray-300 hover:text-primary-400">
                  Garantia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-gray-300">(11) 9999-9999</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-gray-300">contato@techstore.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-gray-300">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 TechStore. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}