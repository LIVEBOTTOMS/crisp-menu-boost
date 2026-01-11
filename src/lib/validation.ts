import { z } from 'zod';

// Auth Validation Schemas
export const signupSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .max(255, 'Email is too long'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});

// Venue Validation Schemas
export const venueSchema = z.object({
    name: z
        .string()
        .min(1, 'Venue name is required')
        .min(2, 'Venue name must be at least 2 characters')
        .max(100, 'Venue name is too long')
        .regex(/^[a-zA-Z0-9\s\-'&.]+$/, 'Venue name contains invalid characters'),
    slug: z
        .string()
        .min(2, 'Slug must be at least 2 characters')
        .max(50, 'Slug is too long')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
        .regex(/^[a-z]/, 'Slug must start with a letter')
        .regex(/[a-z0-9]$/, 'Slug must end with a letter or number'),
    tagline: z
        .string()
        .max(200, 'Tagline is too long')
        .optional()
        .nullable(),
    subtitle: z
        .string()
        .max(200, 'Subtitle is too long')
        .optional()
        .nullable(),
    logo_text: z
        .string()
        .max(50, 'Logo text is too long')
        .optional()
        .nullable(),
    logo_subtext: z
        .string()
        .max(50, 'Logo subtext is too long')
        .optional()
        .nullable(),
    logo_image_url: z
        .string()
        .url('Invalid URL')
        .max(500, 'URL is too long')
        .optional()
        .nullable(),
    theme: z
        .enum(['cyberpunk-tech', 'dark-luxury', 'midnight-blue', 'forest-premium', 'royal-purple', 'crimson-elite', 'slate-modern'])
        .optional()
        .nullable()
});

// Menu Item Validation Schemas
export const menuItemSchema = z.object({
    name: z
        .string()
        .min(1, 'Item name is required')
        .min(2, 'Item name must be at least 2 characters')
        .max(200, 'Item name is too long'),
    description: z
        .string()
        .max(1000, 'Description is too long')
        .optional()
        .nullable(),
    price: z
        .number()
        .min(0, 'Price cannot be negative')
        .max(999999, 'Price is too high')
        .optional()
        .nullable(),
    image_url: z
        .string()
        .url('Invalid image URL')
        .max(500, 'URL is too long')
        .optional()
        .nullable(),
    is_vegetarian: z.boolean().optional(),
    is_vegan: z.boolean().optional(),
    is_gluten_free: z.boolean().optional(),
    spice_level: z
        .number()
        .int()
        .min(0, 'Spice level must be between 0 and 5')
        .max(5, 'Spice level must be between 0 and 5')
        .optional()
        .nullable(),
    allergens: z
        .array(z.string().max(50))
        .max(20, 'Too many allergens')
        .optional()
        .nullable(),
    tags: z
        .array(z.string().max(50))
        .max(20, 'Too many tags')
        .optional()
        .nullable()
});

// Category Validation Schema
export const categorySchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .min(2, 'Category name must be at least 2 characters')
        .max(100, 'Category name is too long'),
    section_id: z.string().uuid('Invalid section ID'),
    venue_id: z.string().uuid('Invalid venue ID')
});

// Section Validation Schema
export const sectionSchema = z.object({
    name: z
        .string()
        .min(1, 'Section name is required')
        .min(2, 'Section name must be at least 2 characters')
        .max(100, 'Section name is too long'),
    venue_id: z.string().uuid('Invalid venue ID')
});

// Sanitization helpers
export const sanitizeHtml = (input: string): string => {
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
};

export const sanitizeSlug = (input: string): string => {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const sanitizeFileName = (input: string): string => {
    return input
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 255);
};

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VenueInput = z.infer<typeof venueSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
