export class UserDto {
  _id;
  email;
  nickname;
  photo;

  constructor(model) {
    this._id = model._id
    this.email = model.email
    this.nickname = model.nickname
    this.photo = model.photo
  }
}