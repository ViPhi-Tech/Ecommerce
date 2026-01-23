import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 1,
    name: "Smartphone Galaxy Pro Max",
    price: 2999.99,
    originalPrice: 3499.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop"
    ],
    description: "O smartphone mais avançado com tecnologia de ponta, câmera profissional e performance excepcional.",
    category: "Eletrônicos",
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    featured: true,
    discount: 15,
    specifications: {
      "Tela": "6.7 polegadas OLED",
      "Processador": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Armazenamento": "256GB",
      "Câmera": "108MP + 12MP + 12MP",
      "Bateria": "5000mAh"
    }
  },
  {
    id: 2,
    name: "Notebook Gamer Ultra",
    price: 4599.99,
    originalPrice: 5299.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop"
    ],
    description: "Notebook gamer com placa de vídeo dedicada, ideal para jogos e trabalhos pesados.",
    category: "Informática",
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    featured: true,
    discount: 13,
    specifications: {
      "Processador": "Intel Core i7-13700H",
      "GPU": "RTX 4060 8GB",
      "RAM": "16GB DDR5",
      "Armazenamento": "512GB NVMe SSD",
      "Tela": "15.6\" Full HD 144Hz",
      "Sistema": "Windows 11"
    }
  },
  {
    id: 3,
    name: "Fone Bluetooth Premium",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop"
    ],
    description: "Fone de ouvido sem fio com cancelamento de ruído ativo e qualidade de som superior.",
    category: "Áudio",
    rating: 4.7,
    reviewCount: 342,
    inStock: true,
    featured: false,
    discount: 25,
    specifications: {
      "Conectividade": "Bluetooth 5.3",
      "Bateria": "30h com case",
      "Cancelamento": "ANC Ativo",
      "Drivers": "40mm dinâmicos",
      "Resistência": "IPX4",
      "Carregamento": "USB-C + Wireless"
    }
  },
  {
    id: 4,
    name: "Smart Watch Fitness",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop"
    ],
    description: "Relógio inteligente com monitoramento de saúde completo e GPS integrado.",
    category: "Wearables",
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    featured: false,
    specifications: {
      "Tela": "1.4\" AMOLED",
      "Bateria": "7 dias",
      "GPS": "Integrado",
      "Sensores": "Frequência cardíaca, SpO2, Sono",
      "Resistência": "5ATM",
      "Conectividade": "Bluetooth, WiFi"
    }
  },
  {
    id: 5,
    name: "Tablet Pro 12",
    price: 1799.99,
    originalPrice: 2199.99,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop"
    ],
    description: "Tablet profissional com tela de alta resolução, ideal para criação e produtividade.",
    category: "Tablets",
    rating: 4.4,
    reviewCount: 98,
    inStock: true,
    featured: true,
    discount: 18,
    specifications: {
      "Tela": "12.9\" Liquid Retina",
      "Processador": "M2 Chip",
      "RAM": "8GB",
      "Armazenamento": "256GB",
      "Câmera": "12MP + 10MP",
      "Conectividade": "WiFi 6E + 5G"
    }
  },
  {
    id: 6,
    name: "Console Next Gen",
    price: 2499.99,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=800&fit=crop"
    ],
    description: "Console de videogame de última geração com gráficos 4K e SSD ultra rápido.",
    category: "Games",
    rating: 4.9,
    reviewCount: 567,
    inStock: false,
    featured: true,
    specifications: {
      "CPU": "AMD Zen 2",
      "GPU": "RDNA 2",
      "RAM": "16GB GDDR6",
      "Armazenamento": "825GB SSD",
      "Resolução": "4K/120fps",
      "Ray Tracing": "Sim"
    }
  }
];