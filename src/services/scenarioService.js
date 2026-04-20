import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const STORAGE_PREFIX = 'decisionlab-scenarios'

const getStorageKey = (uid) => `${STORAGE_PREFIX}:${uid}`

const readLocalScenarios = (uid) => {
  const raw = localStorage.getItem(getStorageKey(uid))
  return raw ? JSON.parse(raw) : []
}

const writeLocalScenarios = (uid, scenarios) => {
  localStorage.setItem(getStorageKey(uid), JSON.stringify(scenarios))
}

const normalizeTimestamp = (value) => {
  if (!value) {
    return { seconds: Math.floor(Date.now() / 1000), toDate: () => new Date() }
  }
  if (typeof value?.toDate === 'function') return value
  if (typeof value === 'string') {
    const date = new Date(value)
    return { seconds: Math.floor(date.getTime() / 1000), toDate: () => date }
  }
  return value
}

export async function createScenario(uid, data) {
  if (db) {
    const ref = await addDoc(collection(db, 'users', uid, 'scenarios'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  }

  const scenarios = readLocalScenarios(uid)
  const createdAt = new Date().toISOString()
  const next = {
    id: `local-scenario-${Date.now()}`,
    ...data,
    createdAt,
    updatedAt: createdAt,
  }
  writeLocalScenarios(uid, [next, ...scenarios])
  return next.id
}

export async function getScenarios(uid) {
  if (db) {
    const q = query(collection(db, 'users', uid, 'scenarios'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((item) => {
      const data = item.data()
      return {
        id: item.id,
        ...data,
        createdAt: normalizeTimestamp(data.createdAt),
        updatedAt: normalizeTimestamp(data.updatedAt),
      }
    })
  }

  return readLocalScenarios(uid)
    .map((item) => ({
      ...item,
      createdAt: normalizeTimestamp(item.createdAt),
      updatedAt: normalizeTimestamp(item.updatedAt),
    }))
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
}

export async function getScenario(uid, id) {
  if (db) {
    const snapshot = await getDoc(doc(db, 'users', uid, 'scenarios', id))
    if (!snapshot.exists()) return null
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...data,
      createdAt: normalizeTimestamp(data.createdAt),
      updatedAt: normalizeTimestamp(data.updatedAt),
    }
  }

  const scenario = readLocalScenarios(uid).find((item) => item.id === id)
  if (!scenario) return null
  return {
    ...scenario,
    createdAt: normalizeTimestamp(scenario.createdAt),
    updatedAt: normalizeTimestamp(scenario.updatedAt),
  }
}

export async function updateScenario(uid, id, updates) {
  if (db) {
    await updateDoc(doc(db, 'users', uid, 'scenarios', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    return
  }

  const scenarios = readLocalScenarios(uid)
  writeLocalScenarios(
    uid,
    scenarios.map((item) => (
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    )),
  )
}

export async function deleteScenario(uid, id) {
  if (db) {
    await deleteDoc(doc(db, 'users', uid, 'scenarios', id))
    return
  }

  const scenarios = readLocalScenarios(uid)
  writeLocalScenarios(uid, scenarios.filter((item) => item.id !== id))
}
