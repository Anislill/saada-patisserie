import * as React from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';

// Customer Pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import MyOrdersPage from '@/pages/MyOrdersPage';
import WishlistPage from '@/pages/WishlistPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import FaqPage from '@/pages/FaqPage';
import LegalPage from '@/pages/LegalPage';
import PrivacyPage from '@/pages/PrivacyPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminPage from '@/pages/admin/AdminPage';

// Scroll restoration
import ScrollToTop from '@/components/ScrollToTop';

// Init i18n
import '@/lib/i18n';

const queryClient = new QueryClient();

/** Global Firebase auth listener — runs once for the whole app lifetime. */
function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const loadWishlistForUser = useWishlistStore((s) => s.loadForUser);
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Load or clear the wishlist for the current user (per-UID isolation)
      loadWishlistForUser(firebaseUser?.uid ?? null);

      // If session expires while on an admin page, redirect to login
      if (!firebaseUser && window.location.pathname.includes('/admin/')) {
        setLocation('/admin');
      }
    });
    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Customer Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/boutique" component={ShopPage} />
      <Route path="/boutique/:slug" component={ProductDetailPage} />
      <Route path="/panier" component={CartPage} />
      <Route path="/commande" component={CheckoutPage} />
      <Route path="/commande/confirmation" component={OrderConfirmationPage} />
      <Route path="/suivi-commande" component={OrderTrackingPage} />
      <Route path="/compte/commandes/:orderId" component={OrderDetailPage} />
      <Route path="/compte" component={AuthPage} />
      <Route path="/compte/profil" component={ProfilePage} />
      <Route path="/compte/commandes" component={MyOrdersPage} />
      <Route path="/compte/favoris" component={WishlistPage} />
      <Route path="/a-propos" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/mentions-legales" component={LegalPage} />
      <Route path="/politique-confidentialite" component={PrivacyPage} />

      {/* Admin Routes */}
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin/:rest*" component={AdminPage} />

      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AuthProvider>
          <ScrollToTop />
          <Router />
        </AuthProvider>
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
