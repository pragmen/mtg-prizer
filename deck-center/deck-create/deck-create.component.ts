import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Deck } from '../../model/deck';
import { DeckService } from '../deck.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-deck-create',
  templateUrl: './deck-create.component.html',
  styleUrls: []
})
export class DeckCreateComponent implements OnInit {

  private deckName: string = '';

  ngOnInit() {
  }

  constructor(private service: DeckService) {
  }

  create() {
    if (this.deckName.length < 1) {
      return;
    }

    this.service.createDeck(this.deckName);
  }
}
