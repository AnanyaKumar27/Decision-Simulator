import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from './firebase'

const AUTH_STORAGE_KEY = 'decisionlab-auth-user'
const AUTH_EVENT = 'decisionlab-auth-change'

const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_EVENT))
  }
}

const persistLocalUser = (user) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  emitAuthChange()
}

export const getLocalUser = () => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export const subscribeToLocalAuth = (callback) => {
  if (typeof window === 'undefined') return () => {}

  const notify = () => callback(getLocalUser())
  window.addEventListener('storage', notify)
  window.addEventListener(AUTH_EVENT, notify)

  return () => {
    window.removeEventListener('storage', notify)
    window.removeEventListener(AUTH_EVENT, notify)
  }
}

export async function signup(email, password, name) {
  if (auth) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (name?.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() })
    }
    return credential.user
  }

  const user = {
    uid: `local-${Date.now()}`,
    email,
    displayName: name?.trim() || email.split('@')[0],
  }
  persistLocalUser(user)
  return user
}

export async function login(email, password) {
  if (auth) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  }

  if (!password) {
    const error = new Error('Password is required.')
    error.code = 'auth/invalid-credential'
    throw error
  }

  const current = getLocalUser()
  const user = current?.email === email
    ? current
    : {
        uid: `local-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
      }

  persistLocalUser(user)
  return user
}

export async function logout() {
  if (auth) {
    await signOut(auth)
    return
  }

  localStorage.removeItem(AUTH_STORAGE_KEY)
  emitAuthChange()
}
