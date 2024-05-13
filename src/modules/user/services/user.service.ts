import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserModel, UserPaginationModel } from '../models/user.model';
import { GetUserQueryDto, UserCreateRequestDto } from '../dtos/user-create.dto';
import { RESPONSE_MESSAGE } from '../../../shared/constants/response-message.constant';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUser(queryParams: GetUserQueryDto): Promise<UserPaginationModel> {
    const users = await this.userRepository.getAllUser(queryParams);
    return users;
  }

  async getUserDetail(userId: string): Promise<UserModel> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new HttpException(
        RESPONSE_MESSAGE.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async userCreate(userCreateRequest: UserCreateRequestDto) {
    const existingUser = await this.userRepository.checkUserExistByEmail(
      userCreateRequest.email,
    );
    if (existingUser) {
      throw new HttpException(
        RESPONSE_MESSAGE.USER_ALREADY_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.createUser(userCreateRequest);
  }

  async userHistoryCreate(data: any) {
    if (!data.userId) return;
    await this.getUserDetail(data.userId);

    let title = `Success create ticket with title = ${data.title} and id = ${data.id}`;
    if (data.type && data.type === 'update') {
      title = `Success update ticket with title = ${data.title} and id = ${data.id}`;
    }

    await this.userRepository.createUserHistory({ userId: data.userId, title });
  }
}
