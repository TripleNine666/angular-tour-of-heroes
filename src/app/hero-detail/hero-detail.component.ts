import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as constants from '../static-data';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent {
  // @Input() hero?: Hero;
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder
  ) {}

  // Class, race, sex
  staticData = constants;

  existisHero: boolean = true;
  // text in submit button
  buttonCupture = 'Save';

  // FORM
  heroForm = this.fb.group({
    id: [0],
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я][a-zA-Zа-яА-Я-_\.\ ]{0,20}$/),
      ],
    ],
    age: [
      0,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(3000),
        Validators.pattern(/^[1-9]\d*$/),
      ],
    ],
    class: ['', Validators.required],
    race: ['', Validators.required],
    sex: ['', Validators.required],
  });

  get id() {
    return this.heroForm.get('id');
  }
  get name() {
    return this.heroForm.get('name');
  }
  get age() {
    return this.heroForm.get('age');
  }
  get class() {
    return this.heroForm.get('class');
  }
  get race() {
    return this.heroForm.get('race');
  }
  get sex() {
    return this.heroForm.get('sex');
  }

  ngOnInit(): void {
    //add hero
    if (this.router.url === '/add-hero') {
      this.existisHero = false;
      // change text in button
      this.buttonCupture = 'Add hero';
      // generate id for new hero
      this.heroService.getNewId().subscribe((id) => this.id?.setValue(id));
    } else {
      // update hero
      this.getHero();
    }
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => {
      this.heroForm.patchValue(hero);
    });
  }
  goBack(): void {
    this.location.back();
  }
  clearName() {
    this.heroForm.get('name')?.setValue('');
  }
  clearAge() {
    this.heroForm.get('age')?.setValue(null);
  }
  getTheme() {
    return this.existisHero ? 'accent' : 'primary';
  }
  onSubmit(): void {
    // if valid
    if (this.heroForm.invalid) {
      return;
    }
    // update
    if (this.existisHero) {
      this.heroService
        .updateHero(this.heroForm.value as Hero)
        .subscribe(() => this.goBack());
    } else {
      // add
      this.heroService
        .addHero(this.heroForm.value as Hero)
        .subscribe(() => this.goBack());
    }
  }
}
