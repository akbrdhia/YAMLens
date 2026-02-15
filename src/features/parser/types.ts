// The normalized graph structure (Output of the parser)
export interface ComposeGraph {
  services: Record<string, ServiceNode>;
  edges: ServiceEdge[];
}

export interface ServiceNode {
  id: string; // Service name
  image?: string;
  ports?: string[];
  volumes?: string[];
  networks?: string[];
  environment?: string[];
  dependsOn?: string[];
}

export interface ServiceEdge {
  source: string;
  target: string;
  type: 'depends_on' | 'network' | 'link';
  label?: string;
}

// Result object to return to UI
export interface ParseResult {
  success: boolean;
  data?: ComposeGraph;
  error?: string;
}
