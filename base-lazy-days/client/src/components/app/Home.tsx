import { Icon, Stack, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { GiFlowerPot } from 'react-icons/gi';

import { BackgroundImage } from '../common/BackgroundImage';
import { usePreFetchTreatments } from '../treatments/hooks/useTreatments';

export function Home(): ReactElement {
  // 렌더기 많지 않아서 걱정 할 필요가 없다
  usePreFetchTreatments();
  return (
    <Stack textAlign="center" justify="center" height="84vh">
      <BackgroundImage />
      <Text textAlign="center" fontFamily="Forum, sans-serif" fontSize="6em">
        <Icon m={4} verticalAlign="top" as={GiFlowerPot} />
        Lazy Days Spa
      </Text>
      <Text>Hours: limited</Text>
      <Text>Address: nearby</Text>
    </Stack>
  );
}
