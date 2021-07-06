import React from 'react';
import {StyleProp} from 'react-native';
import Image, {ImageStyle} from 'react-native-fast-image';

type Props = {
  username: string;
  style: StyleProp<ImageStyle>;
};

export default ({username, style}: Props) => (
  <Image
    style={style}
    source={{uri: `https://steemitimages.com/u/${username}/avatar`}}
    onError={() => {
      console.log('error');
    }}
    resizeMode={Image.resizeMode.contain}
    fallback
  />
);
