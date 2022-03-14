const buildUrl = (item: any) => {
    let category = item?.name ?? ''
    category = category.replace(/\s/g, '-')
    category = category.replace(/\//gm, '-')
    let url = `category/${category}.${item?.id}`
    return url;
}

export default function Category(cateProps: any) {
    console.log('=====> Category', cateProps)
    return (
        <div className="Category">
            <ul>
                {
                    cateProps?.categories?.items?.map((item: any) =>
                        <li key={item?.id}>
                            <a href={buildUrl(item)}>{item?.name}</a>
                            <ul>
                                {
                                    item?.children.map((itemChild: any) =>
                                        <li key={itemChild?.id}>
                                            <a href={buildUrl(itemChild)}>{itemChild?.name}</a>
                                            <ul>
                                                {
                                                    itemChild?.children.map((itemChildTwo: any) => {
                                                        // console.log('itemChild', itemChildTwo)
                                                        return (
                                                            <li key={itemChildTwo?.id}>
                                                                <a href={buildUrl(itemChildTwo)}>{itemChildTwo?.name}</a>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </li>
                                    )
                                }
                            </ul>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}