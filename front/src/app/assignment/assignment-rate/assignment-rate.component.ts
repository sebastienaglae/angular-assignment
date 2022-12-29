import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assignment-rate',
  templateUrl: './assignment-rate.component.html',
  styleUrls: ['./assignment-rate.component.css'],
})
export class AssignmentRateComponent {
  rateForm: RateFormGroup = new RateFormGroup();
  isLoading: boolean = true;
}

class RateFormGroup extends FormGroup {
  constructor() {
    super({
      rateCtrl: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(20),
      ]),
      commentCtrl: new FormControl('', [Validators.required]),
    });
  }

  get rateValue() {
    return this.get('rateCtrl')?.value;
  }

  get commentValue() {
    return this.get('commentCtrl')?.value;
  }

  set rateValue(value: number) {
    this.get('rateCtrl')?.setValue(value);
  }

  set commentValue(value: string) {
    this.get('commentCtrl')?.setValue(value);
  }
}
