import EditInvoice from "@/components/dashboard/edit-invoice";

const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoice: string }>;
}) => {
  const { invoice } = await params;
  return (
    <div>
      <EditInvoice />
    </div>
  );
};

export default EditInvoicePage;
