"use client";

import { useState } from "react";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import DiscountBadge from "@/app/_components/discount-badge";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { Button } from "@/app/_components/ui/button";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import { Card } from "@/app/_components/ui/card";
import ProductList from "@/app/_components/products-list";

interface ProductDetailProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetail = ({
  product,
  complementaryProducts,
}: ProductDetailProps) => {
  const [amount, setAmount] = useState(1);

  const handleIncreaseAmount = () =>
    setAmount((currentState) => currentState + 1);

  const handleDecreaseAmount = () =>
    setAmount((currentState) => {
      return currentState > 1 ? currentState - 1 : currentState;
    });

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white py-5">
      {/* title and price  */}
      <div className="px-6">
        {/* name */}
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6">
            <Image
              src={product.restaurant.imageUrl}
              alt={product.restaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <span className="text-xs text-muted-foreground">
            {product.restaurant.name}
          </span>
        </div>

        {/* Product name */}
        <h1 className="mb-2 mt-1 text-xl font-semibold">{product.name}</h1>

        {/* Price and amount */}
        <div className="flex items-center justify-between">
          <div>
            {/* Price */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {formatCurrency(calculateProductTotalPrice(product))}
              </h2>

              {!!product.discountPercentage && (
                <DiscountBadge
                  discountPercentage={product.discountPercentage}
                />
              )}
            </div>

            {!!product.discountPercentage && (
              <p className="text-sm text-muted-foreground">
                De: {formatCurrency(Number(product.price))}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="flex items-center gap-3 text-center">
            <Button
              size="icon"
              variant="ghost"
              className="border border-solid border-muted-foreground"
              onClick={handleDecreaseAmount}
            >
              <ChevronLeftIcon />
            </Button>
            <span className="w-4">{amount}</span>
            <Button size="icon" onClick={handleIncreaseAmount}>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        {/* Delivery */}
        <Card className="mt-6 flex justify-around py-3">
          {/* Cost  */}
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">Entrega</span>
                <BikeIcon size={14} />
              </div>

              {Number(product.restaurant.deliveryFee) > 0 ? (
                <p className="text-xs font-semibold">
                  {formatCurrency(Number(product.restaurant.deliveryFee))}
                </p>
              ) : (
                <p className="text-xs font-semibold">Grátis</p>
              )}
            </div>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">Entrega</span>
                <TimerIcon size={14} />
              </div>

              {Number(product.restaurant.deliveryTimeMinutes) > 0 ? (
                <p className="text-xs font-semibold">
                  {Number(product.restaurant.deliveryTimeMinutes)}min
                </p>
              ) : (
                <p className="text-xs font-semibold">Grátis</p>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">Sobre</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">Sucos</h3>
          <ProductList products={complementaryProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
