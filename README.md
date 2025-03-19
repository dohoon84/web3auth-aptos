# Web3Auth Aptos 이벤트 MVP

이 프로젝트는 Google OAuth를 통한 간편한 로그인과 Aptos 블록체인 지갑의 자동 생성을 구현한 웹 애플리케이션입니다.

## 주요 기능

- **Google OAuth 인증** - 간편한 소셜 로그인
- **Aptos Wallet 자동 생성** - 사용자 이메일 기반 지갑 생성
- **SQLite 데이터 저장** - 사용자 정보 및 지갑 관리
- **API 제공** - REST API 및 Swagger 문서화
- **이벤트 페이지 UI** - 직관적인 사용자 인터페이스

## 시작하기

### 필수 요구사항

- Node.js 16 이상
- npm 또는 yarn

### 설치 방법

1. 저장소 클론
   ```bash
   git clone https://github.com/yourusername/web3auth-mvp.git
   cd web3auth-mvp
   ```

2. 의존성 설치
   ```bash
   npm install
   ```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-for-nextauth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

   - Google OAuth 클라이언트 ID와 Secret은 [Google Cloud Console](https://console.cloud.google.com/)에서 생성할 수 있습니다.

4. 데이터베이스 초기화
   애플리케이션을 처음 실행하기 전에 데이터베이스를 초기화하세요:
   ```bash
   # 애플리케이션 실행 후
   curl http://localhost:3000/api/setup
   ```

5. 개발 서버 실행
   ```bash
   npm run dev
   ```

6. 브라우저에서 `http://localhost:3000` 접속

## API 문서

Swagger UI를 통해 API 문서를 확인할 수 있습니다:
`http://localhost:3000/api-docs`

## 기술 스택

- **프론트엔드**: Next.js, React, TailwindCSS
- **인증**: NextAuth.js, Google OAuth
- **블록체인**: Aptos Blockchain, `@aptos-labs/ts-sdk`
- **데이터베이스**: SQLite
- **API 문서화**: Swagger

## 구현된 API 엔드포인트

- `GET /api/users` - 모든 사용자 목록 조회
- `GET /api/wallet` - 로그인한 사용자의 지갑 정보 조회
- `GET /api/setup` - 데이터베이스 초기화 