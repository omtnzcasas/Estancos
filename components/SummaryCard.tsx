
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculationResult } from '../types';
import { TrendingUp, Wallet, Calendar, BarChart3, Receipt, Scale, Percent, History } from 'lucide-react';

interface SummaryCardProps {
  results: CalculationResult;
  multiplier: number; // This is the percentage applied to revenue
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
      {/* Valuation Header */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Scale size={120} />
        </div>
        
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium mb-1">Valoración Estimada del Traspaso</p>
          <h2 className="text-4xl font-bold tracking-tight mb-8 text-emerald-400">
            {formatCurrency(results.estimatedValuation)}
          </h2>
          
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                  <BarChart3 size={12} /> Facturación Anual
                </p>
                <p className="text-lg font-semibold text-slate-200">
                  {formatCurrency(results.totalAnnualRevenue)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs mb-1 flex items-center gap-1 justify-end">
                  <Calendar size={12} /> Vigencia
                </p>
                <p className="text-lg font-semibold">{yearsRemaining} años</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-2 tracking-wider flex items-center gap-1">
                  <Percent size={10} /> Base: {multiplier}% facturación
                </p>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Margen Bruto (Comisiones):</span>
                  <span className="font-medium text-slate-100">{formatCurrency(results.totalAnnualGrossProfit)}</span>
                </div>
                <div className="flex justify-between text-sm mb-3 text-red-400">
                  <span className="flex items-center gap-1"><Receipt size={10}/> Gastos de Explotación:</span>
                  <span>- {formatCurrency(results.totalAnnualExpenses)}</span>
                </div>
                <div className="flex justify-between text-base border-t border-slate-700 pt-3 font-bold text-emerald-400">
                  <span>Beneficio Neto Real:</span>
                  <span>{formatCurrency(results.totalAnnualNetProfit)}</span>
                </div>
              </div>
            </div>

            {/* NEW: Years of benefit equivalent breakdown */}
            <div className="bg-emerald-900/30 p-4 rounded-xl border border-emerald-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-100 uppercase tracking-wide">Equivalencia en Beneficios</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-emerald-400">
                  {results.yearsOfBenefit > 0 ? results.yearsOfBenefit.toFixed(2) : '0.00'}
                </span>
                <span className="text-[10px] ml-1 text-emerald-300">AÑOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          Composición del Margen Bruto
        </h3>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <p className="text-sm">Introduce datos de facturación</p>
            </div>
          )}
        </div>
      </div>

      {/* Logic Note */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm text-balance">
           Análisis de Rentabilidad
        </h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          La valoración calculada ({formatCurrency(results.estimatedValuation)}) representa recuperar la inversión en aproximadamente <strong>{results.yearsOfBenefit.toFixed(1)} años</strong> de beneficio neto real. 
          Un valor entre 3 y 5 años se considera estándar para este tipo de negocios, dependiendo del riesgo y ubicación.
        </p>
      </div>
    </div>
  );
};
