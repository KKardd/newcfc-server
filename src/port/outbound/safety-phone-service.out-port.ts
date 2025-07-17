export abstract class SafetyPhoneServiceOutPort {
  abstract createVirtualNumberWithAutoExpiry(realNumber: string, expireHours: number): Promise<string>;
}
