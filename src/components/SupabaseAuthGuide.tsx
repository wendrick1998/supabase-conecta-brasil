
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const SupabaseAuthGuide: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Configure a Autenticação no Supabase</CardTitle>
        <CardDescription>
          Para usar o sistema com as novas políticas de segurança (RLS), você precisa configurar a autenticação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Importante!</AlertTitle>
          <AlertDescription>
            Com as melhorias de segurança implementadas, agora é necessário estar logado para acessar os dados.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-medium">Siga estes passos para configurar a autenticação:</h3>
          
          <ol className="list-decimal ml-5 space-y-2">
            <li>Acesse o <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Dashboard do Supabase</a></li>
            <li>Selecione seu projeto: <span className="font-mono bg-gray-100 px-1 rounded">hqfxzjuqjjdnmoaenore</span></li>
            <li>Navegue até <span className="font-semibold">Authentication &gt; URL Configuration</span></li>
            <li>Configure <span className="font-semibold">Site URL</span> como <span className="font-mono bg-gray-100 px-1 rounded">http://localhost:3000</span> (ou sua URL de produção)</li>
            <li className="space-y-1">
              <span>Adicione as seguintes URLs em <span className="font-semibold">Redirect URLs</span>:</span>
              <ul className="list-disc ml-5 space-y-1">
                <li><span className="font-mono bg-gray-100 px-1 rounded text-xs sm:text-sm">http://localhost:3000/auth</span></li>
                <li><span className="font-mono bg-gray-100 px-1 rounded text-xs sm:text-sm">http://localhost:3000/auth/callback</span></li>
                <li><span className="font-mono bg-gray-100 px-1 rounded text-xs sm:text-sm">http://localhost:3000/dashboard</span></li>
                <li><span className="font-mono bg-gray-100 px-1 rounded text-xs sm:text-sm">http://localhost:8080/auth</span></li>
                <li><span className="font-mono bg-gray-100 px-1 rounded text-xs sm:text-sm">http://localhost:8080/auth/callback</span></li>
                <li><span className="font-mono bg-gray-100 px-1 rounded text-xs sm:text-sm">http://localhost:8080/dashboard</span></li>
              </ul>
            </li>
            <li>
              <div className="flex items-start space-x-2 mt-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Opcional: Para facilitar o desenvolvimento, desative a confirmação de email em <span className="font-semibold">Authentication &gt; Providers &gt; Email</span> desmarcando a opção <span className="font-semibold">Confirm Email</span></span>
              </div>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseAuthGuide;
