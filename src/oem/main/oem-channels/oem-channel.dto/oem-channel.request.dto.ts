import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChannelRequestDto {
  /**
   * The partner name
   * @example "Bob's Partner"
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  partnerName: string;

  /**
   * The website
   * @example https://test.abc.com
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  website: string;

  /**
   * The contact email
   * @example johndoe+1@test.com
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  contactEmail: string;
}

export { ChannelRequestDto as OemChannelRequestDto };
