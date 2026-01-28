/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { InvoicePDF } from "./invoice-template";

export function InvoicePDFDownload({ invoice }: { invoice: any }) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={invoice} />}
      fileName={`invoice_${invoice.invoiceNo}.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading} className="gap-2">
          <Download className="h-4 w-4" />
          {loading ? "Generating PDF…" : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
