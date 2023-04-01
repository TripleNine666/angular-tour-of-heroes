import { Component } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent {
  constructor(
    private heroServece: HeroService,
    private messageService: MessageService
  ) {}
  selectedHero?: Hero;
  heroes: Hero[] = [];

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(
      `HeroesComponent: Selected Hero id:${this.selectedHero.id}`
    );
  }
  getHeroes(): void {
    this.heroServece.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }
  ngOnInit() {
    this.getHeroes();
  }
}
