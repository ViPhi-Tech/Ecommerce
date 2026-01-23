import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-petroil-slate via-petroil-blue to-petroil-slate text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 py-2.5">
            <div className="flex items-center gap-4 md:gap-8">
              <a href="tel:+554132431821" className="group flex items-center gap-2 hover:text-petroil-green transition-all duration-300">
                <div className="w-7 h-7 rounded-full bg-petroil-green/20 flex items-center justify-center group-hover:bg-petroil-green/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-3.5 h-3.5 text-petroil-green">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="flex flex-col leading-tight"><span className="font-bold text-sm">(41) 3243-1821</span><span className="text-[10px] uppercase tracking-wider text-petroil-green">Vendas</span></div>
              </a>
              <div className="w-px h-8 bg-primary-foreground/20 hidden md:block"></div>
              <a href="https://wa.me/5541999690660" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-petroil-green transition-all duration-300">
                <div className="w-7 h-7 rounded-full bg-petroil-green/20 flex items-center justify-center group-hover:bg-petroil-green/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-3.5 h-3.5 text-petroil-green">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="flex flex-col leading-tight"><span className="font-bold text-sm">(41) 99969-0660</span><span className="text-[10px] uppercase tracking-wider text-petroil-green">WhatsApp</span></div>
              </a>
            </div>
            <div className="hidden lg:flex items-center gap-6 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-4 h-4 text-petroil-green">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Av. Água Verde 1280, Água Verde - Curitiba/PR</span>
              </div>
              <div className="w-px h-6 bg-primary-foreground/20"></div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-petroil-green">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Seg-Sex: 8h às 12h | 13h às 18h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="fixed top-[52px] left-0 right-0 z-50 transition-all duration-300 bg-transparent py-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 bg-primary-foreground/20 backdrop-blur-sm"><span className="font-display text-xl font-bold text-primary-foreground">P</span></div>
              <span className="font-display text-xl font-bold transition-colors duration-300 text-primary-foreground">Petroil</span>
            </a>
            <nav className="hidden md:flex items-center gap-8"><a href="#" className="font-medium transition-colors duration-300 hover:text-petroil-green text-primary-foreground/90">Início</a><a href="#sobre" className="font-medium transition-colors duration-300 hover:text-petroil-green text-primary-foreground/90">Sobre</a><a href="#produtos" className="font-medium transition-colors duration-300 hover:text-petroil-green text-primary-foreground/90">Produtos</a><a href="#beneficios" className="font-medium transition-colors duration-300 hover:text-petroil-green text-primary-foreground/90">Benefícios</a><a href="#contato" className="font-medium transition-colors duration-300 hover:text-petroil-green text-primary-foreground/90">Contato</a></nav>
            <div className="hidden md:block"><button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 shadow-petroil-accent hover:shadow-lg hover:-translate-y-0.5 font-bold h-10 px-5 py-2">Seja Parceiro</button></div>
            <button className="md:hidden p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu w-6 h-6 text-primary-foreground">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/src/assets/hero-image.jpg" width={1000} height={1000} alt="Petroil Aditivos - Tecnologia e Sustentabilidade" className="w-full h-full object-cover"></Image>
            <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 pt-32 md:pt-36">
            <div className="max-w-3xl">
              <div className="animate-fade-in"><span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/90 text-sm font-medium mb-6 backdrop-blur-sm"><span className="w-2 h-2 rounded-full bg-petroil-green animate-pulse"></span>Desde 2011 desenvolvendo soluções de alta performance</span></div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">Tecnologia e<span className="block text-gradient-hero">Sustentabilidade</span>em Aditivos Automotivos</h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl leading-relaxed animate-slide-up delay-200">Formulações exclusivas de base orgânica que entregam performance superior, proteção anticorrosiva e resultados que fidelizam seus clientes.</p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 shadow-petroil-accent hover:shadow-lg hover:-translate-y-0.5 font-bold h-14 rounded-xl px-10 text-lg">
                  Conheça Nossos Produtos
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 h-14 rounded-xl px-10 text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-5 h-5">
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                  Assista ao Vídeo
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20 animate-fade-in delay-500">
                <div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">13+</p>
                  <p className="text-primary-foreground/70 text-sm">Anos de Mercado</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">100%</p>
                  <p className="text-primary-foreground/70 text-sm">Base Orgânica</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">500+</p>
                  <p className="text-primary-foreground/70 text-sm">Parceiros Ativos</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
        </section>
        <section id="sobre" className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-petroil-light to-transparent opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-up">
                <span className="inline-block px-4 py-2 rounded-full bg-petroil-green-light text-petroil-green font-semibold text-sm mb-6">Quem Somos</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Tradição e Inovação desde <span className="text-petroil-blue">2011</span></h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">A <strong className="text-foreground">Petroil Aditivos</strong> é uma empresa curitibana que nasceu com a missão de desenvolver e comercializar aditivos automotivos e industriais de alta qualidade. Com mais de 13 anos de experiência, nos tornamos referência no mercado pela excelência de nossos produtos e comprometimento com nossos parceiros.</p>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">Utilizamos <strong className="text-petroil-green">formulações exclusivas de base orgânica de origem vegetal</strong>, unindo tecnologia avançada e sustentabilidade para entregar produtos que realmente fazem a diferença no desempenho e na proteção de veículos leves, pesados e equipamentos industriais.</p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-petroil-blue/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history w-6 h-6 text-petroil-blue">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M12 7v5l4 2"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-foreground mb-1">Experiência Comprovada</h4>
                      <p className="text-muted-foreground">Mais de uma década desenvolvendo soluções para o mercado automotivo e industrial.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-petroil-green/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf w-6 h-6 text-petroil-green">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-foreground mb-1">Compromisso Sustentável</h4>
                      <p className="text-muted-foreground">Formulações de base orgânica vegetal que respeitam o meio ambiente.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-petroil-gold/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target w-6 h-6 text-petroil-gold">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-foreground mb-1">Foco no Resultado</h4>
                      <p className="text-muted-foreground">Produtos que entregam performance, proteção e fidelização de clientes.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative animate-scale-in delay-200">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-petroil-blue via-petroil-deep to-petroil-green p-1">
                  <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-petroil-light to-transparent opacity-50"></div>
                    <div className="relative text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center"><span className="font-display text-5xl font-bold text-primary-foreground">P</span></div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-2">Petroil Aditivos</h3>
                      <p className="text-muted-foreground">Curitiba, PR - Brasil</p>
                      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-petroil-green/10 text-petroil-green text-sm font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf w-4 h-4">
                          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                        </svg>
                        Tecnologia Orgânica
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-petroil-green/20 animate-float"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-petroil-blue/20 animate-float delay-300"></div>
              </div>
            </div>
          </div>
        </section>
        <section id="produtos" className="py-24 bg-gradient-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <span className="inline-block px-4 py-2 rounded-full bg-petroil-green-light text-petroil-green font-semibold text-sm mb-4">Nossa Linha Completa</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Produtos de <span className="text-gradient-hero">Alta Performance</span></h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Conheça nossa linha completa de aditivos desenvolvidos com tecnologia avançada e formulações exclusivas de base orgânica.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-card rounded-2xl overflow-hidden shadow-petroil-md card-hover animate-slide-up delay-100">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <Image src="/src/assets/product-radiator.jpg" width={500} height={500} alt="Aditivos de Radiador" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"></Image>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-petroil-green/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplets w-6 h-6 text-petroil-green">
                        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                        <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
                      </svg>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">Aditivos de Radiador</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">Proteção anticorrosiva avançada com base orgânica de origem vegetal. Compatível com todos os tipos de radiadores e sistemas de arrefecimento.</p>
                  <div className="flex flex-wrap gap-2"><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Proteção prolongada</span><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Base orgânica</span><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Anticongelante</span></div>
                </div>
              </div>
              <div className="group bg-card rounded-2xl overflow-hidden shadow-petroil-md card-hover animate-slide-up delay-200">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <Image src="/src/assets/product-fuel.jpg" width={500} height={500} alt="Aditivos de Combustível" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"></Image>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-petroil-green/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-fuel w-6 h-6 text-petroil-green">
                        <line x1="3" x2="15" y1="22" y2="22"></line>
                        <line x1="4" x2="14" y1="9" y2="9"></line>
                        <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"></path>
                        <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"></path>
                      </svg>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">Aditivos de Combustível</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">Formulações exclusivas que otimizam a combustão, reduzem o consumo e prolongam a vida útil do motor.</p>
                  <div className="flex flex-wrap gap-2"><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Maior eficiência</span><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Menor emissão</span><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Limpeza do sistema</span></div>
                </div>
              </div>
              <div className="group bg-card rounded-2xl overflow-hidden shadow-petroil-md card-hover animate-slide-up delay-300">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <Image src="/src/assets/product-decarbonizer.jpg" width={500} height={500} alt="Descarbonizantes" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"></Image>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-petroil-green/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cog w-6 h-6 text-petroil-green">
                        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                        <path d="M12 2v2"></path>
                        <path d="M12 22v-2"></path>
                        <path d="m17 20.66-1-1.73"></path>
                        <path d="M11 10.27 7 3.34"></path>
                        <path d="m20.66 17-1.73-1"></path>
                        <path d="m3.34 7 1.73 1"></path>
                        <path d="M14 12h8"></path>
                        <path d="M2 12h2"></path>
                        <path d="m20.66 7-1.73 1"></path>
                        <path d="m3.34 17 1.73-1"></path>
                        <path d="m17 3.34-1 1.73"></path>
                        <path d="m11 13.73-4 6.93"></path>
                      </svg>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">Descarbonizantes</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">Tecnologia avançada para remoção de depósitos de carbono, restaurando a performance original do motor.</p>
                  <div className="flex flex-wrap gap-2"><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Limpeza profunda</span><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Restaura potência</span><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Fácil aplicação</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-petroil-deep">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Aplicações Diversificadas</h2>
              <p className="text-primary-foreground/70 max-w-2xl mx-auto">Nossos produtos atendem uma ampla gama de aplicações, desde veículos de passeio até equipamentos industriais de grande porte.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group text-center p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300 animate-slide-up delay-100">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-petroil-green/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car w-8 h-8 text-petroil-green">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                    <circle cx="7" cy="17" r="2"></circle>
                    <path d="M9 17h6"></path>
                    <circle cx="17" cy="17" r="2"></circle>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">Veículos Leves</h3>
                <p className="text-primary-foreground/70">Carros de passeio, SUVs, pickups e motos. Proteção e performance para o dia a dia.</p>
              </div>
              <div className="group text-center p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300 animate-slide-up delay-200">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-petroil-green/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck w-8 h-8 text-petroil-green">
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                    <path d="M15 18H9"></path>
                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                    <circle cx="17" cy="18" r="2"></circle>
                    <circle cx="7" cy="18" r="2"></circle>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">Veículos Pesados</h3>
                <p className="text-primary-foreground/70">Caminhões, ônibus e tratores. Soluções robustas para alta demanda operacional.</p>
              </div>
              <div className="group text-center p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300 animate-slide-up delay-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-petroil-green/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-factory w-8 h-8 text-petroil-green">
                    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                    <path d="M17 18h1"></path>
                    <path d="M12 18h1"></path>
                    <path d="M7 18h1"></path>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">Aplicações Industriais</h3>
                <p className="text-primary-foreground/70">Máquinas e equipamentos industriais. Proteção confiável para sua produção.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="beneficios" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <span className="inline-block px-4 py-2 rounded-full bg-petroil-light text-petroil-blue font-semibold text-sm mb-4">Por Que Escolher a Petroil</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Diferenciais que <span className="text-petroil-green">Fazem a Diferença</span></h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Combinamos tecnologia de ponta, formulações exclusivas e compromisso com sustentabilidade para entregar os melhores resultados.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-petroil-green/30 transition-all duration-300 hover:shadow-petroil-md animate-slide-up delay-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-7 h-7 text-primary-foreground">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Proteção Superior</h3>
                <p className="text-muted-foreground leading-relaxed">Formulações que garantem proteção anticorrosiva de longa duração para seu motor e sistema de arrefecimento.</p>
              </div>
              <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-petroil-green/30 transition-all duration-300 hover:shadow-petroil-md animate-slide-up delay-200">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf w-7 h-7 text-primary-foreground">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Base Orgânica</h3>
                <p className="text-muted-foreground leading-relaxed">Produtos desenvolvidos com base orgânica de origem vegetal, unindo performance e sustentabilidade.</p>
              </div>
              <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-petroil-green/30 transition-all duration-300 hover:shadow-petroil-md animate-slide-up delay-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-7 h-7 text-primary-foreground">
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Alta Performance</h3>
                <p className="text-muted-foreground leading-relaxed">Tecnologia avançada que otimiza o desempenho do motor e reduz o consumo de combustível.</p>
              </div>
              <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-petroil-green/30 transition-all duration-300 hover:shadow-petroil-md animate-slide-up delay-400">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-7 h-7 text-primary-foreground">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6"></circle>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Qualidade Certificada</h3>
                <p className="text-muted-foreground leading-relaxed">Mais de 13 anos desenvolvendo aditivos com padrão de qualidade reconhecido no mercado.</p>
              </div>
              <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-petroil-green/30 transition-all duration-300 hover:shadow-petroil-md animate-slide-up delay-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-7 h-7 text-primary-foreground">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Agilidade no Atendimento</h3>
                <p className="text-muted-foreground leading-relaxed">Equipe dedicada para atender com rapidez as necessidades de clientes e parceiros.</p>
              </div>
              <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-petroil-green/30 transition-all duration-300 hover:shadow-petroil-md animate-slide-up delay-600">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-7 h-7 text-primary-foreground">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Parceria Duradoura</h3>
                <p className="text-muted-foreground leading-relaxed">Soluções completas que geram resultados e fidelização para distribuidores e revendedores.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-foreground blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-petroil-green blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-slide-up">Pronto para Elevar a Performance do Seu Negócio?</h2>
              <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up delay-100">Seja nosso parceiro e ofereça produtos de alta qualidade que geram resultados e fidelizam seus clientes. Entre em contato conosco!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up delay-200">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 shadow-petroil-accent hover:shadow-lg hover:-translate-y-0.5 font-bold h-14 rounded-xl px-10 text-lg">
                  Seja um Parceiro
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 h-14 rounded-xl px-10 text-lg">Solicitar Orçamento</button>
              </div>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-primary-foreground/80 animate-fade-in delay-300">
                <a href="tel:+554130000000" className="flex items-center gap-3 hover:text-primary-foreground transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-5 h-5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <span className="font-medium">(41) 3000-0000</span>
                </a>
                <a href="mailto:contato@petroil.com.br" className="flex items-center gap-3 hover:text-primary-foreground transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-5 h-5">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <span className="font-medium">contato@petroil.com.br</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="contato" className="bg-petroil-slate text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-petroil-blue to-petroil-green flex items-center justify-center"><span className="font-display text-2xl font-bold text-primary-foreground">P</span></div>
                <span className="font-display text-2xl font-bold text-primary-foreground">Petroil Aditivos</span>
              </div>
              <p className="text-primary-foreground/70 mb-6 max-w-md leading-relaxed">Desde 2011 desenvolvendo aditivos automotivos e industriais de alta qualidade com formulações exclusivas de base orgânica. Tecnologia, performance e sustentabilidade.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-petroil-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-5 h-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-petroil-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-petroil-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin w-5 h-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-lg mb-6">Links Rápidos</h4>
              <nav className="flex flex-col gap-3"><a href="#" className="text-primary-foreground/70 hover:text-petroil-green transition-colors">Início</a><a href="#sobre" className="text-primary-foreground/70 hover:text-petroil-green transition-colors">Sobre Nós</a><a href="#produtos" className="text-primary-foreground/70 hover:text-petroil-green transition-colors">Produtos</a><a href="#beneficios" className="text-primary-foreground/70 hover:text-petroil-green transition-colors">Benefícios</a><a href="#contato" className="text-primary-foreground/70 hover:text-petroil-green transition-colors">Contato</a></nav>
            </div>
            <div>
              <h4 className="font-display font-bold text-lg mb-6">Contato</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-5 h-5 text-petroil-green mt-0.5">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <p className="text-primary-foreground/70">Curitiba, Paraná<br/>Brasil</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-5 h-5 text-petroil-green">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <a href="tel:+554130000000" className="text-primary-foreground/70 hover:text-petroil-green transition-colors">(41) 3000-0000</a>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-5 h-5 text-petroil-green">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <a href="mailto:contato@petroil.com.br" className="text-primary-foreground/70 hover:text-petroil-green transition-colors">contato@petroil.com.br</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
            <p className="text-primary-foreground/50 text-sm">© 2026 Petroil Aditivos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}