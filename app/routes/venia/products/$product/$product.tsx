import { useLoaderData } from "react-router";
import { getProductData } from "~/providers/testData/testProvider";

export const loader = async ({params}:any, request: Request) => {
    console.log(params);
    const {singlePage} = await getProductData(params.product, request)
    // console.log(singlePage, 'oneProduct');
    
    return singlePage
}


function ProductPage() {
    const {items}:any = useLoaderData()
    console.log(items);
    const product = items[0]
     return (
        <div className="product-page max-w-6xl mx-auto px-4">
            <h2 className="product-name text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
                {product.name}
            </h2>
            <div className="product-wrapper lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
                <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                    <span className="rounded-md overflow-hidden">
                        <div className="w-full h-full object-center object-cover rounded-lg">
                            <img src={product.image.url} alt="#" className="w-full h-full object-center object-cover rounded-lg"/>
                        </div>
                    </span>
                </div>
                <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                    <div className="description" dangerouslySetInnerHTML={{__html: product.description.html }}></div>
                    <div>
                        <div className="price text-2xl">{product.price_range.maximum_price.final_price.value}$</div>
                        <button 
                        className="max-w-xs flex-1 bg-primary-600 hover:bg-primary-700
                        transition-colors border border-transparent rounded-md py-3 px-8 flex items-center
                         justify-center text-base font-medium text-white focus:outline-none
                         focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full"
                        >Add ot cart</button>
                    </div>
                </div>
            </div> 
        </div>
    )
}
export default ProductPage;