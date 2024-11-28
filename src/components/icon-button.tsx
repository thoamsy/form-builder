import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type ButtonProps } from '@/components/ui/button';
import { forwardRef, type ComponentProps } from 'react';

interface IconButtonProps extends ButtonProps {
  tooltip?: string;
  Icon: ComponentProps<'svg'> & React.FC;
}

export const IconButton = forwardRef(function IconButton(
  {
    tooltip,
    Icon,
    size = 'icon',
    variant = 'outline',
    ...props
  }: IconButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  if (!tooltip) {
    return (
      <Button ref={ref} size={size} variant={variant} {...props}>
        <Icon />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button ref={ref} size={size} variant={variant} {...props}>
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
});
