import { z } from "zod";
import { ROLES, TRACKS, APPLICATION_ROLES } from "@/lib/constants";

export const signupSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES).default("student"),
  track: z.enum(TRACKS).optional(),
  country: z.string().optional(),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const tutorMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000),
  lessonId: z.string().optional(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

export const submissionSchema = z.object({
  projectId: z.string().min(1),
  submissionLink: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  notes: z.string().max(4000).optional(),
});

export const applicationSchema = z.object({
  role: z.enum(APPLICATION_ROLES),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  track: z.enum(TRACKS).optional(),
  org: z.string().optional(),
  motivation: z.string().optional(),
  fields: z.record(z.string(), z.any()).optional(),
});
