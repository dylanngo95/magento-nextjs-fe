import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/router"

const QUERY = gql`
query($id: String) {
  products(filter: {category_id: {eq: $id}}) {
    items{
      sku
      uid
      name
      meta_title
      image{
        url
        label
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
  let category = query?.url ?? null;
  if (category) {
    category = {
      id: category.split('.')[1],
      url_path: category.split('.')[0]
    }
  }
  return category
}

export default function CategoryList() {
  const { query } = useRouter()
  const category = getCategory(query)

  console.log('URL', category)
  const { data, loading } = useQuery(QUERY, {
    variables: {
      id: category.id
    }
  })

  if (loading) return <p>Loading</p>

  console.log('data', data)

  return (
    <div>
      <h2>Product list</h2>
      {
        data?.products?.items.map((item: any) =>
          <div key={item.sku}>
            <p>{item.sku}</p>
          </div>
        )
      }
    </div>
  )
}

export async function getServerSideProps(context: any) {
  // console.log('Context', context)
  return {
    props: {}
  }
}