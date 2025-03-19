import { NextResponse } from 'next/server'
import { getAllUsers, getWalletByUserId } from '@/lib/db'
import { getServerSession } from 'next-auth'

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 사용자 목록 조회
 *     description: 시스템에 등록된 모든 사용자와 지갑 정보를 반환합니다.
 *     responses:
 *       200:
 *         description: 사용자 목록 반환 성공
 *       401:
 *         description: 인증되지 않은 요청
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    // 세션 확인 (선택적)
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    
    // 모든 사용자 조회
    const users = await getAllUsers()
    
    // 각 사용자의 지갑 정보 추가
    const usersWithWallets = await Promise.all(
      users.map(async (user) => {
        const wallet = await getWalletByUserId(user.id)
        return {
          ...user,
          wallet: wallet ? {
            address: wallet.address,
            // 보안상 니모닉은 포함하지 않음
          } : null
        }
      })
    )
    
    return NextResponse.json({ users: usersWithWallets }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
} 