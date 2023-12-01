import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveDataToStorage } from './utils/AsyncStorage'; 
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [toggle, setToggle] = useState(true);


  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const userLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      // Successfully logged in, you can access userCredential.user for user details
      console.log('User logged in:', userCredential.user);
      if(userCredential.user.email){
        saveDataToStorage("token", userCredential.user.uid)
        setTimeout(() => {
          navigation.navigate('StoreList', {token: userCredential.user.uid})
        }, 2000);
      } else {
        Alert.alert('Credential is incorrect');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Credential is incorrect');
    }
  };

  const isValidEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    // Basic validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
    } else if (!email.trim()) {
      setError('Please enter email.');
    } else if(!password.trim()){
      setError('Please enter password.');
    } else if (password.trim == 'retailpulse') {
      setError('Please enter correct password')
    }

    if (email.trim() && password.trim()) {
      userLogin()
    }
  };

  const onChangeEmail = (text) => {
    setError('')
    setEmail(text)
  }

  const onChangePassword = (text) => {
    setError('')
    setPassword(text)
  }

  const togglePassword = () => {
    setToggle(!toggle)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        placeholderTextColor={'#000'}
        onChangeText={(text) => onChangeEmail(text)}
      />
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={toggle}
          value={password}
          placeholderTextColor={'#000'}
          onChangeText={(text) => onChangePassword(text)}
        />
        <TouchableOpacity onPress={togglePassword} style={styles.iconAlign}>
          <Icon name={toggle ? "eye-off" : "eye"} size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.errorText}>{error}</Text>

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  input: {
    height: 45,
    width: '85%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#000',
    borderRadius: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  iconAlign: {
    position: 'absolute',
    right: 10,
    top: 5
  }
});

export default LoginScreen;
