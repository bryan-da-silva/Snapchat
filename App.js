import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import * as MediaLibrary from 'expo-media-library';
import * as SecureStore from 'expo-secure-store';
const Stack = createStackNavigator();

function App() {
    const [isLog, setIsLog] = useState('');
    getValueFor("token").then((value) => setIsLog(value));
    if (isLog == false){
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Connexion" component={ConnexionScreen} />
                    <Stack.Screen name="Inscription" component={InscriptionScreen} />
                    <Stack.Screen name="Cameraapp" component={CameraScreen} />
                    <Stack.Screen name="Profil" component={ProfilScreen} />
                    <Stack.Screen name="Messagerie" component={getAll} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
    else if (isLog == true){
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Cameraapp" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Cameraapp" component={CameraScreen} />
                    <Stack.Screen name="Profil" component={ProfilScreen} />
                    <Stack.Screen name="Messagerie" component={getAll} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

function HomeScreen({ navigation }) {
    let Image_Http_URL ={ uri: 'https://www.freepnglogos.com/uploads/snapchat-logo-outline-png-18.png'};
    return (
        <View style={{flex: 1,backgroundColor: '#FFEB3B'}}>
            <View style={{flex: 1,backgroundColor: '#FFEB3B'}}/>
            <Image source={Image_Http_URL} style={styles.backgroundImage}/>
            <Text style={styles.textCopyright}>© Snapchat 2011-2021</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
            <View style={{height: 100,backgroundColor: '#E91E63',}}>
                <Text style={{color:"white",fontSize:25,textAlign:"center",textTransform:"uppercase",lineHeight: 100,fontWeight:'600',}}>connexion</Text>  
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
            <View style={{height: 100,backgroundColor: '#03A9F4',}}>
                <Text style={{color:"white",fontSize:25,textAlign:"center",textTransform:"uppercase",lineHeight: 100,fontWeight:'600',}}>inscription</Text>  
            </View>
            </TouchableOpacity>
        </View>
  );
}

function ConnexionScreen({ navigation }){
    let Image_Http_URL ={ uri: 'https://www.freepnglogos.com/uploads/snapchat-logo-outline-png-18.png'};
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    onsubmit = () => {
        let regMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!email) return setMsg("Veuillez renseignez un email valide");
        else if (!regMail.test(String(email))) return setMsg("Le format du mail saisie n'est pas valide");

        if (password.trim().length < 6) return setMsg("Le password doit contenir 6 caractères minimum");
        else {
        return fetch("http://149.91.89.133:6088/connection", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then((data) =>{ 
            if (data.status == 400) setMsg(data.message);
            else if (data.status == 200){
                let valueToken = data.data.token;
                save("token", valueToken);
                navigation.navigate('Cameraapp');
            }
            else setMsg('Erreur lors de la connexion veuillez réessayer');
        })
        .catch((error) => { setMsg(error) })
        }
    }
    return(
        <View style={{flex: 1,backgroundColor: '#F5F5F5',justifyContent: 'center',alignItems: 'center',width:'100%',}}>
            <Image source={Image_Http_URL} style={styles.backgroundImage2}/>
            <SafeAreaView style={{marginTop:-200,}}>
                <TextInput
                    style={styles.input}
                    placeholder="Adresse mail"
                    onChangeText = {email => setEmail(email)}
                    defaultValue = {email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry = {true}  
                    onChangeText = {password => setPassword(password)}
                    defaultValue = {password}                  
                />
                <Text style={styles.errormsg}>{msg}</Text>
            </SafeAreaView>
            <TouchableOpacity onPress = {onsubmit}>
                <View style={{height: 40,width: 275,backgroundColor: '#4CAF50',borderRadius: 10,marginTop: 10,marginBottom: 15,}}>
                    <Text style={{color:"white",fontSize:15,textAlign:"center",textTransform:"uppercase",padding:20,lineHeight: 9.5,fontWeight:'600'}}>se connecter</Text>  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{height: 40,width:'50%',backgroundColor: '#FFEB3B',borderRadius: 10,}}>
                    <Text style={{color:"white",fontSize:15,textAlign:"center",textTransform:"uppercase",padding:20,lineHeight: 9.5,fontWeight:'600',}}>revenir en arrière</Text>  
                </View>
            </TouchableOpacity>
            <Text style={styles.textCopyright2}>© Snapchat 2011-2021</Text>
         </View>
    );
}

function InscriptionScreen({ navigation }){
    let Image_Http_URL ={ uri: 'https://www.freepnglogos.com/uploads/snapchat-logo-outline-png-18.png'};
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [msg, setMsg] = useState('');
    onsubmit = () => {
        let regMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!email) return setMsg("Veuillez renseignez un email valide");
        else if (!regMail.test(String(email))) return setMsg("REGEX NON RESPECTÉ");
        if (password.trim().length < 6) return setMsg("Le password doit contenir 6 caractères minimum");
        else if (passwordConfirm.trim().length < 6) return setMsg('Le password confirm doit contenir 6 caractères minimum');
        else if (password != passwordConfirm) return setMsg('Les passwords ne correspondent pas');
        else {
            return fetch("http://149.91.89.133:6088/inscription", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }).then(res => res.json()).then((data) => { data.status == 400 ? setMsg(data.message) : (data.status === 200 ? navigation.navigate('Connexion') : setMsg(" Erreur lors de la creation du compte")) })
            .catch((error) => { setMsg(error) })
        }
    }
    return (
        <View style={{flex: 1,backgroundColor: '#F5F5F5',justifyContent: 'center',alignItems: 'center',width:'100%',}}>
            <Image source={Image_Http_URL} style={styles.backgroundImage2}/>
            <SafeAreaView style={{marginTop:-200,}}>
                <TextInput
                    style={styles.input}
                    type="email"
                    placeholder="Adresse mail"
                    onChangeText={email => setEmail(email)}
                    defaultValue={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                    defaultValue={password}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Répéter mot de passe"
                    secureTextEntry={true}
                    onChangeText={passwordConfirm => setPasswordConfirm(passwordConfirm)}
                    defaultValue={passwordConfirm}
                />
                <Text style={styles.errormsg}>{msg}</Text>
            </SafeAreaView>
            <TouchableOpacity onPress = {onsubmit}>
                <View style={{height: 40,width: 275,backgroundColor: '#4CAF50',borderRadius: 10,marginTop: 10,marginBottom: 15,}}>
                    <Text style={{color:"white",fontSize:15,textAlign:"center",textTransform:"uppercase",padding:20,lineHeight: 9.5,fontWeight:'600'}}>s'inscrire</Text>  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{height: 40,width:'50%',backgroundColor: '#FFEB3B',borderRadius: 10,}}>
                    <Text style={{color:"white",fontSize:15,textAlign:"center",textTransform:"uppercase",padding:20,lineHeight: 9.5,fontWeight:'600',}}>revenir en arrière</Text>  
                </View>
            </TouchableOpacity>
            <Text style={styles.textCopyright2}>© Snapchat 2011-2021</Text>
         </View>
    );
}

function CameraScreen({ navigation }){
    const [hasPermission, setHasPermission] = useState(null);
    const [RollPermission, setRollPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraRef, setCameraRef] = useState(null);
    useEffect(() =>{
        (async () =>{
        const {status} = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        const {statu} = await MediaLibrary.requestPermissionsAsync();
        setRollPermission(statu === "granted");
        setRollPermission(true);
        })();
    },[]);    
    if (hasPermission === null){
        return <View />;
    }
    if (hasPermission === false){
        return <Text style={styles.text}>No access to camera</Text>;
    }
    if (RollPermission === null){
        return <View />;
    }
    else if (RollPermission === false){
        return <Text style={styles.text}>No access to stockage</Text>;
    }

    const chosePicture = async () => {
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [9, 3],
            quality: 1,
        });
    };

    return(
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={(ref) => {setCameraRef(ref);}}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('Profil')
                        }}>
                        <Text style={styles.cameratext}><AntDesign name="user" size={30} color="white" /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                    }}>
                        <Text style={styles.cameratext}><AntDesign name="retweet" size={30} color="white" /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => chosePicture()}>
                        <Text style={styles.cameratext}><FontAwesome5 name="images" size={30} color="white" /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={async () => {
                        if (cameraRef) {
                            let photo = await cameraRef.takePictureAsync();
                            await MediaLibrary.createAssetAsync(photo.uri);
                            navigation.navigate('Messagerie');
                        }
                    }}>
                        <Text style={styles.cameratext}><AntDesign name="camera" size={30} color="white" /></Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

function ProfilScreen({ navigation }){
    let Image_URL ={ uri: 'http://www.e-former.net/wp-content/uploads/2021/03/photo-avatar-profil.png'};
    return (
        <View style={{flex: 1,backgroundColor: '#F5F5F5',justifyContent: 'center',alignItems: 'center',width:'100%',}}>
            <Image source={Image_URL} style={styles.avatar}/>
            <Text>adressemail@mail.com</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Messagerie')}>
                <View style={{height: 40,width: 275,backgroundColor: '#2196F3',borderRadius: 10,marginTop: 10,marginBottom: 5,}}>
                    <Text style={{color:"white",fontSize:15,textAlign:"center",textTransform:"uppercase",padding:20,lineHeight: 9.5,fontWeight:'600',}}>messagerie</Text>  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
                logout();
                navigation.navigate("Home");
            }}>
                <View style={{height: 40,width: 275,backgroundColor: '#f44336',borderRadius: 10,marginTop: 10,marginBottom: 15,}}>
                    <Text style={{color:"white",fontSize:15,textAlign:"center",textTransform:"uppercase",padding:20,lineHeight: 9.5,fontWeight:'600'}}>se déconnecter</Text>  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{height: 40,width: 275,backgroundColor: '#FFEB3B',borderRadius: 10,}}>
                    <Text style={{color:"white",fontSize:15,textAlign:"center",textTransform:"uppercase",padding:20,lineHeight: 9.5,fontWeight:'600',}}>revenir en arrière</Text>  
                </View>
            </TouchableOpacity>
            <Text style={styles.textCopyright2}>© Snapchat 2011-2021</Text>
         </View>
    );
}

async function MessagerieReq(){
    let result = await SecureStore.getItemAsync("token");
    return await fetch("http://149.91.89.133:6088/all", {
        method: "GET",
        headers: {
            Accept: 'application/json',
            "token": result,
        },
    }).then(res => res.json()).then((data) =>{ 
        if (data.status == 400) return ( alert(data.message) );
        else if (data.status == 200){
            let result = data.data.map(e => e.email);
            return result;
        }
        else alert('Erreur lors de la récupération des utilisateurs veuillez réessayer');
    })
    .catch((error) => { alert(error) });
}

function GetAllAff(props) {
    return (
        <TouchableOpacity style={{backgroundColor: '#F5F5F5',borderBottomColor: '#BDBDBD',borderBottomWidth: 1}} /*onPress={() => navigation.goBack()}*/>
            <View style={{height: 75,width: '100%',}}>
                <Text style={{}}>{props.name}</Text>  
            </View>
        </TouchableOpacity>
    )
}

function getAll() {
    const [UserAll, setUserAll] = useState('');
    useEffect(() => {
        MessagerieReq().then(e => setUserAll(e));
    }, [])
    //console.log(UserAll);
    let gets = [];
    for (let index = 0; index < UserAll.length; index++) {
        gets.push(<GetAllAff key={index} name={UserAll[index]}/>); 
    }
    return (
        <ScrollView>{gets}</ScrollView>
    )
}

async function save(key, value){
    await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key){
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return true;
    }
    else {
      return false;
    }
}

async function logout(){
    let result = await SecureStore.getItemAsync("token");
    if (result) {
        await SecureStore.deleteItemAsync("token");
    }
    else {
      return false;
    }
}

var styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage:{
        flex: 1,
        resizeMode: 'contain',
        width: '50%',
        marginTop: -470,
        marginLeft: 105,
    },
    backgroundImage2:{
        resizeMode: 'contain',
        width: '70%',
        height: '70%',
        marginTop: -250,
    },
    textCopyright:{
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#4DD0E1',
        top: 0,
        marginTop: 565,
        position:'absolute',
    },
    textCopyright2:{
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#4DD0E1',
        bottom: 0,
        marginBottom: 100,
        position:'absolute',
    },
    input:{
        height: 49,
        margin: 12,
        width: 350,
        borderWidth: 1,
        padding: 15,
        borderColor: '#BDBDBD',
        borderRadius: 10,
    },
    camera:{
        width: '100%',
        height: '100%',
    },
    buttonContainer:{
        width: 10,
        height: 10,
        top: 47,
        left: 27,
    },
    button:{
        width: 45,
        height: 70,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginBottom: 10,
    },
    cameratext:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    capture:{
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    avatar:{
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 50,
        marginBottom: 10,
    },
});

export default App;