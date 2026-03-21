import { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { productService }    from '@/features/products/services/product.service';
import { reviewService }     from '@/features/reviews/services/review.service';
import { blogService }       from '@/features/blog/services/blog.service';
import { locationService }   from '@/features/locations/services/location.service';
import { messageService }    from '@/features/contact/services/message.service';
import { subscriberService } from '@/features/newsletter/services/subscriber.service';
import { dashboardService }  from '@/features/dashboard/services/dashboard.service';
import { authService }       from '@/features/auth/services/auth.service';
import { eventService }      from '@/features/events/services/event.service';
import { stockService }      from '@/features/stock/services/stock.service';
import { financeService }    from '@/features/finance/services/finance.service';
import { ingredientService } from '@/features/ingredients/services/ingredient.service';
import { recipeService }     from '@/features/recipes/services/recipe.service';

import type { Product }    from '@/features/products/types/product.types';
import type { Review }     from '@/features/reviews/types/review.types';
import type { BlogPost }   from '@/features/blog/types/blog.types';
import type { Location }   from '@/features/locations/types/location.types';
import type { Message }    from '@/features/contact/types/message.types';
import type { Subscriber } from '@/features/newsletter/types/subscriber.types';
import type { Activity, ActivityType } from '@/features/dashboard/types/dashboard.types';
import type { Settings }   from '@/features/auth/types/auth.types';
import type { Event }         from '@/features/events/types/event.types';
import type { StockMovement } from '@/features/stock/types/stock.types';
import type { Transaction }   from '@/features/finance/types/finance.types';
import type { Ingredient } from '@/features/ingredients/types/ingredient.types';
import type { Recipe } from '@/features/recipes/types/recipe.types';
import { normalizeTextDeep } from '@/shared/utils/text-normalize';
import {
  SEED_ACTIVITY,
  SEED_BLOGS,
  SEED_INGREDIENTS,
  SEED_LOCATIONS,
  SEED_MESSAGES,
  SEED_PRODUCTS,
  SEED_REVIEWS,
  SEED_SETTINGS,
  SEED_SUBSCRIBERS,
} from '@/shared/constants/seed-data';

/* â”€â”€â”€ Shape du contexte â”€â”€â”€ */
interface DataContextValue {
  loaded:      boolean;
  products:    Product[];
  reviews:     Review[];
  blogs:       BlogPost[];
  locations:   Location[];
  ingredients: Ingredient[];
  recipes:     Recipe[];
  subscribers: Subscriber[];
  messages:    Message[];
  activity:    Activity[];
  settings:    Settings;

  updateProducts:    (p: Product[])    => void;
  updateReviews:     (r: Review[])     => void;
  updateBlogs:       (b: BlogPost[])   => void;
  updateLocations:   (l: Location[])   => void;
  updateIngredients: (i: Ingredient[]) => void;
  updateRecipes:     (r: Recipe[])     => void;
  updateSubscribers: (s: Subscriber[]) => void;
  updateMessages:    (m: Message[])    => void;
  events:         Event[];
  updateEvents:   (e: Event[]) => void;
  stock:          StockMovement[];
  updateStock:    (s: StockMovement[]) => void;
  finance:        Transaction[];
  updateFinance:  (t: Transaction[]) => void;
  updateSettings:    (s: Settings)     => void;
  logActivity:       (action: string, detail: string, type: ActivityType) => void;
  exportData:        () => void;
  resetAll:          () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loaded,      setLoaded]      = useState(false);
  const [products,    setProducts]    = useState<Product[]>([]);
  const [reviews,     setReviews]     = useState<Review[]>([]);
  const [blogs,       setBlogs]       = useState<BlogPost[]>([]);
  const [locations,   setLocations]   = useState<Location[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes,     setRecipes]     = useState<Recipe[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [events,      setEvents]      = useState<Event[]>([]);
  const [stock,       setStock]       = useState<StockMovement[]>([]);
  const [finance,     setFinance]     = useState<Transaction[]>([]);
  const [activity,    setActivity]    = useState<Activity[]>([]);
  const [settings,    setSettings]    = useState<Settings>({} as Settings);

  /* â”€â”€â”€ Chargement initial â”€â”€â”€ */
  useEffect(() => {
    (async () => {
      const [p, r, b, l, i, rec, s, m, ev, stk, fin, ac, st] = await Promise.all([
        productService.getAll(),
        reviewService.getAll(),
        blogService.getAll(),
        locationService.getAll(),
        ingredientService.getAll(),
        recipeService.getAll(),
        subscriberService.getAll(),
        messageService.getAll(),
        eventService.getAll(),
        stockService.getAll(),
        financeService.getAll(),
        dashboardService.getActivity(),
        authService.getSettings(),
      ]);
      setProducts(normalizeTextDeep(p));
      setReviews(normalizeTextDeep(r));
      setBlogs(normalizeTextDeep(b));
      setLocations(normalizeTextDeep(l));
      setIngredients(normalizeTextDeep(i));
      setRecipes(normalizeTextDeep(rec));
      setSubscribers(normalizeTextDeep(s));
      setMessages(normalizeTextDeep(m));
      setEvents(normalizeTextDeep(ev));
      setStock(normalizeTextDeep(stk));
      setFinance(normalizeTextDeep(fin));
      setActivity(normalizeTextDeep(ac));
      setSettings(normalizeTextDeep(st));
      setLoaded(true);
    })();
  }, []);

  /* â”€â”€â”€ Updaters (setState + sync Supabase) â”€â”€â”€ */
  const updateProducts    = (p: Product[])    => { setProducts(p);    productService.save(p); };
  const updateReviews     = (r: Review[])     => { setReviews(r);     reviewService.save(r); };
  const updateBlogs       = (b: BlogPost[])   => { setBlogs(b);       blogService.save(b); };
  const updateLocations   = (l: Location[])   => { setLocations(l);   locationService.save(l); };
  const updateIngredients = (i: Ingredient[]) => { setIngredients(i); ingredientService.save(i); };
  const updateRecipes     = (r: Recipe[])     => { setRecipes(r);     recipeService.save(r); };
  const updateSubscribers = (s: Subscriber[]) => { setSubscribers(s); subscriberService.save(s); };
  const updateMessages    = (m: Message[])    => { setMessages(m);    messageService.save(m); };
  const updateEvents      = (e: Event[])          => { setEvents(e);   eventService.save(e); };
  const updateStock       = (s: StockMovement[])  => { setStock(s);   stockService.save(s); };
  const updateFinance     = (t: Transaction[])    => { setFinance(t); financeService.save(t); };
  const updateSettings    = (s: Settings)         => { setSettings(s); authService.saveSettings(s); };

  const logActivity = useCallback((action: string, detail: string, type: ActivityType) => {
    setActivity(prev => {
      const newAct: Activity[] = [
        { id: 'a' + Date.now(), action, detail, date: new Date().toISOString(), type },
        ...prev,
      ].slice(0, 50);
      dashboardService.saveActivity(newAct);
      return newAct;
    });
  }, []);

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ products, reviews, blogs, locations, ingredients, subscribers, messages }, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bens-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const resetAll = () => {
    if (!confirm('RÃ©initialiser toutes les donnÃ©es ? Cette action est irrÃ©versible.')) return;
    updateProducts(SEED_PRODUCTS);
    updateReviews(SEED_REVIEWS);
    updateBlogs(SEED_BLOGS);
    updateLocations(SEED_LOCATIONS);
    updateIngredients(SEED_INGREDIENTS);
    updateSubscribers(SEED_SUBSCRIBERS);
    updateMessages(SEED_MESSAGES);
    updateSettings(SEED_SETTINGS);
    setActivity(SEED_ACTIVITY);
    dashboardService.saveActivity(SEED_ACTIVITY);
  };

  return (
    <DataContext.Provider value={{
      loaded, products, reviews, blogs, locations, ingredients, recipes, subscribers, messages, events, stock, finance, activity, settings,
      updateProducts, updateReviews, updateBlogs, updateLocations,
      updateIngredients, updateRecipes, updateSubscribers, updateMessages, updateEvents, updateStock, updateFinance, updateSettings, logActivity, exportData, resetAll,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit Ãªtre utilisÃ© dans <DataProvider>');
  return ctx;
}

