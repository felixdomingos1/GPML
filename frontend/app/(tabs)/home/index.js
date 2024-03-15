import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Image, Animated, Easing } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import moment from "moment";
import { useRouter } from "expo-router";
import { AntDesign, Entypo, Feather, SimpleLineIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const MAX_LINES = 3;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
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
          {/* <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={{ uri: item?.user?.profileImage }} /> */}
          <Text 
            style={{
                backgroundColor:'#E0A0E0',
                padding:5,
                borderRadius:50,
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
            }}
          >{item?.usuario?.firstName[0]}{item?.usuario?.surname[0]}</Text>
          <View style={{ flexDirection: "column", gap: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: "600" }}>{item?.usuario?.firstName} {item?.usuario?.surname}</Text>
            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 230, color: "gray", fontSize: 15, fontWeight: "400" }}>{item?.user?.status} | {item?.user?.genero}</Text> */}
            <Text style={{ color: "gray" }}>{new Date(item?.createAt).toLocaleString('pt',option)}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Entypo name="dots-three-vertical" size={20} color="black" />
          <Feather name="x" size={20} color="black" />
        </View>
      </View>
      <View style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
        <Text style={{ fontSize: 15 }} numberOfLines={showFullText ? undefined : MAX_LINES}>{item?.content}</Text>
        {!showFullText && (
          <Pressable onPress={toggleShowFullText}>
            <Text>See more</Text>
          </Pressable>
        )}
      </View>
      {console.log(item.img)}
      {item.img !== 'string' && (
        <AnimatedImage
        style={{ width: "100%", height: 240, transform: [{ scale: likeScale }] }}
        source={{ uri: `http://localhost:3333/post/get-img/${item.id}` }}
        />
      )}
      {item?.likes?.length > 0 && (
        <View style={{ padding: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
          <SimpleLineIcons name="like" size={16} color="#0072b1" />
          <Text style={{ color: "gray" }}>{item?.likes?.length}</Text>
        </View>
      )}
      <View style={{ height: 2, borderColor: "#E0E0E0", borderWidth: 2 }} />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginVertical: 10 }}>
        <AnimatedPressable onPress={handleLikePost}>
          <AntDesign name="like2" size={24} color={isLiked ? "#0072b1" : "gray"} />
          <Text style={{ fontSize: 12, color: isLiked ? "#0072b1" : "gray", marginTop: 2 }}>Like</Text>
        </AnimatedPressable>
        <Pressable>
          <FontAwesome name="comment-o" size={20} color="gray" />
          <Text style={{ fontSize: 12, color: "gray", marginTop: 2 }}>Comment</Text>
        </Pressable>
        <Pressable>
          <Ionicons name="md-share-outline" size={20} color="gray" />
          <Text style={{ fontSize: 12, color: "gray", marginTop: 2 }}>Repost</Text>
        </Pressable>
        <Pressable>
          <Feather name="send" size={20} color="gray" />
          <Text style={{ fontSize: 12, color: "gray", marginTop: 2 }}>Send</Text>
        </Pressable>
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
        const response = await axios.get("http://localhost:3333/post/get/null", config);
        setPosts(response.data);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };
    fetchAllPosts();
  }, []);

  return (
    <AnimatedScrollView>
      <View style={{ padding: 10 ,}}>
        <View style={{ backgroundColor:'#fff',flexDirection: "row", alignItems: "center", gap: 4, marginTop:10, padding:10, borderRadius:10 }}>
          <Pressable onPress={() => router.push("/home/profile")}>
            <Text>Ver Perfil</Text>
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 7, gap: 10, backgroundColor: "white", borderRadius: 3, height: 30, flex: 1 }}>
            <AntDesign style={{ marginLeft: 10 }} name="search1" size={20} color="black" />
            <TextInput placeholder="Search" />
          </View>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
        </View>
        {
           posts.map( (item,index)=>{ 
          return (
            <View key={index} style={{
              backgroundColor:'#fff',
              borderRadius:10,
              marginTop:10,
              elevation:20
            }}>
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
