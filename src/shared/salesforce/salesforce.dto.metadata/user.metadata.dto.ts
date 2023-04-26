import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SfUserMetadataDto {
  /**
   * The id of User
   * @example 0065f00000995z2AAA
   */
  @IsOptional()
  sfUserId: string;
}
