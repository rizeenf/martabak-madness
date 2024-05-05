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

const components: {
  title: string;
  href: string;
  src: string;
  description: string;
}[] = [
  {
    title: "Martabak Manis",
    src: "/images/martabak1.jpeg",
    href: "/menu/martabakmanis",
    description:
      "Nikmati Martabak Manis kami yang lezat, dengan lapisan tipis yang renyah dan penuh dengan berbagai pilihan topping manis seperti cokelat, keju, kacang, dan masih banyak lagi. Pesan sekarang dan rasakan kelezatannya!",
  },
  {
    title: "Martabak Telor",
    src: "/images/martelor1.jpeg",
    href: "/menu/martabaktelor",
    description:
      "Sajian Martabak Telur kami adalah campuran sempurna dari telur, daging cincang, bawang, dan rempah-rempah yang disajikan dengan kulit tipis yang garing di luar dan lembut di dalam. Pesan sekarang dan nikmati sensasi gurihnya!",
  },
  {
    title: "Martabak Kering",
    src: "/images/markering1.jpeg",
    href: "/menu/martabakkering",
    description:
      "Martabak Kering kami menghadirkan cita rasa khas Indonesia dengan adonan yang renyah dan isiannya yang lezat. Terdiri dari berbagai pilihan rasa tradisional seperti daging, keju, kacang, dan masih banyak lagi. Pesan sekarang dan rasakan kenikmatannya!",
  },
];

const LeftNavbar = () => {
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
                    <Image
                      src={"/images/martabak1.jpeg"}
                      alt="Martabak"
                      width={100}
                      height={100}
                    />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      MartabakMadness
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground line-clamp-6">
                      MartabakMadness adalah destinasi utama Anda untuk
                      menikmati dunia martabak yang lezat. Temukan beragam rasa
                      manis dan gurih, dengan berbagai pilihan topping yang
                      menggugah selera. Pesan dengan mudah melalui aplikasi
                      pengiriman makanan kami dan puaskan hasrat Anda akan
                      makanan jalanan Indonesia yang terkenal ini.
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
              {components.map((component) => (
                <li className="row-span-3" key={component.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col  rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href={component.href}
                    >
                      <Image
                        src={component.src}
                        alt="Martabak"
                        width={150}
                        height={150}
                        className="rounded-sm"
                      />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {component.title}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground line-clamp-6">
                        {component.description}
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
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), "bg-amber-900")}
            >
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default LeftNavbar;
