import { useQuery } from "react-query";
import axios from "axios";

const useFetch = (key, url) => {
  return useQuery(
    key,
    async () => {
      const { data } = await axios.get(url);
      return data;
    },
    {
      suspense: true, // Enable Suspense
    }
  );
};

export default useFetch;
