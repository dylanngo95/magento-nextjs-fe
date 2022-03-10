import { gql, useQuery } from "@apollo/client"

const QUERY = gql`
query {
    isEmailAvailable(email:"it.tinhngo@gmail.com") {
      is_email_available
    }
  }
`
export default function ProductDetail() {
    const { data } = useQuery(QUERY)
    console.log('data', data)

    return(
        <>Div 1</>
    )
}