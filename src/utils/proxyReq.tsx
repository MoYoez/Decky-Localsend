import { callable } from "@decky/api";

const proxyGet = callable<[string], any>("proxy_get");
const proxyPost = callable<[string, any?, any?], any>("proxy_post");
const proxyDelete = callable<[string], any>("proxy_delete");

export { proxyGet, proxyPost, proxyDelete };