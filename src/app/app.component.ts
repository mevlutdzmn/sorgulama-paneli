import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
}

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HttpClientModule, CommonModule, FormsModule],
})
export class AppComponent {
  allProducts: Product[] = []; // Tüm ürünler
  filteredProducts: Product[] = []; // Filtrelenmiş ürünler
  categories: string[] = []; // Kategoriler
  brands: string[] = []; // Markalar

  searchCriteria = {
    title: '',
    category: '',
    brand: '',
    priceMin: null as number | null,
    priceMax: null as number | null,
    ratingMin: null as number | null,
    ratingMax: null as number | null,
    inStockOnly: false
  };

  constructor(private http: HttpClient) {
    this.getData();
  }

  getData() {
    const url = `https://dummyjson.com/products`;

    this.http.get<any>(url).subscribe(
      data => {
        this.allProducts = data.products; // API'den gelen ürün verileri
        this.filteredProducts = this.allProducts; // Başlangıçta tüm ürünler

        //kategoriler ve markalar çıkarılıyor
        this.categories = [...new Set(this.allProducts.map(p => p.category))];
        this.brands = [...new Set(this.allProducts.map(p => p.brand))];
      },
      error => {
        console.error('API Error:', error); // Hata durumunu konsola yazdır
      }
    );
  }

  filterProducts() {
    this.filteredProducts = this.allProducts.filter((product: Product) => {
      const price = product.price;
      const rating = product.rating;

      return (
        (!this.searchCriteria.title || product.title.toLowerCase().includes(this.searchCriteria.title.toLowerCase())) &&
        (!this.searchCriteria.category || product.category === this.searchCriteria.category) &&
        (!this.searchCriteria.brand || product.brand === this.searchCriteria.brand) &&
        (!this.searchCriteria.priceMin || price >= this.searchCriteria.priceMin) &&
        (!this.searchCriteria.priceMax || price <= this.searchCriteria.priceMax) &&
        (!this.searchCriteria.ratingMin || rating >= this.searchCriteria.ratingMin) &&
        (!this.searchCriteria.ratingMax || rating <= this.searchCriteria.ratingMax) &&
        (!this.searchCriteria.inStockOnly || product.inStock)
      );
    });
  }
}
