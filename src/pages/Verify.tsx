import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Enlace de verificación inválido o incompleto.');
      return;
    }

    const verify = async () => {
      try {
        await apiService.verifyEmail(token);
        setStatus('success');
        setMessage('Tu correo ha sido verificado exitosamente. Ya puedes iniciar sesión.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Error al verificar el correo. El enlace puede haber expirado o ser inválido.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-yellow-600 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificando...</h2>
            <p className="text-gray-500">Estamos verificando tu correo electrónico.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Verificación Exitosa!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              to="/"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black transition-all"
            >
              Ir al Inicio
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de Verificación</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              to="/"
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              Volver al Inicio
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};
