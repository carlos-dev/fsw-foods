import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/app/_components/delilery-info";
import ProductList from "@/app/_components/products-list";

interface RestaurantPageProps {
  params: {
    id: string;
  };
}
const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      id: params.id,
    },
    include: {
      categories: {
        orderBy: {
          name: "asc",
        },
        include: {
          products: {
            where: {
              restaurantId: params.id,
            },
            include: {
              restaurant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      products: {
        take: 10,
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return notFound();
  }

  return (
    <div>
      <RestaurantImage restaurant={restaurant} />

      <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white p-5">
        <div className="flex items-center justify-between">
          {/* title */}
          <div className="flex items-center gap-1">
            <div className="relative h-8 w-8">
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                className="rounded-full object-cover"
              />
            </div>

            <h1 className="text-xl font-semibold">{restaurant.name}</h1>
          </div>

          <div className="flex items-center gap-[3px] rounded-full bg-foreground px-2 py-0.5 text-white">
            <StarIcon size={12} className="fill-yellow-500 text-yellow-400" />
            <span className="text-sm font-semibold">5.0</span>
          </div>
        </div>

        <DeliveryInfo restaurant={restaurant} />

        <div className="mt-3 flex gap-4 overflow-x-scroll scrollbar-thin">
          {restaurant.categories.map((category) => (
            <div
              key={category.id}
              className="min-w-[167px] rounded-lg bg-[#e5e5e5] text-center"
            >
              <span className="block py-1 text-xs text-muted-foreground">
                {category.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <h2 className="font-semibold">Mais pedidos</h2>

          <ProductList products={restaurant.products} />
        </div>

        {restaurant.categories.map((category) => (
          <div className="mt-6 space-y-4" key={category.id}>
            <h2 className="font-semibold">{category.name}</h2>

            <ProductList products={category.products} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;
