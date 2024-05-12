import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/adapters/prisma/prisma.service';
import { UserModel, UserPaginationModel } from '../models/user.model';
import { User } from '@prisma/client';
import { GetUserQueryDto, UserCreateRequestDto } from '../dtos/user-create.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllUser(queryParams: GetUserQueryDto): Promise<UserPaginationModel> {
    const users = await this.prismaService.user.findMany({
      orderBy: {
        created_at: 'desc',
      },
      skip: (queryParams.page - 1) * queryParams.size,
      take: +queryParams.size,
    });
    const total = await this.prismaService.user.count({
      where: {
        deleted_at: null,
      },
    });

    return {
      items: users.map((user) => this.toUserModel(user)),
      total,
    };
  }

  async checkUserExistByEmail(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    return user ? true : false;
  }

  async getUserById(id: string): Promise<UserModel> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;
    return this.toUserModel(user);
  }

  async createUser(
    createUserRequest: UserCreateRequestDto,
  ): Promise<UserModel> {
    const user = await this.prismaService.user.create({
      data: {
        name: createUserRequest.name,
        email: createUserRequest.email,
        profile_picture: createUserRequest.profilePicture,
      },
    });
    return this.toUserModel(user);
  }

  toUserModel(user: User): UserModel {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profile_picture,
    };
  }
}
