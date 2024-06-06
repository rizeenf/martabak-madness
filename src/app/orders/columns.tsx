"use client"
import { ExternalLink, Pencil, X } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User } from "@/config/type";

type Products = {
  title: string
  qty: number
}

export type Orders = {
  id: string
  createdAt: string
  price: string
  name: string
  productId?: string
  user: User
  userEmail: string
  products: Products[]
  status: string
}


interface Props {
  row: Row<Orders>; // Define the type for the row object
}

const StatusCell: React.FC<Props> = ({ row }) => {
  const orderId = row.original.id;
  const orderStatus = row.original.status;
  const queryClient = useQueryClient();
  const [selectedValue, setSelectedValue] = useState('');
  const { data: session, status } = useSession();

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
  return (
    <>
      {
        session?.user?.isAdmin ?
          (
            <form onSubmit={(e) => handleSubmit(e, orderId)} className="flex items-center justify-around">
              <Select onValueChange={handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder={orderStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prepared">Prepared</SelectItem>
                  <SelectItem value="On Delivery">On Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              {/* <select defaultValue={item.status} onChange={handleChange} >
              <option value={"Prepared"}>Prepared</option>
              <option value={"Delivered"}>Delivered</option>
            </select> */}
              <Button type="submit" size={"sm"} variant={"default"}>Save</Button>
            </form>
          )
          :
          <span>
            {orderStatus}
          </span>
      }
    </>
  );
};


export const columns: ColumnDef<Orders>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ cell }) => {
      let count = cell.row.index

      return <div>{count + 1}</div>
    },
  },
  {
    accessorKey: "id",
    header: "Order Id",
    cell: ({ row }) => (
      <div className="overflow-hidden whitespace-nowrap text-ellipsis max-w-16 text-left direction-reverse">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Tanggal</div>,
    cell: ({ row }) => {
      const date: string = row.getValue("createdAt")
      return (
        <div className="text-center">
          {date.slice(0, 10)} {`${date.slice(11, 13)}:${date.slice(14, 16)}`}
        </div>
      )
    }
    ,
  },
  {
    accessorKey: "user",
    header: () => <div className="text-center">Nama</div>,
    cell: ({ row }) => {
      const user: User = row.getValue("user")
      return (
        <div className="capitalize">
          {user.name}
        </div>
      )
    },
  },
  {
    accessorKey: "products",
    header: () => <div className="text-center">Product</div>,
    cell: ({ row }) => {
      const products: Products[] = row.getValue("products")
      return (
        products.map((product, idx) => (
          <div className="font-medium" key={idx}>
            - {product.qty} x {product.title}
          </div>
        ))
      )
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Harga</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      return <div className="text-right font-medium">{formatPrice(amount)}</div>
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: StatusCell
  },
]
