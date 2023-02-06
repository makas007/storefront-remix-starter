import gql from 'graphql-tag';
import { sdkMG } from '~/graphqlWrapper';



export function getCollectionsVenia(request: Request) {
    console.log('collectionsVenia')
    return sdkMG
      .collectionsVenia(undefined, { request })
      .then((result: any) => result.categories[0].children);
  }

