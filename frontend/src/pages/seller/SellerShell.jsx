import Navbar from '../../components/common/Navbar.jsx';
import SellerSidebar from '../../components/seller/SellerSidebar.jsx';

export default function SellerShell({ children }) {
  return (
    <div>
      <Navbar />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        <SellerSidebar />
        <div className="flex-1 space-y-4">{children}</div>
      </div>
    </div>
  );
}
