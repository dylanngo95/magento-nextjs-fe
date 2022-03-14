import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import merge from 'deepmerge'
import isEqual from 'lodash.isequal'
import { useMemo } from "react";


const cache = new InMemoryCache();

const uri = "https://pim.local/graphql"
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createApolloClient() {
    const isServer = typeof window === "undefined" ?? false;
    console.log('isServer', isServer)
    return new ApolloClient({
        ssrMode: isServer,
        link: new HttpLink({
            uri: uri,
            credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
        }),
        cache: cache,
        connectToDevTools: true
    });
}

export function initializeApollo(initState: NormalizedCacheObject | null = null) {
    const client = apolloClient ?? createApolloClient()
    const isServer = typeof window === "undefined" ?? false;

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initState) {

        // Get existing cache, loaded during client side data fetching
        const existingCache = client.extract()

        // console.log('=========existingCache ROOT_QUERY')
        // console.log('existingCache', existingCache?.ROOT_QUERY)
        // console.log('=========existingCache')

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
            ...sourceArray,
            ...destinationArray.filter((d) =>
                sourceArray.every((s) => !isEqual(d, s))
            ),
            ],
        });

        // console.log('=========existingCache Root 2')
        // console.log('existingCache data', data?.ROOT_QUERY)
        // console.log('=========existingCache')

        // Restore the cache with the merged data
        client.cache.restore(data)
    }

    // For SSG and SSR always create a new Apollo Client
    if (isServer) return client

    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = client

    return client
}

export function addApolloToState(client: ApolloClient<NormalizedCacheObject>, pageProps: any) {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
    }
    return pageProps
}

export function useApollo(pageProps: any) {
    const state = pageProps[APOLLO_STATE_PROP_NAME]
    const store = useMemo(() => initializeApollo(state), [state])
    return store
}
