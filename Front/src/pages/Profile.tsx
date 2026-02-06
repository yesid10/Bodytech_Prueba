import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, User } from 'lucide-react';
import api from '../services/api';
import ImageUploader from '../components/ImageUploader';
import { setUser } from '../store/slices/authSlice';
import type { RootState } from '../store/store';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile_image_url: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      profile_image_url: user.profile_image_url || user.google_avatar_url || '',
    });
  }, [user, navigate]);

  const getProfileImage = () => {
    // Prioridad: imagen personalizada > imagen de Google > imagen por defecto
    return (
      formData.profile_image_url ||
      user?.google_avatar_url ||
      'https://via.placeholder.com/120?text=No+Image'
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      profile_image_url: imageUrl,
    }));
  };

  const handleSave = async () => {
    // Validaciones
    if (!formData.name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('El email no puede estar vacío');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put('/profile', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        profile_image_url: formData.profile_image_url,
      });

      // Actualizar Redux con los nuevos datos
      dispatch(setUser(response.data.user));

      // Actualizar localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Perfil actualizado exitosamente');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      const errorMessage = 
        (error instanceof Object && 'response' in error && error.response instanceof Object && 'data' in error.response)
          ? (error.response.data instanceof Object && 'message' in error.response.data
              ? String((error.response.data as Record<string, unknown>).message)
              : String((error.response.data as Record<string, unknown>).error))
          : 'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f1419' }}>
      {/* Header */}
      <div
        className="border-b sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: '#1a1f2a',
          borderColor: '#5a7a9a',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
            style={{ color: '#6b9ac3' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1
            className="text-3xl font-bold mt-4"
            style={{
              background: 'linear-gradient(135deg, #6b9ac3 0%, #8ba880 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Mi Perfil
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="rounded-xl p-8 border"
          style={{
            backgroundColor: '#1a1f2a',
            borderColor: '#5a7a9a',
          }}
        >
          {/* Imagen de Perfil */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-6" style={{ color: '#e5e7eb' }}>
              Foto de Perfil
            </h2>
            <ImageUploader
              currentImage={getProfileImage()}
              onImageChange={handleImageChange}
              isLoading={isSaving}
            />
          </div>

          {/* Divider */}
          <div
            className="my-8 border-t"
            style={{ borderColor: '#5a7a9a' }}
          ></div>

          {/* Formulario de Datos */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ color: '#e5e7eb' }}>
              Información Personal
            </h2>

            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#b0b2b8' }}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre
                </div>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg placeholder-[#b0b2b8] focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                style={{
                  backgroundColor: '#252b38',
                  borderColor: '#6b9ac3',
                  color: '#e5e7eb',
                  borderWidth: '1px',
                  outlineColor: '#6b9ac3',
                }}
                placeholder="Tu nombre"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#b0b2b8' }}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg placeholder-[#b0b2b8] focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                style={{
                  backgroundColor: '#252b38',
                  borderColor: '#6b9ac3',
                  color: '#e5e7eb',
                  borderWidth: '1px',
                  outlineColor: '#6b9ac3',
                }}
                placeholder="tu@email.com"
              />
              {user.auth_provider === 'google' && (
                <p className="text-xs mt-2" style={{ color: '#b0b2b8' }}>
                  ℹ️ Tu email está vinculado a tu cuenta de Google
                </p>
              )}
            </div>

            {/* Provider Info */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: '#252b38',
                borderColor: '#5a7a9a',
              }}
            >
              <p className="text-sm" style={{ color: '#b0b2b8' }}>
                <span className="font-semibold" style={{ color: '#e5e7eb' }}>
                  Proveedor de autenticación:{' '}
                </span>
                {user.auth_provider === 'google' ? '🔗 Google' : '🔐 Local'}
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              style={{
                backgroundColor: '#252b38',
                borderColor: '#5a7a9a',
                color: '#b0b2b8',
                borderWidth: '1px',
              }}
              onMouseEnter={(e) =>
                !isSaving && (e.currentTarget.style.backgroundColor = '#1a1f2a')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#252b38')
              }
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              style={{
                backgroundColor: '#6b9ac3',
                color: '#0f1419',
              }}
              onMouseEnter={(e) =>
                !isSaving && (e.currentTarget.style.backgroundColor = '#7a9db8')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#6b9ac3')
              }
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
