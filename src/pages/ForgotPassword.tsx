import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';

export const ForgotPassword = () => {
  const [correo, setCorreo] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await apiService.forgotPassword(correo);
      setStatus('success');
      setMessage('Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Ocurrió un error al procesar tu solicitud.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8"
      >
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Volver al Inicio
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>

        {status === 'success' ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {message}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="juan@ejemplo.com"
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !correo}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
            >
              {status === 'loading' ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Enviar Enlace
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
