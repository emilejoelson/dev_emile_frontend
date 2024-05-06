import { Injectable } from "@angular/core";
import { HttpService } from "../../../core/services/http.service";
import { Category } from "../models/category.model";

@Injectable()
export class CategoryService {

    constructor(private http: HttpService) { }

    getAllCategories() {
        return this.http.get('categories');
    }

    getCategoryById(categoryId: number) {
        return this.http.get(`categories/${categoryId}`);
    }

    createCategory(category: Category) {
        return this.http.post('categories', category);
    }

    updateCategory(categoryId: number, category: Category) {
        return this.http.put(`categories/${categoryId}`, category);
    }

    deleteCategory(categoryId: number) {
        return this.http.delete(`categories/${categoryId}`);
    }

    toggleCategoryStatus(categoryId: number) {
        return this.http.put(`categories/category-toggle/${categoryId}`, null);
    }
}
