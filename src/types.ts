export interface ExtraItem {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'geprek' | 'sides' | 'drinks' | 'package';
  isSpicy: boolean;
  spicyLevelCustomizable?: boolean;
  tags?: string[];
}

export interface CartItem {
  id: string; // unique cart item id (to support same item with different spice levels)
  menuItem: MenuItem;
  quantity: number;
  spicyLevel: number; // 0 to 10
  selectedExtras: ExtraItem[];
  notes?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  spicyLevel: number;
  orderedItem: string;
}

export interface AIRecommendationRequest {
  favoriteFoods: string;
  chiliTolerance: 'none' | 'low' | 'medium' | 'high' | 'expert';
  currentMood: string;
  preferences: string[];
}

export interface AIRecommendationResponse {
  recommendedMenuId: string;
  recommendedLevel: number;
  reasonIndonesian: string;
  chefTips: string;
}
