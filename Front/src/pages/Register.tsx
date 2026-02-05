import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks/useRedux";
import { login } from "../store/slices/authSlice";
import { loginWithGoogleOAuth } from "../services/googleAuth";
import api from "../services/api";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthHeader from "../components/AuthHeader";
import Divider from "../components/Divider";
import SubmitButton from "../components/SubmitButton";
import InputFieldWithIcon from "../components/InputFieldWithIcon";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const watchPassword = watch("password");

  const onSubmit = async (formData: RegisterFormInputs) => {
    try {
      const response = await api.post("/register", formData);
      const { token, user } = response.data;
      dispatch(login({ token, user }));
      toast.success("¡Cuenta creada exitosamente!");
      navigate("/");
    } catch (error) {
      let message = "No se pudo registrar";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      console.log("Iniciando registro con Google OAuth...");
      const response = await loginWithGoogleOAuth();

      console.log("Autenticación con Google exitosa, iniciando sesión...");
      dispatch(
        login({
          token: response.token,
          user: response.user,
        }),
      );

      toast.success("¡Cuenta creada exitosamente con Google!");
      navigate("/");
    } catch (error) {
      let errorMessage = "No se pudo registrar con Google";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error de registro con Google:", error);
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthHeader
        title="Crea tu cuenta"
        subtitle="O inicia sesión en tu cuenta existente"
        linkText="inicia sesión en tu cuenta existente"
        linkTo="/login"
      />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <InputFieldWithIcon
              id="name"
              label="Nombre completo"
              placeholder="Juan Pérez"
              type="text"
              icon={<User className="h-5 w-5 text-gray-400" />}
              error={errors.name}
              disabled={isSubmitting}
              registration={register("name", {
                required: "El nombre es requerido",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El nombre no debe exceder 50 caracteres",
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message:
                    "El nombre solo puede contener letras y espacios",
                },
              })}
              autoComplete="name"
            />

            <InputFieldWithIcon
              id="email"
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              type="email"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              error={errors.email}
              disabled={isSubmitting}
              registration={register("email", {
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Por favor ingresa un correo electrónico válido",
                },
              })}
              autoComplete="email"
            />

            <InputFieldWithIcon
              id="password"
              label="Contraseña"
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.password}
              disabled={isSubmitting}
              registration={register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "La contraseña no debe exceder 100 caracteres",
                },
                pattern: {
                  value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
                },
              })}
              autoComplete="new-password"
            />
            <div className="relative -mt-7 pt-1 flex justify-end pr-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <InputFieldWithIcon
              id="password_confirmation"
              label="Confirmar contraseña"
              placeholder="••••••"
              type={showPasswordConfirmation ? "text" : "password"}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.password_confirmation}
              disabled={isSubmitting}
              registration={register("password_confirmation", {
                required: "La confirmación de contraseña es requerida",
                validate: (value) =>
                  value === watchPassword ||
                  "Las contraseñas deben coincidir",
              })}
              autoComplete="new-password"
            />
            <div className="relative -mt-7 pt-1 flex justify-end pr-3">
              <button
                type="button"
                onClick={() =>
                  setShowPasswordConfirmation(!showPasswordConfirmation)
                }
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <SubmitButton disabled={googleLoading} loading={isSubmitting}>
              Registrarse
            </SubmitButton>

            <Divider />

            {/* Botón Google */}
            <GoogleAuthButton
              onClick={handleGoogleRegister}
              loading={googleLoading}
              disabled={isSubmitting}
              loadingText="Registrando..."
              defaultText="Regístrate con Google"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
