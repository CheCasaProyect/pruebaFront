import React from "react";
import IUser from "../../interfaces/Iuser";

interface UserProfileProps {
  user: IUser | null;
}

const UserProfile: React.FC<UserProfileProps> = ({user}) => {
  if(!user){
    return <p>No hay usuario logueado para mostrar información</p>
  }

  return (
    <section className="bg-white p-6 rounded-md shadow-md mb-8 flex items-center space-x-6">
      <img
        src={user.profileImgUrl || "https://i.postimg.cc/G3QXSw8Y/carpincho.png"}
        alt="Foto de perfil"
        className="w-24 h-24 rounded-full object-cover shadow-sm"
      />
      <div>
        <h3 className="text-xl font-bold mb-4">Mi Perfil</h3>
        <div className="mb-4">
          <p>
            <span className="font-semibold">Nombre:</span> {user.firstname} {user.lastname}
          </p>
          <p>
            <span className="font-semibold">Correo electrónico:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span> {user.phone}
          </p>
          <p>
            <span className="font-semibold">Fecha de Nacimiento:</span> {user.birthdate || "No especificado"}</p>
      </div>
      </div>
    </section>
  );
};

export default UserProfile;
