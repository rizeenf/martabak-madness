"use client"
import { ExternalLink } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  price: number
  desc: string
  title: string
  detail: string
  categorySlug: "makanan" | "minuman" | "cemilan"
  rowIndex: number
}
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
      // const formatted = new Intl.NumberFormat("en-US", {
      //   minimumFractionDigits: 2,
      // }).format(amount)

      return <div className="text-right font-medium">{formatPrice(amount)}</div>
    },
  },
  {
    accessorKey: "detail",
    header: () => <div className="text-right">Details</div>,
    cell: ({ row }) => {
      const productId = row.original.id

      return <Link href={`product/${productId}`} target="_blank" className="flex items-center justify-center" >
        <ExternalLink className="w-5 h-5 opacity-80" />
      </Link>

    },
  },
]
