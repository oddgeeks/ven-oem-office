import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginEmailDto {
  @IsNotEmpty()
  // @IsEmail()
  public email: string;
}
