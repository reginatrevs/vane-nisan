/**
 * ============================================================
 *  All site copy, in 3 languages.
 *  en = English, es = Español, tr = Türkçe
 *  Every key must exist in all three (TypeScript enforces it).
 * ============================================================
 */

export const LOCALES = ["en", "es", "tr"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  tr: "TR",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  tr: "Türkçe",
};

const en = {
  meta: {
    title: "{bride} & {groom} — Engagement",
    description:
      "Join us as we celebrate our engagement. Reserve your place.",
  },
  invite: {
    line: "We would love to see you in our happy day",
    scroll: "Scroll",
  },
  details: {
    dressLabel: "Dress code",
    /** Joins the address and the time on one line: "<address> at 18:00". */
    at: "at",
    directions: "Get directions",
    addToCalendar: "Add to calendar",
  },
  rsvp: {
    title: "Will you join us?",
    nameLabel: "Your full name",
    namePlaceholder: "e.g. Ayşe Kaya",
    attendingLabel: "Will you be attending?",
    yes: "Joyfully accepts",
    no: "Regretfully declines",
    guestsLabel: "How many additional guests?",
    noteLabel: "A note for us (optional)",
    notePlaceholder: "A message, a wish, anything…",
    submit: "Send my reply",
    submitting: "Sending…",
    errorRequired: "Please enter your name.",
    errorGeneric: "Something went wrong. Please try again.",
  },
  success: {
    yesTitle: "See you there",
    noTitle: "We'll miss you",
    yesBody:
      "Your place is saved. Keep the code below in case you need to change anything.",
    noBody:
      "Thank you for letting us know. Keep the code below in case anything changes.",
    codeLabel: "Your confirmation code",
    copy: "Copy",
    copied: "Copied",
    editLink: "Change my reply",
    done: "Back to the invitation",
  },
  lookup: {
    title: "Find your reply",
    /** The \n is a deliberate break — FindRsvp renders it with whitespace-pre-line. */
    subtitle: "Enter the confirmation code\nyou were given when you replied.",
    inputLabel: "Confirmation code",
    inputPlaceholder: "ABC123",
    search: "Search",
    searching: "Searching…",
    notFound: "We couldn't find a reply with that code.",
    foundTitle: "Here's your reply",
    attending: "Attending",
    notAttending: "Not attending",
    partySize: "Party of {n}",
    edit: "Edit",
    cancel: "Cancel my reply",
    cancelConfirm: "Are you sure you want to cancel your reply?",
    cancelled: "Your reply has been cancelled.",
    save: "Save changes",
    saved: "Your reply has been updated.",
    back: "Back to the invitation",
  },
  footer: {
    alreadyReplied: "Already replied?",
    lookupLink: "Find or change your reply",
    madeWith: "See you soon, inshallah",
  },
  lang: {
    label: "Language",
  },
} as const;

/**
 * Widen the literal types from `en` so translations only have to match the
 * *shape*, not the exact English strings. Missing or extra keys still error.
 */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

type Dict = Widen<typeof en>;

const es: Dict = {
  meta: {
    title: "{bride} y {groom} — Compromiso",
    description:
      "Acompáñanos a celebrar nuestro compromiso. Reserva tu lugar.",
  },
  invite: {
    line: "Nos encantaría que nos acompañaras en nuestro día especial",
    scroll: "Desliza",
  },
  details: {
    dressLabel: "Código de vestimenta",
    at: "a las",
    directions: "Cómo llegar",
    addToCalendar: "Añadir al calendario",
  },
  rsvp: {
    title: "¿Nos acompañas?",
    nameLabel: "Tu nombre completo",
    namePlaceholder: "ej. María González",
    attendingLabel: "¿Podrás asistir?",
    yes: "Sí, con mucho gusto",
    no: "Lamentablemente no podré",
    guestsLabel: "¿Cuántos acompañantes adicionales?",
    noteLabel: "Un mensaje para nosotros (opcional)",
    notePlaceholder: "Un mensaje, un deseo, lo que sea…",
    submit: "Enviar mi respuesta",
    submitting: "Enviando…",
    errorRequired: "Por favor escribe tu nombre.",
    errorGeneric: "Algo salió mal. Inténtalo de nuevo.",
  },
  success: {
    yesTitle: "Nos vemos allá",
    noTitle: "Te vamos a extrañar",
    yesBody:
      "Tu lugar está reservado. Guarda este código por si necesitas cambiar algo.",
    noBody:
      "Gracias por avisarnos. Guarda este código por si algo cambia.",
    codeLabel: "Tu código de confirmación",
    copy: "Copiar",
    copied: "Copiado",
    editLink: "Cambiar mi respuesta",
    done: "Volver a la invitación",
  },
  lookup: {
    title: "Encuentra tu respuesta",
    subtitle:
      "Escribe el código de confirmación\nque recibiste al responder.",
    inputLabel: "Código de confirmación",
    inputPlaceholder: "ABC123",
    search: "Buscar",
    searching: "Buscando…",
    notFound: "No encontramos ninguna respuesta con ese código.",
    foundTitle: "Aquí está tu respuesta",
    attending: "Asistirá",
    notAttending: "No asistirá",
    partySize: "Grupo de {n}",
    edit: "Editar",
    cancel: "Cancelar mi respuesta",
    cancelConfirm: "¿Seguro que quieres cancelar tu respuesta?",
    cancelled: "Tu respuesta ha sido cancelada.",
    save: "Guardar cambios",
    saved: "Tu respuesta ha sido actualizada.",
    back: "Volver a la invitación",
  },
  footer: {
    alreadyReplied: "¿Ya respondiste?",
    lookupLink: "Busca o cambia tu respuesta",
    madeWith: "Nos vemos pronto, inshallah",
  },
  lang: {
    label: "Idioma",
  },
};

const tr: Dict = {
  meta: {
    title: "{bride} & {groom} — Nişan",
    description: "Nişanımızı birlikte kutlayalım. Yerinizi ayırtın.",
  },
  invite: {
    line: "Bu mutlu günümüzde sizi aramızda görmekten mutluluk duyarız",
    scroll: "Kaydır",
  },
  details: {
    dressLabel: "Kıyafet",
    at: "saat",
    directions: "Yol tarifi al",
    addToCalendar: "Takvime ekle",
  },
  rsvp: {
    title: "Bize katılır mısınız?",
    nameLabel: "Ad Soyad",
    namePlaceholder: "Örn. Ayşe Kaya",
    attendingLabel: "Katılım durumunuz",
    yes: "Memnuniyetle katılacağım",
    no: "Ne yazık ki katılamayacağım",
    guestsLabel: "Yanınızda kaç kişi gelecek?",
    noteLabel: "Bize bir not (isteğe bağlı)",
    notePlaceholder: "Bir mesaj, bir dilek, birkaç güzel söz…",
    submit: "Cevabımı gönder",
    submitting: "Gönderiliyor…",
    errorRequired: "Lütfen adınızı yazın.",
    errorGeneric: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
  },
  success: {
    yesTitle: "Görüşmek üzere!",
    noTitle: "Sizi özleyeceğiz",
    yesBody:
      "Katılımınız kaydedildi. Cevabınızda değişiklik yapmak isterseniz aşağıdaki onay kodunu saklayın.",
    noBody:
      "Bildirdiğiniz için teşekkürler. Bir şey değişirse diye aşağıdaki kodu saklayın.",
    codeLabel: "Onay kodunuz",
    copy: "Kopyala",
    copied: "Kopyalandı",
    editLink: "Cevabımı düzenle",
    done: "Davetiyeye dön",
  },
  lookup: {
    title: "Cevabınızı bulun",
    subtitle: "Cevap verdiğinizde size verilen\nonay kodunu girin.",
    inputLabel: "Onay kodu",
    inputPlaceholder: "ABC123",
    search: "Ara",
    searching: "Aranıyor…",
    notFound: "Bu kodla bir cevap bulamadık.",
    foundTitle: "Cevabınız",
    attending: "Katılıyor",
    notAttending: "Katılmıyor",
    partySize: "{n} kişi",
    edit: "Cevabımı düzenle",
    cancel: "Katılımımı iptal et",
    cancelConfirm: "Cevabınızı iptal etmek istediğinize emin misiniz?",
    cancelled: "Cevabınız iptal edildi.",
    save: "Değişiklikleri kaydet",
    saved: "Cevabınız güncellendi.",
    back: "Davetiyeye dön",
  },
  footer: {
    alreadyReplied: "Daha önce cevap verdiniz mi?",
    lookupLink: "Cevabınızı görüntüleyin veya değiştirin",
    madeWith: "Yakında görüşmek üzere, inşallah",
  },
  lang: {
    label: "Dil",
  },
};

export const dictionaries: Record<Locale, Dict> = { en, es, tr };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Replace {placeholders} in a string. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
