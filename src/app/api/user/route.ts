import { getAuthSession } from "@/lib/authOpts";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {

  const session = await getAuthSession()

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email!
      }
    })

    return new NextResponse(
      JSON.stringify(user),
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

export const PUT = async (req: NextRequest) => {

  const session = await getAuthSession()
  const body = await req.json()

  try {
    const user = await prisma.user.update({
      where: {
        email: session?.user.email!
      },
      data: {
        name: body.name,
        address: body.address,
        email: body.email,
        phoneNo: body.phoneNo
      }
    })

    return new NextResponse(
      JSON.stringify(user),
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