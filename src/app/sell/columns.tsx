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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  price: number
  desc: string
  title: string
  detail: string
  categorySlug: "makanan" | "minuman" | "cemilan"
  image: string
  rowIndex: number
}

interface Props {
  row: Row<Payment>; // Define the type for the row object
}

const ProductCell: React.FC<Props> = ({ row }) => {
  const productId = row.original.id;
  const productTitle = row.original.title;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sell/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellProducts"] });
      toast.success('Success remove product');
    }
  });

  const handleRemoveProduct = (id: string) => {
    mutation.mutate({ id });
  };

  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <Link href={`sell/edit/${productId}`} className="flex items-center justify-center">
        <Pencil className="w-5 h-5 opacity-80" />
      </Link>
      <Link href={`product/${productId}`} target="_blank" className="flex items-center justify-center">
        <ExternalLink className="w-5 h-5 opacity-80" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger>
          <X className="w-5 h-5 opacity-80" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure want to delete {productTitle}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete your selected product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleRemoveProduct(row.original.id)}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};





export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ cell }) => {
      let count = cell.row.index

      return <div>{count + 1}</div>
    },
  },
  {
    accessorKey: "img",
    header: "Image",
    cell: ({ row }) => {
      const img: string = row.getValue("img")
      const title: string = row.getValue("title")
      return <div className="relative aspect-square h-[10rem] w-[10rem] min-w-fit overflow-hidden rounded flex justify-center items-center" >
        <Image
          alt={title}
          src={img}
          width={150}
          height={150}
          className="absolute object-cover"
        />
      </div>
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => (
      <div className="line-clamp-3">
        {row.getValue("desc")}
      </div>
    ),
  },
  {
    accessorKey: "categorySlug",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("categorySlug")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      return <div className="text-right font-medium">{formatPrice(amount)}</div>
    },
  },
  {
    accessorKey: "detail",
    header: () => <div className="text-right">Details</div>,
    cell: ProductCell
  },
]
