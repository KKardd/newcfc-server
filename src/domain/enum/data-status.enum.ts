export enum DataStatus {
  REGISTER = 'REGISTER',
  USED = 'USED',
  UNUSED = 'UNUSED',
  DELETED = 'DELETED', // 실시간 배차, 기사, 차량 등
  CANCELLED = 'CANCELLED', // 예약, 운행
}
