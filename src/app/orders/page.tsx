"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { OrderType } from "@/config/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from 'sonner'
import Loading from "@/app/loading";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

const Orders = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`).then((res) =>
        res.json()
      ),
  });

  if (status === "unauthenticated") {
    toast.error("Kamu belum login, silahkan login terlebih dahulu")
    router.push("/login");
  }

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => {
      return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success('Success updating status.')
    }
  })

  const handleChange = (e: string) => {
    setSelectedValue(e);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()

    mutation.mutate({
      id: id,
      status: selectedValue!
    }, {
      onError: (error) => {
        console.error('Failed to update status:', error);
        toast.error('Failed updating status.');
      }
    })
  }
  console.log({ data });

  if (status === "loading") return <Loading />;

  return (
    <MaxWidthWrapper className="mt-5">
      {isLoading
        ? <Skeleton className="w-full h-56 rounded-lg" />
        : <DataTable columns={columns} data={data} />
      }
    </MaxWidthWrapper>
  );
};

export default Orders;
