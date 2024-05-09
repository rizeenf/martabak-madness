import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { MenuType, MenusType } from "@/config/type";
import { useFetchServer } from "@/hooks/useFetchServer";

const fetchData = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Error while fetch menus.");
  }

  return res.json();
};

const Menu = async () => {
  const menu: MenusType = await fetchData();

  return (
    <MaxWidthWrapper className="min-h-screen h-full flex items-center justify-center">
      <div className="flex flex-col lg:flex-row justify-center items-center ">
        {menu.map((product, idx) => (
          <Link
            key={product.id}
            href={`/menu/${product.slug}`}
            className="flex flex-row hover:opacity-70 "
          >
            <div
              className={cn(
                "flex flex-col justify-around flex-1 px-5 ",
                idx % 2 == 0 ? "bg-amber-800 text-white" : "border"
              )}
            >
              <h1 className="font-semibold text-xl ">{product.title}</h1>
              <p className="line-clamp-2 text-xs">{product.desc}</p>
              <Button className="border">Explore</Button>
            </div>
            <div className="flex-1 relative ">
              {product.img && (
                <Image
                  className="object-cover aspect-square h-56 w-56"
                  alt="Menu Image"
                  src={product.img}
                  width={200}
                  height={200}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default Menu;
