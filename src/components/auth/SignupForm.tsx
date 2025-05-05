
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

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

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<SignupFormValues>({
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
  
  const onSubmit = async (data: SignupFormValues) => {
    const { error } = await signUp(data.email, data.password);
    if (error) {
      toast.error('Falha ao criar conta', {
        description: error.message || 'Verifique suas informações e tente novamente',
      });
    } else {
      toast.success('Conta criada com sucesso', {
        description: 'Verifique seu e-mail para confirmar o cadastro',
      });
      onSwitchToLogin();
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-6 text-center text-white">Cadastrar sua conta</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Cadastrando...' : 'CADASTRAR'}
          </Button>
          
          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={onSwitchToLogin} 
              className="text-vendah-neon hover:text-vendah-neon/80 hover:underline text-base font-medium transition-colors"
            >
              Já tem conta? Fazer login
            </button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
