// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
import Navbar from "../components/ui/Navbar";
import Image from "next/image";

// export default function UMKMPage() {
//   const [data, setData] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Simulate fetching data
//     const fetchData = async () => {
//       const response = await fetch("/api/umkm-data");
//       const result = await response.json();
//       setData(result);
//     };
//     fetchData();
//   }, []);

//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">UMKM Data</h1>
//       <Image
//         src="/umkm-logo.png"
//         alt="UMKM Logo"
//         width={150}
//         height={50}
//         className="mb-4"
//       />
//       <ul>
//         {data.map((item) => (
//           <li key={item.id} className="mb-2">
//             {item.name} - {item.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
export default function UMKMPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-3xl text-black font-bold p-8">UMKM RW16</h1>
      </div>
    </>
  );
}
