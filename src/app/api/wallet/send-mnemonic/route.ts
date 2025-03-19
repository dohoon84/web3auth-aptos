import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getUserByEmail, getWalletByUserId } from '@/lib/db'
import { sendMnemonicEmail } from '@/lib/email'

/**
 * @swagger
 * /api/wallet/send-mnemonic:
 *   post:
 *     summary: 로그인한 사용자의 지갑 니모닉을 이메일로 전송
 *     description: 현재 로그인된 사용자의 Aptos 지갑 니모닉을 이메일로 전송합니다.
 *     responses:
 *       200:
 *         description: 니모닉 이메일 전송 성공
 *       401:
 *         description: 인증되지 않은 요청
 *       404:
 *         description: 지갑 정보를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function POST() {
  try {
    // 세션에서 사용자 정보 가져오기
    const session = await getServerSession()
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 })
    }
    
    // 사용자 정보 조회
    const user = await getUserByEmail(session.user.email)
    
    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 })
    }
    
    // 지갑 정보 조회
    const wallet = await getWalletByUserId(user.id)
    
    if (!wallet) {
      return NextResponse.json({ error: "지갑 정보를 찾을 수 없습니다." }, { status: 404 })
    }
    
    // 이메일 전송
    const emailSent = await sendMnemonicEmail(
      user.email,
      wallet.mnemonic,
      wallet.address
    )
    
    if (!emailSent) {
      return NextResponse.json({ error: "이메일 전송에 실패했습니다." }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: "니모닉 구문이 이메일로 전송되었습니다."
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error sending mnemonic email:', error)
    return NextResponse.json(
      { error: '니모닉 이메일 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 