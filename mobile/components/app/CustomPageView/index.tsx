import { ReactNode } from 'react';

import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';

interface Props {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  isHeroPage?: boolean;
  loading?: boolean;
}

export const CustomPageView = ({
  title,
  children,
  footer,
  action,
  isHeroPage = false,
  loading = false,
}: Props) => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-start">
      <View className="flex-row justify-between items-center mx-3">
        <HStack space="sm" className="justify-start items-center">
          {!isHeroPage && (
            <Pressable
              onPress={() =>
                router.canGoBack() ? router.back() : router.push('/notes')
              }
            >
              <Icon as={ChevronLeft} size="xl" />
            </Pressable>
          )}
          <View className="justify-start items-start">
            <Heading size={isHeroPage ? 'xl' : 'lg'}>{title}</Heading>
          </View>
        </HStack>
        {action}
      </View>
      {loading ?
        <View className="flex-1 justify-center items-center">
          <Spinner size="small" />
        </View>
      : <>
          {children}
          {footer}
        </>
      }
    </View>
  );
};
