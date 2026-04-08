import { DatePicker, Portal, Theme } from "@chakra-ui/react"
import { Calendar } from "lucide-react"
import type { DateValue } from "@internationalized/date"

type DateRange = [DateValue | null, DateValue | null]

type Props = {
  value?: DateRange
  onChange?: (range: DateRange) => void
}

export default function DateRangePicker({ value, onChange }: Props) {
  return (
    <DatePicker.Root
      selectionMode="range"
      value={toChakra(value)}
      onValueChange={(details) => {
        onChange?.(fromChakra(details.value))
      }}
      w="fit-content"
      cursor="pointer"
    >
      <DatePicker.Context>
        {(ctx) => {
          const [start, end] = fromChakra(ctx.value)
          const formattedValue = format(start) == format(end) ? `${format(start)}` : `${format(start)} - ${format(end)}`;

          const hasValue = start && end

          return (
            <DatePicker.Control px="3" py="1" borderWidth="1px"
              borderRadius="md"
            >
              <DatePicker.Trigger
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  fontSize: "small",
                  cursor: "pointer"
                }}
              >
                <span>
                  {hasValue
                    ? formattedValue
                    // ? `${format(start)} - ${format(end)}`
                    : "Filter by date range"}
                </span>

                <Calendar width={10} style={{ marginLeft: 10 }} />
              </DatePicker.Trigger>
            </DatePicker.Control>
          )
        }}
      </DatePicker.Context>

      <Portal>
        <Theme appearance="dark">
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
        </DatePicker.Content>
        </DatePicker.Positioner>

        </Theme>
      </Portal>
    </DatePicker.Root>
  )
}


function format(date: DateValue | null) {
  if (!date) return ""
  return date.toDate("UTC").toLocaleDateString("en-GB")
}

// convert external -> chakra
function toChakra(value?: DateRange): DateValue[] | undefined {
  if (!value) return undefined
  return value.filter((v): v is DateValue => v !== null)
}

// convert chakra -> external
function fromChakra(value: DateValue[] | undefined): DateRange {
  if (!value || value.length === 0) return [null, null]
  if (value.length === 1) return [value[0], null]
  return [value[0], value[1]]
}