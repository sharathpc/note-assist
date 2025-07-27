import { useEffect, useState } from 'react';

import { launchImageLibraryAsync } from 'expo-image-picker';
import { ImageIcon, Trash2 } from 'lucide-react-native';
import { Image, View } from 'react-native';

import {
  Button,
  ButtonGroup,
  ButtonSpinner,
  ButtonText,
} from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

interface Props {
  loading?: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ImagePicker = ({ loading = false, value, onChange }: Props) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0]);
      setImageUri(result.assets[0].uri);
    }
  };

  useEffect(() => {
    setImageUri(value);
  }, [value]);

  return (
    <View>
      {imageUri ?
        <View className="flex justify-center items-center">
          <Image
            source={{ uri: imageUri }}
            className="rounded-lg"
            style={{ width: '100%', height: 250 }}
            resizeMode="cover"
          />
          {value !== imageUri ?
            <ButtonGroup className="flex-row mt-2 items-stretch justify-between">
              <Button
                size="sm"
                className="flex-1"
                action="secondary"
                onPress={() => setImageUri(null)}
                disabled={loading}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onPress={() => onChange(imageUri)}
                disabled={loading}
              >
                {loading ?
                  <ButtonSpinner />
                : <ButtonText>Upload</ButtonText>}
              </Button>
            </ButtonGroup>
          : <Pressable
              className="absolute top-0 right-0 z-10 m-2 p-1 bg-white rounded-full"
              onPress={() => onChange(null)}
            >
              <Icon as={Trash2} className="w-4 h-4" />
            </Pressable>
          }
        </View>
      : <Pressable onPress={pickImage}>
          <View className="flex justify-center items-center p-8 border border-dashed border-primary-0 rounded-lg">
            <Icon as={ImageIcon} className="w-10 h-10 mb-2" />
            <Text className="text-primary-300 font-semibold" size="sm">
              Tap to upload photo
            </Text>
            <Text size="xs">PNG, JPG, JPEG etc.. files supported</Text>
          </View>
        </Pressable>
      }
    </View>
  );
};
