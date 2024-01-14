import { render, screen } from '@testing-library/react';
import CompleteAccountForm from '../completeAccountForm';
import React from 'react';
import userEvent from '@testing-library/user-event';
import addExtraAccountInfo from '@/server-actions/addExtraAccountInfo';


jest.mock('next/navigation', () => require('next-router-mock'));
jest.mock('../../../server-actions/addExtraAccountInfo');
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual('next-auth/react');
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "user" }
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated', update: jest.fn() } 
    }),
  };
});

describe('RegistrationForm', () => {
  it('renders the complete account form', () => {
    render(<CompleteAccountForm />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('What are you:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finish Up' })).toBeInTheDocument();
  });

  it('should display error messages under required fields if form is submitted incomplete', async () => {
    const user = userEvent.setup();
    render(<CompleteAccountForm />);

    const submitButton = screen.getByRole('button', { name: 'Finish Up' });
    await user.click(submitButton);

    const userNameErrorMesg = await screen.findByText('Must provide a username');

    expect(userNameErrorMesg).toBeInTheDocument();
  });

  it('should not display error messages when form is submitted with correctly populated fields', async () => {
    (addExtraAccountInfo as jest.Mock).mockResolvedValue({ success: true, message: "Account updated successfully" });
    const user = userEvent.setup();
    render(<CompleteAccountForm />);

    const userNameField = screen.getByLabelText('Username');
    await user.type(userNameField, 'Garcia87');

    const submitButton = screen.getByRole('button', { name: 'Finish Up' });
    await user.click(submitButton);

    const userNameErrorMesg = screen.queryByText('Must provide a username');

    expect(userNameErrorMesg).not.toBeInTheDocument();
    expect(addExtraAccountInfo).toHaveBeenCalled();
  });

  it('should change the button text on submit to indicate the form is processing', async () => {
    (addExtraAccountInfo as jest.Mock).mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, message: "Account updated successfully" }), 200);
      }
    ));
    const user = userEvent.setup();
    render(<CompleteAccountForm />);
  
    const userNameField = screen.getByLabelText('Username');
    await user.type(userNameField, 'Garcia87');

    const submitButton = screen.getByRole('button', { name: 'Finish Up' });
    await user.click(submitButton);
  
    expect(screen.getByText('Finishing Up')).toBeInTheDocument();
  });
});
