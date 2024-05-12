import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreateRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  profilePicture: string;
}

export class GetUserQueryDto {
  @IsOptional()
  page: number = 1;
  @IsOptional()
  size: number = 10;
}
