import { Shirt, Sparkles, ShoppingBag, RotateCcw } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose Look',
      description: 'Select your suit or gown and pick your dates.',
      icon: Shirt,
      bg: 'bg-[#FAF4EB]',
      border: 'border-[#ECDCCB]',
      accent: 'text-[#9E7B4F]',
      badgeBg: 'bg-[#F2E5D4]',
    },
    {
      num: '02',
      title: 'Try It On',
      description: 'Free private fitting & custom alterations.',
      icon: Sparkles,
      bg: 'bg-[#EEF6F0]',
      border: 'border-[#D4E8DA]',
      accent: 'text-[#2D6A4F]',
      badgeBg: 'bg-[#DBEFE1]',
    },
    {
      num: '03',
      title: 'Wear & Celebrate',
      description: 'Enjoy your rental pressed and ready for your event.',
      icon: ShoppingBag,
      bg: 'bg-[#F0F4FA]',
      border: 'border-[#D6E3F2]',
      accent: 'text-[#2C5282]',
      badgeBg: 'bg-[#DEE9F7]',
    },
    {
      num: '04',
      title: 'Easy Return',
      description: 'Drop it off. We handle all eco dry cleaning.',
      icon: RotateCcw,
      bg: 'bg-[#F5F2F7]',
      border: 'border-[#E4DDE9]',
      accent: 'text-[#5B416D]',
      badgeBg: 'bg-[#EAE2F0]',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-[#FAF8F5] border-y border-[#EAE5DC] scroll-mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple & Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-3 border-b border-[#EAE4D9]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#9E7B4F] block">
              How It Works
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191C1A] mt-0.5">
              How to Rent.
            </h2>
          </div>
          <p className="text-xs text-[#736E67] mt-1 sm:mt-0 font-light">
            4 simple steps in Kigali. Fitting and cleaning included.
          </p>
        </div>

        {/* 4 Clean, Colorful & Concise Step Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className={`${step.bg} ${step.border} border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-2xs hover:shadow-xs`}
              >
                <div>
                  {/* Top Bar: Icon and Step Number */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl ${step.badgeBg} flex items-center justify-center ${step.accent} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`font-mono text-xs font-bold ${step.accent}`}>
                      {step.num}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-[#191C1A] leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#59524A] mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
