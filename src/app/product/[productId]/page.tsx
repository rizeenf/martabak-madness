import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { singleProduct } from "@/config/type";
import Image from "next/image";
import React from "react";
type ParamsProps = {
  params: {
    productId: string;
  };
};

const ProductId = ({ params }: ParamsProps) => {
  const { productId } = params;

  return (
    <MaxWidthWrapper className="flex h-screen justify-center items-center">
      <div className="flex flex-row mt-10">
        <div className="left flex flex-1">
          {singleProduct.img && (
            <Image
              src={singleProduct.img}
              alt={singleProduct.title}
              width={400}
              height={400}
            />
          )}
        </div>
        <div className="right flex flex-col flex-1 w-full">
          <h1 className="text-4xl font-semibold">{singleProduct.title}</h1>
          <p>{singleProduct.desc}</p>
          <h3 className="font-semibold text-xl">{singleProduct.price}</h3>
          <div className="flex flex-row gap-5">
            {singleProduct.options?.map((item) => (
              <div key={item.title} className="p-2 ">
                <Button className="font-semibold bg-amber-900">
                  {item.title}
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
