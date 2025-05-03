
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a página de leads
    navigate('/leads');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Conecta Brasil</h1>
        <p className="text-xl text-gray-600">Carregando gerenciamento de leads...</p>
      </div>
    </div>
  );
};

export default Index;
