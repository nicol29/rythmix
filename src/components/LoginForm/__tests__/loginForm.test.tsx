import { render, screen } from '@testing-library/react';
import LoginForm from '../loginForm';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';


jest.mock('next/navigation', () => require('next-router-mock'));
jest.mock('../../../server-actions/addExtraAccountInfo');
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");

  return {
    __esModule: true,
    ...originalModule,
    signIn: jest.fn(() => {
      setTimeout(() => Promise.resolve(), 500);
    }),
  };
});

describe('RegistrationForm', () => {
  it('renders the complete account form', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('should display error messages under required fields if form is submitted incomplete', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: 'Log In' });
    await user.click(submitButton);

    const emailErrorMesg = await screen.findByText('Must provide a valid email address');
    const passwordErrorMesg = await screen.findByText('Enter password');

    expect(emailErrorMesg).toBeInTheDocument();
    expect(passwordErrorMesg).toBeInTheDocument();
  });

  it('should not display error messages when form is submitted with correctly populated fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailField = screen.getByLabelText('Email');
    const passwordField = screen.getByLabelText('Password');

    await user.type(emailField, 'johndoe@platz.co');
    await user.type(passwordField, '123456');

    const submitButton = screen.getByRole('button', { name: 'Log In' });
    await user.click(submitButton);

    expect(signIn).toHaveBeenCalled();

    const emailErrorMesg = screen.queryByText('Must provide a valid email address');
    const passwordErrorMesg = screen.queryByText('Enter password');

    expect(emailErrorMesg).not.toBeInTheDocument();
    expect(passwordErrorMesg).not.toBeInTheDocument();
  });

  it('should change the button text on submit to indicate the form is processing', async () => {
    (signIn as jest.Mock).mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, message: "Logged in successfully" }), 200);
      }
    ));
    const user = userEvent.setup();
    render(<LoginForm />);
  
    const emailField = screen.getByLabelText('Email');
    const passwordField = screen.getByLabelText('Password');

    await user.type(emailField, 'johndoe@platz.co');
    await user.type(passwordField, '123456');

    const submitButton = screen.getByRole('button', { name: 'Log In' });
    await user.click(submitButton);

    const loginButtonText = await screen.findByRole('button', { name: 'Logging In'});
    expect(loginButtonText).toBeInTheDocument();
  });
});
