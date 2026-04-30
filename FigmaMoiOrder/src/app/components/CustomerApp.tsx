import React, { useState } from 'react';
import { HomeDashboard } from './customer/HomeDashboard';
import { SearchScreen } from './customer/SearchScreen';
import { SearchResults } from './customer/SearchResults';
import { CartView } from './customer/CartView';
import { ProfileScreen } from './customer/ProfileScreen';
import { RestaurantView } from './customer/RestaurantView';
import { CheckoutView } from './customer/CheckoutView';
import { OrderTracking } from './customer/OrderTracking';
import { OrdersScreen } from './customer/OrdersScreen';
import { OrderReceipt } from './customer/OrderReceipt';
import { NotificationScreen } from './customer/NotificationScreen';
import { ReportsScreen } from './customer/ReportsScreen';
import { AccountSettings } from './customer/AccountSettings';
import { PaymentMethods } from './customer/PaymentMethods';
import { BottomNavigation } from './customer/BottomNavigation';
import { ServicesHome } from './customer/ServicesHome';
import { NinetyDaysReport } from './customer/NinetyDaysReport';
import { NinetyDaysNotifications } from './customer/NinetyDaysNotifications';
import { NinetyDaysSubmissionDetail } from './customer/NinetyDaysSubmissionDetail';
import { EmbassyLetter } from './customer/EmbassyLetter';
import { EmbassyLetterNotifications } from './customer/EmbassyLetterNotifications';
import { EmbassyLetterSubmissionDetail } from './customer/EmbassyLetterSubmissionDetail';
import { PlacesScreen } from './customer/PlacesScreen';
import { NewsScreen, getAllNewsArticles, NewsArticle } from './customer/NewsScreen';
import { PartnershipScreen, getAllPartners, PartnerService } from './customer/PartnershipScreen';
import { MainHome } from './customer/MainHome';
import { SupportScreen } from './customer/SupportScreen';
import { SavedAddresses } from './customer/SavedAddresses';
import { FavoriteRestaurantsView } from './customer/FavoriteRestaurantsView';
import { ExchangeService } from './customer/ExchangeService';
import { BookmarksScreen } from './customer/BookmarksScreen';
import { WorkPermitScreen, WorkPermitSubmission } from './customer/WorkPermitScreen';
import { WorkPermitNotifications } from './customer/WorkPermitNotifications';
import { WorkPermitSubmissionDetail } from './customer/WorkPermitSubmissionDetail';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Language, useTranslation } from '../utils/translations';

export type CustomerView = 
  | 'main-home'
  | 'food-home'
  | 'services-home'
  | 'home' 
  | 'search' 
  | 'search-results'
  | 'cart' 
  | 'profile' 
  | 'restaurant' 
  | 'checkout' 
  | 'tracking' 
  | 'orders'
  | 'order-receipt'
  | 'notifications'
  | 'settings'
  | 'saved-addresses'
  | 'favorite-restaurants'
  | 'payment-methods'
  | 'reports'
  | 'support'
  | '90-days-report'
  | '90-days-notifications'
  | '90-days-submission-detail'
  | 'embassy-letter'
  | 'embassy-letter-notifications'
  | 'embassy-letter-submission-detail'
  | 'places'
  | 'news'
  | 'partnership'
  | 'work-permit'
  | 'work-permit-notifications'
  | 'work-permit-submission-detail'
  | 'exchange-service'
  | 'bookmarks';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image?: string;
  description?: string;
  customizations?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  distance: string;
  isOpen: boolean;
  menu: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  allergens?: string[];
}

export interface Order {
  id: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on-way' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  orderTime: string;
  deliveryAddress: string;
  paymentMethod?: string;
  paymentProof?: string;
  note?: string;
  phoneNumber?: string;
}

interface CustomerAppProps {
  onBack: () => void;
  globalOrders: Order[];
  onNewOrder: (order: Order) => void;
  onNewWorkPermitSubmission: (submission: WorkPermitSubmission) => void;
}

export function CustomerApp({ onBack, globalOrders, onNewOrder, onNewWorkPermitSubmission }: CustomerAppProps) {
  const [currentView, setCurrentView] = useState<CustomerView>('main-home');
  const [navigationHistory, setNavigationHistory] = useState<CustomerView[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [orderRemark, setOrderRemark] = useState<string>('');
  const [savedNewsArticleIds, setSavedNewsArticleIds] = useState<Set<string>>(new Set());
  const [savedPartnerIds, setSavedPartnerIds] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState<Language>('my');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('');
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerService | null>(null);
  
  const t = useTranslation(language);

  // Calculate total cart items (quantity, not just types)
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Navigate to a new view and add current view to history
  const navigateToView = (view: CustomerView) => {
    if (currentView !== view) {
      setNavigationHistory(prev => [...prev, currentView]);
      setCurrentView(view);
    }
  };

  // Go back to previous view
  const goBack = () => {
    // Clear selected items when going back
    if (currentView === 'news') {
      setSelectedNewsArticle(null);
    }
    if (currentView === 'partnership') {
      setSelectedPartner(null);
    }
    
    if (navigationHistory.length > 0) {
      const previousView = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentView(previousView);
    } else {
      // If no history, go to main home
      setCurrentView('main-home');
    }
  };

  const handleLogout = () => {
    // Simply navigate back to role selection
    onBack();
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
      );
      
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === existingItem.id && 
          JSON.stringify(cartItem.customizations) === JSON.stringify(existingItem.customizations)
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prev, item];
    });
  };

  const updateCartItem = (itemId: string, customizations: string[] | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => 
        !(item.id === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations))
      ));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations)
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search-results');
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant');
  };

  const handlePlaceOrder = (order: Order) => {
    setCurrentOrder(order);
    onNewOrder(order); // Add to global orders
    clearCart();
    setCurrentView('tracking');
  };

  const toggleFavoriteRestaurant = (restaurant: Restaurant) => {
    setFavoriteRestaurants(prev => {
      const isFavorite = prev.some(r => r.id === restaurant.id);
      if (isFavorite) {
        return prev.filter(r => r.id !== restaurant.id);
      } else {
        return [...prev, restaurant];
      }
    });
  };

  const isFavoriteRestaurant = (restaurantId: string) => {
    return favoriteRestaurants.some(r => r.id === restaurantId);
  };

  const removeFavoriteRestaurant = (restaurantId: string) => {
    const restaurant = favoriteRestaurants.find(r => r.id === restaurantId);
    if (restaurant && window.confirm(`Remove ${restaurant.name} from favorites?`)) {
      setFavoriteRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    }
  };

  const toggleSavedNewsArticle = (articleId: string) => {
    setSavedNewsArticleIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const toggleSavedPartner = (partnerId: string) => {
    setSavedPartnerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partnerId)) {
        newSet.delete(partnerId);
      } else {
        newSet.add(partnerId);
      }
      return newSet;
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'main-home':
        return (
          <MainHome 
            onViewChange={navigateToView}
            cartItemCount={totalCartItems}
            t={t}
            onRestaurantSelect={handleRestaurantSelect}
          />
        );
      case 'food-home':
        return (
          <HomeDashboard 
            onSearch={handleSearch}
            onRestaurantSelect={handleRestaurantSelect}
            onViewChange={navigateToView}
          />
        );
      case 'services-home':
        return (
          <ServicesHome 
            onViewChange={navigateToView}
          />
        );
      case 'home':
        return (
          <HomeDashboard 
            onSearch={handleSearch}
            onRestaurantSelect={handleRestaurantSelect}
            onViewChange={navigateToView}
          />
        );
      case 'search':
        return (
          <SearchScreen 
            onSearch={handleSearch}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'search-results':
        return (
          <SearchResults 
            query={searchQuery}
            onRestaurantSelect={handleRestaurantSelect}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'cart':
        return (
          <CartView 
            cartItems={cartItems}
            onUpdateQuantity={(itemId, quantity) => {
              setCartItems(prev => prev.map(item => 
                item.id === itemId ? { ...item, quantity } : item
              ));
            }}
            onRemoveItem={(itemId) => {
              setCartItems(prev => prev.filter(item => item.id !== itemId));
            }}
            onNavigate={(screen) => {
              if (screen === 'checkout') setCurrentView('checkout');
              else if (screen === 'home') setCurrentView('home');
            }}
            t={t}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            onViewChange={navigateToView}
            onLogout={handleLogout}
            t={t}
            userProfile={null}
            onProfileUpdate={() => {}}
          />
        );
      case 'restaurant':
        return selectedRestaurant ? (
          <RestaurantView 
            restaurant={selectedRestaurant}
            onAddToCart={addToCart}
            onUpdateCartItem={updateCartItem}
            onBack={() => setCurrentView('home')}
            onNavigate={navigateToView}
            cartItems={cartItems}
            isFavorite={isFavoriteRestaurant(selectedRestaurant.id)}
            onToggleFavorite={() => toggleFavoriteRestaurant(selectedRestaurant)}
          />
        ) : null;
      case 'checkout':
        return (
          <CheckoutView 
            cartItems={cartItems}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={navigateToView}
          />
        );
      case 'tracking':
        // Find the live order from globalOrders to get real-time status updates
        const liveOrder = currentOrder ? globalOrders.find(o => o.id === currentOrder.id) : null;
        return liveOrder ? (
          <OrderTracking 
            order={liveOrder}
            onNavigate={navigateToView}
          />
        ) : (
          <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">No Active Orders</h2>
              <p className="text-muted-foreground mb-8">
                You don't have any active orders at the moment. Start browsing restaurants and place your first order!
              </p>
              <Button 
                onClick={() => setCurrentView('main-home')}
                className="bg-primary hover:bg-primary/90"
              >
                Browse Restaurants
              </Button>
            </div>
          </div>
        );
      case 'orders':
        return (
          <OrdersScreen 
            orders={globalOrders}
            onViewReceipt={(order) => {
              setSelectedOrderForReceipt(order);
              setCurrentView('order-receipt');
            }}
            onTrackOrder={(order) => {
              setCurrentOrder(order);
              setCurrentView('tracking');
            }}
            onNavigate={navigateToView}
          />
        );
      case 'order-receipt':
        return selectedOrderForReceipt ? (
          <OrderReceipt 
            order={selectedOrderForReceipt}
            onBack={goBack}
          />
        ) : null;
      case 'notifications':
        return (
          <NotificationScreen 
            onBack={goBack}
            t={t}
          />
        );
      case 'settings':
        return (
          <AccountSettings 
            onBack={goBack}
            language={language}
            onLanguageChange={setLanguage}
            t={t}
          />
        );
      case 'saved-addresses':
        return (
          <SavedAddresses 
            onBack={goBack}
          />
        );
      case 'favorite-restaurants':
        return (
          <FavoriteRestaurantsView 
            favoriteRestaurants={favoriteRestaurants}
            onRemoveFavorite={removeFavoriteRestaurant}
            onRestaurantSelect={handleRestaurantSelect}
            onBack={goBack}
          />
        );
      case 'payment-methods':
        return (
          <PaymentMethods 
            onBack={goBack}
          />
        );
      case 'reports':
        return (
          <ReportsScreen 
            onBack={goBack}
          />
        );
      case 'support':
        return (
          <SupportScreen 
            onBack={goBack}
          />
        );
      case '90-days-report':
        return (
          <NinetyDaysReport 
            onBack={goBack}
            language={language}
            onViewNotifications={() => navigateToView('90-days-notifications')}
          />
        );
      case '90-days-notifications':
        return (
          <NinetyDaysNotifications 
            onBack={goBack}
            language={language}
            onViewSubmission={(id) => {
              setSelectedSubmissionId(id);
              navigateToView('90-days-submission-detail');
            }}
          />
        );
      case '90-days-submission-detail':
        return (
          <NinetyDaysSubmissionDetail 
            submissionId={selectedSubmissionId}
            onBack={goBack}
            language={language}
          />
        );
      case 'embassy-letter':
        return (
          <EmbassyLetter 
            onBack={goBack}
            language={language}
            onViewNotifications={() => navigateToView('embassy-letter-notifications')}
          />
        );
      case 'embassy-letter-notifications':
        return (
          <EmbassyLetterNotifications 
            onBack={goBack}
            language={language}
            onViewSubmission={(id) => {
              setSelectedSubmissionId(id);
              navigateToView('embassy-letter-submission-detail');
            }}
          />
        );
      case 'embassy-letter-submission-detail':
        return (
          <EmbassyLetterSubmissionDetail 
            submissionId={selectedSubmissionId}
            onBack={goBack}
            language={language}
          />
        );
      case 'places':
        return (
          <PlacesScreen 
            onBack={goBack}
          />
        );
      case 'news':
        return (
          <NewsScreen 
            onBack={goBack}
            savedArticleIds={savedNewsArticleIds}
            onToggleSave={toggleSavedNewsArticle}
            initialArticle={selectedNewsArticle}
          />
        );
      case 'partnership':
        return (
          <PartnershipScreen 
            onBack={goBack}
            savedPartnerIds={savedPartnerIds}
            onToggleSavePartner={toggleSavedPartner}
            onNewsArticleClick={(article) => {
              setSelectedNewsArticle(article);
              setCurrentView('news');
            }}
            initialPartner={selectedPartner}
          />
        );
      case 'work-permit':
        return (
          <WorkPermitScreen 
            onBack={goBack}
            onSubmit={onNewWorkPermitSubmission}
            t={t}
            onViewNotifications={() => navigateToView('work-permit-notifications')}
          />
        );
      case 'work-permit-notifications':
        return (
          <WorkPermitNotifications 
            onBack={goBack}
            language={language}
            onViewSubmission={(id) => {
              setSelectedSubmissionId(id);
              navigateToView('work-permit-submission-detail');
            }}
          />
        );
      case 'work-permit-submission-detail':
        return (
          <WorkPermitSubmissionDetail 
            submissionId={selectedSubmissionId}
            onBack={goBack}
            language={language}
          />
        );
      case 'exchange-service':
        return (
          <ExchangeService 
            onBack={goBack}
          />
        );
      case 'bookmarks':
        const allArticles = getAllNewsArticles();
        const savedArticles = allArticles.filter(article => savedNewsArticleIds.has(article.id));
        const allPartners = getAllPartners();
        const savedPartners = allPartners.filter(partner => savedPartnerIds.has(partner.id));
        return (
          <BookmarksScreen 
            onBack={goBack}
            savedArticles={savedArticles}
            savedPartners={savedPartners}
            onRemoveSavedArticle={toggleSavedNewsArticle}
            onRemoveSavedPartner={toggleSavedPartner}
            onArticleClick={(article) => {
              setSelectedNewsArticle(article);
              navigateToView('news');
            }}
            onPartnerClick={(partner) => {
              setSelectedPartner(partner);
              navigateToView('partnership');
            }}
          />
        );
      default:
        return (
          <HomeDashboard 
            onSearch={handleSearch}
            onRestaurantSelect={handleRestaurantSelect}
            onViewChange={navigateToView}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-16">
        {renderCurrentView()}
      </div>
      <BottomNavigation 
        currentView={currentView}
        onViewChange={navigateToView}
        cartItemCount={totalCartItems}
        t={t}
      />
    </div>
  );
}