import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];
  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: dto.title,
      durationMinutes: dto.durationMinutes,
      releaseYear: dto.releaseYear,
    };
    this.films.push(film);
    return film;
  }

  findAll(): Film[] {
    return this.films;
  }

  find(id: string): Film | undefined {
    return this.films.find((film) => film.id === id);
  }

  findOne(id: string): Film {
    const film = this.find(id);
    if (!film) {
      throw new NotFoundException(`Фільм з id ${id} не знайдено`);
    }
    return film;
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    if (dto.title !== undefined) film.title = dto.title;
    if (dto.durationMinutes !== undefined) {
      film.durationMinutes = dto.durationMinutes;
    }
    if (dto.releaseYear !== undefined) film.releaseYear = dto.releaseYear;
    return film;
  }

  remove(id: string): void {
    const film = this.findOne(id);
    if (this.showingsService.hasShowingsForFilm(id)) {
      throw new ConflictException(
        `Фільм "${film.title}" не можна видалити: на нього посилаються сеанси`,
      );
    }
    this.films.splice(this.films.indexOf(film), 1);
  }
}
