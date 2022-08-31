import request from "@/utils/axios.js";
export function getOrders(obj) {
  return request({
    url: "orders",
    methed: "get",
    params: obj
  })
}