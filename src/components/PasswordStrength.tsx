import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = [
    'bg-red-200', 
    'bg-yellow-200', 
    'bg-blue-200', 
    'bg-green-200'
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${
              i < strength ? strengthColor[strength - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-xs mt-1 ${
          strength === 0 ? 'text-red-500' :
          strength === 1 ? 'text-yellow-500' :
          strength === 2 ? 'text-blue-500' :
          'text-green-500'
        }`}>
          Password strength: {strengthText[strength - 1] || 'Too weak'}
        </p>
      )}
    </div>
  );
}