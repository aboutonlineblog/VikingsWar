import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';
import { images } from '@/assets';
import { colors } from '@/theme/theme';

interface CachedRemoteImageProps {
  uri?: string;
  fallback?: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  testID?: string;
}

export function CachedRemoteImage({
  uri,
  fallback = images.warriorBerserker,
  style,
  testID,
}: CachedRemoteImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  const source: ImageSourcePropType =
    uri && !failed ? { uri } : fallback;

  return (
    <View style={[styles.frame, style]}>
      <Image
        testID={testID}
        source={source}
        style={[styles.image, style]}
        onError={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.bgElevated,
  },
});
