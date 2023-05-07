// import { Injectable } from '@angular/core';
// import { InMemoryDbService } from 'angular-in-memory-web-api';
// import { Hero } from './hero';
// import { CLASSES, RACES, SEX } from './static-data';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class InMemoryDataService implements InMemoryDbService {
//   createDb() {
//     const heroes: Hero[] = [
//       {
//         id: 1,
//         name: 'Arthas',
//         age: 25,
//         class: CLASSES[3],
//         race: RACES[4],
//         sex: SEX[0],
//       },
//       {
//         id: 2,
//         name: 'Rexxar',
//         age: 35,
//         class: CLASSES[1],
//         race: RACES[6],
//         sex: SEX[0],
//       },
//       {
//         id: 3,
//         name: 'Jaina Proudmoore',
//         age: 40,
//         class: CLASSES[2],
//         race: RACES[4],
//         sex: SEX[1],
//       },
//       {
//         id: 4,
//         name: 'Silvana',
//         age: 2700,
//         class: CLASSES[1],
//         race: RACES[8],
//         sex: SEX[1],
//       },
//       {
//         id: 5,
//         name: 'Medivh',
//         age: 40,
//         class: CLASSES[2],
//         race: RACES[4],
//         sex: SEX[0],
//       },
//       {
//         id: 6,
//         name: 'Valeera Sanguinar',
//         age: 40,
//         class: CLASSES[5],
//         race: RACES[1],
//         sex: SEX[1],
//       },
//     ];
//     return { heroes };
//   }
//
//   // Overrides the genId method to ensure that a hero always has an id.
//   // If the heroes array is empty,
//   // the method below returns the initial number (1).
//   // if the heroes array is not empty, the method below returns the highest
//   // hero id + 1.
//   // genId(heroes: Hero[]): number {
//   //   return heroes.length > 0
//   //     ? Math.max(...heroes.map((hero) => hero.id)) + 1
//   //     : 1;
//   // }
// }
