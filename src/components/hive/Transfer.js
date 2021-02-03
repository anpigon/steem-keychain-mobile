import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {withCommas} from 'utils/format';

const Transfer = ({transaction, user, token}) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {timestamp, from, to, amount, memo} = transaction;
  const other = from === username ? to : from;
  const direction = from === username ? '-' : '+';
  const color = direction === '+' ? '#3BB26E' : '#B9122F';
  const date = new Date(token ? timestamp * 1000 : timestamp).toLocaleString(
    [],
    {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    },
  );

  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    color,
  });
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.main}>
        <View style={styles.left}>
          <Text>{date}</Text>
          <Text style={styles.username}>{`@${other}`}</Text>
        </View>

        <Text style={styles.amount}>{`${direction} ${withCommas(amount)} ${
          amount.split(' ')[1]
        }`}</Text>
      </View>
      {toggle && <Text>{memo}</Text>}
    </TouchableOpacity>
  );
};

// const renderToggle = (user, memo) => {
//   let decryptedMemo = memo;
//   if (!memo || !memo.length) {
//     return null;
//   }
//   try {
//     if (memo[0] === '#') {
//       if (user.keys.memo) {
//         decryptedMemo = `Decrypted: ${decodeMemo(user.keys.memo, memo)}`;
//         //decryptedMemo = 'Decrypting memos is not supported yet';
//       } else {
//         decryptedMemo = 'Please add your memo key to decrypt this message.';
//       }
//     }
//     return <Text>{decryptedMemo}</Text>;
//   } catch (e) {
//     console.log('Not really encrypted');
//     return null;
//   }
// };

const getDimensionedStyles = ({width, height, color}) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderColor: 'black',
      padding: height * 0.01,
    },
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    left: {display: 'flex', flexDirection: 'row'},
    username: {paddingLeft: 10},
    amount: {color},
  });

export default Transfer;
