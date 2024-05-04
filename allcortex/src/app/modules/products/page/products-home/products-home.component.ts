import { Component, OnDestroy, OnInit} from '@angular/core';
import { Router,} from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject,takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/request/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
private readonly destroy$: Subject<void> = new Subject();
public productsDatas: Array<GetAllProductsResponse> =[];

constructor(
  private ProductsService: ProductsService,
private ProductsDtServices: ProductsDataTransferService,
private router: Router,
private messageService: MessageService
){}
  ngOnInit(): void {
this.getServiceProductsDatas();
  }
  getServiceProductsDatas() {
const productsLoaded = this.ProductsDtServices.getProductsDatas();

if (productsLoaded.length > 0) {
this.productsDatas = productsLoaded;
} else this.getAPIProductsDatas();

 console.log ('DADOS DE PRODUTOS', this.productsDatas);
  }

  getAPIProductsDatas() {
    this.ProductsService
    .getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0) {
        this.productsDatas = response;

        console.log ('DADOS DE PRODUTOS', this.productsDatas);
      }
    },
    error: (err) => {
      console.log(err);
      this.messageService.add({
        severity: 'errosr',
        summary: 'Error',
        detail: 'Erro ao buscar produtos',
        life: 2500,
      })
      this.router.navigate(['/dashboard']);
    },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();       
    }
  }
