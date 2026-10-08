import { ApiProperty } from '@nestjs/swagger';

export class Showing {
  @ApiProperty({ example: 'c4a1e2f3-5b6c-4d7e-8f9a-0b1c2d3e4f5a' })
  id!: string;

  @ApiProperty({ example: '3f1c2b8e-6a9d-4c1e-9b7a-2d5e8f0a1b2c' })
  filmId!: string;

  @ApiProperty({ example: '9b2d7c1a-3e4f-4a5b-8c6d-7e8f9a0b1c2d' })
  hallId!: string;

  @ApiProperty({ example: '2026-12-01T18:30:00.000Z' })
  startsAt!: string;

  @ApiProperty({ example: 12500, description: 'Ціна квитка в копійках' })
  price!: number;
}

export class ShowingView {
  @ApiProperty({ example: 'c4a1e2f3-5b6c-4d7e-8f9a-0b1c2d3e4f5a' })
  id!: string;

  @ApiProperty({ example: 'Dune: Part Two' })
  filmTitle!: string;

  @ApiProperty({ example: 'Червона зала' })
  hallName!: string;

  @ApiProperty({ example: '2026-12-01T18:30:00.000Z' })
  startsAt!: string;

  @ApiProperty({ example: 12500, description: 'Ціна квитка в копійках' })
  price!: number;
}

export class SeatStatus {
  @ApiProperty({ example: 1 })
  row!: number;

  @ApiProperty({ example: 5 })
  seat!: number;

  @ApiProperty({ example: false })
  isBooked!: boolean;
}
