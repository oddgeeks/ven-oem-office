import { IsNumber } from 'class-validator';

export class UserRoleReassignDto {
  /**
   * Source role id.
   * @example 5
   */
  @IsNumber()
  sourceRoleId: number;

  /**
   * Target role id.
   * @example 4
   */
  @IsNumber()
  targetRoleId: number;
}

export { UserRoleReassignDto as OemUserRoleReassignDto };
