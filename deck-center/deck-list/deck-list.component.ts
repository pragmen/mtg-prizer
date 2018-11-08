import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Deck } from '../../model/deck';
import { DeckService } from '../deck.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.css']
})
export class DeckListComponent implements OnInit {
  public decks: Deck[] = [];

  private selectedDeck: Deck;
  private httpClient: HttpClient;
  private baseUrl: string;

  public updateStatusText: string;

  constructor(private deckService: DeckService, private route: Router, private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.deckService.getDecks()
      .subscribe(data => {
        this.decks = data;
      },
        error => { console.log(error); }
      );

    this.deckService.selectedDeck.subscribe(x => {
      this.selectedDeck = x;
    });

    this.deckService.allDecks.subscribe(x => {
      if (x.id != '0') {
        this.decks.push(x);
      }
    });
  }

  select(deck: Deck) {
    this.deckService.setSelectedDeck(deck);
  }

  delete(deck: Deck) {
    const index = this.decks.indexOf(deck, 0);
    if (index > -1) {
      this.decks.splice(index, 1);
    }

    this.deckService.deleteDeck(deck.id);
  }

  updatePrices(deck: Deck) {
    let _headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    this.updateStatusText = "Probíhá aktualizace";
    this.httpClient.post<Deck>(this.baseUrl + 'api/Database/UpdateDeckPrices', JSON.stringify({ deckId: deck.id }), { headers: _headers })
      .subscribe(
        result => {
          let currentDeck = this.decks.filter(x => x.id == deck.id)[0];

          const index = this.decks.indexOf(currentDeck, 0);
          if (index > -1) {
            this.decks.splice(index, 1, result);
          }

          this.updateStatusText = "";
        },
      error => {
        console.error(error);

        this.updateStatusText = "";
      }
      );
  }

  showDeck(deck: Deck) {
    this.route.navigate(['/deck-center', deck.id]);
  }
}
