import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../../core/models/category.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ValidationResponse } from '../../../../core/models/validation-response.model';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
})
export class NewCategoryComponent implements OnInit {
  @ViewChild('categoryForm') categoryForm!: NgForm;

  newCategory: Category = {
    id: 0,
    name: '',
    description: '',
    status: false,
  };

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.loadCategory(categoryId);
      }
    });
  }

  loadCategory(categoryId: number): void {
    this.categoryService.getCategoryById(categoryId).subscribe((category) => (this.newCategory = category));
  }

  returnToLogin(): void {
    this.router.navigateByUrl('/dashboard/categories');
  }

  addOrUpdateCategory(): void {
    if (this.categoryForm.invalid) {
      return; // Exit function if form is invalid
    }

    if (this.newCategory.id) {
      this.updateCategory(this.newCategory.id, this.newCategory);
    } else {
      this.addCategory();
    }
  }

  addCategory(): void {
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (createdCategory) => {
        console.log('Category added : ', createdCategory);
        this.resetForm();
        this.toastService.createToast('success', 'Category added successfully');
        this.router.navigateByUrl('/dashboard/categories');
      },
      error: (err) => {
        console.error('Error adding category: ', err);
        this.handleCategoryError(err);
      },
    });
  }

  updateCategory(categoryId: number, category: Category): void {
    this.categoryService.updateCategory(categoryId, category).subscribe({
      next: (updatedCategory) => {
        console.log('Category updated : ', updatedCategory);
        this.toastService.createToast('success', 'Category updated successfully');
        this.router.navigateByUrl('/dashboard/categories');
      },
      error: (err) => {
        console.error('Error updating category: ', err);
        this.handleCategoryError(err);
      },
    });
  }

  private handleCategoryError(err: any): void {
    if (err.status === 400 && Array.isArray(err.error)) {
      const validationErrors: ValidationResponse[] = err.error;
      validationErrors.forEach((error) => {
        this.toastService.createToast('error', error.message);
      });
    } else {
      this.toastService.createToast('error', 'Failed to add/update category. Please try again.');
    }
  }

  private resetForm(): void {
    this.newCategory = {
      id: 0,
      name: '',
      description: '',
      status: false,
    };
  }
}
