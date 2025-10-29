import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, Briefcase, Users, Building2 } from 'lucide-react';
import { loginUser } from './authSlice';
import { t } from '@/constants/translations';

export function LoginForm({ className }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: 'admin@gmail.com',
    password: 'a'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  }, [dispatch, credentials]);

  const handleInputChange = useCallback((field) => (e) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  return (
    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Left side - Branding */}
      <div className="hidden lg:block text-white space-y-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">CareerZone</h1>
          </div>
          <p className="text-xl text-blue-100">
            {t('login.platformDescription')}
          </p>
          <p className="text-lg text-blue-200 leading-relaxed">
            {t('login.fullDescription')}
          </p>
        </div>

        {/* Feature highlights */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{t('login.companyManagement')}</h3>
              <p className="text-blue-200 text-sm">{t('login.companyManagementDesc')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{t('login.userAdministration')}</h3>
              <p className="text-blue-200 text-sm">{t('login.userAdministrationDesc')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{t('login.jobOversight')}</h3>
              <p className="text-blue-200 text-sm">{t('login.jobOversightDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">{t('login.welcomeBack')}</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {t('login.signInDescription')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={credentials.email}
                  onChange={handleInputChange('email')}
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white/80"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t('login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    className="h-12 pr-12 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white/80"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('login.signingIn')}</span>
                  </div>
                ) : (
                  t('login.signIn')
                )}
              </Button>
            </form>
            
            <div className="pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3"></p>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
