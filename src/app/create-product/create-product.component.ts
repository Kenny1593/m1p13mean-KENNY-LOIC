import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Navboutique } from '../navboutique/navboutique';
import { ProductBoutiqueService, Categorie } from './create-product.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Navboutique],
  templateUrl: './create-product.component.html',
  styleUrls: [],
})
export class CreateProductComponent implements OnInit {
  form!: FormGroup;
  categories: Categorie[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductBoutiqueService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  // ============================================
  // INIT FORMULAIRE
  // ============================================
  initForm(): void {
    this.form = this.fb.group({
      // Obligatoires
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      description: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(1000)],
      ],
      prix: [null, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      categorieId: ['', Validators.required],
      // Optionnels
      marque: [''],
      reference: [''],
      image: [null],
      // Visibilité
      publierSurLeWeb: [false],
      actif: [true],
      // Promotions
      enPromotion: [false],
      pourcentagePromo: [0, [Validators.min(0), Validators.max(100)]],
      remise: [0, [Validators.min(0), Validators.max(100)]],
    });

    // Logique promo/remise mutuellement exclusifs
    this.form.get('enPromotion')?.valueChanges.subscribe((enPromo: boolean) => {
      if (enPromo) {
        this.form.get('remise')?.setValue(0);
        this.form.get('remise')?.disable();
        this.form.get('pourcentagePromo')?.enable();
      } else {
        this.form.get('remise')?.enable();
        this.form.get('pourcentagePromo')?.setValue(0);
        this.form.get('pourcentagePromo')?.disable();
      }
    });

    // Init état initial : pas en promo → pourcentagePromo désactivé
    this.form.get('pourcentagePromo')?.disable();
  }

  // ============================================
  // CHARGEMENT CATÉGORIES
  // ============================================
  loadCategories(): void {
    this.loading = true;
    this.productService.getMyBoutique().subscribe({
      next: (res) => {
        this.categories = res.data.boutique.categories || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erreur chargement des catégories.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ============================================
  // IMAGE BASE64
  // ============================================
  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validation taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.error = 'Image trop lourde (max 2MB).';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.get('image')?.setValue(base64);
      this.imagePreview = base64;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.form.get('image')?.setValue(null);
    this.imagePreview = null;
  }

  // ============================================
  // HELPERS VALIDATION
  // ============================================
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  // ============================================
  // SOUMISSION
  // ============================================
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    const raw = this.form.getRawValue();

    const payload: any = {
      nom: raw.nom.trim(),
      description: raw.description.trim(),
      prix: raw.prix,
      quantite: raw.quantite,
      categorieId: raw.categorieId,
      publierSurLeWeb: raw.publierSurLeWeb,
      actif: raw.actif,
      enPromotion: raw.enPromotion,
      pourcentagePromo: raw.enPromotion ? raw.pourcentagePromo : 0,
      remise: raw.enPromotion ? 0 : raw.remise,
    };

    // Optionnels — n'envoie que si renseignés
    if (raw.marque?.trim()) payload.marque = raw.marque.trim();
    if (raw.reference?.trim()) payload.reference = raw.reference.trim();
    if (raw.image) payload.image = raw.image;


    this.productService.createProduct(payload).subscribe({
      next: (res) => {
        console.log('✅ Produit créé:', res);
        this.submitting = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('❌ Erreur complète:', err);
        this.submitting = false;
        this.error = err.error?.message || 'Erreur lors de la création du produit.';
        this.cdr.detectChanges();
      },
    });


  }

  resetForm(): void {
    this.form.reset({
      actif: true,
      publierSurLeWeb: false,
      enPromotion: false,
      pourcentagePromo: 0,
      remise: 0,
      quantite: 0,
    });
    this.imagePreview = null;
    this.error = null;
    this.form.get('pourcentagePromo')?.disable();
    this.form.get('remise')?.enable();
  }
}
