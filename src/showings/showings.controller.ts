import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateShowingDto } from './dto/create-showing.dto';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto';
import { Booking } from './entities/booking.entity';
import { SeatStatus, ShowingView } from './entities/showing.entity';
import { ShowingsService } from './showings.service';

@ApiTags('showings')
@Controller('showings')
export class ShowingsController {
  constructor(
    private readonly showingsService: ShowingsService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ShowingView, description: 'Сеанс створено' })
  @ApiBadRequestResponse({
    description:
      'Фільму або залу не існує; startsAt не ISO 8601 або в минулому; ' +
      'price не є цілим додатним числом',
  })
  create(@Body() dto: CreateShowingDto): ShowingView {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOkResponse({
    type: [ShowingView],
    description: 'Сеанси, відсортовані за часом початку',
  })
  @ApiBadRequestResponse({
    description: 'date не у форматі YYYY-MM-DD або filmId не є UUID',
  })
  findAll(@Query() query: FindShowingsQueryDto): ShowingView[] {
    return this.showingsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ShowingView, description: 'Сеанс' })
  @ApiBadRequestResponse({ description: 'id не є UUID' })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  findOne(@Param('id', ParseUUIDPipe) id: string): ShowingView {
    return this.showingsService.findOne(id);
  }

  @Get(':id/seats')
  @ApiOkResponse({
    type: [SeatStatus],
    description: 'Місця залу з ознакою зайнятості',
  })
  @ApiBadRequestResponse({ description: 'id не є UUID' })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  getSeats(@Param('id', ParseUUIDPipe) id: string): SeatStatus[] {
    return this.bookingsService.getSeatMap(id);
  }

  @Post(':id/bookings')
  @ApiCreatedResponse({ type: Booking, description: 'Бронювання створено' })
  @ApiBadRequestResponse({
    description:
      'seats порожній, елемент без row/seat, місце повторюється, ' +
      'місця немає в залі або число не є цілим додатним',
  })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  @ApiConflictResponse({
    description: 'Хоча б одне місце вже заброньоване на цьому сеансі',
  })
  createBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateBookingDto,
  ): Booking {
    return this.bookingsService.create(id, dto);
  }

  @Get(':id/bookings')
  @ApiOkResponse({ type: [Booking], description: 'Бронювання сеансу' })
  @ApiBadRequestResponse({ description: 'id не є UUID' })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  findBookings(@Param('id', ParseUUIDPipe) id: string): Booking[] {
    return this.bookingsService.findByShowing(id);
  }
}
