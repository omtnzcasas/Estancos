
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SupplierValue } from '../types';

interface InputGroupProps {
  title: string;
  items: SupplierValue[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: 'name' | 'amount', value: string | number) => void;
  icon?: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  title, 
  items, 
  onAdd, 
  onRemove, 
  onChange,
  icon 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-500">{icon}</span>}
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <button 
          onClick={onAdd}
          className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
          title="Agregar concepto"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300">
            <input
              type="text"
              value={item.name}
              onChange={(e) => onChange(item.id, 'name', e.target.value)}
              placeholder="Proveedor / Concepto"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <div className="relative w-32">
              <input
                type="number"
                value={item.amount || ''}
                onChange={(e) => onChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Total anual"
                className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-right"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">€</span>
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-400 italic py-2">No hay conceptos añadidos.</p>
        )}
      </div>
    </div>
  );
};
