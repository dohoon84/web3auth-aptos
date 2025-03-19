# Google OAuth 설정 가이드

이 문서는 Web3Auth Aptos 이벤트 앱을 위한 Google OAuth 설정 방법을 안내합니다.

## 1. Google Cloud Console에서 OAuth 인증 설정하기

1. [Google Cloud Console](https://console.cloud.google.com/)에 로그인합니다.
2. 상단 드롭다운에서 프로젝트를 선택하거나 새 프로젝트를 생성합니다.
3. 왼쪽 메뉴에서 "API 및 서비스" > "사용자 인증 정보"를 선택합니다.
4. "사용자 인증 정보 만들기" 버튼을 클릭하고 "OAuth 클라이언트 ID"를 선택합니다.
5. 애플리케이션 유형으로 "웹 애플리케이션"을 선택합니다.
6. 애플리케이션 이름을 입력합니다 (예: "Web3Auth Aptos Event").
7. "승인된 리디렉션 URI" 섹션에서 "URI 추가" 버튼을 클릭합니다.
8. 다음 URI를 추가합니다:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
9. 프로덕션 환경에서 사용할 경우 해당 도메인의 콜백 URL도 추가합니다:
   ```
   https://your-domain.com/api/auth/callback/google
   ```
10. "만들기" 버튼을 클릭합니다.
11. 생성된 클라이언트 ID와 클라이언트 비밀번호를 저장합니다.

## 2. 환경 변수 설정하기

1. 프로젝트 루트 디렉토리에 `.env.local` 파일을 생성합니다.
2. 다음 정보를 입력합니다:

```
# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000  # 개발 환경용
# NEXTAUTH_URL=https://your-domain.com  # 프로덕션 환경용
NEXTAUTH_SECRET=your_random_secret_here  # 임의의 복잡한 문자열

# Google OAuth 설정
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# 이메일 전송 설정
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # Gmail의 경우 앱 비밀번호를 사용해야 합니다
```

### Gmail 앱 비밀번호 생성 방법
Gmail을 사용하여 이메일을 전송하려면 일반 비밀번호 대신 앱 비밀번호를 사용해야 합니다:

1. [Google 계정 관리](https://myaccount.google.com/)로 이동합니다.
2. "보안" 탭을 선택합니다.
3. "2단계 인증"을 활성화합니다 (아직 활성화하지 않은 경우).
4. "앱 비밀번호"를 선택합니다.
5. "앱 선택" 드롭다운에서 "기타(사용자 지정 이름)"를 선택합니다.
6. 이름 입력 (예: "Web3Auth Aptos Event").
7. "생성" 버튼을 클릭합니다.
8. 생성된 16자리 앱 비밀번호를 `.env.local` 파일의 `EMAIL_PASS` 값으로 사용합니다.

## 3. 문제 해결

### "앱이 Google의 OAuth 2.0 정책을 준수하지 않습니다" 오류 해결:

이 오류는 주로 다음과 같은 이유로 발생합니다:

1. **리디렉션 URI 불일치**: Google Cloud Console에 등록된 리디렉션 URI와 실제 사용하는 URI가 정확히 일치하지 않습니다.
   
   해결 방법: Google Cloud Console에서 리디렉션 URI가 정확히 `http://localhost:3000/api/auth/callback/google`로 등록되어 있는지 확인하세요.

2. **잘못된 클라이언트 ID 또는 비밀번호**: 환경 변수에 설정된 클라이언트 ID 또는 비밀번호가 올바르지 않습니다.
   
   해결 방법: Google Cloud Console에서 클라이언트 ID와 비밀번호를 다시 확인하고 `.env.local` 파일에 정확히 입력하세요.

3. **OAuth 범위 문제**: 요청된 OAuth 범위가 Google Cloud Console에서 승인되지 않았습니다.
   
   해결 방법: Google Cloud Console의 "OAuth 동의 화면"에서 필요한 범위(이메일, 프로필 등)가 승인되었는지 확인하세요.

4. **OAuth 동의 화면 설정 미완료**: OAuth 동의 화면이 올바르게 설정되지 않았습니다.
   
   해결 방법: Google Cloud Console에서 "API 및 서비스" > "OAuth 동의 화면"으로 이동하여 필수 정보를 모두 입력하세요. 