import { getPlatform } from '@/helpers/capacitor';
import { getStore } from '@/helpers/iap';
import 'cordova-plugin-purchase';
import 'cordova-plugin-purchase/www/store';
import { Accessor, JSX, Show, createSignal, onMount, type Component } from 'solid-js';

interface ShopTemplateProps {
  id: string;
  children: (props: { product: Accessor<IAPProductInfo> }) => JSX.Element;
}

type IAPProductInfo = {
  title: string;
  descr: string;
  price: string;
  buy: () => void;
};

const Product: Component<ShopTemplateProps> = (props) => {
  const [product, setProduct] = createSignal<IAPProductInfo | null>(null);

  const getCdvPlatform = () => {
    const platform = getPlatform();
    if (platform === 'ios') return CdvPurchase.Platform.APPLE_APPSTORE;
    if (platform === 'android') return CdvPurchase.Platform.GOOGLE_PLAY;
    return CdvPurchase.Platform.TEST;
  };

  const refreshUI = async () => {
    const store = getStore();
    // await store.update();
    // await store.restorePurchases();

    if (!store.isReady) {
      console.log('Store is not ready yet');
      setTimeout(refreshUI, 5000);
      return;
    }

    const myProduct = store.get(props.id, getCdvPlatform());
    console.log('myProduct', myProduct);

    setProduct({
      title: myProduct ? myProduct.title : '',
      descr: myProduct ? myProduct.description : '',
      price: myProduct ? myProduct.pricing?.price ?? '' : '',
      buy: () => myProduct?.getOffer()?.order(),
    });
  };

  onMount(async () => {
    console.log('onMount');
    await refreshUI();
  });

  return (
    <Show when={product() != null} fallback={<div class="loading loading-ring w-10 h-10"></div>}>
      <props.children product={product as Accessor<IAPProductInfo>} />
    </Show>
  );
};

export default Product;
