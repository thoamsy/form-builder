import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type ButtonProps } from '@/components/ui/button';
import { type ComponentProps } from 'react';

interface IconButtonProps extends ButtonProps {
  tooltip?: string;
  Icon: ComponentProps<'svg'> & React.FC;
}

export function IconButton({
  tooltip,
  Icon,
  size = 'icon',
  variant = 'outline',
  ...props
}: IconButtonProps) {
  if (!tooltip) {
    return (
      <Button size={size} variant={variant} {...props}>
        <Icon />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size={size} variant={variant} {...props}>
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
