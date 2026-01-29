/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CalendarIcon,
  Download,
  Edit,
  FileText,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Invoice, InvoiceItem } from "@/app/generated/prisma/client";
import { useUser } from "@/hooks/user-context";
import {
  cn,
  formatCurrencyValue,
  getStatusBadgeVariant,
  getStatusDisplayName,
} from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./invoice-template";
import dynamic from "next/dynamic";
import { InvoicePDFDownload } from "./invoice-download";

const InvoicePreviewModal = dynamic(
  () =>
    import("./invoice-preview-modal").then((mod) => mod.InvoicePreviewModal),
  {
    ssr: false,
    loading: () => (
      <Button size="icon" disabled>
        <Loader2 className="animate-spin h-4 w-4" />
      </Button>
    ),
  },
);

const fetchInvoices = async () => {
  const res = await fetch(`/api/invoice`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch invoices.");
  }
  return res.json();
};

const deleteInvoice = async (productId: string) => {
  const res = await fetch(`/api/invoice/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to delete invoice.");
  }
  return res.json();
};

const InvoiceManagement = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const user = useUser();
  const {
    data: invoices = [],
    isLoading,
    isError,
    error,
  } = useQuery<Array<Invoice & { items: InvoiceItem[] }>, Error>({
    queryKey: ["traderInvoices"],
    queryFn: () => fetchInvoices(),
    staleTime: 5 * 60 * 1000,
    enabled: !!user.admin?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      toast("Product Deleted", {
        description: "Product removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["traderInvoices"] });
    },
    onError: (err: any) => {
      toast("Deletion Failed", {
        description: err.message,
      });
    },
  });

  const handleDelete = (invoiceId: string) => {
    deleteMutation.mutate(invoiceId);
  };

  //   Using UseMemo to filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // 1. Text Search
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        invoice.customerName?.toLowerCase().includes(term) ||
        invoice.invoiceNo?.toLowerCase().includes(term);

      // 2. Status Filter
      const matchesStatus =
        statusFilter === "ALL" || invoice.status === statusFilter;

      // 3. Date Range Filter
      let matchesDate = true;
      if (date?.from) {
        const invoiceDate = new Date(invoice.issueDate);
        const start = startOfDay(date.from);
        const end = date.to ? endOfDay(date.to) : endOfDay(date.from);
        matchesDate = isWithinInterval(invoiceDate, { start, end });
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [invoices, searchTerm, statusFilter, date]);

  if (isLoading) {
    return (
      <section className="max-w-screen-2xl mx-auto mt-10 p-4 min-h-125 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-300"></div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">Error: {error.message}</p>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["traderInvoices"] })
          }
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-6 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h2 className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Invoices
        </h2>
        <button
          onClick={() => router.push(`${pathname}/create`)}
          className="flex min-w-35 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-[#135bec] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="truncate">New Invoice</span>
        </button>
      </div>

      {/* Table Search and Filter */}
      {/* <div className="bg-white dark:bg-[#1a2133] rounded-t-xl border border-gray-200 dark:border-gray-800 border-b-0 p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex-1 min-w-75">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Invoice ID or Customer Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex w-full rounded-lg h-11 text-[#0d121b] dark:text-white focus:ring-[#135bec] focus:border-[#135bec] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-11 pr-4 text-base font-normal placeholder:text-[#4c669a]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                calendar_today
              </span>
              <span className="text-sm font-medium">Date Range</span>
            </button>
            <button className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                filter_list
              </span>
              <span className="text-sm font-medium">Status</span>
            </button>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <button className="flex items-center justify-center rounded-lg h-11 bg-primary/10 text-primary gap-2 text-sm font-bold px-4 hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-[20px]">
                download
              </span>
              <span>Export to CSV</span>
            </button>
          </div>
        </div>
      </div> */}
      {/* Table Search and Filter Area */}
      <div className="bg-white dark:bg-[#1a2133] rounded-t-xl border border-gray-200 dark:border-gray-800 border-b-0 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="flex-1 min-w-75">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Invoice ID or Customer Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-11 bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* DATE RANGE PICKER */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 justify-start text-left font-normal min-w-60 bg-gray-50 dark:bg-gray-800",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* STATUS SELECT */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-37.5 bg-gray-50 dark:bg-gray-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* CLEAR FILTERS */}
            {(searchTerm || statusFilter !== "ALL" || date?.from) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setDate(undefined);
                }}
                className="h-11"
              >
                Clear
              </Button>
            )}

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2 hidden lg:block"></div>

            <Button className="h-11 gap-2 bg-primary/10 text-primary hover:bg-primary/20">
              <span className="material-symbols-outlined text-[20px]">
                download
              </span>
              <span>Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white dark:bg-[#1a2133] rounded-b-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Invoice ID
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Customer Name
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <span className="material-symbols-outlined text-4xl">
                      receipt_long
                    </span>
                    <p>No Invoice found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell className="px-6 py-4 text-sm font-bold text-[#135bec] cursor-pointer hover:underline">
                    #{invoice.invoiceNo}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#0d121b] dark:text-gray-200 font-medium">
                    {invoice.customerName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(invoice.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrencyValue(invoice.totalAmount, invoice.currency)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <Badge variant={getStatusBadgeVariant(invoice.status)}>
                      {getStatusDisplayName(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {/* <InvoicePreviewModal invoice={invoice} /> */}
                      <InvoicePDFDownload
                        invoice={invoice}
                        businessName={user.admin!.businessName}
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/dashboard/invoices/${invoice.id}/edit`)
                        }
                        className="bg-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your Invoice.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(invoice.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <span>
                                  <Trash2 className="h-4 w-4" /> Delete
                                </span>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceManagement;
