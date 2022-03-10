import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/router"

const QUERY = gql`
{
    categories(pageSize: 10, currentPage: 1, filters: {parent_id: {eq: "2"}}) {
      items {
        name
        level
        url_path
      }
      total_count
    }
  }
`

export default function CategoryList() {
    // const { data, loading } = useQuery(QUERY)
    const { query } = useRouter()
    const url = query?.url;
    console.log(url);

    // if (loading) return <p>Loading</p>
    // console.log(data)
    return (
        <div>
            <h2>{url}</h2>
        </div>
    )
}