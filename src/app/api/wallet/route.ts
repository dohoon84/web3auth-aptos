import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getUserByEmail, getWalletByUserId } from '@/lib/db'
import { getAccountBalance } from '@/lib/aptos'

/**
 * @swagger
 * /api/wallet:
 *   get:
 *     summary: 로그인한 사용자의 지갑 정보 조회
 *     description: 현재 로그인된 사용자의 Aptos 지갑 주소와 잔액 정보를 반환합니다.
 *     responses:
 *       200:
 *         description: 지갑 정보 반환 성공
 *       401:
 *         description: 인증되지 않은 요청
 *       404:
 *         description: 지갑 정보를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    // 세션에서 사용자 정보 가져오기
    const session = await getServerSession()
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // 사용자 정보 조회
    const user = await getUserByEmail(session.user.email)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // 지갑 정보 조회
    const wallet = await getWalletByUserId(user.id)
    
    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }
    
    // 잔액 조회
    const balance = await getAccountBalance(wallet.address)
    
    return NextResponse.json({
      wallet: {
        address: wallet.address,
        balance,
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet information' },
      { status: 500 }
    )
  }
} 