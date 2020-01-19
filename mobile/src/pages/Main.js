import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'; 
import MapView, { Marker, Callout } from 'react-native-maps'; 
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'; 

import api from '../services/api';
import { connect, disconnect, subscribeTonewDevs } from '../services/socket';

function Main({ navigation }) {
  const [devs, setDevs] = useState([]); 
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    async function loadInitialPosition() {
      //get permission for get your location using gps
      const { granted } = await requestPermissionsAsync(); 

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;
        setCurrentRegion({
          latitude, 
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });
      }
    }

    loadInitialPosition();
  }, []); 
  
  useEffect(() => {
    subscribeTonewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setWebSocket(){
    disconnect(); 

    const { latitude, longitude } = currentRegion; 
    connect(
      latitude,
      longitude, 
      techs,
    );
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion; 

    const res = await api.get('/search', {
      params: {
        latitude, 
        longitude,
        techs
      }
    });        
    setDevs(res.data);
    setWebSocket();
  }

  function handleRegionChanged(region) {
    console.log(region);
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return null;
  }

  return(
    <>
      <MapView 
        onRegionChangeComplete={handleRegionChanged} 
        initialRegion={currentRegion} 
        style={styles.map}
      > 
      {devs.map(dev => (
        <Marker 
          key={dev._id}
          coordinate={{ 
          latitude: dev.location.coordinates[0], 
          longitude: dev.location.coordinates[1] 
        }}>        
        
        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

        <Callout onPress={() => {
          //navigation
          navigation.navigate('Profile', { github_username: dev.github_username});
        }}>
          <View style={styles.callout}>              
            <Text style={styles.devName}> { dev.name } </Text>
            <Text style={styles.devBio}> { dev.bio } </Text>
            <Text style={styles.devTechs}> { dev.techs.join(', ') } </Text>
          </View>
        </Callout>
        </Marker>
      ))}
      
      
    </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Devs by Techs..."
          placeholderTextColor= "#333"
          autoCapitalize="words"
          autoCorrect={false} 
          value={techs}
          onChangeText={ text => setTechs(text)}
        />

        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity> 
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }, 
  avatar: {
    width: 40, 
    height: 40,
     borderRadius: 20,
     borderWidth:2,
     borderColor: '#666',
  },

  callout: {
    width: 260, 
  }, 
  devName: {
    fontWeight: 'bold', 
    fontSize: 16,
  }, 

  devBio: {
    color: '#666', 
    marginTop: 5, 
  }, 

  devTechs: {
    marginTop: 5

  },

  searchForm: {
    position: 'absolute', 
    top: 20, 
    left: 20, 
    right: 20, 
    zIndex: 5, 
    flexDirection: 'row'
  }, 

  searchInput: {
    flex: 1, 
    height: 50, 
    backgroundColor: '#fff',
    color: '#333', 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    fontSize: 16, 
    shadowColor: '#000',
    shadowOpacity: 0.2, 
    shadowOffset: {
      width: 4, 
      height: 4,
    }, 
    elevation: 3,
  }, 

  loadButton: {
    width: 50, 
    height: 50, 
    backgroundColor: '#7159c1', 
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center', 
    marginLeft: 15
  }
})

export default Main;