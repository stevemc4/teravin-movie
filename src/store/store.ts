import { combineReducers, createStore, applyMiddleware } from 'redux'
import thonk from 'redux-thunk'
import { ConnectionActionTypes, ConnectionState, MoviesActionTypes, MovieState, SET_CONNECTION, SET_MOVIES, SET_STATE, UPDATE_TIMESTAMP } from './types'

const movieReducer = (state: MovieState = { movieData: [], lastUpdated: 0 }, action: MoviesActionTypes): MovieState => {
  switch (action.type) {
    case SET_MOVIES:
      return {
        movieData: action.payload,
        lastUpdated: new Date().getTime()
      }
    case UPDATE_TIMESTAMP:
      return {
        movieData: state.movieData,
        lastUpdated: new Date().getTime()
      }
    case SET_STATE:
      return action
    default:
      return state
  }
}

const connectionReducer = (state: ConnectionState = { status: true }, action: ConnectionActionTypes): ConnectionState => {
  if (action.type === SET_CONNECTION) {
    return {
      status: action.status
    }
  }

  return state
}

const reducer = {
  movie: movieReducer,
  connection: connectionReducer
}

const reducers = combineReducers(reducer)

const store = createStore(reducers, applyMiddleware(thonk))

export default store
