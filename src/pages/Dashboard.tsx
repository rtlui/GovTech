import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../services/apiService';
import type { CitizenRequest } from '../types';
import { Clock, AlertTriangle, FileText } from 'lucide-react';

const COLORS = ['#d4af37', '#b5952f', '#f5f3eb', '#111111', '#333333'];

export const Dashboard = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiService.getAdminRequests();
        setRequests(data || []);
      } catch (e) {
        console.error("Error fetching dashboard data", e);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const totalRequests = requests.length;
  const highPriorityCount = requests.filter(r => r.prioridad === 'Alta').length;
  
  // Aggregate data for charts
  const categoryCount = requests.reduce((acc, req) => {
    const t = req.tipo_solicitud || 'Desconocido';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  const statusCount = requests.reduce((acc, req) => {
    const s = req.estado || 'Desconocido';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCount).map(key => ({
    name: key,
    value: statusCount[key]
  }));

  if (loading) {
    return <div className="flex h-full items-center justify-center text-brand-gold">Cargando...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-brand-black">Panel de Control</h2>
        <p className="text-brand-gray mt-1">Resumen ejecutivo del estado de las solicitudes ciudadanas.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 flex items-start justify-between border-l-4 border-l-brand-gold">
          <div>
            <p className="text-sm font-medium text-brand-gray uppercase tracking-wider mb-1">Total Solicitudes</p>
            <h3 className="text-4xl font-bold text-brand-black">{totalRequests}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-gold-dark">
            <FileText size={24} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 flex items-start justify-between border-l-4 border-l-[#111111]">
          <div>
            <p className="text-sm font-medium text-brand-gray uppercase tracking-wider mb-1">Prioridad Alta</p>
            <h3 className="text-4xl font-bold text-brand-black">{highPriorityCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-brand-black">
            <AlertTriangle size={24} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 flex items-start justify-between border-l-4 border-l-brand-gray">
          <div>
            <p className="text-sm font-medium text-brand-gray uppercase tracking-wider mb-1">Tiempo Promedio</p>
            <h3 className="text-4xl font-bold text-brand-black">2.4<span className="text-lg font-medium text-brand-gray ml-1">hrs</span></h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-brand-gray">
            <Clock size={24} />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-lg mb-6">Distribución por Categoría</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f5f3eb'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#d4af37" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="font-semibold text-lg mb-2">Estado de Progreso</h4>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-brand-gray">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
