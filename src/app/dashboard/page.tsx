'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import LoginButton from '@/components/LoginButton'
import WalletInfo from '@/components/WalletInfo'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  
  // 로딩 중이면 로딩 UI 표시
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">로딩 중...</p>
      </div>
    )
  }
  
  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!session) {
    redirect('/')
  }
  
  return (
    <div className="py-12">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-primary-500/5 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="mb-10">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
              <path fillRule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clipRule="evenodd" />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            마이페이지
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Google 계정으로 생성된 Aptos 지갑 정보를 확인하세요.
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 사용자 프로필 */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">내 프로필</h2>
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <LoginButton />
            </div>
            
            <div className="mt-6 text-center w-full">
              <div className="bg-white/50 dark:bg-dark/50 p-4 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400 mb-1">이메일</p>
                <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 지갑 정보 */}
        <div className="lg:col-span-2 space-y-8">
          <WalletInfo />
          
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-accent/5 rounded-full blur-xl"></div>
            
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">다음 단계</h3>
            <ul className="space-y-5">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center mr-3 font-medium">1</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Aptos 테스트넷 Faucet 이용하기</h4>
                  <p className="text-gray-600 dark:text-gray-300">Aptos 테스트넷 Faucet에서 테스트용 APT를 받아 트랜잭션을 실험해보세요.</p>
                  <a 
                    href="https://aptoslabs.com/testnet-faucet" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Aptos Faucet 바로가기
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-full flex items-center justify-center mr-3 font-medium">2</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Explorer에서 확인하기</h4>
                  <p className="text-gray-600 dark:text-gray-300">Aptos Explorer를 통해 지갑 정보, 트랜잭션 내역, 자산을 확인하세요.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-accent to-orange-500 text-white rounded-full flex items-center justify-center mr-3 font-medium">3</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">이벤트 참여하기</h4>
                  <p className="text-gray-600 dark:text-gray-300">새로운 Aptos 이벤트에 참여하여 블록체인 생태계를 경험하고 보상을 받으세요.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 