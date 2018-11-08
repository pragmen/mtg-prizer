import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Deck } from '../model/deck';
import { Card } from '../model/card';
import { ResultMessage } from '../model/resultMessage';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DictDeckPriceHistory } from '../model/deckPriceHistory';

@Injectable()
export class DeckService {

  private httpClient: HttpClient;
  private baseUrl: string;

  private deck: Deck = new Deck();
  private selectedDeckSource: BehaviorSubject<Deck> = new BehaviorSubject<Deck>(this.deck);
  selectedDeck = this.selectedDeckSource.asObservable();

  private allDecksInit: Deck = new Deck();
  private allDecksSource: BehaviorSubject<Deck> = new BehaviorSubject<Deck>(this.allDecksInit);
  allDecks = this.allDecksSource.asObservable();

  _headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

  setSelectedDeck(deck: Deck) {
    this.selectedDeckSource.next(deck);
  }

  getDeckHistory(deckId: string) {
    return this.httpClient.get<string>(this.baseUrl + 'api/Database/GetDeckHistory', { params: new HttpParams().set('deckId', deckId) });
  }

  constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  getDecks(): Observable<Deck[]> {
    let decks = this.httpClient.get<Deck[]>(this.baseUrl + 'api/Database/GetDecks');
    return decks;
  }

  getDeck(id: string) {
    let aa = this.selectedDeckSource.getValue();
    if (aa.id == id) {
      let decks: Deck[] = [];
      decks.push(aa);
      return Observable.of(decks);
    }

    return this.getDecks().pipe(map(decks => decks.filter(deck => deck.id == id)));
  }

  deleteDeck(deckId: string) {
    this.httpClient.post<ResultMessage>(this.baseUrl + 'api/Database/DeleteDeck', JSON.stringify({ deckId: deckId }), { headers: this._headers })
      .subscribe(result => { });
  }

  addCardToDeck(card: Card) {
    this.selectedDeckSource.getValue().cards.push(card);

    this.httpClient.post<ResultMessage>(this.baseUrl + 'api/Database/AddCard', JSON.stringify({ deckId: this.selectedDeckSource.getValue().id, card: card }), { headers: this._headers })
      .subscribe(result => { });
  }

  createDeck(deckName: string) {

    deckName = deckName.trim();
    if (deckName) {
      var result = this.httpClient.post<ResultMessage>(this.baseUrl + 'api/Database/AddDeck', JSON.stringify({ name: deckName }), { headers: this._headers });
      result.subscribe(data => {
        let deck = new Deck();
        deck.id = data.Message;
        deck.name = deckName;
        deck.cards = [];

        this.allDecksSource.next(deck);
      });
    }
  }
}
