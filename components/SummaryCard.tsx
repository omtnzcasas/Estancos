
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculationResult } from '../types';
import { TrendingUp, Wallet, Calendar, BarChart3, Receipt, Scale, Percent, History, ShieldCheck } from 'lucide-react';
import { CHART_COLORS } from '../constants';

interface SummaryCardProps {
  results: CalculationResult;
  multiplier: number;
  yearsRemaining: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ results, multiplier, yearsRemaining }) => {
  const chartData = results.profitByCategory.map(item => ({
    name: item.label,
    value: item.profit
  })).filter(item => item.value > 0);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

  return (
    <div className="sticky top-6 space-y-6">
      {/* Valoración Principal */}
      <div className="bg-indigo-950 text-white p-8 rounded-[2rem] shadow-2xl overflow-hidden relative border border-indigo-800">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Scale size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-indigo-400" />
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Valoración Profesional</p>
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-8 text-white">
            {formatCurrency(results.estimatedValuation)}
          </h2>
          
          <div className="space-y-5 pt-6 border-t border-indigo-800/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-indigo-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                  <BarChart3 size={10} /> Facturación
                </p>
                <p className="text-lg font-bold text-white truncate">
                  {formatCurrency(results.totalAnnualRevenue)}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-indigo-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1 justify-end text-right">
                  <Calendar size={10} /> Vigencia
                </p>
                <p className="text-lg font-bold text-white text-right">{yearsRemaining} años</p>
              </div>
            </div>

            <div className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-800">
               <div className="flex justify-between items-center mb-4">
                  <p className="text-indigo-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
                    <Percent size={10} className="text-indigo-500" /> Ratio de Traspaso: {multiplier}%
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-indigo-300">Margen Bruto:</span>
                    <span className="font-bold text-indigo-100">{formatCurrency(results.totalAnnualGrossProfit)}</span>
                  </div>
                  <div className="flex justify-between text-indigo-400">
                    <span className="flex items-center gap-1">Gastos Totales:</span>
                    <span>- {formatCurrency(results.totalAnnualExpenses)}</span>
                  </div>
                  <div className="flex justify-between text-base pt-3 border-t border-indigo-800 font-black text-indigo-200">
                    <span>Beneficio Neto:</span>
                    <span className="text-white">{formatCurrency(results.totalAnnualNetProfit)}</span>
                  </div>
                </div>
            </div>

            <div className="bg-white text-indigo-950 p-4 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <History size={18} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-wider">Payback estimado</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">
                  {results.yearsOfBenefit > 0 ? results.yearsOfBenefit.toFixed(2) : '0.00'}
                </span>
                <span className="text-[10px] ml-1 font-bold">AÑOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-[2rem] border border-indigo-50 shadow-sm">
        <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-6 text-center">
          Reparto de Márgenes por Categoría
        </h3>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#312e81' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-indigo-200 space-y-2">
              <BarChart3 size={40} strokeWidth={1} />
              <p className="text-xs font-bold uppercase tracking-widest">Sin datos de ingresos</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
        <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic text-center">
          "La valoración se ajusta dinámicamente según la vida útil de la concesión administrativa (Relación 1:1)."
        </p>
      </div>
    </div>
  );
};
