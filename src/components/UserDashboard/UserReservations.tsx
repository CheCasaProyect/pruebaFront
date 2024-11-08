import React, { useEffect, useState } from "react";
import { IReservationDetail } from "../../interfaces/ReservationDetail";

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<IReservationDetail[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.reservations && Array.isArray(user.reservations)) {
        setReservations(user.reservations as unknown as IReservationDetail[]);
      }
    }
  }, []);
  
;

  return (
    <div className="bg-white p-6 rounded-md shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
      <ul className="space-y-4">
        {reservations.map((reservationDetail) => (
          <li
            key={reservationDetail.id}
            className="flex items-center p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition duration-200"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {reservationDetail.property}
              </h3>
              <p className="text-gray-600">
                Fecha de entrada:{" "}
                <span className="text-blue-500">
                  {reservationDetail.checkIn}
                </span>
              </p>
              <p className="text-gray-600">
                Fecha de salida:{" "}
                <span className="text-blue-500">
                  {reservationDetail.checkOut}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Huéspedes: {reservationDetail.pax}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyReservations;
