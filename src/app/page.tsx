import Image from 'next/image'
import LoginButton from '@/components/LoginButton'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[90vh]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        {/* Background Gradient Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 leading-tight">
            간편인증으로<br />Web3를 확장하세요
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Google 로그인만으로 다양한 블록체인을 연결하여 Web3 생태계를 쉽게 경험해보세요.
          </p>
          
          <div className="mt-12 glass-card p-8 w-full max-w-md">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-3">Web3Auth 시작하기</h2>
              <p className="text-gray-600 dark:text-gray-300">
                몇 초만에 인증하고 자동으로 블록체인 지갑을 생성해보세요.
              </p>
            </div>
            
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">간편한 인증</h3>
            <p className="text-gray-600 dark:text-gray-300">기존 Google 계정으로 복잡한 과정 없이 Web3 세계에 접근할 수 있습니다.</p>
          </div>
          
          <div className="card p-8 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">다양한 블록체인 지원</h3>
            <p className="text-gray-600 dark:text-gray-300">하나의 인증으로 여러 블록체인 네트워크에 안전하게 연결할 수 있습니다.</p>
          </div>
          
          <div className="card p-8 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">생태계 확장</h3>
            <p className="text-gray-600 dark:text-gray-300">개발자와 사용자 모두가 쉽게 Web3 생태계를 확장하고 참여할 수 있습니다.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="glass-card p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Web3의 새로운 시대를 함께하세요</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Web3Auth는 기존 인증 방식과 블록체인을 연결하여 더 쉽고 안전한 Web3 경험을 제공합니다. 지금 시작하고 미래 기술을 경험해보세요.
          </p>
          
          <Link 
            href="/api-docs" 
            className="btn btn-outline"
          >
            API 문서 보기
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Web3Auth. 모든 권리 보유.</p>
      </footer>
    </div>
  )
} 