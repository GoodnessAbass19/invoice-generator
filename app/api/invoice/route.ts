import { getCurrentUser } from "@/lib/auth";
import { invoiceSchema } from "@/lib/form-schema";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("API Error fetching trader invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch trader invoice." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();

    if (!session?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // ✅ Safe Zod validation (no throws)
    const result = invoiceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten() },
        { status: 400 },
      );
    }

    const validatedData = result.data;

    // ✅ Server-side math (authoritative)
    const subTotal = validatedData.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );

    const tax = subTotal * (validatedData.taxRate / 100);
    const totalAmount = subTotal + tax;

    // ✅ Single write (transaction not needed)
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: validatedData.invoiceNo,
        status: validatedData.status,

        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        billingAddress: validatedData.billingAddress,

        issueDate: validatedData.issueDate,
        dueDate: validatedData.dueDate,

        currency: validatedData.currency,
        taxRate: validatedData.taxRate,
        notes: validatedData.notes ?? null,

        subTotal,
        totalAmount,

        userId: session.id,

        items: {
          create: validatedData.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("[INVOICE_POST]", error);

    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
