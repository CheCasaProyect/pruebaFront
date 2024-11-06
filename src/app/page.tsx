// "use client"
// import React, { useState, useEffect } from 'react';
// import CardAccommodation from './accommodations/CardAccommodation'; 
// import Navbar from '../components/Navbar'; 

// export default function Home() {
//   const [accommodations, setAccommodations] = useState<any[]>([]); 
 

//   useEffect(() => {
//     const fetchAccommodations = async () => {
//       try {
//         const response = await fetch('https://proyectochecasa.onrender.com/properties'); 
//         const data = await response.json();
//         setAccommodations(data); 
//       } catch (error) {
//         console.error('Error al obtener las propiedades:', error);
//       }
//     };

//     fetchAccommodations();
//   }, []);
  

//   return (
//     <>
//       <div className="Home flex flex-wrap justify-center gap-5 p-8">
//         {filteredAccommodations.map((accommodation) => (
//           <CardAccommodation
//             key={accommodation.id}
//             id={accommodation.id}
//             title={accommodation.title}
//             description={accommodation.description}
//             price={accommodation.price}
//             photos={accommodation.photos}
//             latitude={accommodation.latitude}
//             longitude={accommodation.longitude}
//             provincia={''}
//             stripePriceId={undefined}
//             stripeProductId={undefined}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
"use client";
import React, { useState, useEffect } from 'react';
import CardAccommodation from './accommodations/CardAccommodation';

export default function Home() {
  const [accommodations, setAccommodations] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('https://proyectochecasa.onrender.com/properties'); 
        const data = await response.json();
        console.log(data); 


        if (Array.isArray(data)) {
          setAccommodations(data); 
        } else {
          console.error('Data fetched is not an array:', data);
        }
      } catch (error) {
        console.error('Error al obtener las propiedades:', error);
      }
    };

    fetchAccommodations();
  }, []);

  return (
    <>

    <div className="Home flex flex-wrap justify-center gap-5 p-8">
      {accommodations.map((accommodation) => (
        <CardAccommodation
        key={accommodation.id}
        id={accommodation.id}
        title={accommodation.title}
        description={accommodation.description}
        price={accommodation.price}
        photos={accommodation.photos}
        latitude={accommodation.latitude}
        longitude={accommodation.longitude}
        provincia={''}
        stripePriceId={undefined}
        stripeProductId={undefined}
        />
      ))}
    </div>
  </>
  );
}