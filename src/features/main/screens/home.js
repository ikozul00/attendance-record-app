import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackView } from '@react-navigation/stack';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import DeviceInfo from 'react-native-device-info';
import { getDeviceInfo } from 'react-native-device-info';

NfcManager.start();

export const HomeScreen = ({ route, navigation }) => {
  const [macAddress, setMacAddress] = useState('');
  const [buttonColor, setButtonColor] = useState('dodgerblue');

  useEffect(() => {
    const date = getCurrentDate();
    DeviceInfo.getMacAddress().then((mac) => {
      setMacAddress(mac);
    });
  }, []);

  const getCurrentDate = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    if (month < 10) month = 0 + '' + month;
    let year = new Date().getFullYear();

    return date + '' + month + '' + year;
  };

  async function readNdef() {
    try {
      setButtonColor('midnightblue');
      const user = {};
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      user.classroom = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      user.username = route.params.paramKey;
      user.isProfesor = route.params.paramKey === 'sgotovac' ? true : false;
      fetch('http://192.168.43.177:5000/scanning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (response.status !== 200) console.error('Trouble sending data!');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
      setButtonColor('dodgerblue');
    }
  }

  return (
    /*<NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer> */

    /*<Image
                    style={{ height: 40, width: 40, marginBottom: 10, alignSelf: "center" }}
                    source={require('../../../../assets/hamburger.png')}>
                </Image>*/

    <View style={{ flex: 1, backgroundColor: '#C0C0C0' }}>
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Image
          style={{ height: 52, width: 130, marginBottom: 10 }}
          source={require('../../../../assets/fesb.png')}
        ></Image>
        <Text>{macAddress}</Text>
        <View>
          <Text style={{ color: 'black' }}>{route.params.paramKey}</Text>
          <TouchableOpacity>
            <Text
              style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}
              onPress={() => navigation.replace('Login')}
            >
              Odjavi se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ backgroundColor: '#707070', paddingTop: 50, flex: 1 }}>
        <TouchableOpacity
          style={{
            borderRadius: 125,
            width: 250,
            height: 250,
            alignSelf: 'center',
            backgroundColor: buttonColor,
            justifyContent: 'center',
          }}
          onPress={readNdef}
        >
          <Text style={{ fontSize: 50, color: 'white', alignSelf: 'center' }}>Skeniraj</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>
              Ugradbeni računalni sustavi
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 60 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Datum</Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Prisutnost</Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 60 }}
          >
            <Text style={{ color: 'white' }}>05.01.2023.</Text>
            <Text style={{ color: 'white' }}>Prisutan</Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 60 }}
          >
            <Text style={{ color: 'white' }}>12.01.2023.</Text>
            <Text style={{ color: 'white' }}>Nije prisutan</Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 60 }}
          >
            <Text style={{ color: 'white' }}>19.01.2023.</Text>
            <Text style={{ color: 'white' }}>Prisutan</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
