import { ApiProperty } from '@nestjs/swagger';

export class Seat {
  @ApiProperty({ example: 1 })
  row!: number;

  @ApiProperty({ example: 5 })
  seat!: number;
}

export class Hall {
  @ApiProperty({ example: '9b2d7c1a-3e4f-4a5b-8c6d-7e8f9a0b1c2d' })
  id!: string;

  @ApiProperty({ example: 'Червона зала' })
  name!: string;

  @ApiProperty({ example: 3 })
  rows!: number;

  @ApiProperty({ example: 5 })
  seatsPerRow!: number;
}

export class HallWithSeats extends Hall {
  @ApiProperty({ type: [Seat] })
  seats!: Seat[];
}
