import Sidebar from '../common/Sidebar.jsx';

const items = [
  { to: '/seller', label: 'Overview' },
  { to: '/seller/opportunities', label: 'Opportunities' },
  { to: '/seller/inventory', label: 'Inventory' },
  { to: '/seller/products', label: 'Products' },
  { to: '/seller/analytics', label: 'Analytics' },
  { to: '/app/profile', label: 'Profile' },
];

export default function SellerSidebar() {
  return <Sidebar items={items} />;
}
