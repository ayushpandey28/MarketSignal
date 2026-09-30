const { CATEGORIES } = require('./seedCategories');

const REGIONS = [
  'United States',
  'India',
  'Germany',
  'France',
  'Netherlands',
  'Spain',
  'Italy',
  'United Kingdom',
];

const PRODUCT_IMAGES = {
  'Portable Monitor 15.6"': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  'USB-C Docking Station': 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=900&q=80',
  'Mini Projector Pocket': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  'Noise Cancel Headset': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  'Standing Desk Converter': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'Mechanical Keyboard 75%': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
  'Compact Travel Backpack': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  'Smart LED Strip Kit': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'Resistance Band Set': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
  'Wireless Charging Pad': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
  'Gaming Mouse Lightweight': 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  'Folding Treadmill Mini': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
  'Portable SSD 1TB': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80',
  'Smart Thermostat Mini': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  'Yoga Mat Travel': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
  'Capture Card 4K60': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'Smart Door Sensor Pair': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
  'Power Bank 20000mAh': 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=900&q=80',
  'Desk Organizer Modular': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
};

const PRODUCTS = [
  { name: 'Portable Monitor 15.6"', category: 'Home Office', brand: 'NorthPixel', price: 249, stock: 40, region: 'India', competition: 'low' },
  { name: 'USB-C Docking Station', category: 'Accessories', brand: 'CableForge', price: 89, stock: 80, region: 'India', competition: 'medium' },
  { name: 'Mini Projector Pocket', category: 'Electronics', brand: 'LumenLite', price: 179, stock: 25, region: 'India', competition: 'high' },
  { name: 'Noise Cancel Headset', category: 'Electronics', brand: 'QuietArc', price: 129, stock: 60, region: 'United Kingdom', competition: 'medium' },
  { name: 'Standing Desk Converter', category: 'Home Office', brand: 'LiftHaus', price: 199, stock: 18, region: 'Netherlands', competition: 'low' },
  { name: 'Mechanical Keyboard 75%', category: 'Gaming', brand: 'Keysmith', price: 119, stock: 55, region: 'United States', competition: 'high' },
  { name: 'Compact Travel Backpack', category: 'Travel', brand: 'Packline', price: 74, stock: 90, region: 'Spain', competition: 'medium' },
  { name: 'Smart LED Strip Kit', category: 'Smart Home', brand: 'GlowNode', price: 39, stock: 120, region: 'Italy', competition: 'high' },
  { name: 'Resistance Band Set', category: 'Fitness', brand: 'Flexora', price: 29, stock: 150, region: 'Germany', competition: 'low' },
  { name: 'Ceramic Travel Mug', category: 'Lifestyle', brand: 'BrewCarry', price: 24, stock: 200, region: 'France', competition: 'low' },
  { name: 'Wireless Charging Pad', category: 'Accessories', brand: 'VoltNest', price: 34, stock: 110, region: 'United States', competition: 'medium' },
  { name: '4K Webcam Studio', category: 'Home Office', brand: 'FrameCast', price: 99, stock: 42, region: 'United Kingdom', competition: 'medium' },
  { name: 'Ergonomic Laptop Stand', category: 'Home Office', brand: 'AngleLab', price: 49, stock: 70, region: 'Netherlands', competition: 'low' },
  { name: 'Smart Plug 4-Pack', category: 'Smart Home', brand: 'Switchly', price: 45, stock: 95, region: 'Spain', competition: 'medium' },
  { name: 'Gaming Mouse Lightweight', category: 'Gaming', brand: 'SwiftClick', price: 59, stock: 88, region: 'Germany', competition: 'high' },
  { name: 'Folding Treadmill Mini', category: 'Fitness', brand: 'StrideBox', price: 399, stock: 12, region: 'United States', competition: 'medium' },
  { name: 'Packing Cube Set', category: 'Travel', brand: 'FoldTrip', price: 32, stock: 140, region: 'Italy', competition: 'low' },
  { name: 'Ambient Desk Lamp', category: 'Lifestyle', brand: 'HaloDesk', price: 54, stock: 64, region: 'France', competition: 'low' },
  { name: 'Portable SSD 1TB', category: 'Electronics', brand: 'SwiftDrive', price: 109, stock: 50, region: 'United Kingdom', competition: 'medium' },
  { name: 'USB-C Hub 8-in-1', category: 'Accessories', brand: 'PortMesh', price: 42, stock: 130, region: 'Netherlands', competition: 'high' },
  { name: 'Smart Thermostat Mini', category: 'Smart Home', brand: 'ClimateBit', price: 129, stock: 22, region: 'Germany', competition: 'medium' },
  { name: 'Yoga Mat Travel', category: 'Fitness', brand: 'Groundline', price: 36, stock: 100, region: 'Spain', competition: 'low' },
  { name: 'Neck Pillow Memory Foam', category: 'Travel', brand: 'RestMiles', price: 28, stock: 160, region: 'United States', competition: 'medium' },
  { name: 'Aroma Diffuser Quiet', category: 'Lifestyle', brand: 'MistHouse', price: 31, stock: 75, region: 'Italy', competition: 'low' },
  { name: 'Capture Card 4K60', category: 'Gaming', brand: 'StreamForge', price: 149, stock: 20, region: 'France', competition: 'medium' },
  { name: 'Document Scanner Portable', category: 'Home Office', brand: 'PaperPath', price: 159, stock: 16, region: 'United Kingdom', competition: 'low' },
  { name: 'Smart Door Sensor Pair', category: 'Smart Home', brand: 'Latchly', price: 27, stock: 85, region: 'Netherlands', competition: 'medium' },
  { name: 'Ankle Weight Pair', category: 'Fitness', brand: 'Loadform', price: 22, stock: 90, region: 'Germany', competition: 'low' },
  { name: 'Power Bank 20000mAh', category: 'Travel', brand: 'ChargeArc', price: 48, stock: 77, region: 'Spain', competition: 'high' },
  { name: 'Desk Organizer Modular', category: 'Lifestyle', brand: 'Gridly', price: 33, stock: 68, region: 'United States', competition: 'low' },
  { name: 'Wireless Presenter Clicker', category: 'Accessories', brand: 'SlideCue', price: 26, stock: 58, region: 'Italy', competition: 'medium' },
  { name: 'Compact Mechanical Numpad', category: 'Gaming', brand: 'Keysmith', price: 44, stock: 40, region: 'France', competition: 'low' },
];

function productDocs(sellerId) {
  return PRODUCTS.map((item) => ({
    ...item,
    imageUrl: PRODUCT_IMAGES[item.name] || '',
    images: [PRODUCT_IMAGES[item.name] || ''],
    description: `Sample catalog item in ${item.category}. Demo data for MarketSignal — not a live marketplace listing.`,
    seller: sellerId,
    interestCount: 0,
    isActive: true,
    isDemo: true,
  }));
}

module.exports = { PRODUCTS, REGIONS, CATEGORIES, productDocs };
