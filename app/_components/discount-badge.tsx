import { ArrowDownIcon } from "lucide-react";

interface DiscountBadgeProps {
  discountPercentage: number;
}

const DiscountBadge = ({ discountPercentage }: DiscountBadgeProps) => {
  return (
    <div className="flex items-center rounded-full bg-primary px-2 py-0.5">
      <ArrowDownIcon size={12} className="text-white" />
      <span className="text-sm font-semibold text-white">
        {discountPercentage}%
      </span>
    </div>
  );
};

export default DiscountBadge;
