import { getAuthSession } from "@/lib/authOpts";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();

  try {
    if (session) {
      if (session.user.isAdmin) {
        const orders = await prisma.order.findMany({
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc"
          }
        });
        return new NextResponse(JSON.stringify(orders), { status: 200 });
      }

      const orders = await prisma.order.findMany({
        where: {
          userEmail: session.user.email!,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return new NextResponse(JSON.stringify(orders), { status: 200 });



    } else {
      return new NextResponse(
        JSON.stringify({
          message: "Not Authorized",
        }),
        { status: 401 }
      );
    }

  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong while fetching orders.",
      }),
      { status: 500 }
    );
  }
};



export const POST = async (req: NextRequest) => {
  const session = await getAuthSession()
  const body = await req.json()

  try {
    if (session) {
      const createdOrder = await prisma.order.create({
        data: {
          status: 'Prepared',
          price: body.price,
          createdAt: new Date(),
          userEmail: session?.user.email!,
          products: body.products,
        },
      })

      return new NextResponse(
        JSON.stringify(createdOrder),
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