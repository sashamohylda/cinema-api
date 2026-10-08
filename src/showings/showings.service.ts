import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service';
import { Hall, Seat } from '../halls/entities/hall.entity';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto';
import { Showing, ShowingView } from './entities/showing.entity';

@Injectable()
export class ShowingsService {
  private readonly showings: Showing[] = [];

  constructor(
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    @Inject(forwardRef(() => HallsService))
    private readonly hallsService: HallsService,
  ) {}

  create(dto: CreateShowingDto): ShowingView {
    if (!this.filmsService.find(dto.filmId)) {
      throw new BadRequestException(`Фільм з id ${dto.filmId} не знайдено`);
    }
    if (!this.hallsService.find(dto.hallId)) {
      throw new BadRequestException(`Зал з id ${dto.hallId} не знайдено`);
    }

    const startsAt = new Date(dto.startsAt);
    if (startsAt.getTime() <= Date.now()) {
      throw new BadRequestException('startsAt вказує на момент у минулому');
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: startsAt.toISOString(),
      price: dto.price,
    };
    this.showings.push(showing);
    return this.toView(showing);
  }

  findAll(query: FindShowingsQueryDto): ShowingView[] {
    return this.showings
      .filter((showing) => !query.filmId || showing.filmId === query.filmId)
      .filter(
        (showing) => !query.date || showing.startsAt.startsWith(query.date),
      )
      .sort(
        (a, b) =>
          a.startsAt.localeCompare(b.startsAt) || a.id.localeCompare(b.id),
      )
      .map((showing) => this.toView(showing));
  }

  findOne(id: string): ShowingView {
    return this.toView(this.getById(id));
  }

  getById(id: string): Showing {
    const showing = this.showings.find((item) => item.id === id);
    if (!showing) {
      throw new NotFoundException(`Сеанс з id ${id} не знайдено`);
    }
    return showing;
  }

  getLayout(id: string): { showing: Showing; hall: Hall; seats: Seat[] } {
    const showing = this.getById(id);
    const hall = this.hallsService.findOne(showing.hallId);
    return { showing, hall, seats: this.hallsService.getSeats(hall) };
  }

  hasShowingsForFilm(filmId: string): boolean {
    return this.showings.some((showing) => showing.filmId === filmId);
  }

  hasShowingsForHall(hallId: string): boolean {
    return this.showings.some((showing) => showing.hallId === hallId);
  }

  private toView(showing: Showing): ShowingView {
    return {
      id: showing.id,
      filmTitle: this.filmsService.findOne(showing.filmId).title,
      hallName: this.hallsService.findOne(showing.hallId).name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}
