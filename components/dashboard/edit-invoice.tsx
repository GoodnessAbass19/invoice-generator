/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Resolver,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

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

export default function EditInvoiceForm({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Existing Data
  const { data: initialData, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const res = await fetch(`/api/invoice/${invoiceId}`);
      if (!res.ok) throw new Error("Failed to fetch invoice");
      return res.json();
    },
  });

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as Resolver<InvoiceFormValues>,
    defaultValues: {
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { control, register, handleSubmit, reset, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const formValues = useWatch({ control });

  // 2. Populate form when data arrives
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        issueDate: new Date(initialData.issueDate),
        dueDate: new Date(initialData.dueDate),
        taxRate: initialData.taxRate || 7.5,
      });
    }
  }, [initialData, reset]);

  // 3. Calculation logic for Preview
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

  // 4. Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: InvoiceFormValues) => {
      setIsSubmitting(true);
      const res = await fetch(`/api/invoice/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Invoice updated successfully");
      router.push("/dashboard/invoices");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update invoice");
      setIsSubmitting(false);
    },
  });

  const onSubmit: SubmitHandler<InvoiceFormValues> = (data) => {
    updateMutation.mutate(data);
  };

  const handleChange = ({ index, field, value }: PriceChangeParams) => {
    let cleanValue = value.toString().replace(/[^0-9.]/g, "");
    const parts = cleanValue.split(".");
    if (parts.length > 2) cleanValue = `${parts[0]}.${parts.slice(1).join("")}`;
    setValue(`items.${index}.${field}` as any, cleanValue, {
      shouldValidate: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#135bec]" />
        <p className="text-sm font-medium text-slate-500">
          Loading invoice details...
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="max-w-[1440px] mx-auto px-3 lg:px-8 py-6 flex flex-col lg:flex-row gap-10">
        {/* LEFT: FORM SECTION */}
        <div className="flex-1 space-y-8">
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#135bec] mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 hover:bg-transparent text-[#135bec]"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              </div>
              <h1 className="text-[#0d121b] dark:text-white text-3xl font-black tracking-tight">
                Edit Invoice{" "}
                <span className="text-slate-400 font-medium">
                  #{initialData?.invoiceNo}
                </span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Current Status
                </p>
                <p className="text-sm font-bold text-[#135bec]">
                  {formValues.status}
                </p>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* INVOICE DETAILS CARD */}
            <div className="bg-white dark:bg-[#1a2133] rounded-xl border border-[#e7ebf3] dark:border-[#2d3748] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e7ebf3] dark:border-[#2d3748] bg-gray-50/50 dark:bg-gray-800/20">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0d121b] dark:text-white">
                  Invoice Settings
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs">
                        Status
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="OVERDUE">Overdue</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input {...field} placeholder="Client name..." />
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
                          placeholder="billing@client.com"
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
                        placeholder="Address details..."
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
                  Invoice Items
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
                        className="group hover:bg-gray-50/30 transition-colors"
                      >
                        <TableCell className="px-6 py-4">
                          <Input
                            {...register(`items.${index}.description`)}
                            placeholder="Service name..."
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
                                index,
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
                            inputMode="decimal"
                            {...register(`items.${index}.unitPrice`)}
                            onChange={(e) =>
                              handleChange({
                                index,
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
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Update & Save Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 gap-2 border-[#cfd7e7]"
                disabled={isSubmitting}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT: PREVIEW STICKY SECTION */}
        <aside className="w-full lg:w-[480px] space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4c669a]">
              Live Document Preview
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] text-blue-600 font-bold uppercase">
                Preview Mode
              </span>
            </div>
          </div>
          <div className="sticky top-10 transform scale-[0.85] lg:scale-[0.95] xl:scale-100 origin-top rounded-xl transition-all duration-500 shadow-2xl shadow-slate-200">
            <InvoiceHTMLPreview data={previewData} />
          </div>
        </aside>
      </div>
    </Form>
  );
}
