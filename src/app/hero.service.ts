import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import {TranslateService} from "@ngx-translate/core";
import {AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private dbPath = '/heroes';
  heroesRef: AngularFireList<Hero>;

  constructor(
    private messageService: MessageService,
    private translate: TranslateService,
    private db: AngularFireDatabase
  ) {
    this.heroesRef = db.list<Hero>(this.dbPath);

  }

  heroes: Hero[] = [];

  getHeroes(): Observable<any[]> {
    return this.heroesRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })
      )),
      tap((_) => this.log(this.translate.instant('messages.heroService.getHeroes'))),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(key: string | null): Observable<Hero> {
    const url = `${this.dbPath}/${key}`;
    return this.db.object<Hero>(url).valueChanges().pipe(
      map(hero => { if (hero) { return hero; } else {
        throw new Error(`Hero not found with id ${key}`);
      }
      }),
      tap((_) => this.log(this.translate.instant('messages.heroService.getHero') + ` ${key}`)),
      catchError(this.handleError<Hero>(`getHero id=${key}`))
    );
  }

  //////// Save methods //////////

  /** PUT: update the hero on the server */
  updateHero(key: string | null, hero: Hero): Promise<void> {
    const heroRef = this.db.object<Hero>(`heroes/${key}`);
    return heroRef.update(hero).then(() => {
      // log the success message
    this.log(this.translate.instant('messages.heroService.updateHero') + ` ${key}`)
        // handle any error
      }).catch(error => {
        catchError(this.handleError<any>('updateHero', error));
      });
  }


  /** POST: add a new hero to the server */
  addHero(hero: Hero): Promise<void> {
    return this.heroesRef.push(hero).then((ref) => {
      // Выводим сообщение об успешном добавлении
      this.log(
        `${this.translate.instant('messages.heroService.addHero')}
       id = ${ref.key},
       ${this.translate.instant('hero.field.name')} = ${hero.name}`)
    }).catch((error) => {
      // Обрабатываем ошибку добавления
      this.handleError<Hero>('addHero', error);
    })
  }

  /** DELETE: delete the hero from the server */
  deleteHero(key: string): Promise<void> {
    const heroRef = this.db.object<Hero>(`${this.dbPath}/${key}`);
    return heroRef.remove().then(() => {
      this.log(`${this.translate.instant('messages.heroService.deleteHero')} id:${key}`);
    }).catch((error) => {
      this.handleError<Hero>('deleteHero', error)
    });
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<any[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.heroesRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))),
      map(heroes => heroes.filter(hero => hero.name!.toLowerCase().includes(term.toLowerCase()))),
      tap((x) =>
        x.length
          ? this.log(`${this.translate.instant('messages.heroService.search.found')} "${term}"`)
          : this.log(`${this.translate.instant('messages.heroService.search.noFound')} "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
