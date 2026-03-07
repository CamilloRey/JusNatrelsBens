import { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { productService }    from '@/features/products/services/product.service';
import { reviewService }     from '@/features/reviews/services/review.service';
import { blogService }       from '@/features/blog/services/blog.service';
import { locationService }   from '@/features/locations/services/location.service';
import { messageService }    from '@/features/contact/services/message.service';
import { subscriberService } from '@/features/newsletter/services/subscriber.service';
import { dashboardService }  from '@/features/dashboard/services/dashboard.service';
import { authService }       from '@/features/auth/services/auth.service';

import type { Product }    from '@/features/products/types/product.types';
import type { Review }     from '@/features/reviews/types/review.types';
import type { BlogPost }   from '@/features/blog/types/blog.types';
import type { Location }   from '@/features/locations/types/location.types';
import type { Message }    from '@/features/contact/types/message.types';
import type { Subscriber } from '@/features/newsletter/types/subscriber.types';
import type { Activity, ActivityType } from '@/features/dashboard/types/dashboard.types';
import type { Settings }   from '@/features/auth/types/auth.types';

/* ─── Shape du contexte ─── */
interface DataContextValue {
  loaded:      boolean;
  products:    Product[];
  reviews:     Review[];
  blogs:       BlogPost[];
  locations:   Location[];
  subscribers: Subscriber[];
  messages:    Message[];
  activity:    Activity[];
  settings:    Settings;

  updateProducts:    (p: Product[])    => void;
  updateReviews:     (r: Review[])     => void;
  updateBlogs:       (b: BlogPost[])   => void;
  updateLocations:   (l: Location[])   => void;
  updateSubscribers: (s: Subscriber[]) => void;
  updateMessages:    (m: Message[])    => void;
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
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [activity,    setActivity]    = useState<Activity[]>([]);
  const [settings,    setSettings]    = useState<Settings>({} as Settings);

  /* ─── Chargement initial ─── */
  useEffect(() => {
    (async () => {
      const [p, r, b, l, s, m, ac, st] = await Promise.all([
        productService.getAll(),
        reviewService.getAll(),
        blogService.getAll(),
        locationService.getAll(),
        subscriberService.getAll(),
        messageService.getAll(),
        dashboardService.getActivity(),
        authService.getSettings(),
      ]);
      setProducts(p); setReviews(r); setBlogs(b); setLocations(l);
      setSubscribers(s); setMessages(m); setActivity(ac); setSettings(st);
      setLoaded(true);
    })();
  }, []);

  /* ─── Updaters (setState + sync Supabase) ─── */
  const updateProducts    = (p: Product[])    => { setProducts(p);    productService.save(p); };
  const updateReviews     = (r: Review[])     => { setReviews(r);     reviewService.save(r); };
  const updateBlogs       = (b: BlogPost[])   => { setBlogs(b);       blogService.save(b); };
  const updateLocations   = (l: Location[])   => { setLocations(l);   locationService.save(l); };
  const updateSubscribers = (s: Subscriber[]) => { setSubscribers(s); subscriberService.save(s); };
  const updateMessages    = (m: Message[])    => { setMessages(m);    messageService.save(m); };
  const updateSettings    = (s: Settings)     => { setSettings(s);    authService.saveSettings(s); };

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
      [JSON.stringify({ products, reviews, blogs, locations, subscribers, messages }, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bens-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const resetAll = () => {
    if (!confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) return;
    import('@/shared/constants/seed-data').then(({ SEED_PRODUCTS: P, SEED_REVIEWS: R, SEED_BLOGS: B, SEED_LOCATIONS: L, SEED_SUBSCRIBERS: S, SEED_MESSAGES: M, SEED_ACTIVITY: A, SEED_SETTINGS: ST }) => {
      updateProducts(P); updateReviews(R); updateBlogs(B); updateLocations(L);
      updateSubscribers(S); updateMessages(M); updateSettings(ST);
      setActivity(A); dashboardService.saveActivity(A);
    });
  };

  return (
    <DataContext.Provider value={{
      loaded, products, reviews, blogs, locations, subscribers, messages, activity, settings,
      updateProducts, updateReviews, updateBlogs, updateLocations,
      updateSubscribers, updateMessages, updateSettings, logActivity, exportData, resetAll,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé dans <DataProvider>');
  return ctx;
}
