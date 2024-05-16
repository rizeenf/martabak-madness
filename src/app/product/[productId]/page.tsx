import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductPrice from "@/components/ProductPrice";
import { Product } from "@/config/type";
import Image from "next/image";
type ParamsProps = {
  params: {
    productId: string;
  };
};

const fetchData = async (productId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Error while getting product.");
  }

  return res.json();
};


const ProductId = async ({ params }: ParamsProps) => {
  const { productId } = params;
  const product: Product = await fetchData(productId);

  return (
    <MaxWidthWrapper className="flex h-screen justify-center items-center">
      <div className="flex flex-row mt-10 gap-10">
        <div className="left flex flex-1">
          <div className="relative aspect-square h-[30rem] w-[30rem] min-w-fit overflow-hidden rounded">
            {product.img && (
              <Image
                src={product.img}
                alt={product.title}
                width={480}
                height={480}
                className="absolute object-cover"
              />
            )}
          </div>
        </div>
        <ProductPrice product={product} />
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductId;
