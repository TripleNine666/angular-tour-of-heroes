import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';
import {filter, from, Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import {TranslateService} from "@ngx-translate/core";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/compat/database';
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private dbPath = '/heroes';
  heroesRef: AngularFireList<Hero>;

  constructor(
    private messageService: MessageService,
    // private http: HttpClient,
    private translate: TranslateService,
    private db: AngularFireDatabase
  ) {
    this.heroesRef = db.list<Hero>(this.dbPath);

  }

  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  // };

  // private heroesUrl = 'api/heroes'; // URL to web api

  heroes: Hero[] = [];

  getHeroes(): Observable<Hero[]> {
    return this.heroesRef.valueChanges().pipe(
      tap((_) => this.log(this.translate.instant('messages.heroService.getHeroes'))),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // TODO: Нужно сделать чвтобы работал hero-detail
  getHero(id: number): Observable<Hero> {
    const url = `${this.dbPath}/${id}`;
    return this.db.object<Hero>(url).valueChanges().pipe(
      map(hero => { if (hero) { return hero; } else {
        throw new Error(`Hero not found with id ${id}`);
      }
      }),
      tap((_) => this.log(this.translate.instant('messages.heroService.getHero') + ` ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  getNewId(): Observable<number> {
    return this.getHeroes().pipe(
      map((heroes) => (this.heroes = heroes)),
      map(() => {
        return this.heroes.length > 0
          ? Math.max(...this.heroes.map((hero) => hero.id)) + 1
          : 1;
      })
    );
  }

  //////// Save methods //////////

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Promise<void> {
    const heroRef = this.db.object<Hero>(`heroes/${hero.id}`);

    return this.updateHeroObject(heroRef, hero).then(() => {
      // log the success message
    this.log(this.translate.instant('messages.heroService.updateHero') + ` ${hero.id}`)
        // handle any error
    }).catch(error => {
      catchError(this.handleError<any>('updateHero', error));
    });
  }

  // helper method to update the hero object in the database
  private updateHeroObject(heroRef: AngularFireObject<Hero>, hero: Hero): Promise<void> {
    return heroRef.update(hero);
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
  deleteHero(id: string): Promise<void> {
    const heroRef = this.db.object<Hero>(`${this.dbPath}/${id}`);
    return heroRef.remove().then(() => {
      this.log(`${this.translate.instant('messages.heroService.deleteHero')} id:${id}`);
    }).catch((error) => {
      this.handleError<Hero>('deleteHero', error)
    });
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.heroesRef.valueChanges().pipe(
      filter((heroes: Hero[]) => heroes.some((hero: Hero) => hero.name.includes(term))),
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
