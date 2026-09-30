import ConsumerLayout from './ConsumerLayout.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { wishlistService } from '../../services/wishlistService.js';
import WishlistCard from '../../components/wishlist/WishlistCard.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function Wishlist() {
  const { data, loading, setData } = useFetch(() => wishlistService.list(), []);

  async function remove(id) {
    await wishlistService.remove(id);
    setData(data.filter((item) => item._id !== id));
  }

  return (
    <ConsumerLayout>
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {(data || []).map((item) => (
            <WishlistCard key={item._id} item={item} onRemove={remove} />
          ))}
          {!data?.length && <p className="muted">Your wishlist is empty.</p>}
        </div>
      )}
    </ConsumerLayout>
  );
}
