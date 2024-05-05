import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Product } from "@/config/type";
import { useFetchServer } from "@/hooks/useFetchServer";
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
    <MaxWidthWrapper className="flex flex-row flex-wrap gap-5">
      {data?.map((product) => (
        <div key={product.id} className="flex flex-col gap-2 p-5 border">
          {product.img && (
            <Image
              alt={product.title}
              src={product.img}
              width={300}
              height={300}
              className="aspect-square object-cover"
            />
          )}
          <div className="flex flexrow justify-between">
            <div>
              <h1>{product.title}</h1>
              <span>{product.price}</span>
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
