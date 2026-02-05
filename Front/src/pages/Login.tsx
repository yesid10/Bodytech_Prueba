import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks/useRedux";
import { login } from "../store/slices/authSlice";
import { loginWithGoogleOAuth } from "../services/googleAuth";
import api from "../services/api";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckSquare, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (formData: LoginFormInputs) => {
    try {
      const response = await api.post("/login", formData);

      const { getCurrentUser } = await import("../services/authUtils");
      const userResponse = await getCurrentUser(response.data.access_token);

      const userData = userResponse.user || userResponse;
      dispatch(login({ token: response.data.access_token, user: userData }));
      toast.success("¡Ha iniciado sesión correctamente!");
      navigate("/");
    } catch (error) {
      let errorMessage = "No se pudo iniciar sesión";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      console.log("Iniciando inicio de sesión con Google OAuth...");
      const response = await loginWithGoogleOAuth();

      console.log("Autenticación con Google exitosa, iniciando sesión...");
      dispatch(
        login({
          token: response.token,
          user: response.user,
        }),
      );

      toast.success("¡Ha iniciado sesión con Google correctamente!");
      navigate("/");
    } catch (error) {
      let errorMessage = "No se pudo iniciar sesión con Google";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error de inicio de sesión con Google:", error);
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CheckSquare className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inicia sesión en tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            crea una nueva cuenta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Campo de Correo */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="usuario@ejemplo.com"
                  disabled={isSubmitting}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  {...register("email", {
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Por favor ingresa un correo válido",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <div className="mt-1 flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.email.message}</span>
                </div>
              )}
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••"
                  disabled={isSubmitting}
                  className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-1 flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.password.message}</span>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || googleLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Inicia sesión
              </button>
            </div>

            {/* Separador O */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  O continúa con
                </span>
              </div>
            </div>

            {/* Botón Google */}
            <GoogleAuthButton
              onClick={handleGoogleLogin}
              loading={googleLoading}
              disabled={isSubmitting}
              loadingText="Iniciando sesión..."
              defaultText="Inicia sesión con Google"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
