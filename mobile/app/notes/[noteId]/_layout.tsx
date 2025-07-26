import { Stack } from 'expo-router';
import { View } from 'react-native';

import { TheamedStack } from '@/components/app/TheamedStack';

export default function NoteLayout() {
  return (
    <View style={{ flex: 1 }}>
      <TheamedStack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </TheamedStack>
    </View>
  );
}
