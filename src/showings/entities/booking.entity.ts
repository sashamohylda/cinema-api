import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '../../halls/entities/hall.entity';

export class Booking {
  @ApiProperty({ example: 'e7f8a9b0-1c2d-4e3f-8a5b-6c7d8e9f0a1b' })
  id!: string;

  @ApiProperty({ example: 'c4a1e2f3-5b6c-4d7e-8f9a-0b1c2d3e4f5a' })
  showingId!: string;

  @ApiProperty({ type: [Seat] })
  seats!: Seat[];

  @ApiProperty({
    example: 25000,
    description: 'Ціна сеансу × кількість місць, у копійках',
  })
  totalPrice!: number;
}
