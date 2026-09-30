import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import ProductDetails from '../../components/products/ProductDetails.jsx';
import ProductInterestButton from '../../components/products/ProductInterestButton.jsx';
import WishlistButton from '../../components/wishlist/WishlistButton.jsx';
import PriceAlertModal from '../../components/alerts/PriceAlertModal.jsx';
import TrendExplanation from '../../components/ai/TrendExplanation.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { productService } from '../../services/productService.js';
import { signalService } from '../../services/demandService.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [demand, setDemand] = useState([]);
  const [error, setError] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setDemand([]);
    setError('');
    productService
      .get(id)
      .then((res) => {
        if (!active) return;
        setProduct(res.data.product);
        setDemand(res.data.demand);
        signalService.view({ productId: id, region: res.data.product.region }).catch(() => {});
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-10">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div>
        <Navbar />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container page-shell product-details-page">
        <ProductDetails product={product} demand={demand} />
        {user ? (
          <div className="product-detail-actions">
            <ProductInterestButton
              productId={product._id}
              count={product.interestCount}
              onChange={(n) => setProduct({ ...product, interestCount: n })}
            />
            <WishlistButton productId={product._id} />
            <Button variant="ghost" onClick={() => setAlertOpen(true)}>
              Set price alert
            </Button>
          </div>
        ) : (
          <p className="muted">Login to save wishlists, alerts, and interest.</p>
        )}
        {user && <TrendExplanation productId={product._id} />}
        <PriceAlertModal open={alertOpen} product={product} onClose={() => setAlertOpen(false)} />
      </main>
      <Footer />
    </div>
  );
}
