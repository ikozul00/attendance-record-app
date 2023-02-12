import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { db } from '../../../../firebase/initFirebase';
import { get, onValue, ref } from 'firebase/database';

NfcManager.start();

export const HomeScreen = ({ route, navigation }) => {
  const [date, setDate] = useState('');
  const [podaci, setPodaci] = useState({ datumi: [], vrijednosti: {} });
  const [buttonColor, setButtonColor] = useState('dodgerblue');

  useEffect(() => {
    setDate(getCurrentDate());
    getDataNew();
  }, []);

  const getDataNew = () => {
    const profesorAttendenceDates = [];
    const queryP = ref(db, `/root/Predmeti/Ugradbeni računalni sustavi/Profesor/Datumi`);
    onValue(queryP, (snapshot) => {
      if (profesorAttendenceDates.length !== 0) {
        profesorAttendenceDates = [];
      }
      const data = snapshot.val();
      if (snapshot.exists()) {
        Object.keys(data).forEach((key) => {
          if (data[key] == 1) {
            profesorAttendenceDates.push(key);
          }
        });
      }
    });
    if (route.params.paramKey == 'sgotovac') {
      const query = ref(db, `/root/Predmeti/Ugradbeni računalni sustavi/Datumi/`);
      onValue(query, (snapshot) => {
        const data = snapshot.val();
        var values = {};
        if (snapshot.exists()) {
          profesorAttendenceDates.map((dateVal) => {
            let students = [];
            Object.keys(data[dateVal]).map((student) => {
              if (data[dateVal][student] === 1) {
                students.push(student);
              }
            });
            values = { ...values, [dateVal]: students };
          });
        }
        setPodaci({ datumi: profesorAttendenceDates, vrijednosti: values });
      });
    } else {
      const query = ref(
        db,
        `/root/Predmeti/Ugradbeni računalni sustavi/Studetni/${route.params.paramKey}/Datumi`,
      );
      onValue(query, (snapshot) => {
        const data = snapshot.val();
        let values = {};
        if (snapshot.exists()) {
          profesorAttendenceDates.map((dateVal) => {
            values = { ...values, [dateVal]: data[dateVal] };
          });
        }
        setPodaci({ datumi: profesorAttendenceDates, vrijednosti: values });
      });
    }
  };

  const getCurrentDate = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    if (month < 10) month = 0 + '' + month;
    let year = new Date().getFullYear();

    return date + '' + month + '' + year;
  };

  const changeDateFormat = (date) => {
    let day = date.slice(0, 2);
    let month = date.slice(2, 4);
    let year = date.slice(4);
    return day + '.' + month + '.' + year + '.';
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
    <ScrollView style={{ flex: 1, backgroundColor: '#707070' }}>
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#C0C0C0',
          alignItems: 'center',
        }}
      >
        <Image
          style={{ height: 52, width: 130, marginBottom: 10, marginTop: 10 }}
          source={require('../../../../assets/fesb.png')}
        ></Image>
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
      <View style={{ backgroundColor: '#707070', paddingTop: 50, height: '100%' }}>
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
            <Text style={{ color: 'white', fontSize: 24, alignSelf: 'center', fontWeight: 'bold' }}>
              Ugradbeni računalni sustavi
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 60,
              borderBottomWidth: 1,
              borderBottomColor: 'black',
              marginTop: 15,
              paddingBottom: 5,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Datum</Text>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Prisutnost</Text>
          </View>

          {route.params.paramKey != 'sgotovac' &&
            podaci.datumi.map((el) => (
              <View
                key={el}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 60,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ color: 'white' }}>{changeDateFormat(el)}</Text>
                <Text style={{ color: 'white' }}>
                  {podaci.vrijednosti[el] === 1 ? 'Prisutan' : 'Nije prisutan'}
                </Text>
              </View>
            ))}
          {route.params.paramKey == 'sgotovac' &&
            podaci.datumi.map((el) => (
              <View
                key={el}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 60,
                  borderBottomWidth: 1,
                  borderBottomColor: 'black',
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: 'white' }}>{changeDateFormat(el)}</Text>
                <View style={{ flexDirection: 'column' }}>
                  {podaci.vrijednosti[el].map((name) => (
                    <Text key={name} style={{ color: 'white' }}>
                      {name}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
