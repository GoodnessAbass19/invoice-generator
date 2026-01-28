/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: 900,
    color: "#135bec",
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 9,
    textTransform: "uppercase",
  },

  section: {
    marginBottom: 32,
  },

  label: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#64748b",
    marginBottom: 4,
  },

  value: {
    fontSize: 11,
    fontWeight: 600,
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#0f172a",
    paddingBottom: 6,
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  colDesc: { width: "45%" },
  colQty: { width: "15%", textAlign: "center" },
  colRate: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },

  totals: {
    marginTop: 32,
    alignSelf: "flex-end",
    width: 220,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  totalFinal: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 6,
    fontSize: 14,
    fontWeight: 900,
    color: "#135bec",
  },
});

const money = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

export const InvoicePDF = ({ data }: { data: any }) => {
  const currency = data.currency || "USD";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text># {data.invoiceNo}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.badge}>{data.status || "DRAFT"}</Text>
            <Text>
              Issued{" "}
              {data.issueDate
                ? format(new Date(data.issueDate), "MMM dd, yyyy")
                : ""}
            </Text>
          </View>
        </View>

        {/* Billing */}
        <View style={[styles.section, { flexDirection: "row" }]}>
          <View style={{ width: "50%" }}>
            <Text style={styles.label}>Billed To</Text>
            <Text style={styles.value}>{data.customerName}</Text>
            <Text>{data.customerEmail}</Text>
            <Text>{data.billingAddress}</Text>
          </View>

          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <Text style={styles.label}>Due Date</Text>
            <Text>
              {data.dueDate
                ? format(new Date(data.dueDate), "MMM dd, yyyy")
                : ""}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {data.items?.map((item: any, i: number) => (
            <View key={i} style={styles.row}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colRate}>
                {money(item.unitPrice, currency)}
              </Text>
              <Text style={styles.colAmount}>
                {money(item.quantity * item.unitPrice, currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{money(data.subTotal || 0, currency)}</Text>
          </View>

          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text>Tax ({data.taxRate}%)</Text>
              <Text>{money(data.tax || 0, currency)}</Text>
            </View>
          )}

          <View style={[styles.totalRow, styles.totalFinal]}>
            <Text>Total</Text>
            <Text>{money(data.totalAmount || 0, currency)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={{ marginTop: 32 }}>
            <Text style={styles.label}>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
