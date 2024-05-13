'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { LoaderCircle } from "lucide-react";
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'


const SellerDashboard = () => {
  const [productDialog, setProductDialog] = useState(false)
  const { data: user, status } = useSession();


  const formSchema = z.object({
    title: z.string().min(5, {
      message: "Title must be at least 5 characters.",
    }),
    description: z.string().min(5, {
      message: "Description must be at least 5 characters.",
    }),
    image: z.string().min(5, {
      message: "Description must be at least 5 characters.",
    }),
    price: z.number(),
    isFeatured: z.boolean().nullable().default(false),
    options: z.string().nullable(),
    categories: z.string(),
  })


  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (
      //   {
      //   title,
      //   desc,
      //   img,
      //   price,
      //   categorySlug,
      //   userEmail
      // }: any
      data: any
    ) => {
      return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sell`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success('Success Insert Product.')
    }
  })



  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('awaw')
    console.log(data, 'data')


    if (user) {
      try {
        await mutation.mutate({
          title: data.title,
          desc: data.description,
          img: data.image,
          price: data.price,
          categorySlug: data.categories,
          userEmail: user.user.email! // Ensure userEmail is available
        });

        // If mutation succeeds, you may perform additional actions here

      } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed updating status.');
      }
    }


  }

  const onErr = () => {
    console.log({ errors })
  }

  const Dialog = (
    <div className={cn(productDialog ? 'visible' : 'hidden')}>
      <form onSubmit={handleSubmit(onSubmit, onErr)}>
        <div className="grid gap-2">
          <div className="grid gap-1 py-1">
            <Label htmlFor="title">Title</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.title,
              })}
              placeholder="Ayam bakar"
              {...register("title")}
            />
            {errors?.title && (
              <span className="text-xs text-rose-500">
                {errors?.title?.message}
              </span>
            )}
          </div>
          <div className="grid gap-1 py-1">
            <Label htmlFor="description">Description</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.description,
              })}
              placeholder="Dibuat dari tepung pilihan dan ayam yang segar.."
              {...register("description")}
            />
            {errors?.description && (
              <span className="text-xs text-rose-500">
                {errors?.description?.message}
              </span>
            )}
          </div>
          <div className="grid gap-1 py-1">
            <Label htmlFor="categories">Category</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.categories,
              })}
              placeholder="Makanan / Minuman / Cemilan"
              {...register("categories")}
            />
            {errors?.categories && (
              <span className="text-xs text-rose-500">
                {errors?.categories?.message}
              </span>
            )}
          </div>
          <div className="grid gap-1 py-1">
            <Label htmlFor="image">Image</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.image,
              })}
              placeholder="/images/makanan/ayam-tepung.jpeg .. Sementara"
              {...register("image")}
            />
            {errors?.image && (
              <span className="text-xs text-rose-500">
                {errors?.image?.message}
              </span>
            )}
          </div>
          <div className="grid gap-1 py-1">
            <Label htmlFor="options">Options</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.options,
              })}
              placeholder="Dibuat dari tepung pilihan dan ayam yang segar.."
              {...register("options")}
            />
            {errors?.options && (
              <span className="text-xs text-rose-500">
                {errors?.options?.message}
              </span>
            )}
          </div>
          <div className="grid gap-1 py-1">
            <Label htmlFor="price">Harga</Label>
            <Input
              type='number'
              className={cn({
                "focus-visible:ring-orange-500": errors.price,
              })}
              placeholder="1000000"
              {...register("price", { valueAsNumber: true })}
            />
            {errors?.price && (
              <span className="text-xs text-rose-500">
                {errors?.price?.message}
              </span>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="w-3 h-3 animate-spin mr-1" />
            ) : null}
            Tambahkan
          </Button>
        </div>
      </form>

    </div>
  )


  return (
    <>
      <div>
        <div>
          <h1 className='text-4xl self-center items-center p-5'>
            Seller Dashboard
          </h1>
        </div>
        <Button className='m-5' onClick={() => setProductDialog(prev => !prev)}>
          Add Product
        </Button>
      </div>
      {Dialog}
    </>

  )
}

export default SellerDashboard