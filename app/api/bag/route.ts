import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bagItems = await prisma.bagItem.findMany({
      where: { userId: (session.user as any).id },
      include: { product: true }
    });

    return NextResponse.json(bagItems);
  } catch (error) {
    console.error("Error fetching bag:", error);
    return NextResponse.json(
      { error: "Failed to fetch bag" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await req.json();
    
    const existingItem = await prisma.bagItem.findUnique({
      where: {
        userId_productId: {
          userId: (session.user as any).id,
          productId
        }
      }
    });

    let bagItem;
    if (existingItem) {
      bagItem = await prisma.bagItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) }
      });
    } else {
      bagItem = await prisma.bagItem.create({
        data: {
          userId: (session.user as any).id,
          productId,
          quantity: quantity || 1
        }
      });
    }

    return NextResponse.json(bagItem);
  } catch (error) {
    console.error("Error adding to bag:", error);
    return NextResponse.json(
      { error: "Failed to add to bag" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.bagItem.deleteMany({
      where: {
        userId: (session.user as any).id,
        productId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from bag:", error);
    return NextResponse.json(
      { error: "Failed to remove from bag" },
      { status: 500 }
    );
  }
}
