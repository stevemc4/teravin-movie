export const SET_MOVIES = 'SET_MOVIES'
export const UPDATE_TIMESTAMP = 'UPDATE_TIMESTAMP'
export const SET_STATE = 'SET_STATE'

export const SET_CONNECTION = 'SET_CONNECTION'

export interface Movie {
  id: number,
  // eslint-disable-next-line camelcase
  original_title: string,
  // eslint-disable-next-line camelcase
  release_date: string,
  title: string
}

export interface MovieState {
  movieData: Movie[]
  lastUpdated: number
}

export interface SetMoviesAction {
  type: typeof SET_MOVIES
  payload: Movie[]
}

export interface UpdateTimestampAction {
  type: typeof UPDATE_TIMESTAMP
}

export interface SetStateAction extends MovieState {
  type: typeof SET_STATE
}

export type MoviesActionTypes = SetMoviesAction | UpdateTimestampAction | SetStateAction

export interface ConnectionState {
  status: boolean
}

export interface SetConnectionAction {
  type: typeof SET_CONNECTION
  status: boolean
}

export type ConnectionActionTypes = SetConnectionAction
