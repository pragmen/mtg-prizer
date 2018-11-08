import { Component, OnInit } from '@angular/core';
import { Deck } from '../../model/deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-deck-selected',
  templateUrl: './deck-selected.component.html',
  styleUrls: ['./deck-selected.component.css']
})
export class DeckSelectedComponent implements OnInit {

  public selectedDeck: Deck;

  constructor(private deckService: DeckService) {
  }

  ngOnInit() {
    this.deckService.selectedDeck.subscribe(x => {
      this.selectedDeck = x;
    });
  }

}
