import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { List, Card } from 'src/app/model/model';
import { BoardService } from 'src/app/service/board.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {

  @Input()
  list: List;

  public currentCard: Card;

  constructor(private service: BoardService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
  }

  deleteList() {
    this.service.removeList(this.list.title);
  }

  deleteCard(title: string) {
    this.service.deleteCard(title, this.list.title);
  }

  allowDrop(event) {
    event.preventDefault();
  }
  
  drop(event, el) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData("text"));
    if (this.list.title !== data.sourceListName) {
      this.list.cards = [...this.list.cards, data.card];
      document.getElementById(data.sourceListName).removeChild(document.getElementById(data.id));
    }
  }

  dropOnCard(event, title) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData("text"));
    if (this.list.title === data.sourceListName) {
      const cardNames = this.list.cards.map(list => list.title);
      const sourceIndex = cardNames.indexOf(data.card.title);
      const destinationIndex = cardNames.indexOf(title);
      this.list.cards.splice(sourceIndex, 1);
      this.list.cards.splice(destinationIndex, 0, data.card);
      this.service.updateList(this.list);
    }
  }
  
  drag(event, card: Card) {
    const data = {
      sourceListName: this.list.title,
      card,
      id: event.target.id
    }
    event.dataTransfer.setData("text", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  }

  preventDefault(event) {
    event.preventDefault();
  }
}
