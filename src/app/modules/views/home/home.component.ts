import { Component, OnInit } from '@angular/core';
import {OffersService} from "../../services/offers.services";
import {Offer} from "../../models/offers";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  countOffers: number=0;
  offers: Offer[] = [] as Offer[];
  constructor(private offersService: OffersService) {

  }

  ngOnInit(): void {
    this.offersService.getAll().subscribe((response: any) => {
      this.offers=response;
    })
  }

  count():void {
    this.offersService.getAll().subscribe((response: any) => {
      this.countOffers=response.length;
    })
  }
}

