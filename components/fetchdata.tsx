import { useEffect } from "react";

type FetchDataProps = {
  sendData: (data: any) => void;
};

export default function FetchData({ sendData }: FetchDataProps): null {
  useEffect(() => {
    fetch('http://10.0.0.54:3000/Products')
      .then(res => res.json())
      .then(data => sendData(data))
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }, [sendData]);

  return null;
}
