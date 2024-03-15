import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Image, Animated, Easing } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios"; 
import { useRouter } from "expo-router";
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';

const MAX_LINES = 3;
 
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedImage = Animated.createAnimatedComponent(Image);

const Post = ({ item }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeScale] = useState(new Animated.Value(1)); 

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const handleLikePost = () => {
    setIsLiked(!isLiked);
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.5,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
    // Adicione lógica para curtir o post
  };
const option = {
  year : 'numeric',
  month : 'long',
  day : 'numeric'
}
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop:15 }}>
          <Text 
            style={{
                backgroundColor:'#E0A0E0',
                padding:5,
                borderRadius:50,
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
            }}
          >{item?.nome[0]} {item?.nome[item?.nome.length - 1]}</Text>
          <View style={{ flexDirection: "column", gap: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>{item?.nome}</Text>
            <Text style={{ color: "gray" }}>{new Date(item?.createAt).toLocaleString('pt',option)}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Entypo name="dots-three-vertical" size={20} color="black" />
          <Feather name="x" size={20} color="black" />
        </View>
      </View>
      <View style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
        <Text style={{ fontSize: 15 }} numberOfLines={showFullText ? undefined : MAX_LINES}>{item?.aboutUs}</Text>
        {!showFullText && (
          <Pressable onPress={toggleShowFullText}>
            <Text>See more</Text>
          </Pressable>
        )}
      <AnimatedImage
        style={{ width: "100%", height: 240, transform: [{ scale: likeScale }] }}
        source={{ uri: `http://localhost:3333/agencia/get-img/${item.id}` }}
      />  
      </View>
    </View>
  );
};

const Index = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [imgURL, setImgURL] = useState("");
  const [token, setToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("Token not found");
          return;
        }
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/usuario/get/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    };
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setToken(token)
        if (!token) {
          console.log("Token not found");
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get("http://localhost:3333/agencia/get/null", config);
        setPosts(response.data);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };
    fetchAllPosts();
  }, []);

  return (
    <AnimatedScrollView>
      <View style={{ padding: 10 }}>
        {
           posts.map( (item,index)=>{ 
            return (
              <View key={index}>
                { <Post key={index} item={item}  />}
              </View>
            );
            
        })
          }
      </View>
    </AnimatedScrollView>
  );
};

export default Index;
