import {
  Box,
  Button,
  Container,
  Input,
  Stack,
  Text,
  Select,
  createListCollection,
  Portal,
  Theme,
  Field,
  FileUpload,
  InputGroup,
  CloseButton,
  DatePicker,
  parseDate,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDeliveryStore } from "../store/useDeliveryStore";
import type { Delivery, DeliveryStatus } from "../types/delivery";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, FileUp, QrCode } from "lucide-react";
import { IndianRupee, MapPin, Package } from "lucide-react";

const defaultForm: Omit<Delivery, "id"> = {
  photoUrl: null,
  customerName: "",
  cost: 0,
  materialName: "",
  siteName: "",
  trackingNumber: "",
  courierName: "",
  dispatchDate: "",
  status: "pending",
};

export default function DeliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    deliveries,
    addDelivery,
    updateDelivery,
    isLoading,
  } = useDeliveryStore();

  const [form, setForm] = useState<Omit<Delivery, "id">>(() => {
    if (id) {
      const delivery = deliveries.find((d) => d.id === id);
      if (delivery) {
        const { id: _id, ...rest } = delivery;
        return rest;
      }
    }
    return defaultForm;
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEdit = Boolean(id);

  const handleChange = (key: keyof typeof form, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (isEdit && id) {
      await updateDelivery(id, form, imageFile);
    } else {
      await addDelivery(form, imageFile);
    }
    navigate("/");
  };

  const statusCollection = createListCollection({
    items: [
      { label: "Pending", value: "pending" },
      { label: "In Transit", value: "in-transit" },
      { label: "Completed", value: "completed" },
      { label: "Returned", value: "returned" },
    ],
  });

  return (
    <Container maxW={{ base: "full", md: "3xl" }} py={4} px={0}>
      <Button variant={"plain"} pb={6} onClick={() => navigate("/")}>
        <ArrowLeft /> Back to home
      </Button>

      <Box
        bg="gray.900"
        p={6}
        rounded="xl"
        borderWidth="1px"
        borderColor="gray.700"
      >
        <Stack gap={6}>
          <Text fontSize="xl">
            {isEdit ? "Edit delivery" : "Add delivery"}
          </Text>

          <Field.Root>
            <Field.Label>Customer name</Field.Label>
            <Input
              value={form.customerName}
              onChange={(e) =>
                handleChange("customerName", e.target.value)
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Material</Field.Label>
            <InputGroup endElement={<Package size={16} />}>
              <Input
                value={form.materialName}
                onChange={(e) =>
                  handleChange("materialName", e.target.value)
                }
              />
            </InputGroup>
          </Field.Root>

          <Field.Root>
            <Field.Label>Site</Field.Label>
            <InputGroup endElement={<MapPin size={16} />}>
              <Input
                value={form.siteName}
                onChange={(e) =>
                  handleChange("siteName", e.target.value)
                }
              />
            </InputGroup>
          </Field.Root>

          <Field.Root>
            <Field.Label>Courier</Field.Label>
            <Input
              value={form.courierName}
              onChange={(e) =>
                handleChange("courierName", e.target.value)
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Tracking number</Field.Label>
            <InputGroup endElement={<QrCode size={16} />}>
              <Input
                value={form.trackingNumber}
                onChange={(e) =>
                  handleChange("trackingNumber", e.target.value)
                }
              />
            </InputGroup>
          </Field.Root>

          <Field.Root>
            <Field.Label>Cost</Field.Label>
            <InputGroup endElement={<IndianRupee size={16} />}>
              <Input
                type="number"
                value={form.cost}
                onChange={(e) =>
                  handleChange("cost", Number(e.target.value))
                }
              />
            </InputGroup>
          </Field.Root>
          <DatePicker.Root
            value={
              form.dispatchDate
                ? [
                  (() => {
                    const d = new Date(form.dispatchDate)
                    const y = d.getFullYear()
                    const m = String(d.getMonth() + 1).padStart(2, "0")
                    const day = String(d.getDate()).padStart(2, "0")
                    return parseDate(`${y}-${m}-${day}`)
                  })(),
                ]
                : []
            }
            onValueChange={(details) => {
              const dateObj = details.value?.[0]
              if (dateObj) {
                const iso = new Date(
                  dateObj.year,
                  dateObj.month - 1,
                  dateObj.day
                ).toISOString()

                handleChange("dispatchDate", iso)
              }
            }}
          >
            <DatePicker.Label>Dispatch date</DatePicker.Label>

            <DatePicker.Control>
              <DatePicker.Trigger asChild>
                <DatePicker.Input
                  style={{
                    height: "40px",
                    padding: "0 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    color: '#fafafa',
                    textAlign: "start",
                    cursor: "pointer"
                  }}
                />
              </DatePicker.Trigger>

              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger>
                  <Calendar cursor="pointer" />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>

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
          <Field.Root>
            <Field.Label>Status</Field.Label>

            <Select.Root
              collection={statusCollection}
              value={[form.status]}
              onValueChange={(details) =>
                handleChange(
                  "status",
                  details.value[0] as DeliveryStatus
                )
              }
              size="sm"
            >
              <Select.HiddenSelect />

              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select status" />
                </Select.Trigger>

                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>

              <Portal>
                <Theme appearance="dark">
                  <Select.Positioner>
                    <Select.Content>
                      {statusCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Theme>
              </Portal>
            </Select.Root>
          </Field.Root>

          {/* TODO: Un-comment this once image upload feature added. */}
          {/* <FileUpload.Root gap="1">
            <FileUpload.HiddenInput />
            <FileUpload.Label mb={1}>Upload delivery package photo</FileUpload.Label>
            <InputGroup
              endElement={
                <>
                  <FileUp size={16} />
                  <FileUpload.ClearTrigger asChild>
                    <CloseButton
                      me="-1"
                      size="xs"
                      variant="plain"
                      focusVisibleRing="inside"
                      focusRingWidth="2px"
                      pointerEvents="auto"
                    />
                  </FileUpload.ClearTrigger>
                </>
              }
            >
              <Input asChild>
                <FileUpload.Trigger>
                  <FileUpload.FileText lineClamp={1} />
                </FileUpload.Trigger>
              </Input>
            </InputGroup>
          </FileUpload.Root> */}

          <Button
            onClick={handleSubmit}
            loading={isLoading}
            colorPalette="blue"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}