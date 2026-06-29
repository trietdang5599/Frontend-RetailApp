import type { ProductStatus } from '../../types';
import { ProductStatusLabel, ProductStatusColor } from '../../types';

export default function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`badge ${ProductStatusColor[status]}`}>
      {ProductStatusLabel[status]}
    </span>
  );
}
