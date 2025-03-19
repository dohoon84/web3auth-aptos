'use client'

import { useEffect } from 'react'
import LoginButton from '@/components/LoginButton'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function SignIn() {
  const { data: session, status } = useSession()
  
  // 이미 로그인한 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/dashboard')
    }
  }, [status])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Image
              src="https://aptoslabs.com/assets/images/aptos_word_dark.svg"
              alt="Aptos Logo"
              width={150}
              height={45}
              priority
            />
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">로그인</h1>
          <p className="text-gray-600">
            Google 계정으로 로그인하고 Aptos 이벤트에 참여하세요.
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
          <LoginButton />
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="text-primary hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
} 