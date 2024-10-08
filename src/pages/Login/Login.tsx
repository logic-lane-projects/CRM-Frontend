import React, { useState } from 'react';
import { AppProvider, Card, TextField, Button, Page } from '@shopify/polaris';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Aquí puedes manejar la lógica de autenticación
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
    } else {
      // Lógica de autenticación
      console.log('Email:', email);
      console.log('Password:', password);
      // Resetear el error si todo es correcto
      setError('');
    }
  };

  return (
    <AppProvider i18n={{}}>
      <Page title="Iniciar sesión">
        <Card >
          <TextField
            label="Correo electrónico"
            value={email}
            onChange={(value) => setEmail(value)}
            type="email"
            autoComplete="email"
            error={error ? 'El correo electrónico es requerido.' : undefined}
          />
          <TextField
            label="Contraseña"
            value={password}
            onChange={(value) => setPassword(value)}
            type="password"
            autoComplete="current-password"
            error={error ? 'La contraseña es requerida.' : undefined}
          />
          <Button onClick={handleSubmit} variant='primary'>
            Iniciar sesión
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Card>
      </Page>
    </AppProvider>
  );
};

export default Login;
