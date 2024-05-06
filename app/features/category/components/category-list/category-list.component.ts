import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../../core/models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        this.cdr.detectChanges(); // Detect changes manually
      },
      (error: any) => {
        console.error('Error occurred while fetching categories:', error);
      }
    );
  }

  addNewCategory(): void {
    this.router.navigateByUrl('/dashboard/categories/new-category');
  }

  showCategoryDetails(categoryId: number): void {
    this.router.navigate(['/dashboard/categories/category-details', categoryId]);
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        () => {
          this.categories = this.categories.filter((category) => category.id !== categoryId);
          console.log('Category deleted successfully');
        },
        (error) => {
          console.log('Error deleting category with id ', categoryId);
        }
      );
    }
  }

  toggleCategoryStatus(category: Category): void {
    const originalStatus = category.status;
    category.status = !category.status;
    this.categoryService.toggleCategoryStatus(category.id).subscribe({
      next: (response) => {
        console.log('Toggle successful. Updated category:', response);
      },
      error: (err) => {
        console.log('Error toggling category status:', err);
        category.status = originalStatus;
        console.error('Error toggling category status:', err);
      },
    });
  }

  editCategory(category: Category): void {
    if (category) {
      this.router.navigate(['/dashboard/categories/new-category'], { queryParams: { categoryId: category.id } });
    } else {
      console.error('Category is undefined.');
    }
  }
}
