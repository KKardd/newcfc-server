# 안심전화번호 구현 가이드

## 개요
예약 시스템에 안심전화번호 기능을 추가하여, 실제 고객 전화번호를 안심전화번호로 변환하고 Operation의 endTime 기준으로 6시간 후까지 자동 만료되도록 구현했습니다.

## 구현된 파일 목록

### 1. 포트 인터페이스
- `src/port/outbound/safety-phone-service.out-port.ts`
  - 안심전화번호 서비스의 아웃바운드 포트 정의

### 2. 인프라스트럭처 레이어
- `src/infrastructure/telecom/safety-phone.service.ts`
  - 안심전화번호 API 호출 구현체
  - 외부 안심전화번호 서비스와의 HTTP 통신 처리

### 3. 모듈 설정
- `src/module/infrastructure/telecom.module.ts`
  - 안심전화번호 서비스를 위한 모듈 정의
  - HttpModule과 SafetyPhoneService 등록

### 4. 수정된 파일들
- `src/module/reservation.module.ts`
  - TelecomModule과 OperationModule 의존성 추가
  - forwardRef로 순환 참조 해결
  
- `src/port/service/reservation.service.ts`
  - 예약 생성/수정 시 안심전화번호 생성 로직 추가
  - Operation endTime 기반 만료 시간 계산
  - 예외 처리로 안전성 확보

## 주요 로직

### 안심전화번호 생성 과정
1. 예약 생성/수정 시 `generateSafetyPhone()` 메서드 호출
2. Operation의 endTime 조회
3. endTime + 6시간 후까지의 만료 시간 계산
4. 외부 안심전화번호 API 호출
5. 실패 시 원본 전화번호 반환

### 만료 시간 계산 로직
```typescript
// endTime에서 6시간 후까지의 시간을 계산
const endTime = new Date(operation.endTime);
const expiryTime = new Date(endTime.getTime() + 6 * 60 * 60 * 1000); // 6시간 후
const now = new Date();

// 현재 시간부터 만료 시간까지의 시간을 계산 (시간 단위)
const expireHours = Math.ceil((expiryTime.getTime() - now.getTime()) / (1000 * 60 * 60));

// 최소 1시간은 보장
const finalExpireHours = Math.max(expireHours, 1);
```

## 환경 변수 설정 (TODO)

현재 구현되었으나 실제 값 설정이 필요한 환경 변수:

```bash
# 안심전화번호 API 베이스 URL (미설정)
SAFETY_PHONE_BASE_URL=

# 안심전화번호 인터페이스 ID (미설정)
SAFETY_PHONE_INTERFACE_ID=
```

## 안심전화번호 API 규격

현재 구현된 API 호출 규격:
- **엔드포인트**: `/link/auto_expire_mapp.do`
- **메서드**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **파라미터**:
  - `iid`: 인터페이스 ID
  - `rn`: 실제 전화번호
  - `expire_hour`: 만료 시간 (시간 단위)
  - `auth`: 인증 정보 (현재는 단순 문자열 반환)

## 다음 단계 작업사항

### 1. 환경 변수 설정
- 안심전화번호 서비스 제공업체로부터 실제 값 획득
- `.env` 파일 또는 환경 변수에 설정

### 2. 인증 로직 구현
- `generateAuth()` 메서드에 실제 인증 로직 구현
- 서비스 제공업체의 인증 방식에 따라 구현

### 3. 에러 처리 강화
- 안심전화번호 API 호출 실패 시 상세한 에러 로깅
- 재시도 로직 추가 고려

### 4. 테스트 추가
- 안심전화번호 생성 로직 단위 테스트
- API 호출 Mock 테스트

## 의존성 추가됨

`package.json`에 다음 의존성이 추가되었습니다:
- `@nestjs/axios`: ^4.0.1
- `axios`: ^1.10.0

## 아키텍처 패턴

이 구현은 헥사고날 아키텍처 패턴을 따릅니다:
- **Domain Layer**: 비즈니스 로직 (reservation.service.ts)
- **Port Layer**: 인터페이스 정의 (safety-phone-service.out-port.ts)
- **Infrastructure Layer**: 외부 시스템 연동 (safety-phone.service.ts)
- **Module Layer**: 의존성 주입 설정 (telecom.module.ts)

## 사용법

환경 변수 설정 후 예약 생성/수정 시 자동으로 안심전화번호가 생성됩니다:

```typescript
// 예약 생성 시
const reservation = await reservationService.create({
  operationId: 1,
  passengerPhone: '010-1234-5678',
  // ... 기타 필드
});
// reservation.safetyPhone에 안심전화번호가 자동 할당됨

// 예약 수정 시 전화번호 변경
await reservationService.update(reservationId, {
  passengerPhone: '010-9876-5432'
});
// 새로운 안심전화번호가 자동 생성됨
```

## 참고사항

- 안심전화번호 생성 실패 시 원본 전화번호가 반환되므로 서비스 연속성 보장
- Operation의 endTime이 없는 경우 기본 12시간으로 설정
- 최소 만료 시간은 1시간으로 보장
- 순환 참조 문제를 forwardRef로 해결