import { gql, useQuery } from "@apollo/client"
import { GetStaticPropsContext } from "next"
import { initializeApollo, addApolloToState } from "../../apollo-client"

const QUERY = gql`
{
    categories(
      pageSize: 10
      currentPage: 1
      filters: { parent_id: { eq: "2" } }
    ) {
      items {
        name
        level
        url_path
      }
      total_count
    }
  }
`
const buildUrl = (url: string) => `category/${url}`

export default function CategoryList() {
    // if (!dataCache) return <p>Loading data hit!</p>    
    const { data, loading } = useQuery(QUERY)
    console.log('data', data)

    if (loading) return <p>Loading data!</p>

    return (
        <div>
            <h2>Category list</h2>
            <ul>
                {
                    data.categories.items.map((item: any) => {
                        return (
                            <li key={item.url_path}>
                                <a href={buildUrl(item.url_path)}>{item.name}</a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export async function getServerSideProps(context: GetStaticPropsContext) {
    const apolloClient = initializeApollo()
    
    console.log('start query - server rendering')
    await apolloClient.query({
        query: QUERY
    })
    console.log('finish quuey - server rendering')
    return addApolloToState(apolloClient, {
        props: {}
    })
} 