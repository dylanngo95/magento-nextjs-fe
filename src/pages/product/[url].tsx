import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import Image from "next/image"
import { initializeApollo, addApolloToState } from "@framework/graphql/ApolloClient"
import React from "react"

const QUERY = gql`
query($sku: String!) {
  products(filter: {sku: {eq: $sku}}) {
    items {
      id
      sku
      name
      meta_title
      url_key
      description {
        html
      }
      price_range {
        minimum_price {
          final_price {
            value
            currency
          }
        }
      }
      thumbnail {
        disabled
        label
        position
        url
      }
    }
    total_count
  }
}
`

function getProduct(query: any) {
  let product = query?.url ?? null
  if (product) {
    product = {
      sku: product.split('.')[1],
      url_path: product.split('.')[0]
    }
  }
  return product
}


export default function ProductDetailPage() {

  const lazyRoot = React.useRef(null)

  const { query } = useRouter()
  const product = getProduct(query)

  // console.log('product detail', product)
  const { data, loading } = useQuery(QUERY, {
    variables: {
      sku: product.sku
    }
  })

  // console.log('product data', data)

  if (loading) return <p>Loading</p>

  return (
    <div>
      <h2>Product Detail</h2>
      {
        data?.products?.items.map((item: any) => {
          return (
            <div key={item?.sku}>
              <p>{item?.sku} - {item?.name}</p>
              <Image
                  lazyRoot={lazyRoot}
                  src={item?.thumbnail?.url}
                  width="500"
                  height="500" />
            </div>
          )
        })
      }
    </div>
  )
}

export async function getServerSideProps(context: any) {
  // console.log('Context', context?.query)

  const apolloClient = initializeApollo()

  const query = context?.query
  const product = getProduct(query)
  // console.log('product detail', product)

  const data = await apolloClient.query({
    query: QUERY,
    variables: {
      sku: product?.sku
    }
  })

  // console.log('product server data', data)

  return addApolloToState(apolloClient, {
    props: {}
  })
}