import { NextResponse } from 'next/server'
import { initDb } from '@/lib/db'

/**
 * @swagger
 * /api/setup:
 *   get:
 *     summary: 데이터베이스 초기화
 *     description: SQLite 데이터베이스와 테이블을 초기화합니다.
 *     responses:
 *       200:
 *         description: 데이터베이스 초기화 성공
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    // 데이터베이스 초기화
    await initDb()
    
    return NextResponse.json({ 
      message: 'Database initialized successfully' 
    }, { status: 200 })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
} 