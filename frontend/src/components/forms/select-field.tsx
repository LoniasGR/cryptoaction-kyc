import { Field, FieldLabel } from "@/components/ui/field";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useFieldContext } from "@/forms/form-context";

export function SelectField({ id, items, label, defaultValue }: { defaultValue?: string, id?: string, items: readonly string[] | string, label: string }) {
    const field = useFieldContext<string>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    const inputId = id || label.replace(/\s+/g, "-").toLowerCase();

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
            <Select defaultValue={defaultValue} disabled={Array.isArray(items) ? items.length <= 1 : !items}>
                <SelectTrigger className="w-full" id={inputId}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {(Array.isArray(items) ? items : [items]).map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    );
}