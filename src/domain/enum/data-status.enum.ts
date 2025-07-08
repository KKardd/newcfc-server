export enum DataStatus {
  REGISTER = 'REGISTER',
  USED = 'USED', // 운행 중
  COMPLETED = 'COMPLETED', // 운행 완료
  UNUSED = 'UNUSED',
  DELETED = 'DELETED', // 실시간 배차, 기사, 차량 등
  CANCELLED = 'CANCELLED', // 예약, 운행
}
