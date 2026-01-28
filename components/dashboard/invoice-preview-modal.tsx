// Inside your invoice-preview-modal.tsx
import { InvoiceHTMLPreview } from "./invoice-preview"; // The component we rewrote
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InvoicePreviewModal = ({ invoice }: { invoice: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-300 w-full p-0 overflow-hidden bg-slate-100">
        <div className="max-h-[90vh] overflow-y-auto p-3">
          <InvoiceHTMLPreview data={invoice} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
