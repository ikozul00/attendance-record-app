import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackView } from '@react-navigation/stack';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import DeviceInfo from 'react-native-device-info'
import { getDeviceInfo } from 'react-native-device-info';
import { db } from '../../../../firebase/initFirebase';
import { onValue, ref } from "firebase/database";



NfcManager.start();

export const HomeScreen = ({ route, navigation }) => {

    const [macAddress, setMacAddress] = useState("");
    const [date, setDate] = useState("");
    const [datumi, setDatumi] = useState([]);
    const [datumiProfesor, setDatumiProfesor] = useState([]);
    const [popis, setPopis] = useState([]);



    useEffect(() => {


        setDate(getCurrentDate())
        getData();


    }, [])

    const getData = () => {
        if (route.params.paramKey == "sgotovac") {
            const queryP = ref(db, `/root/Predmeti/Ugradbeni računalni sustavi/Profesor/Datumi`);
            onValue(queryP, (snapshot) => {
                const data = snapshot.val();
                if (snapshot.exists()) {
                    Object.keys(data).forEach((key) => {

                        if (data[key] == 1) {
                            setDatumiProfesor((datumiProfesor) => [...datumiProfesor, key]);
                        }
                    });

                }

            });
            let ListOfData = [];
            datumiProfesor.forEach(el => {
                const query = ref(db, `/root/Predmeti/Ugradbeni računalni sustavi/Datumi/${el}`);
                onValue(query, (snapshot) => {
                    const data = snapshot.val();
                    let array = [];
                    if (snapshot.exists()) {

                        Object.keys(data).forEach((key) => {

                            if (data[key] == 1) {
                                array.push(key);
                            }
                        });


                    }

                    ListOfData.push({ "datum": el, "popis": array })

                    setPopis(ListOfData);

                });
            })
        }
        else {
            const query = ref(db, `/root/Predmeti/Ugradbeni računalni sustavi/Studetni/${route.params.paramKey}/Datumi`);
            onValue(query, (snapshot) => {
                const data = snapshot.val();
                if (snapshot.exists()) {
                    Object.keys(data).forEach((key) => {

                        if (data[key] == 1) {
                            setDatumi((datumi) => [...datumi, key]);
                        }
                    });

                }

            });

            const queryP = ref(db, `/root/Predmeti/Ugradbeni računalni sustavi/Profesor/Datumi`);
            onValue(queryP, (snapshot) => {
                const data = snapshot.val();
                if (snapshot.exists()) {
                    Object.keys(data).forEach((key) => {

                        if (data[key] == 1) {
                            setDatumiProfesor((datumiProfesor) => [...datumiProfesor, key]);
                        }
                    });

                }

            });

        }

    }


    const getCurrentDate = () => {
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        if (month < 10)
            month = 0 + "" + month;
        let year = new Date().getFullYear();

        return date + "" + month + "" + year;
    }

    const changeDateFormat = (date) => {
        let day = date.slice(0, 2);
        let month = date.slice(2, 4);
        let year = date.slice(4);
        return day + "." + month + "." + year + "."
    }



    async function readNdef() {
        try {
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.NfcA);
            // the resolved tag object will contain `ndefMessage` property
            const tag = await NfcManager.getTag();
            console.warn('Tag found', Object.keys(tag));
        } catch (ex) {
            console.warn('Oops!', ex);
        } finally {
            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();
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
            <View style={{ marginTop: 10, marginHorizontal: 10, flexDirection: "row", justifyContent: "space-between" }}>
                <Image
                    style={{ height: 52, width: 130, marginBottom: 10 }}
                    source={require('../../../../assets/fesb.png')}>
                </Image>
                <View>
                    <Text style={{ color: "black" }}>{route.params.paramKey}</Text>
                    <TouchableOpacity>
                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 15 }} onPress={() => navigation.replace("Login")}>Odjavi se</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={{ backgroundColor: '#707070', paddingTop: 50, flex: 1 }} >
                <TouchableOpacity style={{ borderRadius: 125, width: 250, height: 250, alignSelf: 'center', backgroundColor: "dodgerblue", justifyContent: "center" }}
                    onPress={readNdef}>
                    <Text style={{ fontSize: 50, color: "white", alignSelf: "center" }}>Skeniraj</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 50 }}>
                    <View >
                        <Text style={{ color: "white", fontSize: 20, alignSelf: "center", fontWeight: 'bold' }}>Ugradbeni računalni sustavi</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 60 }}>
                        <Text style={{ color: "white", fontWeight: 'bold' }}>Datum</Text>
                        <Text style={{ color: "white", fontWeight: 'bold' }}>Prisutnost</Text>
                    </View>

                    {route.params.paramKey != "sgotovac" && datumiProfesor.map((el) => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 60 }}>
                            <Text style={{ color: "white" }}>{changeDateFormat(el)}</Text>
                            <Text style={{ color: "white" }}>{datumi.includes(el) ? "Prisutan" : "Nije prisutan"}</Text>
                        </View>
                    ))}
                    {route.params.paramKey == "sgotovac" && datumiProfesor.map((el) => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 60 }}>
                            <Text style={{ color: "white" }}>{changeDateFormat(el)}</Text>
                            {popis.map(x => (
                                x.datum == el &&
                                <View key={x.datum}>
                                    <Text style={{ color: "white" }}>{x.popis.join(", ")}</Text>
                                </View>
                            )
                            )}

                            {console.log(popis)}
                        </View>
                    ))}
                </View>
            </View >

        </View>

    );
};

export default HomeScreen;