
import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam === 'signup' ? 'signup' : 'login');
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (tabParam === 'signup') {
      setActiveTab('signup');
    } else if (tabParam === 'login') {
      setActiveTab('login');
    }
  }, [tabParam]);

  // Redirect if user is already authenticated
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout pageTitle={activeTab === 'login' ? 'Login' : 'Cadastro'}>
      <AuthCard>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 bg-vendah-black/80 p-1 rounded-lg border border-vendah-purple/30">
            <TabsTrigger 
              value="login"
              className="data-[state=active]:bg-vendah-purple data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400 py-3 text-base transition-all duration-200"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-vendah-purple data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400 py-3 text-base transition-all duration-200"
            >
              Cadastro
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </AuthCard>
    </AuthLayout>
  );
};

export default AuthPage;
