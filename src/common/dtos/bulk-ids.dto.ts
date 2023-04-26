import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type EntityId = {
  entityId: string;
};

export class BulkIdsDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: Array,
    default: [
      {
        ['<entityId>']: 1,
      },
      { ['<entityId>']: 2 },
    ],
  })
  bulk: Array<EntityId>;
}
