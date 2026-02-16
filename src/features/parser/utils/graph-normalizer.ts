import type { ComposeFile } from '../schemas/compose.schema';
import type { ComposeGraph, ServiceNode, ServiceEdge, VolumeNode } from '../types';

export function normalizeToGraph(compose: ComposeFile): ComposeGraph {
  const services: Record<string, ServiceNode> = {};
  const volumes: Record<string, VolumeNode> = {};
  const edges: ServiceEdge[] = [];
  const allNetworks = new Set<string>();

  if (!compose.services) {
    return { services: {}, edges: [], networks: [], volumes: {} };
  }

  // 1. Create Nodes
  Object.entries(compose.services).forEach(([name, def]) => {
    // Normalize networks (array vs object)
    let serviceNetworks: string[] = [];
    if (Array.isArray(def.networks)) {
      serviceNetworks = def.networks;
    } else if (def.networks && typeof def.networks === 'object') {
      serviceNetworks = Object.keys(def.networks);
    }

    // Default network if none specified
    if (serviceNetworks.length === 0) {
      serviceNetworks = ['default'];
    }

    serviceNetworks.forEach(n => allNetworks.add(n));

    // Normalize ports (string vs number)
    const normalizedPorts = def.ports?.map(p => p.toString());

    // Normalize environment (array vs object) -> just store keys/values as strings
    let normalizedEnv: string[] = [];
    if (Array.isArray(def.environment)) {
      normalizedEnv = def.environment;
    } else if (def.environment) {
      normalizedEnv = Object.entries(def.environment).map(([k, v]) => `${k}=${v}`);
    }

    // Normalize depends_on (array vs object)
    let dependsOnDeps: string[] = [];
    if (Array.isArray(def.depends_on)) {
      dependsOnDeps = def.depends_on;
    } else if (def.depends_on) {
      dependsOnDeps = Object.keys(def.depends_on);
    }

    // Extract Volumes
    if (def.volumes) {
      def.volumes.forEach((volString) => {
        // Volume string format: "source:target:mode"
        const [source] = volString.split(':');
        if (!source) return;

        const isBind = source.startsWith('.') || source.startsWith('/');
        const volType = isBind ? 'bind' : 'volume';

        // Add volume node if it doesn't exist
        if (!volumes[source]) {
          volumes[source] = { id: source, type: volType };
        }

        // Add edge from Service to Volume
        edges.push({
          source: name,
          target: source,
          type: 'volume', // We need to handle this type in rendering
          label: 'mounts',
        });
      });
    }

    services[name] = {
      id: name,
      image: def.image,
      ports: normalizedPorts,
      volumes: def.volumes,
      networks: serviceNetworks,
      environment: normalizedEnv,
      dependsOn: dependsOnDeps,
    };
  });

  // 2. Create Edges (depends_on)
  Object.values(services).forEach((node) => {
    if (node.dependsOn) {
      node.dependsOn.forEach((targetService) => {
        // Only create edge if target exists
        if (services[targetService]) {
          edges.push({
            source: node.id,
            target: targetService,
            type: 'depends_on',
            label: 'depends_on',
          });
        }
      });
    }
  });

  return { services, edges, networks: Array.from(allNetworks), volumes };
}
