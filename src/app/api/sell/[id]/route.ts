import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {

  const { id } = params

  try {
    const product = await prisma.product.delete({
      where: {
        id: id
      },
    })

    return new NextResponse(
      JSON.stringify(product),
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong when deleting product."
      }),
      { status: 500 }
    )

  }
};