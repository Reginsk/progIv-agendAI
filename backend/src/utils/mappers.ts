type AnyObject = Record<string, any>


export const omitKeys = <T extends AnyObject>(obj: T | null | undefined, keys: (keyof T)[]): Partial<T> | null => {
  if (!obj) return null
  const copy: Partial<T> = { ...obj }
  keys.forEach(k => {
    if (k in copy) {
      // @ts-ignore
      delete copy[k]
    }
  })
  return copy
}

export const userMapper = (user: AnyObject | null | undefined, opts?: { hide?: string[] }) => {
  if (!user) return null
  const hide = opts?.hide ?? ['password']
  const mapped = omitKeys(user, hide)
  return mapped
}

export const itemMapper = (item: AnyObject | null | undefined, opts?: { hide?: string[] }) => {
  if (!item) return null
  const hide = opts?.hide ?? []
  const mapped = omitKeys(item, hide)
  return mapped
}

export const borrowMapper = (borrow: AnyObject | null | undefined, opts?: { hideBorrow?: string[], hideUser?: string[], hideItem?: string[] }) => {
  if (!borrow) return null

  const hideBorrow = opts?.hideBorrow ?? []
  const hideUser = opts?.hideUser ?? ['password']
  const hideItem = opts?.hideItem ?? []

  const bCopy: AnyObject = { ...borrow }

  if (bCopy.user) bCopy.user = userMapper(bCopy.user, { hide: hideUser })
  if (bCopy.item) bCopy.item = itemMapper(bCopy.item, { hide: hideItem })

  const cleaned = omitKeys(bCopy, hideBorrow)
  return cleaned
}

export const mapArray = <T, R>(arr: T[] | undefined | null, fn: (x: T) => R) => {
  if (!arr) return []
  return arr.map(fn)
}

export default {
  omitKeys,
  userMapper,
  itemMapper,
  borrowMapper,
  mapArray,
}
