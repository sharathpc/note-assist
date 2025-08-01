import React from 'react';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';

import { cardStyle } from './styles';

type ICardProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof cardStyle>;

const Card = React.forwardRef<HTMLDivElement, ICardProps>(function Card(
  { className, size = 'md', variant = 'elevated', ...props },
  ref
) {
  return (
    <div
      className={cardStyle({ size, variant, class: className })}
      {...props}
      ref={ref}
    />
  );
});

Card.displayName = 'Card';

export { Card };
