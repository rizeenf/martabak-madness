'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allowedImageSources, cn, formatPrice } from '@/lib/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Loading from '@/app/loading';
import Link from 'next/link';
import { useCartStore } from '@/utils/store';
import { Orders } from '../page';


const PaymentPage = () => {
  const router = useRouter();
  const [productDialog, setProductDialog] = useState(false)
  const { products, totalPrice, removeFromCart, decreaseQuantity, addQuantity, resetCart } = useCartStore()
  const [file, setFile] = useState<File>()
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { data: user, status } = useSession();
  const queryClient = useQueryClient()
  const fee: number = 1000;
  const [vat, setVat] = useState<number>(0)
  const [ongkir, setOngkir] = useState<number>(0)


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

  if (status === "unauthenticated" && isMounted) {
    toast.error("Kamu belum login, silahkan login terlebih dahulu")
    router.push("/login");
  }


  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isLoading, isSubmitting },
  } = useForm();

  const imageUpload = useMutation({
    mutationFn: (
      data: any
    ) => {
      return fetch(`https://api.cloudinary.com/v1_1/rizeenf/image/upload`, {
        method: "POST",
        body: data
      })
    },
    onSuccess: () => {
      toast.success('Successfully upload payment.')
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError(error) {
      toast.error('Failed uploading payment.');
      console.log(error)
    },

  })

  const addCart = useMutation({
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


  const onSubmit = async (data: any) => {
    const fileData = new FormData()

    const product = products.map(
      product => ({
        title: product.title,
        qty: product.quantity
      })
    )

    if (!file) {
      toast.error('No file selected.');
      return;
    }
    fileData.append("file", file)
    fileData.append("upload_preset", "payment")

    if (user) {
      try {
        await imageUpload.mutate(fileData);
        // const aw = await fetch(`https://api.cloudinary.com/v1_1/rizeenf/image/upload`, {
        //   method: "POST",
        //   // headers: {
        //   //   'Content-Type': 'multipart/form-data'
        //   // },
        //   body: fileData
        // })
        // const datwa = await aw

        await addCart.mutate({
          price: totalPrice + fee,
          products: product
        });

      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }

  }

  const onErr = () => {
    console.log({ errors })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    const file = (input.files as FileList)[0]

    setFile(file)
  }

  if (status == "loading") {
    return <Loading />
  }

  if (products.length < 1) {
    // toast.error("Kamu belum memiliki pesanan, silahkan belanja terlebih dahulu")
    router.push("/cart");
  }


  return (
    <>
      <MaxWidthWrapper className='max-w-sm'>
        <div>
          <div>
            <h1 className='text-4xl self-center items-center p-5 text-center'>
              Pembayaran
            </h1>
          </div>
        </div>
        <div className='flex flex-col gap-3 justify-center items-center'>
          <div className='w-full md:w-2/3 p-5 border rounded'>
            <h2 className='text-2xl mb-4'>Rincian Pesanan</h2>
            {products.length > 0 ? (
              <ul>
                {products.map((product, index) => (
                  <li key={index} className='flex justify-between border-b py-2'>
                    <span className='text-muted-foreground'>{product.quantity} x {product.title}</span>
                    <span>{formatPrice(product.price)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-muted-foreground'>Keranjang Anda kosong.</p>
            )}
            <div className='flex justify-between text-muted-foreground mt-4'>
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className='flex justify-between text-muted-foreground'>
              <span>PPN (11%)</span>
              <span>{formatPrice(vat)}</span>
            </div>
            <div className='flex justify-between text-muted-foreground'>
              <span>Ongkos kirim</span>
              <span>{formatPrice(ongkir)}</span>
            </div>
            <div className='flex justify-between text-muted-foreground'>
              <span>Biaya aplikasi</span>
              <span>{formatPrice(+1000)}</span>
            </div>
            <div className='flex justify-between font-semibold'>
              <span>Total bayar</span>
              <span>{formatPrice(totalPrice + +1000 + +vat + +ongkir)}</span>
            </div>
          </div>


          <div className='flex md:flex-row gap-3 justify-center items-center'>
            <form onSubmit={handleSubmit(onSubmit, onErr)}>
              <div className="grid gap-1 py-1">
                <div className='text-center p-5'>
                  <p className='text-muted-foreground'>Silakan upload bukti pembayaran dan konfirmasi ke WhatsApp ke nomor <Link href={`https://wa.me/6287786653726?text=Halo%20saya%20ingin%20mengonfirmasi%20pesanan%20saya%20atas%20nama%20${user?.user?.name!.replace(/ /g, '%20')}%20dengan%20email%20${user?.user.email!},%20berikut%20bukti%20pembayarannya`} target="_blank" rel="noopener noreferrer" className="text-blue-600">087786653726</Link></p>
                </div>
                <Label htmlFor="title">Upload bukti pembayaran</Label>
                <Input
                  type='file'
                  accept='image/*'
                  className={cn({
                    "focus-visible:ring-orange-500": errors.title,
                  })}
                  placeholder="Ayam bakar"
                  onChange={handleImageChange}
                />
              </div>
              <div className="grid gap-1 py-1">
                <Button type="submit" disabled={isSubmitting || isLoading || imageUpload.isPending} >
                  {isSubmitting || isLoading || imageUpload.isPending ? (
                    <LoaderCircle className="w-4 h-4 animate-spin mr-1" />
                  ) : null}
                  Kirim
                </Button>
              </div>
            </form>
          </div>
        </div>
      </MaxWidthWrapper>
    </>

  )
}

export default PaymentPage