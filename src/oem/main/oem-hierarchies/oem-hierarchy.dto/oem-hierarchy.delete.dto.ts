import { IsNotEmpty } from 'class-validator';

export class HierarchyDeleteDto {
  /**
   * The Hierarchy ID
   * @example 1
   */
  @IsNotEmpty()
  hierarchyId: number | string;

  /**
   * The Replacement Hierarchy ID
   * @example 2
   */
  @IsNotEmpty()
  replacementHierarchyId: number | string;
}

export { HierarchyDeleteDto as OemHierarchyDeleteDto };
