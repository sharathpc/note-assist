export const generateSkeletonData = <T>(key: string, count: number): T[] => {
  return Array.from({ length: count }, (_, index) => ({
    [key]: index,
  })) as T[];
};
