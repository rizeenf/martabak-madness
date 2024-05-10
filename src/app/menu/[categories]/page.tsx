import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Product from "@/components/Product";
import type { Product as ProductTypes } from "@/config/type";

type ParamsProps = {
  params: {
    categories: string;
  };
};

const fetchData = async (categories: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?category=${categories}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Error while getting product.");
  }

  return res.json();
};


const Categories = async ({ params }: ParamsProps) => {
  const { categories } = params;
  const data: ProductTypes[] = await fetchData(categories);

  return (
    <MaxWidthWrapper className="flex flex-row flex-wrap gap-5 items-center justify-evenly mt-10">
      {data?.map((product, idx) => (
        <Product product={product} index={idx} key={idx} />
      ))}
    </MaxWidthWrapper>
  );
};

export default Categories;
