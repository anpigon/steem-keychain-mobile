import {Page, TabFields} from 'actions/interfaces';
import Fuse from 'fuse.js';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HistoryItem from './HistoryItem';

type Props = {
  onSubmit: (string: string) => void;
  history: Page[];
  input: string;
};
export default ({input, onSubmit, history}: Props) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fuse = new Fuse(history, {
      shouldSort: true,
      threshold: 0.45,
      location: 0,
      distance: 100,
      //maxPatternLength: 32,
      minMatchCharLength: 0,
      keys: [
        {name: 'name', weight: 0.5},
        {name: 'url', weight: 0.5},
      ],
    });
    const fuseSearchResult = fuse.search(input);
    if (Array.isArray(fuseSearchResult)) {
      setCandidates(fuseSearchResult.map((e) => e.item));
    } else {
      setCandidates([]);
    }
  }, [input, history]);
  if (candidates.length)
    return (
      <View style={styles.wrapper}>
        {candidates.map((e) => (
          <HistoryItem onSubmit={onSubmit} data={e} />
        ))}
      </View>
    );
  else {
    let historyCopy = [...history].reverse().slice(0, 10);
    return (
      <View style={styles.wrapper}>
        {historyCopy.map((e) => (
          <HistoryItem onSubmit={onSubmit} data={e} />
        ))}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {marginTop: 20},
});
