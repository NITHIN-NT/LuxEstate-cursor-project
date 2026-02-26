import { pgTable, text, timestamp, uuid, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Admin Users Table
export const admins = pgTable("admins", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").notNull().default("staff"), // 'superuser' | 'staff'
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// OTP Codes for Forgot Password
export const otpCodes = pgTable("otp_codes", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Normalized Property Table
export const properties = pgTable("properties", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    location: text("location").notNull(),
    beds: integer("beds").notNull(),
    baths: integer("baths").notNull(),
    size: text("size").notNull(),
    tag: text("tag"), // e.g., 'Featured', 'New'
    tagColor: text("tag_color"), // 'primary' | 'secondary'
    mainImage: text("main_image").notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Property Images (1:N)
export const propertyImages = pgTable("property_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
    url: text("url").notNull(),
    order: integer("order").default(0).notNull(),
});

// Property Amenities (1:N)
export const propertyAmenities = pgTable("property_amenities", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
});

// Property Features (1:N) - e.g., Year Built, Style
export const propertyFeatures = pgTable("property_features", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
    label: text("label").notNull(),
    value: text("value").notNull(),
});

// Enquiries Table
export const enquiries = pgTable("enquiries", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id").references(() => properties.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    status: text("status").default("pending").notNull(), // 'pending', 'responded', 'closed'
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const propertiesRelations = relations(properties, ({ many }) => ({
    images: many(propertyImages),
    amenities: many(propertyAmenities),
    features: many(propertyFeatures),
    enquiries: many(enquiries),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
    property: one(properties, {
        fields: [propertyImages.propertyId],
        references: [properties.id],
    }),
}));

export const propertyAmenitiesRelations = relations(propertyAmenities, ({ one }) => ({
    property: one(properties, {
        fields: [propertyAmenities.propertyId],
        references: [properties.id],
    }),
}));

export const propertyFeaturesRelations = relations(propertyFeatures, ({ one }) => ({
    property: one(properties, {
        fields: [propertyFeatures.propertyId],
        references: [properties.id],
    }),
}));

export const enquiriesRelations = relations(enquiries, ({ one }) => ({
    property: one(properties, {
        fields: [enquiries.propertyId],
        references: [properties.id],
    }),
}));
