'use client';
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PropertyUnit } from '@/interface/property-unit';
import { CreateModal } from '@/components/custom/common/create-modal';
import { ListTable, TableColumn } from '@/components/custom/common/list-table';
import { PropertyUnitFormData } from '@/app/types/property-unit';
import { Pencil, Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';


interface PropertyUnitTableProps {
  loggedInUser?: any;
  propertyUnits: PropertyUnit[];
  onSubmit: (data: PropertyUnitFormData) => void;
  onNewPropertyUnit?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  isError: boolean;
  setPropertyUnits: (units: PropertyUnit[]) => void;
}

export const PropertyUnitTable: React.FC<
  PropertyUnitTableProps & {
    onEditPropertyUnit: (propertyUnit: PropertyUnit) => void;
    onDeletePropertyUnit: (propertyUnit: PropertyUnit) => void;

  }> = (props) => {

    const {
    loggedInUser,
    propertyUnits,
    onNewPropertyUnit,
    open,
    setOpen,
    onSubmit,
    isLoading,
    setPropertyUnits,
    onEditPropertyUnit,
    onDeletePropertyUnit,
  } = props;
    
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PropertyUnitFormData>();

    
  const isListedForRent = watch('is_listed_for_rent');
  const isListedForSale = watch('is_listed_for_sale');
    
  useEffect(() => {
    if (loggedInUser?.property_project?.id) {
      setValue('property_project', loggedInUser.property_project.id);
    }
  }, [loggedInUser, setValue]);
  

  const columns: TableColumn<PropertyUnit>[] = [
    {
      key: 'expander',
      label: '',
      width: '50px',
    },
    {
      key: 'unit_name',
      label: 'Unit Name',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Monthly Rent Fee',
      sortable: true,
      render: (unit) => `USD ${unit.price.toLocaleString()}`,
    },
    {
      key: 'property_project_name',
      label: 'Property Project',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (propertyUnit) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEditPropertyUnit(propertyUnit)}
            className="text-sm p-1 cursor-pointer"
            title="Edit"
            type="button"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDeletePropertyUnit(propertyUnit)}
            className="text-sm p-1 cursor-pointer"
            title="Delete"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const renderExpandableRow = (unit: PropertyUnit) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(unit.amenities).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 text-sm">
          <span className="font-medium capitalize text-gray-700">{key.replace(/_/g, ' ')}:</span>
          <span className={value ? 'text-green-600' : 'text-red-600'}>
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <CreateModal
        title="New Property Unit"
        onSubmit={onSubmit}
        isSubmitting={isLoading}
        open={open}
        setOpen={setOpen}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="property_project_name" className="mb-2">
              Property Project Name
            </Label>

            {/* Visible disabled input for display */}
            <Input
              id="property_project_name"
              value={loggedInUser?.property_project?.name || ''}
              disabled
              className="bg-gray-100"
            />

            {errors.property_project && (
              <p className="text-red-500 text-sm mt-1">{errors.property_project.message}</p>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="unit_name" className="mb-2">
              Unit Name
            </Label>
            <Input id="unit_name" {...register('unit_name')} required />
            {errors.unit_name && (
              <p className="text-red-500 text-sm mt-1">{errors.unit_name.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="unit_type" className="mb-2">
              Unit Type
            </Label>
            <select
              id="unit_type"
              {...register('unit_type')}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Select unit type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
              <option value="shop">Shop</option>
            </select>
            {errors.unit_type && (
              <p className="text-red-500 text-sm mt-1">{errors.unit_type.message}</p>
            )}
          </div>

          <div className="flex-1">
            <Label htmlFor="purpose" className="mb-2">
              Purpose
            </Label>
            <select
              id="purpose"
              {...register('purpose')}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Select purpose</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            {errors.purpose && (
              <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="price" className="mb-2">
            Price (RWF)
          </Label>
          <Input
            type="number"
            id="price"
            {...register('price', { valueAsNumber: true })}
            required
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div className="mt-4">
          <Label className="mb-2">Amenities</Label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('amenities.wifi')} />
              Wifi
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('amenities.private_pool')} />
              Pool
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('amenities.gym')} />
              Gym
            </label>
          </div>
        </div>

        <div>
          <Label className="mb-4">Listing type</Label>
          <div className="flex items-center gap-2 mb-5">
            <input
              type="checkbox"
              id="is_listed_for_rent"
              {...register('is_listed_for_rent')}
              checked={isListedForRent}
              onChange={(e) => {
                setValue('is_listed_for_rent', e.target.checked);
                if (e.target.checked) {
                  setValue('is_listed_for_sale', false);
                }
              }}
            />
            <Label htmlFor="is_listed_for_rent">Listed for Rent</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_listed_for_sale"
              {...register('is_listed_for_sale')}
              checked={isListedForSale}
              onChange={(e) => {
                setValue('is_listed_for_sale', e.target.checked);
                if (e.target.checked) {
                  setValue('is_listed_for_rent', false);
                }
              }}
            />
            <Label htmlFor="is_listed_for_sale">Listed for Sale</Label>
          </div>
        </div>
      </CreateModal>

      <ListTable
        data={propertyUnits}
        columns={columns}
        title="Property Units"
        onNewItem={() => setOpen(true)}
        newItemLabel="New Property Unit"
        expandableRowRender={renderExpandableRow}
        initialPageSize={10}
        searchable={true}
        getItemId={(unit) => unit.id}
        emptyMessage="No property units found"
      />
    </>
  );
};
