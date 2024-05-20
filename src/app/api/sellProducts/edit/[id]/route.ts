import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";


export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {

  const { id } = params
  const body = await req.json()

  try {
    const product = await prisma.product.update({
      where: {
        id: id
      },
      data: {
        title: body.title,
        desc: body.desc,
        img: body.img,
        price: body.price,
      }
    })

    return new NextResponse(
      JSON.stringify(product),
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong when updating product"
      }),
      { status: 500 }
    )

  }
};