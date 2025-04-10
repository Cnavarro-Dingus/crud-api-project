import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCar from '../frontend/src/components/AddCar';
import CarService from '../frontend/src/services/CarService';

// Mock the CarService
jest.mock('../services/CarService', () => ({
  createCar: jest.fn(),
}));

describe('AddCar Component', () => {
  test('submits form with correct data', async () => {
    CarService.createCar.mockResolvedValue({ id: 3, make: 'Ford', model: 'Focus', year: 2022 });

    render(<AddCar />);

    fireEvent.change(screen.getByPlaceholderText(/Enter car make/i), { target: { value: 'Ford' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter car model/i), { target: { value: 'Focus' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter car year/i), { target: { value: '2022' } });

    fireEvent.click(screen.getByText(/Add Car/i));

    await waitFor(() => {
      expect(CarService.createCar).toHaveBeenCalledWith({
        make: 'Ford',
        model: 'Focus',
        year: 2022,
        features: [],
      });
    });
  });
});