import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsUUID, Matches } from 'class-validator';

export class FindShowingsQueryDto {
  @ApiPropertyOptional({
    example: '3f1c2b8e-6a9d-4c1e-9b7a-2d5e8f0a1b2c',
    description: 'Лише сеанси цього фільму',
  })
  @IsOptional()
  @IsUUID()
  filmId?: string;

  @ApiPropertyOptional({
    example: '2026-12-01',
    description: 'Лише сеанси, що починаються цієї доби (UTC), YYYY-MM-DD',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date має бути у форматі YYYY-MM-DD',
  })
  @IsISO8601({ strict: true }, { message: 'date має бути існуючою датою' })
  date?: string;
}
