import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FCMNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class FCMService {
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    try {
      // Firebase 서비스 계정 키 파일 경로 또는 JSON 객체
      const serviceAccountPath = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
      const serviceAccountJson = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');

      let credential: admin.credential.Credential;

      if (serviceAccountJson) {
        // JSON 문자열로 제공된 경우
        try {
          // 작은따옴표로 감싼 경우 제거
          const cleanedJson = serviceAccountJson.replace(/^'|'$/g, '');
          const serviceAccount = JSON.parse(cleanedJson);
          credential = admin.credential.cert(serviceAccount);
        } catch (parseError) {
          console.error('Firebase 서비스 계정 JSON 파싱 실패:', parseError);
          throw new Error(`Firebase 서비스 계정 JSON 형식이 올바르지 않습니다: ${parseError}`);
        }
      } else if (serviceAccountPath) {
        // 파일 경로로 제공된 경우
        credential = admin.credential.cert(serviceAccountPath);
      } else {
        throw new Error('Firebase 서비스 계정 정보가 설정되지 않았습니다.');
      }

      this.firebaseApp = admin.initializeApp({
        credential,
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      });

      console.log('Firebase Admin SDK가 성공적으로 초기화되었습니다.');
    } catch (error) {
      console.error('Firebase 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 단일 기기에 FCM 알림 전송
   */
  async sendToDevice(fcmToken: string, payload: FCMNotificationPayload): Promise<boolean> {
    try {
      const message: admin.messaging.Message = {
        token: fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        android: {
          notification: {
            sound: 'default',
            priority: 'high' as any,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('FCM 알림 전송 성공:', response);
      return true;
    } catch (error) {
      console.error('FCM 알림 전송 실패:', error);
      return false;
    }
  }

  /**
   * 여러 기기에 FCM 알림 전송
   */
  async sendToMultipleDevices(fcmTokens: string[], payload: FCMNotificationPayload): Promise<admin.messaging.BatchResponse> {
    try {
      const message: admin.messaging.MulticastMessage = {
        tokens: fcmTokens,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        android: {
          notification: {
            sound: 'default',
            priority: 'high' as any,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`FCM 다중 알림 전송 완료: ${response.successCount}/${response.responses.length}`);
      return response;
    } catch (error) {
      console.error('FCM 다중 알림 전송 실패:', error);
      throw error;
    }
  }

  /**
   * 토픽에 FCM 알림 전송
   */
  async sendToTopic(topic: string, payload: FCMNotificationPayload): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        android: {
          notification: {
            sound: 'default',
            priority: 'high' as any,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('FCM 토픽 알림 전송 성공:', response);
      return response;
    } catch (error) {
      console.error('FCM 토픽 알림 전송 실패:', error);
      throw error;
    }
  }

  /**
   * FCM 토큰 유효성 검증
   */
  async validateToken(fcmToken: string): Promise<boolean> {
    try {
      // dry_run 옵션으로 실제 전송 없이 토큰 유효성만 검증
      await admin.messaging().send(
        {
          token: fcmToken,
          notification: {
            title: 'Test',
            body: 'Test',
          },
        },
        true,
      ); // dry_run = true

      return true;
    } catch (error) {
      console.error('FCM 토큰 유효성 검증 실패:', error);
      return false;
    }
  }
}
