/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const fetchData = async () => {
  const data = await fetch('https://attendance-record-api.vercel.app/');
  const jsonData = await data.json();
  console.log(jsonData.message);
};

fetchData();

//starting point of application, start writing code here
export const App = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Attendance record app</Text>
      </View>
    </SafeAreaView>
  );
};
