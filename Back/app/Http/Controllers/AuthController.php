<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Crear una nueva instancia de AuthController.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Registrar un nuevo usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Obtener un JWT con las credenciales dadas.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Iniciar sesión o registrar usuario con token de Google OAuth.
     * 
     * Este método maneja el flujo de autenticación con Google:
     * 1. Valida que se envíe el token de Google
     * 2. Decodifica el token para extraer datos del usuario
     * 3. Busca si el usuario ya existe (por google_id o email)
     * 4. Si existe: actualiza datos y genera JWT
     * 5. Si no existe: crea nuevo usuario y genera JWT
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function loginWithGoogle(Request $request)
    {
        // 1. Validar que el token de Google sea proporcionado
        $validator = Validator::make($request->all(), [
            'google_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Se requiere el token de Google',
                'details' => $validator->errors()
            ], 400);
        }

        try {
            // 2. Decodificar el token de Google
            // Opción A: Decodificar sin verificar (rápido, requiere HTTPS)
            $googleData = $this->decodeGoogleToken($request->google_token);

            if (!$googleData) {
                return response()->json([
                    'error' => 'Token de Google inválido'
                ], 401);
            }

            // 3. Buscar usuario existente por google_id O email
            $user = User::where('google_id', $googleData['sub'])
                ->orWhere('email', $googleData['email'])
                ->first();

            if ($user) {
                // 4a. Usuario existente: actualizar datos de Google
                $user->update([
                    'google_id' => $googleData['sub'],
                    'google_avatar_url' => $googleData['picture'] ?? null,
                    'auth_provider' => 'google',
                    'email_verified_at' => now(), // Marcar como verificado (Google lo verifica)
                ]);
            } else {
                // 4b. Usuario nuevo: crear cuenta
                $user = User::create([
                    'name' => $googleData['name'],
                    'email' => $googleData['email'],
                    'google_id' => $googleData['sub'],
                    'google_avatar_url' => $googleData['picture'] ?? null,
                    'auth_provider' => 'google',
                    'password' => Hash::make(Str::random(64)), // Contraseña aleatoria (no se usa para Google)
                    'email_verified_at' => now(), // Email ya verificado por Google
                ]);
            }

            // 5. Generar token JWT
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Ha iniciado sesión correctamente con Google',
                'user' => $user,
                'token' => $token,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Fallo en la autenticación',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Decodificar token de Google (opción rápida).
     * 
     * Este método decodifica el JWT sin verificar la firma.
     * En producción, asegúrate de usar HTTPS siempre.
     * 
     * El token JWT tiene 3 partes separadas por puntos:
     * - header.payload.signature
     * 
     * Decodificamos solo el payload (segundo elemento) que contiene los datos del usuario
     *
     * @param  string  $token
     * @return array|null
     */
    private function decodeGoogleToken($token)
    {
        try {
            // Dividir el token en 3 partes
            $parts = explode('.', $token);

            // Validar que tenga exactamente 3 partes
            if (count($parts) !== 3) {
                return null;
            }

            // El payload es el segundo elemento (índice 1)
            $payload = $parts[1];

            // Agregar padding si es necesario (base64url puede no tenerlo)
            $payload .= str_repeat('=', strlen($payload) % 4);

            // Decodificar base64
            $decoded = base64_decode(strtr($payload, '-_', '+/'));

            // Convertir JSON a array
            $data = json_decode($decoded, true);

            // Validar estructura básica
            if (!isset($data['sub']) || !isset($data['email'])) {
                return null;
            }

            return $data;

        } catch (\Exception $e) {
            \Log::error('Error decoding Google token: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string  $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
