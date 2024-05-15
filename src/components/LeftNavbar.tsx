"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import ListItem from "./ListItem";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MenuType } from "@/config/type";


const LeftNavbar = () => {
  const { data, isLoading, error } = useQuery<MenuType[]>({
    queryKey: ["categories"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`).then((res) =>
        res.json()
      ),
  });


  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-amber-900">
            Home
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="relative aspect-square h-[14rem] w-[14rem] min-w-fit overflow-hidden rounded">
                    <Image
                      src={"/images/makanan/nasi-uduk.jpeg"}
                      alt="Martabak"
                        fill
                        className="absolute object-cover"
                      />
                    </div>
                    <div className="mb-2 mt-4 text-lg font-bold text-center">
                      Jualan Makanan
                    </div>
                    <p className="text-sm leading-tight text-justify text-muted-foreground line-clamp-6">
                      JualanMakanan adalah destinasi utama Anda untuk
                      menikmati dunia makanan yang lezat. Temukan beragam rasa
                      manis dan gurih, dengan berbagai pilihan topping yang
                      menggugah selera. Pesan dengan mudah melalui aplikasi
                      pengiriman makanan kami dan puaskan hasrat Anda akan
                      makanan Indonesia yang terkenal ini.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Tentang kami">
                Kenal lebih dekat dengan MartabakMadnes, Informasi mengenai
                kami, misi, nilai, dan sejarah kami.
              </ListItem>
              <ListItem href="/" title="Testimonial">
                Ulasan pelanggan atau testimoni tentang produk kami.
              </ListItem>
              <ListItem href="/" title="FAQ">
                Pertanyaan yang sering diajukan dan jawabannya.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-amber-900">
            Menu
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {data?.length && data?.map((item) => (
                <li className="row-span-3" key={item.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col  rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href={`/menu/${item.slug}`}
                    >
                      <div className="relative aspect-square h-[10rem] w-[10rem] min-w-fit overflow-hidden rounded">
                        {item.img &&
                          <Image
                          src={item.img}
                          alt="Martabak"
                          width={160}
                          height={160}
                          className="absolute object-cover"
                        />
                        }
                      </div>
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {item.title}
                      </div>
                      <p className="text-sm leading-tight text-justify text-muted-foreground line-clamp-4">
                        {item.desc}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-center items-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/menu"
                  >
                    <div className="text-sm leading-tight text-muted-foreground">
                      <span>Lihat semua &rarr;</span>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default LeftNavbar;
