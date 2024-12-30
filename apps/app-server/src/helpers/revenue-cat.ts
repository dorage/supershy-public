export type RevenueCatHookBody =
  | RevenueCatHookInitialPurchase
  | RevenueCatHookCancellation
  | RevenueCatHookTest;

export type RevenueCatHookInitialPurchase = {
  event: {
    event_timestamp_ms: number;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms: number;
    environment: string;
    entitlement_id: any;
    entitlement_ids: string[];
    presented_offering_id: any;
    transaction_id: string;
    original_transaction_id: string;
    is_family_share: false;
    country_code: string;
    app_user_id: string;
    aliases: string[];
    original_app_user_id: string;
    currency: string;
    price: number;
    price_in_purchased_currency: number;
    subscriber_attributes: {
      [key: string]: {
        updated_at_ms: number;
        value: string;
      };
    };
    store: string;
    takehome_percentage: number;
    offer_code: any;
    type: 'INITIAL_PURCHASE';
    id: string;
    app_id: string;
  };
  api_version: string;
};

export type RevenueCatHookCancellation = {
  event: {
    event_timestamp_ms: number;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms: number;
    environment: string;
    entitlement_id: string;
    entitlement_ids: string[];
    presented_offering_id: string;
    transaction_id: string;
    original_transaction_id: string;
    app_user_id: string;
    aliases: string[];
    offer_code: string;
    original_app_user_id: string;
    cancel_reason: string;
    currency: string;
    price: number;
    price_in_purchased_currency: number;
    subscriber_attributes: {
      [key: string]: {
        value: string;
        updated_at_ms: number;
      };
    };
    store: string;
    takehome_percentage: number;
    type: 'CANCELLATION';
    id: string;
  };
  api_version: string;
};

export type RevenueCatHookTest = {
  event: {
    event_timestamp_ms: number;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms: number;
    environment: string;
    entitlement_id: null;
    entitlement_ids: null;
    presented_offering_id: null;
    transaction_id: null;
    original_transaction_id: null;
    is_family_share: null;
    country_code: string;
    app_user_id: string;
    aliases: string[];
    original_app_user_id: string;
    currency: null;
    price: null;
    price_in_purchased_currency: null;
    subscriber_attributes: {};
    store: string;
    takehome_percentage: null;
    offer_code: null;
    tax_percentage: null;
    commission_percentage: null;
    type: 'TEST';
    id: string;
    app_id: string;
  };
  api_version: string;
};
