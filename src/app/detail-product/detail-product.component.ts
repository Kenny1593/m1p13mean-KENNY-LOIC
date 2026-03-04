import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Navboutique } from '../navboutique/navboutique';
import { ProductBoutiqueService, Categorie } from '../create-product/create-product.service';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Navboutique],
  templateUrl: './detail-product.component.html',
  styleUrls: [],
})
export class DetailProductComponent implements OnInit {
  form!: FormGroup;
  categories: Categorie[] = [];
  produitId: string = '';
  loading = false;
  submitting = false;
  error: string | null = null;
  success: string | null = null;
  imagePreview: string | null = null;

  // ✅ Mode lecture par défaut — édition déclenchée par l'utilisateur
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductBoutiqueService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.produitId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadData();
  }

  // ============================================
  // INIT FORMULAIRE (disabled par défaut)
  // ============================================
  initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      description: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(1000)],
      ],
      prix: [null, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      categorieId: ['', Validators.required],
      marque: [''],
      reference: [''],
      image: [null],
      publierSurLeWeb: [false],
      actif: [true],
      enPromotion: [false],
      pourcentagePromo: [0, [Validators.min(0), Validators.max(100)]],
      remise: [0, [Validators.min(0), Validators.max(100)]],
    });

    // Désactive tout en mode lecture
    this.form.disable();
  }

  // ============================================
  // CHARGEMENT PRODUIT + CATÉGORIES
  // ============================================
  loadData(): void {
    this.loading = true;

    // Charge catégories + produit en parallèle
    this.productService.getMyBoutique().subscribe({
      next: (res) => {
        this.categories = res.data.boutique.categories || [];
        this.loadProduct();
      },
      error: () => {
        this.error = 'Erreur chargement des catégories.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadProduct(): void {
    this.productService.getProductById(this.produitId).subscribe({
      next: (res) => {
        const p = res.data?.produit || res.data;
        this.fillForm(p);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Produit introuvable.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  fillForm(p: any): void {
    this.form.patchValue({
      nom: p.nom,
      description: p.description,
      prix: p.prix,
      quantite: p.quantite,
      categorieId: typeof p.categorieId === 'object' ? p.categorieId._id : p.categorieId,
      marque: p.marque || '',
      reference: p.reference || '',
      image: p.image || null,
      publierSurLeWeb: p.publierSurLeWeb,
      actif: p.actif,
      enPromotion: p.enPromotion,
      pourcentagePromo: p.pourcentagePromo,
      remise: p.remise,
    });

    if (p.image) this.imagePreview = p.image;

    // Reste disabled — editMode = false
    this.form.disable();
  }

  // ============================================
  // BASCULE MODE LECTURE ↔ ÉDITION
  // ============================================
  enableEdit(): void {
    this.editMode = true;
    this.success = null;
    this.error = null;
    this.form.enable();

    // Logique promo/remise
    this.applyPromoLogic();

    // Réabonne la logique promo après activation
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
  }

  cancelEdit(): void {
    this.editMode = false;
    this.error = null;
    this.loadProduct(); // Recharge les données originales
  }

  applyPromoLogic(): void {
    const enPromo = this.form.get('enPromotion')?.value;
    if (enPromo) {
      this.form.get('remise')?.disable();
      this.form.get('pourcentagePromo')?.enable();
    } else {
      this.form.get('remise')?.enable();
      this.form.get('pourcentagePromo')?.disable();
    }
  }

  // ============================================
  // IMAGE
  // ============================================
  onImageChange(event: Event): void {
    if (!this.editMode) return;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

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
    if (!this.editMode) return;
    this.form.get('image')?.setValue(null);
    this.imagePreview = null;
  }

  // ============================================
  // HELPERS
  // ============================================
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched && this.editMode);
  }

  getPrixFinal(): number {
    const prix = this.form.get('prix')?.value || 0;
    const enPromo = this.form.get('enPromotion')?.value;
    const promoPct = this.form.getRawValue().pourcentagePromo || 0;
    const remise = this.form.get('remise')?.value || 0;

    if (enPromo && promoPct > 0) return Math.round(prix * (1 - promoPct / 100) * 100) / 100;
    if (remise > 0) return Math.round(prix * (1 - remise / 100) * 100) / 100;
    return prix;
  }

  // ============================================
  // SOUMISSION
  // ============================================
  submit(): void {
    if (!this.editMode || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;
    this.success = null;

    const raw = this.form.getRawValue();

    // ✅ Ne construit que les champs modifiés — évite d'envoyer image: null
    const payload: any = {
      nom: raw.nom.trim(),
      description: raw.description.trim(),
      prix: raw.prix,
      quantite: raw.quantite,
      categorieId: typeof raw.categorieId === 'object' ? raw.categorieId._id : raw.categorieId,
      publierSurLeWeb: raw.publierSurLeWeb,
      actif: raw.actif,
      enPromotion: raw.enPromotion,
      pourcentagePromo: raw.enPromotion ? raw.pourcentagePromo : 0,
      remise: raw.enPromotion ? 0 : raw.remise,
    };

    // ✅ Optionnels — n'envoie QUE si renseignés et non null
    if (raw.marque?.trim()) payload.marque = raw.marque.trim();
    if (raw.reference?.trim()) payload.reference = raw.reference.trim();

    // ✅ Image — n'envoie QUE si c'est une vraie base64 (commence par data:image)
    if (raw.image && typeof raw.image === 'string' && raw.image.startsWith('data:image')) {
      payload.image = raw.image;
    }

    console.log('📦 Payload envoyé:', {
      ...payload,
      image: payload.image ? '(base64 présente)' : '(absente)',
    });

    this.productService.updateProduct(this.produitId, payload).subscribe({
      next: (res) => {
        console.log('✅ Update OK:', res);
        this.submitting = false;
        this.editMode = false;
        this.success = `Produit "${res.data?.produit?.nom}" mis à jour avec succès.`;
        this.form.disable();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur complète:', err);
        console.error('❌ Détails:', err.error?.details);
        this.submitting = false;
        this.error = err.error?.message || 'Erreur lors de la mise à jour.';
        this.cdr.detectChanges();
      },
    });
  }
}
