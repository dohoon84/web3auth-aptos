import { NextResponse } from 'next/server'
import { getAllUsers, getWalletByUserId, updateWalletMnemonic } from '@/lib/db'
import { ensureValidMnemonic, validateMnemonic } from '@/lib/aptos'

/**
 * @swagger
 * /api/wallet/update-mnemonics:
 *   post:
 *     summary: 모든 사용자의 니모닉을 유효한 BIP39 형식으로 업데이트
 *     description: 관리자만 접근 가능한 엔드포인트로, 기존 사용자의 니모닉을 유효한 BIP39 형식으로 업데이트합니다.
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: 니모닉 업데이트 성공
 *       401:
 *         description: 인증되지 않은 요청
 *       500:
 *         description: 서버 오류
 */

// 관리자 키로 보호된 API
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'development-admin-key'

export async function POST(request: Request) {
  try {
    // 관리자 인증 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_KEY) {
      return NextResponse.json({ error: "관리자 접근 권한이 필요합니다." }, { status: 401 })
    }
    
    // 모든 사용자 가져오기
    const users = await getAllUsers()
    
    if (!users.length) {
      return NextResponse.json({ message: "업데이트할 사용자가 없습니다." }, { status: 200 })
    }
    
    const results = {
      total: users.length,
      updated: 0,
      alreadyValid: 0,
      failed: 0,
      errors: [] as string[]
    }
    
    // 각 사용자의 지갑 니모닉 검사 및 업데이트
    for (const user of users) {
      try {
        const wallet = await getWalletByUserId(user.id)
        
        if (!wallet) {
          continue // 지갑이 없으면 건너뛰기
        }
        
        // 니모닉 유효성 검사
        const isValid = validateMnemonic(wallet.mnemonic)
        
        if (isValid) {
          // 이미 유효한 니모닉
          results.alreadyValid++
          continue
        }
        
        // 새로운 유효한 니모닉 생성
        const validMnemonic = ensureValidMnemonic(wallet.mnemonic)
        
        // 니모닉 업데이트
        await updateWalletMnemonic(wallet.id, validMnemonic)
        results.updated++
        
      } catch (error: any) {
        results.failed++
        results.errors.push(`사용자 ID ${user.id}: ${error.message || '알 수 없는 오류'}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `${results.total} 사용자 중 ${results.updated}명의 니모닉이 업데이트되었습니다. ${results.alreadyValid}명은 이미 유효한 형식이었습니다.`,
      results
    }, { status: 200 })
    
  } catch (error: any) {
    console.error('Error updating mnemonics:', error)
    return NextResponse.json(
      { error: '니모닉 업데이트 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    )
  }
} 