
import React, { useState, useMemo } from 'react';
import { 
  Cigarette, 
  Flame, 
  Utensils, 
  Smartphone, 
  ShoppingBag, 
  Home, 
  Clock, 
  FileText, 
  Calculator,
  Printer,
  Info,
  Users,
  ShieldCheck,
  Building,
  Receipt,
  Percent
} from 'lucide-react';
import { FormData, CalculationResult, SupplierValue } from './types';
import { DEFAULT_MARGINS, INITIAL_SUPPLIERS } from './constants';
import { InputGroup } from './components/InputGroup';
import { SummaryCard } from './components/SummaryCard';

const createInitialItems = (names: string[]): SupplierValue[] => 
  names.map(name => ({ id: Math.random().toString(36).substr(2, 9), name, amount: 0 }));

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    tobacco: { suppliers: createInitialItems(INITIAL_SUPPLIERS.TOBACCO), margin: DEFAULT_MARGINS.TOBACCO },
    cigars: { suppliers: createInitialItems(INITIAL_SUPPLIERS.CIGARS), margin: DEFAULT_MARGINS.CIGARS },
    smokingAccessories: { suppliers: createInitialItems(INITIAL_SUPPLIERS.SMOKING_ACCESSORIES), margin: DEFAULT_MARGINS.SMOKING_ACCESSORIES },
    food: { suppliers: createInitialItems(INITIAL_SUPPLIERS.FOOD), margin: DEFAULT_MARGINS.FOOD },
    topUps: { suppliers: createInitialItems(INITIAL_SUPPLIERS.TOP_UPS), margin: DEFAULT_MARGINS.TOP_UPS },
    otherProducts: { suppliers: createInitialItems(INITIAL_SUPPLIERS.OTHER), margin: DEFAULT_MARGINS.OTHER },
    personnel: [],
    fixedExpenses: {
      socialSecurity: 0,
      taxes: 0,
      canon: 0
    },
    rent: { isRented: false, price: 0 },
    concession: { yearsRemaining: 25, observations: '' },
    valuationSettings: { percentage: 25 }
  });

  const handleUpdateSection = (section: keyof FormData, id: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section] as any;
      if (Array.isArray(sectionData)) {
        const newList = sectionData.map((s: SupplierValue) => 
          s.id === id ? { ...s, [field]: value } : s
        );
        return { ...prev, [section]: newList };
      } else if (sectionData.suppliers) {
        const newSuppliers = sectionData.suppliers.map((s: SupplierValue) => 
          s.id === id ? { ...s, [field]: value } : s
        );
        return { ...prev, [section]: { ...sectionData, suppliers: newSuppliers } };
      }
      return prev;
    });
  };

  const handleAddSupplier = (section: keyof FormData) => {
    setFormData(prev => {
      const sectionData = prev[section] as any;
      const newItem = { id: Math.random().toString(36).substr(2, 9), name: '', amount: 0 };
      if (Array.isArray(sectionData)) {
        return { ...prev, [section]: [...sectionData, newItem] };
      }
      return { ...prev, [section]: { ...sectionData, suppliers: [...sectionData.suppliers, newItem] } };
    });
  };

  const handleRemoveSupplier = (section: keyof FormData, id: string) => {
    setFormData(prev => {
      const sectionData = prev[section] as any;
      if (Array.isArray(sectionData)) {
        return { ...prev, [section]: sectionData.filter((s: any) => s.id !== id) };
      }
      return { ...prev, [section]: { ...sectionData, suppliers: sectionData.suppliers.filter((s: any) => s.id !== id) } };
    });
  };

  const results = useMemo(() => {
    const calculateSection = (section: any) => {
      const revenue = section.suppliers.reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const profit = revenue * (section.margin / 100);
      return { revenue, profit };
    };

    const categories = [
      { label: 'Tabaco', data: calculateSection(formData.tobacco), color: '#0f172a' },
      { label: 'Puros', data: calculateSection(formData.cigars), color: '#3b82f6' },
      { label: 'Artículos Fumador', data: calculateSection(formData.smokingAccessories), color: '#10b981' },
      { label: 'Alimentación', data: calculateSection(formData.food), color: '#f59e0b' },
      { label: 'Recargas', data: calculateSection(formData.topUps), color: '#ef4444' },
      { label: 'Marroquinería', data: calculateSection(formData.otherProducts), color: '#8b5cf6' },
    ];

    const totalRevenue = categories.reduce((acc, cat) => acc + cat.data.revenue, 0);
    const totalGrossProfit = categories.reduce((acc, cat) => acc + cat.data.profit, 0);
    
    // Expenses
    const rentAnnual = formData.rent.isRented ? formData.rent.price * 12 : 0;
    const personnelAnnual = formData.personnel.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = rentAnnual + personnelAnnual + formData.fixedExpenses.socialSecurity + formData.fixedExpenses.taxes + formData.fixedExpenses.canon;
    
    const netProfit = Math.max(0, totalGrossProfit - totalExpenses);
    
    // Valuation logic: Percentage of total annual revenue
    const estimatedValuation = totalRevenue * (formData.valuationSettings.percentage / 100);

    // Years of benefit equivalent
    const yearsOfBenefit = netProfit > 0 ? estimatedValuation / netProfit : 0;

    return {
      profitByCategory: categories.map(c => ({ label: c.label, profit: c.data.profit, revenue: c.data.revenue, color: c.color })),
      totalAnnualRevenue: totalRevenue,
      totalAnnualGrossProfit: totalGrossProfit,
      totalAnnualExpenses: totalExpenses,
      totalAnnualNetProfit: netProfit,
      estimatedValuation: estimatedValuation,
      yearsOfBenefit: yearsOfBenefit
    } as CalculationResult;
  }, [formData]);

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <Calculator size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">EstancoValora</h1>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Printer size={16} /> Exportar Reporte
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {/* Ingresos Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Info className="text-slate-400" size={20} />
              <h2 className="text-2xl font-bold text-slate-800">Cálculo de Compras y Ventas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup 
                title="Compras Tabaco (8.5%)"
                items={formData.tobacco.suppliers}
                onAdd={() => handleAddSupplier('tobacco')}
                onRemove={(id) => handleRemoveSupplier('tobacco', id)}
                onChange={(id, field, val) => handleUpdateSection('tobacco', id, field, val)}
                icon={<Cigarette size={20} />}
              />
              <InputGroup 
                title="Compras Puros (9.5%)"
                items={formData.cigars.suppliers}
                onAdd={() => handleAddSupplier('cigars')}
                onRemove={(id) => handleRemoveSupplier('cigars', id)}
                onChange={(id, field, val) => handleUpdateSection('cigars', id, field, val)}
                icon={<ShoppingBag size={20} />}
              />
              <InputGroup 
                title="Artículos Fumador (40%)"
                items={formData.smokingAccessories.suppliers}
                onAdd={() => handleAddSupplier('smokingAccessories')}
                onRemove={(id) => handleRemoveSupplier('smokingAccessories', id)}
                onChange={(id, field, val) => handleUpdateSection('smokingAccessories', id, field, val)}
                icon={<Flame size={20} />}
              />
              <InputGroup 
                title="Alimentación (30%)"
                items={formData.food.suppliers}
                onAdd={() => handleAddSupplier('food')}
                onRemove={(id) => handleRemoveSupplier('food', id)}
                onChange={(id, field, val) => handleUpdateSection('food', id, field, val)}
                icon={<Utensils size={20} />}
              />
              <InputGroup 
                title={`Recargas (${DEFAULT_MARGINS.TOP_UPS}%)`}
                items={formData.topUps.suppliers}
                onAdd={() => handleAddSupplier('topUps')}
                onRemove={(id) => handleRemoveSupplier('topUps', id)}
                onChange={(id, field, val) => handleUpdateSection('topUps', id, field, val)}
                icon={<Smartphone size={20} />}
              />
              <InputGroup 
                title={`Marroquinería (${DEFAULT_MARGINS.OTHER}%)`}
                items={formData.otherProducts.suppliers}
                onAdd={() => handleAddSupplier('otherProducts')}
                onRemove={(id) => handleRemoveSupplier('otherProducts', id)}
                onChange={(id, field, val) => handleUpdateSection('otherProducts', id, field, val)}
                icon={<ShoppingBag size={20} />}
              />
            </div>
          </section>

          {/* Gastos Section */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Receipt className="text-red-500" size={24} /> Gastos de Explotación
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personnel */}
              <div className="md:col-span-2">
                <InputGroup 
                  title="Gastos de Personal (Anual)"
                  items={formData.personnel}
                  onAdd={() => handleAddSupplier('personnel')}
                  onRemove={(id) => handleRemoveSupplier('personnel', id)}
                  onChange={(id, field, val) => handleUpdateSection('personnel', id, field, val)}
                  icon={<Users size={20} />}
                />
              </div>

              {/* Fixed Yearly Expenses */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                    <ShieldCheck size={18} /> Seguros Sociales (Anual)
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.fixedExpenses.socialSecurity || ''}
                      onChange={(e) => setFormData(p => ({ ...p, fixedExpenses: { ...p.fixedExpenses, socialSecurity: parseFloat(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                    <Building size={18} /> Canon Concesional (Anual)
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.fixedExpenses.canon || ''}
                      onChange={(e) => setFormData(p => ({ ...p, fixedExpenses: { ...p.fixedExpenses, canon: parseFloat(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                    <Receipt size={18} /> Impuestos Hacienda (Anual)
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.fixedExpenses.taxes || ''}
                      onChange={(e) => setFormData(p => ({ ...p, fixedExpenses: { ...p.fixedExpenses, taxes: parseFloat(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                    <Home size={18} /> Régimen del Local
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setFormData(p => ({ ...p, rent: { ...p.rent, isRented: true } }))}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm ${formData.rent.isRented ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-100 text-slate-400'}`}
                    >
                      Alquiler
                    </button>
                    <button 
                      onClick={() => setFormData(p => ({ ...p, rent: { ...p.rent, isRented: false } }))}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm ${!formData.rent.isRented ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-100 text-slate-400'}`}
                    >
                      Propiedad
                    </button>
                  </div>
                  {formData.rent.isRented && (
                    <div className="mt-2 relative animate-in fade-in slide-in-from-top-1">
                      <input 
                        type="number"
                        value={formData.rent.price || ''}
                        onChange={(e) => setFormData(p => ({ ...p, rent: { ...p.rent, price: parseFloat(e.target.value) || 0 } }))}
                        className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                        placeholder="Mensualidad €"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Concession Section */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Clock size={24} className="text-slate-600" /> Detalles de la Concesión
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="font-semibold text-slate-700 block">Vencimiento de Licencia</label>
                <p className="text-sm text-slate-500">Años restantes para la subasta</p>
                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="1"
                    max="100"
                    value={formData.concession.yearsRemaining}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFormData(p => ({ 
                        ...p, 
                        concession: { ...p.concession, yearsRemaining: val },
                        valuationSettings: { ...p.valuationSettings, percentage: val } // Vinculación 1:1
                      }));
                    }}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <span className="w-12 text-center font-bold text-lg text-slate-900">{formData.concession.yearsRemaining}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-semibold text-slate-700 block">Observaciones</label>
                <textarea 
                  rows={2}
                  value={formData.concession.observations}
                  onChange={(e) => setFormData(p => ({ ...p, concession: { ...p.concession, observations: e.target.value } }))}
                  placeholder="Detalles sobre la subasta o normativa..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 text-sm">Valoración por Facturación Anual (%)</label>
                <p className="text-xs text-slate-400 italic">Porcentaje sobre ventas totales (Vinculado 1:1 a los años restantes)</p>
              </div>
              <div className="flex items-center gap-3">
                 <input 
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    value={formData.valuationSettings.percentage}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setFormData(p => ({ 
                        ...p, 
                        valuationSettings: { ...p.valuationSettings, percentage: val },
                        concession: { ...p.concession, yearsRemaining: Math.round(val) } // Vinculación 1:1
                      }));
                    }}
                    className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-slate-900"
                  />
                  <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                    <Percent size={14} /> sobre facturación
                  </span>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <SummaryCard 
            results={results} 
            multiplier={formData.valuationSettings.percentage}
            yearsRemaining={formData.concession.yearsRemaining}
          />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm pb-12">
        <p>&copy; {new Date().getFullYear()} EstancoValora - Herramienta Profesional de Valoración.</p>
      </footer>
    </div>
  );
};

export default App;
