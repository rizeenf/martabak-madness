import { getAuthSession } from "@/lib/authOpts";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  const session = await getAuthSession()
  const body = await req.json()

  try {
    if (session) {

      const createdProduct = await prisma.product.create({
        data: {
          title: body.title,
          desc: body.desc,
          img: body.img,
          price: body.price,
          categorySlug: body.categorySlug,
          userEmail: session.user.email!
        },
      })

      return new NextResponse(
        JSON.stringify(createdProduct),
        { status: 200 }
      )
    }
  } catch (error) {
    console.log(error)
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong when adding orders."
      }),
      { status: 500 }
    )

  }
};