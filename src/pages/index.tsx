import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type Response = {
  data: Image[];
  after: string;
};

export default function Home(): JSX.Element {
  // fetchRequestPages function is used to api call to params pageParam
  async function fetchRequestPages({ pageParam = null }): Promise<Response> {
    const response = await api.get('/api/images', {
      params: { after: pageParam },
    });
    return response.data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchRequestPages, {
    getNextPageParam: (lastPage: Response) => lastPage.after,
  });

  const formattedData = useMemo(() => {
    return data ? data.pages.map(page => page.data).flat() : [];
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            loadingText="Loading more..."
            variant="outline"
            size="lg"
            mt={20}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
