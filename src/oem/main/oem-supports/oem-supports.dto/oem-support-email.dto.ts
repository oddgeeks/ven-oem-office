import { IsEnum, IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { FeedbackTypeEnum } from '../oem-supports.enums/feedback-type.enum';

export class SupportEmailDto {
  /**
   * The feedback type
   * @example "Product Feedback"
   */
  @IsEnum(FeedbackTypeEnum)
  @IsNotEmpty()
  feedbackType: FeedbackTypeEnum;

  /**
   * The message
   * @example "Help Me"
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message: string;
}

export { SupportEmailDto as OemSupportEmailDto };
