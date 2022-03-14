const buildUrl = (item: any) => {
    let url = `category/${item.url_path}.${item.id}`
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
                                            <a href={buildUrl(item)}>{itemChild?.name}</a>
                                            <ul>
                                                {
                                                    itemChild?.children.map((itemChildTwo: any) =>
                                                        <li key={itemChildTwo?.id}>
                                                            <a href={buildUrl(item)}>{itemChildTwo?.name}</a>
                                                        </li>
                                                    )
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