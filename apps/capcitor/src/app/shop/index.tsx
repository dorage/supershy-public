import Images from '@/assets/images';
import Resources from '@/assets/images/resources';
import Coin from '@/components/coin';
import Commons from '@/components/commons';
import Layouts from '@/components/layouts';
import Logics from '@/components/logics';
import Product from '@/components/product';
import Locale from '@/constants/locale';
import routes from '@/constants/url';
import AdmobHelper from '@/helpers/admob';
import { setAppState } from '@/helpers/app';
import IAPHelper from '@/helpers/iap';
import PremiumProvider from '@/providers/premiums';
import AuthRepository from '@/repositories/auth';
import AuthSignal from '@/signals/auth';
import {
  PRODUCT_CATEGORY,
  PURCHASES_ERROR_CODE,
  Purchases,
  PurchasesStoreProduct,
} from '@revenuecat/purchases-capacitor';
import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { Index, Show, createSignal, onMount, type Component } from 'solid-js';
import Premium from './components/premium';

interface ShopPageProps {}

const productImages = [
  Images.Resources.productSmall,
  Images.Resources.productMedium,
  Images.Resources.productLarge,
  Images.Resources.productExlarge,
];

const ShopPage: Component<ShopPageProps> = (props) => {
  const navigator = useNavigate();
  const [products, setProducts] = createSignal<PurchasesStoreProduct[]>([]);

  onMount(async () => {
    const { isConfigured } = await Purchases.isConfigured();
    if (!isConfigured) {
      alert('something wrong');
    }
    const products = await Purchases.getProducts({
      productIdentifiers: ['coin_100', 'coin_500', 'coin_1500', 'coin_4000'],
      type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
    });
    setProducts(products.products.sort((a, b) => a.price - b.price));
  });

  const v1JoinMutate = createMutation(PremiumProvider.putPremiumsJoin);
  const v1CreateMutate = createMutation(PremiumProvider.putPremiumsCreate);

  return (
    <div>
      <Layouts.Header title={Locale.shop.header} />
      <Layouts.Body class="flex flex-col gap-2 pb-32">
        <div class="flex gap-2 justify-between items-center">
          <span>Koin saya</span>
          <Commons.Budget />
        </div>
        <div class="divider" />
        {/*  */}
        {/* Premiums */}
        {/*  */}
        <div class="header">{Locale.shop.premiums.header}</div>
        <Premium
          name={Locale.shop.premiums.join.header}
          description={Locale.shop.premiums.join.desc}
          button={
            <Logics.Payable
              price={300}
              purchased={AuthSignal.getSignedAuth().user.vip?.join}
              onclick={async () => {
                if (!AuthSignal.getSignedAuth().user.vip?.join) {
                  await v1JoinMutate.mutateAsync({});
                  await AuthRepository.loadSignedUser();
                }
                navigator(routes.premium.join);
              }}
            >
              <Show
                when={AuthSignal.getSignedAuth().user.vip?.join}
                fallback={
                  <div class="btn btn-sm btn-secondary w-28">
                    <Coin />
                    <span>300</span>
                  </div>
                }
              >
                <div class="btn btn-sm btn-warning w-28">Membuat</div>
              </Show>
            </Logics.Payable>
          }
          image={Resources.premiumJoin}
          onclick={async () => {
            if (!AuthSignal.getSignedAuth().user.vip?.create) {
              await v1CreateMutate.mutateAsync({});
              await AuthRepository.loadSignedUser();
            }
            navigator(routes.premium.create);
          }}
        />
        <Premium
          name={Locale.shop.premiums.create.header}
          description={Locale.shop.premiums.create.desc}
          image={Resources.premiumCreate}
          onclick={async () => {
            if (!AuthSignal.getSignedAuth().user.vip?.create) {
              await v1CreateMutate.mutateAsync({});
              await AuthRepository.loadSignedUser();
            }
            navigator(routes.premium.create);
          }}
          button={
            <Logics.Payable
              price={500}
              purchased={AuthSignal.getSignedAuth().user.vip?.create}
              onclick={async () => {
                if (!AuthSignal.getSignedAuth().user.vip?.create) {
                  await v1CreateMutate.mutateAsync({});
                  await AuthRepository.loadSignedUser();
                }
                navigator(routes.premium.create);
              }}
            >
              <Show
                when={AuthSignal.getSignedAuth().user.vip?.create}
                fallback={
                  <div class="btn btn-sm btn-secondary w-28">
                    <Coin />
                    <span>500</span>
                  </div>
                }
              >
                <div class="btn btn-sm btn-warning w-28">Membuat</div>
              </Show>
            </Logics.Payable>
          }
        />
        <div class="divider" />
        {/*  */}
        {/* Products */}
        {/*  */}
        <div class="header">{Locale.shop.products.header}</div>
        {/* Admob ad */}
        <Product
          name={'Hadiah'}
          image={Images.Resources.productGratis}
          button={
            <div
              class="btn btn-success btn-sm w-28"
              classList={{ 'btn-disabled': AdmobHelper.frequentCapping.left() === 0 }}
              onclick={async () => {
                setAppState('LOADING');
                await AdmobHelper.rewardVideo();
                setAppState('INIT');
              }}
            >
              <Show
                when={AdmobHelper.frequentCapping.left() > 0}
                fallback={`${AdmobHelper.frequentCapping.timer()?.hours}:${
                  AdmobHelper.frequentCapping.timer()?.minutes
                }:${AdmobHelper.frequentCapping.timer()?.seconds}`}
              >
                {'GRATIS'} {AdmobHelper.frequentCapping.left()}
              </Show>
            </div>
          }
        />
        <Index each={products()}>
          {(product, idx) => (
            <Product
              name={product().title}
              button={
                <div
                  class="btn btn-success btn-sm w-28"
                  onclick={async () => {
                    try {
                      setAppState('LOADING');
                      const purchaseResult = await Purchases.purchaseStoreProduct({
                        product: product(),
                      });

                      if (
                        typeof purchaseResult.customerInfo.entitlements.active[
                          'my_entitlement_identifier'
                        ] !== 'undefined'
                      ) {
                        console.debug('PURCHASE RESULT', purchaseResult);
                        // get last transaction info
                        const { productIdentifier, transactionIdentifier } =
                          purchaseResult.customerInfo.nonSubscriptionTransactions[
                            purchaseResult.customerInfo.nonSubscriptionTransactions.length - 1
                          ];
                        await IAPHelper.validatePurchase({
                          productId: productIdentifier,
                          transactionId: transactionIdentifier,
                        });
                        await AuthRepository.loadSignedUser();
                      }
                    } catch (error: any) {
                      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
                        // Purchase cancelled
                        alert('Failed to purchase');
                      } else {
                        // Error making purchase
                        alert('Failed to purchase');
                      }
                    } finally {
                      setAppState('INIT');
                    }
                  }}
                >
                  {product().priceString}
                </div>
              }
              image={productImages[idx]}
            />
          )}
        </Index>
      </Layouts.Body>
      <Layouts.NavBar />
    </div>
  );
};

export default ShopPage;
