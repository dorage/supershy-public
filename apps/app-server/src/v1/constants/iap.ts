const createIAPItem = (props: { coin: number }) => props;

export const IAP = {
  open: createIAPItem({ coin: 100 }),
  join: createIAPItem({ coin: 300 }),
  create: createIAPItem({ coin: 500 }),
};

export const IAPConsumableReward: any = {
  coin_100: 100,
  coin_500: 500,
  coin_1500: 1500,
  coin_4000: 4000,
  coin_100_promo: 100,
  coin_500_promo: 500,
  coin_1500_promo: 1500,
  coin_4000_promo: 4000,
};
