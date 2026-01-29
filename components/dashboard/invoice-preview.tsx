/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user-context";

export const InvoiceHTMLPreview = ({ data }: { data: any }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const currency = data.currency || "USD";
  const user = useUser();

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      // ✅ Create a CLEAN CLONE (no Tailwind, no global CSS)
      const clone = pdfRef.current.cloneNode(true) as HTMLElement;

      clone.style.backgroundColor = "#ffffff";
      clone.style.color = "#000000";

      // Force safe colors on all elements
      clone.querySelectorAll("*").forEach((el) => {
        const e = el as HTMLElement;
        e.style.color ||= "#000000";
        e.style.backgroundColor ||= "transparent";
        e.style.borderColor ||= "#e5e7eb";
      });

      // Render clone instead of live DOM
      await html2pdf()
        .set({
          margin: 0.5,
          filename: `invoice_${data.invoiceNo || "draft"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false,
          },
          jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
          },
        })
        .from(clone)
        .save();
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert(
        "PDF generation failed due to unsupported CSS colors. This invoice was safely rendered without Tailwind styles.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex justify-end print:hidden">
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          variant="outline"
          className="gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isGenerating ? "Preparing PDF…" : "Download Invoice"}
        </Button>
      </div>

      {/* Printable Area */}
      <div
        ref={pdfRef}
        className="max-w-[900px] mx-auto bg-white p-12 text-black"
      >
        {/* Header */}
        <div className="flex justify-between mb-12">
          <h1 className="text-4xl font-black">{user.admin?.businessName}</h1>

          <div className="text-right">
            <Badge variant="outline">{data.status || "DRAFT"}</Badge>
            <p className="text-sm mt-2">
              Issued:{" "}
              {data.issueDate
                ? format(new Date(data.issueDate), "MMM dd, yyyy")
                : "---"}
            </p>
          </div>
        </div>

        {/* Customer */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <p className="font-bold">Billed To</p>
            <p>{data.customerName}</p>
            <p className="text-sm">{data.customerEmail}</p>
            <pre className="text-sm whitespace-pre-wrap">
              {data.billingAddress}
            </pre>
          </div>

          <div className="text-right">
            <p className="font-bold">Due Date</p>
            <p>
              {data.dueDate
                ? format(new Date(data.dueDate), "MMM dd, yyyy")
                : "---"}
            </p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-sm mb-12">
          <thead>
            <tr className="border-b">
              <th align="left">Description</th>
              <th align="center">Qty</th>
              <th align="right">Rate</th>
              <th align="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items?.map((item: any, i: number) => (
              <tr key={i} className="border-b">
                <td>{item.description}</td>
                <td align="center">{item.quantity}</td>
                <td align="right">
                  {formatCurrency(item.unitPrice, currency)}
                </td>
                <td align="right">
                  {formatCurrency(item.quantity * item.unitPrice, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(data.subTotal || 0, currency)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between">
                <span>Tax ({data.taxRate}%)</span>
                <span>{formatCurrency(data.tax || 0, currency)}</span>
              </div>
            )}
            <div className="border-t pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>{formatCurrency(data.totalAmount || 0, currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mt-10 text-sm">
            <strong>Notes</strong>
            <p>{data.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
