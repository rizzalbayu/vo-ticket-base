export class UserModel {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
}

export class UserPaginationModel {
  total: number;
  items: UserModel[];
}
