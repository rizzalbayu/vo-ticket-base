import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GetUserQueryDto, UserCreateRequestDto } from '../dtos/user-create.dto';
import {
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from '../../../shared/constants/response-message.constant';

@Controller('v1/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async FindAll(
    @Query(new ValidationPipe({ transform: true }))
    queryParams: GetUserQueryDto,
  ) {
    const users = await this.usersService.getAllUser(queryParams);
    return {
      status: RESPONSE_STATUS.SUCCESS,
      message: RESPONSE_MESSAGE.SUCCESS,
      data: {
        items: users.items,
        page: +queryParams.page,
        size: +queryParams.size,
        totalItems: users.total,
        totalPages: Math.ceil(users.total / queryParams.size),
      },
    };
  }

  @Get('/:userId')
  async FindOne(@Param('userId') userId: string) {
    const user = await this.usersService.getUserDetail(userId);
    return {
      status: RESPONSE_STATUS.SUCCESS,
      message: RESPONSE_MESSAGE.SUCCESS,
      data: user,
    };
  }

  @Post()
  async CreateUser(@Body() userCreateRequest: UserCreateRequestDto) {
    await this.usersService.userCreate(userCreateRequest);
    return {
      status: RESPONSE_STATUS.SUCCESS,
      message: RESPONSE_MESSAGE.SUCCESS,
      data: null,
    };
  }
}
