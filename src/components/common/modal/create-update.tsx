import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, Path, UseFormReturn } from "react-hook-form";

import { DatePicker } from "@/components/ui/date-picker";
import { FieldValues } from "react-hook-form";
import { MultiSelect } from "../../ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export interface IFormField {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "date"
    | "datetime"
    | "number"
    | "select"
    | "multi-select"
    | "file";
  defaultValue?: string | number | Date;
  blockDatesAfterToday?: boolean | false;
  blockDatesBeforeToday?: boolean | false;
  triggerToDisableField?: string;
  disabledByField?: string;
  fieldToBeDisabled?: string;
  options?: IOptionsFormField[];
}

export interface IOptionsFormField {
  label: string;
  value: string;
  uuidsRelation?: string[];
}

export interface CreateUpdateFormProps<T extends FieldValues> {
  title: string;
  fields: IFormField[];
  form: UseFormReturn<T>;
  onSubmit: (data: Partial<T>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUpdateForm<T extends FieldValues>({
  title,
  fields,
  form,
  onSubmit,
  isOpen,
  onClose,
}: CreateUpdateFormProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        className="w-[90vw] max-w-md p-4 sm:p-6"
        aria-describedby={undefined}
        aria-description="Create or update a resource"
      >
        <DialogHeader>
          <DialogTitle>
            {title}
            {/* {isEditable
              ? `Update ${title}`
              : title == "Filters"
                ? title
                : `Create ${title}`} */}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {fields.map((fieldInput) => (
                <FormField
                  key={fieldInput.name}
                  control={form.control}
                  name={fieldInput.name as Path<T>}
                  render={({ field, fieldState }) => {
                    let disabledByFieldValue = "";
                    
                    if (fieldInput.disabledByField) {
                      disabledByFieldValue =
                        fieldInput.disabledByField &&
                        form.getValues(fieldInput.disabledByField as Path<T>);
                      }

                    let isDisabled =
                      (field.name == fieldInput.fieldToBeDisabled) &&
                      (!disabledByFieldValue);

                    const filteredOptions =
                      fieldInput.disabledByField !== "" && disabledByFieldValue
                        ? fieldInput.options?.filter((option) =>
                            option.uuidsRelation?.includes(disabledByFieldValue)
                          )
                        : fieldInput.options;

                    return (
                      <FormItem className="col-span-1">
                        <FormLabel
                          className={
                            fieldState?.error?.message && "text-red-500"
                          }
                        >
                          {fieldInput.label}
                        </FormLabel>

                        {fieldInput.type === "text" && (
                          <FormControl>
                            <Input
                              placeholder={`Type your ${field.name}`}
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                        )}

                        {fieldInput.type === "email" && (
                          <FormControl>
                            <Input
                              placeholder={`Type your ${field.name}`}
                              {...field}
                              className="w-full"
                              type="email"
                            />
                          </FormControl>
                        )}

                        {fieldInput.type === "date" && (
                          <FormControl>
                            <DatePicker
                              key={form.watch(field.name)}
                              date={
                                field.value ? new Date(field.value) : undefined
                              }
                              setDate={(date) => {
                                if (date) {
                                  field.onChange(date);
                                }
                              }}
                              disabled={(date) => {
                                if (fieldInput.blockDatesAfterToday) {
                                  return date > new Date();
                                }
                                if (fieldInput.blockDatesBeforeToday) {
                                  return new Date() > date;
                                }
                                return false;
                              }}
                            />
                          </FormControl>
                        )}

                        {fieldInput.type === "datetime" && (
                          <FormControl>
                            <DateTimePicker
                              key={form.watch(field.name)}
                              date={
                                field.value ? new Date(field.value) : undefined
                              }
                              setDate={(date) => {
                                if (date) {
                                  field.onChange(date);
                                }
                              }}
                            ></DateTimePicker>
                          </FormControl>
                        )}

                        {fieldInput.type === "password" && (
                          <FormControl>
                            <Input
                              placeholder={`Type your ${field.name}`}
                              {...field}
                              className="w-full"
                              type="password"
                            />
                          </FormControl>
                        )}

                        {fieldInput.type === "file" && (
                          <Controller
                            name={"file" as Path<T>}
                            control={form.control}
                            render={({ field: { onChange, ref } }) => (
                              <FormControl>
                                <Input
                                  type="file"
                                  className="w-full"
                                  ref={ref} // ✅ Correctly handle ref
                                  onChange={(e) =>
                                    onChange(e.target.files?.[0] || null)
                                  } // ✅ Handle file change
                                />
                              </FormControl>
                            )}
                          />
                        )}

                        {fieldInput.type === "number" && (
                          <FormControl>
                            <Input
                              placeholder={`Type your ${field.name.replace("_", " ")}`}
                              {...field}
                              className="w-full"
                              type="number"
                            />
                          </FormControl>
                        )}

                        {fieldInput.type === "select" && (
                          <Select
                            key={form.watch(field.name)}
                            onValueChange={field.onChange}
                            defaultValue={form.getValues(field.name as Path<T>) as string || (fieldInput.defaultValue as string) }
                            disabled={isDisabled}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={`Select a ${fieldInput.label.toLowerCase()}`}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredOptions?.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {fieldInput.type === "multi-select" &&
                          fieldInput.options && (
                            <MultiSelect
                              key={form.watch(field.name)}
                              disabled={isDisabled}
                              options={filteredOptions || []}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              placeholder="Select options"
                              className="w-full"
                            />
                          )}

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}

              {/* Button spans full width on small screens and aligns right on larger screens */}
              <div className="col-span-1 sm:col-span-2 flex justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
