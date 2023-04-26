import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class RolesVisibleProductFieldsDto {
  /**
   * The id of Role
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  roleId: number;

  /**
   * The id of VisibleProductField
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  visibleProductFieldId: number;
}

export { RolesVisibleProductFieldsDto as OemRolesVisibleProductFieldsDto };
