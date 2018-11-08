import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { DeckService } from './deck.service';
import { Deck } from '../model/deck';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';

@Injectable()
export class DeckDetailResolverService implements Resolve<Deck> {

  constructor(private ds: DeckService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Deck> | Observable<never> {
    let id = route.paramMap.get('id');

    return this.ds.getDeck(id)
      .pipe(
      mergeMap(deck => {
        return deck;
      })
    );
  }
}
