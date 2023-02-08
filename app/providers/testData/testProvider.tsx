import gql from 'graphql-tag';
import { QueryOptions, sdkMG } from '~/graphqlWrapper';


export function getCollectionsVenia(request: Request) {
  console.log('collectionsVenia')
  return sdkMG
    .collectionsVenia(undefined, { request })
    .then((result: any) => result.categories[0].children);
}

export function getCategoryProductsVenia(value: any ,request: Request) {
  return sdkMG
    .categoryProducts( {value: value}, request)
    .then((res:any) => res)   
}

export function getProductData(productValue: any, request: Request) {
  return sdkMG
    .pageProduct({value: productValue}, request)
    .then((res:any) => res)
}
// export function getProductBySlug(slug: string, options: QueryOptions) {
//   return sdk.product({ slug }, options);
// }
