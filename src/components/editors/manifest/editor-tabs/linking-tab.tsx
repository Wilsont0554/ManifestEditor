import React from 'react';

interface SectionProps {
  title: string;
  placeholder: string;
  buttonText: string;
  variant?: 'outline' | 'filled';
  isFilled?: boolean;
}

const PropertySection: React.FC<SectionProps> = ({ 
  title, 
  placeholder, 
  buttonText, 
  variant = 'outline', 
  isFilled = false 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-[14px] font-semibold text-gray-800 mb-2">{title}</h3>
      
      {/* Box Area */}
      <div className={`
        flex items-center justify-center rounded-md min-h-20 mb-2 border text-sm
        ${variant === 'filled' ? 'bg-[#eeeeee] border-transparent' : 'bg-white border-gray-200'}
      `}>
        <span className="text-gray-400 font-medium">
          {isFilled ? 'Content added' : placeholder}
        </span>
      </div>

      {/* Action Button */}
      <button className="flex items-center text-[13px] font-medium transition-opacity hover:opacity-80">
        {variant === 'outline' ? (
          <div className="flex items-center gap-1.5 bg-[#fdf2f7] px-2 py-1 rounded-sm text-[#8c3a5a]">
            <span className="text-lg leading-none mb-0.5">+</span>
            <span>{buttonText}</span>
          </div>
        ) : (
          <span className="text-[#8c3a5a] mt-1">{buttonText}</span>
        )}
      </button>
    </div>
  );
};

const ManifestTabBody: React.FC = () => {
  return (
    <div className="p-4 bg-white">
      <PropertySection 
        title="See also" 
        placeholder="No see also" 
        buttonText="Add See also" 
      />
      
      <PropertySection 
        title="Rendering" 
        placeholder="No rendering" 
        buttonText="Add Rendering" 
      />

      <PropertySection 
        title="Start" 
        placeholder="No start resource" 
        buttonText="Set start"
        variant="filled" 
      />
    </div>
  );
};

export default function LinkingTab() {
  return <ManifestTabBody />;
}