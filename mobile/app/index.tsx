import { useEffect } from 'react';

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { NoteAssistLogo } from '@/constants/Images';
import { APP_BG_COLOR } from '@/constants/Variables';
import { useAuthStore } from '@/store/authStore';

const App = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user.userId) {
      router.replace('/notes');
    } else {
      router.replace('/login');
    }
  }, [user]);

  return (
    <View>
      <Center
        className="h-full w-full"
        style={{ backgroundColor: APP_BG_COLOR }}
      >
        <VStack space="md" className="items-center">
          <Image
            source={NoteAssistLogo}
            style={{
              height: 80,
              width: 150,
            }}
          />
          <Heading size="3xl" className="text-background-800">
            Note Assist
          </Heading>
        </VStack>
      </Center>
    </View>
  );
};

export default App;
