import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Product } from "@/config/type";
import { useFetchServer } from "@/hooks/useFetchServer";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type ParamsProps = {
  params: {
    categories: string;
  };
};

const Categories = async ({ params }: ParamsProps) => {
  const { categories } = params;

  const data: Product[] = await useFetchServer(
    `products?category=${categories}`
  );

  return (
    <MaxWidthWrapper className="flex flex-row flex-wrap gap-5 items-center justify-evenly mt-10">
      {data?.map((product) => (
        <div key={product.id} className="flex flex-col gap-2 p-5 border">
          <div className="relative aspect-square h-[16rem] w-[16rem] min-w-fit overflow-hidden rounded">
            {product.img && (
              <Image
                alt={product.title}
                src={product.img}
                fill
                className="absolute object-cover"
              />
            )}
          </div>
          <div className="flex flexrow justify-between">
            <div>
              <h1>{product.title}</h1>
              <span>{formatPrice(product.price)}</span>
            </div>
            <Link href={`/product/${product.id}`}>
              <Button>Beli</Button>
            </Link>
          </div>
        </div>
      ))}
    </MaxWidthWrapper>
  );
};

export default Categories;
