
import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';

// Form schema for login
const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Form schema for signup with additional fields
const signupSchema = z.object({
  name: z.string().min(1, 'Digite seu nome'),
  email: z.string().email('Digite um e-mail válido'),
  phone: z.string().min(1, 'Digite seu telefone'),
  role: z.string().min(1, 'Digite sua função'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabParam === 'signup' ? 'signup' : 'login');
  const { user, isLoading, signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    if (tabParam === 'signup') {
      setActiveTab('signup');
    } else if (tabParam === 'login') {
      setActiveTab('login');
    }
  }, [tabParam]);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onLoginSubmit = async (data: LoginFormValues) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast.error('Falha ao entrar', {
        description: error.message || 'Verifique suas credenciais e tente novamente',
      });
    }
  };
  
  const onSignupSubmit = async (data: SignupFormValues) => {
    const { error } = await signUp(data.email, data.password);
    if (error) {
      toast.error('Falha ao criar conta', {
        description: error.message || 'Verifique suas informações e tente novamente',
      });
    } else {
      toast.success('Conta criada com sucesso', {
        description: 'Verifique seu e-mail para confirmar o cadastro',
      });
      setActiveTab('login');
    }
  };

  // Redirect if user is already authenticated
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Vendah+ - {activeTab === 'login' ? 'Login' : 'Cadastro'}</title>
      </Helmet>
      
      <div className="min-h-screen bg-dark-gradient flex flex-col justify-center items-center px-4 py-10">
        <div className="mb-10 flex flex-col items-center">
          <img 
            src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
            alt="Vendah+"
            className="h-32 mb-2" 
          />
        </div>
        
        <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl border-vendah-purple/20 overflow-hidden backdrop-filter backdrop-blur-md bg-black/70">
          <CardContent className="p-8">
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
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">E-mail</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Digite seu e-mail" 
                              className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                              autoFocus
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha" 
                                className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 pr-10 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]"
                                {...field} 
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(prev => !prev)}
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="text-right">
                      <a href="#" className="text-vendah-neon hover:text-vendah-neon/80 hover:underline text-sm font-medium transition-colors">Esqueceu a senha?</a>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-vendah-neon hover:bg-vendah-neon/90 text-vendah-black font-bold py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.6)] text-base"
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? 'Entrando...' : 'ENTRAR'}
                    </Button>
                    
                    <div className="text-center pt-2">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('signup')} 
                        className="text-vendah-neon hover:text-vendah-neon/80 hover:underline text-base font-medium transition-colors"
                      >
                        Criar conta
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <h2 className="text-xl font-bold mb-6 text-center text-white">Cadastrar sua conta</h2>
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">Nome completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite seu nome" 
                              className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">E-mail</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Digite seu e-mail" 
                              className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">Telefone</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="Digite seu telefone" 
                              className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">Função na empresa</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite sua função" 
                              className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha" 
                                className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 pr-10 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                                {...field}
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(prev => !prev)}
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 text-sm mb-1 font-medium">Confirmar senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirme sua senha" 
                                className="bg-vendah-black/80 border-2 border-vendah-purple/40 text-white placeholder:text-gray-500 rounded-lg py-6 px-4 pr-10 focus:border-vendah-purple focus:ring-vendah-purple focus:ring-1 focus:shadow-[0_0_8px_rgba(93,46,140,0.5)]" 
                                {...field}
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                              >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-vendah-purple hover:bg-vendah-purple/90 text-white font-bold py-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(93,46,140,0.6)] mt-2 text-base"
                      disabled={signupForm.formState.isSubmitting}
                    >
                      {signupForm.formState.isSubmitting ? 'Cadastrando...' : 'CADASTRAR'}
                    </Button>
                    
                    <div className="text-center pt-2">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('login')} 
                        className="text-vendah-neon hover:text-vendah-neon/80 hover:underline text-base font-medium transition-colors"
                      >
                        Já tem conta? Fazer login
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-gray-400 text-sm font-medium">
          © 2025 Vendah+. Todos os direitos reservados.
        </div>
      </div>
    </>
  );
};

export default AuthPage;
