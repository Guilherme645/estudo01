import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { MessageService} from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/request/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions, elements } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{
[x: string]: any;
  private destroy$ = new Subject<void>();

  public productsList: Array<GetAllProductsResponse> =[];

public productsChartDatas!: ChartData;
public productsChartOptions!: ChartOptions;

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDtServices: ProductsDataTransferService
  ){}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
   this.getProductsDatas();
  }
  getProductsDatas(): void{
    this.productsService
    .getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) =>{
        if (response.length > 0){
          this.productsList = response;
this.productsDtServices.setProductsDatas(this.productsList) ;
this.setProductsChartConfig(); 
    }
      },
       error: (err) => {
        console.log(err);
        this.messageService.add({
          severity:'err',
          summary:'Erro',
          detail: 'ERRO ao buscar produtos!',
          life: 2500,
        });
      },
    });

  }

  setProductsChartConfig(): void{
    if(this.productsList.length > 0) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecundary = documentStyle.getPropertyValue(
      '--text-color-secundary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.productsChartDatas = {
      labels: this.productsList.map((element) => element?.name),
      datasets: [
        {
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo--400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo--500'),
          data: this.productsList.map((element) => element?.amount)
        }
      ]
    };

    this.productsChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels:{
            color: textColor,
          },
        },
      },
      scales: {
        x:{
          ticks:{
            color: textColorSecundary,
              font: {
                weight: 'bolder',
              },
          },
        grid:{
          color: surfaceBorder,
        },
        },
        y:{
          ticks:{
            color: textColorSecundary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
} 