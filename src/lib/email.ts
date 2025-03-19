import nodemailer from 'nodemailer';
import { validateMnemonic } from './aptos';

// 이메일 전송을 위한 트랜스포터 설정
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

// 설정 검증 함수
export async function verifyEmailConfig() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ 이메일 설정이 완료되지 않았습니다. .env.local 파일에 EMAIL_USER와 EMAIL_PASS를 설정해주세요.');
    console.warn('Gmail을 사용하는 경우 앱 비밀번호를 생성하여 EMAIL_PASS에 입력해야 합니다.');
    console.warn('앱 비밀번호 생성 방법: https://support.google.com/accounts/answer/185833');
    return false;
  }
  
  try {
    await transporter.verify();
    console.log('✅ 이메일 설정이 정상적으로 완료되었습니다.');
    return true;
  } catch (error: any) {
    console.error('❌ 이메일 설정 검증 실패:', error);
    
    if (error.message && error.message.includes('Application-specific password required')) {
      console.error('Gmail을 사용하는 경우 일반 비밀번호가 아닌 앱 비밀번호를 사용해야 합니다.');
      console.error('앱 비밀번호 생성 방법: https://support.google.com/accounts/answer/185833');
    }
    
    return false;
  }
}

// 복구 키 이메일 전송 함수
export async function sendMnemonicEmail(
  email: string, 
  mnemonic: string, 
  walletAddress: string
) {
  try {
    // 설정 검증
    const isConfigValid = await verifyEmailConfig();
    if (!isConfigValid) {
      console.error('이메일 설정이 유효하지 않아 전송을 시도하지 않았습니다.');
      return false;
    }
    
    // 니모닉 유효성 확인
    const isValidMnemonic = validateMnemonic(mnemonic);
    if (!isValidMnemonic) {
      console.error('유효하지 않은 복구 키입니다. 관리자에게 문의하세요.');
      return false;
    }
    
    const result = await transporter.sendMail({
      from: `"Web3Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '블록체인 지갑 복구 키 - 안전하게 보관하세요',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #0d89e3; text-align: center;">Web3Auth 지갑 보안 정보</h1>
          
          <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="font-weight: bold; margin-top: 0;">⚠️ 중요한 보안 정보입니다</p>
            <p style="margin-bottom: 0;">이 이메일에 포함된 복구 키(시드 구문)는 귀하의 블록체인 지갑을 복구하는 데 사용됩니다. 절대로 타인과 공유하지 마시고 안전한 곳에 보관하세요.</p>
          </div>
          
          <h2 style="color: #333;">지갑 정보</h2>
          <p><strong>지갑 주소:</strong> <code style="background: #f5f5f5; padding: 3px 6px; border-radius: 4px; font-family: monospace;">${walletAddress}</code></p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">복구 키 (12단어 시드 구문)</h3>
            <p style="font-family: monospace; font-size: 16px; word-spacing: 5px; background: #fff; padding: 15px; border-radius: 4px; border: 1px dashed #ccc;">${mnemonic}</p>
          </div>
          
          <div style="margin: 25px 0;">
            <h3 style="color: #333;">복구 키 사용법:</h3>
            <ul>
              <li>이 12단어 복구 키는 표준 BIP39 형식으로, Petra 지갑을 포함한 대부분의 블록체인 지갑 앱에서 가져오기/복구 기능으로 사용할 수 있습니다.</li>
              <li>복구 키를 사용하여 지갑을 복원하면 귀하의 모든 자산과 토큰에 다시 접근할 수 있습니다.</li>
              <li>지갑 앱 (Petra, Martian, Pontem 등)에서 "복구" 또는 "가져오기" 옵션을 선택하고 이 12단어를 정확한 순서로 입력하세요.</li>
              <li>복구 키는 절대 디지털 형태로 저장하지 말고, 물리적으로 안전한 장소에 기록해 두는 것이 좋습니다.</li>
            </ul>
          </div>
          
          <p style="font-style: italic; color: #666; text-align: center; margin-top: 30px;">
            Web3Auth를 이용해 주셔서 감사합니다.
          </p>
        </div>
      `,
    });

    console.log('Recovery key email sent:', result.messageId);
    return true;
  } catch (error: any) {
    console.error('Failed to send recovery key email:', error);
    
    // Gmail 앱 비밀번호 관련 오류 추가 안내
    if (error.code === 'EAUTH' && error.responseCode === 534) {
      console.error('Gmail을 사용하는 경우 일반 비밀번호가 아닌 앱 비밀번호를 사용해야 합니다.');
      console.error('앱 비밀번호 생성 방법: https://support.google.com/accounts/answer/185833');
      console.error('환경 변수 EMAIL_PASS에 앱 비밀번호를 설정해주세요.');
    }
    
    return false;
  }
} 