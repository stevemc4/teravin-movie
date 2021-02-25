import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { CombinedState } from 'redux'
import format from 'date-fns/format'
import { id } from 'date-fns/locale'
import { Snackbar } from 'react-native-paper'

import { MovieState, Movie, ConnectionState } from '../store/types'
import { fetchMovies, fetchMoviesInitial, restoreMoviesFromCache } from '../store/actions'

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  movieList: {
    flexGrow: 1,
    paddingBottom: 16
  },
  popularMoviesText: {
    fontSize: 48,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontWeight: '700',
    color: '#FF467E'
  },
  lastUpdatedText: {
    fontSize: 16,
    color: '#6d6d6d',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12
  },
  movieListItem: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  movieListItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2d2d'
  },
  movieListItemDate: {
    fontSize: 16,
    color: '#6d6d6d'
  }
})

// eslint-disable-next-line camelcase
const ListItem = ({ item }: {item: Movie }): React.ReactElement => (
    <View style={styles.movieListItem}>
      {/* eslint-disable-next-line camelcase */}
      <Text style={styles.movieListItemTitle}>
        {`${item.title}${item.title !== item.original_title ? ` (${item.original_title})` : ''}`}
      </Text>
      <Text style={styles.movieListItemDate}>{item.release_date}</Text>
    </View>
)

const getDateString = (timestamp: number): string => {
  return format(new Date(timestamp), 'dd MMMM HH:mm', { locale: id })
}

const Index = () => {
  const [showUpdatedNotification, setShowUpdatedNotification] = useState(false)
  const dispatch = useDispatch()
  const date = useSelector((state: CombinedState<{movie: MovieState}>) => state.movie.lastUpdated)
  const movies = useSelector((state: CombinedState<{movie: MovieState}>) => state.movie.movieData)
  const isConnected = useSelector((state: CombinedState<{connection: ConnectionState}>) => state.connection.status)
  const [showNoConnectionNotification, setShowNoConnectionNotification] = useState(!isConnected)

  const fetchDataInitial = async (): Promise<void> => {
    const action = await fetchMoviesInitial()
    dispatch(action)
  }

  const fetchData = async (): Promise<void> => {
    if (isConnected) {
      await fetchMovies()
      setShowUpdatedNotification(true)
    }
  }

  const restoreFromCache = async (): Promise<void> => {
    const action = await restoreMoviesFromCache()
    dispatch(action)
  }

  useEffect(() => {
    if (isConnected) {
      fetchDataInitial()
    }
    const interval = setInterval(fetchData, 1000 * 60)
    return (): void => {
      clearInterval(interval)
    }
  }, [])

  const handleSnackbarDismiss = (): void => {
    setShowUpdatedNotification(false)
    setShowNoConnectionNotification(false)
  }

  const handleUpdatedSnackbarAction = (): void => {
    restoreFromCache()
  }

  return (
    <View style={styles.base}>
      <ScrollView style={styles.container}>
        <Text style={styles.popularMoviesText}>
          Daftar Film
          {'\n'}
          Populer
        </Text>
        <Text style={styles.lastUpdatedText}>
          {`Terakhir Diperbarui: ${getDateString(date)}`}
        </Text>
        {movies.map(movie => (
          <ListItem
            key={movie.id.toString()}
            item={movie}
          />
        ))}
      </ScrollView>
      <StatusBar style="auto" />
      <Snackbar
        visible={showUpdatedNotification}
        onDismiss={handleSnackbarDismiss}
        action={{
          label: 'Tampilkan',
          onPress: handleUpdatedSnackbarAction
        }}
      >
        Daftar film sudah diperbarui
      </Snackbar>
      <Snackbar
        visible={showNoConnectionNotification}
        onDismiss={handleSnackbarDismiss}
      >
        Tidak ada koneksi
      </Snackbar>
    </View>
  )
}

export default Index
