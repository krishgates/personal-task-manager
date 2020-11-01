import { Injectable } from '@angular/core';
import { List, Board } from '../model/model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    private data: Board;

    private dataSubject: Subject<Board> = new Subject();

    constructor() { }

    getBoard() {
        return this.dataSubject.asObservable();
    }

    createBoard(title) {
        this.data = {
            title,
            lists: []
        };
        this.updateBoard(this.data);
    }

    addList(list: List) {
        this.data.lists = [...this.data.lists, list];
        this.updateBoard(this.data);
    }

    removeList(listName) {
        this.data.lists = this.data.lists.filter(l => l.title !== listName);
        this.updateBoard(this.data);
    }

    updateBoard(board) {
        this.dataSubject.next(board);
    }

    saveOrUpdate({isUpdate, card, listName}) {
        const { list, listIndex } = this.getListDetails(listName);
      if (isUpdate) {
        const titles = list.cards.map(c => c.title);
        const index = titles.indexOf(card.title);
        list.cards[index] = card;
      } else {
        list.cards = [card, ...list.cards];
      }
      this.data.lists[listIndex] = list;
      this.updateBoard(this.data);
    }

    private getListDetails(listName: any) {
        const list = this.data.lists.filter(l => l.title === listName)[0];
        const listIndex = this.data.lists.map(l => l.title).indexOf(list.title);
        return { list, listIndex };
    }

    deleteCard(cardTitle: string, listName: string) {
        const { list, listIndex } = this.getListDetails(listName);
        list.cards = list.cards.filter(l => l.title !== cardTitle);
        this.data.lists[listIndex] = list;
        this.updateBoard(this.data)
    }

    updateList(list: List) {
        const index = this.data.lists.map(l => l.title).indexOf(list.title);
        this.data[index] = list;
        this.updateBoard(this.data);
    }
}