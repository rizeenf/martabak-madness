import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(category && { categorySlug: category }),
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: true
      }
    });

    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong while fetching categories.",
      }),
      { status: 500 }
    );
  }
};
