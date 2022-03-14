import { gql, useQuery } from "@apollo/client"
import { GetStaticPropsContext } from "next"
import { initializeApollo, addApolloToState } from "@framework/graphql/ApolloClient"
import Category from "@components/Category/Index"

const QUERY = gql`
{
    categories(
      pageSize: 10
      currentPage: 1
      filters: { parent_id: { eq: "2" } }
    ) {
      items {
        id
        name
        level
        url_path
        children {
          id
          name
          url_path
          children {
            id
            name
            url_path
          }
        }
      }
      total_count
    }
  }
`

export default function CategoryList() {
    const { data, loading } = useQuery(QUERY)
    console.log('=====> Index data', data)

    if (loading) return <p>Loading data!</p>

    return (
        <div>
            <h2>Category list</h2>
            <Category categories={data?.categories} />
        </div>
    )
}

export async function getServerSideProps(context: GetStaticPropsContext) {
    const apolloClient = initializeApollo()
    
    console.log('Category listing')
    await apolloClient.query({
        query: QUERY
    })
    return addApolloToState(apolloClient, {
        props: {}
    })
}