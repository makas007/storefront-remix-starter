import { Link } from "@remix-run/react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { getCollections } from "~/providers/collections/collections";
import { getCollectionsVenia } from "~/providers/testData/testProvider";


export async function loader({ request }: any) {
    const data1 = await getCollections(request);

    
    const categories = await getCollectionsVenia(request);


    return {
        categories
    };
  }

export default function Test2(){
    const {categories}:any = useLoaderData()
    // console.log(categories," !!!!!!!!!!!!!!!!!!");
    const [active, setActive] = useState("");
    // console.log(useLoaderData);
    



    return (
        <div className="category flex justify-between items-center h-14 p-4">
            {categories && categories.map( (item:any) => (
                <div
                    key={item.uid}
                    onMouseEnter={() => setActive(item.name)}
                    onMouseLeave={() => setActive("")}
                >
                    <Link to={`./categories/${item.url_key}`} key={item.uid}>{item.name}</Link>
                    <div className="absolute bg-white w-56 transition duration-300 ease-in">
                    {active === item.name && (
                        <ul className="dropdown transition duration-300 ease-in">
                            {item.children?.map((child: any) => (
                                <li key={child.uid} className="border-solid border-t-2 pb-1">
                                    <Link to={`./products/${child.uid}`}
                                        id={child.uid}
                                        className="text-xl text-sky-700 h-6"
                                    >{child.name}</Link>
                                </li>
                            ))}
                        </ul>
                    )} 
                </div>
               
             </div>
            ))}
        </div>
    )
}