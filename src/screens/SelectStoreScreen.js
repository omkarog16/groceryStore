import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, Alert, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Back from 'react-native-vector-icons/Ionicons';
import { getDataFromStorage, deleteItem } from './utils/AsyncStorage';
const Height = Dimensions.get('screen').height
const SelectStoreScreen = ({route, navigation}) => {
  const [imageUris, setImageUris] = useState([]);
  const [storeName, setStoreName] = useState('')
  const [index, setIndex] = useState('')
  useEffect(()=>{
    // const { storeName, index } = route.params;
    // setIndex(index)
    // setStoreName(storeName)
  },[])

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          launchCamera(options, handleImagePickerResponse);
        } else {
          Alert.alert("Please give camera permission")
          console.log('Camera permission denied');
        }
      } 
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };
  

  const options = {
    mediaType: 'photo',
    quality: 0.5,
    selectionLimit: 10
  };

  const handleLaunchCamera = () => {
    requestCameraPermission()
  };

  const handleLaunchImageLibrary = () => {
    launchImageLibrary(options, handleImagePickerResponse);
  };

  const handleImagePickerResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const newImageUris = response.assets.map((asset) => asset.uri);
      setImageUris((prevImageUris) => [...prevImageUris, ...newImageUris]);
    }
  };
  

  const uploadImagesToStorage = async () => {
    try {
      const uploadPromises = imageUris.map(async (imageUri) => {
        const imageName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const storageRef = storage().ref(`images/${imageName}`);
        await storageRef.putFile(imageUri);
        return storageRef.getDownloadURL();
      });

      const downloadURLs = await Promise.all(uploadPromises);
      const visitTime = new Date().toISOString(); // Get the current date and time
       if(imageUris.length !== 0){
          updateDatabase(downloadURLs, visitTime);
       }
    } catch (error) {
      console.error('Error uploading images to storage:', error);
    }
  };

  const updateDatabase = async (downloadURLs, visitTime) => {
    try {
      const uid = await getDataFromStorage('token');
      const userId = uid;

      const databaseRef = database().ref(`/storeList/${userId}/${index}/store_visits`);
      const visitData = {
        visitTime,
        images: downloadURLs.reduce((acc, url, idx) => {
          acc[`image${idx + 1}`] = url;
          return acc;
        }, {}),
      };

      await databaseRef.push(visitData);
      if(databaseRef){
         Alert.alert('Images uploaded successfully');
      }
      setImageUris([])
    } catch (error) {
      console.error('Error updating database:', error);
    }
  };

  const handleSignOut = async () => {
    deleteItem('token')
    navigation.replace("Login")
  };
  

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  noImageUpload = () => (
    <View style={{ flex: 1, marginTop: Height / 2.1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>No image found</Text>
    </View>
  )

  const goBack = () => {
    navigation.goBack()
  }

  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButon} onPress={() => goBack()}>
        <Back name="arrow-back-outline" size={30} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={() => handleSignOut()} >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <Text style={{fontSize: 34, color: '#000', top: 10}}>{storeName}</Text>
      <FlatList
        data={imageUris}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImageItem}
        numColumns={2}
        style={styles.flatList}
        ListEmptyComponent={noImageUpload}
      />
      <View style={{ flexDirection: 'row', position: 'absolute', bottom: 20 }}>
        <TouchableOpacity style={styles.button} onPress={handleLaunchCamera}>
          <Text style={styles.buttonText}>Launch Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLaunchImageLibrary}>
          <Text style={styles.buttonText}>Open Image Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={uploadImagesToStorage}>
          <Text style={styles.buttonText}>Upload Images</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'grey',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  flatList: {
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  backButon: {
    position: 'absolute',
    top: 10,
    left: 10
  }
});

export default SelectStoreScreen;
