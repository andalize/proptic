import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/custom/datepicker/datepicker';
import {
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  Control,
  useFormContext,
} from 'react-hook-form';
import { Tenant, TenantFormData } from '@/app/types/tenant';
import { PropertyUnit } from '@/interface/property-unit';
import { ListTable, TableColumn } from '@/components/custom/common/list-table';
import { CreateModal } from '@/components/custom/common/create-modal';
import { Pencil, Trash2 } from 'lucide-react';

interface TenantTableProps {
  tenants: Tenant[];
  open: boolean;
  setOpen: (open: boolean) => void;
  idType: string;
  onSubmit: (data: TenantFormData) => void;
  propertyUnits: PropertyUnit[];
  propertyUnitsLoading: boolean;
  isError: boolean;
  setPropertyUnits: (units: PropertyUnit[]) => void;
  onNewTenant?: () => void;
}

export const TenantTable: React.FC<
  TenantTableProps & {
    onEditTenant: (tenant: Tenant) => void;
    onDeleteTenant: (tenant: Tenant) => void;
  }
> = (props) => {
  const {
    tenants,
    open,
    setOpen,
    idType,
    onSubmit,

    propertyUnits,
    propertyUnitsLoading,
    isError,
    setPropertyUnits,
    onNewTenant,
    onEditTenant,
    onDeleteTenant,
  } = props;

   const {
      register,
      setValue,
      watch,
      control,
      formState: { errors },
    } = useFormContext<TenantFormData>();

  const columns: TableColumn<Tenant>[] = [
    {
      key: 'avatar',
      label: 'Profile',
      width: '80px',
      render: (tenant) => (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              tenant.gender === 'female'
                ? '/images/female-profile.jpg'
                : tenant.gender === 'male'
                ? '/images/male-profile.png'
                : tenant.avatar
            }
            alt={`${tenant.first_name} ${tenant.last_name}`}
          />
          <AvatarFallback>
            {tenant.first_name?.[0]}
            {tenant.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'first_name',
      label: 'First Name',
      sortable: true,
    },
    {
      key: 'last_name',
      label: 'Last Name',
      sortable: true,
    },
    {
      key: 'passport_number',
      label: 'NID/Passport',
      render: (tenant) => tenant.passport_number || tenant.national_id || 'N/A',
    },
    {
      key: 'tenancy',
      label: 'Unit',
      render: (tenant) => tenant.tenancy?.property_unit_name || 'Not assigned',
    },
    {
      key: 'tenancy_start_date',
      label: 'Tenancy start date',
      render: (tenant) => tenant.tenancy?.tenancy_start_date || '-',
    },
    {
      key: 'tenancy_end_date',
      label: 'Tenancy end date',
      render: (tenant) => tenant.tenancy?.tenancy_end_date || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (tenant) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEditTenant(tenant)}
            className="text-sm p-1 cursor-pointer"
            title="Edit"
            type="button"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDeleteTenant(tenant)}
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

  return (
    <>
      <CreateModal
        title="New Tenant"
        onSubmit={onSubmit}
        isSubmitting={propertyUnitsLoading}
        open={open}
        setOpen={setOpen}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="first_name" className="mb-2">
              First Name
            </Label>
            <Input id="first_name" {...register('first_name')} required />
          </div>
          <div className="flex-1">
            <Label htmlFor="last_name" className="mb-2">
              Last Name
            </Label>
            <Input id="last_name" {...register('last_name')} required />
          </div>
        </div>

        <div>
          <Label htmlFor="gender" className="mb-2">
            Gender
          </Label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            id="gender"
            defaultValue=""
            {...register('gender')}
            required
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label className="mb-2">ID Type</Label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input type="radio" value="passport_number" {...register('id_type')} defaultChecked />
              Passport
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="national_id" {...register('id_type')} />
              National ID
            </label>
          </div>

          {idType === 'passport_number' && (
            <div className="mt-2">
              <Label htmlFor="passport" className="mb-2">
                Passport Number
              </Label>
              <Input id="passport" {...register('passport_number')} required />
              {errors.passport_number && (
                <p className="text-red-500 text-sm mt-1">{errors.passport_number.message}</p>
              )}
            </div>
          )}

          {idType === 'national_id' && (
            <div className="mt-2">
              <Label htmlFor="national_id" className="mb-2">
                National ID
              </Label>
              <Input id="national_id" {...register('national_id')} required />
              {errors.national_id && (
                <p className="text-red-500 text-sm mt-1">{errors.national_id.message}</p>
              )}
            </div>
          )}

          {errors.id_type && <p className="text-red-500 text-sm mt-1">{errors.id_type.message}</p>}
        </div>
        <div>
          <Label htmlFor="unit" className="mb-2">
            Rental Unit
          </Label>

          {propertyUnitsLoading && <p>Loading property units...</p>}
          {isError && <p>Failed to load property units</p>}
          {!propertyUnitsLoading && !isError && (
            <select
              id="property_unit"
              {...register('property_unit')}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="" disabled>
                Select unit
              </option>
              {propertyUnits.map((unit, index) => (
                <option key={index} value={unit.id}>
                  {unit.unit_name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="tenancy_start_date" className="mb-2">
              Start Date
            </Label>
            <Controller
              name="tenancy_start_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="tenancy_start_date"
                  date={field.value}
                  onChange={field.onChange}
                  placeholder="Select date"
                />
              )}
            />
            {errors.tenancy_start_date && (
              <p className="text-red-500 text-sm mt-1">{errors.tenancy_start_date.message}</p>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="tenancy_end_date" className="mb-2">
              End Date
            </Label>
            <Controller
              name="tenancy_end_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="tenancy_end_date"
                  date={field.value}
                  onChange={field.onChange}
                  placeholder="Select date"
                />
              )}
            />
            {errors.tenancy_end_date && (
              <p className="text-red-500 text-sm mt-1">{errors.tenancy_end_date.message}</p>
            )}
          </div>
        </div>
      </CreateModal>

      <ListTable
        data={tenants}
        columns={columns}
        title="Tenants"
        onNewItem={() => setOpen(true)}
        newItemLabel="New Tenant"
        initialPageSize={10}
        searchable={true}
        getItemId={(tenant) => tenant.id}
        emptyMessage="No tenants found"
      />
    </>
  );
};
