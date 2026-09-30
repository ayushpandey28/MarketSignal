import Navbar from '../../components/common/Navbar.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';

const items = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/app/profile', label: 'Profile' },
];

export default function AdminShell({ children }) {
  return (
    <div>
      <Navbar />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        <Sidebar items={items} />
        <div className="flex-1 space-y-4">{children}</div>
      </div>
    </div>
  );
}
