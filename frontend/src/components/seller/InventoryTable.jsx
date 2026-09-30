import { formatPrice } from '../../utils/formatPrice.js';

export default function InventoryTable({ rows }) {
  if (!rows?.length) return <p className="muted">No inventory yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="p-2">Product</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-t border-white/10">
              <td className="p-2">{row.productId.name}</td>
              <td className="p-2">{formatPrice(row.price)}</td>
              <td className="p-2">{row.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
