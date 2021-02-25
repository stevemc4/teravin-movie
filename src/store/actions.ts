import { SetMoviesAction, SET_MOVIES, UpdateTimestampAction, UPDATE_TIMESTAMP, Movie, SetStateAction, MovieState, SET_STATE, SetConnectionAction, SET_CONNECTION } from './types'
import Storage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export const setMovies = (payload: Movie[]): SetMoviesAction => {
  return {
    type: SET_MOVIES,
    payload
  }
}

export const updateTimestamp = (): UpdateTimestampAction => {
  return {
    type: UPDATE_TIMESTAMP
  }
}

export const fetchMovies = async (): Promise<Movie[]> => {
  const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie?api_key=f7b67d9afdb3c971d4419fa4cb667fbf')
  const movies = data.results as Movie[]
  await Storage.setItem('moviesData', JSON.stringify({
    movieData: movies,
    lastUpdated: new Date().getTime()
  }))
  return movies
}

export const fetchMoviesInitial = async (): Promise<SetMoviesAction> => {
  const data = await fetchMovies()
  return setMovies(data as Movie[])
}

export const setState = (data: MovieState): SetStateAction => {
  return {
    type: SET_STATE,
    ...data
  }
}

export const restoreMoviesFromCache = async (): Promise<SetStateAction> => {
  try {
    const data = await Storage.getItem('moviesData')
    if (data) {
      return setState(JSON.parse(data) as MovieState)
    }
    return setState({
      lastUpdated: 0,
      movieData: []
    })
  } catch (e) {
    return setState({
      lastUpdated: 0,
      movieData: []
    })
  }
}

export const setConnectionState = (status: boolean): SetConnectionAction => {
  return {
    type: SET_CONNECTION,
    status
  }
}
