import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Seat } from '../halls/entities/hall.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { SeatStatus } from './entities/showing.entity';
import { ShowingsService } from './showings.service';

const seatKey = (seat: Seat): string => `${seat.row}:${seat.seat}`;

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(private readonly showingsService: ShowingsService) {}

  create(showingId: string, dto: CreateBookingDto): Booking {
    const { showing, hall } = this.showingsService.getLayout(showingId);

    const outside = dto.seats.find(
      (seat) => seat.row > hall.rows || seat.seat > hall.seatsPerRow,
    );
    if (outside) {
      throw new BadRequestException(
        `Місця ряд ${outside.row}, місце ${outside.seat} немає в залі "${hall.name}" ` +
          `(${hall.rows} рядів по ${hall.seatsPerRow} місць)`,
      );
    }

    const booked = this.getBookedKeys(showingId);
    const taken = dto.seats.filter((seat) => booked.has(seatKey(seat)));
    if (taken.length > 0) {
      const list = taken
        .map((seat) => `ряд ${seat.row} місце ${seat.seat}`)
        .join(', ');
      throw new ConflictException(`Вже заброньовані: ${list}`);
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats: dto.seats.map(({ row, seat }) => ({ row, seat })),
      totalPrice: showing.price * dto.seats.length,
    };
    this.bookings.push(booking);
    return booking;
  }

  findAll(): Booking[] {
    return this.bookings;
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.getById(showingId);
    return this.bookings.filter((booking) => booking.showingId === showingId);
  }

  getSeatMap(showingId: string): SeatStatus[] {
    const { seats } = this.showingsService.getLayout(showingId);
    const booked = this.getBookedKeys(showingId);
    return seats.map((seat) => ({
      ...seat,
      isBooked: booked.has(seatKey(seat)),
    }));
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      throw new NotFoundException(`Бронювання з id ${id} не знайдено`);
    }
    this.bookings.splice(index, 1);
  }

  private getBookedKeys(showingId: string): Set<string> {
    return new Set(
      this.bookings
        .filter((booking) => booking.showingId === showingId)
        .flatMap((booking) => booking.seats.map(seatKey)),
    );
  }
}
