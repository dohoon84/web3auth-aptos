이벤트 기반 web3Auth MVP를 개발하는 과정에서 필요한 핵심 기능과 기술 스택을 정리하면 다음과 같음.

### **구현할 기능**
1. **Google OAuth 인증**
   - `@react-oauth/google` 또는 `passport-google-oauth` 활용
   - 로그인 성공 시 사용자 정보(email, name 등) 획득

2. **Aptos Wallet 생성**
   - `@aptos-labs/ts-sdk` 사용
   - 사용자의 이메일을 기반으로 니모닉 생성 후 Wallet 생성

3. **데이터 저장**
   - SQLite DB 활용
   - 저장 항목: email, Google 로그인 정보, 니모닉, Wallet 주소

4. **API 제공**
   - Swagger 연동 (`swagger-jsdoc`, `swagger-ui-express`)
   - 로그인, Wallet 생성, 사용자 정보 리스트 API 구현

5. **이벤트 페이지 UI**
   - Next.js 기반으로 이벤트 페이지 구현
   - Google 로그인 버튼 및 로그인 후 결과 확인 페이지 구성

### **개발 진행 순서**
1. **Google OAuth 로그인 구현**
2. **Aptos Wallet 자동 생성 로직 추가**
3. **SQLite DB 모델링 및 저장 기능 구현**
4. **Swagger API 문서화**
5. **이벤트 페이지 UI 구성**