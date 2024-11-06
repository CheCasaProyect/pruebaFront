"use client"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import React from "react";

const Register = () => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const registerUser = async (values: any) => {
    setLocalError(null);
    try {
      console.log("Enviando solicitud de registro...");
      values.phone = String(values.phone);
      console.log("Datos enviados:", JSON.stringify(values));

      const response = await fetch("https://proyectochecasa.onrender.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        const contentType = response.headers.get("Content-Type");
        const data = contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        console.log("Datos recibidos:", data);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Serás redirigido al login",
          confirmButtonColor: "#0a0a0a",
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            router.push("/login");
          },
        });
      } else if (response.status === 400) {
        const contentType = response.headers.get("Content-Type");
        const errorData = contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();
        console.log("Error en la respuesta:", errorData);
        throw new Error(errorData.message || "Error en la solicitud. Revisa los datos ingresados.");
      } else {
        throw new Error("Ocurrió un error inesperado. Intentá de nuevo más tarde.");
      }
    } catch (error) {
      console.log("Error en el catch:", error);
      if (error instanceof Error) {
        setLocalError(error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonColor: "#0a0a0a",
        });
      } else {
        setLocalError("Un error desconocido ocurrió.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Un error desconocido ocurrió.",
          confirmButtonColor: "#0a0a0a",
        });
      }
    }
  };

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthdate: "",
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required("Nombre es obligatorio"),
    lastname: Yup.string().required("Apellido es obligatorio"),
    email: Yup.string().email("Formato de email inválido").required("Email es obligatorio"),
    password: Yup.string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, "La contraseña debe contener entre 8 y 15 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)")
      .required("Contraseña es obligatoria"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas deben coincidir").required("Confirmación de contraseña es obligatoria"),
    phone: Yup.string().required("Teléfono es obligatorio").matches(/^[0-9]+$/, "El teléfono debe contener solo números"),
    birthdate: Yup.date().required("Fecha de nacimiento es obligatoria"),
  });

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLocalError(null);
    try {
      await registerUser(values);
    } catch (error) {
      console.error("Error de registro:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen bg-[#fffefe] text-[#0a0a0a] pt-20 lg:pt-40 pb-20">
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center max-w-md px-5 sm:px-10 mb-10 lg:mb-0">
        <Image
          src="https://i.postimg.cc/G3QXSw8Y/carpincho.png"
          alt="Carpi Bienvenida"
          width={256}
          height={256}
          className="object-cover w-48 h-48 sm:w-64 sm:h-64 mb-6 lg:mb-0 lg:mr-2 lg:ml-12"
        />
        <div className="text-center lg:text-left lg:ml-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Che! Registrate
          </h2>
          <p className="leading-relaxed text-base sm:text-lg lg:text-xl mb-6">
            "Bienvenido a tu próxima aventura en Argentina. Registrate para
            descubrir los mejores alojamientos locales y viví una experiencia
            única en cada rincón del país."
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg p-6 sm:p-8 bg-white bg-opacity-90 border border-[#0a0a0a] rounded-md shadow-lg space-y-6 mr-10">
        <h2 className="text-xl sm:text-2xl font-bold text-center tracking-wider">
          Crear una cuenta
        </h2>

        {localError && (
          <div className="text-red-500 text-center">{localError}</div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="relative">
                <Field
                  type="text"
                  name="firstname"
                  placeholder="Nombre"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
                />
                <ErrorMessage name="firstname" component="div" className="text-red-500" />
              </div>

              <div className="relative">
                <Field
                  type="text"
                  name="lastname"
                  placeholder="Apellido"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
                />
                <ErrorMessage name="lastname" component="div" className="text-red-500" />
              </div>

              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
                />
                <ErrorMessage name="email" component="div" className="text-red-500" />
              </div>

              <div className="relative">
                <Field
                  type="date"
                  name="birthdate"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
                />
                <ErrorMessage name="birthdate" component="div" className="text-red-500" />
              </div>

              <div className="relative">
                <Field
                  type="text"
                  name="phone"
                  placeholder="Teléfono"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500" />
              </div>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg text-[#0a0a0a] placeholder-gray-500 focus:outline-none p-2"
                  placeholder="Contraseña"
                />
                <ErrorMessage name="password" component="div" className="text-red-500" />
                <button
                  type="button"
                  aria-label="Mostrar/Ocultar contraseña"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {/* <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
                />
                <ErrorMessage name="password" component="div" className="text-red-500" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-[#0a0a0a] font-semibold"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button> */}

              <div className="relative">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-[#0a0a0a] text-white rounded hover:bg-[#1a1a1a] focus:outline-none"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <Link href="/login" className="text-[#0a0a0a] hover:text-[#0277A5]">
            ¿Ya tienes una cuenta? Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

// "use client"
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Image from "next/image";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";

// const Register = () => {
//   const [localError, setLocalError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const router = useRouter();

//   const registerUser = async (values: any) => {
//     setLocalError(null);
//     try {
//       console.log("Enviando solicitud de registro...");
//       values.phone = String(values.phone);
//       console.log("Datos enviados:", JSON.stringify(values));

//       const response = await fetch("http://localhost:3001/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });

//       if (response.status === 201) {
//         const contentType = response.headers.get("Content-Type");
//         const data = contentType && contentType.includes("application/json")
//           ? await response.json()
//           : await response.text();

//         console.log("Datos recibidos:", data);

//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         Swal.fire({
//           icon: "success",
//           title: "¡Registro exitoso!",
//           text: "Serás redirigido al login",
//           confirmButtonColor: "#0a0a0a",
//           timer: 2000,
//           timerProgressBar: true,
//           willClose: () => {
//             router.push("/login");
//           },
//         });
//       } else if (response.status === 400) {
//         const contentType = response.headers.get("Content-Type");
//         const errorData = contentType && contentType.includes("application/json")
//           ? await response.json()
//           : await response.text();
//         console.log("Error en la respuesta:", errorData);
//         throw new Error(errorData.message || "Error en la solicitud. Revisa los datos ingresados.");
//       } else {
//         throw new Error("Ocurrió un error inesperado. Intentá de nuevo más tarde.");
//       }
//     } catch (error) {
//       console.log("Error en el catch:", error);
//       if (error instanceof Error) {
//         setLocalError(error.message);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: error.message,
//           confirmButtonColor: "#0a0a0a",
//         });
//       } else {
//         setLocalError("Un error desconocido ocurrió.");
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Un error desconocido ocurrió.",
//           confirmButtonColor: "#0a0a0a",
//         });
//       }
//     }
//   };

//   const initialValues = {
//     firstname: "",
//     lastname: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     birthdate: "",
//   };

//   const validationSchema = Yup.object({
//     firstname: Yup.string().required("Nombre es obligatorio"),
//     lastname: Yup.string().required("Apellido es obligatorio"),
//     email: Yup.string().email("Formato de email inválido").required("Email es obligatorio"),
//     password: Yup.string()
//       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, "La contraseña debe contener entre 8 y 15 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)")
//       .required("Contraseña es obligatoria"),
//     confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas deben coincidir").required("Confirmación de contraseña es obligatoria"),
//     phone: Yup.string().required("Teléfono es obligatorio").matches(/^[0-9]+$/, "El teléfono debe contener solo números"),
//     birthdate: Yup.date().required("Fecha de nacimiento es obligatoria"),
//   });

//   const handleSubmit = async (
//     values: any,
//     { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
//   ) => {
//     setLocalError(null);
//     try {
//       await registerUser(values);
//     } catch (error) {
//       console.error("Error de registro:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen bg-[#fffefe] text-[#0a0a0a] pt-20 lg:pt-40 pb-20">
//       <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center max-w-md px-5 sm:px-10 mb-10 lg:mb-0">
//         <Image
//           src="https://i.postimg.cc/G3QXSw8Y/carpincho.png"
//           alt="Carpi Bienvenida"
//           width={256}
//           height={256}
//           className="object-cover w-48 h-48 sm:w-64 sm:h-64 mb-6 lg:mb-0 lg:mr-2 lg:ml-12"
//         />
//         <div className="text-center lg:text-left lg:ml-6">
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
//             Che! Registrate
//           </h2>
//           <p className="leading-relaxed text-base sm:text-lg lg:text-xl mb-6">
//             "Bienvenido a tu próxima aventura en Argentina. Registrate para
//             descubrir los mejores alojamientos locales y viví una experiencia
//             única en cada rincón del país."
//           </p>
//         </div>
//       </div>

//       <div className="w-full max-w-lg p-6 sm:p-8 bg-white bg-opacity-90 border border-[#0a0a0a] rounded-md shadow-lg space-y-6 mr-10">
//         <h2 className="text-xl sm:text-2xl font-bold text-center tracking-wider">
//           Crear una cuenta
//         </h2>

//         {localError && (
//           <div className="text-red-500 text-center">{localError}</div>
//         )}
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="space-y-6">
//               <div className="relative">
//                 <Field
//                   type="text"
//                   name="firstname"
//                   placeholder="Nombre"
//                   className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
//                 />
//                 <ErrorMessage name="firstname" component="div" className="text-red-500" />
//               </div>

//               <div className="relative">
//                 <Field
//                   type="text"
//                   name="lastname"
//                   placeholder="Apellido"
//                   className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
//                 />
//                 <ErrorMessage name="lastname" component="div" className="text-red-500" />
//               </div>

//               <div className="relative">
//                 <Field
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
//                 />
//                 <ErrorMessage name="email" component="div" className="text-red-500" />
//               </div>

//               <div className="relative">
//                 <Field
//                   type="date"
//                   name="birthdate"
//                   className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
//                 />
//                 <ErrorMessage name="birthdate" component="div" className="text-red-500" />
//               </div>

//               <div className="relative">
//                 <Field
//                   type="text"
//                   name="phone"
//                   placeholder="Teléfono"
//                   className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
//                 />
//                 <ErrorMessage name="phone" component="div" className="text-red-500" />
//               </div>

//               <div className="relative">
//                 <Field
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Contraseña"
//                   className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
//                 />
//                 <ErrorMessage name="password" component="div" className="text-red-500" />
//               </div>

//               <div className="relative">
//                 <Field
//                   type={showPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Confirmar Contraseña"
//                   className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
//                 />
//                 <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="text-sm text-[#0B4677] hover:underline"
//               >
//                 {showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
//               </button>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full py-3 bg-[#0B4677] text-white font-bold rounded-md hover:bg-[#0277A5]"
//               >
//                 {isSubmitting ? "Registrando..." : "Crear Cuenta"}
//               </button>
//             </Form>
//           )}
//         </Formik>

//         <p className="text-sm text-center mt-4">
//           ¿Ya tenés una cuenta?{" "}
//           <Link href="/login" className="text-[#0B4677] hover:underline">
//             Ingresá aquí
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;




