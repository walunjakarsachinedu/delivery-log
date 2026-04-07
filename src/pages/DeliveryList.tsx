import DateRangePicker from '@/components/DateRangePicker';
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  Portal,
  Spinner,
  Text,
  Theme,
  VStack,
  Wrap
} from '@chakra-ui/react';
import { Calendar, Filter, IndianRupee, MapPin, Package, Plus, Search } from "lucide-react";
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';

const statusColors: Record<DeliveryStatus, string> = {
  'pending': 'yellow',
  'in-transit': 'blue',
  'completed': 'green',
  'returned': 'red',
};


export default function DeliveryList() {
  const navigate = useNavigate();
  const deliveries = useDeliveryStore(state => state.deliveries);
  const isLoading = useDeliveryStore(state => state.isLoading);
  const filters = useDeliveryStore(state => state.filters);
  const setFilters = useDeliveryStore(state => state.setFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchText, setSearchText] = useState(filters.globalSearch);
  const [selectedStatuses, setSelectedStatuses] = useState<DeliveryStatus[]>(filters.status);

  // Filter deliveries based on search text and status
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(delivery => {
      // Filter by search text
      if (searchText && !delivery.trackingNumber.toLowerCase().includes(searchText.toLowerCase()) &&
        !delivery.customerName.toLowerCase().includes(searchText.toLowerCase()) &&
        !delivery.siteName.toLowerCase().includes(searchText.toLowerCase()) &&
        !delivery.materialName.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(delivery.status)) {
        return false;
      }

      return true;
    });
  }, [deliveries, searchText, selectedStatuses]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setFilters({ globalSearch: text });
  };

  const toggleStatusFilter = (status: DeliveryStatus) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(updated);
    setFilters({ status: updated });
  };

  return (
    <Container
      maxW={{ base: 'full', md: '4xl', }}
      px={{ base: 0, md: 6, lg: 8 }}
      py={6}
      pt={0}
      centerContent
    >
      <VStack align="stretch" w="full">
        <HStack align={"center"} justifyContent={"space-between"} pb={4} >
          <Heading >Delivery log</Heading>
          <Button
            size="xs"
            colorScheme="green"
            onClick={() => navigate('/add')}
          // borderRadius="full"
          >

            <HStack gap={0} alignItems="center" >
              <Plus />
              <Box
              >
                <Text fontSize="sm" whiteSpace="nowrap">
                  Add Delivery
                </Text>
              </Box>
            </HStack>
          </Button>
        </HStack>
        {/* Search Bar with Icons */}
        <HStack>
          <InputGroup startElement={<Search size={16} />} >
            <Input
              placeholder="Search deliveries..."
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              pl="2.5rem"
              pr="2.5rem"
            />
          </InputGroup>
          <Button variant="surface" size="sm" display={{ base: 'flex', md: 'none' }} onClick={() => setIsFilterOpen(true)}>
            <Filter size={16} cursor="pointer" />
          </Button>
        </HStack>
        {/* Status Filter Tags */}
        <HStack pt={1} justifyContent="space-between" flexWrap={"wrap"} alignItems={'start'} display={{ base: 'none', md: 'flex' }}>
          <Wrap gap={2}>
            {(['pending', 'in-transit', 'completed', 'returned'] as DeliveryStatus[]).map(
              (status) => (
                <Badge
                  key={status}
                  colorScheme={statusColors[status]}
                  cursor="pointer"
                  px={3}
                  py={2}
                  size="sm"
                  borderColor={selectedStatuses.includes(status) ? 'whiteAlpha.600' : "whiteAlpha.200"}
                  borderWidth={1}
                  borderRadius={10}
                  onClick={() => toggleStatusFilter(status)}
                  _hover={{ backgroundColor: "whiteAlpha.100" }}
                  variant="outline"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              )
            )}
          </Wrap>
          <DateRangePicker></DateRangePicker>
        </HStack>

        {/* Deliveries List */}
        <Box pt={4}></Box>
        {isLoading ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner size="sm" />
          </Flex>
        ) : filteredDeliveries.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="sm" color="gray.500">
              No deliveries found
            </Text>
          </Box>
        ) : (
          <VStack gap={3} align="stretch">
            {filteredDeliveries.map((delivery) => (
              <Flex
                key={delivery.id}
                gap={3}
                p={3}
                borderWidth={1}
                // borderColor="gray.200"
                backgroundColor={"whiteAlpha.100"}
                borderRadius="md"
                _hover={{ borderColor: "whiteAlpha.400", boxShadow: 'md', cursor: 'pointer' }}
                onClick={() => navigate(`/delivery/${delivery.id}`)}
                align="stretch"
              >
                {/* Image on Left */}
                {
                  <Box width={"80px"} alignItems={"center"} display={"flex"} justifyContent={"center"}>
                    <Image
                      src={delivery.photoUrl || "/assets/broken-image.png"}
                      alt={`Delivery ${delivery.trackingNumber}`}
                      boxSize="40px"
                      objectFit="contain"
                      borderRadius="md"
                      flexShrink={0}
                      opacity={0.5}
                    />
                  </Box>
                }

                {/* Content */}
                <VStack gap={1} align="start" flex={1} justify="space-between">
                  {/* Tracking Number (Title) */}
                  <Text fontSize="sm" fontWeight="bold" fontFamily="monospace" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {delivery.trackingNumber}
                  </Text>

                  {/* Cost & Quantity Row */}
                  <HStack gap={4} fontSize="xs" align={"center"}>
                    <Text>
                      <IndianRupee size={12} style={{ display: 'inline', marginRight: 2 }} />{delivery.cost.toFixed(2)}
                    </Text>
                    <Text>
                      <Package size={12} style={{ display: 'inline', marginRight: 4 }} />{delivery.materialName}
                    </Text>
                  </HStack>

                  {/* Dispatch Date */}
                  <Text fontSize="xs" color="gray.400">
                    <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{new Date(delivery.dispatchDate).toLocaleDateString()}
                  </Text>

                  {/* Site Name */}
                  <Text fontSize="xs" color="gray.400">
                    <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{delivery.siteName}
                  </Text>

                </VStack>

                {/* Status Badge on Top Right */}
                <Flex align="flex-start">
                  <Badge
                    size="lg"
                    // backgroundColor={"whiteAlpha.100"}
                    borderWidth={1}
                    borderRadius={4}
                    borderColor={"whiteAlpha.200"}
                    colorScheme={statusColors[delivery.status]}
                    fontSize="10px"
                  >
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                  </Badge>
                </Flex>
              </Flex>
            ))}
          </VStack>
        )}
      </VStack>
      <Dialog.Root size="sm" placement="center" open={isFilterOpen} onOpenChange={(e) => setIsFilterOpen(e.open)}>

        <Portal>
          <Theme appearance="dark">
            <Dialog.Backdrop />

            <Dialog.Positioner>
              <Dialog.Content bg="gray.900" color="white" mx={4}>

                <Dialog.Header>
                  <Dialog.Title >Filters</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>

                  {/* status filters */}
                  <Text mb={2} fontWeight="bold">Filter by status</Text>
                  <Wrap gap={2}>
                    {(['pending', 'in-transit', 'completed', 'returned'] as DeliveryStatus[]).map(
                      (status) => (
                        <Badge
                          key={status}
                          colorScheme={statusColors[status]}
                          cursor="pointer"
                          px={3}
                          py={2}
                          size="sm"
                          borderColor={selectedStatuses.includes(status) ? 'whiteAlpha.600' : "whiteAlpha.200"}
                          borderWidth={1}
                          borderRadius={10}
                          onClick={() => toggleStatusFilter(status)}
                          _hover={{ backgroundColor: "whiteAlpha.100" }}
                          variant="outline"
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      )
                    )}
                  </Wrap>

                  {/* date filter */}
                  <Box mt={8}>
                    <Text mb={2} fontWeight="bold">Filter by date range</Text>
                    <DateRangePicker />
                  </Box>

                </Dialog.Body>

                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>

              </Dialog.Content>
            </Dialog.Positioner>
          </Theme>
        </Portal>

      </Dialog.Root>
    </Container>
  );
}
