import React from 'react';
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import {Input, InputProps} from 'react-native-elements';
import {Width} from 'utils/common.types';

type Props = InputProps & {
  textAlign?: string;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  inputColor?: string;
  secureTextEntry?: boolean;
};

export default ({
  backgroundColor,
  inputColor,
  textAlign,
  containerStyle,
  secureTextEntry,
  ...props
}: Props) => {
  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    backgroundColor,
    inputColor,
    textAlign,
  });
  return (
    <Input
      placeholderTextColor="#B9C9D6"
      containerStyle={[styles.container, containerStyle]}
      inputStyle={styles.input}
      leftIconContainerStyle={styles.leftIcon}
      rightIconContainerStyle={styles.rightIcon}
      inputContainerStyle={styles.inputContainer}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
};

const getDimensionedStyles = ({
  width,
  backgroundColor,
  inputColor,
  textAlign,
}: Width & {
  backgroundColor?: string;
  inputColor?: string;
  textAlign?: string;
}) =>
  StyleSheet.create({
    container: {
      marginLeft: 0.05 * width,
      marginRight: 0.05 * width,
      width: 0.9 * width,
      backgroundColor: backgroundColor || '#000000',
      borderRadius: 25,
      height: 50,
    },
    leftIcon: {height: 30, marginRight: 20},
    rightIcon: {height: 30, marginLeft: 20},
    input: {color: inputColor || '#ffffff'},
    inputContainer: {
      height: '100%',
      borderBottomWidth: 0,
      marginHorizontal: 15,
      textAlign: textAlign || 'left',
    },
  });
