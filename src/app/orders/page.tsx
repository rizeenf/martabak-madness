"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { OrderType } from "@/config/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from 'sonner'

const Orders = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`).then((res) =>
        res.json()
      ),
  });

  if (status === "unauthenticated") {
    router.push("/");
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
    }
  })
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const input = form.elements[0] as HTMLInputElement
    const status = input.value
    
    mutation.mutate({
      id: id,
      status: status
    })
    toast.success('Success updating status.') 
  }
  console.log({ data });

  if (isLoading || status === "loading") return <div>Loading...</div>;

  return (
    <MaxWidthWrapper>
      <table className="w-full my-5">
        <thead className="border-b text-left bg-amber-700 text-white">
          <tr className="border-b border-amber-100">
            <th>Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th>Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderType) => (
            <tr key={item.id} className={`border-b border-amber-100 ${item.status.toLowerCase() != 'delivered' && 'bg-red-100'} align-items-center py-2`}>
              <td>{item.id}</td>
              <td>{item.createdAt.toString().slice(0, 10)} {`${item.createdAt.toString().slice(11, 13)}:${item.createdAt.toString().slice(14, 16)}`}</td>
              <td>{item.price}</td>
              <td>{item.products[0].title}</td>
              {/* <td>'test Date'</td> */}
              <td>
                {
                  session?.user.isAdmin ? (
                    <form onSubmit={(e) => handleSubmit(e, item.id)} >
                      <input type="text" name="status" placeholder={item.status} className="m-1 pl-2 ring-1 ring-red-100 rounded-md" />
                      <Button type="submit" size={"sm"} variant={"default"}>Save</Button>
                    </form>
                  )
                    :
                    <span>
                      {item.status}
                    </span>
                }
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
    </MaxWidthWrapper>
  );
};

export default Orders;
