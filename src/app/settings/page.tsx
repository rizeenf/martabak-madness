'use client'
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allowedImageSources, cn } from '@/lib/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import Loading from '../loading';


const SettingsPage = () => {
  const router = useRouter();
  const [productDialog, setProductDialog] = useState(false)
  const { data: user, status } = useSession();
  const queryClient = useQueryClient()

  if (status === "unauthenticated") {
    router.push("/");
  }


  const isValidImageUrl = (url: string) => {
    try {
      const { protocol, hostname } = new URL(url);
      return allowedImageSources.some(source => {
        const isHostnameValid = new RegExp(`^${source.hostname.replace('*.', '.*.')}$`).test(hostname);
        return isHostnameValid;
      });
    } catch {
      return false;
    }

  }

  const formSchema = z.object({
    title: z.string().min(5, {
      message: "Title must be at least 5 characters.",
    }),
    description: z.string().min(5, {
      message: "Description must be at least 5 characters.",
    }),
    image: z.string().refine(isValidImageUrl, {
      message: "Invalid image URL. The URL must be from a permitted source.",
    }),
    price: z.number(),
    isFeatured: z.boolean().nullable().default(false),
    options: z.string().nullable(),
    categories: z.string(),
  })


  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });


  const { data, isLoading: fetchLoading, error } = useQuery({
    queryKey: ["sellProducts"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sellProducts`).then((res) =>
        res.json()
      ),
  });


  const mutation = useMutation({
    mutationFn: (
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
      queryClient.invalidateQueries({ queryKey: ["sellProducts"] })
    }
  })


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (user) {
      try {
        await mutation.mutate({
          title: data.title,
          desc: data.description,
          img: data.image,
          price: data.price,
          categorySlug: data.categories,
          userEmail: user.user.email!
        });

        setProductDialog(false)
        toast.success('Success Add Product.')
        reset()

      } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed updating status.');
      }
    }


  }

  const onErr = () => {
    console.log({ errors })
  }


  const handleChange = (e: string) => {
    setValue("categories", e)
    console.log(e)
  }


  const Dialog = (
    <div className={cn(productDialog ? 'visible' : 'hidden', "w-4/5 fade-in-10 duration-150")}>
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
            {/* Can be fetch from category listing */}
            <Label htmlFor="categories">Category</Label>
            <Select onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="makanan">Makanan</SelectItem>
                <SelectItem value="minuman">Minuman</SelectItem>
                <SelectItem value="cemilan">Cemilan</SelectItem>
              </SelectContent>
            </Select>
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
              placeholder="https://i.pinimg.com/5e5db939712.jpg.. (Image link from pinterest, wikipedia, unsplash)"
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
              placeholder="Kecil, Sedang, Besar.."
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
          <Button type="submit" disabled={isSubmitting || isLoading || mutation.isPending}>
            {isSubmitting || isLoading || mutation.isPending ? (
              <LoaderCircle className="w-4 h-4 animate-spin mr-1" />
            ) : null}
            Tambahkan
          </Button>
        </div>
      </form>

    </div>
  )

  if (status == "loading") {
    return <Loading />
  }

  return (
    <>
      <MaxWidthWrapper>
        <div>
          <h1 className='text-4xl self-center items-center p-5'>
            Account Settings
          </h1>
        </div>

        <div className='flex flex-col md:flex-row gap-3'>
          <div className='w-1/5 flex-row md:flex-col gap-3'>
            <Button variant={"link"}
              className='text-2xl flex-1'
              onClick={() => setProductDialog(prev => !prev)} disabled={!productDialog} >
              My Profile
            </Button>
            {/* <Button variant={"link"}
              className='text-2xl flex-1'
              onClick={() => setProductDialog(prev => !prev)} disabled={productDialog}>
              Add Product
            </Button> */}
          </div>
          <span className="w-px hidden md:flex h-64 bg-green-400 mx-5" />
          <span className="w-48 flex md:hidden h-px bg-green-400 my-5" />
          {Dialog}
        </div>
      </MaxWidthWrapper>
    </>


  )
}

export default SettingsPage