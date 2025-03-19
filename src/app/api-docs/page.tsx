'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// 동적 가져오기로 변경
export default function ApiDocs() {
  const [SwaggerUI, setSwaggerUI] = useState<any>(null)

  useEffect(() => {
    // 클라이언트 사이드에서만 동적으로 import
    import('swagger-ui-react').then(module => {
      setSwaggerUI(() => module.default)
      
      // CSS 스타일 조정
      const style = document.createElement('style')
      style.innerHTML = `
        .swagger-ui .topbar { display: none }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }).catch(err => {
      console.error('Failed to load SwaggerUI:', err)
    })

    // CSS 가져오기
    import('swagger-ui-react/swagger-ui.css')
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Web3Auth API 문서</h1>
      
      {SwaggerUI ? (
        <SwaggerUI url="/api/docs" />
      ) : (
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-gray-700">API 문서를 불러오는 중입니다...</p>
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
} 