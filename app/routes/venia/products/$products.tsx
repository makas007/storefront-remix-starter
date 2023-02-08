
import { useLoaderData } from 'react-router';
import { Link } from 'react-router-dom';
import { getCategoryProductsVenia } from '~/providers/testData/testProvider';


export let loader = async ({params}:any, request:Request) => {

// console.log( params.products, 'params');
    const products = await getCategoryProductsVenia(params.products,request)
    return products
}

function CategoryProducts() {
    const {products}: any = useLoaderData()
    // console.log(products,'products ');
    
     return (
        <div className='max-w-6xl mx-auto px-4'>
            <div className='mt-6 grid sm:grid-cols-5 gap-x-4'>
                <div className='sm:col-span-5 lg:col-span-4'>
                    <div className='grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
                        {products && 
                            products.items?.map( (item:any) => (
                                <Link className="item flex flex-col" 
                                    key={item.uid}
                                    to={`./${item.url_key}`}
                                >
                                    <img src={item.image.url} className='rounded-xl flex-grow object-cover aspect-[7/8]'></img>
                                    <div className="product-name">{item.name}</div>
                                    <div className="price">{item.price_range.minimum_price.regular_price.value}$</div>
                                </Link>
                            ))    
                        }
                    </div>
                </div>
            </div>

            
        </div>
    )
}
export default CategoryProducts;