'use client';

import { useEffect, useState } from 'react';
import { PropertyUnitTable } from './property-unit-table';
import { PropertyUnit } from '@/interface/property-unit';
import { useGetList } from '@/hooks/api/common/get-all';
import { useGetSingle } from '@/hooks/api/common/get-single';
import { PropertyUnitFormData, propertyUnitFormSchema } from '@/app/types/property-unit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMutation } from '@/hooks/api/common/create';
import { FormProvider } from 'react-hook-form';


export default function PropertyUnits() {
  const [propertyUnits, setPropertyUnits] = useState<PropertyUnit[]>([]);
  const [open, setOpen] = useState(false);

  const {
    data: propertyUnitsData,
    isLoading,
    isError,
  } = useGetList({
    queryKey: 'property-units',
    endpoint: '/properties/units/',
    meta: { perPage: '100' },
  });

  const {
    data: loggedInUserData,
    isLoading: loggedInUserLoading,
    isError: loggedInUserError,
  } = useGetSingle({
    queryKey: 'logged-in-user',
    endpoint: '/users/logged-in-user/',
  });

  useEffect(() => {
    if (propertyUnitsData) {
      setPropertyUnits(propertyUnitsData.data.results);
    }
  }, [propertyUnitsData]);


  const methods = useForm<PropertyUnitFormData>({
    resolver: zodResolver(propertyUnitFormSchema),
    defaultValues: {
      property_project: '',
      unit_name: '',
      unit_type: 'apartment',
      contract_type: 'rent',
      purpose: 'residential',
      price: 0,
      available: true,
    },
  });
  

  const propertyUnitCreateMutation = useCreateMutation({
    queryKey: 'unit-create',
    endpoint: '/properties/units/create',
    Entity: 'Create',
    showToast: true,
  });

  const { reset, setError } = methods;

  const handleEditPropertyUnit = (propertyUnit: PropertyUnit) => {
    // logic for editing
    console.log('edit unit', propertyUnit);
  };

  const handleDeletePropertyUnit = (propertyUnit: PropertyUnit) => {
    // logic for deleting
    console.log('delete unit', propertyUnit);
  };

  const onSubmit = async (values: PropertyUnitFormData) => {
    try {
      // Simple price validation (if needed)
      const priceValue = values.price;
      if (isNaN(priceValue) || priceValue <= 0) {
        setError('price', {
          type: 'manual',
          message: 'Price must be a positive number',
        });
        return;
      }

      // Perform the actual API call via mutation
      await propertyUnitCreateMutation.mutateAsync({
        data: {
          property_project: values.property_project,
          unit_name: values.unit_name,
          unit_type: values.unit_type,
          contract_type: values.contract_type,
          purpose: values.purpose,
          price: values.price,
          available: values.available,
          amenities: {
            private_pool: values.amenities.private_pool,
            wifi: values.amenities.wifi,
            gym: values.amenities.gym,
        
          },
        },
      });

      // Reset form fields
      reset({
        property_project: '',
        unit_name: '',
        unit_type: 'apartment',
        contract_type: 'rent',
        purpose: 'residential',
        price: 0,
        available: true,
        amenities: {
          private_pool: false,
          wifi: false,
          gym: false,
        },
      });

      // Close modal if applicable
      setOpen(false);
    } catch (error) {
      console.error('Property unit creation failed:', error);
    }
  };

  return (
    <div className="p-6">
      <FormProvider {...methods}>
        <PropertyUnitTable
          loggedInUser={loggedInUserData?.data}
          onSubmit={onSubmit}
          propertyUnits={propertyUnits}
          open={open}
          setOpen={setOpen}
          isLoading={isLoading}
          isError={isError}
          setPropertyUnits={setPropertyUnits}
          onEditPropertyUnit={handleEditPropertyUnit}
          onDeletePropertyUnit={handleDeletePropertyUnit}
        />
      </FormProvider>
    </div>
  );
}
