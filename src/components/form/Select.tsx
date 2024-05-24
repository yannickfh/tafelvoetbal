import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { FC } from 'react';
import * as ArkSelect from '~/components/ui/select';

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}
interface SelectProps extends ArkSelect.RootProps {
    items: SelectOption[];
    label: string;
    placeholder?: string;
}

const Select: FC<SelectProps> = ({
    onValueChange,
    onBlur,
    name,
    label,
    items,
    placeholder,
    isItemDisabled,
}) => {
    return (
        <ArkSelect.Root
            name={name}
            onValueChange={onValueChange}
            onBlur={onBlur}
            items={items}
            multiple={false}
            isItemDisabled={isItemDisabled}
        >
            <ArkSelect.Label>{label}</ArkSelect.Label>
            <ArkSelect.Control>
                <ArkSelect.Trigger>
                    <ArkSelect.ValueText placeholder={placeholder} />
                    <ChevronsUpDownIcon />
                </ArkSelect.Trigger>
            </ArkSelect.Control>
            <ArkSelect.Positioner>
                <ArkSelect.Content>
                    {items.map((item) => {
                        return (
                            <ArkSelect.Item key={item.value} item={item}>
                                <ArkSelect.ItemText>
                                    {item.label}
                                </ArkSelect.ItemText>
                                <ArkSelect.ItemIndicator>
                                    <CheckIcon />
                                </ArkSelect.ItemIndicator>
                            </ArkSelect.Item>
                        );
                    })}
                </ArkSelect.Content>
            </ArkSelect.Positioner>
        </ArkSelect.Root>
    );
};

Select.displayName = 'Select';

export default Select;
