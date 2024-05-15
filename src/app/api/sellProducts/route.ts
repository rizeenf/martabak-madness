import { getAuthSession } from "@/lib/authOpts";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();

  try {
    if (session) {

      const products = await prisma.product.findMany({
        where: {
          userEmail: session.user.email!
        },
      });

      return new NextResponse(JSON.stringify(products), { status: 200 });
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong while fetching categories.",
      }),
      { status: 500 }
    );
  }
};
