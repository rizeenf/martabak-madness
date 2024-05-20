"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/utils/store";
import { Check, ImageIcon, Shell, Shield, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const { products, totalPrice, removeFromCart } = useCartStore()
  const { data: user, status } = useSession();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const fee = 1000;

  if (status === "unauthenticated") {
    toast.error("Kamu belum login, silahkan login terlebih dahulu")
    router.push("/");
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  console.log({ products })

  if (status == "loading") {
    return <Loading />
  }


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Shopping cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-dashed border-2 border-zinc-200 p-12":
                isMounted && products.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && products.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src={"https://i.pinimg.com/originals/78/11/7a/78117a9617236551314ad9b3a378be2c.jpg"}
                    fill
                    loading="eager"
                    className="object-contain flex-shrink-0 opacity-60"
                    alt="Empty shopping cart"
                  />
                </div>
                <h3 className="font-semibold text-xl">Keranjang kosong.</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Yahh, Keranjang kamu masih kosong.
                </p>
                <Link
                  href="/menu"
                  className={cn(buttonVariants({ variant: "link" }), "text-xs")}
                >
                  Cari makanan dulu
                </Link>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted,
              })}
            >
              {isMounted &&
                products.map((product, idx) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">

                      {product.image ?
                        (<div className="relative w-32 h-32">
                          <Image
                            fill
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>)
                        :
                        (<div className="flex h-full items-center justify-center bg-secondary">
                          <ImageIcon
                            aria-hidden="true"
                            className="h-4 w-4 text-muted-foreground"
                          />
                        </div>)
                      }
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-base">
                              <Link
                                href={`/product/${product.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800 capitalize"
                              >
                                {product.title}
                              </Link>
                            </h3>
                          </div>
                          <p className=" mt-1 text-sm font-medium text-muted-foreground">
                            {product.quantity} x {formatPrice(product.price)}
                          </p>
                        </div>

                        <div className="mt-2 sm:mt-0 sm:pr-9 w-20">
                          <div className="absolute right-0 top-0">
                            <Button
                              aria-label="Remove Product"
                              variant={"ghost"}
                              size={"sm"}
                              onClick={() => removeFromCart({
                                id: product.id,
                                price: product.price,
                                quantity: product.quantity,
                                title: product.title,
                                image: product.image,
                              })}>
                              <X className="h-5 w-5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="h-3 w-3 flex-shrink-0 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          Instant delivery
                        </span>
                      </div>
                    </div>
                  </li>

                ))
              }
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(totalPrice)
                  ) : (
                    <Shell className="animate-spin text-rose-200 h-5 w-5" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="text-muted-foreground ">
                    Flat transaction fee
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Shell className="animate-spin text-rose-200 h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-base font-medium text-gray-900">
                  Order total
                </span>
                <span className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(totalPrice + +fee)
                  ) : (
                    <Shell className="animate-spin text-rose-200 h-7 w-7" />
                  )}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                disabled={(isMounted)}
                className="w-full"
                size={"lg"}
              >
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;