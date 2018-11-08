import { Component, OnInit, HostBinding, Inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';

import { Deck } from '../../model/deck';
import { DeckService } from '../deck.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Card } from '../../model/card';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css']
})
export class DeckDetailComponent implements OnInit {
  private deck: Deck;
  private editName: string;
  private httpClient: HttpClient;
  private baseUrl: string;

  constructor(private route: ActivatedRoute, private router: Router, private deckService: DeckService, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = baseUrl;
  }

  ngOnInit() {

    this.route.data
      .subscribe((data: { deck: Deck }) => {
        this.deck = data.deck;
        this.editName = data.deck.name;
      });
  }

  private ascendingPriceSort: boolean = true;
  sortByPrice() {
    if (this.ascendingPriceSort) {
      this.deck.cards.sort((a, b) => a.price - b.price);
    } else {
      this.deck.cards.sort((a, b) => b.price - a.price);
    }

    this.ascendingPriceSort = !this.ascendingPriceSort;
  }

  private ascendingNameSort: boolean = true;
  sortByName() {
    if (this.ascendingNameSort) {
      this.deck.cards.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    } else {
      this.deck.cards.sort((a, b) => (b.name > a.name) ? 1 : ((a.name > b.name) ? -1 : 0));
    }

    this.ascendingNameSort = !this.ascendingNameSort;
  }

  private ascendingEditionSort: boolean = true;
  sortByEdition() {
    if (this.ascendingEditionSort) {
      this.deck.cards.sort((a, b) => (a.edition > b.edition) ? 1 : ((b.edition > a.edition) ? -1 : 0));
    } else {
      this.deck.cards.sort((a, b) => (b.edition > a.edition) ? 1 : ((a.edition > b.edition) ? -1 : 0));
    }

    this.ascendingEditionSort = !this.ascendingEditionSort;
  }
  
  resetFilter(searchText: string) {
    searchText = '';
  }

  delete(card: Card) {
    var index = this.deck.cards.indexOf(card, 0);
    if (index > -1) {
      this.deck.cards.splice(index, 1);
    }

    this.httpClient.get(this.baseUrl + 'api/Database/DeleteCard', { params: new HttpParams().set('cardId', JSON.stringify(card.id)) }).subscribe(result => {
    },
      error => console.error(error));
  }

  goToDecks() {
    let deckId = this.deck ? this.deck.id : null;
    this.router.navigate(['../', { id: deckId }], { relativeTo: this.route });
  }
}
