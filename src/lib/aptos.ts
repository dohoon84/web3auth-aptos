import { AptosClient, AptosAccount, TxnBuilderTypes, HexString } from 'aptos'
import * as bip39 from 'bip39'
import crypto from 'crypto'

// Aptos 클라이언트 설정 (이전 버전의 SDK 사용)
const aptosClient = new AptosClient('https://testnet.aptoslabs.com')

// 표준 BIP39 니모닉 생성 함수 (128비트 엔트로피, 12단어)
export function generateMnemonic(email: string): string {
  // 사용자 이메일과 솔트를 기반으로 엔트로피 생성
  const salt = 'web3auth-aptos-salt'
  // 이메일과 솔트를 결합하여 해시 생성 (128비트 = 16바이트)
  const fullHash = crypto.pbkdf2Sync(email, salt, 2048, 16, 'sha512')
  
  // 128비트(16바이트) 엔트로피를 사용하여 표준 BIP39 니모닉 생성
  // 이렇게 하면 12단어 니모닉이 생성됨 (Petra 지갑에서 지원)
  const entropyHex = fullHash.toString('hex')
  return bip39.entropyToMnemonic(entropyHex)
}

// 니모닉이 유효한지 검증하는 함수
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic)
}

// 니모닉으로부터 Aptos 계정 생성
export function createAptosAccount(mnemonic: string): AptosAccount {
  // 니모닉 유효성 검사
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic')
  }
  
  // 니모닉에서 시드 생성
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  
  // 시드의 첫 32바이트를 개인키로 사용
  const privateKeyBytes = seed.slice(0, 32)
  
  // Aptos 계정 생성
  return new AptosAccount(privateKeyBytes)
}

// 사용자 이메일로 Aptos 계정 생성
export function createAptosAccountFromEmail(email: string): { 
  account: AptosAccount, 
  mnemonic: string 
} {
  const mnemonic = generateMnemonic(email)
  const account = createAptosAccount(mnemonic)
  
  return { account, mnemonic }
}

// 현재 저장된 니모닉을 유효한 BIP39 니모닉으로 변환하는 함수
export function ensureValidMnemonic(oldMnemonic: string): string {
  // 이미 유효한 경우 그대로 반환
  if (validateMnemonic(oldMnemonic)) {
    return oldMnemonic
  }
  
  // 유효하지 않은 경우 해당 문자열을 시드로 사용하여 새 니모닉 생성 (12단어)
  const hash = crypto.createHash('sha256').update(oldMnemonic).digest().slice(0, 16)
  const entropyHex = hash.toString('hex')
  return bip39.entropyToMnemonic(entropyHex)
}

// 계정이 블록체인에 존재하는지 확인 (트랜잭션이 발생한 적이 있는지)
export async function accountExists(address: string): Promise<boolean> {
  try {
    // 계정 정보 조회 시도
    await aptosClient.getAccount(address)
    return true
  } catch (error: any) {
    // 계정이 존재하지 않거나 트랜잭션이 발생한 적이 없으면 404 오류 발생
    if (error.status === 404) {
      return false
    }
    
    // 다른 종류의 오류는 일단 존재하지 않는 것으로 처리
    console.error('Error checking if account exists:', error)
    return false
  }
}

// 계정 잔액 조회
export async function getAccountBalance(address: string): Promise<string> {
  try {
    // 계정이 블록체인에 존재하는지 먼저 확인
    const exists = await accountExists(address)
    
    // 계정이 존재하지 않으면 (트랜잭션이 발생한 적이 없으면) 잔액은 0
    if (!exists) {
      return '0'
    }
    
    // 계정이 존재하면 리소스 조회
    const resources = await aptosClient.getAccountResources(address)
    
    const aptosCoinResource = resources.find(
      (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    )
    
    // 코인 리소스가 없으면 잔액은 0
    if (!aptosCoinResource) {
      return '0'
    }
    
    // @ts-ignore: coin resource structure
    const balance = aptosCoinResource.data.coin.value
    return balance
  } catch (error) {
    // 어떤 오류가 발생하더라도 잔액은 0으로 안전하게 처리
    console.error('Failed to get account balance:', error)
    return '0'
  }
} 