import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks/useRedux";
import { login } from "../store/slices/authSlice";
import { loginWithGoogleOAuth } from "../services/googleAuth";
import api from "../services/api";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthHeader from "../components/AuthHeader";
import Divider from "../components/Divider";
import FormError from "../components/FormError";
import SubmitButton from "../components/SubmitButton";
import InputFieldWithIcon from "../components/InputFieldWithIcon";

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
            <InputFieldWithIcon
              id="email"
              label="Correo electrónico"
              placeholder="usuario@ejemplo.com"
              type="email"
              icon={<Mail className="h-5 w-5" style={{ color: '#b0b2b8' }} />}
              error={errors.email}
              disabled={isSubmitting}
              registration={register("email", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Por favor ingresa un correo válido",
                },
              })}
              autoComplete="email"
            />

            {/* Campo de Contraseña */}
            <InputFieldWithIcon
              id="password"
              label="Contraseña"
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="h-5 w-5" style={{ color: '#b0b2b8' }} />}
              error={errors.password}
              disabled={isSubmitting}
              registration={register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              autoComplete="current-password"
              toggleButton={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="transition-colors cursor-pointer"
                  style={{ color: '#b0b2b8' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e5e7eb'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#b0b2b8'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
            />

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
