import React, { useEffect } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { StackNavigationProp } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'

import Icon from '../../assets/icon.png'

import { restoreMoviesFromCache, setConnectionState } from '../store/actions'

interface SplashNavProp {
  navigation: StackNavigationProp<any, 'Splash'>
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashText: {
    fontSize: 32
  },
  image: {
    width: 400,
    height: 400
  }
})

const Splash = ({ navigation }: SplashNavProp): React.ReactElement => {
  const dispatch = useDispatch()

  const bootstrap = async (): Promise<void> => {
    const netInfo = await NetInfo.fetch()
    const moviesCache = await restoreMoviesFromCache()
    dispatch(moviesCache)
    dispatch(setConnectionState(netInfo.isInternetReachable ?? false))
    setTimeout(() => {
      navigation.replace('Home')
    }, 500)
  }

  useEffect(() => {
    bootstrap()
  }, [])
  return (
    <View style={style.container}>
      <Image style={style.image} source={Icon} />
      <StatusBar style="auto" />
    </View>
  )
}

export default Splash
