'use client'
import Loading from '@/app/loading';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from '@/config/type';
import { allowedImageSources, cn } from '@/lib/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from "lucide-react";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type ParamsProps = {
  params: {
    id: string;
  };
};


const EditPage = ({ params }: ParamsProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: user, status } = useSession();
  const queryClient = useQueryClient()

  if (status === "unauthenticated") {
    toast.error("Kamu belum login, silahkan login terlebih dahulu")
    router.push("/login");
  }

  const { data, isLoading: fetchLoading, error } = useQuery({
    queryKey: ["editProduct"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`).then((res) =>
        res.json()
      ),
  });

  const mutation = useMutation({
    mutationFn: (
      data: any
    ) => {
      return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sellProducts/edit/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellProducts", "editProduct"] })
      toast.success('Success edit product')
      router.push('/sell')
    }
  })

  console.log({ data })


  const isValidImageUrl = (url: string) => {
    try {
      const { hostname } = new URL(url);
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
    categories: z.string(),
  })


  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      categories: "",
      price: 0
    }
  });



  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data, ' dataa')
    if (user) {
      try {
        await mutation.mutate({
          title: data.title,
          desc: data.description,
          img: data.image,
          price: data.price,
        });

        reset()

      } catch (error) {
        console.error('Failed to edit:', error);
        toast.error('Failed editing product');
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

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        description: data.desc,
        image: data.img,
        categories: data.categorySlug,
        price: data.price
      });
    }
  }, [data, reset]);



  if (status == "loading" || fetchLoading) {
    return <Loading />
  }

  return (
    <MaxWidthWrapper>
      <div>
        <div>
          <h1 className='text-4xl self-center items-center p-5'>
            Seller Dashboard
          </h1>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-3'>
        <div className='w-1/5 flex-row md:flex-col gap-3'>
          <Button variant={"link"}
            className='text-2xl flex-1' disabled>
            Edit Products
          </Button>
        </div>
        <span className="w-px hidden md:flex h-64 bg-green-400 mx-5" />
        <span className="w-48 flex md:hidden h-px bg-green-400 my-5" />

        <div className={cn('visible', "w-4/5 fade-in-10 duration-150")}>
          <h1 className='text-2xl flex-1 text-gray-600 font-semibold my-5'>
            <span className='font-normal'>Edit</span> {data?.title}
          </h1>
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
              {watch("image") && <div className="relative aspect-square h-[16rem] w-[16rem] min-w-fit overflow-hidden rounded">
                {watch("image") && (
                  <Image
                    alt={watch("title")}
                    src={watch("image")}
                    width={256}
                    height={256}
                    className="absolute object-cover"
                  />
                )}
              </div>}
              <div className="grid gap-1 py-1">
                <Label htmlFor="price">Harga</Label>
                <Input
                  type='number'
                  className={cn({
                    "focus-visible:ring-orange-500": errors.price,
                  })}
                  placeholder="Rp 100.000"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors?.price && (
                  <span className="text-xs text-rose-500">
                    {errors?.price?.message}
                  </span>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? (
                  <LoaderCircle className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                Simpan
              </Button>
            </div>
          </form>
        </div>

      </div>
    </MaxWidthWrapper>

  )
}

export default EditPage