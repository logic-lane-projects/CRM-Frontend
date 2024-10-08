import React, { useState } from 'react';
import { AppProvider, Card, TextField, Button, Page } from '@shopify/polaris';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const hardcodedEmail = 'usuario@example.com';
  const hardcodedPassword = 'contraseña123';

  const handleSubmit = () => {
    
    // Aquí puedes manejar la lógica de autenticación
    if (email === hardcodedEmail && password === hardcodedPassword) {
      
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);

      alert('Inicio de sesion exitoso')
      
    } else {
      // Lógica de autenticación
      console.log('Email:', email);
      console.log('Password:', password);

      // Resetear el error si todo es correcto
      setError('Credenciales incorrectas');
    }
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <AppProvider i18n={{}}>
        <Page title="Iniciar sesión">
          <Card >
            <TextField
              label="Correo electrónico"
              value={email}
              onChange={(value) => setEmail(value)}
              type="email"
              autoComplete="email"
              error={error.length>0 ? 'El correo electrónico es requerido.' : undefined}              
            />
            <TextField
              label="Contraseña"
              value={password}
              onChange={(value) => setPassword(value)}
              type="password"
              autoComplete="current-password"
              error={error.length>0 ? 'La contraseña es requerida.' : undefined}
            />
            <Button onClick={handleSubmit} variant='primary'>
              Iniciar sesión
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </Card>
        </Page>
      </AppProvider>
    </form>
  );
};

export default Login;
