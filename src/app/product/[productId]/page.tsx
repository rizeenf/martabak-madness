'use client'
import Loading from "@/app/loading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { singleProduct } from "@/config/type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
type ParamsProps = {
  params: {
    productId: string;
  };
};

const ProductId = ({ params }: ParamsProps) => {
  const { productId } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`)
        .then((res) =>
          res.json()
        ),
  });

  console.log({ productId })
  console.log({ data })

  if (isLoading) return <Loading />;

  return (
    <MaxWidthWrapper className="flex h-screen justify-center items-center">
      <div className="flex flex-row mt-10">
        <div className="left flex flex-1">
          {data.img && (
            <Image
              src={data.img}
              alt={data.title}
              width={400}
              height={400}
            />
          )}
        </div>
        <div className="right flex flex-col flex-1 w-full">
          <h1 className="text-4xl font-semibold">{data.title}</h1>
          <p>{data.desc}</p>
          <h3 className="font-semibold text-xl">{data.price}</h3>
          <div className="flex flex-row gap-5">
            {data?.options?.map((item: any) => (
              <div key={item.type} className="p-2 ">
                <Button className="font-semibold bg-amber-900 capitalize">
                  {item.type}
                </Button>
              </div>
            ))}
          </div>
          <div className="flex w-full flex-1 justify-between gap-5 items-center">
            <div className="flex flex-row w-full justify-between items-center">
              <span>Quantity</span>
              <div className="flex flex-row gap-5 items-center">
                <Button>-</Button>
                <span>1</span>
                <Button>+</Button>
              </div>
            </div>

            <Button>Tambah ke keranjang</Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductId;
