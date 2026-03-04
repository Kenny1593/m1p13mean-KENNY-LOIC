import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navboutique } from '../navboutique/navboutique';
import { CreateOrderService, ProduitActif } from './create-order.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Navboutique],
  templateUrl: './create-order.component.html',
  styleUrls: [],
})
export class CreateOrderComponent implements OnInit {
  form!: FormGroup;
  produits: ProduitActif[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  orderResult: any = null;

  // Autocomplete : une liste filtrée + état ouvert par ligne
  searchTerms: string[] = [];
  dropdownOpen: boolean[] = [];
  filteredProduits: ProduitActif[][] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private orderService: CreateOrderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProduits();
  }

  // ============================================
  // INIT
  // ============================================
  initForm(): void {
    this.form = this.fb.group({
      nomClient: [''],
      paymentMethod: ['cash', Validators.required],
      globalDiscountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      items: this.fb.array([]),
    });
  }

  loadProduits(): void {
    this.loading = true;
    this.orderService.getProduitsActifs().subscribe({
      next: (res) => {
        this.produits = res.data.produits;
        this.loading = false;
        this.addItem();
        this.cdr.detectChanges(); // ✅ Force le re-rendu
        console.log('✅ Produits chargés:', this.produits.length);
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.error = err.error?.message || 'Erreur chargement produits.';
        this.loading = false;
        this.cdr.detectChanges(); // ✅ Idem
      },
    });
  }
  // ============================================
  // FORMARRAY
  // ============================================
  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        productId: ['', Validators.required],
        prix: [{ value: null, disabled: true }],
        stock: [{ value: null, disabled: true }],
        itemDiscountPercentage: [0, [Validators.min(0), Validators.max(100)]],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );

    // Init autocomplete pour cette ligne
    this.searchTerms.push('');
    this.dropdownOpen.push(false);
    this.filteredProduits.push([...this.produits]);
  }

  removeItem(i: number): void {
    if (this.items.length === 1) return;
    this.items.removeAt(i);
    this.searchTerms.splice(i, 1);
    this.dropdownOpen.splice(i, 1);
    this.filteredProduits.splice(i, 1);
  }

  // ============================================
  // AUTOCOMPLETE
  // ============================================
  onSearch(i: number, term: string): void {
    this.searchTerms[i] = term;
    this.dropdownOpen[i] = true;
    this.filteredProduits[i] = this.produits.filter(
      (p) =>
        p.nom.toLowerCase().includes(term.toLowerCase()) ||
        (p.reference && p.reference.toLowerCase().includes(term.toLowerCase()))
    );

    // Si le terme est vidé, reset le produit sélectionné
    if (!term.trim()) {
      this.items.at(i).patchValue({
        productId: '',
        prix: null,
        stock: null,
        itemDiscountPercentage: 0,
        quantity: 1,
      });
    }
  }

  selectProduit(i: number, produit: ProduitActif): void {
    const defaultDiscount = produit.enPromotion ? produit.pourcentagePromo : produit.remise;

    this.items.at(i).patchValue({
      productId: produit._id,
      prix: produit.prix,
      stock: produit.quantite,
      itemDiscountPercentage: defaultDiscount,
      quantity: 1,
    });

    this.searchTerms[i] = `${produit.nom}${produit.reference ? ' — ' + produit.reference : ''}`;
    this.dropdownOpen[i] = false;
  }

  closeDropdown(i: number): void {
    // Délai pour laisser le click sur l'option se déclencher
    setTimeout(() => {
      this.dropdownOpen[i] = false;
    }, 200);
  }

  getProduitById(id: string): ProduitActif | undefined {
    return this.produits.find((p) => p._id === id);
  }

  // ============================================
  // CALCULS TEMPS RÉEL
  // ============================================
  getItemSubtotal(i: number): number {
    const item = this.items.at(i);
    const produit = this.getProduitById(item.get('productId')?.value);
    if (!produit) return 0;

    const qty = item.get('quantity')?.value || 1;
    const discount = item.get('itemDiscountPercentage')?.value || 0;
    const total = produit.prix * qty;
    return Math.round((total - (total * discount) / 100) * 100) / 100;
  }

  getItemsSubtotal(): number {
    return (
      Math.round(
        this.items.controls.reduce((sum, _, i) => sum + this.getItemSubtotal(i), 0) * 100
      ) / 100
    );
  }

  getGlobalDiscountAmount(): number {
    const pct = this.form.get('globalDiscountPercentage')?.value || 0;
    return Math.round(((this.getItemsSubtotal() * pct) / 100) * 100) / 100;
  }

  getGrandTotal(): number {
    return Math.round((this.getItemsSubtotal() - this.getGlobalDiscountAmount()) * 100) / 100;
  }

  // ============================================
  // SOUMISSION
  // ============================================
  submitOrder(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const hasAllProducts = this.items.controls.every((item) => item.get('productId')?.value);
    if (!hasAllProducts) {
      this.error = 'Veuillez sélectionner un produit pour chaque ligne.';
      return;
    }

    this.submitting = true;
    this.error = null;

    const raw = this.form.getRawValue();

    const payload = {
      items: raw.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        itemDiscountPercentage: item.itemDiscountPercentage,
      })),
      paymentMethod: raw.paymentMethod,
      globalDiscountPercentage: raw.globalDiscountPercentage,
      nomClient: raw.nomClient?.trim() || '',
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        console.log('✅ Réponse:', res); // ← ajoute
        this.submitting = false;
        this.orderResult = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur complète:', err); // ← ajoute
        this.submitting = false;
        this.error = err.error?.message || 'Erreur lors de la création de la vente.';
        this.cdr.detectChanges();
      },
    });
  }

  resetForm(): void {
    this.orderResult = null;
    this.error = null;
    this.searchTerms = [];
    this.dropdownOpen = [];
    this.filteredProduits = [];
    this.form.reset({ paymentMethod: 'cash', globalDiscountPercentage: 0, nomClient: '' });
    this.items.clear();
    this.addItem();
  }
}
