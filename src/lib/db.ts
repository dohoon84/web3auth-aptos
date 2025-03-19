import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// SQLite 데이터베이스 연결 설정
export async function openDb() {
  return open({
    filename: './web3auth.db',
    driver: sqlite3.Database
  })
}

// 데이터베이스 초기화 함수
export async function initDb() {
  const db = await openDb()
  
  // 사용자 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      picture TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 지갑 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mnemonic TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)
  
  return db
}

// 사용자 생성 또는 업데이트
export async function createOrUpdateUser(userData: { email: string, name?: string, picture?: string }) {
  const db = await openDb()
  
  const { email, name, picture } = userData
  
  // 이미 존재하는 사용자인지 확인
  const existingUser = await db.get('SELECT * FROM users WHERE email = ?', email)
  
  if (existingUser) {
    // 기존 사용자 정보 업데이트
    await db.run(
      'UPDATE users SET name = ?, picture = ? WHERE email = ?',
      name || existingUser.name,
      picture || existingUser.picture,
      email
    )
    return existingUser.id
  } else {
    // 새 사용자 생성
    const result = await db.run(
      'INSERT INTO users (email, name, picture) VALUES (?, ?, ?)',
      email,
      name || '',
      picture || ''
    )
    return result.lastID
  }
}

// 사용자 조회
export async function getUserByEmail(email: string) {
  const db = await openDb()
  return db.get('SELECT * FROM users WHERE email = ?', email)
}

// 모든 사용자 조회
export async function getAllUsers() {
  const db = await openDb()
  return db.all('SELECT * FROM users')
}

// 지갑 생성
export async function createWallet(userId: number, mnemonic: string, address: string) {
  const db = await openDb()
  
  // 해당 사용자의 기존 지갑 확인
  const existingWallet = await db.get('SELECT * FROM wallets WHERE user_id = ?', userId)
  
  if (existingWallet) {
    return existingWallet
  }
  
  // 새 지갑 생성
  const result = await db.run(
    'INSERT INTO wallets (user_id, mnemonic, address) VALUES (?, ?, ?)',
    userId,
    mnemonic,
    address
  )
  
  return db.get('SELECT * FROM wallets WHERE id = ?', result.lastID)
}

// 사용자 ID로 지갑 조회
export async function getWalletByUserId(userId: number) {
  const db = await openDb()
  return db.get('SELECT * FROM wallets WHERE user_id = ?', userId)
}

// 사용자 이메일로 지갑 조회
export async function getWalletByEmail(email: string) {
  const db = await openDb()
  const user = await getUserByEmail(email)
  if (!user) return null
  
  return getWalletByUserId(user.id)
}

// 니모닉 업데이트 함수
export async function updateWalletMnemonic(walletId: number, newMnemonic: string) {
  const db = await openDb()
  
  const result = await db.run(
    'UPDATE wallets SET mnemonic = ? WHERE id = ?',
    newMnemonic,
    walletId
  )
  
  return result && result.changes ? result.changes > 0 : false
} 