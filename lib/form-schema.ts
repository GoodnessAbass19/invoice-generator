import z from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z
    .string()
    .min(2, "Business Name must be at least 2 characters"),
  tos: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must agree to the terms and conditon in order to proceed",
    }),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Match the Prisma Enum
export const InvoiceStatus = z.enum([
  "DRAFT",
  "PENDING",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);
export const CurrencyEnum = z.enum(["USD", "EUR", "GBP", "NGN", "KES"]);

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Min quantity is 1"),
  unitPrice: z.coerce.number().min(0.01, "Min price is 0.01"),
});

export const invoiceSchema = z
  .object({
    invoiceNo: z.string().min(1, "Invoice number is required"),
    status: InvoiceStatus.default("DRAFT"),

    // Customer Details
    customerName: z.string().min(2, "Customer name is required"),
    customerEmail: z.string().email("Invalid email address"),
    billingAddress: z.string().min(5, "Billing address is required"),
    customerPhone: z.string().optional(),

    // Dates (Coerce handles string-to-date conversion from HTML date inputs)

    issueDate: z.coerce
      .date()
      .refine((d) => !isNaN(d.getTime()), "Invalid issue date"),

    dueDate: z.coerce
      .date()
      .refine((d) => !isNaN(d.getTime()), "Invalid due date"),

    taxRate: z.coerce.number().default(7.5),
    currency: CurrencyEnum.default("USD"),
    notes: z.string().optional(),

    // Nested Items
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  })
  .superRefine((data, ctx) => {
    if (isNaN(data.issueDate.getTime())) {
      ctx.addIssue({
        path: ["issueDate"],
        message: "Invalid issue date",
        code: z.ZodIssueCode.custom,
      });
    }

    if (isNaN(data.dueDate.getTime())) {
      ctx.addIssue({
        path: ["dueDate"],
        message: "Invalid due date",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.dueDate < data.issueDate) {
      ctx.addIssue({
        path: ["dueDate"],
        message: "Due date must be after issue date",
        code: z.ZodIssueCode.custom,
      });
    }
  });
