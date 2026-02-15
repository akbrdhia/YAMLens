import { z } from 'zod';

// Helper for ports: can be "80:80" (string) or 80 (number)
const PortSchema = z.union([z.string(), z.number()]);

// Helper for depends_on: can be ["db"] (array) or { db: { condition: ... } } (object)
const DependsOnSchema = z.union([
  z.array(z.string()),
  z.record(z.string(), z.any()) // We just care about the keys (service names)
]);

// Service Definition
export const ServiceSchema = z.object({
  image: z.string().optional(),
  container_name: z.string().optional(),
  ports: z.array(PortSchema).optional(),
  volumes: z.array(z.string()).optional(), // Simple string volumes for now
  networks: z.union([
    z.array(z.string()),
    z.record(z.string(), z.any()) // networks: { net1: {} }
  ]).optional(),
  environment: z.union([
    z.array(z.string()),
    z.record(z.string(), z.union([z.string(), z.number()]))
  ]).optional(),
  depends_on: DependsOnSchema.optional(),
});

// Root Compose File Schema
export const ComposeFileSchema = z.object({
  version: z.string().optional(),
  services: z.record(z.string(), ServiceSchema).optional(), // services is technically optional in some versions, but we need it
  networks: z.record(z.string(), z.any()).optional(),
  volumes: z.record(z.string(), z.any()).optional(),
});

export type ComposeFile = z.infer<typeof ComposeFileSchema>;
