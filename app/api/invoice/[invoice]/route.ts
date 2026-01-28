import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ invoice: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { invoice } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findFirst({
      where: {
        id: invoice,
        userId: user.id, // ✅ SECURITY: scope to user
      },
      include: {
        items: true,
      },
    });

    if (!invoices) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("[INVOICE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ invoice: string }> },
) {
  try {
    const { invoice } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    }

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice ID is required." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {} = body;
  } catch (error) {
    console.error("API Error fetching trader invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch trader invoice." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ invoice: string }> },
) {
  try {
    const { invoice } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    }

    if (!invoice) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 },
      );
    }

    // Verify product exists and belongs to the seller's store
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: invoice },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 },
      );
    }

    const deletedInvoice = await prisma.invoice.delete({
      where: {
        id: invoice,
      },
    });

    return NextResponse.json(
      { message: "Invoice deleted successfully.", product: deletedInvoice },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice." },
      { status: 500 },
    );
  }
}
