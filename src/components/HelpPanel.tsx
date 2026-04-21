import React, { useMemo } from 'react';
import { Panel } from '@xyflow/react';
import { useStore } from '../store';

export function HelpPanel() {
  const selectedNodeIds = useStore(state => state.selectedNodeIds);

  const suggestion = useMemo(() => {
    if (selectedNodeIds.length > 1) {
      return "💡 Presiona 'Agrupar Múltiples' arriba a la izquierda para fusionarlos en un Backdrop.";
    }
    if (selectedNodeIds.length === 1) {
      return "💡 Click + Arrastrar: Mover | Tecla [Supr] o '×': Borrar componente.";
    }
    return "💡 Shift + Arrastrar: Seleccionar múltiples | Doble-clic en línea: Añadir curvatura (Waypoint)";
  }, [selectedNodeIds]);

  return (
    <Panel position="bottom-right" style={{ 
      background: 'rgba(0, 0, 0, 0.7)', 
      padding: '10px 18px', 
      borderRadius: '6px',
      color: '#bbb',
      fontSize: '13px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(4px)',
      pointerEvents: 'none',
      letterSpacing: '0.3px',
      margin: '20px'
    }}>
      {suggestion}
    </Panel>
  );
}
