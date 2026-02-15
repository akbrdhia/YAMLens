import yaml from 'js-yaml';
import { ZodError } from 'zod';
import { ComposeFileSchema } from '../schemas/compose.schema';
import { normalizeToGraph } from './graph-normalizer';
import { ParseResult } from '../types';

export function parseDockerCompose(yamlContent: string): ParseResult {
  try {
    // 1. Load YAML
    const raw = yaml.load(yamlContent);

    if (!raw || typeof raw !== 'object') {
      return { success: false, error: 'Invalid YAML: Root must be an object' };
    }

    // 2. Validate with Zod
    const validated = ComposeFileSchema.parse(raw);

    // 3. Normalize
    const graph = normalizeToGraph(validated);

    return { success: true, data: graph };

  } catch (err) {
    if (err instanceof ZodError) {
      // Format Zod errors nicely
      const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      return { success: false, error: `Validation Error:\n${messages}` };
    }

    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return { success: false, error: 'Unknown parsing error' };
  }
}
