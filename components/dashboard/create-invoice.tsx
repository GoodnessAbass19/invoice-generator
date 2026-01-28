"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Resolver,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Send, Save, Loader2 } from "lucide-react";

import { invoiceSchema } from "@/lib/form-schema";
import { InvoiceHTMLPreview } from "./invoice-preview";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface PriceChangeParams {
  index: number;
  field: "quantity" | "unitPrice";
  value: string;
}

const CreateInvoice = () => {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as Resolver<InvoiceFormValues>,
    defaultValues: {
      invoiceNo: "",
      status: "PENDING",
      customerName: "",
      customerEmail: "",
      billingAddress: "",
      issueDate: new Date(),
      dueDate: new Date(),
      taxRate: 7.5,
      currency: "USD",
      notes: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { control, register, handleSubmit, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const formValues = useWatch({ control });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Real-time calculation for the HTML preview
  const previewData = useMemo(() => {
    const items = (formValues.items || []).map((item) => ({
      ...item,
      amount: (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0),
    }));
    const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const tax = subtotal * ((Number(formValues.taxRate) || 0) / 100);
    const totalAmount = subtotal + tax;

    return { ...formValues, items, subtotal, tax, totalAmount };
  }, [formValues]);

  // Logic: Set Due Date to +14 days when Issue Date changes
  const watchIssueDate = watch("issueDate");
  useEffect(() => {
    if (watchIssueDate) {
      const due = new Date(watchIssueDate);
      due.setDate(due.getDate() + 7);
      setValue("dueDate", due);
    }
  }, [watchIssueDate, setValue]);

  const InvoiceMutation = useMutation({
    mutationFn: async (formData: InvoiceFormValues) => {
      setIsSubmitting(true);
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create invoice.");
        setIsSubmitting(false);
      }
      return res.json();
    },
    onSuccess: (data) => {
      router.push("/dashboard/invoices");
      router.refresh();
      toast("Invoice create", {});
      setIsSubmitting(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // Handle error (e.g., show toast)
      console.error("Account creation failed:", error.message);
      setIsSubmitting(false);
    },
  });

  const onSubmit: SubmitHandler<InvoiceFormValues> = (data) => {
    console.log("Submitting Invoice Data:", data);
    InvoiceMutation.mutate(data);
  };

  const handleChange = ({ index, field, value }: PriceChangeParams) => {
    // 1. Convert to string and strip all non-numeric/non-decimal characters immediately
    let cleanValue = value.toString().replace(/[^0-9.]/g, "");

    // 2. Prevent multiple decimals (e.g., 12.34.56 -> 12.3456)
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      cleanValue = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    // 3. Update the form state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`items.${index}.${field}` as any, cleanValue, {
      shouldValidate: true,
    });
  };

  return (
    <Form {...form}>
      <div className="max-w-400 mx-auto px-3 lg:px-8 py-6 flex flex-col lg:flex-row gap-10">
        {/* LEFT: FORM SECTION */}
        <div className="flex-1 space-y-8">
          <header className="space-y-2">
            <h1 className="text-[#0d121b] dark:text-white text-3xl font-black tracking-tight">
              Create Commercial Invoice
            </h1>
            <p className="text-[#4c669a] dark:text-gray-400 text-sm">
              Standardized invoice for global logistics and commercial trade.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* INVOICE DETAILS CARD */}
            <div className="bg-white dark:bg-[#1a2133] rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2d3748] bg-gray-50/50 dark:bg-gray-800/20">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0d121b] dark:text-white">
                  Invoice Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={control}
                  name="invoiceNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs">
                        Invoice Number
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="INV-2026-001"
                        className="focus:ring-[#135bec]"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs">
                        Issue Date
                      </FormLabel>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : field.value
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs">
                        Due Date
                      </FormLabel>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : field.value
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs">
                        Currency
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="USD">USD – US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR – Euro</SelectItem>
                          <SelectItem value="GBP">
                            GBP – British Pound
                          </SelectItem>
                          <SelectItem value="NGN">
                            NGN – Nigerian Naira
                          </SelectItem>
                          <SelectItem value="KES">
                            KES – Kenyan Shilling
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* CUSTOMER INFORMATION CARD */}
            <div className="bg-white dark:bg-[#1a2133] rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2d3748] bg-gray-50/50 dark:bg-gray-800/20">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0d121b] dark:text-white">
                  Customer Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-xs">
                          Customer Name
                        </FormLabel>
                        <Input
                          {...field}
                          placeholder="Global Logistics Corp."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-xs">
                          Customer Email
                        </FormLabel>
                        <Input
                          {...field}
                          type="email"
                          placeholder="billing@logistics.com"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-xs">
                          Customer Phone (optional)
                        </FormLabel>
                        <Input
                          {...field}
                          type="text"
                          inputMode="decimal"
                          // placeholder="billing@logistics.com"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs">
                        Billing Address
                      </FormLabel>
                      <textarea
                        {...field}
                        className="flex min-h-20 w-full rounded-md border border-[#cfd7e7] dark:border-[#2d3748] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135bec] transition-all"
                        placeholder="123 Trade Center, Suite 400, New York, NY 10001"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* LINE ITEMS SECTION */}
            <div className="bg-white dark:bg-[#1a2133] rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2d3748]">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0d121b] dark:text-white">
                  Service / Product Items
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ description: "", quantity: 1, unitPrice: 0 })
                  }
                  className="text-[#135bec] border-[#135bec]/20 hover:bg-[#135bec]/5"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-800/40">
                    <TableRow>
                      <TableHead className="px-6 py-3 font-bold text-[#4c669a]">
                        Description
                      </TableHead>
                      <TableHead className="px-6 py-3 w-24 text-center font-bold text-[#4c669a]">
                        Qty
                      </TableHead>
                      <TableHead className="px-6 py-3 w-32 text-center font-bold text-[#4c669a]">
                        Rate
                      </TableHead>
                      <TableHead className="px-6 py-3 w-32 text-right font-bold text-[#4c669a]">
                        Total
                      </TableHead>
                      <TableHead className="px-6 py-3 w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-[#e7ebf3] dark:divide-[#2d3748]">
                    {fields.map((field, index) => (
                      <TableRow
                        key={field.id}
                        className="group hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors"
                      >
                        <TableCell className="px-6 py-4">
                          <Input
                            {...register(`items.${index}.description`)}
                            placeholder="Item description..."
                            className="border-none focus-visible:ring-0 px-0 bg-transparent h-auto text-sm"
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Input
                            type="text"
                            inputMode="decimal"
                            {...register(`items.${index}.quantity`)}
                            onChange={(e) =>
                              handleChange({
                                index: index,
                                field: "quantity",
                                value: e.target.value,
                              })
                            }
                            className="h-8 text-center"
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Input
                            type="text"
                            step="0.01"
                            inputMode="decimal"
                            {...register(`items.${index}.unitPrice`)}
                            onChange={(e) =>
                              handleChange({
                                index: index,
                                field: "unitPrice",
                                value: e.target.value,
                              })
                            }
                            className="h-8 text-center"
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right text-sm font-bold">
                          {(
                            (formValues.items?.[index]?.quantity || 0) *
                            (formValues.items?.[index]?.unitPrice || 0)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50"
                            disabled={fields.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#135bec] hover:bg-[#0f49c0] h-12 text-md gap-2 shadow-lg shadow-[#135bec]/20"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Publish Invoice
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 gap-2"
                disabled={isSubmitting}
                onClick={() => {
                  const data = form.getValues();
                  setValue("status", "DRAFT");
                  onSubmit(data);
                }}
              >
                <Save className="h-4 w-4" /> Save as Draft
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT: PREVIEW STICKY SECTION */}
        <aside className="w-full lg:w-120 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4c669a]">
              Live Document Preview
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-green-600 font-bold uppercase">
                Syncing
              </span>
            </div>
          </div>
          <div className="top-10 transform scale-[0.82] lg:scale-[0.95] xl:scale-100 origin-top  rounded-xl transition-all duration-500 hover:shadow-blue-500/10">
            <InvoiceHTMLPreview data={previewData} />
          </div>
        </aside>
      </div>
    </Form>
  );
};

export default CreateInvoice;
