'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export default function LoginButton() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  
  if (loading) {
    return (
      <button 
        className="btn w-full flex items-center justify-center opacity-70 cursor-not-allowed" 
        disabled
      >
        <div className="flex items-center">
          <div className="w-5 h-5 mr-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          <span>로딩중...</span>
        </div>
      </button>
    )
  }
  
  if (session) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-3 mb-5 bg-white/50 dark:bg-dark/50 py-2 px-4 rounded-full">
          {session.user?.image && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-300 dark:ring-primary-700">
              <Image 
                src={session.user.image} 
                alt={session.user.name || '프로필 이미지'} 
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium">{session.user?.name || '사용자'} 님</span>
        </div>
        <button 
          className="btn btn-secondary flex items-center justify-center group transition-all"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <span>로그아웃</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    )
  }
  
  return (
    <button 
      className="btn btn-primary flex items-center justify-center w-full group"
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
    >
      <div className="bg-white/20 rounded-full p-1.5 mr-3 group-hover:scale-110 transition-transform">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
      </div>
      <span>Google로 로그인</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
      </svg>
    </button>
  )
} 