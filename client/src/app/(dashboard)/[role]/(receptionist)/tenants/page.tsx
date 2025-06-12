"use client";
import {useState, useEffect} from "react";
import { useCreateMutation } from "@/hooks/api/common/create";
import { tenantFormSchema, Tenant, TenantFormData } from "@/app/types/tenant";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useGetList } from "@/hooks/api/common/getAll";
import { format } from 'date-fns';
import { TenantTable } from "./tenantTable";
import { PropertyUnit } from "@/interface/propertyUnit";



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
                    national_id: values.national_id,
                    gender: values.gender
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

    return (
        <div className="p-6">
        
            <TenantTable
                tenants={tenants}
                open={open}
                setOpen={setOpen}
                idType={idType}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                register={register}
                control={control}
                errors={errors}
                propertyUnits={propertyUnits}
                propertyUnitsLoading={propertyUnitsLoading}
                isError={isError}
                setPropertyUnits={setPropertyUnits}
            />

        </div>
    );
}