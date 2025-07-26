import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TheamedStack } from '@/components/app/TheamedStack';

export default function NotesLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <TheamedStack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[noteId]" options={{ headerShown: false }} />
      </TheamedStack>
    </View>
  );
}
