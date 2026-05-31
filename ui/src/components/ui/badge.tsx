import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
        amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        green: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        red: 'bg-red-500/20 text-red-400 border border-red-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        slate: 'bg-slate-700/50 text-slate-400 border border-slate-600/50',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
