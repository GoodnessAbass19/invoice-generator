/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/lib/auth";
import { invoiceSchema } from "@/lib/form-schema";
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
  req: Request,
  { params }: { params: Promise<{ invoice: string }> },
) {
  try {
    const { invoice } = await params;
    const body = await req.json();

    // 1. Validate the request body
    const validatedData = invoiceSchema.parse(body);

    // 2. Perform the update in a transaction
    const updatedInvoice = await prisma.$transaction(async (tx) => {
      // First, delete all existing items associated with this invoice
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: invoice },
      });

      // Update the invoice details and create new items
      return await tx.invoice.update({
        where: { id: invoice },
        data: {
          invoiceNo: validatedData.invoiceNo,
          status: validatedData.status,
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          billingAddress: validatedData.billingAddress,
          issueDate: new Date(validatedData.issueDate),
          dueDate: new Date(validatedData.dueDate),
          currency: validatedData.currency,
          taxRate: validatedData.taxRate || 0,
          notes: validatedData.notes,
          // Re-insert the items from the form
          items: {
            createMany: {
              data: validatedData.items.map((item) => ({
                description: item.description,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                amount: item.quantity * item.unitPrice,
              })),
            },
          },
        },
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error: any) {
    console.error("PATCH_INVOICE_ERROR:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
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
