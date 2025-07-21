import { Transform } from 'class-transformer';
import { ClassTransformOptions as ClassTransformOptionsInterface } from 'class-transformer/types/interfaces/class-transformer-options.interface';

/**
 * Date를 KST로 변환하는 transformer
 */
export const KSTDateTransform = Transform(({ value }) => {
  if (!value) return value;
  if (!(value instanceof Date)) return value;

  // 한국 시간(KST)으로 변환 - UTC+9
  const kstOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
  const kstDate = new Date(value.getTime() + kstOffset);

  // ISO 문자열로 반환하되 Z를 제거하여 현지 시간임을 표시
  return kstDate.toISOString().replace('Z', '+09:00');
});

export const classTransformDefaultOptions: ClassTransformOptionsInterface = {
  strategy: 'exposeAll',
  enableImplicitConversion: true,
  excludeExtraneousValues: false,
};
