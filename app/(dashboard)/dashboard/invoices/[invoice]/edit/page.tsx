import EditInvoice from "@/components/dashboard/edit-invoice";

const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoice: string }>;
}) => {
  const { invoice } = await params;
  return (
    <div>
      <EditInvoice param={invoice} />
    </div>
  );
};

export default EditInvoicePage;
