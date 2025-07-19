# FCM (Firebase Cloud Messaging) 설정 가이드

## 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **프로젝트 설정** > **서비스 계정** 탭으로 이동
4. **새 비공개 키 생성** 클릭하여 서비스 계정 키 JSON 파일 다운로드

## 2. 환경 변수 설정

`.env` 파일에 다음 환경 변수를 추가하세요:

```bash
# Firebase 설정
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account-key.json
# 또는 JSON 문자열로 직접 설정
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

## 3. 서비스 계정 키 설정 방법

### 방법 1: 파일 경로 사용
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=/Users/yourname/path/to/firebase-service-account.json
```

### 방법 2: JSON 문자열 사용 (추천 - 보안)
```bash
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

## 4. 구현된 기능

### 4.1 FCM 알림 전송
- **예약 생성 시 기사에게 자동 알림**
- **단일/다중 기기 알림 전송**
- **토픽 기반 알림 전송**
- **토큰 유효성 검증**

### 4.2 API 엔드포인트

#### FCM 토큰 등록/업데이트
```http
PUT /chauffeurs/me/fcm-token
Authorization: Bearer {chauffeur_token}
Content-Type: application/json

{
  "fcmToken": "c1234567890abcdef..."
}
```

### 4.3 자동 알림 발송 시점
1. **운행 배정 시**: 새로운 운행이 기사에게 배정될 때
2. **운행 상태 변경 시**: 운행 상태가 업데이트될 때 (선택사항)
3. **긴급 알림**: 모든 기사에게 긴급 메시지 전송

## 5. 알림 메시지 구조

```json
{
  "notification": {
    "title": "새로운 운행 배정",
    "body": "새로운 운행이 배정되었습니다. 출발시간: 2025-01-18 10:30"
  },
  "data": {
    "type": "NEW_OPERATION",
    "operationId": "123",
    "chauffeurId": "456",
    "operationType": "REGULAR",
    "startTime": "2025-01-18T10:30:00.000Z"
  }
}
```

## 6. 클라이언트 앱 설정 (Android/iOS)

### Android
1. `google-services.json` 파일을 앱에 추가
2. FCM SDK 설정
3. 토큰 받기 및 서버로 전송

### iOS  
1. `GoogleService-Info.plist` 파일을 앱에 추가
2. APNs 인증서 설정
3. FCM SDK 설정

## 7. 테스트 방법

1. **기사 앱에서 FCM 토큰 등록**:
   ```http
   PUT /chauffeurs/me/fcm-token
   ```

2. **운행 배정 테스트**:
   ```http
   POST /operations/assign-chauffeur
   ```

3. **직접 알림 전송 테스트** (개발용):
   - Firebase Console에서 직접 테스트 메시지 전송
   - 또는 NotificationService 메서드 직접 호출

## 8. 주의사항

- **보안**: 서비스 계정 키는 절대 코드에 하드코딩하지 말고 환경 변수 사용
- **토큰 관리**: FCM 토큰은 변경될 수 있으므로 앱에서 주기적으로 업데이트
- **에러 처리**: 알림 전송 실패는 시스템 전체에 영향을 주지 않도록 설계됨
- **로그**: FCM 관련 로그를 모니터링하여 전송 성공/실패 추적

## 9. 문제 해결

### 토큰 유효성 오류
```
Firebase 토큰 유효성 검증 실패
```
→ 앱에서 새 토큰 발급 후 서버에 업데이트

### 인증 오류
```
Firebase 초기화 실패
```
→ 서비스 계정 키와 프로젝트 ID 확인

### 알림 미수신
1. FCM 토큰이 올바르게 등록되었는지 확인
2. 앱이 백그라운드/포그라운드 상태 확인
3. 기기의 알림 권한 설정 확인