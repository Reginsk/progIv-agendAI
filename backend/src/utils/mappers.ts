// src/mappers/index.ts
type AnyObject = Record<string, any>

/**
 * Remove keys de um objeto (não muta o original).
 */
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

/**
 * Mapeia um usuário removendo campos sensíveis (senha por padrão).
 */
export const userMapper = (user: AnyObject | null | undefined, opts?: { hide?: string[] }) => {
  if (!user) return null
  const hide = opts?.hide ?? ['password']
  const mapped = omitKeys(user, hide)
  return mapped
}

/**
 * Mapeia um item — caso queira esconder algo do item, passe hide (por padrão nada).
 */
export const itemMapper = (item: AnyObject | null | undefined, opts?: { hide?: string[] }) => {
  if (!item) return null
  const hide = opts?.hide ?? []
  const mapped = omitKeys(item, hide)
  return mapped
}

/**
 * Mapeia um borrow: aplica userMapper e itemMapper nas relações, além de remover chaves do borrow se quiser.
 */
export const borrowMapper = (borrow: AnyObject | null | undefined, opts?: { hideBorrow?: string[], hideUser?: string[], hideItem?: string[] }) => {
  if (!borrow) return null

  const hideBorrow = opts?.hideBorrow ?? []
  const hideUser = opts?.hideUser ?? ['password']
  const hideItem = opts?.hideItem ?? []

  const bCopy: AnyObject = { ...borrow }

  // se existir relation user/item (TypeORM traz o objeto)
  if (bCopy.user) bCopy.user = userMapper(bCopy.user, { hide: hideUser })
  if (bCopy.item) bCopy.item = itemMapper(bCopy.item, { hide: hideItem })

  // remove campos do próprio borrow
  const cleaned = omitKeys(bCopy, hideBorrow)
  return cleaned
}

/**
 * Helper para mapear arrays
 */
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
