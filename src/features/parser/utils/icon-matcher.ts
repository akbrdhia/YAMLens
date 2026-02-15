import React from 'react';
import {
  SiPostgresql, SiMysql, SiMariadb, SiMongodb, SiRedis, SiElasticsearch, // Databases
  SiNginx, SiApache, SiCaddy, SiTraefikproxy, // Web Servers
  SiDocker, SiJenkins, SiGitlab, SiGithub, // DevOps
  SiNodedotjs, SiPython, SiGo, SiPhp, SiRuby, SiOpenjdk, // Languages (SiJava -> SiOpenjdk)
  SiReact, SiVuedotjs, SiAngular, SiNextdotjs, SiNuxt, // Frameworks
  SiRabbitmq, SiApachekafka, SiPrometheus, SiGrafana // Infra
} from '@icons-pack/react-simple-icons';
import { Database, Globe, Server, Box, Layers, HardDrive } from 'lucide-react';

interface IconMapping {
  regex: RegExp;
  icon: React.ComponentType<{ className?: string; color?: string; size?: string | number }>;
}

const MAPPINGS: IconMapping[] = [
  // Databases
  { regex: /postgres/i, icon: SiPostgresql },
  { regex: /mysql/i, icon: SiMysql },
  { regex: /mariadb/i, icon: SiMariadb },
  { regex: /mongo/i, icon: SiMongodb },
  { regex: /redis/i, icon: SiRedis },
  { regex: /elastic/i, icon: SiElasticsearch },

  // Web Servers
  { regex: /nginx/i, icon: SiNginx },
  { regex: /apache/i, icon: SiApache },
  { regex: /httpd/i, icon: SiApache },
  { regex: /caddy/i, icon: SiCaddy },
  { regex: /traefik/i, icon: SiTraefikproxy },

  // Frameworks/Languages
  { regex: /node/i, icon: SiNodedotjs },
  { regex: /python/i, icon: SiPython },
  { regex: /go/i, icon: SiGo },
  { regex: /php/i, icon: SiPhp },
  { regex: /ruby/i, icon: SiRuby },
  { regex: /java/i, icon: SiOpenjdk },
  { regex: /react/i, icon: SiReact },
  { regex: /vue/i, icon: SiVuedotjs },
  { regex: /angular/i, icon: SiAngular },
  { regex: /next/i, icon: SiNextdotjs },
  { regex: /nuxt/i, icon: SiNuxt },

  // Infra/DevOps
  { regex: /docker/i, icon: SiDocker },
  { regex: /jenkins/i, icon: SiJenkins },
  { regex: /gitlab/i, icon: SiGitlab },
  { regex: /github/i, icon: SiGithub },
  { regex: /rabbitmq/i, icon: SiRabbitmq },
  { regex: /kafka/i, icon: SiApachekafka },
  { regex: /prometheus/i, icon: SiPrometheus },
  { regex: /grafana/i, icon: SiGrafana },
];

export function getServiceIcon(imageName?: string) {
  if (!imageName) return Box;

  for (const mapping of MAPPINGS) {
    if (mapping.regex.test(imageName)) {
      return mapping.icon;
    }
  }

  // Fallbacks based on keywords if no exact brand match
  if (imageName.includes('db') || imageName.includes('sql') || imageName.includes('data')) return Database;
  if (imageName.includes('web') || imageName.includes('site') || imageName.includes('app')) return Globe;
  if (imageName.includes('proxy') || imageName.includes('balancer')) return Layers;
  if (imageName.includes('volume') || imageName.includes('storage')) return HardDrive;

  return Server; // Generic fallback
}
