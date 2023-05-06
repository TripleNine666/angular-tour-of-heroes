import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroChangeDialogComponent } from '../hero-change-dialog/hero-change-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as constants from '../static-data';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {TranslateService} from "@ngx-translate/core";

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
    private fb: FormBuilder,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  // Class, race, sex
  staticData = constants;

  existisHero: boolean = true;
  // text in submit button
  buttonCupture = 'heroesDetail.button.save';

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
      this.buttonCupture = 'heroesDetail.button.add';
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
      this.heroService.updateHero(this.heroForm.value as Hero).then();
    } else {
      // add
      this.heroService.addHero(this.heroForm.value as Hero).then();
    }
    const dialogRef = this.dialog.open(HeroChangeDialogComponent, {
      data: {
        title: this.translate.instant('dialog.change.title'),
        hero: {
          name: this.name?.value,
          class: this.translate.instant('hero.classes.' + this.class?.value),
          race: this.translate.instant('hero.races.' + this.race?.value)
        },
        action: this.existisHero ?
          this.translate.instant('dialog.change.action.change') :
          this.translate.instant('dialog.change.action.add'),
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.goBack();
    });
  }
}
