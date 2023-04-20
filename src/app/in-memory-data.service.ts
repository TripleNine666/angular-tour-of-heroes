import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';
import { CLASSES, RACES, SEX } from './static-data';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes: Hero[] = [
      {
        id: 1,
        name: 'Dr. Nice',
        age: 30,
        class: CLASSES[0],
        race: RACES[2],
        sex: SEX[0],
      },
      {
        id: 2,
        name: 'Bombasto',
        age: 40,
        class: CLASSES[2],
        race: RACES[3],
        sex: SEX[0],
      },
      {
        id: 3,
        name: 'Celeritas',
        age: 120,
        class: CLASSES[4],
        race: RACES[5],
        sex: SEX[1],
      },
    ];
    return { heroes };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (1).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0
      ? Math.max(...heroes.map((hero) => hero.id)) + 1
      : 1;
  }
}
