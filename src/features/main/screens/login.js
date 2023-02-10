import { StyleSheet, TouchableOpacity, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react'

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const names = new Array("mbrigi00", "ikozul00", "mmucic00");

    const login = () => {
        if (names.includes(email) && password != "")
            navigation.replace("Home", { paramKey: email });

    }

    return (
        <View style={{ paddingHorizontal: 30, flex: 1, justifyContent: "center", backgroundColor: "#707070" }}>
            <Text style={{ fontSize: 30, textAlign: 'center', paddingBottom: 20, color: "white" }}>PRIJAVA</Text>
            <Text style={{ paddingLeft: 10, color: "white" }}>Korisničko ime</Text>
            <TextInput autoCapitalize='none' style={{ paddingLeft: 10, fontSize: 18, borderWidth: 1, marginBottom: 10, borderRadius: 15, paddingHorizontal: 4, borderColor: "grey", backgroundColor: "white", paddingVertical: 4, color: "black" }} placeholder="Korisničko ime" placeholderTextColor="grey" value={email} onChangeText={(text) => setEmail(text)} />
            <Text style={{ paddingLeft: 10, color: "white" }}>Lozinka</Text>
            <TextInput autoCapitalize='none' secureTextEntry={true} style={{ paddingLeft: 10, fontSize: 18, borderWidth: 1, marginBottom: 10, borderRadius: 15, paddingHorizontal: 4, borderColor: "grey", backgroundColor: "white", paddingVertical: 4, color: "black" }} placeholder="Lozinka" placeholderTextColor="grey" value={password} onChangeText={(text) => setPassword(text)} />

            <TouchableOpacity onPress={login} style={{ borderRadius: 15, backgroundColor: "dodgerblue", paddingVertical: 10, paddingHorizontal: 12, elevation: 10 }}>
                <Text style={{ fontSize: 15, color: "white", alignSelf: "center" }}>PRIJAVI SE</Text>
            </TouchableOpacity>

        </View>
    )
}

export default LoginScreen;