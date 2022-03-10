import { gql, useQuery } from "@apollo/client"

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
const buildUrl = (url: string) => `category/${url}`

export default function CategoryList() {
    const { data, loading } = useQuery(QUERY)

    if (loading) return <p>Loading</p>
    console.log(data)
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