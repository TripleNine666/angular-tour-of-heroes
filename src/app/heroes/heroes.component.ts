import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private heroService: HeroService) {}
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

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
      this.dataSource.data = heroes;
    });
  }

  ngOnInit() {
    this.getHeroes();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }

  deleteHero(row: any) {
    this.heroes = this.heroes.filter((h) => h !== row);
    this.heroService.deleteHero(row.id).subscribe();
    this.dataSource.data.splice(this.dataSource.data.indexOf(row), 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }
}
