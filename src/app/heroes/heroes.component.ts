import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HeroDialogComponent } from '../hero-dialog/hero-dialog.component';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private heroService: HeroService, public dialog: MatDialog, private translate: TranslateService ) {}
  heroes: Hero[] = [];

  // table's columns
  displayedColumns: string[] = [
    'id',
    'name',
    'age',
    'class',
    'race',
    'sex',
    'options',
  ];
  dataSource = new MatTableDataSource<Hero>();

  ngOnInit() {
    this.getHeroes();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => {

      this.heroes = heroes.map(hero => {
        // This is necessary for the filter to work
        const translatedClass = this.translate.instant('hero.classes.' + hero.class);
        const translatedRace = this.translate.instant('hero.races.' + hero.race);
        const translatedSex = this.translate.instant('hero.sex.' + hero.sex);

        return {...hero, class: translatedClass, race: translatedRace, sex: translatedSex};
      });
      this.dataSource.data = this.heroes;
    });
  }

  deleteHero(row: any) {
    this.heroes = this.heroes.filter((h) => h !== row);
    this.heroService.deleteHero(row.id).subscribe();
    this.dataSource.data.splice(this.dataSource.data.indexOf(row), 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(row: any) {
    let dialogRef = this.dialog.open(HeroDialogComponent, {
      width: '400px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteHero(result);
      }
    });
  }
}
