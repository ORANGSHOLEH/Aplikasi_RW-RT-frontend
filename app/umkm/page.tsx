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
        <main className="p-8">
          <Image
            src="/umkm-logo.png"
            alt="UMKM Logo"
            width={150}
            height={50}
            className="mb-4"
          />
          <p className="text-gray-700">
            Welcome to the UMKM application. Here you can manage your UMKM data.
          </p>
        </main>
      </div>
    </>
  );
}
