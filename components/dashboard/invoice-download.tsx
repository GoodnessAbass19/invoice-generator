/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { InvoicePDF } from "./invoice-template";

export function InvoicePDFDownload({
  invoice,
  businessName,
}: {
  invoice: any;
  businessName: string;
}) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={invoice} businessName={businessName} />}
      fileName={`invoice_${invoice.invoiceNo}.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading} className="gap-2 hover:cursor-pointer">
          <Download className="h-4 w-4" />
          {loading ? "Generating PDF…" : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
