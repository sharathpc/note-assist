import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

interface Props {
  message?: string;
}

export const NoDataSection = ({ message = 'No Data' }: Props) => {
  return (
    <Card className="justify-center items-center h-full w-full">
      <Text>{message}</Text>
    </Card>
  );
};
