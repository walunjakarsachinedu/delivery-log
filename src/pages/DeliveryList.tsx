import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Button,
  Input,
  Badge,
  Text,
  Spinner,
  Wrap,
  InputGroup,
  Container,
  Image,
  ButtonGroup,
} from '@chakra-ui/react';
import { Filter, IndianRupee, Search, Plus, Package, MapPin, Dot, Calendar, Icon } from "lucide-react";
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';

const statusColors: Record<DeliveryStatus, string> = {
  'pending': 'yellow',
  'in-transit': 'blue',
  'completed': 'green',
  'returned': 'red',
};

// const FALLBACK_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

export default function DeliveryList() {
  const navigate = useNavigate();
  const deliveries = useDeliveryStore(state => state.deliveries);
  const isLoading = useDeliveryStore(state => state.isLoading);
  const filters = useDeliveryStore(state => state.filters);
  const setFilters = useDeliveryStore(state => state.setFilters);
  
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
      centerContent
    >
      <VStack align="stretch" w="full">
      {/* Search Bar with Icons */}
      <InputGroup 
        startElement={<Search size={16} />} 
        endElement={<Filter size={16} onClick={() => navigate('/search')} cursor="pointer"/>}
      >
        <Input
          placeholder="Search deliveries..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          pl="2.5rem"
          pr="2.5rem"
        />
      </InputGroup>

      {/* Status Filter Tags */}
      <Box pt={1}>
        <Wrap gap={2}>
          {(['pending', 'in-transit', 'completed', 'returned'] as DeliveryStatus[]).map(
            (status) => (
              <Badge
                key={status}
                colorScheme={statusColors[status]}
                cursor="pointer"
                px={3}
                py={1}
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
      </Box>

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
                    src={delivery.photoUrl || "src/assets/broken-image.png"}
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

      <Button
        size="lg"
        colorScheme="green"
        onClick={() => navigate('/add')}
        position="fixed"
        // bottom={16}
        bottom={16}
        right={{ base: 8, md: 16 }}
        borderRadius="full"
        p={3}
        data-group
        transition="all 0.3s ease"
        className='group'
      >

        <HStack gap={0} alignItems="center" >
          <Plus />
          <Box
            maxW="0"
            overflow="hidden"
            opacity={0}
            transition="max-width 0.3s ease, opacity 0.3s ease, margin 0.3s ease"
            _groupHover={{ maxWidth: "120px", opacity: 1, marginLeft: 1 }}
          >
            <Text fontSize="sm" whiteSpace="nowrap">
              Add Delivery
            </Text>
          </Box>
        </HStack>
      </Button>
    </Container>
  );
}
