import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Card } from '../model/card';
import { DeckService } from '../deck-center/deck.service'
import { Deck } from '../model/deck';

@Component({
  selector: 'app-magic-search',
  templateUrl: './magic-search.component.html',
  styleUrls: ['./magic-search.component.css']
})
export class MagicSearchComponent implements OnInit {

  private cardName = '';
  private httpClient: HttpClient;
  private baseUrl: string;
  public cards: Card[];
  private statusText: string = '';
  public cardNameInputValue: string = '';

  public selectedDeck: Deck;

  searchForCard(value: string) {
    this.cardName = value;
    this.statusText = "Vyhledávám " + this.cardName + "...";
    this.httpClient.get<Card[]>(this.baseUrl + 'api/MagicCardSearch/FindCard', { params: new HttpParams().set('cardName', this.cardName) }).subscribe(result => {
      this.cards = result;
      this.statusText = "Nalezeno: " + this.cards.length;
    },
      error => console.error(error));
  }

  isAnyDeckActive() {
    return this.selectedDeck.id == "0";
  }

  addCardToDeck(card: Card) {
    this.deckService.addCardToDeck(card);
  }

  ngOnInit() {
    this.deckService.selectedDeck.subscribe(x => {
      this.selectedDeck = x;
    });
  }

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private deckService: DeckService) {
    this.httpClient = http;
    this.baseUrl = baseUrl;
  }
}
