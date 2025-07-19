export abstract class NotificationServiceOutPort {
  abstract sendReservationNotification(chauffeurId: number, operationId: number, message: string): Promise<boolean>;
  abstract sendOperationCancellationNotification(chauffeurId: number, operationId: number, reason?: string): Promise<boolean>;
  abstract sendToDevice(fcmToken: string, title: string, body: string, data?: Record<string, string>): Promise<boolean>;
  abstract sendToMultipleDevices(fcmTokens: string[], title: string, body: string, data?: Record<string, string>): Promise<any>;
  abstract validateToken(fcmToken: string): Promise<boolean>;
}