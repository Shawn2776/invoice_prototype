import { serial } from "drizzle-orm/mysql-core";
import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Tenants Table
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  clerkId: text("clerk_id").notNull().unique(),
  role: text("role").notNull().default("user"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Customers Table
export const customers = pgTable("customers", {
  id: serial("customer_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
});

// Products Table
export const products = pgTable("products", {
  id: serial("product_id").primaryKey(),
  name: varchar("product_name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// Discounts Table
export const discounts = pgTable("discounts", {
  id: serial("discount_id").primaryKey(),
  name: varchar("discount_name", { length: 50 }).notNull(),
  value: decimal("discount_value", { precision: 5, scale: 2 }).notNull(),
});

// Tax Rates Table
export const taxRates = pgTable("tax_rates", {
  id: serial("tax_id").primaryKey(),
  name: varchar("tax_name", { length: 50 }).notNull(),
  rate: decimal("rate", { precision: 5, scale: 2 }).notNull(),
});

// Invoices Table
export const invoices = pgTable("invoices", {
  id: serial("invoice_id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  invoiceDate: integer("invoice_date").notNull(),
  dueDate: integer("due_date").notNull(),
  totalAmount: integer("total_amount").notNull(),
});

// Invoice Details Table
export const invoiceDetails = pgTable("invoice_details", {
  id: serial("detailed_id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  taxId: integer("tax_id").references(() => taxRates.id),
  discountId: integer("discount_id").references(() => discounts.id),
  lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
});

// Payments Table
export const payments = pgTable("payments", {
  id: serial("payment_id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id),
  amount: decimal("payment_amount", { precision: 10, scale: 2 }).notNull(),
  date: date("payment_date").notNull(),
  method: varchar("payment_method", { length: 50 }).notNull(),
  status: varchar("payment_status", { length: 50 }).notNull(),
  reference: varchar("payment_reference", { length: 255 }),
});

// Payment Status Table
export const paymentStatus = pgTable("payment_status", {
  id: serial("status_id").primaryKey(),
  name: varchar("status_name", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }),
});

// Payment Methods Table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("method_id").primaryKey(),
  name: varchar("method_name", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }),
});

// Payment Logs Table
export const paymentLogs = pgTable("payment_logs", {
  id: serial("log_id").primaryKey(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
  logMessage: varchar("log_message", { length: 255 }).notNull(),
});

// Shipping Details Table
export const shippingDetails = pgTable("shipping_details", {
  id: serial("shipping_id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id),
  address: varchar("address", { length: 255 }).notNull(),
  shippingDate: date("shipping_date"),
  estimatedArrival: date("estimated_arrival"),
});

// Bank Details Table
export const bankDetails = pgTable("bank_details", {
  id: serial("bank_detail_id").primaryKey(),
  bankName: integer("bank_name").notNull(),
  accountNumber: integer("account_number").notNull(),
  iban: integer("iban").notNull(),
  bic: integer("bic").notNull(),
});
