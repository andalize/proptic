"use client";
import {useState, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/custom/datepicker/datepicker";
import { Separator } from "@/components/ui/separator";
import { useCreateMutation } from "@/hooks/api/common/create";
import { tenantFormSchema, Tenant, TenantFormData } from "@/app/types/tenant";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from "react-hook-form";
import { useGetList } from "@/hooks/api/common/getAll";
import { format } from 'date-fns';



// Dummy tenants data
const dummyTenants: Tenant[] = [
    {
        id: 1,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        first_name: "John",
        last_name: "Doe",
        gender: "male",
        passport: "A1234567",
        unit: "A-101",
        tenancy_start_date: "2023-01-01",
        tenancy_end_date: "2024-01-01",
    },
    {
        id: 2,
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        first_name: "Jane",
        last_name: "Smith",
        gender: "female",
        passport: "B7654321",
        unit: "B-202",
        tenancy_start_date: "2022-06-15",
        tenancy_end_date: "2023-06-14",
    },
    {
        id: 3,
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        first_name: "Michael",
        last_name: "Johnson",
        gender: "male",
        passport: "C9876543",
        unit: "C-303",
        tenancy_start_date: "2023-03-10",
        tenancy_end_date: "2024-03-09",
    },
    {
        id: 4,
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        first_name: "Emily",
        last_name: "Williams",
        gender: "female",
        passport: "D4567890",
        unit: "D-404",
        tenancy_start_date: "2022-09-01",
        tenancy_end_date: "2023-08-31",
    },
    {
        id: 5,
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        first_name: "David",
        last_name: "Brown",
        gender: "male",
        passport: "E2345678",
        unit: "E-505",
        tenancy_start_date: "2023-05-20",
        tenancy_end_date: "2024-05-19",
    },
    {
        id: 6,
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
        first_name: "Sophia",
        last_name: "Jones",
        gender: "female",
        passport: "F8765432",
        unit: "F-606",
        tenancy_start_date: "2022-11-11",
        tenancy_end_date: "2023-11-10",
    },
    {
        id: 7,
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
        first_name: "James",
        last_name: "Garcia",
        gender: "male",
        passport: "G3456789",
        unit: "G-707",
        tenancy_start_date: "2023-02-28",
        tenancy_end_date: "2024-02-27",
    },
    {
        id: 8,
        avatar: "https://randomuser.me/api/portraits/women/8.jpg",
        first_name: "Olivia",
        last_name: "Martinez",
        gender: "female",
        passport: "H6543210",
        unit: "H-808",
        tenancy_start_date: "2022-08-05",
        tenancy_end_date: "2023-08-04",
    },
    {
        id: 9,
        avatar: "https://randomuser.me/api/portraits/men/9.jpg",
        first_name: "William",
        last_name: "Rodriguez",
        gender: "male",
        passport: "I1230987",
        unit: "I-909",
        tenancy_start_date: "2023-04-12",
        tenancy_end_date: "2024-04-11",
    },
    {
        id: 10,
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
        first_name: "Ava",
        last_name: "Lee",
        gender: "female",
        passport: "J7890123",
        unit: "J-010",
        tenancy_start_date: "2022-12-20",
        tenancy_end_date: "2023-12-19",
    },
];

interface PropertyUnit {
    id: string;
    unit_name: string;
  }

export default function TenantsPage() {

    const [open, setOpen] = useState(false);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [propertyUnits, setPropertyUnits] = useState<PropertyUnit[]>([]);


    const formatDate = (date: Date | null) =>
        date ? format(date, 'yyyy-MM-dd') : null;

    const {
        data: propertyUnitsData,
        isLoading: propertyUnitsLoading,
        isError,
    } = useGetList({
        queryKey: "property-units",
        endpoint: "/properties/units/",
        meta: { perPage: '100' },
    });
    
    const {
        data: tenantsData,
        isLoading: tenantsLoading,
        // isError,
    } = useGetList({
        queryKey: "tenant-list",
        endpoint: "/users/tenants/",
        meta: { perPage: '100' },
    });
    
  
    useEffect(() => {
        if (propertyUnitsData) {
        setPropertyUnits(propertyUnitsData.data.results);
        }
    }, [propertyUnitsData]);

    useEffect(() => {
        if (tenantsData) {
        setTenants(tenantsData.data);
        }
    }, [tenantsData]);



     const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
        setError,
        clearErrors,
      } = useForm<TenantFormData>({
          resolver: zodResolver(tenantFormSchema),
          defaultValues: {
            avatar: "",
            first_name: "",
            last_name: "",
            gender: "",
            id_type: "passport_number",
            passport_number: null,
            national_id: null,
            property_unit: "",
            tenancy_start_date: null,
            tenancy_end_date: null,
        }
    
      });


    const userRegisterMutation = useCreateMutation({
        queryKey: "user-register",
        endpoint: "/users/register/",
        Entity: "Register",
        showToast: true,
      });
      
      const tenancyCreateMutation = useCreateMutation({
        queryKey: "tenancy-create",
        endpoint: "/properties/tenancies/",
        Entity: "Tenancy",
        showToast: true,
      });
    
    const onSubmit = async (values: TenantFormData) => {
        // Passport validation
        if (values.id_type === "passport_number" && values.passport_number) {
            const passport = values.passport_number.trim().toUpperCase();
            const passportRegex = /^[A-Z0-9]{6,9}$/;
            if (!passportRegex.test(passport)) {
                setError("passport_number", {
                    type: "manual",
                    message: "Passport must be 6-9 uppercase alphanumeric characters (A-Z, 0-9), no spaces or special characters.",
                });
                return;
            }
            values.passport_number = passport;
        }

        // National ID validation
        if (values.id_type === "national_id" && values.national_id) {
            const nationalId = values.national_id.trim().toUpperCase();
            const nationalIdRegex = /^[A-Z0-9][A-Z0-9\- ]{4,16}[A-Z0-9]$/;
            if (
                nationalId.length < 6 ||
                nationalId.length > 18 ||
                !nationalIdRegex.test(nationalId) ||
                /[^A-Z0-9\- ]/.test(nationalId)
            ) {
                setError("national_id", {
                    type: "manual",
                    message: "National ID must be 6-18 uppercase alphanumeric characters (A-Z, 0-9), spaces and hyphens allowed.",
                });
                return;
            }
            values.national_id = nationalId;
        }

        try {
            const userResult = await userRegisterMutation.mutateAsync({
                data: {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    passport_number: values.passport_number,
                    national_id: values.national_id
                },
            });

            const userId = userResult.user?.id;

            await tenancyCreateMutation.mutateAsync({
                data: {
                    tenant_id: userId,
                    property_unit_id: values.property_unit,
                    tenancy_start_date: formatDate(values.tenancy_start_date),
                    tenancy_end_date: formatDate(values.tenancy_end_date),
                },
            });

            setTenants((prev) => [
                ...prev,
                {
                    ...values,
                    id: prev.length + 1,
                    avatar: values.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
                    tenancy_start_date: values.tenancy_start_date ? values.tenancy_start_date.toISOString() : "",
                    tenancy_end_date: values.tenancy_end_date ? values.tenancy_end_date.toISOString() : "",
                },
            ]);

            reset({
                avatar: "",
                first_name: "",
                last_name: "",
                gender: "",
                id_type: "passport_number",
                passport_number: null,
                national_id: null,
                property_unit: "",
                tenancy_start_date: null,
                tenancy_end_date: null,
            });
            setOpen(false);
        } catch (error) {
            console.error("Tenant creation failed:", error);
        }
    };
      
    const idType = watch("id_type");
    console.log('all tenants', tenants);

    return (
        <div className="p-6">
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
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={tenant.avatar} alt={tenant.first_name} />
                                    <AvatarFallback>
                                        {tenant.first_name}
                                        {tenant.last_name}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{tenant.first_name}</TableCell>
                            <TableCell>{tenant.last_name}</TableCell>
                            <TableCell>{tenant.passport_number}</TableCell>
                            <TableCell>{tenant.property_unit}</TableCell>
                            <TableCell>{tenant.tenancy_start_date}</TableCell>
                            <TableCell>{tenant.tenancy_end_date}</TableCell>
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
        </div>
    );
}