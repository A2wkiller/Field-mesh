import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { useApp, AppProvider } from './AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, View } from 'react-native';

// Suppress specific console.error about act(...) in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('The current testing environment is not configured to support act')) {
    return;
  }
  originalConsoleError(...args);
};

const TestComponent = () => {
  const { login, isAuthenticated, isLoading, userRole } = useApp();
  const [result, setResult] = React.useState<boolean | null>(null);

  return (
    <View>
      <Text testID="loading">{isLoading.toString()}</Text>
      <Text testID="auth">{isAuthenticated.toString()}</Text>
      <Text testID="role">{userRole === null ? 'null' : userRole}</Text>
      <Text testID="result">{result === null ? 'null' : result.toString()}</Text>
      <Button
        testID="login-btn"
        title="Login"
        onPress={async () => {
          const res = await login('invalid_pin');
          setResult(res);
        }}
      />
    </View>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when login is called with an invalid pin', async () => {
    // Avoid act error by letting the render settle naturally with waitFor
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Wait for initial load to finish
    await waitFor(() => {
      expect(screen.getByTestId('loading').props.children).toBe('false');
    });

    // Check initial auth state
    expect(screen.getByTestId('auth').props.children).toBe('false');

    // Trigger login
    fireEvent.press(screen.getByTestId('login-btn'));

    // Wait for result state to update
    await waitFor(() => {
        expect(screen.getByTestId('result').props.children).toBe('false');
    });

    // Verify auth state is still false
    expect(screen.getByTestId('auth').props.children).toBe('false');
    expect(screen.getByTestId('role').props.children).toBe('null');
    expect(AsyncStorage.setItem).not.toHaveBeenCalledWith('auth', expect.anything());
  });
});
