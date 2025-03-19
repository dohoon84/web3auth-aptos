import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createOrUpdateUser } from '@/lib/db'
import { createAptosAccountFromEmail } from '@/lib/aptos'
import { createWallet, getUserByEmail, getWalletByUserId } from '@/lib/db'
import { sendMnemonicEmail, verifyEmailConfig } from '@/lib/email'

// 시작 시 이메일 설정 확인
(async () => {
  console.log('이메일 설정을 확인 중입니다...');
  await verifyEmailConfig();
})();

// NextAuth 구성
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : 'http://localhost:3000/api/auth/callback/google'
        }
      }
    }),
  ],
  // 디버그 모드 활성화 (개발 환경에서만)
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          // 사용자 생성 또는 업데이트
          const userId = await createOrUpdateUser({
            email: user.email,
            name: user.name || '',
            picture: user.image || '',
          })
          
          // 사용자의 지갑 확인
          const wallet = await getWalletByUserId(userId as number)
          
          // 지갑이 없다면 생성
          if (!wallet) {
            const { account, mnemonic } = createAptosAccountFromEmail(user.email)
            const newWallet = await createWallet(
              userId as number, 
              mnemonic, 
              account.address().hex() // aptos 패키지 형식
            )
            
            // 새로 생성된 지갑의 니모닉을 이메일로 전송
            try {
              // 이메일 전송 시도
              const emailSent = await sendMnemonicEmail(
                user.email,
                mnemonic,
                account.address().hex()
              );
              
              if (emailSent) {
                console.log(`✅ 니모닉 이메일이 ${user.email}로 성공적으로 전송되었습니다.`);
              } else {
                console.error(`❌ 니모닉 이메일 전송 실패: ${user.email}`);
                console.log('환경 변수를 확인하거나 이메일 설정을 업데이트해주세요.');
              }
            } catch (emailError) {
              console.error('니모닉 이메일 전송 중 오류 발생:', emailError);
              console.log('환경 변수에 EMAIL_USER와 EMAIL_PASS가 올바르게 설정되어 있는지 확인하세요.');
              // 이메일 전송 실패해도 로그인은 계속 진행
            }
          } else {
            console.log(`기존 사용자 로그인: ${user.email} (지갑이 이미 생성됨)`);
          }
          
          return true
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return false
    },
    
    async session({ session }) {
      // 세션에 사용자 지갑 정보 추가
      if (session.user?.email) {
        const user = await getUserByEmail(session.user.email)
        if (user) {
          const wallet = await getWalletByUserId(user.id)
          if (wallet) {
            session.user.walletAddress = wallet.address
          }
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret',
})

export { handler as GET, handler as POST } 