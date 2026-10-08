import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats, Seat } from './entities/hall.entity';

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateHallDto): Hall {
    const name = dto.name.trim();
    const isTaken = this.halls.some(
      (hall) => hall.name.toLowerCase() === name.toLowerCase(),
    );
    if (isTaken) {
      throw new ConflictException(`Зал з назвою "${name}" вже існує`);
    }

    const hall: Hall = {
      id: randomUUID(),
      name,
      rows: dto.rows,
      seatsPerRow: dto.seatsPerRow,
    };
    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return this.halls;
  }

  find(id: string): Hall | undefined {
    return this.halls.find((hall) => hall.id === id);
  }

  findOne(id: string): Hall {
    const hall = this.find(id);
    if (!hall) {
      throw new NotFoundException(`Зал з id ${id} не знайдено`);
    }
    return hall;
  }

  findOneWithSeats(id: string): HallWithSeats {
    const hall = this.findOne(id);
    return { ...hall, seats: this.getSeats(hall) };
  }

  getSeats(hall: Hall): Seat[] {
    const seats: Seat[] = [];
    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }
    return seats;
  }

  remove(id: string): void {
    const hall = this.findOne(id);
    if (this.showingsService.hasShowingsForHall(id)) {
      throw new ConflictException(
        `Зал "${hall.name}" не можна видалити: на нього посилаються сеанси`,
      );
    }
    this.halls.splice(this.halls.indexOf(hall), 1);
  }
}
