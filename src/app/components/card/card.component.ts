import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Card, Comment, List } from 'src/app/model/model';
import { DatePipe } from '@angular/common';
import { BoardService } from 'src/app/service/board.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {

  @Input()
  public list: List;
  @Input()
  public card: Card;
  @Output()
  public saveUpdated = new EventEmitter<{isUpdate: boolean; card: Card;}>();

  public cardForm: FormGroup;
  public duplicateComment: boolean;
  public duplicateTitle: boolean;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private service: BoardService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    if (!this.cardForm) {
      this.cardForm = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        comment: [''],
        comments: [[]]
      });
    }
  }

  duplicate(comment: string) {
    const comments = this.cardForm.value.comments;
    const timestamp = this.datePipe.transform(new Date(), 'dd MMM yyyy HH:mm');
    if (comment) {
      return comments.filter(c => (c.comment === comment) && (c.timestamp === timestamp)).length > 0 ? true : null;
    }
    return false;
  }

  ngOnChanges() {
    this.createForm();
    this.cardForm.reset();
    if (this.card) {
      this.cardForm.patchValue({
        title: this.card.title || '',
        description: this.card.description || '',
        comment: '',
        comments: this.card.comments || []
      });
      this.cardForm.controls.title.disable();
    } else {
      this.cardForm.controls.title.enable();
    }
  }

  removeComment(comment: Comment) {
    const comments: Comment[] = this.cardForm.value.comments;
    this.cardForm.patchValue({
      comments: comments.filter(com => (com.comment !== comment.comment) && (com.timestamp !== comment.timestamp))
    });
  }

  addComment() {
    if (!this.cardForm.value.comment) {
      return;
    }
    this.duplicateComment = false;
    if (this.duplicate(this.cardForm.value.comment)) {
      this.duplicateComment = true;
      return;
    }
    const comment = {
      comment: this.cardForm.value.comment,
      timestamp: this.datePipe.transform(new Date(), 'dd MMM yyyy HH:mm')
    }
    const comments: Comment[] = this.cardForm.value.comments;
    this.cardForm.patchValue({
      comments: [comment, ...comments]
    });
  }

  getControl(name: string) {
    return this.cardForm.get(name);
  }

  checkDuplicate() {
    const titles = this.list.cards.map(c => String(c.title).toLowerCase());
    return titles.indexOf(String(this.cardForm.value.title).toLowerCase()) > -1;
  }

  saveUpdate() {
    if (this.cardForm.invalid) {
      return;
    }
    this.duplicateTitle = false;
    if (!this.card && this.checkDuplicate()) {
      this.duplicateTitle = true;
      return;
    }
    const formValue = this.cardForm.value;
    const newCard: Card = {
      title: this.card ? this.card.title : formValue.title,
      comments: formValue.comments,
      description: formValue.description
    };
    this.cardForm.reset();
    this.cardForm.patchValue({
      comments: []
    });
    const payload = {
      isUpdate: !!this.card,
      card: newCard,
      listName: this.list.title
    };
    this.service.saveOrUpdate(payload);
    this.saveUpdated.emit(payload);
  }

}
