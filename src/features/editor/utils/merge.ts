import deepmerge from 'deepmerge';
import jsYaml from 'js-yaml';

/**
 * Merges multiple Docker Compose YAML files into a single YAML string.
 * @param filesContent Array of YAML strings to merge.
 * @returns A single merged YAML string.
 */
export function mergeComposeFiles(filesContent: string[]): string {
  try {
    const objects = filesContent
      .map((content) => {
        try {
          const parsed = jsYaml.load(content);
          return typeof parsed === 'object' && parsed !== null ? parsed : null;
        } catch (e) {
          console.error('Error parsing YAML content:', e);
          return null;
        }
      })
      .filter((obj): obj is Record<string, unknown> => obj !== null);

    if (objects.length === 0) {
      return '';
    }

    if (objects.length === 1) {
      return jsYaml.dump(objects[0]);
    }

    const merged = deepmerge.all(objects);
    return jsYaml.dump(merged);
  } catch (error) {
    console.error('Error merging compose files:', error);
    return '# Error merging compose files\n' + (error instanceof Error ? `# ${error.message}` : '');
  }
}
