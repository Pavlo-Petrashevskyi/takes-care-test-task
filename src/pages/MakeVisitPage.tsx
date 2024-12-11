/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

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
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CirclePlus } from "lucide-react"
import classNames from 'classnames';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn, countArrayOfHoursForFromHourField, countArrayOfHoursForToHourField } from "@/lib/utils"
import { useEffect, useState } from 'react';
import { DropdownProps } from "react-day-picker"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BASE_URL } from "@/api/api"
import * as React from "react"
import { usePathname } from "next/navigation";
import moment from 'moment';

export type VisitData = {
  visitTypeFromServer: { path: string, defaultValue: string }[],
  specializationFromServer: string[],
  visitTopicsFromServer: string[],
  visitLanguagesFromServer: string[],
}

const FormSchema = z.object({
  visitNumber: z
    .string({
      required_error: "Prosimy wpisać numer zgłoszenia",
    }),
  visitType: z.string(),
  specialization: z
    .string({
      required_error: 'Prosimy wybrać specjalizację wizyty',
    }),
  dateOfVisit: z.date(),
  showHoursOfVisit: z.boolean().default(false).optional(),
  hourFrom: z.string().optional(), //write a function which will count default value
  hourTo: z.string().optional(),
  topicOfVisit: z.string({
    required_error: 'Prosimy wybrać temat wizyty'
  }),
  additionalInformation: z.string().optional(),
  langOfVisit: z.string({
    required_error: 'Prosimy wybrać język wizyty'
  }),
  patient1AgeIsAdult: z.boolean(),
  nameOfPatient1: z.string({
    required_error: 'Prosimy wpisać imię'
  }),
  surnameOfPatient1: z.string({
    required_error: 'Prosimy wpisać nazwisko'
  }),
  symptomsOfPatient1: z.string().optional(),
  documentPatient1: z.string(),
  peselPatient1: z.number(),
  pazsportPatient1: z.string(),
  dateOfBirthPatient1: z.date(),
  countryOfPatient1: z.string(),
  streetOfPatient1: z.string(),
  houseNumberOfPatient1: z.string(),
  addVisitAdress: z.boolean().default(false).optional(),
  visitAdressCountry: z.string(),
  visitAdressStreet: z.string(),
  visitAdressNumberOfHouse: z.string(),
})

export type FormType = typeof FormSchema;

export default function MakeVisitPage() {
  const pathname = usePathname();
  const form = useForm<z.infer<FormType>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      visitType: 'Wizyta domowa',
      patient1AgeIsAdult: true,
      documentPatient1: 'pesel',
    }
  });
  const [patientsAmount, setPatientsAmount] = useState(1)
  const [visitData, setVisitData] = useState<VisitData>()
  const [countedFromHourArray, setCountedFromHourArray] = useState<number[]>(countArrayOfHoursForFromHourField(form.getValues('dateOfVisit')));
  const [countedtoHourArray, setCountedToHourArray] = useState<number[]>(countArrayOfHoursForToHourField(form.getValues('hourFrom')));
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('submitted', data)
  }

  useEffect(() => {
    setCountedFromHourArray(countArrayOfHoursForFromHourField(form.watch('dateOfVisit')))
  }, [form.watch('dateOfVisit')]);

  useEffect(() => {
    setCountedToHourArray(countArrayOfHoursForToHourField(form.watch('hourFrom')));
  }, [form.watch('hourFrom')]);

  useEffect(() => {
    async function fetchVisitData() {
      const res = await fetch(`${BASE_URL}/visitData`, { method: 'GET' });
      const data: VisitData = await res.json();
      setVisitData(data)
    }

    fetchVisitData();
  }, [])

  useEffect(() => {
    if (visitData && visitData.visitTypeFromServer.length > 0 && pathname) {
      form.setValue('visitType', visitData?.visitTypeFromServer.find(({ path }) => pathname.includes(path))?.defaultValue || 'Wizyta domowa')
    }
  }, [form, pathname, visitData])

  return (
    <div className="grid grid-cols-[715px_190px] gap-x-[20px]">
      <div className="col-start-1 col-end-2">
        <BreadcrumbsConstructor />
        <PagesTitle />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[20px] w-full mt-[24px]">
            <div className="flex flex-col gap-[24px] p-[40px] bg-[#FEFEFE] rounded-[4px]">
              <FormLabel className="font-light text-[24px] text-[#112950] leading-[28.8px]">Wizyta</FormLabel>

              {/* visitNumber */}
              <FormField
                control={form.control}
                name="visitNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-[8px] space-y-0">
                    <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Numer zgłoszenia</FormLabel>
                    <Input 
                      type="text" 
                      className="m-0 pt-[8px] pb-[6px] px-[2px] border-0 border-b-2 rounded-none border-[#E4E5E7] focus-visible:ring-0 focus-visible:ring-transparent ring-offset-transparent font-normal text-[16px] leading-[24px] text-[#6D7178] active:text-[#6D7178] placeholder:text-[#6D7178]"
                      placeholder="Wpisz numer zgłoszenia"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* visitType */}
              <SearchInputWithDropdown
                options={visitData?.visitTypeFromServer.map(type => type.defaultValue) || []}
                control={form.control} 
                name={"visitType"} 
                title={"Rodzaj wizyty"} 
                inputMessage={"Prosimy wpisać rodzaj wizyty"} 
                noFoundAnswer={"Nie odnaleziono takiej wizyty"}
              />

              {/* Specialization */}
              <SearchInputWithDropdown
                options={visitData?.specializationFromServer || []}
                control={form.control} 
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
                  <FormItem className="w-full">
                    <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Data wizyty</FormLabel>
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
                        <PopoverContent>
                          <Calendar 
                            mode="single"
                            selected={field.value}
                            onSelect={(e) => {
                              field.onChange(e);
                              form.setValue('hourFrom', undefined);
                              form.setValue('hourTo', undefined);
                            }}
                            className="flex items-center justify-center bg-[#FEFEFE] border-[#112950] rounded-[6px]"
                            disabled={[(date) => moment(date).date() < moment().date() || moment(date).date() > moment().add(3, "days").date()]}
                            weekStartsOn={1}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>

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
              {/* make a custom datepicker using react datepicker and shadCN UI */}
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
                                    onSelect={(e) => {
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
                              {countedtoHourArray.length > 0
                                ? countedtoHourArray.map(hour => (
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
                  <FormItem className="flex flex-col gap-[8px] space-y-0">
                    <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">
                      Dodarkowe informacje
                      <span className="font-normal">&nbsp;(opcjonalnie)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opisz problem"
                        className="resize-none py-[8px] px-[12px] h-[134px] border-0 rounded-[6px] bg-[#F7F7F8] font-normal text-[12px] leading-[18px] text-[#242628] focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* langOfVisit */}
              <SearchInputWithDropdown
                options={visitData?.visitLanguagesFromServer || []}
                control={form.control} 
                name={"langOfVisit"} 
                title={"Język wizyty"} 
                inputMessage={"Prosimy wpisać język wizyty"} 
                noFoundAnswer={"Nie odnaleziono takiego języka"}
              />
            </div>

            <div className="flex flex-col gap-[24px] p-[40px] bg-[#FEFEFE] rounded-[4px]">
              <FormLabel className="font-light text-[24px] text-[#112950] leading-[28.8px]">Pacjent</FormLabel>

              {/* patient1Age */}
              <FormField
                control={form.control}
                name="patient1AgeIsAdult"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-[8px] space-y-0">
                    <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Wiek Pacjenta</FormLabel>
                    <FormControl {...field}>
                      <div className="flex gap-[16px]">
                        <Button
                          type="button"
                          disabled
                          className={classNames(
                            "basis-auto h-[40px] w-full border-[1px] disabled:border-[#09162A] font-medium text-[16px] leading-[24px]text-[#112950] disabled:bg-[#FEFEFE] disabled:opacity-100",
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

              {/* Name and Surname */}
              <div className="flex flex-col gap-[8px]">
                <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dane pacjenta</FormLabel>

                <div className="flex gap-[16px]">
                  <FormField 
                    control={form.control}
                    name="nameOfPatient1"
                    render={({ field }) => (
                      <FormItem className="basis-auto w-full">
                        <FormControl {...field}>
                          <Input 
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
                    name="surnameOfPatient1"
                    render={({ field }) => (
                      <FormItem className="basis-auto w-full">
                        <FormControl {...field}>
                          <Input 
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

              {/* sympomtsPatient1 | possible multiselect */}
              <FormField 
                control={form.control}
                name="symptomsOfPatient1"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-[8px] space-y-0">
                    <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">
                      Objawy
                      <span className="font-normal">&nbsp;(opcjonalnie)</span>
                    </FormLabel>

                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                          <SelectValue placeholder="Wybierz z listy"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ból głowy">Ból głowy</SelectItem>
                        <SelectItem value="Ból kolana">Ból kolana</SelectItem>
                        <SelectItem value="Ból zęba">Ból zęba</SelectItem>
                        <SelectItem value="Ból łokcia">Ból łokcia</SelectItem>
                        <SelectItem value="Temperatura">Temperatura</SelectItem>
                        <SelectItem value="Katar">Katar</SelectItem>
                        <SelectItem value="Kaszel">Kaszel</SelectItem>
                        <SelectItem value="Zapalenie">Zapalenie</SelectItem>
                        <SelectItem value="Osłabienie organizmu">Osłabienie organizmu</SelectItem>
                        <SelectItem value="Zwiększony niepokój">Zwiększony niepokój</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* documentPatient1 */}
              <div className="flex flex-col gap-[8px]">
                <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dokument</FormLabel>
                <FormField
                  control={form.control} 
                  name="documentPatient1"
                  render={({ field }) => (
                    <Tabs 
                      defaultValue={field.value} 
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
                      <TabsContent value="pesel">
                        <FormField
                          control={form.control}
                          name="peselPatient1"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormControl {...field}>
                                <Input 
                                  placeholder="Wpisz numer PESEL"
                                  className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-transparent"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent 
                        value="paszport"
                        className="flex gap-[8px] w-full"
                      >
                        <FormField
                            control={form.control}
                            name="peselPatient1"
                            render={({ field }) => (
                              <FormItem className="basis-auto w-full">
                                <FormControl {...field}>
                                  <Input 
                                    placeholder="Wpisz numer PESEL"
                                    className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-transparent"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dateOfBirthPatient1"
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
                                          {field.value ? format(field.value, "PPP") : (
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
                                    <PopoverContent>
                                      <Calendar 
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        className="bg-[#FEFEFE] border-[1px] border-[#112950] rounded-[6px]"
                                        classNames={{
                                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                          month: "space-y-4",
                                          caption: "flex justify-center pt-1 relative items-center",
                                          caption_label: "text-sm font-medium",
                                          caption_dropdowns: "flex justify-center gap-1",
                                          nav: "space-x-1 flex items-center",
                                          nav_button: cn(
                                            buttonVariants({ variant: "outline" }),
                                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                          ),
                                          nav_button_previous: "absolute left-1",
                                          nav_button_next: "absolute right-1",
                                          table: "w-full border-collapse space-y-1",
                                          head_row: "flex",
                                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                          row: "flex w-full mt-2",
                                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                          day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
                                          day_selected:
                                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                          day_today: "bg-accent text-accent-foreground",
                                          day_outside: "text-muted-foreground opacity-50",
                                          day_disabled: "text-muted-foreground opacity-50",
                                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                          day_hidden: "invisible",
                                          ...classNames,
                                        }}
                                        components={{
                                          CaptionLabel: () => (<></>),
                                          Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
                                            const options = React.Children.toArray(children) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[]
                                            const selected = options.find((child) => child.props.value === value)
                                            const handleChange = (value: string) => {
                                              const changeEvent = {
                                                target: { value },
                                              } as React.ChangeEvent<HTMLSelectElement>
                                              onChange?.(changeEvent)
                                            }
                                            return (
                                              <Select
                                                value={value?.toString()}
                                                onValueChange={(value: string) => {
                                                  handleChange(value)
                                                }}
                                              >
                                                <SelectTrigger className="pr-1.5 focus:ring-0">
                                                  <SelectValue>{selected?.props?.children}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                  <ScrollArea className="h-80">
                                                    {options.map((option, id: number) => (
                                                      <SelectItem key={`${option.props.value}-${id}`} value={option.props.value?.toString() ?? ""}>
                                                        {option.props.children}
                                                      </SelectItem>
                                                    ))}
                                                  </ScrollArea>
                                                </SelectContent>
                                              </Select>
                                            )
                                          },
                                          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                                          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                                        }}
                                        captionLayout="dropdown-buttons"
                                        fromYear={new Date().getFullYear() - 100}
                                        toYear={new Date().getFullYear()}
                                        disabled={[(date: string | number | Date) => new Date(date) > new Date()]}
                                        weekStartsOn={1}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                      </TabsContent>
                    </Tabs>
                  )}
                />
              </div>

              {/* dane adresowe */}
              <div className="flex flex-col gap-[8px]">
                <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dane adresowe</FormLabel>

                <FormField
                  control={form.control}
                  name="countryOfPatient1"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                            <SelectValue placeholder="Kraj"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Polska">Polska</SelectItem>
                          <SelectItem value="Niemcy">Niemcy</SelectItem>
                          <SelectItem value="Ukraina">Ukraina</SelectItem>
                          <SelectItem value="Wielka Brytania">Wielka Brytania</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-[16px]">
                  <FormField
                    control={form.control}
                    name="streetOfPatient1"
                    render={({ field }) => (
                      <FormItem className="flex grow">
                          <FormControl {...field}>
                            <Input 
                              className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 
                              focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Ulica"
                            />
                          </FormControl>
                      </FormItem>
                    )}
                  />                
                  <FormField
                    control={form.control}
                    name="houseNumberOfPatient1"
                    render={({ field }) => (
                      <FormItem>
                          <FormControl {...field}>
                            <Input 
                              className="px-0 pt-[8px] w-[201px] pb-[6px] border-0 border-b-2 rounded-none 
                              focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0" 
                              placeholder="Nr lokalu"
                            />
                          </FormControl>
                      </FormItem>
                    )}
                  /> 
                </div>
              </div>

              {/* addVisitAdress */}
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
                  
              {/* dane adresowe wizyty */}
              {form.watch('addVisitAdress') && (
                <div className="flex flex-col gap-[8px]">
                  <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dane adresowe do wizyty</FormLabel>

                  <FormField
                    control={form.control}
                    name="visitAdressCountry"
                    render={({ field }) => (
                      <FormItem>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                              <SelectValue placeholder="Kraj"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Polska">Polska</SelectItem>
                            <SelectItem value="Niemcy">Niemcy</SelectItem>
                            <SelectItem value="Ukraina">Ukraina</SelectItem>
                            <SelectItem value="Wielka Brytania">Wielka Brytania</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-[16px]">
                    <FormField
                      control={form.control}
                      name="visitAdressStreet"
                      render={({ field }) => (
                        <FormItem className="flex grow">
                            <FormControl {...field}>
                              <Input 
                                className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 
                                focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Ulica"
                              />
                            </FormControl>
                        </FormItem>
                      )}
                    />    

                    <FormField
                      control={form.control}
                      name="visitAdressNumberOfHouse"
                      render={({ field }) => (
                        <FormItem>
                            <FormControl {...field}>
                              <Input 
                                className="px-0 pt-[8px] w-[201px] pb-[6px] border-0 border-b-2 rounded-none 
                                focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0" 
                                placeholder="Nr lokalu"
                              />
                            </FormControl>
                        </FormItem>
                      )}
                    /> 
                  </div>
                </div>
              )}
            </div>

            {Array.from({ length: patientsAmount}).map((_, i) => (
              <div className="flex flex-col gap-[24px] p-[40px] bg-[#FEFEFE] rounded-[4px]">
                <FormLabel className="font-light text-[24px] text-[#112950] leading-[28.8px]">Pacjent</FormLabel>

                {/* patient1Age */}
                <FormField
                  control={form.control}
                  name="patient1AgeIsAdult"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-[8px] space-y-0">
                      <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Wiek Pacjenta</FormLabel>
                      <FormControl {...field}>
                        <div className="flex gap-[16px]">
                          <Button
                            type="button"
                            disabled
                            className={classNames(
                              "basis-auto h-[40px] w-full border-[1px] disabled:border-[#09162A] font-medium text-[16px] leading-[24px]text-[#112950] disabled:bg-[#FEFEFE] disabled:opacity-100",
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

                {/* Name and Surname */}
                <div className="flex flex-col gap-[8px]">
                  <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dane pacjenta</FormLabel>

                  <div className="flex gap-[16px]">
                    <FormField 
                      control={form.control}
                      name="nameOfPatient1"
                      render={({ field }) => (
                        <FormItem className="basis-auto w-full">
                          <FormControl {...field}>
                            <Input 
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
                      name="surnameOfPatient1"
                      render={({ field }) => (
                        <FormItem className="basis-auto w-full">
                          <FormControl {...field}>
                            <Input 
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

                {/* sympomtsPatient1 | multiselect */}
                <FormField 
                  control={form.control}
                  name="symptomsOfPatient1"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-[8px] space-y-0">
                      <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">
                        Objawy
                        <span className="font-normal">&nbsp;(opcjonalnie)</span>
                      </FormLabel>

                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                            <SelectValue placeholder="Wybierz z listy"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ból głowy">Ból głowy</SelectItem>
                          <SelectItem value="Ból kolana">Ból kolana</SelectItem>
                          <SelectItem value="Ból zęba">Ból zęba</SelectItem>
                          <SelectItem value="Ból łokcia">Ból łokcia</SelectItem>
                          <SelectItem value="Temperatura">Temperatura</SelectItem>
                          <SelectItem value="Katar">Katar</SelectItem>
                          <SelectItem value="Kaszel">Kaszel</SelectItem>
                          <SelectItem value="Zapalenie">Zapalenie</SelectItem>
                          <SelectItem value="Osłabienie organizmu">Osłabienie organizmu</SelectItem>
                          <SelectItem value="Zwiększony niepokój">Zwiększony niepokój</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* documentPatient1 */}
                <div className="flex flex-col gap-[8px]">
                  <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dokument</FormLabel>
                  <FormField
                    control={form.control} 
                    name="documentPatient1"
                    render={({ field }) => (
                      <Tabs 
                        defaultValue={field.value} 
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
                        <TabsContent value="pesel">
                          <FormField
                            control={form.control}
                            name="peselPatient1"
                            render={({ field }) => (
                              <FormItem className="relative">
                                <FormControl {...field}>
                                  <Input 
                                    placeholder="Wpisz numer PESEL"
                                    className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-transparent"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                        <TabsContent 
                          value="paszport"
                          className="flex gap-[8px] w-full"
                        >
                          <FormField
                              control={form.control}
                              name="pazsportPatient1"
                              render={({ field }) => (
                                <FormItem className="basis-auto w-full">
                                  <FormControl {...field}>
                                    <Input 
                                      placeholder="Wpisz numer Paszportu"
                                      className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-transparent"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="dateOfBirthPatient1"
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
                                            {field.value ? format(field.value, "PPP") : (
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
                                      <PopoverContent>
                                        <Calendar 
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          className="bg-[#FEFEFE] border-[1px] border-[#112950] rounded-[6px]"
                                          classNames={{
                                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                            month: "space-y-4",
                                            caption: "flex justify-center pt-1 relative items-center",
                                            caption_label: "text-sm font-medium",
                                            caption_dropdowns: "flex justify-center gap-1",
                                            nav: "space-x-1 flex items-center",
                                            nav_button: cn(
                                              buttonVariants({ variant: "outline" }),
                                              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                            ),
                                            nav_button_previous: "absolute left-1",
                                            nav_button_next: "absolute right-1",
                                            table: "w-full border-collapse space-y-1",
                                            head_row: "flex",
                                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                            row: "flex w-full mt-2",
                                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                            day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
                                            day_selected:
                                              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                            day_today: "bg-accent text-accent-foreground",
                                            day_outside: "text-muted-foreground opacity-50",
                                            day_disabled: "text-muted-foreground opacity-50",
                                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                            day_hidden: "invisible",
                                            ...classNames,
                                          }}
                                          components={{
                                            CaptionLabel: () => (<></>),
                                            Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
                                              const options = React.Children.toArray(children) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[]
                                              const selected = options.find((child) => child.props.value === value)
                                              const handleChange = (value: string) => {
                                                const changeEvent = {
                                                  target: { value },
                                                } as React.ChangeEvent<HTMLSelectElement>
                                                onChange?.(changeEvent)
                                              }
                                              return (
                                                <Select
                                                  value={value?.toString()}
                                                  onValueChange={(value: string) => {
                                                    handleChange(value)
                                                  }}
                                                >
                                                  <SelectTrigger className="pr-1.5 focus:ring-0">
                                                    <SelectValue>{selected?.props?.children}</SelectValue>
                                                  </SelectTrigger>
                                                  <SelectContent position="popper">
                                                    <ScrollArea className="h-80">
                                                      {options.map((option, id: number) => (
                                                        <SelectItem key={`${option.props.value}-${id}`} value={option.props.value?.toString() ?? ""}>
                                                          {option.props.children}
                                                        </SelectItem>
                                                      ))}
                                                    </ScrollArea>
                                                  </SelectContent>
                                                </Select>
                                              )
                                            },
                                            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                                            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                                          }}
                                          captionLayout="dropdown-buttons"
                                          fromYear={new Date().getFullYear() - 100}
                                          toYear={new Date().getFullYear()}
                                          disabled={[(date: string | number | Date) => new Date(date) > new Date()]}
                                          weekStartsOn={1}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                        </TabsContent>
                      </Tabs>
                    )}
                  />
                </div>

                {/* dane adresowe */}
                {!i && (
                  <>
                    <div className="flex flex-col gap-[8px]">
                      <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dane adresowe</FormLabel>

                      <FormField
                        control={form.control}
                        name="countryOfPatient1"
                        render={({ field }) => (
                          <FormItem>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                                  <SelectValue placeholder="Kraj"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Polska">Polska</SelectItem>
                                <SelectItem value="Niemcy">Niemcy</SelectItem>
                                <SelectItem value="Ukraina">Ukraina</SelectItem>
                                <SelectItem value="Wielka Brytania">Wielka Brytania</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-[16px]">
                        <FormField
                          control={form.control}
                          name="streetOfPatient1"
                          render={({ field }) => (
                            <FormItem className="flex grow">
                                <FormControl {...field}>
                                  <Input 
                                    className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 
                                    focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Ulica"
                                  />
                                </FormControl>
                            </FormItem>
                          )}
                        />                
                        <FormField
                          control={form.control}
                          name="houseNumberOfPatient1"
                          render={({ field }) => (
                            <FormItem>
                                <FormControl {...field}>
                                  <Input 
                                    className="px-0 pt-[8px] w-[201px] pb-[6px] border-0 border-b-2 rounded-none 
                                    focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0" 
                                    placeholder="Nr lokalu"
                                  />
                                </FormControl>
                            </FormItem>
                          )}
                        /> 
                      </div>
                    </div>

                    {/* addVisitAdress */}
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

                    {/* dane adresowe wizyty */}
                    {form.watch('addVisitAdress') && (
                      <div className="flex flex-col gap-[8px]">
                        <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">Dane adresowe do wizyty</FormLabel>

                        <FormField
                          control={form.control}
                          name="visitAdressCountry"
                          render={({ field }) => (
                            <FormItem>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 focus:ring-transparent text-[#6D7178]">
                                    <SelectValue placeholder="Kraj"/>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Polska">Polska</SelectItem>
                                  <SelectItem value="Niemcy">Niemcy</SelectItem>
                                  <SelectItem value="Ukraina">Ukraina</SelectItem>
                                  <SelectItem value="Wielka Brytania">Wielka Brytania</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-[16px]">
                          <FormField
                            control={form.control}
                            name="visitAdressStreet"
                            render={({ field }) => (
                              <FormItem className="flex grow">
                                  <FormControl {...field}>
                                    <Input 
                                      className="px-0 pt-[8px] pb-[6px] border-0 border-b-2 rounded-none focus:ring-0 
                                      focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0"
                                      placeholder="Ulica"
                                    />
                                  </FormControl>
                              </FormItem>
                            )}
                          />    

                          <FormField
                            control={form.control}
                            name="visitAdressNumberOfHouse"
                            render={({ field }) => (
                              <FormItem>
                                  <FormControl {...field}>
                                    <Input 
                                      className="px-0 pt-[8px] w-[201px] pb-[6px] border-0 border-b-2 rounded-none 
                                      focus:ring-0 focus:ring-transparent text-[#6D7178] focus-visible:ring-0 focus-visible:ring-offset-0" 
                                      placeholder="Nr lokalu"
                                    />
                                  </FormControl>
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
              className="flex items-center justify-center gap-[8px] mt-[4px] w-full h-[48px] rounded-[8px] border-[1px] border-[#2E85FF] bg-[#FEFEFE] font-medium text-[16px] text-[#0068FA] leading-[24px]"
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

      <div className="col-start-2 col-end-3">
      </div>
    </div>
  )
}

type controlType = Control<{
    visitNumber: string;
    visitType: string;
    specialization: string;
    dateOfVisit: Date;
    topicOfVisit: string;
    langOfVisit: string;
    patient1AgeIsAdult: boolean;
    nameOfPatient1: string;
    surnameOfPatient1: string;
    documentPatient1: string;
    peselPatient1: number;
    pazsportPatient1: string;
    dateOfBirthPatient1: Date;
    countryOfPatient1: string;
    streetOfPatient1: string;
    houseNumberOfPatient1: string;
    visitAdressCountry: string;
    visitAdressStreet: string;
    visitAdressNumberOfHouse: string;
    addVisitAdress?: boolean | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}, any>

type nameType = "visitNumber" | "visitType" | "specialization" | "dateOfVisit" | "topicOfVisit" | "langOfVisit" | "patient1AgeIsAdult" | "nameOfPatient1" | "surnameOfPatient1" | "documentPatient1" | "peselPatient1" | "dateOfBirthPatient1" | "countryOfPatient1" | "streetOfPatient1" | "houseNumberOfPatient1" | "visitAdressCountry" | "visitAdressStreet" | "visitAdressNumberOfHouse" | "addVisitAdress";

type Props = {
  options: string[],
  name: nameType,
  control: controlType,
  title: string,
  inputMessage: string,
  noFoundAnswer: string,
}

function SearchInputWithDropdown({ 
  options, 
  control,
  name,
  title,
  inputMessage,
  noFoundAnswer,
}: Props) {
  return (
    <FormField 
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-[8px] space-y-0 w-full">
          <FormLabel className="font-bold text-[16px] text-[#112950] leading-[24px]">{title}</FormLabel>
          <Popover>
            <PopoverTrigger asChild className="w-full">
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
                    : "Wybierz z listy"}
                  <ChevronDown />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[635px] p-0">
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
                        onSelect={field.onChange}
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
        </FormItem>
      )}
    />
  )
}
