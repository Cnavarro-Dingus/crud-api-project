import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CarList from '../frontend/src/components/CarList';
import CarService from '../frontend/src/services/CarService';

// Mock the CarService
jest.mock('../services/CarService', () => ({
  getAllCars: jest.fn(),
}));

describe('CarList Component', () => {
  beforeEach(() => {
    CarService.getAllCars.mockResolvedValue([
      { id: 1, make: 'Toyota', model: 'Corolla', year: 2020, features: ['Bluetooth'] },
      { id: 2, make: 'Honda', model: 'Civic', year: 2021, features: ['Sunroof'] },
    ]);
  });

  test('renders car list', async () => {
    render(<CarList />);

    await waitFor(() => {
      expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
      expect(screen.getByText(/Honda Civic/i)).toBeInTheDocument();
    });
  });

  test('displays loading spinner initially', () => {
    render(<CarList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});