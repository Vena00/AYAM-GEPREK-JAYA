import { MenuItem, CustomerReview, ExtraItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'geprek-original',
    name: 'Ayam Geprek Original Jaya',
    description: 'Ayam goreng krispi renyah yang digeprek dengan sambal bawang khas Jaya yang pedas gurih mantap.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'geprek',
    isSpicy: true,
    spicyLevelCustomizable: true,
    tags: ['Terlaris', 'Sambal Bawang']
  },
  {
    id: 'geprek-mozarella',
    name: 'Ayam Geprek Mozzarella Melt',
    description: 'Ayam geprek krispi dibalut dengan lelehan keju mozzarella molor yang dibakar sempurna, meredam pedas jadi gurih.',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // rich pizza/cheese look
    category: 'geprek',
    isSpicy: true,
    spicyLevelCustomizable: true,
    tags: ['Premium', 'Keju Molor']
  },
  {
    id: 'geprek-keju',
    name: 'Ayam Geprek Keju Parut',
    description: 'Ayam geprek pedas original dengan taburan keju cheddar parut melimpah yang memberikan rasa asin gurih.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'geprek',
    isSpicy: true,
    spicyLevelCustomizable: true,
    tags: ['Favorit']
  },
  {
    id: 'geprek-sambal-ijo',
    name: 'Ayam Geprek Sambal Ijo',
    description: 'Ayam geprek renyah disajikan dengan sambal cabe ijo ulek segar yang wangi daun jeruk dan jeruk limau asli.',
    price: 19000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'geprek',
    isSpicy: true,
    spicyLevelCustomizable: true,
    tags: ['Segar', 'Aroma Jeruk']
  },
  {
    id: 'geprek-saus-telur-asin',
    name: 'Ayam Geprek Saus Telur Asin',
    description: 'Ayam geprek original disiram dengan saus salted egg premium yang kental, creamy, gurih, dan sedap.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'geprek',
    isSpicy: true,
    spicyLevelCustomizable: true,
    tags: ['Creamy', 'Gurih']
  },
  {
    id: 'paket-jaya-hemat',
    name: 'Paket Jaya Hemat',
    description: 'Nasi Putih Hangat + Ayam Geprek Original Jaya + Es Teh Manis Jumbo. Kombinasi komplit paling ramah kantong!',
    price: 23000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'package',
    isSpicy: true,
    spicyLevelCustomizable: true,
    tags: ['Paling Laris', 'Hemat']
  },
  {
    id: 'paket-jaya-kenyang',
    name: 'Paket Jaya Kenyang Mozza',
    description: 'Nasi Putih + Ayam Geprek Mozzarella + Tahu Goreng + Tempe Goreng + Es Jeruk Peras Segar. Dijamin kenyang puas!',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'package',
    isSpicy: true,
    spicyLevelCustomizable: true,
    tags: ['Puas', 'Komplit']
  },
  {
    id: 'sides-kol-goreng',
    name: 'Kol Goreng Krispi',
    description: 'Kubis/kol goreng yang digoreng garing hingga kecokelatan, rasanya manis gurih renyah pelengkap wajib geprek.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'sides',
    isSpicy: false,
    tags: ['Wajib Coba']
  },
  {
    id: 'sides-tahu-tempe',
    name: 'Tahu & Tempe Geprek',
    description: 'Satu porsi tahu dan tempe goreng krispi yang digeprek lembut dengan sentuhan sambal bawang gurih.',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'sides',
    isSpicy: true,
    spicyLevelCustomizable: true
  },
  {
    id: 'sides-kulit-krispi',
    name: 'Kulit Ayam Goreng Krispi',
    description: 'Kulit ayam pilihan yang dimarinasi bumbu rahasia lalu digoreng super garing renyah. Nagih banget!',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'sides',
    isSpicy: false,
    tags: ['Garing']
  },
  {
    id: 'drinks-es-teh',
    name: 'Es Teh Manis Jumbo',
    description: 'Teh manis seduh dingin yang disajikan segar dalam gelas ukuran jumbo. Penawar pedas legendaris.',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'drinks',
    isSpicy: false,
    tags: ['Segar']
  },
  {
    id: 'drinks-es-jeruk',
    name: 'Es Jeruk Peras',
    description: 'Dibuat dari buah jeruk peras segar pilihan dengan pemanis gula tebu murni dan es batu melimpah.',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'drinks',
    isSpicy: false
  },
  {
    id: 'drinks-susu-dingin',
    name: 'Susu Dingin Netralisir',
    description: 'Susu putih segar murni dingin yang sangat ampuh meredakan kepedasan ekstrem di lidah Anda secara instan.',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'drinks',
    isSpicy: false,
    tags: ['Pereda Pedas']
  }
];

export const EXTRAS_OPTIONS: ExtraItem[] = [
  { name: 'Nasi Putih Tambahan', price: 5000 },
  { name: 'Ekstra Mozzarella Melt', price: 8000 },
  { name: 'Ekstra Keju Parut Cheddar', price: 5000 },
  { name: 'Ekstra Sambal Bawang (Level +3)', price: 3000 },
  { name: 'Telor Ceplok Setengah Matang', price: 4000 },
  { name: 'Pete Goreng Gurih', price: 6000 }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Budi Santoso',
    rating: 5,
    comment: 'Gila sih ini ayam gepreknya bener-bener garing luar dalam! Sambal bawang level 5 udah bikin mandi keringat tapi nagih banget. Mozzarella-nya melimpah!',
    date: '2026-07-01',
    spicyLevel: 5,
    orderedItem: 'Ayam Geprek Mozzarella Melt'
  },
  {
    id: 'rev-2',
    name: 'Siti Rahmawati',
    rating: 5,
    comment: 'Pesen Paket Hemat Jaya buat makan siang di kantor, porsinya pas banget kenyang dan es teh jumbonya beneran jumbo! Sambal ijonya seger banget.',
    date: '2026-07-03',
    spicyLevel: 3,
    orderedItem: 'Paket Jaya Hemat'
  },
  {
    id: 'rev-3',
    name: 'Adi Prasetyo',
    rating: 4,
    comment: 'Sangat terbantu sama fitur rekomendasi AI buat nentuin level pedas! Dicocokin sama mood saya yang lagi stres, disuruh makan level 7 plus kol goreng garing. Mantap pol!',
    date: '2026-07-04',
    spicyLevel: 7,
    orderedItem: 'Ayam Geprek Original Jaya'
  },
  {
    id: 'rev-4',
    name: 'Jessica Clarissa',
    rating: 5,
    comment: 'Ayam Geprek Saus Telur Asinnya juara banget. Creamy tapi pedesnya tetep berasa. Kulit krispinya juga super renyah gak alot.',
    date: '2026-07-04',
    spicyLevel: 2,
    orderedItem: 'Ayam Geprek Saus Telur Asin'
  }
];
