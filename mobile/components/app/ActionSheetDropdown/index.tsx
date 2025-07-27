import { ElementType, useState } from 'react';

import { View } from 'react-native';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { Input, InputField } from '@/components/ui/input';

interface Props {
  placeholder: string;
  value: any;
  items: { label: string; value: any; icon: ElementType }[];
  onChange: (value: any) => void;
}

export const ActionSheetDropdown = ({
  placeholder,
  value,
  items,
  onChange,
}: Props) => {
  const [showSheet, setShowSheet] = useState(false);

  const handleSheetUpdate = (value: any) => {
    onChange(value);
    setShowSheet(false);
  };

  return (
    <View>
      <Input>
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onPress={() => setShowSheet(true)}
        />
      </Input>
      <Actionsheet isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          {items.map((item) => (
            <ActionsheetItem
              key={item.value}
              onPress={() => handleSheetUpdate(item.value)}
            >
              <ActionsheetIcon as={item.icon} />
              <ActionsheetItemText>{item.label}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
};
