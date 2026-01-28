import EditInvoiceForm from "@/components/dashboard/edit-invoice";

export default async function EditInvoicePage({
  params,
}: {
  params: { invoice: string };
}) {
  const { invoice } = await params;
  return <EditInvoiceForm invoiceId={invoice} />;
}
