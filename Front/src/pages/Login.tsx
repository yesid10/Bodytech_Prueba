import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks/useRedux";
import { login } from "../store/slices/authSlice";
import { loginWithGoogleOAuth } from "../services/googleAuth";
import api from "../services/api";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthHeader from "../components/AuthHeader";
import Divider from "../components/Divider";
import FormError from "../components/FormError";
import SubmitButton from "../components/SubmitButton";

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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#0f1419' }}>
      <AuthHeader
        title="Inicia sesión en tu cuenta"
        subtitle="O crea una nueva cuenta"
        linkText="crea una nueva cuenta"
        linkTo="/register"
      />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10" style={{
          backgroundColor: '#1a1f2a',
          borderColor: '#5a7a9a'
        }}>
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Campo de Correo */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: '#b0b2b8' }}
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
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: errors.email ? '#a17171' : '#5a7a9a',
                    backgroundColor: '#252b38',
                    color: '#e5e7eb'
                  }}
                  {...register("email", {
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Por favor ingresa un correo válido",
                    },
                  })}
                />
              </div>
              <FormError error={errors.email} />
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: '#b0b2b8' }}
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
                  className="appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: errors.password ? '#a17171' : '#5a7a9a',
                    backgroundColor: '#252b38',
                    color: '#e5e7eb'
                  }}
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                  style={{ color: '#b0b2b8' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e5e7eb'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#b0b2b8'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <FormError error={errors.password} />
            </div>

            <SubmitButton disabled={googleLoading} loading={isSubmitting}>
              Inicia sesión
            </SubmitButton>

            <Divider />

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
