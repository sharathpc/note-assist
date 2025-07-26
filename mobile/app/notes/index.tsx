import { useEffect, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { LogOutIcon } from 'lucide-react-native';
import { DateTime } from 'luxon';
import { View } from 'react-native';

import { CustomPageView } from '@/components/app/CustomPageView';
import { NoDataSection } from '@/components/app/NoDataSection';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { INote } from '@/models';
import { getNotes } from '@/services/NotesService';
import { useAuthStore } from '@/store/authStore';
import { generateSkeletonData } from '@/utils/skeleton';

const Notes = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<INote[]>([]);

  const getData = () => {
    setLoading(true);
    getNotes(user.userId)
      .then((data) => setNotes(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <CustomPageView
      title="Notes"
      isHeroPage={true}
      action={
        <HStack>
          <Button
            className="mr-2"
            size="sm"
            variant="link"
            action="primary"
            onPress={() => router.push('/notes/0')}
          >
            <ButtonText>Create</ButtonText>
          </Button>
          <Button
            className="mx-2"
            size="sm"
            variant="link"
            action="primary"
            onPress={() => logout()}
          >
            <ButtonIcon as={LogOutIcon} />
          </Button>
        </HStack>
      }
    >
      <FlashList
        data={!loading ? notes : generateSkeletonData<INote>('noteId', 10)}
        scrollEnabled={!loading}
        estimatedItemSize={50}
        refreshing={loading}
        keyExtractor={(item: INote) => item.noteId}
        ListEmptyComponent={<NoDataSection message="No notes found" />}
        renderItem={({ item }: { item: INote }) =>
          loading ?
            <Card className="p-3 rounded-lg m-3">
              <View className="flex-row">
                <VStack space="sm">
                  <Skeleton className="h-5 w-96 rounded-sm" />
                  <HStack space="xs" className="items-center">
                    <Skeleton className="h-3 w-32 rounded-sm" />
                  </HStack>
                </VStack>
              </View>
              <View className="my-4 flex-row">
                <VStack
                  space="sm"
                  className="items-center flex-1 pb-0 border-r border-outline-300"
                >
                  <Skeleton className="h-4 w-24 rounded-sm" />
                  <Skeleton className="h-2 w-14 rounded-sm" />
                </VStack>
                <VStack
                  space="sm"
                  className="items-center flex-1 py-0 border-r border-outline-300"
                >
                  <Skeleton className="h-4 w-24 rounded-sm" />
                  <Skeleton className="h-2 w-14 rounded-sm" />
                </VStack>
                <VStack space="sm" className="items-center flex-1 pt-0">
                  <Skeleton className="h-4 w-24 rounded-sm" />
                  <Skeleton className="h-2 w-14 rounded-sm" />
                </VStack>
              </View>
            </Card>
          : <Pressable onPress={() => router.push(`/notes/${item.noteId}`)}>
              <Card className="p-3 rounded-lg mx-3 my-1">
                <View className="flex-1">
                  <HStack className="justify-between" space="sm">
                    <Heading size="sm">{item.title}</Heading>
                    <Text size="sm" className="font-medium">
                      {DateTime.fromISO(item.createdAt).toFormat('D')}
                    </Text>
                  </HStack>
                  <Text size="sm">{item.content}</Text>
                </View>
              </Card>
            </Pressable>
        }
      />
    </CustomPageView>
  );
};

export default Notes;
