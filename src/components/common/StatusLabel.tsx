import React from 'react';
import { CheckCircle2, Clock, PauseCircle, XCircle, AlertTriangle } from 'lucide-react';

interface StatusLabelProps {
  variant:
    | 'activa'
    | 'pausada'
    | 'cerrada'
    | 'validado_demo'
    | 'pendiente_validacion'
    | 'compatible'
    | 'parcial'
    | 'pendiente'
    | 'incompatible';
  text?: string;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ variant, text }) => {
  const config: Record<
    StatusLabelProps['variant'],
    { label: string; colorClass: string; Icon: React.FC<{ className?: string }> }
  > = {
    activa: {
      label: 'Activa',
      colorClass: 'text-[#15803D]',
      Icon: CheckCircle2,
    },
    pausada: {
      label: 'Pausada',
      colorClass: 'text-[#B45309]',
      Icon: PauseCircle,
    },
    cerrada: {
      label: 'Cerrada',
      colorClass: 'text-[#708077]',
      Icon: XCircle,
    },
    validado_demo: {
      label: 'Perfil validado (Demo)',
      colorClass: 'text-[#15803D]',
      Icon: CheckCircle2,
    },
    pendiente_validacion: {
      label: 'Pendiente de validación',
      colorClass: 'text-[#B45309]',
      Icon: Clock,
    },
    compatible: {
      label: 'Compatible',
      colorClass: 'text-[#15803D]',
      Icon: CheckCircle2,
    },
    parcial: {
      label: 'Parcial',
      colorClass: 'text-[#B45309]',
      Icon: AlertTriangle,
    },
    pendiente: {
      label: 'Pendiente de confirmación',
      colorClass: 'text-[#B45309]',
      Icon: Clock,
    },
    incompatible: {
      label: 'Incompatible',
      colorClass: 'text-[#DC2626]',
      Icon: XCircle,
    },
  };

  const { label, colorClass, Icon } = config[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${colorClass}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{text ?? label}</span>
    </span>
  );
};
