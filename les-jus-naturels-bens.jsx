import { useState, useEffect, useCallback, useRef } from "react";
import { loadData, saveData, uploadImage } from "./src/lib/supabase.js";

/* ───────────────────────── ANIMATION CSS ───────────────────────── */
const animCSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

@keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes bounceIn { 0% { opacity:0; transform: scale(0.3); } 50% { opacity:1; transform: scale(1.05); } 70% { transform: scale(0.95); } 100% { transform: scale(1); } }
@keyframes typing { 0% { width: 0; } 100% { width: 100%; } }
@keyframes blink { 50% { opacity: 0; } }
@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes wave { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-15deg); } }

.anim-card:hover { transform: translateY(-6px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important; }
.anim-btn:hover { transform: scale(1.03); filter: brightness(1.08); }
.anim-btn:active { transform: scale(0.97); }
.anim-link:hover { color: #c44536 !important; }
.chat-bubble { animation: bounceIn 0.4s ease; }
`;

/* ───────────────────────── SCROLL ANIMATION HOOK ───────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, anim = "fadeUp", style = {} }) {
  const [ref, visible] = useInView();
  const anims = { fadeUp: "fadeUp 0.7s ease forwards", fadeIn: "fadeIn 0.6s ease forwards", slideLeft: "slideLeft 0.7s ease forwards", slideRight: "slideRight 0.7s ease forwards", scaleIn: "scaleIn 0.6s ease forwards" };
  return (
    <div ref={ref} style={{ opacity: 0, animation: visible ? anims[anim] : "none", animationDelay: `${delay}s`, animationFillMode: "forwards", ...style }}>
      {children}
    </div>
  );
}

/* ───────────────────────── CHATBOT DATA ───────────────────────── */
const CHAT_RESPONSES = [
  { keywords: ["bonjour", "salut", "hello", "hi", "allô", "allo"], response: "Bonjour ! 👋 Bienvenue chez Les Jus Naturels Ben's ! Comment puis-je vous aider ?" },
  { keywords: ["prix", "coût", "combien", "tarif", "cher"], response: "Nos jus sont entre 7,99$ et 10,99$ selon le format. Nous offrons des bouteilles de 250ml, 354ml et 1L. Un excellent rapport qualité-prix pour du jus artisanal 100% naturel ! 🍹" },
  { keywords: ["acheter", "où", "trouver", "magasin", "point de vente", "vente"], response: "Vous pouvez trouver nos jus au Marché Jean-Talon, au Marché Atwater et dans plusieurs épiceries à Montréal. Consultez notre page 'Où Acheter' pour la liste complète ! 📍" },
  { keywords: ["livraison", "livrer", "expédier", "envoyer", "commander"], response: "Pour le moment, nos jus sont disponibles uniquement dans nos points de vente physiques à Montréal. Nous travaillons sur la livraison à domicile ! 🚚" },
  { keywords: ["sucre", "sans sucre", "diabète", "santé", "naturel", "bio"], response: "Plusieurs de nos jus sont disponibles SANS sucre ajouté ! Ils sont 100% naturels, sans conservateurs et sans additifs. Parfaits pour une alimentation saine. 🌿" },
  { keywords: ["hibiscus", "bissap", "fleur"], response: "Notre jus d'hibiscus est une recette traditionnelle africaine ! Riche en antioxydants et en vitamine C, il aide à réguler la pression artérielle. Disponible nature, avec gingembre ou avec fraises. 🌺" },
  { keywords: ["gingembre", "ginger"], response: "Le gingembre est un super-aliment ! Notre jus de gingembre aide à la digestion, renforce l'immunité et possède des propriétés anti-inflammatoires. Disponible avec citron (sucré ou sans sucre). 🫚" },
  { keywords: ["ananas", "tropical"], response: "Notre jus d'ananas est une explosion tropicale ! Riche en bromélaïne, il aide à la digestion. Disponible nature, sucré ou en mélange passion. 🍍" },
  { keywords: ["contact", "joindre", "email", "courriel", "téléphone"], response: "Vous pouvez nous contacter par courriel à info@lesjusnaturelsbens.com ou via WhatsApp. Nous répondons rapidement ! 📧" },
  { keywords: ["histoire", "fondatrice", "qui", "entreprise"], response: "Les Jus Naturels Ben's, c'est l'histoire d'une femme qui a apporté les recettes de sa famille du Cameroun au Québec. Visitez notre page 'Notre Histoire' pour en savoir plus ! ❤️" },
  { keywords: ["merci", "super", "génial", "excellent", "parfait"], response: "Merci beaucoup ! N'hésitez pas si vous avez d'autres questions. Bonne dégustation ! 🙏🍹" },
];

/* ───────────────────────── DATA SEED ───────────────────────── */
const SEED_PRODUCTS = [
  { id: "p1", name: "Hibiscus Gingembre", category: "Tisanes", price: 8.99, formats: ["250ml", "354ml", "1L"], desc: "Alliance exquise de l'hibiscus et du gingembre piquant.", available: true, tag: "Populaire", img: "🌺", color: "#1B4332" },
  { id: "p2", name: "Hibiscus Fraises", category: "Jus", price: 9.49, formats: ["250ml", "1L"], desc: "Fusion rafraîchissante de fleurs d'hibiscus et fraises fraîches.", available: true, tag: "Nouveau", img: "🍓", color: "#1B4332" },
  { id: "p3", name: "Hibiscus Fraises Sans Sucre", category: "Jus", price: 9.49, formats: ["250ml", "354ml", "1L"], desc: "Toute la saveur sans sucre ajouté.", available: true, tag: "", img: "🍓", color: "#52796F" },
  { id: "p4", name: "Gingembre Citron Sucré", category: "Jus", price: 7.99, formats: ["250ml", "1L"], desc: "Piquant et acidulé, parfait pour chaque moment.", available: true, tag: "", img: "🍋", color: "#C9A84C" },
  { id: "p5", name: "Gingembre Citron Sans Sucre", category: "Jus", price: 7.99, formats: ["250ml", "1L"], desc: "Bienfaits du gingembre et citron, zéro sucre ajouté.", available: true, tag: "Populaire", img: "🍋", color: "#C9A84C" },
  { id: "p6", name: "Jus d'Ananas", category: "Jus", price: 8.49, formats: ["250ml", "354ml", "1L"], desc: "Explosion tropicale de saveur d'ananas frais.", available: true, tag: "", img: "🍍", color: "#C9A84C" },
  { id: "p7", name: "Ananas Sucré", category: "Jus", price: 8.49, formats: ["250ml", "1L"], desc: "La douceur tropicale de l'ananas.", available: true, tag: "", img: "🍍", color: "#C9A84C" },
  { id: "p8", name: "Ananas Passion", category: "Jus", price: 9.99, formats: ["250ml", "354ml", "1L"], desc: "Mélange exotique ananas et fruit de la passion.", available: true, tag: "Nouveau", img: "🥭", color: "#C9A84C" },
  { id: "p9", name: "Jus de Bleuets", category: "Jus", price: 10.99, formats: ["1L"], desc: "Source de fibres, riche en vitamine C et antioxydants.", available: true, tag: "", img: "🫐", color: "#52796F" },
  { id: "p10", name: "Jus de Fraises", category: "Jus", price: 8.99, formats: ["250ml", "1L"], desc: "Délicieux jus de fraises fraîches du Québec.", available: true, tag: "", img: "🍓", color: "#1B4332" },
  { id: "p11", name: "Gingembre Bio", category: "Tisanes", price: 9.99, formats: ["1L"], desc: "Source de potassium, propriétés antibactériennes et antivirales.", available: true, tag: "Populaire", img: "🫚", color: "#C9A84C" },
];

const SEED_REVIEWS = [
  { id: "r1", name: "Clarice Turner", text: "J'adore absolument ces jus ! Le jus d'hibiscus est mon préféré – rafraîchissant et délicieux.", rating: 5, approved: true, date: "2024-11-15" },
  { id: "r2", name: "Brian Moten", text: "Le jus d'ananas a le goût du fruit frais. Sans sucre ajouté ni conservateurs. Un vrai régal !", rating: 5, approved: true, date: "2024-12-03" },
  { id: "r3", name: "Jeanne Tremblay", text: "Je bois 1 litre de tisane d'hibiscus à tous les jours. Elle m'apaise beaucoup !", rating: 5, approved: true, date: "2025-01-10" },
  { id: "r4", name: "Marc Dubois", text: "Le gingembre citron est incroyable. Parfait pour l'hiver québécois.", rating: 4, approved: false, date: "2025-02-20" },
];

const SEED_BLOGS = [
  { id: "b1", title: "Les bienfaits de l'hibiscus pour la santé", category: "Santé", content: "L'hibiscus est reconnu pour ses propriétés antioxydantes exceptionnelles. Riche en vitamine C, cette fleur aide à renforcer le système immunitaire et à réguler la pression artérielle.", published: true, date: "2025-01-15" },
  { id: "b2", title: "Comment préparons-nous nos jus artisanaux", category: "Recettes", content: "Nos jus sont préparés selon des méthodes artisanales qui préservent la fraîcheur, la saveur et l'intégrité nutritionnelle des ingrédients. Chaque fruit est soigneusement sélectionné à maturité.", published: true, date: "2025-02-01" },
  { id: "b3", title: "Le gingembre : un allié santé au quotidien", category: "Santé", content: "Le gingembre possède des propriétés antibactériennes, antivirales et antifongiques. Idéal pour lutter contre les infections respiratoires.", published: false, date: "2025-03-01" },
];

const SEED_LOCATIONS = [
  { id: "l1", name: "Marché Jean-Talon", address: "7070 Henri Julien, Montréal", type: "Marché", active: true },
  { id: "l2", name: "Épicerie Afro-Antillaise", address: "3456 Boul. Décarie, Montréal", type: "Épicerie", active: true },
  { id: "l3", name: "Marché Atwater", address: "138 Atwater, Montréal", type: "Marché", active: true },
];

const SEED_SUBSCRIBERS = [
  { id: "s1", email: "marie@example.com", date: "2025-01-10", active: true },
  { id: "s2", email: "pierre@example.com", date: "2025-01-22", active: true },
  { id: "s3", email: "sophie@example.com", date: "2025-02-05", active: true },
  { id: "s4", email: "jean@example.com", date: "2025-02-14", active: false },
  { id: "s5", email: "amelie@example.com", date: "2025-03-01", active: true },
];

const SEED_SETTINGS = {
  businessName: "Les Jus Naturels Ben's",
  email: "info@lesjusnaturelsbens.com",
  phone: "(514) 555-0123",
  address: "Montréal, Québec, Canada",
  description: "Des jus naturels et exotiques faits maison, inspirés des traditions Africaines.",
  facebook: "https://facebook.com/lesjusnaturelsbens",
  instagram: "https://instagram.com/lesjusnaturelsbens",
  tiktok: "",
  website: "https://lesjusnaturelsbens.com",
  password: "bens2025",
  heroTitle: "Savourez le plaisir des jus naturels",
  heroSubtitle: "Bienvenue dans l'univers des boissons naturelles inspirées des traditions Africaines.",
  currency: "CAD",
  taxRate: 14.975,
  deliveryNote: "Livraison disponible dans la grande région de Montréal.",
};

const SEED_ACTIVITY = [
  { id: "a1", action: "Connexion admin", detail: "Première connexion au panneau", date: "2025-03-01T10:00:00", type: "auth" },
  { id: "a2", action: "Produit ajouté", detail: "Ananas Passion ajouté au catalogue", date: "2025-03-02T14:30:00", type: "product" },
  { id: "a3", action: "Avis approuvé", detail: "Avis de Jeanne Tremblay approuvé", date: "2025-03-03T09:15:00", type: "review" },
  { id: "a4", action: "Article publié", detail: "Le gingembre : un allié santé au quotidien", date: "2025-03-04T16:45:00", type: "blog" },
  { id: "a5", action: "Point de vente ajouté", detail: "Marché Atwater ajouté", date: "2025-03-05T11:20:00", type: "location" },
];

const SEED_MESSAGES = [
  { id: "m1", name: "Marie Lavoie", email: "marie.lavoie@gmail.com", message: "Bonjour, où puis-je acheter vos jus dans le quartier Rosemont ?", read: false, responded: false, date: "2025-03-04T09:30:00" },
  { id: "m2", name: "Paul Tremblay", email: "paul.t@hotmail.com", message: "J'aimerais savoir si vous faites des collaborations avec des restaurants. Nous avons un petit bistro sur le Plateau.", read: false, responded: false, date: "2025-03-05T14:15:00" },
  { id: "m3", name: "Nadia Benali", email: "nadia.b@outlook.com", message: "Avez-vous du jus de gingembre sans sucre en format 1L ? Je n'en trouve plus au Marché Jean-Talon.", read: false, responded: false, date: "2025-03-06T08:45:00" },
  { id: "m4", name: "Sophie Martin", email: "sophie.martin@yahoo.com", message: "Vos jus sont excellents ! Est-ce que vous livrez à Laval ?", read: true, responded: true, date: "2025-02-28T16:20:00" },
];

/* ───────────────────────── STYLES ───────────────────────── */
const fonts = animCSS;

const CSS = {
  root: { fontFamily: "'DM Sans', sans-serif", margin: 0, padding: 0, minHeight: "100vh", color: "#1a1a1a", background: "#F9F6F0" },
  heading: { fontFamily: "'Playfair Display', serif" },
};

const C = {
  green: '#1B4332',
  gold: '#C9A84C',
  cream: '#F9F6F0',
  dark: '#1a0f0a',
  text: '#2d1f15',
  muted: '#6c757d',
  light: '#F9F6F0', // Using cream for light sections too
  border: 'rgba(27, 67, 50, 0.1)', // Subtle green border
};

/* ───────────────────────── STORAGE HELPERS ───────────────────────── */
// loadData et saveData sont importés depuis src/lib/supabase.js

/* ───────────────────────── ICONS ───────────────────────── */
const Icon = ({ type, size = 20, color = "currentColor" }) => {
  const s = { width: size, height: size, fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    home: <><path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    chart: <><path d="M3 20h18"/><rect x="5" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="4" width="3" height="16" rx="1"/><rect x="16" y="8" width="3" height="12" rx="1"/></>,
    map: <><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></>,
    star: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></>,
    back: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    shop: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[type]}</svg>;
};

/* ───────────────────────── PRODUCT IMAGE HELPER ───────────────────────── */
/**
 * Affiche une vraie photo si `src` est une URL, sinon l'emoji.
 */
function ProductImg({ src, size = 60, borderRadius = 10, style = {} }) {
  const isUrl = src && (src.startsWith("http") || src.startsWith("/") || src.startsWith("data:"));
  if (isUrl) {
    return (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size, objectFit: "cover", borderRadius, flexShrink: 0, ...style }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.55, lineHeight: 1, ...style }}>{src || "🍹"}</span>;
}

/* ───────────────────────── MAIN APP ───────────────────────── */
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPage, setAdminPage] = useState("dashboard");
  const [publicPage, setPublicPage] = useState("home");
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [blogs, setBlogs] = useState(SEED_BLOGS);
  const [locations, setLocations] = useState(SEED_LOCATIONS);
  const [subscribers, setSubscribers] = useState(SEED_SUBSCRIBERS);
  const [settings, setSettings] = useState(SEED_SETTINGS);
  const [activity, setActivity] = useState(SEED_ACTIVITY);
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [loaded, setLoaded] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [loginPass, setLoginPass] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [adminSidebar, setAdminSidebar] = useState(true);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await loadData("bens-products", SEED_PRODUCTS);
      const r = await loadData("bens-reviews", SEED_REVIEWS);
      const b = await loadData("bens-blogs", SEED_BLOGS);
      const l = await loadData("bens-locations", SEED_LOCATIONS);
      const s = await loadData("bens-subscribers", SEED_SUBSCRIBERS);
      const st = await loadData("bens-settings", SEED_SETTINGS);
      const ac = await loadData("bens-activity", SEED_ACTIVITY);
      const ms = await loadData("bens-messages", SEED_MESSAGES);
      setProducts(p); setReviews(r); setBlogs(b); setLocations(l); setSubscribers(s); setSettings(st); setActivity(ac); setMessages(ms);
      setLoaded(true);
    })();
  }, []);

  const save = useCallback((key, data) => saveData(key, data), []);
  const updateProducts = (p) => { setProducts(p); save("bens-products", p); };
  const updateReviews = (r) => { setReviews(r); save("bens-reviews", r); };
  const updateBlogs = (b) => { setBlogs(b); save("bens-blogs", b); };
  const updateLocations = (l) => { setLocations(l); save("bens-locations", l); };
  const updateSubscribers = (s) => { setSubscribers(s); save("bens-subscribers", s); };
  const updateSettings = (s) => { setSettings(s); save("bens-settings", s); };
  const updateActivity = (a) => { setActivity(a); save("bens-activity", a); };
  const updateMessages = (m) => { setMessages(m); save("bens-messages", m); };
  const logActivity = useCallback((action, detail, type) => {
    setActivity(prev => {
      const newAct = [{ id: "a" + Date.now(), action, detail, date: new Date().toISOString(), type }, ...prev].slice(0, 50);
      saveData("bens-activity", newAct);
      return newAct;
    });
  }, []);

  if (!loaded) return (
    <div style={{ ...CSS.root, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <style>{fonts}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍹</div>
        <div style={{ ...CSS.heading, fontSize: 20, color: C.green }}>Chargement...</div>
      </div>
    </div>
  );

  /* ─── ADMIN LOGIN ─── */
  const tryLogin = () => {
    if (loginPass === settings.password) {
      setAdminAuth(true); setLoginError(false);
      logActivity("Connexion", "Connexion au panneau admin", "auth");
    } else {
      setLoginError(true);
      logActivity("Tentative échouée", "Tentative de connexion avec mauvais mot de passe", "auth");
    }
  };

  if (isAdmin && !adminAuth) return (
    <div style={{ ...CSS.root, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: `linear-gradient(135deg, ${C.dark} 0%, #2d1117 100%)` }}>
      <style>{fonts}</style>
      <div style={{ background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 20, padding: "48px 40px", maxWidth: 380, width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
        <h2 style={{ ...CSS.heading, color: "#f0e6d3", fontSize: 24, margin: "0 0 8px" }}>Panneau Admin</h2>
        <p style={{ color: "#8a7968", fontSize: 14, marginBottom: 24 }}>Les Jus Naturels Ben's</p>
        {loginError && (
          <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#fca5a5", margin: 0 }}>Mot de passe incorrect.</p>
          </div>
        )}
        <input
          type="password" placeholder="Mot de passe" value={loginPass}
          onChange={e => { setLoginPass(e.target.value); setLoginError(false); }}
          onKeyDown={e => e.key === "Enter" && tryLogin()}
          style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: loginError ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#f0e6d3", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
        />
        <button onClick={tryLogin}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: C.gold, color: C.dark, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          Connexion
        </button>
        <p style={{ color: "#6b5e52", fontSize: 12, marginTop: 16 }}>Accès réservé à l'administratrice</p>
        <button onClick={() => { setIsAdmin(false); setLoginError(false); setLoginPass(""); }} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", marginTop: 8, fontSize: 13 }}>← Retour au site</button>
      </div>
    </div>
  );

  if (isAdmin && adminAuth) return (
    <AdminPanel
      page={adminPage} setPage={setAdminPage}
      products={products} updateProducts={updateProducts}
      reviews={reviews} updateReviews={updateReviews}
      blogs={blogs} updateBlogs={updateBlogs}
      locations={locations} updateLocations={updateLocations}
      subscribers={subscribers} updateSubscribers={updateSubscribers}
      settings={settings} updateSettings={updateSettings}
      activity={activity} updateActivity={updateActivity} logActivity={logActivity}
      messages={messages} updateMessages={updateMessages}
      onLogout={() => { logActivity("Déconnexion", "Déconnexion du panneau admin", "auth"); setAdminAuth(false); setIsAdmin(false); setLoginPass(""); }}
      sidebar={adminSidebar} setSidebar={setAdminSidebar}
    />
  );

  /* ─── PUBLIC SITE ─── */
  return (
    <div style={CSS.root}>
      <style>{fonts}</style>
      <PublicSite
        page={publicPage} setPage={setPublicPage}
        products={products} reviews={reviews.filter(r => r.approved)} blogs={blogs.filter(b => b.published)} locations={locations.filter(l => l.active)}
        subscribers={subscribers} updateSubscribers={updateSubscribers}
        messages={messages} updateMessages={updateMessages}
        mobileMenu={mobileMenu} setMobileMenu={setMobileMenu}
        onAdmin={() => setIsAdmin(true)}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PUBLIC SITE
   ═══════════════════════════════════════════════════════════════ */
function PublicSite({ page, setPage, products, reviews, blogs, locations, subscribers, updateSubscribers, messages, updateMessages, mobileMenu, setMobileMenu, onAdmin }) {
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretTimer, setSecretTimer] = useState(null);

  const handleSecretClick = () => {
    const newCount = secretClicks + 1;
    setSecretClicks(newCount);
    if (secretTimer) clearTimeout(secretTimer);
    if (newCount >= 5) {
      setSecretClicks(0);
      onAdmin();
    } else {
      const t = setTimeout(() => setSecretClicks(0), 2000);
      setSecretTimer(t);
    }
  };

  const nav = [
    { id: "home", label: "Accueil" }, { id: "about", label: "Notre Histoire" }, { id: "products", label: "Nos Produits" }, { id: "blog", label: "Blogue" },
    { id: "locations", label: "Où Acheter" }, { id: "contact", label: "Contact" },
  ];

  return (
    <div>
      <style>{fonts}</style>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(249, 246, 240, 0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>🍹</span>
            <span style={{ ...CSS.heading, fontSize: 20, fontWeight: 800, color: C.green }}>Les Jus Naturels Ben's</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileMenu(false); }}
                style={{ padding: "10px 16px", border: "none", background: page === n.id ? `${C.green}15` : "transparent", color: page === n.id ? C.green : C.text, borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: page === n.id ? 600 : 500, display: window.innerWidth < 768 ? "none" : "block", transition: "all 0.2s" }}>
                {n.label}
              </button>
            ))}
            <button onClick={() => setPage("products")} className="anim-btn"
              style={{ padding: "12px 24px", background: C.green, color: "#fff", border: "none", borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s", marginLeft: 12, display: window.innerWidth < 768 ? "none" : "block" }}>
              Commander
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)}
              style={{ display: window.innerWidth >= 768 ? "none" : "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
              <Icon type={mobileMenu ? "x" : "menu"} color={C.dark} />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div style={{ padding: "8px 0 16px" }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileMenu(false); }}
                style={{ display: "block", width: "100%", padding: "12px 16px", border: "none", background: page === n.id ? `${C.green}15` : "transparent", color: page === n.id ? C.green : C.text, textAlign: "left", cursor: "pointer", fontSize: 15, borderRadius: 8, marginBottom: 4 }}>
                {n.label}
              </button>
            ))}
             <button onClick={() => setPage("products")} className="anim-btn"
              style={{ width: "100%", marginTop: 12, padding: "14px 24px", background: C.green, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>
              Commander
            </button>
          </div>
        )}
      </nav>

      {/* PAGES */}
      {page === "home" && <HomePage setPage={setPage} products={products} reviews={reviews} subscribers={subscribers} updateSubscribers={updateSubscribers} />}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "products" && <ProductsPage products={products} setPage={setPage} />}
      {page.startsWith("product:") && <ProductDetailPage productId={page.split(":")[1]} products={products} reviews={reviews} setPage={setPage} />}
      {page === "blog" && <BlogPage blogs={blogs} />}
      {page === "locations" && <LocationsPage locations={locations} />}
      {page === "contact" && <ContactPage subscribers={subscribers} updateSubscribers={updateSubscribers} messages={messages} updateMessages={updateMessages} />}

      {/* FOOTER */}
      <footer style={{ background: C.dark, color: "#a89e91", padding: "80px 24px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, justifyContent: "space-between" }}>
          <div style={{ minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>🍹</span>
              <span style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, color: C.cream }}>Les Jus Naturels Ben's</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>Des jus naturels et exotiques faits maison pour la santé, la saveur et l'authenticité.</p>
          </div>
          <div>
            <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontWeight: 600, marginBottom: 16 }}>Navigation</p>
            {nav.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)}
                style={{ display: "block", background: "none", border: "none", color: "#a89e91", cursor: "pointer", padding: "6px 0", fontSize: 14, transition: "color 0.2s" }}>{n.label}</button>
            ))}
          </div>
          <div>
             <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontWeight: 600, marginBottom: 16 }}>Contact</p>
            <a href="mailto:info@lesjusnaturelsbens.com" style={{ fontSize: 14, color: "#a89e91", textDecoration: "none", display: "block", marginBottom: 8 }}>info@lesjusnaturelsbens.com</a>
            <p style={{ fontSize: 14, color: "#a89e91", margin: 0 }}>Montréal, Québec</p>
          </div>
           <div>
             <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontWeight: 600, marginBottom: 16 }}>Suivez-nous</p>
            {/* Social links here */}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "64px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p onClick={handleSecretClick} style={{ fontSize: 13, cursor: "default", userSelect: "none" }}>
            © {new Date().getFullYear()} Les Jus Naturels Ben's. Tous droits réservés.
          </p>
          {secretClicks > 0 && secretClicks < 5 && (
            <div style={{ display: "flex", gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= secretClicks ? C.gold : "rgba(255,255,255,0.15)", transition: "background 0.2s" }} />
              ))}
            </div>
          )}
        </div>
      </footer>

      {/* CHATBOT */}
      <ChatBot />

      {/* WHATSAPP FLOATING BUTTON */}
      <a href="https://wa.me/15145550123?text=Bonjour%20Ben%27s%20!%20J%27aimerais%20avoir%20des%20informations%20sur%20vos%20jus%20naturels."
        target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, width: 60, height: 60, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 25px rgba(37,211,102,0.4)", cursor: "pointer", textDecoration: "none", transition: "transform 0.3s", animation: "bounceIn 0.6s ease 1s both" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

/* ─── HOME PAGE ─── */
function HomePage({ setPage, products, reviews, subscribers, updateSubscribers }) {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState({ bottles: 0, families: 0, flavors: 0 });
  const [countRef, countVisible] = useInView();
  const handleSub = () => {
    if (email && email.includes("@")) {
      updateSubscribers([...subscribers, { id: "s" + Date.now(), email, date: new Date().toISOString().split("T")[0], active: true }]);
      setEmail("");
    }
  };
  useEffect(() => {
    if (!countVisible) return;
    const targets = { bottles: 2000, families: 500, flavors: 11 };
    const dur = 2000;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount({ bottles: Math.round(targets.bottles * ease), families: Math.round(targets.families * ease), flavors: Math.round(targets.flavors * ease) });
      if (p < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [countVisible]);

  return (
    <div>
      {/* SEO STRUCTURED DATA */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "LocalBusiness", "name": "Les Jus Naturels Ben's",
        "description": "Jus naturels artisanaux inspirés des traditions africaines, fabriqués à Montréal.",
        "url": "https://lesjusnaturelsbens.com", "email": "info@lesjusnaturelsbens.com",
        "address": { "@type": "PostalAddress", "addressLocality": "Montréal", "addressRegion": "QC", "addressCountry": "CA" },
        "priceRange": "$$", "servesCuisine": "Jus naturels",
        "sameAs": ["https://facebook.com/lesjusnaturelsbens", "https://instagram.com/lesjusnaturelsbens"]
      }) }} />

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${C.green} 0%, #2a6a4f 50%, ${C.gold} 100%)`, backgroundSize: "200% 200%", animation: "gradient 10s ease infinite", padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.02) 35px, rgba(255,255,255,0.02) 70px)" }} />
        {["🍹","🌺","🍋","🍍","🫚","🍓"].map((e, i) => (
          <span key={i} style={{ position: "absolute", fontSize: 32, opacity: 0.08, animation: `float ${4 + i * 0.6}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`, top: `${15 + (i * 13) % 70}%`, left: `${10 + (i * 16) % 80}%` }}>{e}</span>
        ))}
        <div style={{ position: "relative", maxWidth: 750, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 15, letterSpacing: 4, textTransform: "uppercase", color: "rgba(249, 246, 240, 0.7)", marginBottom: 16 }}>Un héritage de saveurs authentiques</p>
            <h1 style={{ ...CSS.heading, fontSize: "clamp(38px, 5.5vw, 64px)", fontWeight: 900, color: C.cream, lineHeight: 1.15, margin: "0 0 24px" }}>
              Le goût naturel de l'Afrique,
              <br />embouteillé au Québec
            </h1>
            <p style={{ fontSize: 18, color: "rgba(249, 246, 240, 0.85)", lineHeight: 1.8, maxWidth: 600, margin: "0 auto 40px" }}>
              Découvrez des jus d'exception, préparés artisanalement à partir d'ingrédients frais et de recettes traditionnelles qui traversent les générations.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setPage("products")} className="anim-btn"
                style={{ padding: "18px 48px", background: C.gold, color: C.dark, border: "none", borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", transition: "all 0.3s" }}>
                Explorer les saveurs
              </button>
              <button onClick={() => setPage("about")} className="anim-btn"
                style={{ padding: "18px 36px", background: "transparent", color: C.cream, border: `1px solid ${C.cream}`, borderRadius: 50, fontSize: 16, fontWeight: 500, cursor: "pointer", transition: "all 0.3s" }}>
                Notre histoire →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section style={{ background: C.cream, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[
            { icon: "🍁", text: "Fait à Montréal" }, { icon: "🚫", text: "Sans sucre ajouté" },
            { icon: "🌿", text: "Zéro conservateur" }, { icon: "♻️", text: "Écoresponsable" }, { icon: "🏅", text: "Primé" },
          ].map((b, i) => (
            <Reveal key={i} delay={i * 0.1} anim="fadeUp">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{b.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{b.text}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COUNTER SECTION */}
      <div ref={countRef}>
        <section style={{ padding: "80px 24px", background: "#ffffff" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
            {[
              { val: count.bottles + "+", label: "Bouteilles vendues", icon: "🍹" },
              { val: count.families + "+", label: "Familles satisfaites", icon: "👨‍👩‍👧‍👦" },
              { val: count.flavors, label: "Saveurs uniques", icon: "🎨" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <span style={{ fontSize: 32, filter: `hue-rotate(${i * 40}deg)` }}>{s.icon}</span>
                <p style={{ ...CSS.heading, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: C.green, margin: "8px 0 4px" }}>{s.val}</p>
                <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 12 }}>Notre sélection</p>
            <h2 style={{ ...CSS.heading, fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 800, color: C.dark, margin: 0 }}>Nos produits vedettes</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 28 }}>
          {products.filter(p => p.available).slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} anim="scaleIn">
              <div onClick={() => setPage("product:" + p.id)} className="anim-card"
                style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)" }}>
                <div style={{ height: 200, background: `linear-gradient(135deg, ${p.color}1A, ${p.color}33)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  <ProductImg src={p.img} size={120} borderRadius={0} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover", transition: "transform 0.4s" }} />
                </div>
                <div style={{ padding: "20px 24px" }}>
                  {p.tag && <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: C.gold, background: `${C.gold}20`, padding: "4px 10px", borderRadius: 6 }}>{p.tag}</span>}
                  <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: "10px 0 6px", color: C.dark }}>{p.name}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 16px", height: 44, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: C.green }}>{p.price.toFixed(2)}$</span>
                    <span style={{ fontSize: 14, color: C.gold, fontWeight: 600 }}>Voir →</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal anim="fadeUp" delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button onClick={() => setPage("products")} className="anim-btn"
              style={{ padding: "16px 40px", background: C.green, color: "#fff", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>
              Voir tous nos produits
            </button>
          </div>
        </Reveal>
      </section>

      {/* VALUES */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 28 }}>
          {[
            { icon: "🌿", title: "Ingrédients naturels", desc: "Fruits frais, sans sucre ajouté ni conservateurs. Le vrai goût de la nature." },
            { icon: "♻️", title: "Écoresponsable", desc: "Nos résidus sont réutilisés comme épices et pour des produits de beauté. Zéro déchet." },
            { icon: "🤝", title: "Producteurs locaux", desc: "Nous soutenons l'économie locale et les agriculteurs québécois pour une fraîcheur inégalée." },
            { icon: "✨", title: "Saveurs uniques", desc: "Des recettes artisanales inspirées des riches traditions culinaires d'Afrique." },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 0.12} anim="fadeUp">
              <div style={{ background: C.cream, borderRadius: 24, padding: 32, border: `1px solid ${C.border}`, cursor: "default", height: "100%" }}>
                <span style={{ fontSize: 44, display: "block", marginBottom: 16 }}>{v.icon}</span>
                <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: "0 0 10px", color: C.dark }}>{v.title}</h3>
                <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 12 }}>Témoignages</p>
              <h2 style={{ ...CSS.heading, fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 800, color: C.dark, margin: 0 }}>Ce que nos clients disent</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.15} anim="slideLeft">
                <div className="anim-card" style={{ background: "#fff", borderRadius: 24, padding: 32, border: `1px solid ${C.border}`, transition: "transform 0.3s, box-shadow 0.3s", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)", height: "100%" }}>
                  <div style={{ color: "#f59e0b", fontSize: 18, marginBottom: 16 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <p style={{ fontSize: 16, color: C.text, lineHeight: 1.8, margin: "0 0 20px", fontStyle: "italic" }}>"{r.text}"</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>{r.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <Reveal anim="scaleIn">
        <section style={{ background: C.green, padding: "80px 24px", textAlign: "center" }}>
         <div style={{maxWidth: 500, margin: "0 auto"}}>
            <h2 style={{ ...CSS.heading, fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: C.cream, margin: "0 0 16px" }}>Rejoignez la communauté Ben's</h2>
            <p style={{ color: "rgba(249, 246, 240, 0.8)", fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>Recevez nos offres exclusives, découvrez nos nouveautés en avant-première et plongez dans notre univers.</p>
            <div style={{ display: "flex", gap: 10, maxWidth: 450, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input type="email" placeholder="Votre courriel" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSub()}
                style={{ flex: 1, minWidth: 220, padding: "16px 20px", borderRadius: 50, border: "none", fontSize: 15, outline: "none" }} />
              <button onClick={handleSub} className="anim-btn" style={{ padding: "16px 32px", borderRadius: 50, border: "none", background: C.gold, color: C.dark, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.3s" }}>S'abonner</button>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

/* ─── PRODUCTS PAGE ─── */
function ProductsPage({ products, setPage }) {
  const [filter, setFilter] = useState("Tous");
  const cats = ["Tous", ...new Set(products.map(p => p.category))];
  const filtered = filter === "Tous" ? products.filter(p => p.available) : products.filter(p => p.available && p.category === filter);
  return (
    <div style={{ padding: "48px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: "0 0 8px" }}>Nos Produits</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Découvrez notre gamme complète de jus naturels artisanaux.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: "8px 20px", borderRadius: 50, border: filter === c ? `2px solid ${C.red}` : `1px solid ${C.border}`, background: filter === c ? `${C.red}12` : "#fff", color: filter === c ? C.red : C.muted, cursor: "pointer", fontSize: 13, fontWeight: filter === c ? 600 : 400 }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
        {filtered.map(p => (
          <div key={p.id} onClick={() => setPage("product:" + p.id)}
            style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}>
            <div style={{ height: 180, background: `linear-gradient(135deg, ${p.color}22, ${p.color}44)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <ProductImg src={p.img} size={110} borderRadius={0} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "18px 20px" }}>
              {p.tag && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.red, background: `${C.red}15`, padding: "2px 8px", borderRadius: 4 }}>{p.tag}</span>}
              <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: "8px 0 6px", color: C.dark }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.hibiscus }}>{p.price.toFixed(2)}$</span>
                <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>Voir détails →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PRODUCT DETAIL PAGE ─── */
function ProductDetailPage({ productId, products, reviews, setPage }) {
  const p = products.find(pr => pr.id === productId);
  if (!p) return <div style={{ padding: 48, textAlign: "center" }}><p>Produit introuvable.</p><button onClick={() => setPage("products")} style={{ color: C.red, background: "none", border: "none", cursor: "pointer", fontSize: 15 }}>← Retour aux produits</button></div>;

  const ingredients = {
    "Hibiscus": { emoji: "🌺", benefits: ["Riche en antioxydants", "Aide à réguler la pression artérielle", "Renforce le système immunitaire", "Source de vitamine C"] },
    "Gingembre": { emoji: "🫚", benefits: ["Propriétés anti-inflammatoires", "Aide à la digestion", "Renforce l'immunité", "Favorise la perte de poids"] },
    "Citron": { emoji: "🍋", benefits: ["Riche en vitamine C", "Détoxifiant naturel", "Aide à la digestion", "Effet alcalinisant"] },
    "Ananas": { emoji: "🍍", benefits: ["Riche en bromélaïne", "Anti-inflammatoire naturel", "Source de manganèse", "Aide à la digestion"] },
    "Fraises": { emoji: "🍓", benefits: ["Riches en antioxydants", "Source de vitamine C", "Faible en calories", "Bonnes pour le cœur"] },
    "Bleuets": { emoji: "🫐", benefits: ["Super-aliment antioxydant", "Améliore la mémoire", "Riche en fibres", "Protège la vision"] },
    "Passion": { emoji: "🥭", benefits: ["Riche en vitamines A et C", "Source de fibres", "Propriétés relaxantes", "Bon pour la peau"] },
  };

  const getIngredients = (name) => {
    const found = [];
    Object.keys(ingredients).forEach(ing => { if (name.toLowerCase().includes(ing.toLowerCase())) found.push({ name: ing, ...ingredients[ing] }); });
    if (found.length === 0) found.push({ name: "Fruits frais", emoji: "🍹", benefits: ["100% naturel", "Sans conservateurs", "Sans sucre ajouté"] });
    return found;
  };

  const prodIngredients = getIngredients(p.name);
  const isSansSucre = p.name.toLowerCase().includes("sans sucre");
  const suggestions = [
    p.name.includes("Gingembre") ? "Parfait en shot matinal pour booster votre immunité" : "Idéal pour un moment de détente rafraîchissant",
    "Délicieux servi bien frais sur glace",
    "Excellent en base de cocktail ou smoothie",
    p.name.includes("Hibiscus") ? "Tradition africaine : se boit chaud ou froid" : "Se marie bien avec des fruits frais en salade",
  ];

  const otherProducts = products.filter(pr => pr.id !== p.id && pr.available).slice(0, 3);

  return (
    <div style={{ padding: "32px 24px 64px", maxWidth: 1000, margin: "0 auto" }}>
      {/* BACK BUTTON */}
      <button onClick={() => setPage("products")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0, marginBottom: 24 }}>
        <Icon type="back" size={18} color={C.red} /> Retour aux produits
      </button>

      {/* HERO SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 48 }}>
        {/* IMAGE */}
        <div style={{ borderRadius: 20, overflow: "hidden", background: `linear-gradient(135deg, ${p.color}15, ${p.color}35)`, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 360, position: "relative" }}>
          {p.tag && <span style={{ position: "absolute", top: 16, left: 16, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#fff", background: C.red, padding: "5px 14px", borderRadius: 20 }}>{p.tag}</span>}
          <ProductImg src={p.img} size={200} borderRadius={0} style={{ maxWidth: "100%", maxHeight: 340, objectFit: "cover" }} />
        </div>

        {/* INFO */}
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: C.red }}>{p.category}</span>
          <h1 style={{ ...CSS.heading, fontSize: 34, fontWeight: 900, color: C.dark, margin: "8px 0 12px", lineHeight: 1.2 }}>{p.name}</h1>

          {/* BADGES */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {isSansSucre && <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, background: "#dcfce7", color: "#166534", fontWeight: 600 }}>🚫 Sans sucre ajouté</span>}
            <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, background: "#dbeafe", color: "#1e40af", fontWeight: 600 }}>🍁 Fait au Québec</span>
            <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, background: "#fef3c7", color: "#92400e", fontWeight: 600 }}>🌿 Zéro conservateur</span>
            <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, background: "#f3e8ff", color: "#6b21a8", fontWeight: 600 }}>♻️ Écoresponsable</span>
          </div>

          {/* DESCRIPTION */}
          <p style={{ fontSize: 16, color: C.text, lineHeight: 1.8, marginBottom: 24 }}>{p.desc}</p>

          {/* PRICE + FORMATS */}
          <div style={{ background: C.light, borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ ...CSS.heading, fontSize: 32, fontWeight: 800, color: C.hibiscus }}>{p.price.toFixed(2)}$</span>
              <span style={{ fontSize: 12, color: C.muted }}>Prix suggéré</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 8 }}>Formats disponibles :</p>
            <div style={{ display: "flex", gap: 8 }}>
              {p.formats.map(f => (
                <div key={f} style={{ padding: "10px 20px", borderRadius: 10, border: `2px solid ${C.border}`, background: "#fff", fontSize: 14, fontWeight: 600, color: C.dark, textAlign: "center" }}>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button onClick={() => setPage("locations")}
            style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${C.hibiscus}, ${C.red})`, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Icon type="map" size={20} color="#fff" /> Où acheter ce produit ?
          </button>
        </div>
      </div>

      {/* INGREDIENTS SECTION */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, margin: "0 0 20px" }}>🌿 Nos ingrédients</h2>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(prodIngredients.length, 3)}, 1fr)`, gap: 16 }}>
          {prodIngredients.map(ing => (
            <div key={ing.name} style={{ background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>{ing.emoji}</span>
              <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: "0 0 12px", color: C.dark }}>{ing.name}</h3>
              {ing.benefits.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: C.green, fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.text }}>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, margin: "0 0 20px" }}>💡 Suggestions d'utilisation</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{["🌅", "🧊", "🍹", "🌍"][i]}</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.6, margin: 0 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OTHER PRODUCTS */}
      {otherProducts.length > 0 && (
        <div>
          <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, margin: "0 0 20px" }}>🍹 Vous aimerez aussi</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {otherProducts.map(op => (
              <div key={op.id} onClick={() => { setPage("product:" + op.id); window.scrollTo(0, 0); }}
                style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer" }}>
                <div style={{ height: 120, background: `linear-gradient(135deg, ${op.color}22, ${op.color}44)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <ProductImg src={op.img} size={72} borderRadius={0} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: C.dark }}>{op.name}</h3>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.hibiscus }}>{op.price.toFixed(2)}$</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ABOUT PAGE ─── */
function AboutPage({ setPage }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${C.hibiscus} 0%, ${C.red} 50%, ${C.gold} 100%)`, padding: "72px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 25px, rgba(255,255,255,0.02) 25px, rgba(255,255,255,0.02) 50px)" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>Notre histoire</p>
          <h1 style={{ ...CSS.heading, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: "0 0 16px" }}>De l'Afrique au Québec,<br />une passion pour les saveurs naturelles</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>L'histoire d'une femme, d'un héritage culinaire et d'une mission : offrir des jus authentiques qui font du bien.</p>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section style={{ padding: "64px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40, alignItems: "start" }}>
          <div>
            <div style={{ width: 250, height: 300, borderRadius: 20, background: `linear-gradient(135deg, ${C.gold}22, ${C.red}22)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 100 }}>👩🏾‍🍳</span>
            </div>
            <h3 style={{ ...CSS.heading, fontSize: 22, fontWeight: 800, color: C.dark, margin: "0 0 4px" }}>La fondatrice</h3>
            <p style={{ fontSize: 14, color: C.red, fontWeight: 600, margin: "0 0 8px" }}>Les Jus Naturels Ben's</p>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Entrepreneure passionnée, elle a transformé les recettes de sa famille en une marque québécoise primée.</p>
          </div>
          <div>
            <h2 style={{ ...CSS.heading, fontSize: 28, fontWeight: 800, color: C.dark, margin: "0 0 20px" }}>Un héritage familial devenu entreprise</h2>
            <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
              Tout a commencé dans une cuisine familiale au Cameroun, où les recettes de jus d'hibiscus et de gingembre se transmettaient de génération en génération. Ces boissons, bien plus que de simples breuvages, portent en elles des siècles de savoir-faire et de traditions africaines.
            </p>
            <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
              En arrivant au Québec, la fondatrice a constaté que ces saveurs authentiques manquaient cruellement sur le marché. Avec passion et détermination, elle a décidé de recréer ces recettes ancestrales en les adaptant aux fruits locaux québécois, créant ainsi un pont unique entre deux cultures.
            </p>
            <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
              Chaque bouteille de jus Ben's est préparée artisanalement, avec des ingrédients soigneusement sélectionnés auprès de producteurs locaux. C'est cette alliance entre traditions africaines et terroir québécois qui rend nos jus uniques.
            </p>
            <div style={{ background: `${C.red}08`, borderLeft: `4px solid ${C.red}`, borderRadius: "0 12px 12px 0", padding: "16px 20px", marginTop: 24 }}>
              <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                « Mon rêve est de faire découvrir à chaque Québécois la richesse des saveurs africaines, tout en soutenant nos producteurs locaux et en respectant notre planète. »
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIX & RECONNAISSANCE */}
      <section style={{ background: C.light, padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, margin: "0 0 24px" }}>🏆 Reconnaissance</h2>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, display: "inline-block" }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>🏅</span>
            <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>Prix Startup — Domaine Bioalimentaire</h3>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Jeune Chambre de Commerce du Cameroun à Montréal</p>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section style={{ padding: "64px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ ...CSS.heading, fontSize: 28, fontWeight: 800, color: C.dark, margin: "0 0 32px", textAlign: "center" }}>Nos valeurs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { icon: "🌱", title: "100% Naturel", desc: "Aucun conservateur, aucun additif. Juste des fruits, de l'eau et de l'amour." },
            { icon: "♻️", title: "Zéro déchet", desc: "Nos résidus de gingembre, hibiscus et ananas sont transformés en épices et produits de beauté." },
            { icon: "🍁", title: "Local d'abord", desc: "Nous travaillons avec des producteurs québécois pour garantir fraîcheur et qualité." },
            { icon: "🌍", title: "Héritage africain", desc: "Nos recettes sont inspirées de traditions centenaires du Cameroun et d'Afrique de l'Ouest." },
            { icon: "❤️", title: "Artisanal", desc: "Chaque bouteille est préparée à la main avec soin, en petits lots." },
            { icon: "🤝", title: "Communauté", desc: "Présents aux marchés locaux, nous créons des liens avec nos clients." },
          ].map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>{v.icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: C.dark }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESSUS */}
      <section style={{ background: C.dark, padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...CSS.heading, fontSize: 32, fontWeight: 800, color: "#f0e6d3", margin: "0 0 48px", textAlign: "center", animation: "fadeUp 0.6s ease both" }}>Comment nous préparons nos jus</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { step: "01", title: "Sélection des ingrédients", desc: "Chaque fruit et épice est soigneusement choisi à maturité auprès de producteurs locaux." },
              { step: "02", title: "Préparation artisanale", desc: "Nos recettes traditionnelles sont suivies à la lettre, avec des méthodes qui préservent les nutriments." },
              { step: "03", title: "Embouteillage", desc: "Les jus sont embouteillés frais, sans pasteurisation excessive, pour garder toute leur saveur." },
              { step: "04", title: "Zéro gaspillage", desc: "Les résidus sont séchés naturellement et transformés en épices ou produits de beauté." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "24px", borderRadius: 16, background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(212, 118, 59, 0.15)", transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)", animation: `slideUp 0.6s ease both`, animationDelay: `${0.1 * (i + 1)}s` }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: "#c44536", flexShrink: 0, width: 70, height: 70, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(196, 69, 54, 0.15), rgba(196, 69, 54, 0.08))", borderRadius: "50%", border: "2px solid rgba(212, 118, 59, 0.3)", transition: "all 0.3s ease" }}>{s.step}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0e6d3", margin: "0 0 8px", transition: "color 0.3s ease" }}>{s.title}</h3>
                  <p style={{ fontSize: 14.5, color: "#a89e91", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, margin: "0 0 16px" }}>Envie de goûter ?</h2>
        <p style={{ fontSize: 15, color: C.muted, marginBottom: 24 }}>Découvrez nos jus dans un point de vente près de chez vous.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("products")} style={{ padding: "14px 32px", borderRadius: 50, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Voir nos produits</button>
          <button onClick={() => setPage("locations")} style={{ padding: "14px 32px", borderRadius: 50, border: `2px solid ${C.hibiscus}`, background: "transparent", color: C.hibiscus, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Où acheter</button>
        </div>
      </section>
    </div>
  );
}

/* ─── CHATBOT ─── */
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Bonjour ! 👋 Je suis l'assistant Ben's. Comment puis-je vous aider ?", time: new Date() }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const getResponse = (text) => {
    const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const r of CHAT_RESPONSES) {
      if (r.keywords.some(k => lower.includes(k))) return r.response;
    }
    return "Merci pour votre message ! Pour une réponse personnalisée, contactez-nous à info@lesjusnaturelsbens.com ou via WhatsApp. Nous vous répondrons rapidement ! 📧";
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input.trim(), time: new Date() };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs(prev => [...prev, { from: "bot", text: getResponse(userMsg.text), time: new Date() }]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  const quickQs = ["Où acheter ?", "C'est quoi le prix ?", "C'est sans sucre ?", "Votre histoire"];

  return (
    <>
      {/* CHAT TOGGLE */}
      <button onClick={() => setOpen(!open)}
        style={{ position: "fixed", bottom: 96, right: 24, zIndex: 1000, width: 52, height: 52, borderRadius: "50%", background: C.hibiscus, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(139,26,26,0.3)", transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none" }}>
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>
      {msgs.length <= 1 && !open && (
        <div style={{ position: "fixed", bottom: 154, right: 24, zIndex: 999, background: "#fff", borderRadius: 12, padding: "10px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxWidth: 200, fontSize: 13, color: C.dark, animation: "bounceIn 0.5s ease", border: `1px solid ${C.border}` }}>
          <div style={{ position: "absolute", bottom: -6, right: 18, width: 12, height: 12, background: "#fff", transform: "rotate(45deg)", borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} />
          🍹 <strong>Une question ?</strong><br />Clavardez avec nous !
        </div>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div className="chat-bubble" style={{ position: "fixed", bottom: 160, right: 24, zIndex: 1001, width: 360, maxHeight: 480, borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", border: `1px solid ${C.border}` }}>
          {/* Header */}
          <div style={{ background: `linear-gradient(135deg, ${C.hibiscus}, ${C.red})`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍹</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>Les Jus Naturels Ben's</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: 0 }}>En ligne · Répond instantanément</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: "auto", padding: "16px 16px 8px", maxHeight: 280, background: "#faf6f0" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10, animation: "fadeUp 0.3s ease" }}>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.from === "user" ? C.hibiscus : "#fff", color: m.from === "user" ? "#fff" : C.dark, fontSize: 14, lineHeight: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "#fff", borderRadius: 14, width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.muted, animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {msgs.length <= 2 && (
            <div style={{ padding: "4px 12px 8px", display: "flex", gap: 6, flexWrap: "wrap", background: "#faf6f0" }}>
              {quickQs.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(() => { setMsgs(prev => [...prev, { from: "user", text: q, time: new Date() }]); setTyping(true); setTimeout(() => { setMsgs(prev => [...prev, { from: "bot", text: getResponse(q), time: new Date() }]); setTyping(false); }, 800); }, 100); }}
                  style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${C.border}`, background: "#fff", color: C.dark, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, background: "#fff" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Tapez votre message..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: 24, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", background: "#faf6f0" }} />
            <button onClick={send} disabled={!input.trim()}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: input.trim() ? C.hibiscus : "#e5e7eb", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
              <Icon type="send" size={16} color={input.trim() ? "#fff" : "#9ca3af"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── BLOG PAGE ─── */
function BlogPage({ blogs }) {
  return (
    <div style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: "0 0 8px" }}>Blogue</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 40 }}>Recettes, conseils santé et nouvelles de l'univers Ben's.</p>
      {blogs.map(b => (
        <article key={b.id} style={{ background: "#fff", borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: `${C.red}12`, color: C.red, fontWeight: 600 }}>{b.category}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{b.date}</span>
          </div>
          <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: "0 0 12px", color: C.dark }}>{b.title}</h2>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, margin: 0 }}>{b.content}</p>
        </article>
      ))}
    </div>
  );
}

/* ─── LOCATIONS PAGE ─── */
function LocationsPage({ locations }) {
  const [selected, setSelected] = useState(null);
  const mapQuery = locations.map(l => encodeURIComponent(l.name + ", " + l.address)).join("|");
  return (
    <div style={{ padding: "48px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: "0 0 8px" }}>Où Acheter</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Trouvez nos jus près de chez vous à Montréal et ses environs.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* MAP */}
        <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, minHeight: 400 }}>
          <iframe
            title="Carte des points de vente"
            src={`https://www.google.com/maps/embed/v1/search?q=Marché+Jean-Talon+Montréal&center=45.5017,-73.5673&zoom=12&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
            style={{ width: "100%", height: "100%", minHeight: 400, border: "none" }}
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* LOCATIONS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {locations.map(l => (
            <div key={l.id}
              onClick={() => setSelected(selected === l.id ? null : l.id)}
              style={{ background: selected === l.id ? `${C.red}08` : "#fff", borderRadius: 14, padding: "18px 20px", border: selected === l.id ? `2px solid ${C.red}44` : `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.green}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon type="map" size={20} color={C.green} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 3px", color: C.dark }}>{l.name}</h3>
                  <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{l.address}</p>
                </div>
                <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: C.light, color: C.muted, whiteSpace: "nowrap" }}>{l.type}</span>
              </div>
              {selected === l.id && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.name + " " + l.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: C.green, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    <Icon type="map" size={14} color="#fff" /> Itinéraire
                  </a>
                  <a href={`tel:`}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", color: C.dark, fontSize: 13, textDecoration: "none" }}>
                    📞 Appeler
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GOOGLE MAPS BADGE */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.muted }}>📍 Carte fournie par Google Maps • Cliquez sur un point de vente pour l'itinéraire</p>
      </div>
    </div>
  );
}

/* ─── CONTACT PAGE ─── */
function ContactPage({ subscribers, updateSubscribers, messages, updateMessages }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const handleSend = () => {
    if (email && msg) {
      updateMessages([...messages, { id: "m" + Date.now(), name: name || "Anonyme", email, message: msg, read: false, responded: false, date: new Date().toISOString() }]);
      if (email.includes("@")) updateSubscribers([...subscribers, { id: "s" + Date.now(), email, date: new Date().toISOString().split("T")[0], active: true }]);
      setSent(true);
    }
  };
  return (
    <div style={{ padding: "48px 24px", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: "0 0 8px" }}>Contact</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Une question ? Écrivez-nous !</p>
      {sent ? (
        <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}44`, borderRadius: 16, padding: 32, textAlign: "center" }}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>✅</span>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.green, margin: "0 0 8px" }}>Message envoyé avec succès !</p>
          <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Nous vous répondrons dans les plus brefs délais.</p>
          <button onClick={() => { setSent(false); setName(""); setEmail(""); setMsg(""); }}
            style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#fff", color: C.dark, fontSize: 14, cursor: "pointer" }}>
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input placeholder="Votre nom" value={name} onChange={e => setName(e.target.value)}
            style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, outline: "none" }} />
          <input placeholder="Votre courriel *" value={email} onChange={e => setEmail(e.target.value)}
            style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, outline: "none" }} />
          <textarea placeholder="Votre message *" value={msg} onChange={e => setMsg(e.target.value)} rows={5}
            style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <button onClick={handleSend} disabled={!email || !msg}
            style={{ padding: "14px", borderRadius: 12, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: !email || !msg ? 0.5 : 1 }}>
            Envoyer
          </button>
        </div>
      )}
      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: 20, background: C.light, borderRadius: 14, textAlign: "center" }}>
          <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>📧</span>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 2px" }}>Courriel</p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>info@lesjusnaturelsbens.com</p>
        </div>
        <a href="https://wa.me/15145550123" target="_blank" rel="noopener noreferrer"
          style={{ padding: 20, background: "#dcfce7", borderRadius: 14, textAlign: "center", textDecoration: "none" }}>
          <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>💬</span>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#166534", margin: "0 0 2px" }}>WhatsApp</p>
          <p style={{ fontSize: 13, color: "#2a6a4f", margin: 0 }}>Réponse rapide</p>
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL
   ═══════════════════════════════════════════════════════════════ */
function AdminPanel({ page, setPage, products, updateProducts, reviews, updateReviews, blogs, updateBlogs, locations, updateLocations, subscribers, updateSubscribers, settings, updateSettings, activity, updateActivity, logActivity, messages, updateMessages, onLogout, sidebar, setSidebar }) {
  const unreadCount = messages.filter(m => !m.read).length;
  const menu = [
    { id: "dashboard", label: "Tableau de bord", icon: "chart" },
    { id: "messages", label: "Messages", icon: "mail", badge: unreadCount },
    { id: "products", label: "Catalogue", icon: "grid" },
    { id: "blog", label: "Blogue", icon: "edit" },
    { id: "reviews", label: "Avis clients", icon: "star" },
    { id: "locations", label: "Points de vente", icon: "map" },
    { id: "newsletter", label: "Infolettres", icon: "send" },
    { id: "settings", label: "Gestion Admin", icon: "settings" },
  ];

  return (
    <div style={{ ...CSS.root, display: "flex", minHeight: "100vh", background: "#f5f0ea" }}>
      <style>{fonts}</style>
      {/* SIDEBAR */}
      <aside style={{ width: sidebar ? 240 : 0, background: C.dark, overflow: "hidden", transition: "width 0.3s", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px", minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: 24 }}>🍹</span>
            <div>
              <p style={{ ...CSS.heading, fontSize: 15, fontWeight: 700, color: "#f0e6d3", margin: 0 }}>Ben's Admin</p>
              <p style={{ fontSize: 11, color: "#6b5e52", margin: 0 }}>Panneau de gestion</p>
            </div>
          </div>
          {menu.map(m => (
            <button key={m.id} onClick={() => setPage(m.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", border: "none", borderRadius: 10, background: page === m.id ? "rgba(196,69,54,0.2)" : "transparent", color: page === m.id ? "#f0e6d3" : "#8a7968", cursor: "pointer", fontSize: 14, fontWeight: page === m.id ? 600 : 400, marginBottom: 4, textAlign: "left", position: "relative" }}>
              <Icon type={m.icon} size={18} color={page === m.id ? C.red : "#6b5e52"} />
              {m.label}
              {m.badge > 0 && <span style={{ marginLeft: "auto", minWidth: 20, height: 20, borderRadius: 10, background: "#dc2626", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{m.badge}</span>}
            </button>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 24, paddingTop: 20 }}>
            <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", border: "none", borderRadius: 10, background: "transparent", color: "#6b5e52", cursor: "pointer", fontSize: 14, textAlign: "left" }}>
              <Icon type="back" size={18} color="#6b5e52" /> Retour au site
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto" }}>
        <header style={{ padding: "16px 28px", background: "#fff", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebar(!sidebar)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Icon type="menu" color={C.dark} />
            </button>
            <h1 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, color: C.dark, margin: 0 }}>
              {menu.find(m => m.id === page)?.label || "Admin"}
            </h1>
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>Bienvenue, Admin 👋</div>
        </header>
        <div style={{ padding: 28 }}>
          {page === "dashboard" && <AdminDashboard products={products} reviews={reviews} blogs={blogs} locations={locations} subscribers={subscribers} messages={messages} setPage={setPage} />}
          {page === "messages" && <AdminMessages messages={messages} updateMessages={updateMessages} logActivity={logActivity} />}
          {page === "products" && <AdminProducts products={products} updateProducts={updateProducts} />}
          {page === "blog" && <AdminBlog blogs={blogs} updateBlogs={updateBlogs} />}
          {page === "reviews" && <AdminReviews reviews={reviews} updateReviews={updateReviews} />}
          {page === "locations" && <AdminLocations locations={locations} updateLocations={updateLocations} />}
          {page === "newsletter" && <AdminNewsletter subscribers={subscribers} updateSubscribers={updateSubscribers} />}
          {page === "settings" && <AdminSettings settings={settings} updateSettings={updateSettings} activity={activity} logActivity={logActivity} products={products} reviews={reviews} blogs={blogs} locations={locations} subscribers={subscribers} />}
        </div>
      </main>
    </div>
  );
}

/* ─── ADMIN: DASHBOARD ─── */
function AdminDashboard({ products, reviews, blogs, locations, subscribers, messages, setPage }) {
  const pendingReviews = reviews.filter(r => !r.approved).length;
  const draftBlogs = blogs.filter(b => !b.published).length;
  const unreadMessages = messages.filter(m => !m.read).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  const quickActions = [
    { label: "Ajouter un produit", icon: "🍹", page: "products", color: "#c44536" },
    { label: "Voir les messages", icon: "📩", page: "messages", color: "#2563eb", badge: unreadMessages > 0 ? unreadMessages : null },
    { label: "Publier un article", icon: "📝", page: "blog", color: "#2a6a4f" },
    { label: "Points de vente", icon: "📍", page: "locations", color: "#2563eb" },
    { label: "Envoyer infolettre", icon: "✉️", page: "newsletter", color: "#8b5cf6" },
    { label: "Voir les avis", icon: "⭐", page: "reviews", color: "#f59e0b", badge: pendingReviews > 0 ? pendingReviews : null },
  ];

  const todos = [];
  if (unreadMessages > 0) todos.push({ icon: "📩", text: `${unreadMessages} message${unreadMessages > 1 ? "s" : ""} non lu${unreadMessages > 1 ? "s" : ""}`, page: "messages", color: "#dbeafe", textColor: "#1e40af" });
  if (pendingReviews > 0) todos.push({ icon: "⭐", text: `${pendingReviews} avis à vérifier`, page: "reviews", color: "#fef3c7", textColor: "#92400e" });
  if (draftBlogs > 0) todos.push({ icon: "📝", text: `${draftBlogs} article${draftBlogs > 1 ? "s" : ""} en brouillon`, page: "blog", color: "#f3e8ff", textColor: "#6b21a8" });

  return (
    <div>
      {/* GREETING */}
      <div style={{ background: `linear-gradient(135deg, ${C.hibiscus}, ${C.red}, ${C.gold})`, borderRadius: 18, padding: "28px 30px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)" }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ ...CSS.heading, fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>{greeting} Ben's 👋</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", margin: 0 }}>Que voulez-vous faire aujourd'hui ?</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12, marginBottom: 24 }}>
        {quickActions.map(a => (
          <button key={a.label} onClick={() => setPage(a.page)}
            style={{ background: "#fff", borderRadius: 14, padding: "20px 16px", border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "center", position: "relative", transition: "transform 0.15s, box-shadow 0.15s" }}>
            {a.badge && (
              <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{a.badge}</div>
            )}
            <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>{a.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, lineHeight: 1.3 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* STATS BAR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Produits actifs", value: products.filter(p => p.available).length, emoji: "🍹" },
          { label: "Messages", value: messages.length, emoji: "📩" },
          { label: "Abonnés", value: subscribers.filter(s => s.active).length, emoji: "📧" },
          { label: "Points de vente", value: locations.filter(l => l.active).length, emoji: "📍" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 14px", border: `1px solid ${C.border}`, textAlign: "center" }}>
            <span style={{ fontSize: 18 }}>{s.emoji}</span>
            <p style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: "4px 0 2px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* TWO COLUMNS: MESSAGES + TODOS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* MESSAGES RÉCENTS */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.dark }}>📩 Messages récents</h3>
            <button onClick={() => setPage("messages")} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Voir tout →</button>
          </div>
          {messages.length === 0 ? (
            <p style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "20px 0" }}>Aucun message</p>
          ) : messages.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4).map(m => (
            <div key={m.id} onClick={() => setPage("messages")} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.read ? "#d1d5db" : "#2563eb", flexShrink: 0, marginTop: 6 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: m.read ? 400 : 700, color: C.dark }}>{m.name}</span>
                  <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{new Date(m.date).toLocaleDateString("fr-CA", { day: "numeric", month: "short" })}</span>
                </div>
                <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS À FAIRE */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", color: C.dark, display: "flex", alignItems: "center", gap: 8 }}>
            🔔 Actions à faire
            {todos.length > 0 && <span style={{ fontSize: 11, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{todos.length}</span>}
          </h3>
          {todos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>✅</span>
              <p style={{ fontSize: 14, color: C.green, fontWeight: 600, margin: 0 }}>Tout est à jour !</p>
              <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 0" }}>Aucune action requise</p>
            </div>
          ) : todos.map((t, i) => (
            <div key={i} onClick={() => setPage(t.page)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.color, borderRadius: 10, marginBottom: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 14, color: t.textColor, fontWeight: 500 }}>{t.text}</span>
              <span style={{ marginLeft: "auto", fontSize: 18, color: t.textColor }}>→</span>
            </div>
          ))}

          {/* DERNIERS ABONNÉS (compact) */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>📧 Derniers abonnés</p>
            {subscribers.slice(-3).reverse().map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
                <span style={{ color: C.text }}>{s.email}</span>
                <span style={{ color: C.muted }}>{s.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN: PRODUCTS ─── */
function AdminProducts({ products, updateProducts }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Jus", price: "", formats: "250ml, 1L", desc: "", tag: "", img: "🍹", available: true });
  const [uploading, setUploading] = useState(false);

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, category: p.category, price: p.price.toString(), formats: p.formats.join(", "), desc: p.desc, tag: p.tag, img: p.img, available: p.available });
  };
  const startNew = () => { setEditing("new"); setForm({ name: "", category: "Jus", price: "", formats: "250ml, 1L", desc: "", tag: "", img: "🍹", available: true }); };
  const saveProduct = () => {
    const data = { ...form, price: parseFloat(form.price) || 0, formats: form.formats.split(",").map(f => f.trim()).filter(Boolean), color: "#c44536" };
    if (editing === "new") {
      updateProducts([...products, { ...data, id: "p" + Date.now() }]);
    } else {
      updateProducts(products.map(p => p.id === editing ? { ...p, ...data } : p));
    }
    setEditing(null);
  };
  const deleteProduct = (id) => updateProducts(products.filter(p => p.id !== id));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, "products");
    if (url) setForm(f => ({ ...f, img: url }));
    else alert("Erreur lors du téléversement. Vérifiez que le bucket 'product-images' est créé dans Supabase.");
    setUploading(false);
  };

  const emojis = ["🍹", "🍓", "🍋", "🍍", "🫐", "🥭", "🫚", "🌺", "🥕", "🍊"];
  const imgIsUrl = form.img && (form.img.startsWith("http") || form.img.startsWith("/"));

  if (editing) return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 600 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === "new" ? "Nouveau produit" : "Modifier le produit"}</h3>
        <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelSt}>Photo ou icône</label>
          {/* Aperçu de l'image actuelle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 64, height: 64, borderRadius: 10, background: C.light, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: `1px solid ${C.border}` }}>
              <ProductImg src={form.img} size={64} borderRadius={0} />
            </div>
            <div style={{ flex: 1 }}>
              {/* Upload fichier → Supabase Storage */}
              <label style={{ display: "inline-block", padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", fontSize: 13, cursor: uploading ? "wait" : "pointer", color: C.text }}>
                {uploading ? "Téléversement…" : "📁 Choisir une photo"}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
              </label>
              <p style={{ fontSize: 11, color: C.muted, margin: "4px 0 0" }}>JPG, PNG, WebP — max 5 MB</p>
            </div>
          </div>
          {/* Ou coller une URL */}
          <input
            value={imgIsUrl ? form.img : ""}
            onChange={e => setForm({ ...form, img: e.target.value })}
            placeholder="Ou coller une URL d'image (https://…)"
            style={{ ...inputSt, marginBottom: 8 }}
          />
          {/* Ou choisir un emoji */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {emojis.map(e => <button key={e} onClick={() => setForm({ ...form, img: e })} style={{ fontSize: 22, padding: "5px 9px", borderRadius: 8, border: form.img === e ? `2px solid ${C.red}` : `1px solid ${C.border}`, background: form.img === e ? `${C.red}12` : "#fff", cursor: "pointer" }}>{e}</button>)}
          </div>
        </div>
        <div><label style={labelSt}>Nom du produit</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputSt} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label style={labelSt}>Catégorie</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputSt}>
              <option>Jus</option><option>Tisanes</option><option>Épices</option><option>Cosmétiques</option>
            </select>
          </div>
          <div><label style={labelSt}>Prix ($)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputSt} /></div>
        </div>
        <div><label style={labelSt}>Formats (séparés par virgule)</label><input value={form.formats} onChange={e => setForm({ ...form, formats: e.target.value })} style={inputSt} placeholder="250ml, 354ml, 1L" /></div>
        <div><label style={labelSt}>Description</label><textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label style={labelSt}>Étiquette</label>
            <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={inputSt}>
              <option value="">Aucune</option><option>Nouveau</option><option>Populaire</option><option>En promotion</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
            <button onClick={() => setForm({ ...form, available: !form.available })} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: form.available ? C.green : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: form.available ? 23 : 3, transition: "left 0.2s" }} />
            </button>
            <span style={{ fontSize: 14, color: C.text }}>Disponible</span>
          </div>
        </div>
        <button onClick={saveProduct} disabled={!form.name || !form.price}
          style={{ padding: "14px", borderRadius: 12, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: !form.name || !form.price ? 0.5 : 1 }}>
          {editing === "new" ? "Ajouter le produit" : "Enregistrer"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{products.length} produits au total</p>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: "none", background: C.hibiscus, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          <Icon type="plus" size={16} color="#fff" /> Nouveau produit
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
            <ProductImg src={p.img} size={44} borderRadius={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{p.name}</span>
                {p.tag && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: `${C.red}15`, color: C.red, fontWeight: 600 }}>{p.tag}</span>}
                {!p.available && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#fee2e2", color: "#dc2626" }}>Indisponible</span>}
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>{p.category} · {p.formats.join(", ")} · {p.price.toFixed(2)}$</p>
            </div>
            <button onClick={() => startEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
            <button onClick={() => deleteProduct(p.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ADMIN: BLOG ─── */
function AdminBlog({ blogs, updateBlogs }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Santé", content: "", published: false });

  const startEdit = (b) => { setEditing(b.id); setForm({ title: b.title, category: b.category, content: b.content, published: b.published }); };
  const startNew = () => { setEditing("new"); setForm({ title: "", category: "Santé", content: "", published: false }); };
  const saveBlog = () => {
    const data = { ...form, date: new Date().toISOString().split("T")[0] };
    if (editing === "new") {
      updateBlogs([...blogs, { ...data, id: "b" + Date.now() }]);
    } else {
      updateBlogs(blogs.map(b => b.id === editing ? { ...b, ...data } : b));
    }
    setEditing(null);
  };
  const deleteBlog = (id) => updateBlogs(blogs.filter(b => b.id !== id));
  const togglePublish = (id) => updateBlogs(blogs.map(b => b.id === id ? { ...b, published: !b.published } : b));

  if (editing) return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === "new" ? "Nouvel article" : "Modifier l'article"}</h3>
        <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><label style={labelSt}>Titre</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputSt} /></div>
        <div><label style={labelSt}>Catégorie</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputSt}>
            <option>Santé</option><option>Recettes</option><option>Événements</option><option>Astuces</option>
          </select>
        </div>
        <div><label style={labelSt}>Contenu</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setForm({ ...form, published: !form.published })} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: form.published ? C.green : "#d1d5db", cursor: "pointer", position: "relative" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: form.published ? 23 : 3, transition: "left 0.2s" }} />
          </button>
          <span style={{ fontSize: 14, color: C.text }}>{form.published ? "Publié" : "Brouillon"}</span>
        </div>
        <button onClick={saveBlog} disabled={!form.title || !form.content}
          style={{ padding: "14px", borderRadius: 12, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: !form.title || !form.content ? 0.5 : 1 }}>
          Enregistrer
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{blogs.length} articles</p>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: "none", background: C.hibiscus, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          <Icon type="plus" size={16} color="#fff" /> Nouvel article
        </button>
      </div>
      {blogs.map(b => (
        <div key={b.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.border}`, marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{b.title}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: b.published ? `${C.green}15` : "#fef3c7", color: b.published ? C.green : "#92400e", fontWeight: 600 }}>{b.published ? "Publié" : "Brouillon"}</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>{b.category} · {b.date}</p>
          </div>
          <button onClick={() => togglePublish(b.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <Icon type="eye" size={16} color={b.published ? C.green : C.muted} />
          </button>
          <button onClick={() => startEdit(b)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
          <button onClick={() => deleteBlog(b.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
        </div>
      ))}
    </div>
  );
}

/* ─── ADMIN: REVIEWS ─── */
function AdminReviews({ reviews, updateReviews }) {
  const toggleApprove = (id) => updateReviews(reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r));
  const deleteReview = (id) => updateReviews(reviews.filter(r => r.id !== id));

  const pending = reviews.filter(r => !r.approved);
  const approved = reviews.filter(r => r.approved);

  return (
    <div>
      {pending.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#92400e", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>⏳ En attente de modération ({pending.length})</h3>
          {pending.map(r => (
            <div key={r.id} style={{ background: "#fffbeb", borderRadius: 12, padding: "16px 18px", border: "1px solid #fde68a", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{r.name}</span>
                  <span style={{ fontSize: 12, color: C.muted, marginLeft: 10 }}>{r.date}</span>
                </div>
                <span style={{ color: "#f59e0b" }}>{"★".repeat(r.rating)}</span>
              </div>
              <p style={{ fontSize: 14, color: C.text, margin: "0 0 12px", lineHeight: 1.6 }}>{r.text}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleApprove(r.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: C.green, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <Icon type="check" size={14} color="#fff" /> Approuver
                </button>
                <button onClick={() => deleteReview(r.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid #fca5a5`, background: "#fff", color: "#dc2626", fontSize: 13, cursor: "pointer" }}>
                  <Icon type="trash" size={14} color="#dc2626" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: C.green, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>✅ Avis approuvés ({approved.length})</h3>
      {approved.map(r => (
        <div key={r.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.border}`, marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{r.name}</span>
              <span style={{ color: "#f59e0b", fontSize: 13 }}>{"★".repeat(r.rating)}</span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0", lineHeight: 1.5 }}>{r.text}</p>
          </div>
          <button onClick={() => toggleApprove(r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="eye" size={16} color={C.muted} /></button>
          <button onClick={() => deleteReview(r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
        </div>
      ))}
    </div>
  );
}

/* ─── ADMIN: LOCATIONS ─── */
function AdminLocations({ locations, updateLocations }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", type: "Marché", active: true });

  const startEdit = (l) => { setEditing(l.id); setForm({ name: l.name, address: l.address, type: l.type, active: l.active }); };
  const startNew = () => { setEditing("new"); setForm({ name: "", address: "", type: "Marché", active: true }); };
  const saveLocation = () => {
    if (editing === "new") {
      updateLocations([...locations, { ...form, id: "l" + Date.now() }]);
    } else {
      updateLocations(locations.map(l => l.id === editing ? { ...l, ...form } : l));
    }
    setEditing(null);
  };
  const deleteLocation = (id) => updateLocations(locations.filter(l => l.id !== id));

  if (editing) return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 500 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === "new" ? "Nouveau point de vente" : "Modifier"}</h3>
        <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><label style={labelSt}>Nom</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputSt} /></div>
        <div><label style={labelSt}>Adresse</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputSt} /></div>
        <div><label style={labelSt}>Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputSt}>
            <option>Marché</option><option>Épicerie</option><option>Restaurant</option><option>Boutique</option><option>Événement</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setForm({ ...form, active: !form.active })} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: form.active ? C.green : "#d1d5db", cursor: "pointer", position: "relative" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: form.active ? 23 : 3, transition: "left 0.2s" }} />
          </button>
          <span style={{ fontSize: 14 }}>{form.active ? "Actif" : "Inactif"}</span>
        </div>
        <button onClick={saveLocation} disabled={!form.name || !form.address}
          style={{ padding: "14px", borderRadius: 12, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: !form.name || !form.address ? 0.5 : 1 }}>
          Enregistrer
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{locations.length} points de vente</p>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: "none", background: C.hibiscus, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          <Icon type="plus" size={16} color="#fff" /> Nouveau point
        </button>
      </div>
      {locations.map(l => (
        <div key={l.id} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: `1px solid ${C.border}`, marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: l.active ? `${C.green}15` : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon type="map" size={18} color={l.active ? C.green : "#9ca3af"} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{l.name}</span>
              {!l.active && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#fee2e2", color: "#dc2626" }}>Inactif</span>}
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>{l.address} · {l.type}</p>
          </div>
          <button onClick={() => startEdit(l)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
          <button onClick={() => deleteLocation(l.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
        </div>
      ))}
    </div>
  );
}

/* ─── ADMIN: NEWSLETTER ─── */
function AdminNewsletter({ subscribers, updateSubscribers }) {
  const [composing, setComposing] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const activeCount = subscribers.filter(s => s.active).length;
  const toggleSub = (id) => updateSubscribers(subscribers.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const deleteSub = (id) => updateSubscribers(subscribers.filter(s => s.id !== id));

  const sendNewsletter = () => { setSent(true); setComposing(false); setTimeout(() => setSent(false), 3000); };

  return (
    <div>
      {sent && (
        <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}44`, borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon type="check" size={18} color={C.green} />
          <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>Infolettre envoyée à {activeCount} abonnés !</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Abonnés actifs</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>{activeCount}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Total inscrits</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>{subscribers.length}</p>
        </div>
      </div>

      {composing ? (
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 600, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Composer une infolettre</h3>
            <button onClick={() => setComposing(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon type="x" color={C.muted} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={labelSt}>Objet</label><input value={subject} onChange={e => setSubject(e.target.value)} style={inputSt} placeholder="Ex: Découvrez nos nouveaux jus d'été !" /></div>
            <div><label style={labelSt}>Message</label><textarea value={body} onChange={e => setBody(e.target.value)} rows={6} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }} placeholder="Bonjour ! Nous avons de belles nouveautés..." /></div>
            <p style={{ fontSize: 12, color: C.muted }}>Sera envoyé à {activeCount} abonnés actifs</p>
            <button onClick={sendNewsletter} disabled={!subject || !body}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: !subject || !body ? 0.5 : 1 }}>
              <Icon type="send" size={16} color="#fff" /> Envoyer l'infolettre
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setComposing(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "none", background: C.hibiscus, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 24 }}>
          <Icon type="mail" size={16} color="#fff" /> Nouvelle infolettre
        </button>
      )}

      <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>Liste des abonnés</span>
        </div>
        {subscribers.map(s => (
          <div key={s.id} style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.active ? C.green : "#d1d5db" }} />
            <span style={{ flex: 1, fontSize: 14, color: C.text }}>{s.email}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{s.date}</span>
            <button onClick={() => toggleSub(s.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, fontSize: 12, color: s.active ? "#dc2626" : C.green }}>{s.active ? "Désactiver" : "Activer"}</button>
            <button onClick={() => deleteSub(s.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Icon type="trash" size={14} color="#dc2626" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ADMIN: MESSAGES ─── */
function AdminMessages({ messages, updateMessages, logActivity }) {
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState({});

  const markRead = (id) => {
    if (!messages.find(m => m.id === id)?.read) {
      updateMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    }
  };
  const deleteMsg = (id) => {
    updateMessages(messages.filter(m => m.id !== id));
    if (selected === id) setSelected(null);
    logActivity("Message supprimé", "Message supprimé de la boîte de réception", "settings");
  };
  const markAllRead = () => {
    updateMessages(messages.map(m => ({ ...m, read: true })));
    logActivity("Messages lus", "Tous les messages marqués comme lus", "settings");
  };
  const sendReply = (m) => {
    updateMessages(messages.map(msg => msg.id === m.id ? { ...msg, responded: true } : msg));
    setReplySent({ ...replySent, [m.id]: true });
    setReplyText("");
    logActivity("Réponse envoyée", `Réponse envoyée à ${m.name} (${m.email})`, "settings");
    setTimeout(() => setReplySent(prev => ({ ...prev, [m.id]: false })), 3000);
  };

  const sorted = [...messages].sort((a, b) => new Date(b.date) - new Date(a.date));
  const unread = messages.filter(m => !m.read).length;
  const selectedMsg = messages.find(m => m.id === selected);

  const formatDate = (d) => {
    const dt = new Date(d);
    const now = new Date();
    const diff = (now - dt) / 1000;
    if (diff < 3600) return `Il y a ${Math.max(1, Math.floor(diff / 60))} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return dt.toLocaleDateString("fr-CA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{messages.length} message{messages.length > 1 ? "s" : ""}</p>
          {unread > 0 && <span style={{ fontSize: 12, background: "#dbeafe", color: "#1e40af", padding: "3px 10px", borderRadius: 10, fontWeight: 600 }}>{unread} non lu{unread > 1 ? "s" : ""}</span>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", color: C.dark, fontSize: 13, cursor: "pointer" }}>
            <Icon type="check" size={14} color={C.dark} /> Tout marquer comme lu
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "360px 1fr" : "1fr", gap: 16 }}>
        {/* MESSAGE LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {sorted.map(m => (
            <div key={m.id}
              onClick={() => { setSelected(m.id); markRead(m.id); }}
              style={{ background: selected === m.id ? `${C.red}08` : m.read ? "#fff" : "#f0f7ff", borderRadius: 12, padding: "14px 16px", border: selected === m.id ? `2px solid ${C.red}44` : `1px solid ${m.read ? C.border : "#bfdbfe"}`, cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {!m.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />}
                  <span style={{ fontSize: 14, fontWeight: m.read ? 500 : 700, color: C.dark }}>{m.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {m.responded && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#dcfce7", color: "#166534" }}>Répondu</span>}
                  <span style={{ fontSize: 11, color: C.muted }}>{formatDate(m.date)}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 2px" }}>{m.email}</p>
              <p style={{ fontSize: 13, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 40, textAlign: "center", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>📭</span>
              <p style={{ fontSize: 16, fontWeight: 600, color: C.dark, margin: "0 0 4px" }}>Aucun message</p>
              <p style={{ fontSize: 13, color: C.muted }}>Les messages du formulaire de contact apparaîtront ici.</p>
            </div>
          )}
        </div>

        {/* MESSAGE DETAIL */}
        {selected && selectedMsg && (
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 4px" }}>{selectedMsg.name}</h3>
                <a href={`mailto:${selectedMsg.email}`} style={{ fontSize: 14, color: C.red, textDecoration: "none" }}>{selectedMsg.email}</a>
                <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 0" }}>{new Date(selectedMsg.date).toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setSelected(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Icon type="x" size={18} color={C.muted} /></button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "22px 22px 16px" }}>
              <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{selectedMsg.message}</p>
            </div>

            {/* Actions */}
            <div style={{ padding: "0 22px 22px" }}>
              {selectedMsg.responded && !replySent[selectedMsg.id] && (
                <div style={{ background: "#dcfce7", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon type="check" size={14} color="#166534" />
                  <span style={{ fontSize: 13, color: "#166534", fontWeight: 500 }}>Vous avez déjà répondu à ce message</span>
                </div>
              )}
              {replySent[selectedMsg.id] && (
                <div style={{ background: "#dcfce7", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon type="check" size={14} color="#166534" />
                  <span style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>Réponse envoyée !</span>
                </div>
              )}

              <div style={{ background: C.light, borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Répondre à {selectedMsg.name}</p>
                <textarea placeholder="Tapez votre réponse..." value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }} />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => sendReply(selectedMsg)} disabled={!replyText.trim()}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: C.hibiscus, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: !replyText.trim() ? 0.5 : 1 }}>
                    <Icon type="send" size={14} color="#fff" /> Envoyer par courriel
                  </button>
                  <a href={`https://wa.me/?text=${encodeURIComponent("Bonjour " + selectedMsg.name + ", merci pour votre message. " + replyText)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#fff", color: "#25D366", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    💬 Via WhatsApp
                  </a>
                  <button onClick={() => deleteMsg(selectedMsg.id)}
                    style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 10, border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: 13, cursor: "pointer" }}>
                    <Icon type="trash" size={14} color="#dc2626" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ADMIN: SETTINGS (GESTION ADMIN) ─── */
function AdminSettings({ settings, updateSettings, activity, logActivity, products, reviews, blogs, locations, subscribers }) {
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState(false);

  const saveProfile = () => {
    updateSettings({ ...settings, ...form });
    logActivity("Profil modifié", "Informations entreprise mises à jour", "settings");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = () => {
    if (passForm.current !== settings.password) {
      setPassMsg("Mot de passe actuel incorrect."); setPassError(true); return;
    }
    if (passForm.newPass.length < 4) {
      setPassMsg("Le nouveau mot de passe doit avoir au moins 4 caractères."); setPassError(true); return;
    }
    if (passForm.newPass !== passForm.confirm) {
      setPassMsg("Les mots de passe ne correspondent pas."); setPassError(true); return;
    }
    updateSettings({ ...settings, password: passForm.newPass });
    logActivity("Mot de passe modifié", "Le mot de passe admin a été changé", "auth");
    setPassForm({ current: "", newPass: "", confirm: "" });
    setPassMsg("Mot de passe modifié avec succès !"); setPassError(false);
    setTimeout(() => setPassMsg(""), 3000);
  };

  const exportData = () => {
    const data = { exportDate: new Date().toISOString(), products, reviews, blogs, locations, subscribers, settings: { ...settings, password: "***" } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bens-export-${new Date().toISOString().split("T")[0]}.json`; a.click();
    URL.revokeObjectURL(url);
    logActivity("Export données", "Toutes les données exportées en JSON", "settings");
  };

  const resetAll = () => {
    if (window.confirm("⚠️ Êtes-vous sûre de vouloir réinitialiser toutes les données ? Cette action est irréversible.")) {
      ["bens-products", "bens-reviews", "bens-blogs", "bens-locations", "bens-subscribers", "bens-settings", "bens-activity"].forEach(async k => {
        try { await window.storage.delete(k); } catch (e) { console.error(e); }
      });
      logActivity("Réinitialisation", "Toutes les données ont été réinitialisées", "settings");
      window.location.reload();
    }
  };

  const tabs = [
    { id: "profile", label: "Profil entreprise", icon: "shop" },
    { id: "password", label: "Sécurité", icon: "shield" },
    { id: "site", label: "Paramètres site", icon: "settings" },
    { id: "activity", label: "Journal d'activité", icon: "clock" },
    { id: "data", label: "Données", icon: "download" },
  ];

  const activityIcons = { auth: "🔐", product: "🍹", review: "⭐", blog: "📝", location: "📍", settings: "⚙️", newsletter: "📧" };
  const activityColors = { auth: "#8b5cf6", product: C.red, review: "#f59e0b", blog: C.green, location: "#2563eb", settings: "#6b7280", newsletter: "#ec4899" };

  const formatDate = (d) => {
    const dt = new Date(d);
    const now = new Date();
    const diff = (now - dt) / 1000;
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return dt.toLocaleDateString("fr-CA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: tab === t.id ? `2px solid ${C.red}` : `1px solid ${C.border}`, background: tab === t.id ? `${C.red}12` : "#fff", color: tab === t.id ? C.red : C.muted, cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400 }}>
            <Icon type={t.icon} size={15} color={tab === t.id ? C.red : C.muted} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── PROFIL ENTREPRISE ─── */}
      {tab === "profile" && (
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
          {saved && (
            <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}44`, borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <Icon type="check" size={16} color={C.green} /><span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>Profil sauvegardé avec succès !</span>
            </div>
          )}
          <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>Profil de l'entreprise</h3>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Ces informations apparaissent sur votre site public et dans vos communications.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelSt}>Nom de l'entreprise</label>
              <input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} style={inputSt} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={labelSt}>Courriel</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputSt} /></div>
              <div><label style={labelSt}>Téléphone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputSt} /></div>
            </div>
            <div><label style={labelSt}>Adresse</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputSt} /></div>
            <div><label style={labelSt}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }} /></div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 12 }}>Réseaux sociaux</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>📘</span>
                  <input placeholder="Lien Facebook" value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} style={{ ...inputSt, flex: 1 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>📸</span>
                  <input placeholder="Lien Instagram" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} style={{ ...inputSt, flex: 1 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>🎵</span>
                  <input placeholder="Lien TikTok" value={form.tiktok} onChange={e => setForm({ ...form, tiktok: e.target.value })} style={{ ...inputSt, flex: 1 }} />
                </div>
              </div>
            </div>

            <button onClick={saveProfile} style={{ padding: "14px", borderRadius: 12, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Sauvegarder le profil
            </button>
          </div>
        </div>
      )}

      {/* ─── SÉCURITÉ ─── */}
      {tab === "password" && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#8b5cf615", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon type="shield" size={22} color="#8b5cf6" />
              </div>
              <div>
                <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Changer le mot de passe</h3>
                <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Modifiez le mot de passe d'accès admin</p>
              </div>
            </div>
            {passMsg && (
              <div style={{ background: passError ? "#fef2f2" : `${C.green}12`, border: `1px solid ${passError ? "#fca5a5" : C.green + "44"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: passError ? "#dc2626" : C.green, fontWeight: 500 }}>
                {passMsg}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={labelSt}>Mot de passe actuel</label><input type="password" value={passForm.current} onChange={e => setPassForm({ ...passForm, current: e.target.value })} style={inputSt} /></div>
              <div><label style={labelSt}>Nouveau mot de passe</label><input type="password" value={passForm.newPass} onChange={e => setPassForm({ ...passForm, newPass: e.target.value })} style={inputSt} /></div>
              <div><label style={labelSt}>Confirmer le nouveau mot de passe</label><input type="password" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} style={inputSt} /></div>
              <button onClick={changePassword} disabled={!passForm.current || !passForm.newPass || !passForm.confirm}
                style={{ padding: "14px", borderRadius: 12, border: "none", background: "#8b5cf6", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: !passForm.current || !passForm.newPass || !passForm.confirm ? 0.5 : 1 }}>
                Modifier le mot de passe
              </button>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px", color: C.dark }}>Dernières connexions</h4>
            {activity.filter(a => a.type === "auth").slice(0, 5).map(a => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, color: C.text }}>{a.action}</span>
                <span style={{ fontSize: 12, color: C.muted }}>{formatDate(a.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PARAMÈTRES SITE ─── */}
      {tab === "site" && (
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
          <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>Paramètres du site</h3>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Personnalisez le contenu affiché sur votre site web.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={labelSt}>Titre principal (Hero)</label><input value={form.heroTitle} onChange={e => setForm({ ...form, heroTitle: e.target.value })} style={inputSt} /></div>
            <div><label style={labelSt}>Sous-titre (Hero)</label><textarea value={form.heroSubtitle} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })} rows={2} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={labelSt}>Devise</label>
                <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={inputSt}>
                  <option value="CAD">CAD ($)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div><label style={labelSt}>Taux de taxe (%)</label><input type="number" step="0.001" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })} style={inputSt} /></div>
            </div>
            <div><label style={labelSt}>Note de livraison</label><input value={form.deliveryNote} onChange={e => setForm({ ...form, deliveryNote: e.target.value })} style={inputSt} /></div>
            <div><label style={labelSt}>URL du site web</label><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} style={inputSt} /></div>
            <button onClick={saveProfile} style={{ padding: "14px", borderRadius: 12, border: "none", background: C.hibiscus, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Sauvegarder les paramètres
            </button>
          </div>
        </div>
      )}

      {/* ─── JOURNAL D'ACTIVITÉ ─── */}
      {tab === "activity" && (
        <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden", maxWidth: 700 }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Journal d'activité</h3>
              <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 0" }}>Historique des 50 dernières actions dans le panneau admin</p>
            </div>
            <span style={{ fontSize: 12, color: C.muted, background: C.light, padding: "4px 12px", borderRadius: 6 }}>{activity.length} entrées</span>
          </div>
          <div style={{ maxHeight: 500, overflow: "auto" }}>
            {activity.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: C.muted }}>
                <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>📋</span>
                <p>Aucune activité enregistrée.</p>
              </div>
            ) : activity.map((a, i) => (
              <div key={a.id} style={{ padding: "14px 22px", borderBottom: i < activity.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${activityColors[a.type] || "#6b7280"}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                  {activityIcons[a.type] || "📋"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, margin: 0 }}>{a.action}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</p>
                </div>
                <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(a.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── DONNÉES ─── */}
      {tab === "data" && (
        <div style={{ maxWidth: 600 }}>
          {/* Stats summary */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Résumé des données</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Produits", count: products.length, icon: "🍹" },
                { label: "Avis", count: reviews.length, icon: "⭐" },
                { label: "Articles", count: blogs.length, icon: "📝" },
                { label: "Points de vente", count: locations.length, icon: "📍" },
                { label: "Abonnés", count: subscribers.length, icon: "📧" },
                { label: "Activités", count: activity.length, icon: "📋" },
              ].map((d, i) => (
                <div key={i} style={{ background: C.light, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                  <span style={{ fontSize: 22, display: "block", marginBottom: 4 }}>{d.icon}</span>
                  <p style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: 0 }}>{d.count}</p>
                  <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0" }}>{d.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#2563eb15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon type="download" size={22} color="#2563eb" />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.dark }}>Exporter les données</h4>
                <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Téléchargez toutes vos données en format JSON</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>
              L'export inclut tous vos produits, avis clients, articles de blogue, points de vente et abonnés. Utile pour faire une sauvegarde ou transférer vos données.
            </p>
            <button onClick={exportData} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Icon type="download" size={16} color="#fff" /> Télécharger l'export JSON
            </button>
          </div>

          {/* Reset */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #fca5a5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#dc262615", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon type="refresh" size={22} color="#dc2626" />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#dc2626" }}>Zone dangereuse</h4>
                <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Actions irréversibles</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>
              Réinitialiser toutes les données aux valeurs par défaut. Cette action supprimera toutes vos modifications (produits, avis, articles, etc.).
            </p>
            <button onClick={resetAll} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "2px solid #dc2626", background: "#fff", color: "#dc2626", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Icon type="trash" size={16} color="#dc2626" /> Réinitialiser toutes les données
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SHARED STYLES ─── */
const labelSt = { display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 };
const inputSt = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#faf6f0", color: C.dark };
