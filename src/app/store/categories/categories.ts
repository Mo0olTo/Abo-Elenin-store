import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { collections } from './models/collection.model';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  protected readonly collections = collections;

  protected isWide(index: number): boolean {
    return (index + 1) % 3 === 0;
  }
}
