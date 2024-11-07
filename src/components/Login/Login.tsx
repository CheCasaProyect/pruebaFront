"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import Image from "next/image";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error al analizar el usuario:", error);
      }
    } else {
      console.log("No hay usuario en localStorage.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };


  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (response) => {
      const { access_token } = response;
      console.log("Token de Google:", access_token);

      try {
        console.log("Enviando token a backend:", access_token);
        const res = await fetch("http://localhost:3000/google/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: access_token }),
        });

        if (res.status === 200) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/profile");
        } else if (res.status === 400) {
          const errorData = await res.json();
          setLocalError(errorData.message || "Credenciales incorrectas.");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorData.message || "Error en la autenticación.",
            confirmButtonColor: "#0a0a0a",
          });
        } else {
          setLocalError("Ocurrió un error inesperado.");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
            confirmButtonColor: "#0a0a0a",
          });
        }
      } catch (error) {
        console.log("Error en la autenticación con Google:", error);
        setLocalError("Error al autenticar con Google.");
      }
    },
    onError: (error) => {
      setLocalError("Error en la autenticación con Google.");
      console.error("Error de Google:", error);
    },
  });


  // const googleLogin = useGoogleLogin({
  //   flow: "implicit",
  //   onSuccess: async (response) => {
  //     const { access_token } = response;
  //     console.log("Token de Google:", access_token);

  //     try {
  //       console.log("Enviando token a backend:", access_token);
  //       const res = await fetch(
  //         "https://proyectochecasa.onrender.com/google/login",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ access_token: access_token }),
  //         }
  //       );

  //       const data = await res.json();
  //       console.log("Respuesta del backend:", data);

  //       if (data?.access_token) {
  //         console.log("Token de acceso obtenido:", data.access_token);
  //         localStorage.setItem("token", data.access_token);
  //         router.push("/profile");
  //       } else {
  //         console.error("Error al iniciar sesión con Google.");
  //       }
  //     } catch (error) {
  //       console.error("Error en el proceso de login:", error);
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error en el inicio de sesión de Google:", error);
  //   },
  // });

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Formato de email inválido").required("Email es obligatorio"),
    password: Yup.string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, "La contraseña debe contener entre 8 y 15 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)")
      .required("Contraseña es obligatoria"),
  });


  const handleSubmit = async (values: any) => {
    const { email, password } = values;
    console.log("Formulario enviado:", values);
  
    try {
      const res = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      console.log("Respuesta del servidor (status):", res.status);
  
      if (res.status === 200) {
        const data = await res.json();
        console.log("Datos recibidos:", data);
  
        if (data?.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/profile");
        } else {
          console.error("No se recibió el token de acceso.");
        }
      } else if (res.status === 400) {
        const data = await res.json();
        console.error("Credenciales incorrectas:", data.message);
        setLocalError(data.message || "Credenciales incorrectas.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Credenciales incorrectas.",
          confirmButtonColor: "#0a0a0a",
        });
      } 
    } catch (error) {
      console.error("Error en el proceso de login:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con el inicio de sesión.",
        confirmButtonColor: "#0a0a0a",
      });
    }
  };
  

  // const handleSubmit = async (values: any) => {
  //   const { email, password } = values;
  //   console.log("Formulario enviado:", values);
  //   try {
  //     const res = await fetch(
  //       "http://localhost:3000/auth/login",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, password }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (data?.token) {
  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem("user", JSON.stringify(data.user));
  //       router.push("/profile");
  //     } else {
  //       console.error("Credenciales incorrectas");
  //     }
  //   } catch (error) {
  //     console.error("Error en el proceso de login:", error);
  //   }
  // };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-[#fffefe] text-[#0a0a0a] pt-20 lg:pt-40 pb-20">
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-2xl px-5 sm:px-10 mb-10 lg:mb-0">
        <Image
          src="https://i.postimg.cc/G3QXSw8Y/carpincho.png"
          alt="Carpi Bienvenida"
          width={300}
          height={300}
          layout="responsive"
          className="object-cover w-48 h-48 sm:w-64 sm:h-64 mb-6 lg:mb-0 lg:mr-8"
        />
        <div className="text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">
            Che! Volviste
          </h2>
          <p className="leading-relaxed text-base sm:text-lg lg:text-xl mb-6">
            Bienvenido a la experiencia del turismo argentino. Desde la
            majestuosidad de la Patagonia hasta las vibrantes ciudades, estamos
            aquí para ayudarte a planificar tu próxima aventura.
          </p>
        </div>
      </div>
      <div className="w-full max-w-lg p-6 sm:p-8 bg-white bg-opacity-90 border border-[#0a0a0a] rounded-md shadow-lg space-y-6 lg:ml-20">
        <h2 className="text-xl sm:text-2xl font-bold text-center tracking-wider">
          Inicia sesión
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg text-[#0a0a0a] placeholder-gray-500 focus:outline-none p-2"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full bg-transparent border-b border-[#0a0a0a] text-lg text-[#0a0a0a] placeholder-gray-500 focus:outline-none p-2"
                  placeholder="Contraseña"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
                <button
                  type="button"
                  aria-label="Mostrar/Ocultar contraseña"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center w-full border border-[#0a0a0a] text-[#0a0a0a] text-sm py-2 bg-[#a6d2ff] rounded-md hover:bg-[#76bafe] transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando sesión..." : "Inicia Sesión"}
              </button>
            </Form>
          )}
        </Formik>

        <button
          onClick={() => googleLogin()}
          className="flex items-center justify-center w-full border border-[#0a0a0a] text-[#0a0a0a] text-sm py-2 bg-[#f8f9fa] rounded-md hover:bg-[#efefe9] transition duration-300"
        >
          <Image
            src="https://i.postimg.cc/kX92B8Gx/images-Photoroom.png"
            alt="Google Logo"
            width={24}
            height={24}
            className="mr-2"
          />
          Inicia sesión con Google
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/register">
              <span className="text-blue-600 hover:underline">
                Regístrate aquí
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

