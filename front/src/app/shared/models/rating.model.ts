import { ValidatorFn, Validators } from '@angular/forms';

export class Rating {
  id!: string;
  rating!: number;
  date!: Date;
  comment!: string;

  public static createRating(rating: number, comment: string): Rating {
    let ratingObj = new Rating();
    ratingObj.rating = rating;
    ratingObj.comment = comment;

    return ratingObj;
  }

  public static getRatingValidators(): ValidatorFn | null {
    return Validators.compose([
      Validators.required,
      Validators.min(0),
      Validators.max(20),
      Validators.pattern('^[0-9]*$'),
    ]);
  }

  public static getCommentValidators(): ValidatorFn | null {
    return Validators.compose([Validators.maxLength(1000)]);
  }
}
