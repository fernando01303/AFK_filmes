import { useState } from 'react';
import { PaginaInicial } from './telas/PaginaInicial/PaginaInicial';
import { TelaCadastro } from './telas/CadastroELogin/TelaCadastro';
import { TelaPainelAdmin } from './telas/PainelAdmin/TelaPainelAdmin';
import { TelaSelecaoCategorias } from './telas/SelecaoCategorias/TelaSelecaoCategorias';
import { TelaCatalogo } from './telas/Catalogo/TelaCatalogo';

export function App() {
  const [step, setStep] = useState<'landing' | 'login' | 'onboarding' | 'dashboard' | 'catalog'>('landing');
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    // Para efeito de demonstração, vamos para o onboarding depois do login
    setStep('onboarding');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#000000', margin: 0, padding: 0, overflowX: 'hidden' }}>
      {step === 'landing' && (
        <PaginaInicial onLoginClick={() => setStep('login')} />
      )}

      {step === 'login' && (
        <TelaCadastro onLoginSuccess={handleLoginSuccess} />
      )}
      
      {step === 'onboarding' && (
        <TelaSelecaoCategorias 
          userEmail={userEmail} 
          onComplete={() => setStep('catalog')} 
        />
      )}

      {step === 'catalog' && (
        <TelaCatalogo onLogout={() => setStep('landing')} />
      )}

      {step === 'dashboard' && (
        <TelaPainelAdmin 
          userEmail={userEmail}
          onLogout={() => setStep('landing')} 
        />
      )}
    </div>
  );
}

export default App;
