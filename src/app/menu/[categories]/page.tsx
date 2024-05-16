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

  console.log({ data })

  return (
    <MaxWidthWrapper className="flex flex-row flex-wrap gap-2 items-center justify-evenly mt-10">
      {data?.map((product, idx) => (
        <Product product={product} index={idx} key={idx} />
      ))}
    </MaxWidthWrapper>
  );
};

export default Categories;
