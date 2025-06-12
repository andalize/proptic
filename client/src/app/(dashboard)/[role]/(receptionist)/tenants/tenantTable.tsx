import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/custom/datepicker/datepicker";
import { Separator } from "@/components/ui/separator";
import { Controller, FieldErrors, UseFormHandleSubmit, UseFormRegister, Control} from "react-hook-form";
import { tenantFormSchema, Tenant, TenantFormData } from "@/app/types/tenant";
import { PropertyUnit } from "@/interface/propertyUnit";
import { Button } from "@/components/ui/button";



interface TenantTableProps {
    tenants: Tenant[];
    open: boolean;
    setOpen: (open: boolean) => void;
    idType: string;
    handleSubmit: UseFormHandleSubmit<TenantFormData>;
    onSubmit: (data: TenantFormData) => void;
    register: UseFormRegister<TenantFormData>;
    control: Control<TenantFormData>;
    errors: FieldErrors<TenantFormData>;
    propertyUnits: PropertyUnit[];
    propertyUnitsLoading: boolean;
    isError: boolean;
    setPropertyUnits: (units: PropertyUnit[]) => void;
}

export const TenantTable: React.FC<TenantTableProps> = (props) => {

    const {
        tenants,
        open,
        setOpen,
        idType,
        handleSubmit,
        onSubmit,
        register,
        control,
        errors,
        propertyUnits,
        propertyUnitsLoading,
        isError,
        setPropertyUnits,
      } = props;

    return (
        <>
             <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Tenants</h1>
                <Button onClick={() => setOpen(true)} className="cursor-pointer"> New Tenant</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Profile</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Passport/National ID</TableHead>
                        <TableHead>Apartment Unit</TableHead>
                        <TableHead>Tenancy Start Date</TableHead>
                        <TableHead> Tenancy End Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            tenant.gender === "female"
                                                ? "/images/female-profile.jpg"
                                                : tenant.gender === "male"
                                                ? "/images/male-profile.png"
                                                : tenant.avatar
                                        }
                                        alt={tenant.first_name}
                                    />
                                    <AvatarFallback>
                                        {tenant.first_name}
                                        {tenant.last_name}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{tenant.first_name}</TableCell>
                            <TableCell>{tenant.last_name}</TableCell>
                            <TableCell>{tenant.passport_number ?? tenant.national_id}</TableCell>
                            <TableCell>{tenant.tenancy?.property_unit_name}</TableCell>
                            <TableCell>{tenant.tenancy?.tenancy_start_date}</TableCell>
                            <TableCell>{tenant.tenancy?.tenancy_end_date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle> New Tenant</DialogTitle>
                    </DialogHeader>
                    <Separator/>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="first_name" className="mb-2">First Name</Label>
                                <Input
                                    id="first_name"
                                    {...register("first_name")}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="last_name" className="mb-2">Last Name</Label>
                                <Input
                                    id="last_name"
                                    {...register("last_name")}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="gender" className="mb-2">Gender</Label>
                            <select
                                className="w-full border rounded px-3 py-2 mt-1"
                                id="gender"
                                defaultValue=""
                                {...register("gender")}
                                required
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <Label className="mb-2">ID Type</Label>
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="passport_number"
                                        {...register("id_type")}
                                        defaultChecked
                                    />
                                    Passport
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="national_id"
                                        {...register("id_type")}
                                    />
                                    National ID
                                </label>
                            </div>
                           
                                {idType === "passport_number" && (
                                    <div className="mt-2">
                                        <Label htmlFor="passport" className="mb-2">Passport Number</Label>
                                        <Input
                                            id="passport"
                                            {...register("passport_number")}
                                            required
                                        />
                                        {errors.passport_number && (
                                            <p className="text-red-500 text-sm mt-1">{errors.passport_number.message}</p>
                                        )}
                                    </div>
                                )}
                                
                                {idType === "national_id" && (
                                    <div className="mt-2">
                                        <Label htmlFor="national_id" className="mb-2">National ID</Label>
                                        <Input
                                            id="national_id"
                                            {...register("national_id")}
                                            required
                                        />
                                        {errors.national_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.national_id.message}</p>
                                        )}
                                    </div>
                                )}
                                
                                {errors.id_type && (
                                    <p className="text-red-500 text-sm mt-1">{errors.id_type.message}</p>
                                )}
                        </div>
                        <div>
                            <Label htmlFor="unit" className="mb-2">Rental Unit</Label>

                            {propertyUnitsLoading && <p>Loading property units...</p>}
                            {isError && <p>Failed to load property units</p>}
                            {!propertyUnitsLoading && !isError && (
                                <select
                                    id="property_unit"
                                    {...register("property_unit")}
                                    required
                                    className="w-full border rounded px-3 py-2 mt-1"
                                >
                                    <option value="" disabled>Select unit</option>
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
                                <Label htmlFor="tenancy_start_date" className="mb-2">Start Date</Label>
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
                                <Label htmlFor="tenancy_end_date" className="mb-2">End Date</Label>
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
                        <DialogFooter>
                            <Button type="submit" className="cursor-pointer">Register</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
