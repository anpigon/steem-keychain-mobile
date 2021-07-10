import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NotFoundIcon from 'assets/not_found.svg';

type Props = {
  errorDomain: string | undefined;
  errorCode: number;
  errorDesc: string;
};

const NotFound = ({errorDomain, errorCode, errorDesc}: Props) => {
  console.log({errorDomain, errorCode, errorDesc})
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <NotFoundIcon fill="#5F6368"/>
      <Text style={styles.title}>사이트에 연결할 수 없음</Text>
      <Text style={styles.subtitle}>{errorDomain} 에 오타가 있는지 확인하세요.</Text>
      <Text style={styles.subtitle}>{errorDesc}</Text>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      backgroundColor: 'white',
      height: '100%',
      width: '100%',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginTop: 50,
      fontWeight: "500",
      color: "#000"
    },
    subtitle: {
      fontSize: 14,
      marginTop: 15,
      color: "#5F6368"
    },
  });

export default NotFound;
