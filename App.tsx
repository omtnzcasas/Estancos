
import React, { useState, useMemo } from 'react';
import { 
  Cigarette, 
  Flame, 
  Utensils, 
  Smartphone, 
  ShoppingBag, 
  Home, 
  Clock, 
  Calculator,
  Printer,
  Info,
  Users,
  ShieldCheck,
  Building,
  Receipt,
  Percent,
  Scale
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
      { label: 'Tabaco', data: calculateSection(formData.tobacco) },
      { label: 'Puros', data: calculateSection(formData.cigars) },
      { label: 'Accesorios', data: calculateSection(formData.smokingAccessories) },
      { label: 'Comida', data: calculateSection(formData.food) },
      { label: 'Recargas', data: calculateSection(formData.topUps) },
      { label: 'Marroquinería', data: calculateSection(formData.otherProducts) },
    ];

    const totalRevenue = categories.reduce((acc, cat) => acc + cat.data.revenue, 0);
    const totalGrossProfit = categories.reduce((acc, cat) => acc + cat.data.profit, 0);
    
    const rentAnnual = formData.rent.isRented ? formData.rent.price * 12 : 0;
    const personnelAnnual = formData.personnel.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = rentAnnual + personnelAnnual + formData.fixedExpenses.socialSecurity + formData.fixedExpenses.taxes + formData.fixedExpenses.canon;
    
    const netProfit = Math.max(0, totalGrossProfit - totalExpenses);
    const estimatedValuation = totalRevenue * (formData.valuationSettings.percentage / 100);
    const yearsOfBenefit = netProfit > 0 ? estimatedValuation / netProfit : 0;

    return {
      profitByCategory: categories.map(c => ({ label: c.label, profit: c.data.profit, revenue: c.data.revenue, color: '' })),
      totalAnnualRevenue: totalRevenue,
      totalAnnualGrossProfit: totalGrossProfit,
      totalAnnualExpenses: totalExpenses,
      totalAnnualNetProfit: netProfit,
      estimatedValuation: estimatedValuation,
      yearsOfBenefit: yearsOfBenefit
    } as CalculationResult;
  }, [formData]);

  return (
    <div className="min-h-screen bg-indigo-50/40 pb-12">
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-900 text-white p-2.5 rounded-2xl shadow-indigo-200 shadow-lg">
              <Calculator size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-indigo-950 tracking-tight leading-none">EstancoValora</h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Sistemas de Valoración</p>
            </div>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all"
          >
            <Printer size={18} /> Exportar PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* Ingresos Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-1.5 bg-indigo-600 rounded-full" />
              <h2 className="text-2xl font-black text-indigo-950">Ventas Anuales</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup 
                title="Tabaco (8.5%)"
                items={formData.tobacco.suppliers}
                onAdd={() => handleAddSupplier('tobacco')}
                onRemove={(id) => handleRemoveSupplier('tobacco', id)}
                onChange={(id, field, val) => handleUpdateSection('tobacco', id, field, val)}
                icon={<Cigarette size={20} />}
              />
              <InputGroup 
                title="Puros (9.5%)"
                items={formData.cigars.suppliers}
                onAdd={() => handleAddSupplier('cigars')}
                onRemove={(id) => handleRemoveSupplier('cigars', id)}
                onChange={(id, field, val) => handleUpdateSection('cigars', id, field, val)}
                icon={<ShoppingBag size={20} />}
              />
              <InputGroup 
                title="Accesorios (40%)"
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
          <section className="bg-white p-10 rounded-[2.5rem] border border-indigo-50 shadow-sm space-y-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <Receipt size={28} />
              </div>
              <h2 className="text-2xl font-black text-indigo-950">Gastos de Explotación</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                <InputGroup 
                  title="Gastos de Personal"
                  items={formData.personnel}
                  onAdd={() => handleAddSupplier('personnel')}
                  onRemove={(id) => handleRemoveSupplier('personnel', id)}
                  onChange={(id, field, val) => handleUpdateSection('personnel', id, field, val)}
                  icon={<Users size={20} />}
                />
              </div>

              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">
                    <ShieldCheck size={14} /> Seguros Sociales
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.fixedExpenses.socialSecurity || ''}
                      onChange={(e) => setFormData(p => ({ ...p, fixedExpenses: { ...p.fixedExpenses, socialSecurity: parseFloat(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3.5 bg-indigo-50/30 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-indigo-900 font-bold"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-sm">€</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">
                    <Building size={14} /> Canon Anual
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.fixedExpenses.canon || ''}
                      onChange={(e) => setFormData(p => ({ ...p, fixedExpenses: { ...p.fixedExpenses, canon: parseFloat(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3.5 bg-indigo-50/30 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-indigo-900 font-bold"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-sm">€</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">
                    <Receipt size={14} /> Impuestos
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.fixedExpenses.taxes || ''}
                      onChange={(e) => setFormData(p => ({ ...p, fixedExpenses: { ...p.fixedExpenses, taxes: parseFloat(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3.5 bg-indigo-50/30 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-indigo-900 font-bold"
                      placeholder="0.00"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-sm">€</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">
                    <Home size={14} /> Local
                  </label>
                  <div className="flex gap-2 p-1 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <button 
                      onClick={() => setFormData(p => ({ ...p, rent: { ...p.rent, isRented: true } }))}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all ${formData.rent.isRented ? 'bg-indigo-900 text-white shadow-lg' : 'text-indigo-400 hover:text-indigo-600'}`}
                    >
                      Alquiler
                    </button>
                    <button 
                      onClick={() => setFormData(p => ({ ...p, rent: { ...p.rent, isRented: false } }))}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all ${!formData.rent.isRented ? 'bg-indigo-900 text-white shadow-lg' : 'text-indigo-400 hover:text-indigo-600'}`}
                    >
                      Propiedad
                    </button>
                  </div>
                  {formData.rent.isRented && (
                    <div className="mt-3 relative animate-in zoom-in-95 duration-200">
                      <input 
                        type="number"
                        value={formData.rent.price || ''}
                        onChange={(e) => setFormData(p => ({ ...p, rent: { ...p.rent, price: parseFloat(e.target.value) || 0 } }))}
                        className="w-full pl-8 pr-4 py-3.5 bg-white border-2 border-indigo-600 rounded-2xl focus:outline-none text-indigo-900 font-bold"
                        placeholder="Importe mensual"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-sm">€</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Concession Section */}
          <section className="bg-indigo-900 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <Clock size={160} />
            </div>
            
            <div className="flex items-center gap-3 mb-10 relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Scale size={28} className="text-indigo-300" />
              </div>
              <h2 className="text-2xl font-black">Licencia y Valoración 1:1</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Vigencia Restante</label>
                  <span className="text-3xl font-black text-white">{formData.concession.yearsRemaining} <small className="text-xs">años</small></span>
                </div>
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
                      valuationSettings: { ...p.valuationSettings, percentage: val }
                    }));
                  }}
                  className="w-full h-2 bg-indigo-800 rounded-full appearance-none cursor-pointer accent-white"
                />
                <p className="text-[10px] text-indigo-400 font-bold italic">El porcentaje de valoración se ajusta automáticamente al número de años.</p>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Ratio sobre Ventas</label>
                    <div className="flex items-center justify-center gap-1">
                       <input 
                        type="number"
                        min="1"
                        max="100"
                        value={formData.valuationSettings.percentage}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(1, parseFloat(e.target.value) || 0));
                          setFormData(p => ({ 
                            ...p, 
                            valuationSettings: { ...p.valuationSettings, percentage: val },
                            concession: { ...p.concession, yearsRemaining: Math.round(val) }
                          }));
                        }}
                        className="bg-transparent text-5xl font-black w-24 text-center focus:outline-none border-b-2 border-white/20 focus:border-white transition-all"
                      />
                      <span className="text-3xl font-black text-indigo-400">%</span>
                    </div>
                  </div>
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

      <footer className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-indigo-100 text-center pb-20">
        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} EstancoValora Professional Edition</p>
      </footer>
    </div>
  );
};

export default App;
