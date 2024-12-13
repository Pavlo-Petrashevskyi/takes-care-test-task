/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import * as React from "react"
import classNames from "classnames"
import BreadcrumbsConstructor from "@/components/BreadcrumbsConstructor"
import PagesTitle from "@/components/PagesTitle"
import { zodResolver } from "@hookform/resolvers/zod"
import { Control, useForm } from "react-hook-form"
import { z } from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Check, ChevronDown, ChevronRight, CirclePlus} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, setMonth } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn, countArrayOfHoursForFromHourField, countArrayOfHoursForToHourField, countDateOfBirthUsingPesel, isValidPesel, scrollToId } from "@/lib/utils"
import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import moment from 'moment';
import { MultiSelect } from "@/components/MultiSelectComponent"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { VisitData } from "@/types/visitData"
import { BASE_URL } from "@/api/api"
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarSeparator } from "@/components/ui/sidebar"
import RightSidebarWrap from "@/components/RightSidebarWrap"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DayPicker, useDayPicker } from "react-day-picker"
import "react-day-picker/style.css";



type controlType = Control<{
  [x: string]: any;
}, any>

type nameType = "visitNumber" | "visitType" | "specialization" | "dateOfVisit" | "topicOfVisit" | "langOfVisit" | "AgeIsAdultPatientI" 
| "nameOfPatientI" | "surnameOfPatientI" | "documentPatientI" | "peselPatientI" | "dateOfBirthPatientI" 
| "homeCountryOfPatientI" | "houseStreetOfPatientI" | "houseNumberOfPatientI" | "visitAdressCountry" 
| "visitAdressStreet" | "visitAdressNumberOfHouse" | "addVisitAdress" | "symptomsOfPatientI" | "customErrorPeselPatientI"


export default function MakeVisitPage() {
  const [patientsAmount, setPatientsAmount] = useState(1)
  const { toast } = useToast()
  const pathname = usePathname();

  const FormSchema = React.useMemo(() => {
    return z.object({
      visitNumber: z
        .string({
          required_error: "Prosimy wpisać numer zgłoszenia",
        }),
      visitType: z.string({
        required_error: 'Prosimy wybrać rodzaj wizyty'
      }),
      specialization: z
        .string({
          required_error: 'Prosimy wybrać specjalizację wizyty',
        }),
      dateOfVisit: z.date({
        required_error: 'Prosimy wybrać datę wizyty',
      }),
      showHoursOfVisit: z.boolean().optional(),
      hourFrom: z.string().optional(),
      hourTo: z.string().optional(),
      topicOfVisit: z.string({
        required_error: 'Prosimy wybrać temat wizyty'
      }),
      additionalInformation: z.string().optional(),
      langOfVisit: z.string({
        required_error: 'Prosimy wybrać język wizyty'
      }),
      AgeIsAdultPatientI: z.boolean(),
      nameOfPatientI: z.string({
        required_error: 'Prosimy wpisać imię'
      }),
      surnameOfPatientI: z.string({
        required_error: 'Prosimy wpisać nazwisko'
      }),
      documentPatientI: z.string(),
      peselPatientI: z.string({
        required_error: 'Prosimy wpisać PESEL'
      }),
      dateOfBirthPatientI: z.date({
        required_error: 'Prosimy wybrać datę urodzenia'
      }),
      homeCountryOfPatientI: z.string({
        required_error: 'Prosimy wybrać kraj zamieszkania',
      }),
      houseStreetOfPatientI: z.string({
        required_error: 'Prosimy wpisać adres zamieszkania',
      }),
      houseNumberOfPatientI: z.string({
        required_error: 'Prosimy wpisać numer budynku zamieszkania'
      }),
      customErrorPeselPatientI: z.string(),
      symptomsOfPatientI: z.string().array().optional(),
      addVisitAdress: z.boolean().optional(),
      visitAdressCountry: z.string().optional(),
      visitAdressStreet: z.string().optional(),
      visitAdressNumberOfHouse: z.string().optional(),
    })
    .extend(patientsAmount >= 2 
      ? {
          AgeIsAdultPatientII: z.boolean().default(true),
          nameOfPatientII: z.string({
            required_error: 'Prosimy wpisać imię'
          }),
          surnameOfPatientII: z.string({
            required_error: 'Prosimy wpisać nazwisko'
          }),
          documentPatientII: z.string(),
          peselPatientII: z.string({
            required_error: 'Prosimy wpisać PESEL'
          }),
          dateOfBirthPatientII: z.date({
            required_error: 'Prosimy wybrać datę urodzenia'
          }),
          customErrorPeselPatientII: z.string(),
        }
      : {}
    )
    .extend(patientsAmount >= 3 
      ? {
          AgeIsAdultPatientIII: z.boolean().default(true),
          nameOfPatientIII: z.string({
            required_error: 'Prosimy wpisać imię'
          }),
          surnameOfPatientIII: z.string({
            required_error: 'Prosimy wpisać nazwisko'
          }),
          documentPatientIII: z.string(),
          peselPatientIII: z.string({
            required_error: 'Prosimy wpisać PESEL'
          }),
          dateOfBirthPatientIII: z.date({
            required_error: 'Prosimy wybrać datę urodzenia'
          }),
          customErrorPeselPatientIII: z.string(),
        }
      : {}
    )
    .extend(patientsAmount >= 4 
      ? {
          AgeIsAdultPatientIV: z.boolean().default(true),
          nameOfPatientIV: z.string({
            required_error: 'Prosimy wpisać imię'
          }),
          surnameOfPatientIV: z.string({
            required_error: 'Prosimy wpisać nazwisko'
          }),
          documentPatientIV: z.string(),
          peselPatientIV: z.string({
            required_error: 'Prosimy wpisać PESEL'
          }),
          dateOfBirthPatientIV: z.date({
            required_error: 'Prosimy wybrać datę urodzenia'
          }),
          customErrorPeselPatientIV: z.string(),
        }
      : {}
    )
    .extend(patientsAmount >= 5 
      ? {
          AgeIsAdultPatientV: z.boolean().default(true),
          nameOfPatientV: z.string({
            required_error: 'Prosimy wpisać imię'
          }),
          surnameOfPatientV: z.string({
            required_error: 'Prosimy wpisać nazwisko'
          }),
          documentPatientV: z.string(),
          peselPatientV: z.string({
            required_error: 'Prosimy wpisać PESEL'
          }),
          dateOfBirthPatientV: z.date({
            required_error: 'Prosimy wybrać datę urodzenia'
          }),
          customErrorPeselPatientV: z.string(),
        }
      : {}
    )
    .extend(patientsAmount >= 6 
      ? {
          AgeIsAdultPatientVI: z.boolean().default(true),
          nameOfPatientVI: z.string({
            required_error: 'Prosimy wpisać imię'
          }),
          surnameOfPatientVI: z.string({
            required_error: 'Prosimy wpisać nazwisko'
          }),
          documentPatientVI: z.string(),
          peselPatientVI: z.string({
            required_error: 'Prosimy wpisać PESEL'
          }),
          dateOfBirthPatientVI: z.date({
            required_error: 'Prosimy wybrać datę urodzenia'
          }),
          customErrorPeselPatientVI: z.string(),
        }
      : {}
    )
  }, [patientsAmount]);

  type FormType = typeof FormSchema;

  const form = useForm<z.infer<FormType>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      visitType: 'Wizyta domowa',
      AgeIsAdultPatientI: true,
      documentPatientI: 'pesel',
    },
    criteriaMode: 'all',
  });
  const [visitData, setVisitData] = useState<VisitData>()
  const [countedFromHourArray, setCountedFromHourArray] = useState<number[]>(countArrayOfHoursForFromHourField(form.getValues('dateOfVisit')));
  const [countedToHourArray, setCountedToHourArray] = useState<number[]>(countArrayOfHoursForToHourField(form.getValues('hourFrom')));
  const romanNumbers = React.useMemo(() => ['I','II','III','IV','V','VI'], []);
  const patientsNumberRomanArray = React.useMemo(() => Array.from({length: patientsAmount}).map((_, i) => romanNumbers[i]), [patientsAmount])

  function onSubmit(data: z.infer<FormType>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 3)}</code>
        </pre>
      ),
    })
    console.log(data);
  }

  function validatePeselAndShowErrorMessages(e:  React.ChangeEvent<HTMLInputElement>, errorField: nameType) {
    form.clearErrors(errorField);
    form.setValue(errorField, undefined);
    form.clearErrors();

    if (e.target.value.length === 0) {
      return form.setError(errorField, {
        types: {
          message: 'Prosimy wpisać PESEL',
        }
      })
    }
    
    if (e.target.value.length < 11 
        || e.target.value.length > 11 
        || !RegExp(new RegExp(/^\d{11}$/)).exec(e.target.value)
      ) {
      return form.setError(errorField, {
        types: {    
          message: 'PESEL musi składać się z 11 cyfr',
        }
      })
    }

    if (!isValidPesel(e.target.value)) {
      return form.setError(errorField, {
        types: {    
          message: 'PESEL nie prawidłowy',
        }
      })
    }
  }

  useEffect(() => { 
    async function fetchVisitData() {
      const res = await fetch(`${BASE_URL}/visitData`, { method: 'GET' });
      const data: VisitData = await res.json();
      setVisitData(data)
    }

    fetchVisitData();
  }, []);

  useEffect(() => {
    if (visitData && visitData.visitTypeFromServer.length > 0 && pathname) {
      form.setValue('visitType', visitData?.visitTypeFromServer.find(({ path }) => pathname.includes(path))?.defaultValue ?? 'Wizyta domowa')
    }
  }, [form, pathname, visitData]);

  useEffect(() => {
    setCountedFromHourArray(countArrayOfHoursForFromHourField(form.watch('dateOfVisit')))
  }, [form.watch('dateOfVisit')]);

  useEffect(() => {
    setCountedToHourArray(countArrayOfHoursForToHourField(form.watch('hourFrom')));
  }, [form.watch('hourFrom')]);

  //#region firstPeselAndDate
  useEffect(() => {
    const peselValue = form.watch('peselPatientI');
    let birthDate;

    if (isValidPesel(peselValue)) {
      birthDate = countDateOfBirthUsingPesel(peselValue);
      form.setValue('customErrorPeselPatientI', 'OK');
    }

    if (birthDate) {
      form.clearErrors('dateOfBirthPatientI');
      form.clearErrors('customErrorPeselPatientI');
      form.setValue('dateOfBirthPatientI', birthDate);
    }
  }, [form.watch('peselPatientI')])

  useEffect(() => {
    const birthDate = form.watch('dateOfBirthPatientI');

    if (!birthDate || !moment(birthDate).isValid()) {
      return;
    }

    if (moment(birthDate).isAfter(moment().subtract(18, 'years'), 'day')) {
      form.setValue('AgeIsAdultPatientI', false);
    }

    if (moment(birthDate).isBefore(moment().subtract(18, 'years').add(1, 'day'), 'day')) {
      form.setValue('AgeIsAdultPatientI', true);
    }
  }, [form.watch('dateOfBirthPatientI')]);
  //#endregion 

  //#region secondPeselAndDate
  useEffect(() => {
    const peselValue = form.watch('peselPatientII');
    let birthDate;

    if (isValidPesel(peselValue)) {
      birthDate = countDateOfBirthUsingPesel(peselValue);
      form.setValue('customErrorPeselPatientII', 'OK');
    }

    if (birthDate) {
      form.clearErrors('dateOfBirthPatientII');
      form.clearErrors('customErrorPeselPatientII');
      form.setValue('dateOfBirthPatientII', birthDate);
    }
  }, [form.watch('peselPatientII')])

  useEffect(() => {
    const birthDate = form.watch('dateOfBirthPatientII');

    if (!birthDate || !moment(birthDate).isValid()) {
      return;
    }

    if (moment(birthDate).isAfter(moment().subtract(18, 'years'), 'day')) {
      form.setValue('AgeIsAdultPatientII', false);
    }

    if (moment(birthDate).isBefore(moment().subtract(18, 'years').add(1, 'day'), 'day')) {
      form.setValue('AgeIsAdultPatientII', true);
    }
  }, [form.watch('dateOfBirthPatientII')]);
  //#endregion 

  //#region thirdPeselAndDate
  useEffect(() => {
    const peselValue = form.watch('peselPatientIII');
    let birthDate;

    if (isValidPesel(peselValue)) {
      birthDate = countDateOfBirthUsingPesel(peselValue);
      form.setValue('customErrorPeselPatientIII', 'OK');
    }

    if (birthDate) {
      form.clearErrors('dateOfBirthPatientIII');
      form.clearErrors('customErrorPeselPatientIII');
      form.setValue('dateOfBirthPatientIII', birthDate);
    }
  }, [form.watch('peselPatientIII')])

  useEffect(() => {
    const birthDate = form.watch('dateOfBirthPatientIII');

    if (!birthDate || !moment(birthDate).isValid()) {
      return;
    }

    if (moment(birthDate).isAfter(moment().subtract(18, 'years'), 'day')) {
      form.setValue('AgeIsAdultPatientIII', false);
    }

    if (moment(birthDate).isBefore(moment().subtract(18, 'years').add(1, 'day'), 'day')) {
      form.setValue('AgeIsAdultPatientIII', true);
    }
  }, [form.watch('dateOfBirthPatientIII')]);
  //#endregion

  //#region fourthPeselAndDate
  useEffect(() => {
    const peselValue = form.watch('peselPatientIV');
    let birthDate;

    if (isValidPesel(peselValue)) {
      birthDate = countDateOfBirthUsingPesel(peselValue);
      form.setValue('customErrorPeselPatientIV', 'OK');
    }

    if (birthDate) {
      form.clearErrors('dateOfBirthPatientIV');
      form.clearErrors('customErrorPeselPatientIV');
      form.setValue('dateOfBirthPatientIV', birthDate);
    }
  }, [form.watch('peselPatientIV')])

  useEffect(() => {
    const birthDate = form.watch('dateOfBirthPatientIV');

    if (!birthDate || !moment(birthDate).isValid()) {
      return;
    }

    if (moment(birthDate).isAfter(moment().subtract(18, 'years'), 'day')) {
      form.setValue('AgeIsAdultPatientIV', false);
    }

    if (moment(birthDate).isBefore(moment().subtract(18, 'years').add(1, 'day'), 'day')) {
      form.setValue('AgeIsAdultPatientIV', true);
    }
  }, [form.watch('dateOfBirthPatientIV')]);
  //#endregion

  //#region fifthPeselAndDate
  useEffect(() => {
    const peselValue = form.watch('peselPatientV');
    let birthDate;

    if (isValidPesel(peselValue)) {
      birthDate = countDateOfBirthUsingPesel(peselValue);
      form.setValue('customErrorPeselPatientV', 'OK');
    }

    if (birthDate) {
      form.clearErrors('dateOfBirthPatientV');
      form.clearErrors('customErrorPeselPatientV');
      form.setValue('dateOfBirthPatientV', birthDate);
    }
  }, [form.watch('peselPatientV')])

  useEffect(() => {
    const birthDate = form.watch('dateOfBirthPatientV');

    if (!birthDate || !moment(birthDate).isValid()) {
      return;
    }

    if (moment(birthDate).isAfter(moment().subtract(18, 'years'), 'day')) {
      form.setValue('AgeIsAdultPatientV', false);
    }

    if (moment(birthDate).isBefore(moment().subtract(18, 'years').add(1, 'day'), 'day')) {
      form.setValue('AgeIsAdultPatientV', true);
    }
  }, [form.watch('dateOfBirthPatientV')]);
  //#endregion

  //#region sixthPeselAndDate
  useEffect(() => {
    const peselValue = form.watch('peselPatientVI');
    let birthDate;

    if (isValidPesel(peselValue)) {
      birthDate = countDateOfBirthUsingPesel(peselValue);
      form.setValue('customErrorPeselPatientVI', 'OK');
    }

    if (birthDate) {
      form.clearErrors('dateOfBirthPatientVI');
      form.clearErrors('customErrorPeselPatientVI');
      form.setValue('dateOfBirthPatientVI', birthDate);
    }
  }, [form.watch('peselPatientVI')])

  useEffect(() => {
    const birthDate = form.watch('dateOfBirthPatientVI');

    if (!birthDate || !moment(birthDate).isValid()) {
      return;
    }

    if (moment(birthDate).isAfter(moment().subtract(18, 'years'), 'day')) {
      form.setValue('AgeIsAdultPatientVI', false);
    }

    if (moment(birthDate).isBefore(moment().subtract(18, 'years').add(1, 'day'), 'day')) {
      form.setValue('AgeIsAdultPatientVI', true);
    }
  }, [form.watch('dateOfBirthPatientVI')]);
  //#endregion

  const sidebarRightInfo = React.useMemo(() => {
    return [
      {
        title: 'Wizyta',
        items: [
          {
            title: "Numer zgłoszenia",
            href: 'visitNumber',
          },
          {
            title: "Rodzaj wizyty",
            href: 'visitType',
          },
          {
            title: "Specjalizacja",
            href: 'specialization',
          },
          {
            title: "Data wizyty",
            href: 'dateOfVisit',
          },
          {
            title: "Temat",
            href: 'topicOfVisit',
          },
          {
            title: "Dodatkowe informacje",
            href: 'additionalInformation',
          },
          {
            title: "Język wizyty",
            href: 'langOfVisit',
          },
          {
            title: "Kod rabatowy",
            href: null,
          },
        ]
      },
      ...patientsNumberRomanArray.map((romanNumber, i) => {
        return {
          title: (patientsNumberRomanArray.length > 1 ? `Pacjent ${romanNumber}` : 'Pacjent'),
          items: [
            i === 0 && {
              title: "Kraj",
              href: 'homeAdresPatient'
            },
            {
              title: "Wiek pacjenta",
              href: `AgeIsAdultPatient${romanNumber}`,
            },
            {
              title: "Dane pacjenta",
              href: `dataOfPatient${romanNumber}`,
            },
            {
              title: "Objawy",
              href: `symptomsOfPatient${romanNumber}`,
            },
            {
              title: "Dokument",
              href: `documentPatient${romanNumber}`,
            },
            i === 0 && {
              title: "Dane adresowe",
              href: 'homeAdresPatient',
            },
          ]
        }
      })
    ]
  }, [patientsNumberRomanArray])


  return (
    <div className="grid grid-cols-[715px_190px] gap-x-[20px]">
      <div className="col-start-1 col-end-2">
        <BreadcrumbsConstructor />
        <PagesTitle />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[20px] w-full mt-[24px]">
            <div className="flex flex-col gap-[24px] p-[40px] bg-[#FEFEFE] rounded-[4px]">
              <FormLabel 
                className="font-light text-[24px] text-[#112950] leading-[28.8px]"
              >
                Wizyta
              </FormLabel>

              {/* visitNumber */}
              <FormField
                control={form.control}
                name="visitNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-[8px] space-y-0">
                    <FormLabel 
                      id="visitNumber"
                      className="font-bold text-[16px] text-[#112950] leading-[24px]"
                    >
                      Numer zgłoszenia
                    </FormLabel>
                      <Input 
                        type="text" 
                        className="m-0 pt-[8px] pb-[6px] px-[2px] border-0 border-b-2 rounded-none border-[#E4E5E7] focus-visible:ring-0 focus-visible:ring-transparent ring-offset-transparent font-normal text-[16px] leading-[24px] text-[#6D7178] active:text-[#6D7178] placeholder:text-[#6D7178]"
                        placeholder="Wpisz numer zgłoszenia"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* visitType */}
              <SearchInputWithDropdown
                options={visitData?.visitTypeFromServer.map(type => type.defaultValue) || []}
                control={form.control} 
                id="visitType"
                name={"visitType"} 
                title={"Rodzaj wizyty"} 
                inputMessage={"Prosimy wpisać rodzaj wizyty"} 
                noFoundAnswer={"Nie odnaleziono takiej wizyty"}
              />

              {/* Specialization */}
              <SearchInputWithDropdown
                options={visitData?.specializationFromServer || []}
                control={form.control} 
                id="specialization"
                name={"specialization"} 
                title={"Specjalizacja"} 
                inputMessage={"Prosimy wpisać spacjalizację"} 
                noFoundAnswer={"Nie odnaleziono takiej specjalizacji"}
              />

              {/* dateOfVisit and showHoursOfVisit checkbox */}
              <FormField
                control={form.control}
                name="dateOfVisit"
                render={({ field }) => (
                  <FormItem className="w-full" >
                    <FormLabel 
                      className="font-bold text-[16px] text-[#112950] leading-[24px]"
                      id="dateOfVisit"
                    >
                      Data wizyty
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild className="w-full">
                          <FormControl>
                            <Button 
                              type="button"
                              className="w-full px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none justify-between bg-transparent 
                              hover:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent font-normal text-[16px] leading-[24px] text-[#6D7178]"
                            >
                              {field.value ? format(field.value, "PPP") : (
                                <span>Jak najszybciej</span>
                              )}

                              <ChevronDown 
                                size={24} 
                                color="#112950"
                                className="opacity-60"
                              />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-max">
                          <Calendar 
                            mode="single"
                            selected={field.value}
                            onSelect={(e) => {
                              field.onChange(e);
                              form.setValue('hourFrom', undefined);
                              form.setValue('hourTo', undefined);
                            }}
                            className="w-max flex items-center justify-center bg-[#FEFEFE] border-[#112950] rounded-[6px]"
                            disabled={[
                              (date) => moment(date).isBefore(moment().subtract(1, 'days')) || moment(date).isAfter(moment().add(3, "days"))
                            ]}
                            weekStartsOn={1}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />

                    <FormField 
                      control={form.control}
                      name="showHoursOfVisit"
                      render={({ field }) => (
                        <FormItem className="flex gap-[12px] space-y-0 items-center">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>
                            Wybierz konkretny przedział godzinowy
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </FormItem>
                )}
              />

              {/* hourFrom and hourTo */}
              {form.watch('showHoursOfVisit') && (
                <div className="flex flex-col gap-[8px]">
                  <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Godzina</FormLabel>

                  <div className="flex gap-[8px]">
                    <FormField 
                      control={form.control}
                      name="hourFrom"
                      render={({ field }) => (
                        <FormItem className="basis-auto w-full">
                          <Select
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                                <SelectValue placeholder="Od"/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countedFromHourArray.length > 0
                                ? countedFromHourArray.map(hour => (
                                  <SelectItem 
                                    key={`${hour}-hour`}
                                    value={`${hour}`}
                                    className="px-8 justify-center"
                                    onSelect={(e: any) => {
                                      field.onChange(e);
                                      form.setValue("hourTo", undefined);
                                    }}
                                  >
                                    {`${hour}:00`}
                                  </SelectItem>
                                ))
                                : (
                                  <SelectItem 
                                    value="no available hour"
                                    disabled
                                    className="px-8 justify-center disabled:opacity-70"
                                  >
                                    No available hour
                                  </SelectItem>
                                )}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField 
                      control={form.control}
                      name="hourTo"
                      render={({ field }) => (
                        <FormItem className="basis-auto w-full">
                          <Select
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                                <SelectValue placeholder="Do"/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countedToHourArray.length > 0
                                ? countedToHourArray.map(hour => (
                                  <SelectItem 
                                    key={`${hour}-hour`}
                                    value={`${hour}`}
                                    className="px-8 justify-center"
                                    onSelect={field.onChange}
                                  >
                                    {`${hour}:00`}
                                  </SelectItem>
                                ))
                                : (
                                  <SelectItem 
                                    value="no available hour"
                                    disabled
                                    className="px-8 justify-center disabled:opacity-70"
                                  >
                                    No available hour
                                  </SelectItem>
                                )}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}


              {/* topicOfVisit */}
              <SearchInputWithDropdown
                options={visitData?.visitTopicsFromServer || []}
                control={form.control} 
                id="topicOfVisit"
                name={"topicOfVisit"} 
                title={"Temat"} 
                inputMessage={"Prosimy wpisać temat wizyty"} 
                noFoundAnswer={"Nie odnaleziono takiego tematu"}
              />

              {/* AdditionalInformation */}
              <FormField
                control={form.control}
                name="additionalInformation"
                render={({ field }) => (
                  <FormItem 
                    className="flex flex-col gap-[8px] space-y-0"
                  >
                    <FormLabel 
                      className="font-bold text-[16px] text-[#112950] leading-[24px]"
                      id="additionalInformation"
                    >
                      Dodarkowe informacje
                      <span className="font-normal">&nbsp;(opcjonalnie)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opisz problem"
                        className="resize-none py-[8px] px-[12px] h-[134px] border-0 rounded-[6px] bg-[#F7F7F8] font-normal text-[12px] leading-[18px] text-[#242628] focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* langOfVisit */}
              <SearchInputWithDropdown
                options={visitData?.visitLanguagesFromServer || []}
                control={form.control}
                id="langOfVisit"
                name={"langOfVisit"} 
                title={"Język wizyty"} 
                inputMessage={"Prosimy wpisać język wizyty"} 
                noFoundAnswer={"Nie odnaleziono takiego języka"}
              />
            </div>

            {patientsNumberRomanArray.map((number, i) => (
              <div 
                className="flex flex-col gap-[24px] p-[40px] bg-[#FEFEFE] rounded-[4px]"
                key={`patient${number}`}
              >
                <FormLabel className="font-light text-[24px] text-[#112950] leading-[28.8px]">
                  Pacjent
                </FormLabel>

                <FormField
                  control={form.control}
                  name={(`AgeIsAdultPatient${number}`) as nameType}
                  render={({ field }) => (
                    <FormItem 
                      className="flex flex-col gap-[8px] space-y-0"
                    >
                      <FormLabel 
                        className="font-bold text-[16px] text-[#112950] leading-[24px]"
                        id={`AgeIsAdultPatient${number}`}
                      >
                        Wiek Pacjenta
                      </FormLabel>
                      <FormControl {...field}>
                        <div className="flex gap-[16px]">
                          <Button
                            type="button"
                            disabled
                            className={classNames(
                              "basis-auto h-[40px] w-full border-[1px] disabled:border-[#09162A] font-medium text-[16px] leading-[24px] text-[#112950] disabled:bg-[#FEFEFE] disabled:opacity-100",
                              field.value && "disabled:bg-[#112950] text-[#FEFEFE]",
                            )}
                          >
                            Dorosły
                          </Button>
                          <Button
                            type="button"
                            disabled
                            className={classNames(
                              "basis-auto h-[40px] w-full border-[1px] disabled:border-[#09162A] font-medium text-[16px] leading-[24px] text-[#112950] disabled:bg-[#FEFEFE] disabled:opacity-100",
                              !field.value && "disabled:bg-[#112950] text-[#FEFEFE]",
                            )}
                          >
                            Dziecko
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-[8px]">
                  <FormLabel 
                    className="font-bold text-[16px] text-[#112950] leading-[24px]"
                    id={`dataOfPatient${number}`}
                  >
                    Dane pacjenta
                  </FormLabel>

                  <div className="flex gap-[16px]">
                    <FormField 
                      control={form.control}
                      name={(`nameOfPatient${number}`) as nameType}
                      render={({ field }) => (
                        <FormItem 
                          className="basis-auto w-full"
                        >
                          <FormControl>
                            <Input 
                              defaultValue={(field.value) as string | number | readonly string[] | undefined}
                              onChange={field.onChange}
                              placeholder="Imię"
                              className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField 
                      control={form.control}
                      name={(`surnameOfPatient${number}`) as nameType}
                      render={({ field }) => (
                        <FormItem 
                          className="basis-auto w-full"
                          id={`surnameOfPatient${number}`}
                        >
                          <FormControl>
                            <Input 
                              defaultValue={(field.value) as string | number | readonly string[] | undefined}
                              onChange={field.onChange}
                              placeholder="Nazwisko"
                              className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {visitData?.symptomsFromServer && (
                  <FormField 
                    control={form.control}
                    name={(`symptomsOfPatient${number}`) as nameType}
                    render={({ field }) => (
                      <FormItem 
                        className="flex flex-col gap-[8px] space-y-0"
                      >
                        <FormLabel 
                          className="font-bold text-[16px] text-[#112950] leading-[24px]"
                          id={`symptomsOfPatient${number}`}
                        >
                          Objawy
                          <span className="font-normal">&nbsp;(opcjonalnie)</span>
                        </FormLabel>

                        <MultiSelect
                          {...field}
                          value={(field.value) as string | number | readonly string[] | undefined}
                          onValueChange={field.onChange}
                          options={visitData?.symptomsFromServer.map(symptom => ({ label: symptom, value: symptom }))}
                          placeholder="Wybierz z listy" 
                          className="w-full px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none justify-between bg-transparent 
                                hover:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent font-normal text-[16px] leading-[24px] text-[#6D7178]"
                          inputMessage="Prosimy wybrać objawy, jeżeli są takie"
                          noFoundMessage="Nie odnaleziono takich objawów"
                          clearButtonMessage="Wyczyść"
                          closeButtonMessage="Zamknąć"
                          selectAllButtonMessage="Wybierz wszystko"
                        />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex flex-col gap-[8px]">
                  <FormLabel 
                    className="font-bold text-[16px] text-[#112950] leading-[24px]"
                    id={`documentPatient${number}`}
                  >
                    Dokument
                  </FormLabel>

                  <FormField
                    control={form.control} 
                    name={(`documentPatient${number}`) as nameType}
                    render={({ field }) => (
                      <Tabs 
                        defaultValue={field.value || 'pesel'} 
                        className="flex flex-col gap-[8px] w-full m-0"
                        onValueChange={field.onChange}
                      >
                        <TabsList className="grid h-[46px] w-full p-[5px] rounded-[6px] bg-[#E5F0FF] grid-cols-2 justify-center items-center">
                          <TabsTrigger 
                            value="pesel"
                            className={classNames(
                              "h-full rounded-[3px] font-medium text-[16px] leading-[24px]",
                              field.value === 'pesel' ? "bg-[#FEFEFE] text-[#242628]" : "text-[#6D7178]"
                            )}
                          >
                            PESEL
                          </TabsTrigger>

                          <TabsTrigger 
                            value="paszport"
                            className={classNames(
                              "h-full rounded-[3px] font-medium text-[16px] leading-[24px]",
                              field.value === 'paszport' ? "bg-[#FEFEFE] text-[#242628]" : "text-[#6D7178]"
                            )}
                          >
                            Paszport
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent 
                          value="pesel"
                          className="data-[state=inactive]:hidden"
                        >
                          <FormField
                            control={form.control}
                            name={(`peselPatient${number}`) as nameType}
                            render={({ field }) => (
                              <>
                                <FormItem className="relative">
                                  <FormControl>
                                    <Input 
                                      placeholder="Wpisz numer PESEL"
                                      defaultValue={(field.value) as string | number | readonly string[] | undefined}
                                      className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-transparent"
                                      onChange={(e) => {
                                        validatePeselAndShowErrorMessages(e, `customErrorPeselPatient${number}` as nameType)
                                        field.onChange(e);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                                <FormMessage />
                                {form.formState.errors[`customErrorPeselPatient${number}` as nameType]?.types && (
                                  <span className="text-sm font-medium text-red-500 dark:text-red-900">
                                    {(form.formState.errors[`customErrorPeselPatient${number}`]?.types?.message) as React.ReactNode}
                                  </span>
                                )}
                              </>
                            )}
                          />
                        </TabsContent>
                        <TabsContent 
                          value="paszport"
                          className="flex gap-[8px] w-full data-[state=inactive]:hidden"
                        >
                          <FormField
                              control={form.control}
                              name={(`peselPatient${number}`) as nameType}
                              render={({ field }) => (
                                <FormItem className="basis-auto w-full">
                                  <FormControl>
                                    <Input 
                                      placeholder="Wpisz numer PESEL"
                                      defaultValue={(field.value) as string | number | readonly string[] | undefined}
                                      className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-transparent"
                                      onChange={(e) => {
                                        validatePeselAndShowErrorMessages(e, `customErrorPeselPatient${number}` as nameType)
                                        field.onChange(e)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                  {form.formState.errors[`customErrorPeselPatient${number}` as nameType]?.types && (
                                    <span className="text-sm font-medium text-red-500 dark:text-red-900">
                                       {(form.formState.errors[`customErrorPeselPatient${number}`]?.types?.message) as React.ReactNode}
                                    </span>
                                  )}
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={(`dateOfBirthPatient${number}`) as nameType}
                              render={({ field }) => (
                                <FormItem className="basis-auto w-full">
                                  <FormControl>
                                    <Popover>
                                      <PopoverTrigger asChild className="w-full">
                                        <FormControl>
                                          <Button 
                                            type="button"
                                            className="w-full px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none justify-between bg-transparent 
                                            hover:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent font-normal text-[16px] leading-[24px] text-[#6D7178]">
                                            {field.value ? format((field.value) as string | number | Date, "PPP") : (
                                              <span>Data urodzenia</span>
                                            )}
                                            <CalendarDays 
                                              size={24} 
                                              color="#112950"
                                              className="opacity-60"
                                            />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-max">
                                        <Calendar 
                                          mode="single"
                                          captionLayout="dropdown"
                                          selected={field.value}
                                          className="flex items-center justify-center w-max bg-[#FEFEFE] p-0 border-[#112950] rounded-[6px]"
                                          classNames={{
                                            months: "flex justify-center",
                                            month_caption: "flex justify-center",
                                            caption_label: "flex items-center gap-[4px] p-[1px] border-[1px] rounded-[5px]",
                                            nav: "flex",
                                            button_previous: cn(
                                              buttonVariants({ variant: "outline" }),
                                              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
                                            ),
                                            button_next: cn(
                                              buttonVariants({ variant: "outline" }),
                                              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
                                            ),
                                            month_grid: "w-full border-collapse space-y-1",
                                            weekdays: "flex mt-[20px]",
                                            weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                            week: "flex w-full mt-2",
                                            day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20"),
                                            selected:
                                              "bg-[#242628] text-[#FEFEFE] hover:bg-[#242628] hover:text-[#FEFEFE] focus:bg-[#242628]focus:text-[#FEFEFE]",
                                            today: "bg-accent text-[#0068FA]",
                                            outside: "text-muted-foreground opacity-50",
                                            disabled: "text-muted-foreground opacity-50",
                                            range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                            hidden: "invisible",
                                            ...classNames,
                                          }}
                                          onSelect={(e: any) => {
                                            field.onChange(e)
                                          }}
                                          startMonth={new Date(moment().subtract(100, 'years').year(), moment().month())}
                                          endMonth={new Date(moment().year(), moment().month())}
                                          disabled={[(date) => moment(date).isAfter(moment(), 'day') || moment(date).isBefore(moment().subtract(100, 'year'), 'day')]}
                                          weekStartsOn={1}
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </TabsContent>
                      </Tabs>
                    )}
                  />
                </div>

                {!i && (
                  <>
                    <div className="flex flex-col gap-[8px]">
                      <FormLabel 
                        className="font-bold text-[16px] text-[#112950] leading-[24px]"
                        id="homeAdresPatient"
                      >
                        Dane adresowe
                      </FormLabel>

                      <SearchInputWithDropdown
                        options={visitData?.countriesFromServer || []}
                        control={form.control}
                        name="homeCountryOfPatientI"
                        id="homeCountryOfPatientI"
                        placeholderMessage="Kraj"
                        inputMessage="Prosimy wybrać kraj zamieszkania"
                        noFoundAnswer="Nie odnaleziono takiego kraju"
                      />

                      <div className="flex gap-[16px]">
                        <FormField
                          control={form.control}
                          name="houseStreetOfPatientI"
                          render={({ field }) => (
                            <FormItem className="flex flex-col grow">
                              <FormControl>
                                <Input 
                                  defaultValue={field.value}
                                  onChange={field.onChange}
                                  className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 
                                  focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                                  placeholder="Ulica"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />                
                        <FormField
                          control={form.control}
                          name="houseNumberOfPatientI"
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-[201px]">
                              <FormControl>
                                <Input 
                                  defaultValue={field.value}
                                  onChange={field.onChange}
                                  className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none 
                                  focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0" 
                                  placeholder="Nr lokalu"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> 
                      </div>
                    </div>

                    <FormField 
                      control={form.control}
                      name="addVisitAdress"
                      render={({ field }) => (
                        <FormItem className="flex gap-[12px] space-y-0 items-center">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>
                            Wizyta ma się odbyć na inny adres
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {form.watch('addVisitAdress') && (
                      <div className="flex flex-col gap-[8px]">
                        <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dane adresowe do wizyty</FormLabel>

                        <SearchInputWithDropdown
                          options={visitData?.countriesFromServer || []}
                          name="visitAdressCountry"
                          control={form.control}
                          placeholderMessage="Kraj"
                          inputMessage="Prosimy wybrać kraj wizyty"
                          noFoundAnswer="Nie odnaleziono takiego kraju"
                        />

                        <div className="flex gap-[16px]">
                          <FormField
                            control={form.control}
                            name="visitAdressStreet"
                            render={({ field }) => (
                              <FormItem className="flex grow">
                                <FormControl>
                                  <Input 
                                    defaultValue={field.value}
                                    onChange={field.onChange}
                                    className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 
                                    focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Ulica"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />    

                          <FormField
                            control={form.control}
                            name="visitAdressNumberOfHouse"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl >
                                  <Input 
                                    defaultValue={field.value}
                                    onChange={field.onChange}
                                    className="px-0 pt-[8px] w-[201px] pb-[6px] border-0 border-b-2 rounded-none 
                                    focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0" 
                                    placeholder="Nr lokalu"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          /> 
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <Button 
              type="button"
              className="flex items-center justify-center gap-[8px] mt-[4px] w-full h-[48px] rounded-[8px] border-[1px] border-[#2E85FF] bg-[#FEFEFE] font-medium text-[16px] text-[#0068FA] leading-[24px] disabled:opacity-60"
              disabled={patientsAmount === 6}
              onClick={() => {
                if (patientsAmount >= 1 && patientsAmount < 6) {
                  setPatientsAmount(patientsAmount + 1)
                }
              }}
            >
              Dodaj pacjenta
              <CirclePlus size={16} color="#E5F0FF"/>
            </Button>

            <Button 
              type="submit"
              className="flex items-center justify-center gap-[8px] mt-[4px] mb-[40px] w-full h-[48px] rounded-[8px] bg-[#0068FA] font-medium text-[16px] text-[#FEFEFE] leading-[24px]"
            >
              Dalej
              <ChevronRight size={16} color="#FEFEFE"/>
            </Button>
          </form>
        </Form>
      </div>

      <div className="col-start-2 col-end-3 flex relative">
        <RightSidebarWrap>
          <SidebarContent className="min-h-max rounded-[8px] bg-[#FEFEFE]">
            <SidebarGroup className="p-[16px]">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Collapsible
                      className="group/collapsible flex flex-col gap-[10px] [&[data-state=open]>button>svg:first-child]:-rotate-180"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className="flex justify-between p-0 h-max font-medium text-[14px] leading-[21px] hover:bg-[#FEFEFE]
                          data-[state=open]:hover:bg-[#FEFEFE] data-[state=open]:hover:text-transparent active:bg-[#FEFEFE]
                          hover:text-[#003E94] text-[#003E94] data-[state=open]:hover:text-[#003E94]"
                        >
                          Przejdź do
                          <ChevronDown className="transition-transform" color="#003E94"/>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <SidebarSeparator className="m-0 w-full bg-[#D7D8DB]"/>
                      <CollapsibleContent>
                        {sidebarRightInfo.map(({title, items}) => (
                          <SidebarMenuSub 
                            className="border-1 mx-0 p-0 flex flex-col gap-[8px]"
                            key={title}
                          >
                            <SidebarMenuItem>
                              <Collapsible
                                className="group/collapsible [&[data-state=open]>button>svg:first-child]:-rotate-180"
                              >
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton 
                                    className="flex justify-between p-0 h-max font-medium text-[14px] leading-[21px] hover:bg-[#FEFEFE] data-[state=open]:hover:bg-[#FEFEFE] data-[state=open]:hover:text-transparent active:bg-[#FEFEFE] hover:text-[#242628] text-[#242628] data-[state=open]:hover:text-[#242628]"
                                  >
                                    {title}
                                    <ChevronDown className="transition-transform" color="#242628"/>
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub className="border-1 mx-[0px] py-[4px] flex flex-col gap-[8px]">
                                    {items.filter(obj => !!obj).map((nav) => (
                                      <SidebarMenuButton
                                        key={nav.title}
                                        className="data-[active=true]:bg-transparent p-0 px-[18px] m-0 h-max"
                                        onClick={() => scrollToId(nav.href)}
                                      >
                                        <p 
                                          className="w-full h-full text-[##242628]"
                                        >
                                          {nav.title}
                                        </p>
                                      </SidebarMenuButton>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuItem>
                          </SidebarMenuSub>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </RightSidebarWrap>
      </div>

      <Toaster />
    </div>
  )
}

type SearchProps = {
  options: string[],
  name: nameType,
  control: controlType,
  id?: string,
  title?: string,
  placeholderMessage?: string,
  inputMessage: string,
  noFoundAnswer: string,
  titleOptional?: string,
}

function SearchInputWithDropdown({ 
  options, 
  control,
  name,
  title,
  id,
  placeholderMessage = 'Wybierz z listy',
  inputMessage,
  noFoundAnswer,
  titleOptional,
}: Readonly<SearchProps>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField 
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-[8px] space-y-0 w-full" >
          {title && (
            <FormLabel 
              className="font-bold text-[16px] text-[#112950] leading-[24px]"
              id={id}
            >
              {title}
              {titleOptional && (
                <span className="font-normal">&nbsp;{titleOptional}</span>
              )}
            </FormLabel>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger 
              asChild
              className="w-full"
            >
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  value={(field.value) as string | number | readonly string[] | undefined}
                  className="w-full justify-between px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]"
                >
                  {field.value
                    ? options.find(
                        (option) => option === field.value
                      )
                    : placeholderMessage}
                  <ChevronDown />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[635px] p-0"
            >
              <Command>
                <CommandInput 
                  placeholder={inputMessage}
                />
                <CommandList>
                  <CommandEmpty>
                    {noFoundAnswer}
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option}
                        key={option}
                        onSelect={(e: any) => {
                          field.onChange(e);
                          setOpen(false);
                        }}
                      >
                        <span>
                          <Check 
                            className={cn(
                              option === field.value ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </span>

                        {option}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
};

