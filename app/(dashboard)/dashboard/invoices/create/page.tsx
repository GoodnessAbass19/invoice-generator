import CreateInvoice from "@/components/dashboard/create-invoice";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
// import { generateSequentialInvoiceNumber } from "@/lib/utils";

export async function generateSequentialInvoiceNumber(id: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Get the latest invoice
    const lastInvoice = await tx.invoice.findFirst({
      where: {
        userId: id,
      },
      orderBy: { createdAt: "desc" },
      select: { invoiceNo: true },
    });

    // 2. Parse the number
    let currentNumber = 0;
    if (lastInvoice) {
      const parts = lastInvoice.invoiceNo.split("-");
      currentNumber = parseInt(parts[parts.length - 1], 10);
    }

    // 3. Increment and pad with zeros (e.g., 0001)
    const nextNumber = (currentNumber + 1).toString().padStart(4, "0");
    return `INV-2026-${nextNumber}`;
  });
}

const GenerateInvoicePage = async () => {
  const user = await getCurrentUser();
  const invoiceNo = await generateSequentialInvoiceNumber(user!.id);
  return (
    <div>
      <CreateInvoice invoiceNo={invoiceNo} />
    </div>
  );
};

export default GenerateInvoicePage;
