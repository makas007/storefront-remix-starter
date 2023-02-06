import { useLoaderData } from "react-router";
import { getCollections } from "~/providers/collections/collections";
import { getCollectionsVenia } from "~/providers/testData/testProvider";


export async function loader({ request }: any) {
    const data1 = await getCollections(request);
    // console.log(data1, 'data1');
    
    const data2 = await getCollectionsVenia(request);
    // console.log(data2, 'data2');

    return {
        data1,
        data2
    };
  }

export default function Test2(){
    const {data2}:any = useLoaderData()
    console.log(data2," !!!!!!!!!!!!!!!!!!");
    



    return (
        <>
        {data2.map( (item:any) => (
            <div key={item.uid}>{item.name}</div>
        ))}
        </>
    )
}