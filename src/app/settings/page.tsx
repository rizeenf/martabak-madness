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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import Loading from '../loading';
import { User } from '@/config/type';
import { Textarea } from '@/components/ui/textarea';

type inputMutation = {
  name: string
  address: string
  phoneNo: string
  email: string
}


const SettingsPage = () => {
  const router = useRouter();
  const { data: user, status } = useSession();
  const queryClient = useQueryClient()

  if (status === "unauthenticated") {
    toast.error("Kamu belum login, silahkan login terlebih dahulu")
    router.push("/login");
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
    name: z.string().min(5, {
      message: "Name must be at least 5 characters",
    }),
    email: z.string().email({ message: "Email is incorrect" }),
    address: z.string({ message: "Alamat tidak boleh kosong" }).min(10, {
      message: "Address must be at least 10 characters",
    }),
    phoneNo: z.string({ message: "Nomor telepon tidak boleh kosong" }).min(10, {
      message: "Phone no is incorrect",
    }),
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


  const { data, isLoading: fetchLoading, error } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`).then((res) =>
        res.json()
      ),
  });


  const mutation = useMutation({
    mutationFn: (
      data: inputMutation
    ) => {
      return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast.success('Success save account')
    }
  })


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (user) {
      try {
        await mutation.mutate({
          name: data.name,
          address: data.address,
          email: data.email,
          phoneNo: data.phoneNo
        });

        reset()

      } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed updating status.');
      }
    }

  }

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        address: data.address,
        email: data.email,
        phoneNo: data.phoneNo
      });
    }
  }, [data, reset]);


  const onErr = () => {
    console.log({ errors })
  }

  const Dialog = (
    <div className={cn("w-4/5 fade-in-10 duration-150")}>
      <form onSubmit={handleSubmit(onSubmit, onErr)}>
        <div className="grid gap-2">
          <div className="grid gap-1 py-1">
            <Label htmlFor="image">Address</Label>
            <Textarea
              className={cn({
                "focus-visible:ring-orange-500": errors.address,
              })}
              placeholder="Jalan Bintara 15, RT 006/004 No 182, Kelurahan Bintara"
              {...register("address")}
            />
            {errors?.address && (
              <span className="text-xs text-rose-500">
                {errors?.address?.message}
              </span>
            )}
          </div>
          <div className="grid gap-1 py-1">
            <Label htmlFor="title">Nama</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.name,
              })}
              placeholder="Rizki Unsada"
              {...register("name")}
            />
            {errors?.name && (
              <span className="text-xs text-rose-500">
                {errors?.name?.message}
              </span>
            )}
          </div>
          <div className="grid gap-1 py-1">
            <Label htmlFor="description">Email</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.email,
              })}
              placeholder="rizkiunsada@gmail.com"
              {...register("email")}
            />
            {errors?.email && (
              <span className="text-xs text-rose-500">
                {errors?.email?.message}
              </span>
            )}
          </div>

          <div className="grid gap-1 py-1">
            <Label htmlFor="options">No Telepon</Label>
            <Input
              className={cn({
                "focus-visible:ring-orange-500": errors.phoneNo,
              })}
              placeholder="+62877 8663 2385"
              {...register("phoneNo")}
            />
            {errors?.phoneNo && (
              <span className="text-xs text-rose-500">
                {errors?.phoneNo?.message}
              </span>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting || isLoading || mutation.isPending}>
            {isSubmitting || isLoading || mutation.isPending ? (
              <LoaderCircle className="w-4 h-4 animate-spin mr-1" />
            ) : null}
            Simpan
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
              disabled >
              My Profile
            </Button>
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