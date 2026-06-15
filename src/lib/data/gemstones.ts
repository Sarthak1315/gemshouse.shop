export interface GemstoneProduct {
  id: string;
  title: string;
  category: string;
  carat: number;
  cut: string;
  origin: string;
  clarity: string;
  certificate: string;
  imageUrl: string;
  price: number;
  badge: string;
  // Extended PDP specs
  images: string[];
  dimensions: string;
  depth: string;
  table: string;
  culet: string;
  fluorescence: string;
  extendedDescription: string;
  reportNumber: string;
}

export const gemstones: GemstoneProduct[] = [
  {
    id: "gem-1",
    title: "Royal Blue Ceylon Sapphire",
    category: "Sapphire",
    carat: 8.42,
    cut: "Cushion Cut",
    origin: "Ceylon (Sri Lanka)",
    clarity: "VVS1",
    certificate: "GIA, Gübelin",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6RQcZsgMyZ9FNqTLFEY-SJv_isBPC3Rxq0-tmCuoq-KWppNaH2-LeC1_A1PB1C6GcGZHruUxgIVkQsNZIqOis0LqO_vMz12xiubGix7GT5FA-hkeT37x4Nuzhh7_B0Ki4pEfgcSfNHCeFr3Tly2dR32iPMc3uVUB0TlnSGhD-aPEc_82f-6vBNoGiG2R5VYr1Pwi73z108U4vUyr9TBDbC2Tff0UVNyziWLx-e-xHrF6s8ZTrHu-jtiNflbDRbQoMrol-3rq4ovv7",
    price: 125000,
    badge: "Investment Grade",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6RQcZsgMyZ9FNqTLFEY-SJv_isBPC3Rxq0-tmCuoq-KWppNaH2-LeC1_A1PB1C6GcGZHruUxgIVkQsNZIqOis0LqO_vMz12xiubGix7GT5FA-hkeT37x4Nuzhh7_B0Ki4pEfgcSfNHCeFr3Tly2dR32iPMc3uVUB0TlnSGhD-aPEc_82f-6vBNoGiG2R5VYr1Pwi73z108U4vUyr9TBDbC2Tff0UVNyziWLx-e-xHrF6s8ZTrHu-jtiNflbDRbQoMrol-3rq4ovv7",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH"
    ],
    dimensions: "12.45 x 11.12 x 7.30 mm",
    depth: "65.6%",
    table: "58%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "Sourced from the historic gravel deposits of Ratnapura, Sri Lanka. This royal blue sapphire displays an exceptional velvet saturation and is completely free of any thermal enhancement (unheated). A truly rare crystal suitable for the finest collector vaults.",
    reportNumber: "GIA-2235998104"
  },
  {
    id: "gem-2",
    title: "Mogok Pigeon Blood Ruby",
    category: "Ruby",
    carat: 4.15,
    cut: "Oval Cut",
    origin: "Burma (Myanmar)",
    clarity: "VS1",
    certificate: "SSEF, GRS",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZmeIBg5lwpwaFWPAa5K9llpVvR_OmtGmrICjj871Cwsje-1Z4cPi9JnvU7if3nCoAV9lskf0tXMMwrPlSXnd4VwDLotIxOaPWC3D-CNr4RD3xKgD8Ivn9DCc_bmSaClZZlGFP3wSVlQQD1Or3Onyp_DESjkKtD0Eq1ZcFgQLVcp7hcGmyzPZ7x0Lqvm2nV3t5mAwaXQyfndG8qmjcZ7SAlt49CLae3tfI7CKpRaWeJTspqh-dNaUOPlsnF94oVESxlm7M0YBnS10_",
    price: 280000,
    badge: "Rare",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZmeIBg5lwpwaFWPAa5K9llpVvR_OmtGmrICjj871Cwsje-1Z4cPi9JnvU7if3nCoAV9lskf0tXMMwrPlSXnd4VwDLotIxOaPWC3D-CNr4RD3xKgD8Ivn9DCc_bmSaClZZlGFP3wSVlQQD1Or3Onyp_DESjkKtD0Eq1ZcFgQLVcp7hcGmyzPZ7x0Lqvm2nV3t5mAwaXQyfndG8qmjcZ7SAlt49CLae3tfI7CKpRaWeJTspqh-dNaUOPlsnF94oVESxlm7M0YBnS10_",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G"
    ],
    dimensions: "9.82 x 8.12 x 5.92 mm",
    depth: "72.9%",
    table: "62%",
    culet: "Very Small",
    fluorescence: "Strong Red (Natural)",
    extendedDescription: "Unearthed from the legendary Mogok Valley in Myanmar. This specimen exhibits the intense fluorescence that is characteristic of the finest Burmese rubies. Certified as Pigeon Blood red by both GRS and SSEF.",
    reportNumber: "GRS-2024-8741"
  },
  {
    id: "gem-3",
    title: "Vivid Colombian Emerald",
    category: "Emerald",
    carat: 12.05,
    cut: "Emerald Cut",
    origin: "Colombia",
    clarity: "SI1",
    certificate: "AGL",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7w2GY7TDAFYByKx1rxFGG15na3TxfOB4lhqILIL-UJ-5vmo_Urkj2pmmzapU7ba4b6o4Jm7KPSK4f9LanecfKJkPaXNkxuAurY3w0EI56rEkU260aypqBYwRt9--YBaM8J_WrLEMFx0__WEa9klDepcbvhEm5KjHwoUDVM3uYw-vR4JLGMU2dqHBGWGQIvkrlDYELDGe0sw4bDzm2Dl1Phk5N-07rh_3MorP53shMq-1JnDAWuPuuqQ2ctW-1FUb7hxlbEackqCWT",
    price: 185000,
    badge: "Collector's Choice",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7w2GY7TDAFYByKx1rxFGG15na3TxfOB4lhqILIL-UJ-5vmo_Urkj2pmmzapU7ba4b6o4Jm7KPSK4f9LanecfKJkPaXNkxuAurY3w0EI56rEkU260aypqBYwRt9--YBaM8J_WrLEMFx0__WEa9klDepcbvhEm5KjHwoUDVM3uYw-vR4JLGMU2dqHBGWGQIvkrlDYELDGe0sw4bDzm2Dl1Phk5N-07rh_3MorP53shMq-1JnDAWuPuuqQ2ctW-1FUb7hxlbEackqCWT",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4Cca5I5N9aNG_CxkpcmRo3xRwGlq5fiEgUG4nf4pNX7DPWg2Nlq1sKSRyVN3HTqvwAJE9bb1vSQhBva_DDuQKclfg_YtTOEKNeAg2mSHH_3La3mApCMLDnmZI4dfPR8kyeItbTY3vWcnMPd2HPrPdEuVzC-Y9008crgF8EjwxhfrkUyj4j2gyQiW2VvCuWGb8HjKuCvbOqb4j1fGkhCvDvBsyDT6vu9onuqKX2riI_2vxQ893ktC8mcEaFgbiTfLbN2x-hYc8--"
    ],
    dimensions: "14.82 x 12.14 x 8.42 mm",
    depth: "69.2%",
    table: "57%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "A massive, deep green emerald from the Muzo mine in Colombia. It features a visible, natural 'jardin' inclusion pattern that certifies its authenticity, with only minor clarity enhancement (insignificant oil).",
    reportNumber: "AGL-1092837"
  },
  {
    id: "gem-4",
    title: "Fancy Intense Yellow Diamond",
    category: "Diamond",
    carat: 3.20,
    cut: "Radiant Cut",
    origin: "South Africa",
    clarity: "VVS2",
    certificate: "GIA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3SoUOa3N3pLiBylikbr7TjBlxahWLQvbgIbqvy4gMA7L5igXjYYkFahBoT2O_PTMCBZn_JovsOyNg68iQckfn1M5EyPp1nlwniH7stMC6eLh7FEVv9KC_t1D_jjZgO2NUSBPpZsZraDAJhJb4CaPdduY5PykPFkZSuwpq7iEv7O-B__krjWPYxadiEAjDBj-6b4yuScWv9u3DoajQRl2PEALHaZCQB-SkMLGgEqx3dZEU87k7qlqYJ6xbNMAy18DoXl3b8EPI7Jqs",
    price: 95000,
    badge: "Certified Ideal",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3SoUOa3N3pLiBylikbr7TjBlxahWLQvbgIbqvy4gMA7L5igXjYYkFahBoT2O_PTMCBZn_JovsOyNg68iQckfn1M5EyPp1nlwniH7stMC6eLh7FEVv9KC_t1D_jjZgO2NUSBPpZsZraDAJhJb4CaPdduY5PykPFkZSuwpq7iEv7O-B__krjWPYxadiEAjDBj-6b4yuScWv9u3DoajQRl2PEALHaZCQB-SkMLGgEqx3dZEU87k7qlqYJ6xbNMAy18DoXl3b8EPI7Jqs",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuA7en7XTRdnXtvQ4b2CRpJ8ek-qWd8mpm3D607JMN-ZIXBGFRK8T6b5lYRZ6qtWpIMPfK0ugXXlTgV_AZKNoTOpLs6e4EXkJZehkxdRR-AOQ3wqjkUbGBbpUwbqXxJetJjS3a83h2ALq3L_6ZrKGhvtiBBKAY0ULeLekp3GCotUIbgB6_5I8fB2wgN9DYr5O7wj822ugauWssRJaUmWAkd3coeqTel7yi5zuNb6UrrQhZpOPFqHM8SjbStiXMJ-7bYcKnFGVfypQ-"
    ],
    dimensions: "9.14 x 8.87 x 5.92 mm",
    depth: "66.7%",
    table: "60%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "A brilliant fancy intense yellow diamond, displaying perfect cushion radiant proportions. Certified as VVS2 clarity by GIA. Sourced from premier South African diamond deposits, and exhibiting Type Ib characteristics.",
    reportNumber: "GIA-2201994380"
  },
  {
    id: "gem-5",
    title: "Vivid Mahenge Spinel",
    category: "Spinel",
    carat: 5.30,
    cut: "Cushion Cut",
    origin: "Madagascar",
    clarity: "VS2",
    certificate: "GRS",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G",
    price: 45000,
    badge: "Fine Color",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH"
    ],
    dimensions: "10.42 x 9.87 x 6.12 mm",
    depth: "62.0%",
    table: "59%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "A vivid neon-pink spinel displaying typical Mahenge-style orange-red highlights. Highly saturated, clean crystal that sparkles intensely under all lighting conditions.",
    reportNumber: "GRS-2024-1928"
  },
  {
    id: "gem-6",
    title: "Kashmir Blue Sapphire",
    category: "Sapphire",
    carat: 5.84,
    cut: "Cushion Cut",
    origin: "Ceylon (Sri Lanka)",
    clarity: "VVS2",
    certificate: "SSEF, Gübelin",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH",
    price: 320000,
    badge: "Extremely Rare",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6RQcZsgMyZ9FNqTLFEY-SJv_isBPC3Rxq0-tmCuoq-KWppNaH2-LeC1_A1PB1C6GcGZHruUxgIVkQsNZIqOis0LqO_vMz12xiubGix7GT5FA-hkeT37x4Nuzhh7_B0Ki4pEfgcSfNHCeFr3Tly2dR32iPMc3uVUB0TlnSGhD-aPEc_82f-6vBNoGiG2R5VYr1Pwi73z108U4vUyr9TBDbC2Tff0UVNyziWLx-e-xHrF6s8ZTrHu-jtiNflbDRbQoMrol-3rq4ovv7"
    ],
    dimensions: "10.82 x 9.87 x 6.42 mm",
    depth: "65.0%",
    table: "56%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "Boasting a velvety, saturated cornflower blue hue, this sapphire mimics the legendary, long-extinct Kashmir mines. Fully unheated, this cushion cut sapphire was sourced from high-elevation gravels in Ceylon.",
    reportNumber: "SSEF-2024-0082"
  },
  {
    id: "gem-7",
    title: "Burmese Pink Sapphire",
    category: "Sapphire",
    carat: 6.12,
    cut: "Oval Cut",
    origin: "Burma (Myanmar)",
    clarity: "VS1",
    certificate: "GRS",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH",
    price: 78000,
    badge: "Rare Saturated",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6RQcZsgMyZ9FNqTLFEY-SJv_isBPC3Rxq0-tmCuoq-KWppNaH2-LeC1_A1PB1C6GcGZHruUxgIVkQsNZIqOis0LqO_vMz12xiubGix7GT5FA-hkeT37x4Nuzhh7_B0Ki4pEfgcSfNHCeFr3Tly2dR32iPMc3uVUB0TlnSGhD-aPEc_82f-6vBNoGiG2R5VYr1Pwi73z108U4vUyr9TBDbC2Tff0UVNyziWLx-e-xHrF6s8ZTrHu-jtiNflbDRbQoMrol-3rq4ovv7"
    ],
    dimensions: "11.12 x 9.30 x 6.12 mm",
    depth: "65.8%",
    table: "59%",
    culet: "None",
    fluorescence: "Medium Pink",
    extendedDescription: "A hot, vibrant pink sapphire from Mogok. Untreated and unheated, highlighting the supreme trace elements present in Myanmar's marble hosts.",
    reportNumber: "GRS-2023-8831"
  },
  {
    id: "gem-8",
    title: "Muzo Emerald Octagon",
    category: "Emerald",
    carat: 7.45,
    cut: "Emerald Cut",
    origin: "Colombia",
    clarity: "VVS2",
    certificate: "GRS, SSEF",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4Cca5I5N9aNG_CxkpcmRo3xRwGlq5fiEgUG4nf4pNX7DPWg2Nlq1sKSRyVN3HTqvwAJE9bb1vSQhBva_DDuQKclfg_YtTOEKNeAg2mSHH_3La3mApCMLDnmZI4dfPR8kyeItbTY3vWcnMPd2HPrPdEuVzC-Y9008crgF8EjwxhfrkUyj4j2gyQiW2VvCuWGb8HjKuCvbOqb4j1fGkhCvDvBsyDT6vu9onuqKX2riI_2vxQ893ktC8mcEaFgbiTfLbN2x-hYc8--",
    price: 140000,
    badge: "No Oil Specimen",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4Cca5I5N9aNG_CxkpcmRo3xRwGlq5fiEgUG4nf4pNX7DPWg2Nlq1sKSRyVN3HTqvwAJE9bb1vSQhBva_DDuQKclfg_YtTOEKNeAg2mSHH_3La3mApCMLDnmZI4dfPR8kyeItbTY3vWcnMPd2HPrPdEuVzC-Y9008crgF8EjwxhfrkUyj4j2gyQiW2VvCuWGb8HjKuCvbOqb4j1fGkhCvDvBsyDT6vu9onuqKX2riI_2vxQ893ktC8mcEaFgbiTfLbN2x-hYc8--",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7w2GY7TDAFYByKx1rxFGG15na3TxfOB4lhqILIL-UJ-5vmo_Urkj2pmmzapU7ba4b6o4Jm7KPSK4f9LanecfKJkPaXNkxuAurY3w0EI56rEkU260aypqBYwRt9--YBaM8J_WrLEMFx0__WEa9klDepcbvhEm5KjHwoUDVM3uYw-vR4JLGMU2dqHBGWGQIvkrlDYELDGe0sw4bDzm2Dl1Phk5N-07rh_3MorP53shMq-1JnDAWuPuuqQ2ctW-1FUb7hxlbEackqCWT"
    ],
    dimensions: "12.42 x 10.12 x 7.12 mm",
    depth: "70.3%",
    table: "58%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "Mined from the famous Muzo Andes shafts. Highly sought-after clean structure showing virtually no eye-visible inclusions. Completely untreated with zero oil enhancements.",
    reportNumber: "GRS-2024-9901"
  },
  {
    id: "gem-9",
    title: "Fancy Intense Orange Diamond",
    category: "Diamond",
    carat: 2.10,
    cut: "Radiant Cut",
    origin: "South Africa",
    clarity: "IF",
    certificate: "GIA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3SoUOa3N3pLiBylikbr7TjBlxahWLQvbgIbqvy4gMA7L5igXjYYkFahBoT2O_PTMCBZn_JovsOyNg68iQckfn1M5EyPp1nlwniH7stMC6eLh7FEVv9KC_t1D_jjZgO2NUSBPpZsZraDAJhJb4CaPdduY5PykPFkZSuwpq7iEv7O-B__krjWPYxadiEAjDBj-6b4yuScWv9u3DoajQRl2PEALHaZCQB-SkMLGgEqx3dZEU87k7qlqYJ6xbNMAy18DoXl3b8EPI7Jqs",
    price: 165000,
    badge: "Investment Grade",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3SoUOa3N3pLiBylikbr7TjBlxahWLQvbgIbqvy4gMA7L5igXjYYkFahBoT2O_PTMCBZn_JovsOyNg68iQckfn1M5EyPp1nlwniH7stMC6eLh7FEVv9KC_t1D_jjZgO2NUSBPpZsZraDAJhJb4CaPdduY5PykPFkZSuwpq7iEv7O-B__krjWPYxadiEAjDBj-6b4yuScWv9u3DoajQRl2PEALHaZCQB-SkMLGgEqx3dZEU87k7qlqYJ6xbNMAy18DoXl3b8EPI7Jqs",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuA7en7XTRdnXtvQ4b2CRpJ8ek-qWd8mpm3D607JMN-ZIXBGFRK8T6b5lYRZ6qtWpIMPfK0ugXXlTgV_AZKNoTOpLs6e4EXkJZehkxdRR-AOQ3wqjkUbGBbpUwbqXxJetJjS3a83h2ALq3L_6ZrKGhvtiBBKAY0ULeLekp3GCotUIbgB6_5I8fB2wgN9DYr5O7wj822ugauWssRJaUmWAkd3coeqTel7yi5zuNb6UrrQhZpOPFqHM8SjbStiXMJ-7bYcKnFGVfypQ-"
    ],
    dimensions: "8.12 x 7.64 x 5.12 mm",
    depth: "67.0%",
    table: "61%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "Boasting Internally Flawless (IF) grading, this rare intense orange diamond is an asset class of its own. Natural colour certified by GIA laboratories.",
    reportNumber: "GIA-2239018471"
  },
  {
    id: "gem-10",
    title: "Deep Imperial Spinel",
    category: "Spinel",
    carat: 8.90,
    cut: "Cushion Cut",
    origin: "Madagascar",
    clarity: "VS1",
    certificate: "GIA",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G",
    price: 85000,
    badge: "Vivid Luminescence",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH"
    ],
    dimensions: "13.42 x 12.87 x 8.12 mm",
    depth: "63.1%",
    table: "58%",
    culet: "None",
    fluorescence: "None",
    extendedDescription: "A mammoth-sized collector's spinel from Ilakaka, Madagascar. Its crystal structure exhibits a mesmerizing deep orange-red hue that sparkles intensely in natural daylight.",
    reportNumber: "GIA-223400827"
  }
];
