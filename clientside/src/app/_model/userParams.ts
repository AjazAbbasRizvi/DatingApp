import { User } from './User';

export class UserParams {
  gender: string;
  minAge: number = 18;
  maxAge: number = 99;
  pageNumber: number = 1;
  pageSize: number = 3;
  orderBy : string = "lastActive"

  constructor(user: User) {
    if (user.gender === "male") {
        this.gender = "female";
    }
    if (user.gender === "female") {
        this.gender = "male";
    }
  }
}
