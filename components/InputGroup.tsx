
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
    <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            {icon}
          </div>
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">{title}</h3>
        </div>
        <button 
          onClick={onAdd}
          className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
          title="Agregar concepto"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <input
              type="text"
              value={item.name}
              onChange={(e) => onChange(item.id, 'name', e.target.value)}
              placeholder="Proveedor / Concepto"
              className="flex-1 px-3 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-indigo-900 placeholder:text-indigo-300"
            />
            <div className="relative w-32">
              <input
                type="number"
                value={item.amount || ''}
                onChange={(e) => onChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-right font-medium text-indigo-900"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-xs font-bold">€</span>
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="p-2.5 text-indigo-200 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-indigo-300 italic py-2 text-center">No hay conceptos registrados.</p>
        )}
      </div>
    </div>
  );
};
