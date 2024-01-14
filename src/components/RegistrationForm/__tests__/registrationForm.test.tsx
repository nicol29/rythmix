import { render, screen } from '@testing-library/react';
import RegistrationForm from '../registrationForm';
import React from 'react';
import userEvent, { UserEvent} from '@testing-library/user-event';
import addUser from '@/server-actions/addUser';


jest.mock('next/navigation', () => require('next-router-mock'));
jest.mock('../../../server-actions/addUser');

async function fillValidFormData(user: UserEvent) {
  const emailField = screen.getByLabelText('Email');
  const passField = screen.getByLabelText('Password');
  const confirmPassField = screen.getByLabelText('Confirm Password');

  await user.type(emailField, "andre@yehee.com");
  await user.type(passField, "123456");
  await user.type(confirmPassField, "123456");
}

describe('RegistrationForm', () => {
  it('renders the registration form', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('should display error messages under required fields if form is submitted incomplete', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    await user.click(submitButton);

    const emailErrorMesg = await screen.findByText('Must provide a valid email address');
    const passwordErrorMesg = await screen.findByText('Password must contain at least 6 characters');

    expect(emailErrorMesg).toBeInTheDocument();
    expect(passwordErrorMesg).toBeInTheDocument();
  });

  it('should not display error messages when form is submitted with correctly populated fields', async () => {
    (addUser as jest.Mock).mockResolvedValue({ success: true, message: 'Registration successful' });
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await fillValidFormData(user);

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    await user.click(submitButton);

    const emailErrorMesg = screen.queryByText('Must provide a valid email address');
    const passwordErrorMesg = screen.queryByText('Password must contain at least 6 characters');

    expect(emailErrorMesg).not.toBeInTheDocument();
    expect(passwordErrorMesg).not.toBeInTheDocument();
    expect(addUser).toHaveBeenCalled();
  });

  it('should warn the user if passwords dont match on form submit', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    const passField = screen.getByLabelText('Password');
    const confirmPassField = screen.getByLabelText('Confirm Password');

    await userEvent.type(passField, "123456");
    await userEvent.type(confirmPassField, "12345");

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    await user.click(submitButton);

    const errorMsg = await screen.findByText('Passwords must match');

    expect(errorMsg).toBeInTheDocument();
  });

  it('should change the button text on submit to indicate the form is processing', async () => {
    (addUser as jest.Mock).mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, message: 'Registration successful' }), 200);
      }
    ));
    const user = userEvent.setup();
    render(<RegistrationForm />);
  
    await fillValidFormData(user);
  
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    await user.click(submitButton);
  
    expect(screen.getByText('Signing Up')).toBeInTheDocument();
  });
});
