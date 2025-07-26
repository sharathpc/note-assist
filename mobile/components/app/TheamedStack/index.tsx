import { ReactNode } from 'react';

import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

interface Props {
  children: ReactNode;
}

export const TheamedStack = ({ children }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#f6f6f6',
        },
      }}
    >
      {children}
    </Stack>
  );
};
