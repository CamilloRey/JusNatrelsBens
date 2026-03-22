// Multi-language support - French, English, Spanish

export type Language = 'fr' | 'en' | 'es'

export interface Translations {
  // Navigation
  nav: {
    home: string
    shop: string
    blog: string
    recipes: string
    locations: string
    admin: string
    account: string
    logout: string
    login: string
    signup: string
  }

  // Shopping
  shop: {
    addToCart: string
    removeFromCart: string
    viewCart: string
    checkout: string
    continueShopping: string
    emptyCart: string
    total: string
    quantity: string
    price: string
    format: string
  }

  // Payments
  payment: {
    cardPayment: string
    digitalWallet: string
    cash: string
    processing: string
    success: string
    failed: string
    completed: string
    refunded: string
    pending: string
  }

  // Orders
  orders: {
    orderHistory: string
    orderNumber: string
    orderDate: string
    orderStatus: string
    trackOrder: string
    estimatedDelivery: string
    shipped: string
    delivered: string
    cancelled: string
  }

  // Admin
  admin: {
    dashboard: string
    products: string
    orders: string
    payments: string
    analytics: string
    reports: string
    inventory: string
    reviews: string
    settings: string
    users: string
  }

  // Inventory
  inventory: {
    lowStock: string
    outOfStock: string
    stockLevel: string
    reorderPoint: string
    alert: string
    alerts: string
    alertSettings: string
  }

  // Analytics
  analytics: {
    sales: string
    revenue: string
    customers: string
    orders: string
    topProducts: string
    recentOrders: string
    chartTitle: string
    period: string
    daily: string
    weekly: string
    monthly: string
    yearly: string
  }

  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    add: string
    back: string
    loading: string
    error: string
    success: string
    warning: string
    info: string
    close: string
    search: string
    filter: string
    sort: string
    export: string
  }

  // Auth
  auth: {
    login: string
    signup: string
    email: string
    password: string
    confirmPassword: string
    forgotPassword: string
    resetPassword: string
    loginSuccess: string
    logoutSuccess: string
    invalidCredentials: string
  }

  // Reviews
  reviews: {
    reviews: string
    rating: string
    writeReview: string
    viewReviews: string
    pending: string
    approved: string
    rejected: string
    moderate: string
  }

  // Newsletter
  newsletter: {
    subscribe: string
    email: string
    subscribeSuccess: string
    alreadySubscribed: string
    unsubscribe: string
  }
}

// French translations
export const FR: Translations = {
  nav: {
    home: 'Accueil',
    shop: 'Boutique',
    blog: 'Blog',
    recipes: 'Recettes',
    locations: 'Lieux',
    admin: 'Admin',
    account: 'Mon Compte',
    logout: 'Déconnexion',
    login: 'Connexion',
    signup: 'Inscription',
  },
  shop: {
    addToCart: 'Ajouter au Panier',
    removeFromCart: 'Retirer du Panier',
    viewCart: 'Voir Panier',
    checkout: 'Passer la Commande',
    continueShopping: 'Continuer les Achats',
    emptyCart: 'Panier Vide',
    total: 'Total',
    quantity: 'Quantité',
    price: 'Prix',
    format: 'Format',
  },
  payment: {
    cardPayment: 'Paiement par Carte',
    digitalWallet: 'Portefeuille Numérique',
    cash: 'Espèces',
    processing: 'Traitement...',
    success: 'Succès',
    failed: 'Échoué',
    completed: 'Complété',
    refunded: 'Remboursé',
    pending: 'En Attente',
  },
  orders: {
    orderHistory: 'Historique des Commandes',
    orderNumber: 'Numéro de Commande',
    orderDate: 'Date de Commande',
    orderStatus: 'Statut de la Commande',
    trackOrder: 'Suivre la Commande',
    estimatedDelivery: 'Livraison Estimée',
    shipped: 'Expédié',
    delivered: 'Livré',
    cancelled: 'Annulé',
  },
  admin: {
    dashboard: 'Tableau de Bord',
    products: 'Produits',
    orders: 'Commandes',
    payments: 'Paiements',
    analytics: 'Analytique',
    reports: 'Rapports',
    inventory: 'Inventaire',
    reviews: 'Avis',
    settings: 'Paramètres',
    users: 'Utilisateurs',
  },
  inventory: {
    lowStock: 'Stock Faible',
    outOfStock: 'Rupture de Stock',
    stockLevel: 'Niveau de Stock',
    reorderPoint: 'Point de Réapprovisionnement',
    alert: 'Alerte',
    alerts: 'Alertes',
    alertSettings: 'Paramètres des Alertes',
  },
  analytics: {
    sales: 'Ventes',
    revenue: 'Chiffre d\'Affaires',
    customers: 'Clients',
    orders: 'Commandes',
    topProducts: 'Meilleurs Produits',
    recentOrders: 'Commandes Récentes',
    chartTitle: 'Graphique',
    period: 'Période',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',
  },
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    back: 'Retour',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Information',
    close: 'Fermer',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    export: 'Exporter',
  },
  auth: {
    login: 'Connexion',
    signup: 'Inscription',
    email: 'E-mail',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    forgotPassword: 'Mot de Passe Oublié',
    resetPassword: 'Réinitialiser le Mot de Passe',
    loginSuccess: 'Connexion Réussie',
    logoutSuccess: 'Déconnexion Réussie',
    invalidCredentials: 'Identifiants Invalides',
  },
  reviews: {
    reviews: 'Avis',
    rating: 'Note',
    writeReview: 'Écrire un Avis',
    viewReviews: 'Voir les Avis',
    pending: 'En Attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    moderate: 'Modérer',
  },
  newsletter: {
    subscribe: 'S\'abonner',
    email: 'E-mail',
    subscribeSuccess: 'Abonnement Réussi',
    alreadySubscribed: 'Déjà Abonné',
    unsubscribe: 'Se Désabonner',
  },
}

// English translations
export const EN: Translations = {
  nav: {
    home: 'Home',
    shop: 'Shop',
    blog: 'Blog',
    recipes: 'Recipes',
    locations: 'Locations',
    admin: 'Admin',
    account: 'My Account',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
  },
  shop: {
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove from Cart',
    viewCart: 'View Cart',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    quantity: 'Quantity',
    price: 'Price',
    format: 'Format',
  },
  payment: {
    cardPayment: 'Card Payment',
    digitalWallet: 'Digital Wallet',
    cash: 'Cash',
    processing: 'Processing...',
    success: 'Success',
    failed: 'Failed',
    completed: 'Completed',
    refunded: 'Refunded',
    pending: 'Pending',
  },
  orders: {
    orderHistory: 'Order History',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    orderStatus: 'Order Status',
    trackOrder: 'Track Order',
    estimatedDelivery: 'Estimated Delivery',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  admin: {
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    payments: 'Payments',
    analytics: 'Analytics',
    reports: 'Reports',
    inventory: 'Inventory',
    reviews: 'Reviews',
    settings: 'Settings',
    users: 'Users',
  },
  inventory: {
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    stockLevel: 'Stock Level',
    reorderPoint: 'Reorder Point',
    alert: 'Alert',
    alerts: 'Alerts',
    alertSettings: 'Alert Settings',
  },
  analytics: {
    sales: 'Sales',
    revenue: 'Revenue',
    customers: 'Customers',
    orders: 'Orders',
    topProducts: 'Top Products',
    recentOrders: 'Recent Orders',
    chartTitle: 'Chart',
    period: 'Period',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    back: 'Back',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
  },
  auth: {
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    loginSuccess: 'Login Successful',
    logoutSuccess: 'Logout Successful',
    invalidCredentials: 'Invalid Credentials',
  },
  reviews: {
    reviews: 'Reviews',
    rating: 'Rating',
    writeReview: 'Write a Review',
    viewReviews: 'View Reviews',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    moderate: 'Moderate',
  },
  newsletter: {
    subscribe: 'Subscribe',
    email: 'Email',
    subscribeSuccess: 'Subscription Successful',
    alreadySubscribed: 'Already Subscribed',
    unsubscribe: 'Unsubscribe',
  },
}

// Spanish translations
export const ES: Translations = {
  nav: {
    home: 'Inicio',
    shop: 'Tienda',
    blog: 'Blog',
    recipes: 'Recetas',
    locations: 'Ubicaciones',
    admin: 'Admin',
    account: 'Mi Cuenta',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
  },
  shop: {
    addToCart: 'Agregar al Carrito',
    removeFromCart: 'Quitar del Carrito',
    viewCart: 'Ver Carrito',
    checkout: 'Realizar Compra',
    continueShopping: 'Continuar Comprando',
    emptyCart: 'Tu carrito está vacío',
    total: 'Total',
    quantity: 'Cantidad',
    price: 'Precio',
    format: 'Formato',
  },
  payment: {
    cardPayment: 'Pago con Tarjeta',
    digitalWallet: 'Billetera Digital',
    cash: 'Efectivo',
    processing: 'Procesando...',
    success: 'Éxito',
    failed: 'Fallido',
    completed: 'Completado',
    refunded: 'Reembolsado',
    pending: 'Pendiente',
  },
  orders: {
    orderHistory: 'Historial de Pedidos',
    orderNumber: 'Número de Pedido',
    orderDate: 'Fecha del Pedido',
    orderStatus: 'Estado del Pedido',
    trackOrder: 'Rastrear Pedido',
    estimatedDelivery: 'Entrega Estimada',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  },
  admin: {
    dashboard: 'Panel de Control',
    products: 'Productos',
    orders: 'Pedidos',
    payments: 'Pagos',
    analytics: 'Análisis',
    reports: 'Informes',
    inventory: 'Inventario',
    reviews: 'Reseñas',
    settings: 'Configuración',
    users: 'Usuarios',
  },
  inventory: {
    lowStock: 'Stock Bajo',
    outOfStock: 'Agotado',
    stockLevel: 'Nivel de Stock',
    reorderPoint: 'Punto de Reorden',
    alert: 'Alerta',
    alerts: 'Alertas',
    alertSettings: 'Configuración de Alertas',
  },
  analytics: {
    sales: 'Ventas',
    revenue: 'Ingresos',
    customers: 'Clientes',
    orders: 'Pedidos',
    topProducts: 'Productos Principales',
    recentOrders: 'Pedidos Recientes',
    chartTitle: 'Gráfico',
    period: 'Período',
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',
  },
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    back: 'Atrás',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    close: 'Cerrar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    export: 'Exportar',
  },
  auth: {
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    forgotPassword: 'Olvidé la Contraseña',
    resetPassword: 'Restablecer Contraseña',
    loginSuccess: 'Inicio de Sesión Exitoso',
    logoutSuccess: 'Cierre de Sesión Exitoso',
    invalidCredentials: 'Credenciales Inválidas',
  },
  reviews: {
    reviews: 'Reseñas',
    rating: 'Calificación',
    writeReview: 'Escribir una Reseña',
    viewReviews: 'Ver Reseñas',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    moderate: 'Moderar',
  },
  newsletter: {
    subscribe: 'Suscribirse',
    email: 'Correo Electrónico',
    subscribeSuccess: 'Suscripción Exitosa',
    alreadySubscribed: 'Ya Suscrito',
    unsubscribe: 'Desuscribirse',
  },
}

// Get translations for a language
export function getTranslations(language: Language): Translations {
  switch (language) {
    case 'en':
      return EN
    case 'es':
      return ES
    case 'fr':
    default:
      return FR
  }
}

// Language utilities
export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]
