import { useContext } from "@nuxtjs/composition-api";
import Cookies from "universal-cookie";

export function useCookies() {
  const { ssrContext } = useContext();
  
  const cookies = new Cookies(
    ssrContext ? ssrContext.req.headers.cookie : null
  );

  function get(key: string) {
    return cookies.get(key);
  }

  function set(key: string, value: any) {
    return cookies.set(key, value, {
      path: "/"
    });
  }

  return {
    get,
    set
  };
}
