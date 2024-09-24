export class UserRatingDto {
  constructor(userId, hotelId, experienceId, rating) {
    this.userId = userId;
    this.hotelId = hotelId;
    this.experienceId = experienceId;
    this.rating = rating;
  }
}
