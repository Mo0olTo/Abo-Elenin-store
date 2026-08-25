import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-store-layout',
  imports: [Footer, Navbar, RouterOutlet, Toast],
  templateUrl: './store-layout.html',
  styleUrl: './store-layout.scss',
})
export class StoreLayout {}

