import { useState } from "react";

function useApi(apiFunc) {
  const [data, setData] = useState(null);

  const request = async (...args) => {
    try {
      const res = await apiFunc(...args);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return { data, request };
}

export default useApi;   