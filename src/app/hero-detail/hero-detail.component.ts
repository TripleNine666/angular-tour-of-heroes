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
    private router: Router
  ) {}

  staticData = constants;

  existisHero: boolean = true;

  hero: Hero = {
    id: 0,
    name: '',
    age: 0,
    class: '',
    race: '',
    sex: '',
  };

  heroForm = new FormGroup({
    id: new FormControl(this.hero.id),
    name: new FormControl(this.hero.name),
    age: new FormControl(this.hero.age),
    class: new FormControl(this.hero.class),
    race: new FormControl(this.hero.race),
    sex: new FormControl(this.hero.sex),
  });

  ngOnInit(): void {
    if (this.router.url === '/add-hero') {
      this.existisHero = false;

      this.heroService.getNewId().subscribe((id) => (this.hero.id = id));
    } else {
      this.getHero();
    }
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => {
      this.hero = hero;
      this.heroForm.patchValue(hero);
    });
  }
  goBack(): void {
    this.location.back();
  }
  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
  }
  add(): void {
    this.heroService.addHero(this.hero).subscribe();
  }
  onSubmit() {}
}
