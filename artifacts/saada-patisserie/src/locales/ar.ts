import arTranslations from './fr'; // Fallback to FR structure, then translate manually or use same keys

export default {
  ...arTranslations,
  common: {
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    search: "بحث...",
    back: "رجوع",
    close: "إغلاق",
    menu: "القائمة"
  },
  nav: {
    home: "الرئيسية",
    shop: "المتجر",
    about: "من نحن",
    contact: "اتصل بنا",
    account: "الحساب",
    cart: "سلة التسوق",
    wishlist: "المفضلة"
  },
  // Add other basic translations here
};
