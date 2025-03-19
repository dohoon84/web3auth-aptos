'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface WalletData {
  address: string
  balance: string
}

export default function WalletInfo() {
  const { data: session } = useSession()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!session) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/wallet')
        if (!response.ok) {
          throw new Error('지갑 정보를 가져오는데 실패했습니다.')
        }
        
        const data = await response.json()
        setWallet(data.wallet)
      } catch (err) {
        setError((err as Error).message || '지갑 정보를 가져오는데 실패했습니다.')
        console.error('Error fetching wallet data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchWalletData()
  }, [session])

  // 니모닉 이메일 전송 함수
  const sendMnemonicEmail = async () => {
    if (!session || !wallet) return
    
    setSendingEmail(true)
    setEmailSent(false)
    setError(null)
    
    try {
      const response = await fetch('/api/wallet/send-mnemonic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '니모닉 이메일 전송에 실패했습니다.')
      }
      
      setEmailSent(true)
    } catch (err) {
      setError((err as Error).message || '니모닉 이메일 전송에 실패했습니다.')
      console.error('Error sending mnemonic email:', err)
    } finally {
      setSendingEmail(false)
    }
  }
  
  if (!session) {
    return null
  }
  
  if (loading) {
    return (
      <div className="glass-card p-8 w-full animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-5"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-5"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="glass-card p-8 w-full border-red-200 dark:border-red-800">
        <div className="flex items-center mb-4 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">오류 발생</h3>
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }
  
  if (!wallet) {
    return (
      <div className="glass-card p-8 w-full border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center mb-4 text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">지갑 정보 없음</h3>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300">지갑이 아직 생성되지 않았습니다.</p>
      </div>
    )
  }
  
  return (
    <div className="glass-card p-8 w-full relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary-500/5 rounded-full blur-xl"></div>
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-secondary-500/5 rounded-full blur-xl"></div>
      
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">내 블록체인 지갑</h3>
        <span className="tag">
          Testnet
        </span>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">지갑 주소</p>
        <div className="flex items-center">
          <div className="font-mono bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-gray-700 break-all text-sm w-full">
            {wallet.address}
          </div>
          <button 
            className="ml-2 p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(wallet.address);
              alert('지갑 주소가 클립보드에 복사되었습니다.');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">잔액</p>
        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="mr-3 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-400">
              <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
              <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
              <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
              <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold">{wallet.balance}</span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">Token</span>
          </div>
        </div>
      </div>

      {/* 니모닉 이메일 전송 버튼 */}
      <div className="mb-6">
        <button 
          className={`w-full btn btn-primary flex items-center justify-center group ${sendingEmail ? 'opacity-75 cursor-not-allowed' : ''}`}
          onClick={sendMnemonicEmail}
          disabled={sendingEmail}
        >
          {sendingEmail ? (
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>이메일 전송 중...</span>
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              <span>지갑 복구 키 이메일로 받기</span>
            </>
          )}
        </button>
        
        {emailSent && (
          <div className="mt-3 flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">복구 키가 이메일로 전송되었습니다. 안전하게 보관하세요.</span>
          </div>
        )}

        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-500">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            <span>
              복구 키는 지갑을 복구하는 중요한 보안 정보입니다. 이메일로 전송된 키를 안전하게 보관하세요. 추후 지갑 복구나 다른 지갑 앱에서 임포트하여 토큰을 확인할 수 있습니다.
            </span>
          </p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <a
          href={`https://explorer.aptoslabs.com/account/${wallet.address}?network=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
        >
          <span>블록체인 익스플로러에서 확인</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="w-5 h-5 ml-1"
          >
            <path 
              fillRule="evenodd" 
              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" 
              clipRule="evenodd" 
            />
            <path 
              fillRule="evenodd" 
              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" 
              clipRule="evenodd" 
            />
          </svg>
        </a>
        
        <a
          href="https://aptoslabs.com/testnet-faucet"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline py-2 px-4 text-sm"
        >
          테스트 토큰 받기
        </a>
      </div>
    </div>
  )
}