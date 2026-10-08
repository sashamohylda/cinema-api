import { ApiProperty } from '@nestjs/swagger';

export class Film {
  @ApiProperty({ example: '3f1c2b8e-6a9d-4c1e-9b7a-2d5e8f0a1b2c' })
  id!: string;

  @ApiProperty({ example: 'Dune: Part Two' })
  title!: string;

  @ApiProperty({ example: 166 })
  durationMinutes!: number;

  @ApiProperty({ example: 2024 })
  releaseYear!: number;
}
