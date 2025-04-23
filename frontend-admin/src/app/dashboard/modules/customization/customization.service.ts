import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomizationService {

  constructor() { }


  getComponents() {
    return [
      {
        name: "Banner Hero",
      },
      {
        name: "Carrossel de Produtos",
      },
      {
        name: "Categorias",
      },
      {
        name: "Banner Promocional",
      },
      {
        name: "Newsletter",
      },
      {
        name: "Depoimentos",
      }
    ]
  }

}
