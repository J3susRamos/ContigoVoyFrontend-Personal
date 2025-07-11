"use client";

const EmptyState: React.FC = () => (
  <div className="w-full max-w-md mx-auto text-center py-12">
    <div className="bg-gradient-to-br from-[#7f7fee]/20 to-[#e8eaed] dark:from-[#23234a] dark:to-[#181824] rounded-2xl shadow-xl p-8 border border-[#7f7fee]/20 dark:border-[#7f7fee]/30">
      <div className="text-[#7f7fee] dark:text-[#bcbcff] mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-[#7f7fee] dark:text-[#bcbcff] mb-2">No hay citas disponibles</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">No se encontraron citas para mostrar en este momento.</p>
    </div>
  </div>
);

export default EmptyState;