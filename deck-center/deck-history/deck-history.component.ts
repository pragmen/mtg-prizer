import { Component, OnInit } from '@angular/core';

import { Deck } from '../../model/deck';
import { DeckService } from '../deck.service';

import { Chart } from 'chart.js'
import { Card } from '../../model/card';

import * as $ from 'jquery';

@Component({
  selector: 'app-deck-history',
  templateUrl: './deck-history.component.html',
  styleUrls: []
})
export class DeckHistoryComponent implements OnInit {

  public selectedDeck: Deck;
  private allDatasets: any[] = [];
  private selectedDatasets: any[] = [];
  private chart: any;
  private config: any;

  ngOnInit() {
    this.service.selectedDeck.subscribe(x => {
      this.selectedDeck = x;
      this.getDeckHistory();
    });
  }

  constructor(private service: DeckService) {
  }

  checkAllDatasets() {

    var value = $("#checkAll:checked").val();    

    if (value == "on") {
      for (var i = 0; i < this.allDatasets.length; i++) {
        this.selectedDatasets.push(this.allDatasets[i]);
      }

      $(":checkbox").each(function () {
        if ($(this).attr("id") != "checkAll") {
          $(this).prop("checked", true);
        }
      });

    } else {
      this.selectedDatasets = [];
      this.config.data.datasets = this.selectedDatasets;
      $(":checkbox").each(function () {
        if ($(this).attr("id") != "checkAll") {
          $(this).prop("checked", false);
        }
      });
    }

    this.chart.update();
  }

  updateDataset(card: Card) {
    var value = $("#card_" + card.id + ":checked").val();
    if (value == "on") {

      var label = card.name + " (" + card.edition + ")";
      for (var i = 0; i < this.allDatasets.length; i++) {
        if (this.allDatasets[i].label == label) {
          this.selectedDatasets.push(this.allDatasets[i]);
        }
      }

    } else {

      var label = card.name + " (" + card.edition + ")";
      for (var i = 0; i < this.selectedDatasets.length; i++) {
        if (this.selectedDatasets[i].label == label) {
          this.selectedDatasets.splice(i, 1);
        }
      }
    }

    this.config.data.datasets = this.selectedDatasets;
    this.chart.update();
  }

  getDeckHistory() {
    this.service.getDeckHistory(this.selectedDeck.id).subscribe(x => {
      var canvas = document.getElementById('canvas');
      if (!canvas) {
        return;
      }

      let parts = x.split('#');
      let cardDates: string[] = [];

      let chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
      };

      let colorNames = Object.keys(chartColors);

      let datasets = [];

      for (var i = 0; i < parts.length; i++) {
        var cardParts = parts[i].split('|');

        var colorName = colorNames[datasets.length % colorNames.length];
        var newColor = chartColors[colorName];

        let prices = [];
        let item = { label: cardParts[1] + " (" + cardParts[2] + ")", data: prices, borderColor: newColor, backgroundColor: newColor, fill: false };

        for (var j = 0; j < cardParts.length - 1; j += 4) {

          if (cardDates.indexOf(cardParts[j + 4]) < 0) {
            cardDates.push(cardParts[j + 4]);
          }

          prices.push(parseInt(cardParts[j + 3]));
        }

        datasets.push(item);
      }

      for (var i = 0; i < datasets.length; i++) {
        this.allDatasets.push(datasets[i]);
        this.selectedDatasets.push(datasets[i]);
      }

      this.config = {
        type: 'line',
        data: {
          labels: cardDates,
          datasets: this.selectedDatasets
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          tooltips: {
            mode: 'point',
            intersect: true,
          }
        }
      };

      this.chart = new Chart(canvas, this.config);
    });
  }
}
