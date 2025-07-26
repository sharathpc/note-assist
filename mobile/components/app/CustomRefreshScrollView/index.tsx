import { ReactNode, useState } from 'react';

import { RefreshControl, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
  refreshMethod?: () => void;
}

export const CustomRefreshScrollView = ({ children, refreshMethod }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => {
            setLoading(true);
            if (refreshMethod) {
              refreshMethod();
            }
            setTimeout(() => {
              setLoading(false);
            }, 50);
          }}
        />
      }
    >
      {!loading && children}
    </ScrollView>
  );
};
