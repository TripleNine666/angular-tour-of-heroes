import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as constants from '../static-data';

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
    this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
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
}
