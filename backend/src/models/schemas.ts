import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100),
  phone: z.string().optional(),
  role: z.enum(['CITIZEN', 'STAFF', 'ADMIN']).default('CITIZEN'),
  departmentId: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const CreateComplaintSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .min(10, 'Description must provide at least 10 characters of detail')
    .max(2000, 'Description cannot exceed 2000 characters'),
  categoryId: z.string().min(1, 'Category ID is required'),
  location: z.string().min(3, 'Location description is required').max(255),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']),
  remarks: z.string().max(500, 'Remarks cannot exceed 500 characters').optional(),
  rejectionReason: z.string().max(500).optional(),
});

export const AssignStaffSchema = z.object({
  staffId: z.string().min(1, 'Staff ID is required'),
  notes: z.string().max(500).optional(),
});

export const SubmitFeedbackSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(1000).optional(),
  resolutionConfirmed: z.boolean().default(true),
});

export const FilterComplaintsQuerySchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  categoryId: z.string().optional(),
  departmentId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateComplaintInput = z.infer<typeof CreateComplaintSchema>;
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;
export type AssignStaffInput = z.infer<typeof AssignStaffSchema>;
export type SubmitFeedbackInput = z.infer<typeof SubmitFeedbackSchema>;
export type FilterComplaintsQuery = z.infer<typeof FilterComplaintsQuerySchema>;
