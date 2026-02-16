import { memo, useMemo, createElement } from 'react';
import { getServiceIcon } from '@/features/parser';
import { Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceIconProps {
  image?: string;
  className?: string;
}

export const ServiceIcon = memo(({ image, className }: ServiceIconProps) => {
  const iconComponent = useMemo(() => getServiceIcon(image) || Box, [image]);
  return createElement(iconComponent, { className: cn("shrink-0", className) });
});

ServiceIcon.displayName = 'ServiceIcon';
