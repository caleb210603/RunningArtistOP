import {Component, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Offer} from "../../models/offers";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {OffersService} from "../../services/offers.services";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  //Controlador de Errores
  userFormGroup = new FormGroup({
    title: new FormControl('',[Validators.required,Validators.maxLength(60)]),
    description: new FormControl(''),
    points: new FormControl('',[Validators.required,Validators.max(100)]),
    business: new FormControl('')
  })

  isEditMode: boolean;
  offerData: Offer;
  dataSource: MatTableDataSource<Offer>; //Informacion de la tabla
  displayedColumns: string[] =['id', 'title', 'description', 'points', 'business', 'actions'];

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private offersService: OffersService) {
    this.offerData = {} as Offer;
    this.dataSource = new MatTableDataSource<Offer>();
    this.isEditMode = false;
  }

  ngOnInit(): void { //Cada vez que el programa se inicia
    this.dataSource.paginator=this.paginator;
    this.retrieveOffers();
  }

  ngAfterViewInit(){
    this.dataSource.sort=this.sort;
  }

  retrieveOffers(): void{
    this.offersService.getAll().subscribe((response: any)=>{
      this.dataSource.data=response;
    })
  }

  Edit(offer: Offer): void{
    this.isEditMode = true;
    this.offerData = offer;
    this.userFormGroup.setValue({
      title: this.offerData.title,
      description: this.offerData.description,
      points: this.offerData.points,
      business: this.offerData.business,
    })
  }

  Delete(offer: Offer): void{
    this.offersService.delete(offer.id).subscribe((response:any)=>{
      this.retrieveOffers();
    })
  }

  cancelEdit(): void{
    this.isEditMode=false;
    this.userFormGroup.setValue({
      title: '',
      description: '',
      points: '',
      business: ''
    })
    this.offerData = {} as Offer;
  }

  Update(): void{
    if(!this.userFormGroup.invalid){
      this.offerData.title=this.userFormGroup.get('title')?.value;
      this.offerData.description=this.userFormGroup.get('description')?.value;
      this.offerData.points=Number(this.userFormGroup.get('points')?.value);
      this.offerData.business=this.userFormGroup.get('business')?.value;
      this.offersService.update(this.offerData.id, this.offerData).subscribe((response: any)=>{
        this.retrieveOffers();
      })
      this.isEditMode=false;
      this.offerData={} as Offer;
      this.userFormGroup.setValue({
        title: '',
        description: '',
        points: '',
        business: ''
      })
    }

  }

  Add(): void{
    if(!this.userFormGroup.invalid){
      this.offerData.title=this.userFormGroup.get('title')?.value;
      this.offerData.description=this.userFormGroup.get('description')?.value;
      this.offerData.points=Number(this.userFormGroup.get('points')?.value);
      this.offerData.business=this.userFormGroup.get('business')?.value;
      this.offersService.create(this.offerData).subscribe((response:any)=>{
        this.retrieveOffers();
      })
      this.userFormGroup.setValue({
        title: '',
        description: '',
        points: '',
        business: ''
      })
    }

  }

}
