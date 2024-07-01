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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/config/type";

type Products = {
  title: string
  qty: number
}

export type Orders = {
  id?: string
  price: number
  userEmail?: string
  products: Products[]
}

const Page = () => {
  const router = useRouter();
  const { products, totalPrice, removeFromCart, decreaseQuantity, addQuantity, resetCart } = useCartStore()
  const { data: user, status } = useSession();
  const queryClient = useQueryClient()

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [vat, setVat] = useState<number>(0)
  const [ongkir, setOngkir] = useState<number>(0)
  const fee: number = 1000;

  if (status === "unauthenticated" && isMounted) {
    toast.error("Kamu belum login, silahkan login terlebih dahulu")
    router.push("/login");
  }

  const { data, isLoading: fetchLoading, error } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`).then((res) =>
        res.json()
      ),
  });

  const mutation = useMutation({
    mutationFn: (
      data: Orders
    ) => {
      return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    },
    onSuccess: () => {
      // window.localStorage.removeItem('cart-storage');
      if (typeof window !== 'undefined') {
        // Your browser-specific code here
        // console.log(window.location.href);
        localStorage.removeItem('cart-storage');
      }
      resetCart()
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success('Successfully Checkout')
      router.push('/orders')
    }
  })

  useEffect(() => {
    setIsMounted(true);

  }, []);

  useEffect(() => {
    if (totalPrice < 100000) {
      setOngkir(10000)
    } else if (totalPrice >= 100000 && totalPrice < 200000) {
      setOngkir(30000)
    } else {
      setOngkir(50000)
    }

    setVat(totalPrice * 0.11)

  }, [totalPrice])

  console.log({ products })

  if (status == "loading") {
    return <Loading />
  }

  const handleCheckout = async () => {
    const product = products.map(
      product => ({
        title: product.title,
        qty: product.quantity
      })
    )

    if (user) {
      try {
        // await mutation.mutate({
        //   price: totalPrice + fee,
        //   products: product
        // });
        router.push('/cart/payment')


      } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed updating status.');
      }
    }

  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Keranjang belanja
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-16">
          <div className="col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Alamat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{data?.name} | {data?.phoneNo}</p>
              </CardContent>
              <CardContent>
                <p className="text-muted-foreground">{data?.address}</p>
              </CardContent>
              <CardContent>
                <Button type="button" variant="link">
                  <Link href={"/settings"}>Ubah alamat</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
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
                <h3 className="font-semibold text-xl">Keranjang kosong.</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Yahh, Keranjang kamu masih kosong.
                </p>
                <Link
                  href="/menu"
                  className={cn(buttonVariants({ variant: "link" }), "text-xs")}
                >
                  Pesan sekarang &rarr;
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
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-9 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-base">
                              <Link
                                href={`/product/${product.id}`}
                                className={"font-medium text-lg text-gray-700 hover:text-gray-500 capitalize"}
                              >
                                {product.title}
                              </Link>
                            </h3>
                            <p className=" mt-1 text-lg font-medium text-muted-foreground">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="flex gap-5 items-center">
                            <Button
                              aria-label="Decrease Qty Product"
                              variant={"ghost"}
                              size={"sm"}
                              onClick={() => decreaseQuantity({
                                id: product.id,
                                price: product.price,
                                quantity: product.quantity,
                                title: product.title,
                                image: product.image,
                              })}>
                              -
                            </Button>
                            <p className="font-semibold text-xl text-muted-foreground">{product.quantity}</p>
                            <Button
                              aria-label="Increase Qty Product"
                              variant={"ghost"}
                              size={"sm"}
                              onClick={() => addQuantity({
                                id: product.id,
                                price: product.price,
                                quantity: product.quantity,
                                title: product.title,
                                image: product.image,
                              })}>
                              +
                            </Button>
                          </div>
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
                          20 menit pengantaran
                        </span>
                      </div>
                    </div>
                  </li>

                ))
              }
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Ringkasan pembayaran</h2>
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
                    PPN (11%)
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(vat)
                  ) : (
                    <Shell className="animate-spin text-rose-200 h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="text-muted-foreground ">
                    Ongkos kirim
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(ongkir)
                  ) : (
                    <Shell className="animate-spin text-rose-200 h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="text-muted-foreground ">
                    Biaya aplikasi
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
                  Total pembayaran
                </span>
                <span className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(totalPrice + +fee + +vat + +ongkir)
                  ) : (
                    <Shell className="animate-spin text-rose-200 h-7 w-7" />
                  )}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                // disabled={(isMounted)}
                className="w-full"
                size={"lg"}
                onClick={handleCheckout}
              >
                Lanjutkan pembayaran
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;