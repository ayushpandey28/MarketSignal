import Navbar from '../../components/common/Navbar.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import { useAppContext } from '../../context/AppContext.jsx';

const items = [
  { to: '/app', label: 'Overview' },
  { to: '/app/wishlist', label: 'Wishlist' },
  { to: '/app/alerts', label: 'Price alerts' },
  { to: '/app/interests', label: 'My interests' },
  { to: '/app/profile', label: 'Profile' },
];

export default function ConsumerLayout({ children }) {
  const { notice } = useAppContext();
  return (
    <div>
      <Navbar />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        <Sidebar items={items} />
        <div className="flex-1 space-y-4">
          {notice && <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{notice}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
