import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import Image from "next/image"
import { initializeApollo, addApolloToState } from "@framework/graphql/ApolloClient"
import React from "react"

const QUERY = gql`
query($id: String!) {
  products(filter: {category_id: {eq: $id }}) {
    items{
      sku
      uid
      name
      meta_title
      image{
        url
        label
      }
      thumbnail {
        url
        label
        position
      }
      description{
        html
      }
      url_key
    }
  }
}
`

function getCategory(query: any) {
  let category = query?.url ?? null
  if (category) {
    category = {
      id: category.split('.')[1],
      url_path: category.split('.')[0]
    }
  }
  return category
}

function buildProductUrl(product: any) {
  // console.log('product', product)
  let productName = product?.name ?? ''
  productName = productName.replace(/\s/g, '-')
  productName = productName.replace(/\//gm, '-')

  return `/product/${productName}.${product?.sku}`
}

export default function CategoryList() {

  const lazyRoot = React.useRef(null)

  const { query } = useRouter()
  const category = getCategory(query)

  // console.log('category', category)
  const { data, loading } = useQuery(QUERY, {
    variables: {
      id: category.id
    }
  })

  if (loading) return <p>Loading</p>

  // console.log('data', data)

  return (
    <div>
      <h2>Product list</h2>
      {
        data?.products?.items.map((item: any) => {
          return (
            <div key={item?.sku}>
              <a href={buildProductUrl(item)}><p>{item?.sku} - {item?.name}</p></a>
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
  const category = getCategory(query)
  // console.log('category', category)

  await apolloClient.query({
    query: QUERY,
    variables: {
      id: category?.id
    }
  })

  return addApolloToState(apolloClient, {
    props: {}
  })
}