import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/demo/table/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/demo/table',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/demo/table/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/demo/table',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/demo/table',
    method: 'put',
    data: obj
  })
}

