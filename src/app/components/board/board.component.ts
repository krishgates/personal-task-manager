import { Component, OnInit } from '@angular/core';
import { List, Board } from 'src/app/model/model';
import { BoardService } from 'src/app/service/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public board: Board;
  public listName: string;
  public boardName: string;
  public errorMessage: string;

  constructor(private service: BoardService) { }

  ngOnInit(): void {
    this.errorMessage = '';
    this.service.getBoard().subscribe(val => this.board = val || null);
  }

  createList() {
    if (!this.listName) {
      this.errorMessage = 'List name is required.';
      return;
    }
    if (this.checkDuplicateList(this.listName)) {
      this.errorMessage = 'List with same name already exists.';
      return;
    }
    const list = {
      title: this.listName,
      cards: []
    };
    this.service.addList(list);
    this.listName = '';
    this.errorMessage = '';
  }

  checkDuplicateList(listName: string) {
    const names = this.board.lists.map(l => String(l.title).toLowerCase());
    return names.indexOf(listName.toLowerCase()) > -1;
  }

  createBoard() {
    if (!this.boardName) {
      return;
    }
    this.service.createBoard(this.boardName);
  } 
}
