import { getAuthSession } from "@/lib/authOpts";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();

  try {
    if (session) {
      if (session.user.isAdmin) {
        const orders = await prisma.order.findMany();
        return new NextResponse(JSON.stringify(orders), { status: 200 });
      }

      const orders = await prisma.order.findMany({
        where: {
          userEmail: session.user.email!,
        },
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
