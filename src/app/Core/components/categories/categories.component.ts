import { Component, OnInit, ViewChild } from '@angular/core';

import { Category, CategoryService } from '../../services/categories.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  categories: Category[] = [];
  selectedCategory: Category = { name: '', state: true, id: '' }; // Inicializa con valores predeterminados
  displayDialog: boolean = false;
  isEdit: boolean = false;

  constructor(private categoryService: CategoryService, private messageService: MessageService, private confirmacion: ConfirmationService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  openDialog(category?: Category): void {
    if (category) {
      this.selectedCategory = { ...category };
      this.isEdit = true;
    } else {
      this.selectedCategory = { name: '', state: true, id: '' }; // Inicializa un nuevo objeto para creación
      this.isEdit = false;
    }
    this.displayDialog = true;
  }

  saveCategory(): void {
    if (!this.selectedCategory.name || this.selectedCategory.name.trim() === '') {
      this.messageService.add({ severity: 'warn', summary: 'Validation Error', detail: 'Category name is required' });
      return;
    }

    if (this.isEdit) {
      this.categoryService.updateCategory(this.selectedCategory.id!, this.selectedCategory).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated' });
        this.loadCategories();
        this.displayDialog = false;
      });
    } else {
      this.categoryService.createCategory(this.selectedCategory).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created' });
        this.loadCategories();
        this.displayDialog = false;
      });
    }
  }

  deleteCategory(id: string, name: string): void {
    this.confirmacion.confirm({
      message: `<strong style="text-align: center;" >${name}</strong> `,
      header: 'Esta seguro de eliminar este registro? ',
      icon: 'fa-solid fa-trash',
      acceptButtonStyleClass: 'p-button-text p-button-text',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',

      accept: () => {
        this.categoryService.deleteCategory(id).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted' });
          this.loadCategories();
        });
      }
    })
  }

  onGlobalFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && this.dt) {
      this.dt.filterGlobal(inputElement.value, 'contains');
    }
  }
}
